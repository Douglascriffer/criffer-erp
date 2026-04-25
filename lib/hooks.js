'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

// ── In-memory cache ──────────────────────────────────────
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function setCache(key, value) {
  cache.set(key, { value, ts: Date.now() })
}
function getCache(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null }
  return entry.value
}
export function invalidateCache(pattern = '') {
  cache.forEach((_, k) => { if (k.includes(pattern)) cache.delete(k) })
}

// ── useFinancialData ─────────────────────────────────────
export function useFinancialData() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    const cacheKey = 'financial_data'
    const cached   = getCache(cacheKey)
    if (cached) { setData(cached); setLoading(false); return }

    try {
      setLoading(true)
      const res  = await fetch('/data/dados.json')
      if (!res.ok) throw new Error('Dados não encontrados')
      const json = await res.json()
      setCache(cacheKey, json)
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { 
    load() 
    const timer = setInterval(load, 5 * 60 * 1000) // Poll every 5 minutes
    return () => clearInterval(timer)
  }, [load])
  return { data, loading, error, refetch: load }
}

// ── useFilteredData ──────────────────────────────────────
export function useFilteredData(data, filters) {
  const [filtered, setFiltered] = useState(null)

  useEffect(() => {
    if (!data) return

    const { ano, mes } = filters
    const cacheKey = `filtered_${ano}_${mes}`
    const cached   = getCache(cacheKey)
    if (cached) { setFiltered(cached); return }

    // Filter by period
    const byPeriod = data.byPeriod.filter(r => {
      if (ano && r.ano !== Number(ano)) return false
      if (mes && mes !== 'all' && r.mes !== Number(mes)) return false
      return true
    })

    // Filter state data
    const byState = data.byState.filter(r => {
      if (ano && r.ano !== Number(ano)) return false
      if (mes && mes !== 'all' && r.mes !== Number(mes)) return false
      return true
    })

    // Aggregate state totals
    const stateMap = {}
    byState.forEach(({ estado, faturamento }) => {
      stateMap[estado] = (stateMap[estado] || 0) + faturamento
    })
    const stateData = Object.entries(stateMap).map(([estado, faturamento]) => ({
      estado, faturamento: Math.round(faturamento)
    })).sort((a, b) => b.faturamento - a.faturamento)

    // Meta for selected year
    const metaData = (data.meta[ano] || []).filter(r => {
      if (mes && mes !== 'all') return r.mes === Number(mes)
      return true
    })

    // KPIs
    const totalFaturamento = byPeriod.reduce((s, r) => s + (r.total || 0), 0)
    const totalMeta        = metaData.reduce((s, r) => s + (r.meta || 0), 0)
    const totalRealizado   = metaData.reduce((s, r) => s + (r.realizado || 0), 0)
    const pctAtingido      = totalMeta > 0 ? (totalRealizado / totalMeta) * 100 : 0
    const vendas           = byPeriod.reduce((s, r) => s + (r.vendas || 0), 0)
    const servicos         = byPeriod.reduce((s, r) => s + (r.servicos || 0), 0)
    const locacao          = byPeriod.reduce((s, r) => s + (r.locacao || 0), 0)
    const devolucoes       = byPeriod.reduce((s, r) => s + (r.devolucoes || 0), 0)

    const result = {
      byPeriod,
      stateData,
      metaData,
      bySeller: data.bySeller || [],
      kpis: {
        totalFaturamento,
        totalMeta,
        totalRealizado,
        pctAtingido,
        vendas,
        servicos,
        locacao,
        devolucoes,
      },
    }

    setCache(cacheKey, result)
    setFiltered(result)

  }, [data, filters])

  return filtered
}

// ── usePagination ────────────────────────────────────────
export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(items.length / pageSize)
  const paginated  = items.slice((page - 1) * pageSize, page * pageSize)

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)))
  const prev  = () => goTo(page - 1)
  const next  = () => goTo(page + 1)

  return { paginated, page, totalPages, goTo, prev, next, setPage }
}
