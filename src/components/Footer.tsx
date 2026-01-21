import Image from 'next/image'
import Link from 'next/link'
import FooterNewsletterSignup from './FooterNewsletterSignup'

export default function Footer() {
  return (
    <footer className="w-full mt-auto overflow-hidden">
      {/* Section 1: Main Footer - darkest background */}
      <div
        className="w-full overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-darkest)'
        }}
      >
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            {/* Column 1: Hast du Fragen? + Newsletter */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Hast du Fragen?</h3>
              <div className="flex items-start gap-4">
                <Image
                  src="/images/Icons/Kontakt weiß.png"
                  alt="Kontakt"
                  width={40}
                  height={40}
                  className="flex-shrink-0"
                />
                <div>
                  <p className="text-lg font-semibold mb-4">02433938884</p>
                  <p className="text-sm mb-1">Mo. bis Fr.     9:00  – 18.30 Uhr</p>
                  <p className="text-sm">Sa.                 9:00 – 14 Uhr</p>
                </div>
              </div>

              {/* Newsletter Signup */}
              <FooterNewsletterSignup />
            </div>

            {/* Column 2: Über Bodenjäger */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Über Bodenjäger</h3>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <a href="/fachmarkt-hueckelhoven" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Fachmarkt Hückelhoven</span>
                    </a>
                  </li>
                  <li>
                    <a href="/karriere" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Jobs & Karriere</span>
                    </a>
                  </li>
                  <li>
                    <Link href="/newsletter" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Newsletter</span>
                    </Link>
                  </li>
                  <li>
                    <a href="/datenschutz" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Datenschutzerklärung</span>
                    </a>
                  </li>
                  <li>
                    <a href="/impressum" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Impressum</span>
                    </a>
                  </li>
                  <li>
                    <a href="/agb" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>AGB</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Column 3: Kundenservice */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Kundenservice</h3>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <a href="/kontakt" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Kontakt</span>
                    </a>
                  </li>
                  <li>
                    <a href="/service" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Servicebereich</span>
                    </a>
                  </li>
                  <li>
                    <a href="/versand-lieferzeit" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Versand & Lieferzeit</span>
                    </a>
                  </li>
                  <li>
                    <a href="/widerruf" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Widerrufsbelehrung & Widerrufsformular</span>
                    </a>
                  </li>
                  <li>
                    <Link href="/blog" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Blog</span>
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Social Media Icons */}
              <div className="mt-8 flex gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/p/Bodenj%C3%A4ger-100057406151090/?locale=de_DE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/bodenjager/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Bottom Bar - 20px height, dark background */}
      <div
        className="w-full overflow-hidden flex items-center"
        style={{
          minHeight: '20px',
          backgroundColor: 'var(--color-bg-dark)'
        }}
      >
        <div className="content-container">
          <div className="flex justify-between items-center text-white text-xs py-1">
            <div>© 2026 Bodenjäger</div>
            <div>* alle Preise inkl. MwSt. und ggf. zzgl. Versandkosten</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
