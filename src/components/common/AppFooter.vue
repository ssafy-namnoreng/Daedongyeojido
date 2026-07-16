<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p>대동여지도 서비스 소개 · 지역 탐험의 새로운 기준</p>
      <span>© 2026 Daedongyeojido</span>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.app-footer {
  max-width: 1180px;
  margin: 24px auto 0;
  padding: 0 24px 28px;
}

.app-footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(44, 35, 24, 0.2);
  padding-top: 18px;
  color: #6b5b45;
  font-size: 12.5px;
}

.app-footer__inner p {
  margin: 0;
}

@media (max-width: 560px) {
  .app-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
