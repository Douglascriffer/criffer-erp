'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard, TrendingUp, FileText, DollarSign,
  LogOut, ChevronLeft, ChevronRight, Upload, Settings, User
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
  { icon: TrendingUp,      label: 'Desempenho',  href: '/dashboard?tab=desempenho' },
  { icon: DollarSign,      label: 'Orçamento',   href: '/dashboard?tab=orcamento' },
  { icon: FileText,        label: 'Fluxo Caixa', href: '/dashboard?tab=fluxo' },
]

export default function Sidebar({ user }) {
  const router   = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading]     = useState(false)

  async function logout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className={`flex flex-col bg-white border-r border-gray-100 shadow-sm
      transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} shrink-0`}>

      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-100 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        {!collapsed && (
          <span className="text-xl font-black tracking-[3px] text-brand" style={{ fontFamily: "'Gotham', sans-serif" }}>
            CRIFFER
          </span>
        )}
        {collapsed && (
          <span className="text-lg font-black text-brand" style={{ fontFamily: "'Gotham', sans-serif" }}>C</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {NAV.map(item => (
          <button key={item.href}
            onClick={() => router.push(item.href)}
            className={`sidebar-link w-full ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? item.label : ''}>
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-gray-100 space-y-1">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
            <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand text-xs font-bold shrink-0">
              {(user.email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{user.email}</p>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div>
          </div>
        )}
        <button onClick={logout} disabled={loading}
          className={`sidebar-link w-full text-red-400 hover:bg-red-50 hover:text-red-500 ${collapsed ? 'justify-center px-2' : ''}`}>
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
        <button onClick={() => setCollapsed(c => !c)}
          className={`sidebar-link w-full text-gray-400 ${collapsed ? 'justify-center px-2' : ''}`}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16}/><span>Recolher</span></>}
        </button>
      </div>
    </aside>
  )
}
