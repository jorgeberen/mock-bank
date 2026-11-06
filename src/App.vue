<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LOCALES, setLocale } from './i18n'

const { t, locale } = useI18n()
</script>

<template>
  <nav class="nav" :aria-label="t('nav.label')">
    <div class="links">
      <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
      <RouterLink to="/analyzer">{{ t('nav.analyzer') }}</RouterLink>
    </div>
    <div class="lang" role="group" :aria-label="t('nav.language')">
      <button
        v-for="code in LOCALES"
        :key="code"
        type="button"
        :lang="code"
        :aria-pressed="locale === code"
        @click="setLocale(code)"
      >
        {{ code.toUpperCase() }}
      </button>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped>
.nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
  padding: 10px 16px;
  background: var(--card);
  border-bottom: 1px solid var(--brand-border);
}
.links { display: flex; gap: 8px; }
.links a {
  padding: 8px 16px;
  border-radius: 999px;
  color: var(--brand);
  font-weight: 600;
  text-decoration: none;
}
.links a:hover { background: var(--brand-tint); }
.links a.router-link-exact-active { background: var(--brand); color: #fff; }
.links a:focus-visible, .lang button:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

.lang { display: inline-flex; border: 1px solid var(--brand-border); border-radius: 999px; overflow: hidden; }
.lang button {
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
}
.lang button:hover { background: var(--brand-tint); }
.lang button[aria-pressed='true'] { background: var(--brand); color: #fff; }
</style>
