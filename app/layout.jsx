import './globals.css'

export const metadata = {
  title: 'Criffer ERP — Dashboard Financeiro',
  description: 'Sistema de gestão financeira Criffer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body style={{ margin:0, padding:0, fontFamily:"'DM Sans', sans-serif", background:'#F8F9FA' }}>
        {children}
      </body>
    </html>
  )
}
