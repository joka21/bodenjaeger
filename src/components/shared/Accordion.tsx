'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  frage: string
  antwort: string
}

interface AccordionProps {
  items: AccordionItem[]
  /** Index, der initial geöffnet ist (null = alle zu) */
  defaultOpen?: number | null
}

/**
 * Schlankes FAQ-Accordion ohne zusätzliche Dependency.
 * Geteilt: Service-Übersicht (ServiceFaq) + Verlegeservice (VerlegeFaq).
 */
export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <li key={item.frage} className="overflow-hidden rounded-2xl border border-ash bg-white shadow-sm">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
            >
              <span className="font-bold text-dark">{item.frage}</span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-brand transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && (
              <div className="px-5 pb-6 text-mid md:px-6">
                <p>{item.antwort}</p>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
