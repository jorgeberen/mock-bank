<script setup lang="ts">
import { computed } from 'vue'
import { Chart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import type { MonthSummary } from '../monthly'
import { useI18n } from 'vue-i18n'
import { useFormat } from '../composables/useFormat'

ChartJS.register(
  BarController, BarElement, LineController, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend,
)

const props = defineProps<{ months: MonthSummary[] }>()

const { t } = useI18n()
const { eur, eurCompact, monthYear } = useFormat()

const BRAND = '#6f1a07'
const INCOME = '#1b7a3d'
const LINE = '#1f1613'

const data = computed<ChartData<'bar' | 'line'>>(() => ({
  labels: props.months.map((m) => monthYear(m.key)),
  datasets: [
    {
      type: 'line',
      label: t('chart.balance'),
      data: props.months.map((m) => m.balance),
      borderColor: LINE,
      backgroundColor: LINE,
      borderWidth: 3,
      tension: 0.4, // smooth curve
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHitRadius: 12,
      order: 0,
    },
    {
      type: 'bar',
      label: t('chart.income'),
      data: props.months.map((m) => m.income),
      backgroundColor: INCOME,
      borderRadius: 4,
      order: 1,
    },
    {
      type: 'bar',
      label: t('chart.expenses'),
      data: props.months.map((m) => m.expenses),
      backgroundColor: BRAND,
      borderRadius: 4,
      order: 1,
    },
  ],
}))

const options = computed<ChartOptions<'bar' | 'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  // Only react when the cursor is directly over an element, and only show a
  // tooltip for points on the balance curve (never for the bars).
  interaction: { mode: 'nearest', intersect: true },
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      filter: (item) => item.dataset.type === 'line',
      callbacks: { label: (ctx) => `${ctx.dataset.label}: ${eur(ctx.parsed.y ?? 0)}` },
    },
  },
  scales: {
    y: { beginAtZero: true, ticks: { callback: (v) => eurCompact(Number(v)) } },
    x: { grid: { display: false } },
  },
}))
</script>

<template>
  <div class="chart" role="img" :aria-label="t('analyzer.chartAlt')">
    <Chart type="bar" :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart { position: relative; height: 380px; }
</style>
