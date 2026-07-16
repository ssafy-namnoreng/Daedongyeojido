<template>
  <div class="chatbot-float">
    <MyButton text="AI 가이드" @click="isChatOpen = true" />
    
    <div v-if="isChatOpen" class="chat-panel">
      <div class="chat-header">
        <div>
          <h4>대동여지도 AI 도우미</h4>
          <p>대전 로컬 전문 가이드 봇</p>
        </div>
        <button @click="isChatOpen = false">×</button>
      </div>

      <div class="chat-body" ref="scrollRef">
        <div 
          v-for="(msg, idx) in chatMessages" 
          :key="idx" 
          :class="['bubble', msg.role]"
        >
          {{ msg.content }}
        </div>
        <div v-if="isChatTyping" class="bubble bot typing">
          <div class="loading-dots">
            <span>●</span><span>●</span><span>●</span>
          </div>
        </div>
      </div>

      <div class="chat-input-row">
        <input 
          v-model="userQuery" 
          type="text" 
          placeholder="메시지를 입력해 주세요..." 
          @keyup.enter="sendChatMessage"
        />
        <button @click="sendChatMessage" class="send-btn">전송</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import MyButton from '@/components/MyButton.vue'

const isChatOpen = ref(false)
const isChatTyping = ref(false)
const userQuery = ref('')
const scrollRef = ref(null)
const chatMessages = ref([
  { role: 'bot', content: '안녕하세요! 대동여지도 AI 가이드예요. 대전 어디가 궁금하세요?' }
])

async function scrollChatToBottom() {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

function sendChatMessage() {
  const query = userQuery.value.trim()
  if (!query) return

  chatMessages.value.push({ role: 'user', content: query })
  userQuery.value = ''
  isChatTyping.value = true
  scrollChatToBottom()

  setTimeout(() => {
    chatMessages.value.push({
      role: 'bot',
      content: `"${query}"에 대한 정보는 곧 연결될 예정이에요. 지도 위 동네 소식통 게시판도 함께 참고해보세요!`
    })
    isChatTyping.value = false
    scrollChatToBottom()
  }, 700)
}
</script>

<style scoped>
.chatbot-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  --paper: #f2e8d3;
  --pine: #33553e;
  --ink: #2c2318;
  --ink-soft: #6b5b45;
}
.chat-panel {
  width: 340px;
  height: 480px;
  background: var(--paper);
  border: 1px solid rgba(44, 35, 24, 0.18);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(44, 35, 24, 0.16);
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--pine);
  color: #f6f0de;
}
.chat-header h4 {
  margin: 0 0 2px;
  font-family: 'Noto Serif KR', serif;
  font-size: 14px;
}
.chat-header p {
  margin: 0;
  font-size: 11px;
  color: rgba(246, 240, 222, 0.8);
}
.chat-header button {
  background: transparent;
  border: none;
  color: #f6f0de;
  font-size: 20px;
  cursor: pointer;
}
.chat-body {
  height: 340px;
  padding: 14px;
  overflow-y: auto;
  background: rgba(248, 241, 224, 0.5);
}
.bubble {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 1.5;
}
.bubble.user {
  margin-left: auto;
  background: var(--pine);
  color: #f6f0de;
}
.bubble.bot {
  background: rgba(248, 241, 224, 0.9);
  color: var(--ink);
  border: 1px solid rgba(44, 35, 24, 0.15);
}
.typing {
  display: flex;
  gap: 4px;
  color: var(--ink-soft);
}
.typing span {
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}
.chat-input-row {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--paper);
  border-top: 1px solid rgba(44, 35, 24, 0.15);
}
.chat-input-row input {
  flex: 1;
  border: 1px solid rgba(44, 35, 24, 0.18);
  border-radius: 4px;
  padding: 9px 10px;
  background: rgba(248, 241, 224, 0.7);
  color: var(--ink);
  outline: none;
  font-family: inherit;
}
.chat-input-row button {
  background: var(--pine);
  color: #f6f0de;
  padding: 9px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
}
</style>