import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      {/* Section 1: Main Footer - 380px height, darkest background */}
      <div
        className="w-full"
        style={{
          height: '380px',
          backgroundColor: 'var(--color-bg-darkest)'
        }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full py-12">
            {/* Column 1: Hast du Fragen? */}
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
                    <a href="/blog" className="text-xl hover:underline flex items-start">
                      <span className="mr-2">&gt;</span>
                      <span>Blog</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Bottom Bar - 20px height, dark background */}
      <div
        className="w-full"
        style={{
          height: '20px',
          backgroundColor: 'var(--color-bg-dark)'
        }}
      >
        {/* Content will be added here */}
      </div>
    </footer>
  )
}
