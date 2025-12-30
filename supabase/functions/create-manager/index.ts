import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateManagerRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  region?: string;
  hireDate?: string;
  commissionPercent?: number;
  targetRevenue?: number;
  targetClients?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header to verify the caller is an admin
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !callerUser) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify caller is an admin
    const { data: callerRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', callerUser.id)
      .single()

    if (roleError || !callerRole || callerRole.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only admins can create manager accounts' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: CreateManagerRequest = await req.json()
    
    if (!body.name || !body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[create-manager] Admin creating new manager:', body.email)

    // 1. Create auth user using admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        name: body.name,
      },
    })

    if (authError) {
      const msg = String((authError as any)?.message ?? authError)
      const status = (authError as any)?.status
      const code = (authError as any)?.code

      console.log('[create-manager] createUser failed', { status, code, msg })

      const isEmailExists =
        status === 422 ||
        code === 'email_exists' ||
        /already been registered/i.test(msg) ||
        /email.*exists/i.test(msg)

      if (isEmailExists) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'A user with this email already exists' 
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      throw authError
    }

    console.log('[create-manager] Auth user created:', authData.user.id)

    // 2. Create manager role
    const { error: managerRoleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ 
        user_id: authData.user.id, 
        role: 'manager',
        created_by: callerUser.id
      })

    if (managerRoleError) {
      console.error('[create-manager] Failed to create role:', managerRoleError)
      // Cleanup: delete the auth user if role creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw managerRoleError
    }

    console.log('[create-manager] Manager role created')

    // 3. Create manager profile record
    const { data: managerData, error: managerError } = await supabaseAdmin
      .from('managers')
      .insert({
        user_id: authData.user.id,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        department: body.department || null,
        region: body.region || null,
        hire_date: body.hireDate || null,
        commission_percent: body.commissionPercent ?? 0,
        target_revenue: body.targetRevenue || null,
        target_clients: body.targetClients || null,
        created_by: callerUser.id,
        status: 'active'
      })
      .select()
      .single()

    if (managerError) {
      console.error('[create-manager] Failed to create manager record:', managerError)
      // Cleanup: delete role and auth user
      await supabaseAdmin.from('user_roles').delete().eq('user_id', authData.user.id)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw managerError
    }

    console.log('[create-manager] Manager record created:', managerData.id)

    // 4. Send welcome email with credentials
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Zervitra <noreply@zervitra.com>',
            to: body.email,
            subject: 'Welcome to Zervitra - Manager Account Created',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #6366f1;">Welcome to Zervitra!</h1>
                <p>Hello ${body.name},</p>
                <p>Your manager account has been created successfully. You can now log in to the Zervitra Manager Portal.</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Your Login Credentials</h3>
                  <p><strong>Email:</strong> ${body.email}</p>
                  <p><strong>Password:</strong> ${body.password}</p>
                  <p><strong>Login URL:</strong> <a href="https://zervitra.com/manager-zervii">https://zervitra.com/manager-zervii</a></p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px;">Please change your password after your first login for security purposes.</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px;">
                  This is an automated email from Zervitra. Please do not reply directly to this email.
                </p>
              </div>
            `
          })
        })

        if (!emailResponse.ok) {
          console.error('[create-manager] Failed to send welcome email:', await emailResponse.text())
        } else {
          console.log('[create-manager] Welcome email sent successfully')
        }
      } catch (emailError) {
        console.error('[create-manager] Email sending error:', emailError)
        // Don't fail the whole operation if email fails
      }
    } else {
      console.log('[create-manager] RESEND_API_KEY not configured, skipping welcome email')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Manager created successfully',
        manager_id: managerData.id,
        user_id: authData.user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[create-manager] Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
