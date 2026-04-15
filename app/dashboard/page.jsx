import { Suspense } from 'react'
import DashboardClient from './DashboardClient'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F9FA' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #FFB899', borderTopColor:'#FF6A22', animation:'spin 1s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <DashboardClient/>
    </Suspense>
  )
}
