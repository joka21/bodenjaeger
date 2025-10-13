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
        {/* Content will be added here */}
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
