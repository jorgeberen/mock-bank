<script setup lang="ts">
import { computed } from 'vue'
import { monthlySummary } from '../monthly'
import { useI18n } from 'vue-i18n'
import { useFormat } from '../composables/useFormat'
import MonthlyChart from './MonthlyChart.vue'

const { t } = useI18n()
const { eur, monthYear } = useFormat()

const months = monthlySummary()

const totals = computed(() => {
  const income = months.reduce((s, m) => s + m.income, 0)
  const expenses = months.reduce((s, m) => s + m.expenses, 0)
  const top = months.reduce((a, b) => (b.expenses > a.expenses ? b : a))
  return {
    income,
    expenses,
    avgExpenses: expenses / months.length,
    top,
  }
})
</script>

<template>
  <main class="page">
    <h1>{{ t('analyzer.title') }}</h1>
    <p class="sub">{{ t('analyzer.subtitle') }}</p>

    <section class="stats">
      <div class="stat"><p>{{ t('analyzer.totalIncome') }}</p><strong class="in">{{ eur(totals.income) }}</strong></div>
      <div class="stat"><p>{{ t('analyzer.totalExpenses') }}</p><strong class="out">{{ eur(totals.expenses) }}</strong></div>
      <div class="stat"><p>{{ t('analyzer.avgExpenses') }}</p><strong>{{ eur(totals.avgExpenses) }}</strong></div>
      <div class="stat"><p>{{ t('analyzer.highestSpend') }}</p><strong>{{ monthYear(totals.top.key) }} · {{ eur(totals.top.expenses) }}</strong></div>
    </section>

    <section class="card">
      <MonthlyChart :months="months" />
    </section>
  </main>
</template>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 24px 16px 32px; }
h1 { margin: 0; color: var(--brand); }
.sub { margin: 4px 0 20px; color: var(--muted); }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 16px; }
.stat { background: var(--card); border: 1px solid var(--brand-border); border-radius: 12px; padding: 12px 16px; }
.stat p { margin: 0 0 4px; font-size: 0.8rem; color: var(--muted); font-weight: 600; }
.stat strong { font-size: 1.15rem; font-variant-numeric: tabular-nums; }
.in { color: var(--deposit); }
.out { color: var(--withdrawal); }
.card { background: var(--card); border: 1px solid var(--brand-border); border-radius: 16px; padding: 16px; }
</style>
