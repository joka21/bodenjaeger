import { NextRequest, NextResponse } from 'next/server'
import { VERLEGE_LEISTUNG_OPTIONEN } from '@/content/verlegeservice'

interface LeadBody {
  plzOrt?: string
  leistung?: string
  bodenart?: string
  flaeche?: string
  projektart?: string
  wunschtermin?: string
  raeume?: string[]
  name?: string
  telefon?: string
  email?: string
  nachricht?: string
  marketing?: boolean
  website?: string // Honeypot
  turnstileToken?: string
}

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TRELLO_CARDS_URL = 'https://api.trello.com/1/cards'

function val(v?: string) {
  return v && v.trim() ? v.trim() : '—'
}

export async function POST(request: NextRequest) {
  let body: LeadBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Ungueltiger Request-Body' }, { status: 400 })
  }

  // Honeypot — stiller Erfolg für Bots.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ success: true })
  }

  // Pflichtfelder
  const required = [body.name, body.telefon, body.email, body.plzOrt, body.bodenart, body.flaeche, body.projektart]
  if (required.some((v) => !v || !String(v).trim())) {
    return NextResponse.json({ success: false, error: 'Pflichtfelder fehlen.' }, { status: 400 })
  }

  // Serverseitige Requalifizierung — Client wird nie vertraut.
  const option = VERLEGE_LEISTUNG_OPTIONEN.find((o) => o.key === body.leistung)
  if (!option || !option.qualifiziert) {
    return NextResponse.json(
      { success: false, error: 'Diese Anfrage passt nicht zum Verlegeservice.' },
      { status: 422 },
    )
  }

  // Turnstile — verifizieren, sofern konfiguriert (in Prod Pflicht; lokal ohne Secret übersprungen).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (turnstileSecret) {
    if (!body.turnstileToken) {
      return NextResponse.json({ success: false, error: 'Sicherheitscheck fehlt.' }, { status: 400 })
    }
    const verifyParams = new URLSearchParams()
    verifyParams.append('secret', turnstileSecret)
    verifyParams.append('response', body.turnstileToken)
    const ipHeader = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || ''
    if (ipHeader) verifyParams.append('remoteip', ipHeader.split(',')[0].trim())
    try {
      const verifyRes = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: verifyParams })
      const verifyJson = (await verifyRes.json()) as TurnstileVerifyResponse
      if (!verifyJson.success) {
        return NextResponse.json({ success: false, error: 'Sicherheitscheck fehlgeschlagen.' }, { status: 400 })
      }
    } catch (e) {
      console.error('[api/verlegeservice-lead] Turnstile verify error:', e)
      return NextResponse.json({ success: false, error: 'Sicherheitscheck nicht erreichbar.' }, { status: 502 })
    }
  } else {
    console.warn('[api/verlegeservice-lead] TURNSTILE_SECRET_KEY fehlt — Verifizierung übersprungen.')
  }

  // Trello-Konfiguration
  const key = process.env.TRELLO_KEY?.trim()
  const token = process.env.TRELLO_TOKEN?.trim()
  const idList = process.env.TRELLO_LIST_ID?.trim()
  if (!key || !token || !idList) {
    console.error('[api/verlegeservice-lead] TRELLO_KEY/TRELLO_TOKEN/TRELLO_LIST_ID fehlt')
    return NextResponse.json({ success: false, error: 'Server-Konfiguration unvollstaendig.' }, { status: 500 })
  }

  const cardName = `Verlegeservice: ${body.name} – ${body.plzOrt} (${body.bodenart}, ${body.flaeche} m²)`
  const cardDesc =
    `**Neue Verlegeservice-Anfrage**\n\n` +
    `**Kontakt**\n` +
    `- Name: ${val(body.name)}\n` +
    `- Telefon: ${val(body.telefon)}\n` +
    `- E-Mail: ${val(body.email)}\n` +
    `- PLZ / Ort: ${val(body.plzOrt)}\n\n` +
    `**Projekt**\n` +
    `- Leistung: ${option.label}\n` +
    `- Bodenart: ${val(body.bodenart)}\n` +
    `- Fläche (m²): ${val(body.flaeche)}\n` +
    `- Projektart: ${val(body.projektart)}\n` +
    `- Wunschtermin: ${val(body.wunschtermin)}\n` +
    `- Räume: ${body.raeume && body.raeume.length ? body.raeume.join(', ') : '—'}\n\n` +
    `**Nachricht**\n${val(body.nachricht)}\n\n` +
    `Unverbindliche Beratung erwünscht: ${body.marketing ? 'Ja' : 'Nein'}`

  const cardParams = new URLSearchParams({
    idList,
    key,
    token,
    name: cardName,
    desc: cardDesc,
    pos: 'top',
  })

  try {
    const trelloRes = await fetch(`${TRELLO_CARDS_URL}?${cardParams.toString()}`, { method: 'POST' })
    if (!trelloRes.ok) {
      const text = await trelloRes.text().catch(() => '')
      console.error('[api/verlegeservice-lead] Trello error:', trelloRes.status, text)
      return NextResponse.json({ success: false, error: 'Anfrage konnte nicht zugestellt werden.' }, { status: 502 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[api/verlegeservice-lead] Trello fetch error:', e)
    return NextResponse.json({ success: false, error: 'Anfrage konnte nicht zugestellt werden.' }, { status: 502 })
  }
}
