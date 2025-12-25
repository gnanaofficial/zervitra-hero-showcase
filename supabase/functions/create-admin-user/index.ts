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
    const adminEmail = 'gs@gmail.com'
    const adminPassword = 'Gnana@8179'

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

      // If user already exists, update password + ensure role (idempotent)
      const isEmailExists =
        status === 422 ||
        code === 'email_exists' ||
        /already been registered/i.test(msg) ||
        /email.*exists/i.test(msg)

      if (isEmailExists) {
        // listUsers is paginated; scan a few pages to find the user
        let existingUser: any | null = null
        for (let page = 1; page <= 10; page++) {
          const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage: 200,
          })
          if (listError) throw listError

          existingUser = (data?.users ?? []).find((u) => u.email === adminEmail) ?? null
          if (existingUser) break

          if (!data?.users?.length) break
        }

        if (!existingUser) {
          throw new Error('User exists but could not be found via listUsers')
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password: adminPassword,
        })
        if (updateError) throw updateError

        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert(
            {
              user_id: existingUser.id,
              role: 'admin',
            },
            {
              onConflict: 'user_id,role',
              ignoreDuplicates: true,
            }
          )

        if (roleError) throw roleError

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Admin user already existed; password updated and role ensured',
            user_id: existingUser.id,
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

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
