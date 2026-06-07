const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Require shared secret (service role key) to prevent public abuse.
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const authHeader = req.headers.get('authorization') || ''
  const cronSecret = req.headers.get('x-cron-secret') || ''
  const providedBearer = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : ''
  if (providedBearer !== SERVICE_ROLE && cronSecret !== SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured')

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured')

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

  try {
    // Get new projects from last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: newProjects } = await supabase
      .from('projects')
      .select('id,title,slug,summary,type,current_stage')
      .gte('created_at', weekAgo)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: openCalls } = await supabase
      .from('open_calls')
      .select('id,title,call_type,location_mode')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get opted-in users
    const { data: prefs } = await supabase
      .from('email_preferences')
      .select('user_id,language')
      .eq('weekly_digest', true)

    if (!prefs || prefs.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userIds = prefs.map(p => p.user_id)
    
    // Get user emails from auth (service role)
    const emailMap = new Map<string, string>()
    for (const uid of userIds) {
      const { data } = await supabase.auth.admin.getUserById(uid)
      if (data?.user?.email) emailMap.set(uid, data.user.email)
    }

    let sent = 0
    for (const pref of prefs) {
      const email = emailMap.get(pref.user_id)
      if (!email) continue

      const isTr = pref.language === 'tr'
      const subject = isTr ? 'Nur Combinator - Haftalık Özet' : 'Nur Combinator - Weekly Digest'
      
      const esc = (s: string) =>
        String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')

      const projectsHtml = (newProjects || []).map(p =>
        `<li><strong>${esc(p.title)}</strong> — ${esc(p.summary || '')}</li>`
      ).join('')

      const callsHtml = (openCalls || []).map(c =>
        `<li><strong>${esc(c.title)}</strong> (${esc(c.call_type)}, ${esc(c.location_mode)})</li>`
      ).join('')

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h1 style="color:#b8860b;font-size:24px">${isTr ? 'Haftalık Özet' : 'Weekly Digest'}</h1>
          
          <h2 style="font-size:18px;margin-top:24px">${isTr ? '🆕 Yeni Projeler' : '🆕 New Projects'}</h2>
          ${projectsHtml ? `<ul>${projectsHtml}</ul>` : `<p style="color:#666">${isTr ? 'Bu hafta yeni proje eklenmedi.' : 'No new projects this week.'}</p>`}
          
          <h2 style="font-size:18px;margin-top:24px">${isTr ? '📢 Açık Çağrılar' : '📢 Open Calls'}</h2>
          ${callsHtml ? `<ul>${callsHtml}</ul>` : `<p style="color:#666">${isTr ? 'Aktif açık çağrı yok.' : 'No active open calls.'}</p>`}
          
          <hr style="margin-top:32px;border:none;border-top:1px solid #eee"/>
          <p style="font-size:12px;color:#999">${isTr ? 'Bu e-postayı profil ayarlarınızdan kapatabilirsiniz.' : 'You can disable this email from your profile settings.'}</p>
        </div>
      `

      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: 'Nur Combinator <onboarding@resend.dev>',
          to: [email],
          subject,
          html,
        }),
      })

      if (res.ok) sent++
      else console.error(`Failed to send to ${email}:`, await res.text())
    }

    return new Response(JSON.stringify({ sent, total: prefs.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Weekly digest error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
