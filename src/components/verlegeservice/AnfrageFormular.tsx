'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { Upload, X, CheckCircle2 } from 'lucide-react'
import { VERLEGE_FORM, VERLEGE_UPLOAD, VERLEGE_FORM_ENABLED } from '@/content/verlegeservice'

type Status = 'idle' | 'sending' | 'success' | 'error'

const REQUIRED_TEXT = { name: '', telefon: '', email: '', plzOrt: '', bodenart: '', flaeche: '', projektart: '', wunschtermin: '', nachricht: '' }
const OPTIONAL_TEXT = { adresseAufmass: '', bodenVorhanden: '', altbodenEntfernen: '', untergrundBekannt: '', wunschbodenAusgesucht: '' }

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // dataURL → nur den Base64-Teil nach dem Komma
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Anfrageformular — optisch hervorgehoben (heller Kasten, roter Akzent). Anker #anfrage. */
export default function AnfrageFormular() {
  const L = VERLEGE_FORM.labels
  const [text, setText] = useState({ ...REQUIRED_TEXT, ...OPTIONAL_TEXT })
  const [raeume, setRaeume] = useState<string[]>([])
  const [beratungImFachmarkt, setBeratungImFachmarkt] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [datenschutz, setDatenschutz] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [website, setWebsite] = useState('') // Honeypot
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  const siteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '').trim()

  const setField = (key: string, value: string) => setText((t) => ({ ...t, [key]: value }))

  const toggleRaum = (raum: string) =>
    setRaeume((r) => (r.includes(raum) ? r.filter((x) => x !== raum) : [...r, raum]))

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    setFileError(null)
    const next = [...files]
    for (const f of Array.from(incoming)) {
      if (!(VERLEGE_UPLOAD.acceptMime as readonly string[]).includes(f.type)) {
        setFileError(`„${f.name}" hat ein nicht erlaubtes Format. Erlaubt: JPG, PNG, HEIC, WEBP.`)
        continue
      }
      if (f.size > VERLEGE_UPLOAD.maxFileBytes) {
        setFileError(`„${f.name}" ist größer als 5 MB.`)
        continue
      }
      if (next.length >= VERLEGE_UPLOAD.maxFiles) {
        setFileError('Maximal 5 Dateien möglich.')
        break
      }
      next.push(f)
    }
    const total = next.reduce((sum, f) => sum + f.size, 0)
    if (total > VERLEGE_UPLOAD.maxTotalBytes) {
      setFileError('Die Dateien überschreiten insgesamt 15 MB.')
      return
    }
    setFiles(next)
  }

  const removeFile = (idx: number) => setFiles((f) => f.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!datenschutz) {
      setErrorMsg('Bitte bestätige die Datenschutzerklärung.')
      return
    }
    if (!turnstileToken) {
      setErrorMsg('Bitte den Sicherheitscheck abschließen.')
      return
    }

    setStatus('sending')
    try {
      const attachments = await Promise.all(
        files.map(async (f) => ({ filename: f.name, mime: f.type, dataBase64: await fileToBase64(f) })),
      )

      const res = await fetch('/api/verlegeservice-anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...text,
          raeume,
          beratungImFachmarkt,
          marketing,
          attachments,
          turnstileToken,
          website,
        }),
      })
      const json = await res.json().catch(() => ({ success: false }))
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'error')
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(VERLEGE_FORM.errorMessage)
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  if (status === 'success') {
    return (
      <section id="anfrage" className="scroll-mt-24 py-24 md:py-32">
        <div className="content-container">
          <div className="mx-auto max-w-2xl rounded-2xl border-t-4 border-brand bg-white p-8 text-center shadow-md md:p-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="mt-4 text-lg font-medium text-dark">{VERLEGE_FORM.successMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  const inputCls =
    'w-full rounded-lg border border-ash bg-white px-4 py-3 text-dark outline-none focus:border-brand'
  const labelCls = 'mb-1.5 block text-sm font-bold text-dark'

  return (
    <section id="anfrage" className="scroll-mt-24 py-24 md:py-32">
      <div className="content-container">
        <div className="mx-auto max-w-3xl rounded-2xl border-t-4 border-brand bg-white p-6 shadow-md md:p-10">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
            {VERLEGE_FORM.headline}
          </h2>
          <p className="mt-3 text-mid">{VERLEGE_FORM.intro}</p>

          {!VERLEGE_FORM_ENABLED && (
            <div className="mt-6 rounded-lg bg-pale p-4 text-sm font-medium text-dark ring-1 ring-ash">
              {VERLEGE_FORM.disabledHinweis}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Pflichtfelder */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelCls}>{L.name} *</label>
                <input id="name" required className={inputCls} value={text.name} onChange={(e) => setField('name', e.target.value)} />
              </div>
              <div>
                <label htmlFor="telefon" className={labelCls}>{L.telefon} *</label>
                <input id="telefon" required type="tel" className={inputCls} value={text.telefon} onChange={(e) => setField('telefon', e.target.value)} />
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>{L.email} *</label>
                <input id="email" required type="email" className={inputCls} value={text.email} onChange={(e) => setField('email', e.target.value)} />
              </div>
              <div>
                <label htmlFor="plzOrt" className={labelCls}>{L.plzOrt} *</label>
                <input id="plzOrt" required className={inputCls} value={text.plzOrt} onChange={(e) => setField('plzOrt', e.target.value)} />
              </div>
              <div>
                <label htmlFor="bodenart" className={labelCls}>{L.bodenart} *</label>
                <select id="bodenart" required className={inputCls} value={text.bodenart} onChange={(e) => setField('bodenart', e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {VERLEGE_FORM.bodenartOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="flaeche" className={labelCls}>{L.flaeche} *</label>
                <input id="flaeche" required inputMode="numeric" className={inputCls} value={text.flaeche} onChange={(e) => setField('flaeche', e.target.value)} />
              </div>
              <div>
                <label htmlFor="projektart" className={labelCls}>{L.projektart} *</label>
                <select id="projektart" required className={inputCls} value={text.projektart} onChange={(e) => setField('projektart', e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {VERLEGE_FORM.projektartOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="wunschtermin" className={labelCls}>{L.wunschtermin} *</label>
                <input id="wunschtermin" required className={inputCls} value={text.wunschtermin} onChange={(e) => setField('wunschtermin', e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="nachricht" className={labelCls}>{L.nachricht} *</label>
              <textarea id="nachricht" required rows={4} className={inputCls} value={text.nachricht} onChange={(e) => setField('nachricht', e.target.value)} />
            </div>

            {/* Optionale Felder */}
            <details className="rounded-lg border border-ash bg-pale p-4">
              <summary className="cursor-pointer font-bold text-dark">Weitere Angaben (optional)</summary>
              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor="adresseAufmass" className={labelCls}>{L.adresseAufmass}</label>
                  <input id="adresseAufmass" className={inputCls} value={text.adresseAufmass} onChange={(e) => setField('adresseAufmass', e.target.value)} />
                </div>

                <div>
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

                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { key: 'bodenVorhanden', label: L.bodenVorhanden },
                    { key: 'altbodenEntfernen', label: L.altbodenEntfernen },
                    { key: 'untergrundBekannt', label: L.untergrundBekannt },
                    { key: 'wunschbodenAusgesucht', label: L.wunschbodenAusgesucht },
                  ].map((f) => (
                    <div key={f.key}>
                      <label htmlFor={f.key} className={labelCls}>{f.label}</label>
                      <select
                        id={f.key}
                        className={inputCls}
                        value={text[f.key as keyof typeof text]}
                        onChange={(e) => setField(f.key, e.target.value)}
                      >
                        <option value="">Bitte wählen</option>
                        {VERLEGE_FORM.jaNeinOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <label className="inline-flex items-center gap-2 text-dark">
                  <input type="checkbox" checked={beratungImFachmarkt} onChange={(e) => setBeratungImFachmarkt(e.target.checked)} />
                  {L.beratungImFachmarkt}
                </label>

                {/* Foto-Upload */}
                <div>
                  <span className={labelCls}>{L.fotos}</span>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ash bg-white px-4 py-6 text-mid hover:border-brand">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">Dateien auswählen (max. 5, je max. 5 MB, JPG/PNG/HEIC/WEBP)</span>
                    <input type="file" multiple accept={VERLEGE_UPLOAD.acceptAttr} className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  </label>
                  {fileError && <p className="mt-2 text-sm font-medium text-brand">{fileError}</p>}
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between rounded-lg bg-pale px-3 py-2 text-sm">
                          <span className="truncate">{f.name} · {(f.size / 1024 / 1024).toFixed(1)} MB</span>
                          <button type="button" onClick={() => removeFile(i)} aria-label="Datei entfernen" className="ml-3 text-mid hover:text-brand">
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </details>

            {/* Checkboxen */}
            <label className="flex items-start gap-3 text-dark">
              <input type="checkbox" className="mt-1" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span>{VERLEGE_FORM.marketingLabel}</span>
            </label>

            <label className="flex items-start gap-3 text-dark">
              <input type="checkbox" className="mt-1" checked={datenschutz} onChange={(e) => setDatenschutz(e.target.checked)} required />
              <span>
                {VERLEGE_FORM.datenschutzLabelPre}
                <Link href={VERLEGE_FORM.datenschutzLinkHref} className="font-bold text-brand hover:underline" target="_blank">
                  {VERLEGE_FORM.datenschutzLinkText}
                </Link>
                {VERLEGE_FORM.datenschutzLabelPost}
              </span>
            </label>

            {/* Honeypot (versteckt) */}
            <div className="hidden" aria-hidden>
              <label htmlFor="website">Website (bitte leer lassen)</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            {/* Cloudflare Turnstile — nur wenn Formular aktiv */}
            {VERLEGE_FORM_ENABLED && siteKey && (
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={(t) => setTurnstileToken(t)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            )}

            {errorMsg && <p className="text-sm font-medium text-brand">{errorMsg}</p>}

            <button
              type="submit"
              disabled={!VERLEGE_FORM_ENABLED || status === 'sending'}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#c8161e] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {status === 'sending' ? 'Wird gesendet …' : VERLEGE_FORM.submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
