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

    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'gs@gmail.com',
      password: 'Gnana@8179',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User'
      }
    })

    if (authError) {
      // If user already exists, try to get the existing user
      if (authError.message.includes('already registered')) {
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        if (listError) throw listError
        
        const existingUser = users.find(u => u.email === 'gs@gmail.com')
        if (!existingUser) throw new Error('User exists but could not be found')

        // Update password for existing user
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { password: 'Gnana@8179' }
        )
        if (updateError) throw updateError

        // Insert admin role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert({ 
            user_id: existingUser.id, 
            role: 'admin' 
          }, { 
            onConflict: 'user_id,role',
            ignoreDuplicates: true 
          })

        if (roleError) throw roleError

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Admin user updated and role assigned',
            user_id: existingUser.id 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      throw authError
    }

    // Insert admin role for new user
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ 
        user_id: authData.user.id, 
        role: 'admin' 
      })

    if (roleError) throw roleError

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        user_id: authData.user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
