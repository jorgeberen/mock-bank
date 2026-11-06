<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { OPENING_BALANCE, transactions } from '../transactions'
import { useI18n } from 'vue-i18n'
import { useFormat } from '../composables/useFormat'
import EyeIcon from './icons/EyeIcon.vue'
import EyeOffIcon from './icons/EyeOffIcon.vue'

const { t } = useI18n()
const { eur, date, describe } = useFormat()

const blurred = ref(false)

const balance = computed(() =>
  transactions.reduce((sum, t) => sum + t.amount, OPENING_BALANCE),
)

type TypeFilter = 'all' | 'deposit' | 'withdrawal'

interface Filters {
  from: string
  to: string
  type: TypeFilter
  min: number | string // '' when empty (a number input's v-model yields either)
  max: number | string
}

const emptyFilters = (): Filters => ({ from: '', to: '', type: 'all', min: '', max: '' })

const filters = reactive<Filters>(emptyFilters())

const filtered = computed(() =>
  transactions.filter((t) => {
    if (filters.from && t.date < filters.from) return false
    if (filters.to && t.date > filters.to) return false
    if (filters.type === 'deposit' && t.amount <= 0) return false
    if (filters.type === 'withdrawal' && t.amount >= 0) return false
    const abs = Math.abs(t.amount)
    if (filters.min !== '' && abs < Number(filters.min)) return false
    if (filters.max !== '' && abs > Number(filters.max)) return false
    return true
  }),
)

function resetFilters() {
  Object.assign(filters, emptyFilters())
}
</script>

<template>
  <main class="page">
    <header class="hero">
      <p class="label">{{ t('home.totalBalance') }}</p>
      <p class="balance" :class="{ blurred }" :aria-hidden="blurred">{{ eur(balance) }}</p>
      <button
        class="eye"
        type="button"
        :aria-pressed="blurred"
        :aria-label="blurred ? t('home.showBalance') : t('home.hideBalance')"
        @click="blurred = !blurred"
      >
        <EyeOffIcon v-if="blurred" />
        <EyeIcon v-else />
      </button>
    </header>

    <section class="card filters" :aria-label="t('home.filters.title')">
      <div class="field">
        <label for="from">{{ t('home.filters.from') }}</label>
        <input id="from" type="date" v-model="filters.from" />
      </div>
      <div class="field">
        <label for="to">{{ t('home.filters.to') }}</label>
        <input id="to" type="date" v-model="filters.to" />
      </div>
      <div class="field">
        <label for="type">{{ t('home.filters.type') }}</label>
        <select id="type" v-model="filters.type">
          <option value="all">{{ t('home.filters.all') }}</option>
          <option value="deposit">{{ t('home.filters.deposits') }}</option>
          <option value="withdrawal">{{ t('home.filters.withdrawals') }}</option>
        </select>
      </div>
      <div class="field">
        <label for="min">{{ t('home.filters.min') }}</label>
        <input id="min" type="number" min="0" step="0.01" v-model="filters.min" placeholder="0" />
      </div>
      <div class="field">
        <label for="max">{{ t('home.filters.max') }}</label>
        <input id="max" type="number" min="0" step="0.01" v-model="filters.max" placeholder="∞" />
      </div>
      <button class="reset" type="button" @click="resetFilters">{{ t('home.filters.reset') }}</button>
    </section>

    <section class="card">
      <h2>{{ t('home.transactions') }} <span class="count">{{ filtered.length }}</span></h2>
      <ul class="list" v-if="filtered.length">
        <li v-for="tx in filtered" :key="tx.id">
          <div>
            <p class="desc">{{ describe(tx) }}</p>
            <p class="date">{{ date(tx.date) }}</p>
          </div>
          <p class="amount" :class="[tx.amount > 0 ? 'in' : 'out', { blurred }]" :aria-hidden="blurred">
            {{ tx.amount > 0 ? '+' : '' }}{{ eur(tx.amount) }}
          </p>
        </li>
      </ul>
      <p v-else class="empty">{{ t('home.empty') }}</p>
    </section>
  </main>
</template>

<style scoped>
.page { max-width: 640px; margin: 0 auto; padding: 0 16px 32px; }

.hero {
  background: var(--brand);
  color: #fff;
  margin: 0 -16px 16px;
  padding: 32px 24px 24px;
  text-align: center;
  border-radius: 0 0 24px 24px;
}
.label { margin: 0; opacity: 0.8; font-size: 0.95rem; letter-spacing: 0.04em; text-transform: uppercase; }
.balance {
  margin: 8px 0 16px;
  font-size: clamp(2.6rem, 10vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  transition: filter 0.2s;
}
.balance.blurred { filter: blur(14px); user-select: none; }
.amount { transition: filter 0.2s; }
.amount.blurred { filter: blur(6px); user-select: none; }

.eye { display: inline-flex; padding: 8px; border: none; border-radius: 50%; background: rgba(255,255,255,0.15); color: #fff; cursor: pointer; font-size: 1.1rem; }
.eye:hover { background: rgba(255,255,255,0.3); }
.eye:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

.card { background: var(--card); border: 1px solid var(--brand-border); border-radius: 16px; padding: 16px; margin-bottom: 16px; }

.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; align-items: end; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 0.8rem; color: var(--muted); font-weight: 600; }
input[type='date'], input[type='number'], select {
  font: inherit; padding: 8px; border: 1px solid var(--brand-border); border-radius: 8px; background: #fff; color: var(--text); width: 100%;
}
input:focus-visible, select:focus-visible, .reset:focus-visible { outline: 2px solid var(--brand); outline-offset: 1px; }
.reset { font: inherit; font-weight: 600; padding: 9px; border-radius: 8px; border: 1px solid var(--brand); background: var(--brand-tint); color: var(--brand); cursor: pointer; }
.reset:hover { background: var(--brand); color: #fff; }

h2 { margin: 0 0 8px; font-size: 1.1rem; color: var(--brand); }
.count { background: var(--brand-tint); color: var(--brand); border-radius: 999px; font-size: 0.8rem; padding: 2px 8px; margin-left: 6px; }

.list { list-style: none; margin: 0; padding: 0; max-height: 420px; overflow-y: auto; }
.list li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 4px; border-bottom: 1px solid var(--brand-tint); }
.list li:last-child { border-bottom: none; }
.desc { margin: 0; font-weight: 600; }
.date { margin: 2px 0 0; font-size: 0.8rem; color: var(--muted); }
.amount { margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.in { color: var(--deposit); }
.out { color: var(--withdrawal); }
.empty { color: var(--muted); text-align: center; padding: 24px 0; margin: 0; }
</style>
