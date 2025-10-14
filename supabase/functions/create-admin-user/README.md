# Create Admin User Edge Function

This edge function creates the admin user `gs@gmail.com` with the password `Gnana@8179` and assigns the admin role.

## Usage

To run this function, you can call it from your browser console or use curl:

```bash
curl -X POST https://auhupuupxwxoxmcjxaxk.supabase.co/functions/v1/create-admin-user \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Or from browser console:
```javascript
fetch('https://auhupuupxwxoxmcjxaxk.supabase.co/functions/v1/create-admin-user', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1aHVwdXVweHd4b3htY2p4YXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MjI0NDUsImV4cCI6MjA3MjE5ODQ0NX0.UHj0j8dAbTD6kRinKC7M2dk18hSbQehr6OXRT1uh1Ec'
  }
}).then(r => r.json()).then(console.log)
```

## Features

- Creates admin user if doesn't exist
- Updates password if user already exists
- Automatically assigns admin role
- Handles conflicts gracefully
