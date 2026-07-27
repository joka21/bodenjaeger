/**
 * Lead-IDs für den Verlegeservice — Format `VS-2026-000184`.
 *
 * Die ID ist die Klammer über alle Systeme: Trello-Karte, Google-Conversion,
 * Meta-Event-ID und später die Rückmeldung qualifizierter/gewonnener Leads.
 * Sie muss deshalb eindeutig sein.
 *
 * Zähler: Vercel KV (`INCR` ist atomar, auch bei parallelen Anfragen).
 * Ohne KV — etwa lokal — greift ein zeitbasierter Ersatz. Der ist ebenfalls
 * eindeutig und sortierbar, aber nicht fortlaufend; erkennbar am Präfix `T`.
 */
import type { VercelKV } from '@vercel/kv'

const PREFIX = 'VS'
const KV_ZAEHLER_KEY = (jahr: number) => `verlegeservice:leadcounter:${jahr}`

const istKvVerfuegbar = () =>
  !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

let kv: VercelKV | null = null
async function getKv(): Promise<VercelKV | null> {
  if (!istKvVerfuegbar()) return null
  if (!kv) {
    try {
      const { kv: client } = await import('@vercel/kv')
      kv = client
    } catch (e) {
      console.warn('[leadId] Vercel KV nicht verfügbar:', e)
      return null
    }
  }
  return kv
}

/**
 * Zeitbasierter Ersatz ohne KV: Sekunden seit Jahresbeginn, auf 6 Stellen.
 * Kollidiert nur bei zwei Anfragen in derselben Sekunde — dafür sorgt der
 * angehängte Zufallsanteil.
 */
function ersatzId(jetzt: Date): string {
  const jahr = jetzt.getFullYear()
  const jahresbeginn = Date.UTC(jahr, 0, 1)
  const sekunden = Math.floor((jetzt.getTime() - jahresbeginn) / 1000)
  const zufall = Math.floor(Math.random() * 36).toString(36).toUpperCase()
  return `${PREFIX}-${jahr}-T${String(sekunden).padStart(7, '0')}${zufall}`
}

/**
 * Erzeugt die nächste Lead-ID. Wirft nicht — schlägt der Zähler fehl, kommt
 * die Ersatzform zurück, damit eine Anfrage nie an der ID scheitert.
 */
export async function naechsteLeadId(jetzt: Date = new Date()): Promise<string> {
  const jahr = jetzt.getFullYear()
  const client = await getKv()
  if (!client) return ersatzId(jetzt)

  try {
    const nummer = await client.incr(KV_ZAEHLER_KEY(jahr))
    return `${PREFIX}-${jahr}-${String(nummer).padStart(6, '0')}`
  } catch (e) {
    console.error('[leadId] KV incr fehlgeschlagen, nutze Ersatz-ID:', e)
    return ersatzId(jetzt)
  }
}
