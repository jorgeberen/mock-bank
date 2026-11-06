import type { MessageSchema } from './i18n/en'

// Descriptions are i18n keys (under `tx.`), so they follow the active language
export type DescriptionKey = keyof MessageSchema['tx']

export interface Transaction {
  id: number
  date: string // YYYY-MM-DD
  descriptionKey: DescriptionKey
  /** Calendar month (1-12) interpolated into descriptions such as rent */
  month?: number
  amount: number // EUR; positive = deposit, negative = withdrawal
}

// Mock data: positive = deposit, negative = withdrawal (EUR)
export const OPENING_BALANCE = 2400.0

const recent: Transaction[] = [
  { id: 1, date: '2026-11-04', descriptionKey: 'salary', amount: 3200.0 },
  { id: 2, date: '2026-11-03', descriptionKey: 'mercadona', amount: -64.35 },
  { id: 3, date: '2026-11-02', descriptionKey: 'rent', month: 11, amount: -950.0 },
  { id: 4, date: '2026-11-01', descriptionKey: 'netflix', amount: -13.99 },
  { id: 5, date: '2026-10-30', descriptionKey: 'transferFromAna', amount: 120.0 },
  { id: 6, date: '2026-10-28', descriptionKey: 'electricity', amount: -78.2 },
  { id: 7, date: '2026-10-27', descriptionKey: 'cafe', amount: -4.8 },
  { id: 8, date: '2026-10-25', descriptionKey: 'amazon', amount: -39.99 },
  { id: 9, date: '2026-10-23', descriptionKey: 'freelance', amount: 450.0 },
  { id: 10, date: '2026-10-21', descriptionKey: 'metro', amount: -54.6 },
  { id: 11, date: '2026-10-19', descriptionKey: 'gym', amount: -32.0 },
  { id: 12, date: '2026-10-17', descriptionKey: 'laMar', amount: -58.5 },
  { id: 13, date: '2026-10-15', descriptionKey: 'taxRefund', amount: 215.75 },
  { id: 14, date: '2026-10-12', descriptionKey: 'zara', amount: -89.9 },
  { id: 15, date: '2026-10-10', descriptionKey: 'pharmacy', amount: -12.45 },
  { id: 16, date: '2026-10-08', descriptionKey: 'spotify', amount: -10.99 },
  { id: 17, date: '2026-10-05', descriptionKey: 'savings', amount: -300.0 },
  { id: 18, date: '2026-10-03', descriptionKey: 'salary', amount: 3200.0 },
  { id: 19, date: '2026-10-02', descriptionKey: 'vodafone', amount: -29.0 },
  { id: 20, date: '2026-10-01', descriptionKey: 'rent', month: 10, amount: -950.0 },
]

// Deterministic pseudo-random generator so the mock history is stable between reloads
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(2026)
const between = (min: number, max: number): number => Math.round((min + rand() * (max - min)) * 100) / 100
const pad = (n: number): string => String(n).padStart(2, '0')

const merchants: [key: DescriptionKey, min: number, max: number][] = [
  ['mercadona', 35, 95], ['restaurant', 25, 75], ['amazon', 15, 120], ['zara', 30, 110],
  ['pharmacy', 6, 30], ['cafe', 3, 9], ['taxi', 8, 25], ['cinema', 10, 24],
  ['fuel', 40, 70], ['bookshop', 12, 40],
]

// January to September 2026
const history: Omit<Transaction, 'id'>[] = []
for (let month = 1; month <= 9; month++) {
  const d = (day: number): string => `2026-${pad(month)}-${pad(day)}`
  history.push({ date: d(1), descriptionKey: 'rent', month, amount: -950 })
  history.push({ date: d(3), descriptionKey: 'salary', amount: 3200 })
  history.push({ date: d(5), descriptionKey: 'savings', amount: -1200 })
  history.push({ date: d(8), descriptionKey: 'spotify', amount: -10.99 })
  history.push({ date: d(10), descriptionKey: 'netflix', amount: -13.99 })
  history.push({ date: d(15), descriptionKey: 'electricity', amount: -between(55, 110) })
  history.push({ date: d(19), descriptionKey: 'gym', amount: -32 })
  history.push({ date: d(22), descriptionKey: 'vodafone', amount: -29 })
  const extras = 6 + Math.floor(rand() * 4)
  for (let i = 0; i < extras; i++) {
    const [key, lo, hi] = merchants[Math.floor(rand() * merchants.length)]!
    history.push({ date: d(2 + Math.floor(rand() * 26)), descriptionKey: key, amount: -between(lo, hi) })
  }
  if (rand() < 0.5) {
    history.push({ date: d(12 + Math.floor(rand() * 10)), descriptionKey: 'freelance', amount: between(150, 600) })
  }
  if (month === 6) history.push({ date: d(20), descriptionKey: 'holiday', amount: -1100 })
  if (month === 4) history.push({ date: d(25), descriptionKey: 'taxRefund', amount: between(100, 300) })
}

export const transactions: Transaction[] = [...recent.map(({ id: _id, ...t }) => t), ...history]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((t, i) => ({ id: i + 1, ...t }))
