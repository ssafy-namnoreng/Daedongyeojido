<template>
  <button 
    class="custom-chatbot-btn"
    @click="$emit('click')"
    style="
      /* 1. 레이아웃 & 정렬 (이모지와 텍스트 가로 나열) */
      display: inline-flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: center !important;
      white-space: nowrap !important;
      gap: 6px !important;

      /* 2. 홈 화면 .chatbot-float 오리지널 규격 완벽 일치 */
      padding: 13px 18px !important;       /* 홈 화면 패딩 값 */
      border-radius: 999px !important;     /* 동글동글한 알약 형태 */
      font-size: 14px !important;          /* 오리지널 폰트 사이즈 */
      font-weight: 700 !important;
      cursor: pointer !important;

      /* 3. 홈 화면 CSS 테마 변수의 실제 고정값 주입 (투명화 원천 차단) */
      background-color: #2c2318 !important; /* var(--ink)의 실제 값 */
      background: #2c2318 !important;       
      color: #f2e8d3 !important;            /* var(--paper)의 실제 값 */
      border: 1.4px solid #a2712c !important; /* var(--brass)의 실제 값 */
      
      /* 4. 오리지널 입체 효과 */
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24) !important;
    "
  >
    <span>💬</span>
    <span>{{ text }}</span>
  </button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'AI 가이드'
  }
})

defineEmits(['click'])
</script>

<style scoped>
.custom-chatbot-btn {
  font-family: inherit;
  /* 마우스 올렸을 때 부드러운 전환 효과 추가 */
  transition: transform 0.15s ease, box-shadow 0.15s ease !important;
}

/* 마우스 올렸을 때 1px 살짝 떠오르는 오리지널 모션 반영 */
.custom-chatbot-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32) !important;
}
</style>