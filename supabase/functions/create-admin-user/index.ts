import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get the authorization header to verify the caller
    const authHeader = req.headers.get('authorization')
    
    // Parse request body for email and password
    let adminEmail: string | undefined
    let adminPassword: string | undefined
    
    try {
      const body = await req.json()
      adminEmail = body.email
      adminPassword = body.password
    } catch {
      // No body provided - this is an error now since we don't use hardcoded credentials
    }

    // If credentials are provided, verify the caller is a super admin
    if (adminEmail && adminPassword) {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization required to create admin accounts' }),
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

      // Verify caller is a super admin
      const { data: callerRole, error: roleError } = await supabaseAdmin
        .from('user_roles')
        .select('role, is_super_admin')
        .eq('user_id', callerUser.id)
        .single()

      if (roleError || !callerRole) {
        return new Response(
          JSON.stringify({ error: 'Unable to verify caller permissions' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (callerRole.role !== 'admin' || !callerRole.is_super_admin) {
        return new Response(
          JSON.stringify({ error: 'Only super admins can create new admin accounts' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('[create-admin-user] Super admin creating new admin:', adminEmail)
    } else {
      // No credentials provided - return error
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
      },
    })

    if (authError) {
      const msg = String((authError as any)?.message ?? authError)
      const status = (authError as any)?.status
      const code = (authError as any)?.code

      console.log('[create-admin-user] createUser failed', { status, code, msg })

      // If user already exists
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

    // Insert admin role for new user (not super admin by default)
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ 
        user_id: authData.user.id, 
        role: 'admin',
        is_super_admin: false
      })

    if (roleError) throw roleError

    console.log('[create-admin-user] Admin created successfully:', authData.user.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        user_id: authData.user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[create-admin-user] Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
