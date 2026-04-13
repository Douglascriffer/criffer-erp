import { Suspense } from 'react'
import DashboardClient from './DashboardClient'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF6A22] border-t-transparent animate-spin" />
      </div>
    }>
      <DashboardClient />
    </Suspense>
  )
}
