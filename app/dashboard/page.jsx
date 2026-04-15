import { Suspense } from 'react'
import DashboardClient from './DashboardClient'

function LoadingFallback() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F9FA' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid #FFB899', borderTopColor:'#FF6A22', margin:'0 auto 14px', animation:'spin 1s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#AAA', fontSize:14, fontFamily:'Syne,sans-serif' }}>Carregando Criffer ERP...</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback/>}>
      <DashboardClient/>
    </Suspense>
  )
}
