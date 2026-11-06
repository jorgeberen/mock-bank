<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="page">
    <p class="code" aria-hidden="true">404</p>
    <h1>{{ t('notFound.title') }}</h1>
    <p class="msg">{{ t('notFound.message') }}</p>
    <RouterLink class="home" to="/">{{ t('notFound.backHome') }}</RouterLink>
  </main>
</template>

<style scoped>
.page { max-width: 480px; margin: 0 auto; padding: 64px 16px; text-align: center; }
.code { margin: 0; font-size: clamp(4rem, 20vw, 7rem); font-weight: 800; line-height: 1; color: var(--brand); }
h1 { margin: 8px 0; color: var(--brand); }
.msg { margin: 0 0 24px; color: var(--muted); }
.home {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.home:hover { background: var(--brand-dark); }
.home:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
</style>
