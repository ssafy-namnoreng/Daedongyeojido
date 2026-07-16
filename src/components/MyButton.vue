<template>
  <button class="custom-chatbot-btn" @click="$emit('click')">
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  font-family: inherit;

  padding: 12px 18px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  /* 다른 페이지(홈·게시판·캘린더)와 동일한 지도풍 테마 변수 사용,
     app-shell 밖에서 쓰일 경우를 대비해 실제 값을 기본값으로 지정 */
  background: var(--pine, #33553e);
  color: #f6f0de;
  border: none;
  box-shadow: 0 8px 20px rgba(51, 85, 62, 0.24);

  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.custom-chatbot-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(51, 85, 62, 0.32);
}
</style>