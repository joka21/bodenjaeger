import { SERVICE_FAQ } from '@/content/service'
import Accordion from '@/components/shared/Accordion'

/**
 * FAQ-Block der Service-Übersicht. Nutzt das geteilte Accordion.
 * Als Block gedacht (Page ordnet neben Orientierung an).
 */
export default function ServiceFaq() {
  const { headline, items } = SERVICE_FAQ

  return (
    <div>
      <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
        {headline}
      </h2>
      <div className="mt-8">
        <Accordion items={items.map((i) => ({ frage: i.frage, antwort: i.antwort }))} />
      </div>
    </div>
  )
}
