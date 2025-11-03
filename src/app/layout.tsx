import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextAuthProvider from '@/components/providers/NextAuthProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portal Maginf Tecnologia',
  description: 'Portal de monitoramento e gestão para clientes Maginf',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthProvider session={null}>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
