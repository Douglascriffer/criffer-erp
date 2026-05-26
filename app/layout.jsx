import './globals.css'

export const metadata = {
  title: 'Criffer ERP — Dashboard Financeiro',
  description: 'Sistema de gestão financeira Criffer',
  icons: {
    icon: '/logo-base.png',
    shortcut: '/logo-base.png',
    apple: '/logo-base.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
