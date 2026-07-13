import { NextRequest, NextResponse } from 'next/server'
import { VERLEGE_FORM_ENABLED, VERLEGE_UPLOAD } from '@/content/verlegeservice'

interface Attachment {
  filename?: string
  mime?: string
  dataBase64?: string
}

interface AnfrageBody {
  // Pflicht
  name?: string
  telefon?: string
  email?: string
  plzOrt?: string
  bodenart?: string
  flaeche?: string
  projektart?: string
  wunschtermin?: string
  nachricht?: string
  // Optional
  adresseAufmass?: string
  raeume?: string[]
  bodenVorhanden?: string
  altbodenEntfernen?: string
  untergrundBekannt?: string
  wunschbodenAusgesucht?: string
  beratungImFachmarkt?: boolean
  marketing?: boolean
  // Technik
  attachments?: Attachment[]
  turnstileToken?: string
  website?: string
}

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Ungefähre Byte-Größe eines Base64-Strings (ohne dataURL-Präfix). */
function base64Bytes(b64: string): number {
  const len = b64.length
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0
  return Math.floor((len * 3) / 4) - padding
}

function ja(v?: string) {
  return v && v.trim() ? v : '—'
}

export async function POST(request: NextRequest) {
  // Formular ist erst nach WP-Endpoint-Deploy funktionsfähig (Feature-Flag).
  if (!VERLEGE_FORM_ENABLED) {
    return NextResponse.json(
      { success: false, error: 'Formular ist noch nicht freigeschaltet.' },
      { status: 503 },
    )
  }

  let body: AnfrageBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Ungueltiger Request-Body' }, { status: 400 })
  }

  // Honeypot
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ success: true })
  }

  // Pflichtfelder
  const required = [
    body.name, body.telefon, body.email, body.plzOrt, body.bodenart,
    body.flaeche, body.projektart, body.wunschtermin, body.nachricht,
  ]
  if (required.some((v) => !v || !String(v).trim())) {
    return NextResponse.json({ success: false, error: 'Pflichtfelder fehlen.' }, { status: 400 })
  }

  if (!body.turnstileToken) {
    return NextResponse.json({ success: false, error: 'Sicherheitscheck fehlt.' }, { status: 400 })
  }

  // Anhänge serverseitig prüfen (Anzahl / MIME / Größe)
  const attachments = Array.isArray(body.attachments) ? body.attachments : []
  if (attachments.length > VERLEGE_UPLOAD.maxFiles) {
    return NextResponse.json({ success: false, error: 'Zu viele Dateien (max. 5).' }, { status: 400 })
  }
  let totalBytes = 0
  for (const a of attachments) {
    if (!a.dataBase64 || !a.mime || !(VERLEGE_UPLOAD.acceptMime as readonly string[]).includes(a.mime)) {
      return NextResponse.json({ success: false, error: 'Nicht erlaubtes Dateiformat.' }, { status: 400 })
    }
    const bytes = base64Bytes(a.dataBase64)
    if (bytes > VERLEGE_UPLOAD.maxFileBytes) {
      return NextResponse.json({ success: false, error: 'Datei zu groß (max. 5 MB je Datei).' }, { status: 400 })
    }
    totalBytes += bytes
  }
  if (totalBytes > VERLEGE_UPLOAD.maxTotalBytes) {
    return NextResponse.json({ success: false, error: 'Dateien insgesamt zu groß (max. 15 MB).' }, { status: 400 })
  }

  // Turnstile verifizieren
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!turnstileSecret) {
    console.error('[api/verlegeservice-anfrage] TURNSTILE_SECRET_KEY fehlt')
    return NextResponse.json({ success: false, error: 'Server-Konfiguration unvollstaendig.' }, { status: 500 })
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
    console.error('[api/verlegeservice-anfrage] Turnstile verify error:', e)
    return NextResponse.json({ success: false, error: 'Sicherheitscheck nicht erreichbar.' }, { status: 502 })
  }

  // Strukturierten, lesbaren Mailtext bauen (der Vertrieb soll ohne Rückfragen arbeiten können)
  const message =
    `Neue Verlegeservice-Anfrage\n\n` +
    `— Kontakt —\n` +
    `Name: ${body.name}\nTelefon: ${body.telefon}\nE-Mail: ${body.email}\nPLZ / Ort: ${body.plzOrt}\n\n` +
    `— Projekt —\n` +
    `Gewünschte Bodenart: ${body.bodenart}\nGeschätzte Fläche (m²): ${body.flaeche}\n` +
    `Projektart: ${body.projektart}\nWunschtermin/Zeitraum: ${body.wunschtermin}\n\n` +
    `Nachricht:\n${body.nachricht}\n\n` +
    `— Weitere Angaben —\n` +
    `Adresse für Aufmaß: ${ja(body.adresseAufmass)}\n` +
    `Räume: ${body.raeume && body.raeume.length ? body.raeume.join(', ') : '—'}\n` +
    `Boden vorhanden: ${ja(body.bodenVorhanden)}\n` +
    `Altboden entfernen: ${ja(body.altbodenEntfernen)}\n` +
    `Untergrund bekannt: ${ja(body.untergrundBekannt)}\n` +
    `Wunschboden ausgesucht: ${ja(body.wunschbodenAusgesucht)}\n` +
    `Beratung im Fachmarkt gewünscht: ${body.beratungImFachmarkt ? 'Ja' : 'Nein'}\n` +
    `Unverbindliche Beratung erwünscht (Marketing): ${body.marketing ? 'Ja' : 'Nein'}\n` +
    `Anhänge: ${attachments.length}`

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL
  // Gleiches Shared Secret wie /contact — Endpoint ist aber ein eigener (verlegeservice).
  const sharedSecret = process.env.JAEGER_CONTACT_SECRET?.trim()
  if (!wpUrl || !sharedSecret) {
    console.error('[api/verlegeservice-anfrage] NEXT_PUBLIC_WORDPRESS_URL oder JAEGER_CONTACT_SECRET fehlt')
    return NextResponse.json({ success: false, error: 'Server-Konfiguration unvollstaendig.' }, { status: 500 })
  }

  try {
    const wpRes = await fetch(`${wpUrl}/wp-json/jaeger/v1/verlegeservice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Jaeger-Secret': sharedSecret },
      // Empfänger (verkauf@) wird SERVERSEITIG im WP festgelegt — hier NICHT übergeben.
      body: JSON.stringify({
        name: body.name,
        plzOrt: body.plzOrt,
        email: body.email,
        message,
        attachments: attachments.map((a) => ({ filename: a.filename ?? 'anhang', mime: a.mime, dataBase64: a.dataBase64 })),
      }),
    })

    if (!wpRes.ok) {
      const text = await wpRes.text().catch(() => '')
      console.error('[api/verlegeservice-anfrage] WordPress error:', wpRes.status, text)
      return NextResponse.json({ success: false, error: 'Anfrage konnte nicht zugestellt werden.' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[api/verlegeservice-anfrage] WordPress fetch error:', e)
    return NextResponse.json({ success: false, error: 'Anfrage konnte nicht zugestellt werden.' }, { status: 502 })
  }
}
