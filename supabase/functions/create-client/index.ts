import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateClientRequest {
  email: string;
  password: string;
  companyName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  projectCode?: string;
  platformCode?: string;
  managerId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request is from an authenticated admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Check if calling user is an admin or manager
    const { data: { user: callingUser }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !callingUser) {
      throw new Error('Unauthorized: Could not verify user')
    }

    const { data: isAdminData } = await supabaseClient
      .rpc('is_admin', { _user_id: callingUser.id })

    const { data: isManagerData } = await supabaseClient
      .rpc('is_manager', { _user_id: callingUser.id })

    if (!isAdminData && !isManagerData) {
      throw new Error('Unauthorized: Only admins or managers can create clients')
    }

    // Get request body
    const body: CreateClientRequest = await req.json()
    const { 
      email, 
      password, 
      companyName, 
      phone, 
      address, 
      city, 
      state, 
      zip, 
      country,
      projectCode = 'E',
      platformCode = 'W',
      managerId
    } = body

    if (!email || !password || !companyName) {
      throw new Error('Email, password, and company name are required')
    }

    // If manager is calling, get their manager_id
    let finalManagerId = managerId || null
    if (isManagerData && !isAdminData) {
      // Manager creating client - must be assigned to themselves
      const { data: managerData } = await supabaseClient
        .from('managers')
        .select('id')
        .eq('user_id', callingUser.id)
        .single()
      
      if (managerData) {
        finalManagerId = managerData.id
      }
    }

    // Create admin client with service role
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

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some(u => u.email === email)
    if (userExists) {
      throw new Error(`User with email ${email} already exists`)
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        company_name: companyName,
      }
    })

    if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Failed to create user - no user returned')
    }

    const newUserId = authData.user.id

    // Assign 'user' role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUserId,
        role: 'user',
      })

    if (roleError) {
      console.error('Failed to assign role:', roleError)
    }

    // Generate client ID using database function
    const { data: clientIdData, error: clientIdError } = await supabaseAdmin
      .rpc('generate_client_id', {
        p_project_code: projectCode,
        p_platform_code: platformCode,
        p_country: country || 'IND'
      })

    let generatedClientId = null
    let clientSequence = null
    let yearHex = null

    if (!clientIdError && clientIdData && clientIdData.length > 0) {
      generatedClientId = clientIdData[0].client_id
      clientSequence = clientIdData[0].sequence_number
      yearHex = clientIdData[0].year_hex
    }

    // Create client record
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        user_id: newUserId,
        company_name: companyName,
        contact_email: email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        country: country || 'IND',
        client_id: generatedClientId,
        project_code: projectCode,
        platform_code: platformCode,
        year_hex: yearHex,
        client_sequence_number: clientSequence,
        manager_id: finalManagerId,
      } as any)
      .select()
      .single()

    if (clientError) {
      // Rollback: delete the created user
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
      throw new Error(`Failed to create client record: ${clientError.message}`)
    }

    // Create a default project for the client
    const { error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        client_id: clientData.id,
        title: `${companyName} - Main Project`,
        description: 'Initial project created with client',
        status: 'active',
        manager_id: finalManagerId,
      })

    if (projectError) {
      console.error('Failed to create default project:', projectError)
    }

    // Send welcome email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
    if (RESEND_API_KEY) {
      try {
        const loginUrl = `${req.headers.get('origin') || 'https://zervitra.com'}/login`
        
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Zervitra</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Zervitra</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello ${companyName},</p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Your account has been created successfully! Below are your login credentials:
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                  <p style="margin: 10px 0;"><strong>Client ID:</strong> ${generatedClientId || 'Will be assigned'}</p>
                  <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${password}</code></p>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #856404; font-size: 14px;">
                    <strong>⚠️ Security Notice:</strong> Please change your password after your first login.
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                    Login to Your Account
                  </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                  © ${new Date().getFullYear()} Zervitra. All rights reserved.
                </p>
              </div>
            </body>
          </html>
        `

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Zervitra <onboarding@resend.dev>",
            to: [email],
            subject: `Welcome to Zervitra - Your Account Credentials`,
            html: emailHtml,
          }),
        })

        if (!emailResponse.ok) {
          console.error('Failed to send welcome email:', await emailResponse.text())
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Client created successfully',
        clientId: generatedClientId,
        userId: newUserId,
        clientUuid: clientData.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Create client error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
