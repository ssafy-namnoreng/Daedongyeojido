cat > src/components/chatbot/ChatBotFloating.vue <<'Vue'
<template>
  <div class="chatbot-wrapper">
    <button class="chatbot-toggle" @click="toggleOpen" :aria-expanded="open">
      💬 AI 가이드
    </button>

    <div v-if="open" class="chatbot-panel">
      <div class="chatbot-header">
        <strong>AI 가이드</strong>
        <button @click="toggleOpen">✕</button>
      </div>
      <div class="chatbot-body">
        <p style="color:#64748b">챗봇 연동 전 샘플 안내: 여행지 추천/일정 문의 가능</p>
      </div>
      <div class="chatbot-input">
        <input v-model="message" placeholder="예: 이번 주말 가볼만한 축제 알려줘" />
        <button @click="send">전송</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const open = ref(false);
const message = ref('');
const toggleOpen = () => open.value = !open.value;
const send = () => {
  if (!message.value.trim()) return;
  // TODO: 실제 OpenAI 연동 시 서비스 호출
  alert('전송: ' + message.value);
  message.value = '';
};
</script>

<style scoped>
.chatbot-wrapper { position:fixed; right:20px; bottom:20px; z-index:60; display:flex; flex-direction:column; align-items:flex-end; gap:8px;}
.chatbot-toggle { background:#237B47; color:#fff; padding:12px 14px; border-radius:999px; box-shadow:0 8px 24px rgba(0,0,0,0.15); border:none; cursor:pointer; }
.chatbot-panel { width:320px; background:#fff; border-radius:12px; box-shadow:0 18px 50px rgba(2,6,23,0.2); overflow:hidden; }
.chatbot-header { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#237B47; color:#fff;}
.chatbot-body { padding:12px 14px; min-height:120px; }
.chatbot-input { display:flex; gap:8px; padding:10px; border-top:1px solid #f1f5f9; }
.chatbot-input input { flex:1; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; }
.chatbot-input button { padding:8px 12px; background:#237B47; color:#fff; border:none; border-radius:8px; }
</style>
Vue