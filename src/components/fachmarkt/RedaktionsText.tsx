import Reveal from './Reveal'

interface RedaktionsTextProps {
  /** roher HTML-Inhalt aus WordPress (page.content.rendered) */
  html: string
}

/**
 * Variante A: Redaktionell in WordPress pflegbarer Fließtext-Block.
 * Änderungen an diesem Text sind ohne Deployment möglich (ISR revalidate).
 * Inhalt stammt aus dem eigenen WP-Backend (vertrauenswürdig).
 */
export default function RedaktionsText({ html }: RedaktionsTextProps) {
  if (!html || !html.trim()) return null

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="prose prose-lg mx-auto max-w-3xl prose-headings:font-bold prose-headings:text-dark prose-p:text-mid prose-a:text-brand">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Reveal>
      </div>
    </section>
  )
}
