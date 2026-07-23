'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { CheckCircle2, Phone, ArrowLeft, ArrowRight } from 'lucide-react'
import CtaButton from '@/components/shared/CtaButton'
import {
  VERLEGE_ANFRAGE,
  VERLEGE_ANFRAGE_PLZ_ERLAUBT,
  VERLEGE_ANFRAGE_FLAECHE_MIN,
  VERLEGE_FORM,
  type VerlegeLeistungKey,
} from '@/content/verlegeservice'

type Status = 'idle' | 'sending' | 'success' | 'error'
type Disqualified = Extract<VerlegeLeistungKey, 'material' | 'selbst'>

const inputCls =
  'w-full rounded-lg border border-ash bg-white px-4 py-3 text-dark outline-none focus:border-brand'
const labelCls = 'mb-1.5 block text-sm font-bold text-dark'

/** Mehrstufiger Anfrage-Funnel mit Vorqualifizierung. Qualifizierte Leads → /api/verlegeservice-lead → Trello. */
export default function AnfrageFunnel() {
  const A = VERLEGE_ANFRAGE
  const L = VERLEGE_FORM.labels

  const [step, setStep] = useState(1) // 1..4
  const [disqualified, setDisqualified] = useState<Disqualified | null>(null)

  // Felder
  const [plz, setPlz] = useState('')
  const [ort, setOrt] = useState('')
  const [leistung, setLeistung] = useState<VerlegeLeistungKey | ''>('')
  const [bodenart, setBodenart] = useState('')
  const [flaeche, setFlaeche] = useState('')
  const [projektart, setProjektart] = useState('')
  const [wunschtermin, setWunschtermin] = useState('')
  const [raeume, setRaeume] = useState<string[]>([])
  const [name, setName] = useState('')
  const [telefon, setTelefon] = useState('')
  const [email, setEmail] = useState('')
  const [nachricht, setNachricht] = useState('')
  const [marketing, setMarketing] = useState(false)
  const [datenschutz, setDatenschutz] = useState(false)
  const [website, setWebsite] = useState('') // Honeypot

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  const siteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '').trim()

  const plzWarnung = useMemo(() => {
    const p = plz.trim()
    if (p.length < 2) return false
    return !(VERLEGE_ANFRAGE_PLZ_ERLAUBT as readonly string[]).some((prefix) => p.startsWith(prefix))
  }, [plz])

  const flaecheKlein = useMemo(() => {
    const n = parseInt(flaeche, 10)
    return !Number.isNaN(n) && n > 0 && n < VERLEGE_ANFRAGE_FLAECHE_MIN
  }, [flaeche])

  const toggleRaum = (raum: string) =>
    setRaeume((r) => (r.includes(raum) ? r.filter((x) => x !== raum) : [...r, raum]))

  const chooseLeistung = (key: VerlegeLeistungKey, qualifiziert: boolean) => {
    setLeistung(key)
    if (!qualifiziert) {
      setDisqualified(key as Disqualified)
    } else {
      setDisqualified(null)
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!datenschutz) {
      setErrorMsg('Bitte bestätige die Datenschutzerklärung.')
      return
    }
    if (siteKey && !turnstileToken) {
      setErrorMsg('Bitte den Sicherheitscheck abschließen.')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/verlegeservice-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plzOrt: `${plz.trim()} ${ort.trim()}`.trim(),
          leistung,
          bodenart,
          flaeche,
          projektart,
          wunschtermin,
          raeume,
          name,
          telefon,
          email,
          nachricht,
          marketing,
          website,
          turnstileToken,
        }),
      })
      const json = await res.json().catch(() => ({ success: false }))
      if (!res.ok || !json.success) throw new Error(json.error || 'error')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(A.errorText)
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  // ── Erfolg ──────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <Card>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h2 className="mt-4 text-2xl font-bold text-dark">{A.successHeadline}</h2>
          <p className="mt-3 text-mid">{A.successText}</p>
        </div>
      </Card>
    )
  }

  // ── Freundlicher Stopp (disqualifiziert) ─────────────────────────────────────
  if (disqualified) {
    const s = A.stopp[disqualified]
    return (
      <Card>
        <h2 className="text-2xl font-bold text-dark">{s.headline}</h2>
        <p className="mt-3 text-mid">{s.text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {A.alternativen.map((cta) => (
            <CtaButton key={cta.href} cta={cta} />
          ))}
        </div>
        <a href={A.telefonLink} className="mt-6 inline-flex items-center gap-2 font-bold text-dark hover:text-brand">
          <Phone className="h-5 w-5 text-brand" />
          {A.telefonHinweis}
        </a>
        <button
          type="button"
          onClick={() => { setDisqualified(null); setLeistung(''); setStep(2) }}
          className="mt-8 block text-sm font-medium text-mid underline hover:text-brand"
        >
          Auswahl ändern
        </button>
      </Card>
    )
  }

  // ── Funnel ───────────────────────────────────────────────────────────────────
  return (
    <Card>
      <Stepper steps={A.schritte} current={step} />

      {/* Schritt 1 — Standort */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-dark">{A.standort.frage}</h2>
          <p className="mt-2 text-sm text-mid">{A.standort.hinweis}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="plz" className={labelCls}>{A.standort.plzLabel} *</label>
              <input id="plz" required inputMode="numeric" maxLength={5} className={inputCls} value={plz} onChange={(e) => setPlz(e.target.value)} />
            </div>
            <div>
              <label htmlFor="ort" className={labelCls}>{A.standort.ortLabel}</label>
              <input id="ort" className={inputCls} value={ort} onChange={(e) => setOrt(e.target.value)} />
            </div>
          </div>
          {plzWarnung && (
            <div className="mt-4 rounded-lg bg-pale p-4 text-sm font-medium text-dark ring-1 ring-ash">
              {A.standort.warnung}
            </div>
          )}
          <NavRow
            onNext={() => setStep(2)}
            nextDisabled={plz.trim().length < 4}
            nextLabel={A.navWeiter}
          />
        </div>
      )}

      {/* Schritt 2 — Leistungsart */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-dark">{A.leistung.frage}</h2>
          <div className="mt-6 space-y-3">
            {A.leistung.optionen.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => chooseLeistung(o.key, o.qualifiziert)}
                className={`flex w-full items-center justify-between gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                  leistung === o.key ? 'border-brand bg-pale' : 'border-ash bg-white hover:border-brand'
                }`}
              >
                <span>
                  <span className="block font-bold text-dark">{o.label}</span>
                  <span className="mt-0.5 block text-sm text-mid">{o.beschreibung}</span>
                </span>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-brand" />
              </button>
            ))}
          </div>
          <NavRow onBack={() => setStep(1)} backLabel={A.navZurueck} />
        </div>
      )}

      {/* Schritt 3 — Projekt */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-dark">{A.projekt.frage}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="bodenart" className={labelCls}>{L.bodenart} *</label>
              <select id="bodenart" required className={inputCls} value={bodenart} onChange={(e) => setBodenart(e.target.value)}>
                <option value="">Bitte wählen</option>
                {VERLEGE_FORM.bodenartOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="flaeche" className={labelCls}>{L.flaeche} *</label>
              <input id="flaeche" required inputMode="numeric" className={inputCls} value={flaeche} onChange={(e) => setFlaeche(e.target.value)} />
            </div>
            <div>
              <label htmlFor="projektart" className={labelCls}>{L.projektart} *</label>
              <select id="projektart" required className={inputCls} value={projektart} onChange={(e) => setProjektart(e.target.value)}>
                <option value="">Bitte wählen</option>
                {VERLEGE_FORM.projektartOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="wunschtermin" className={labelCls}>{L.wunschtermin}</label>
              <input id="wunschtermin" className={inputCls} value={wunschtermin} onChange={(e) => setWunschtermin(e.target.value)} />
            </div>
          </div>

          {flaecheKlein && (
            <div className="mt-4 rounded-lg bg-pale p-4 text-sm font-medium text-dark ring-1 ring-ash">
              {A.projekt.flaecheHinweis}
            </div>
          )}

          <div className="mt-5">
            <span className={labelCls}>{L.raeume}</span>
            <div className="flex flex-wrap gap-3">
              {VERLEGE_FORM.raeumeOptions.map((r) => (
                <label key={r} className="inline-flex items-center gap-2 rounded-lg border border-ash bg-white px-3 py-2 text-sm">
                  <input type="checkbox" checked={raeume.includes(r)} onChange={() => toggleRaum(r)} />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <NavRow
            onBack={() => setStep(2)}
            backLabel={A.navZurueck}
            onNext={() => setStep(4)}
            nextDisabled={!bodenart || !flaeche.trim() || !projektart}
            nextLabel={A.navWeiter}
          />
        </div>
      )}

      {/* Schritt 4 — Kontakt */}
      {step === 4 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-dark">{A.kontakt.frage}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>{L.name} *</label>
              <input id="name" required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="telefon" className={labelCls}>{L.telefon} *</label>
              <input id="telefon" required type="tel" className={inputCls} value={telefon} onChange={(e) => setTelefon(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>{L.email} *</label>
              <input id="email" required type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="nachricht" className={labelCls}>{L.nachricht}</label>
            <textarea id="nachricht" rows={4} className={inputCls} value={nachricht} onChange={(e) => setNachricht(e.target.value)} />
          </div>

          <label className="mt-5 flex items-start gap-3 text-dark">
            <input type="checkbox" className="mt-1" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>{A.marketingLabel}</span>
          </label>

          <label className="mt-3 flex items-start gap-3 text-dark">
            <input type="checkbox" className="mt-1" checked={datenschutz} onChange={(e) => setDatenschutz(e.target.checked)} required />
            <span>
              {A.datenschutzPre}
              <Link href={A.datenschutzHref} className="font-bold text-brand hover:underline" target="_blank">
                {A.datenschutzLinkText}
              </Link>
              {A.datenschutzPost}
            </span>
          </label>

          {/* Honeypot */}
          <div className="hidden" aria-hidden>
            <label htmlFor="website">Website (bitte leer lassen)</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          {siteKey && (
            <div className="mt-5">
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={(t) => setTurnstileToken(t)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>
          )}

          {errorMsg && <p className="mt-4 text-sm font-medium text-brand">{errorMsg}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 text-sm font-medium text-mid hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" />
              {A.navZurueck}
            </button>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#c8161e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'sending' ? A.sendingLabel : A.submitLabel}
            </button>
          </div>
        </form>
      )}
    </Card>
  )
}

// ── kleine Bausteine ───────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-16 md:py-24">
      <div className="content-container">
        <div className="mx-auto max-w-3xl rounded-2xl border-t-4 border-brand bg-white p-6 shadow-md md:p-10">
          {children}
        </div>
      </div>
    </section>
  )
}

function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1
        const active = n === current
        const done = n < current
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                active ? 'bg-brand text-white' : done ? 'bg-success text-white' : 'bg-ash text-mid'
              }`}
            >
              {n}
            </span>
            <span className={`hidden text-sm font-medium sm:inline ${active ? 'text-dark' : 'text-mid'}`}>{label}</span>
            {n < steps.length && <span className="h-px flex-1 bg-ash" />}
          </li>
        )
      })}
    </ol>
  )
}

function NavRow({
  onBack,
  backLabel,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onBack?: () => void
  backLabel?: string
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {onBack ? (
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-mid hover:text-brand">
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3 font-bold text-white transition-colors hover:bg-[#c8161e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
