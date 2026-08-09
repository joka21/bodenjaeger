'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { FOOTER_FOCUS_RING } from './FooterLinkList'

export interface FooterAccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface FooterAccordionProps {
  items: FooterAccordionItem[]
  /** Initial geöffnetes Panel. `null` = alle zu. */
  defaultOpenId?: string | null
}

/**
 * Mobile-Variante der Footer-Spalten.
 *
 * Pattern wie components/shared/Accordion.tsx (Button + aria-expanded +
 * ChevronDown), hier zusätzlich mit aria-controls und einer beschrifteten
 * Region — die FAQ-Komponente kann keine Link-Listen aufnehmen.
 *
 * Die Panels bleiben per `hidden`-Attribut im DOM: aria-controls zeigt damit
 * immer auf ein existierendes Element und der Inhalt steht im HTML.
 * Animiert wird nur der Chevron; `motion-reduce` schaltet das ab.
 */
export default function FooterAccordion({
  items,
  defaultOpenId = null,
}: FooterAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId)

  return (
    <ul className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item) => {
        const open = openId === item.id
        const buttonId = `footer-acc-${item.id}`
        const panelId = `footer-panel-${item.id}`

        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-sm py-4 text-left text-sm font-bold uppercase tracking-[0.08em] text-white ${FOOTER_FOCUS_RING}`}
              >
                {item.title}
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 text-white transition-transform duration-200 motion-reduce:transition-none ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="pb-5"
            >
              {item.content}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
