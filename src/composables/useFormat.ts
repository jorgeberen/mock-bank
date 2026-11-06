import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { INTL_LOCALE, type AppLocale } from '../i18n'
import type { MessageSchema } from '../i18n/en'
import type { Transaction } from '../transactions'

/** Locale-aware formatting helpers; they re-evaluate when the language changes. */
export function useFormat() {
  const { locale, t } = useI18n<{ message: MessageSchema }, AppLocale>()
  const intl = computed(() => INTL_LOCALE[locale.value])

  const eurFmt = computed(
    () => new Intl.NumberFormat(intl.value, { style: 'currency', currency: 'EUR' }),
  )
  const eurCompactFmt = computed(
    () =>
      new Intl.NumberFormat(intl.value, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
  )
  // Dates are plain YYYY-MM-DD, so format in UTC to avoid timezone day-shifts
  const dateFmt = computed(
    () =>
      new Intl.DateTimeFormat(intl.value, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }),
  )
  const monthYearFmt = computed(
    () =>
      new Intl.DateTimeFormat(intl.value, { month: 'short', year: '2-digit', timeZone: 'UTC' }),
  )
  const monthNameFmt = computed(
    () => new Intl.DateTimeFormat(intl.value, { month: 'long', timeZone: 'UTC' }),
  )

  return {
    eur: (amount: number): string => eurFmt.value.format(amount),
    eurCompact: (amount: number): string => eurCompactFmt.value.format(amount),
    date: (isoDate: string): string => dateFmt.value.format(new Date(isoDate)),
    /** `key` is a YYYY-MM month key */
    monthYear: (key: string): string => monthYearFmt.value.format(new Date(`${key}-01`)),
    describe: (tx: Transaction): string =>
      t(
        `tx.${tx.descriptionKey}`,
        { month: tx.month ? monthNameFmt.value.format(new Date(Date.UTC(2026, tx.month - 1, 1))) : '' },
      ),
  }
}
