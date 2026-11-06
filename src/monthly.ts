import { OPENING_BALANCE, transactions } from './transactions'

export interface MonthSummary {
  key: string // YYYY-MM
  income: number
  expenses: number
  /** Running balance at the end of the month */
  balance: number
}

// Aggregates transactions per calendar month, oldest first.
// `balance` is the running balance at the end of each month.
export function monthlySummary(): MonthSummary[] {
  const byMonth = new Map<string, { key: string; income: number; expenses: number }>()
  for (const t of transactions) {
    const key = t.date.slice(0, 7)
    const m = byMonth.get(key) ?? { key, income: 0, expenses: 0 }
    if (t.amount > 0) m.income += t.amount
    else m.expenses += -t.amount
    byMonth.set(key, m)
  }

  let balance = OPENING_BALANCE
  return [...byMonth.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => {
      balance += m.income - m.expenses
      return {
        ...m,
        income: Math.round(m.income * 100) / 100,
        expenses: Math.round(m.expenses * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      }
    })
}
