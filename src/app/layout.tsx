import Footer from '@/components/Footer'
import './globals.css'
import { Inter } from 'next/font/google'
import { LBOProvider } from '@/context/LBOContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LBO Model Builder Pro',
  description: 'Build and analyze LBO models with ease',
  icons: {
    // Remove any icon definitions if they exist
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LBOProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </LBOProvider>
      </body>
    </html>
  )
}

