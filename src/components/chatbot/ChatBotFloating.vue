<template>
  <div class="chatbot-float">
    <MyButton text="AI 가이드" @click="open = true" />

    <div v-if="open" class="chat-panel">
      <div class="chat-header">
        <div>
          <h4>대동여지도 AI 도우미</h4>
          <p>대전 로컬 전문 가이드 봇</p>
        </div>
        <button @click="open = false">×</button>
      </div>

      <div class="chat-body" ref="scrollRef">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['bubble', msg.role === 'user' ? 'user' : 'bot']"
        >
          {{ msg.content }}
        </div>

        <div v-if="isLoading" class="bubble bot typing">
          <div class="loading-dots">
            <span>●</span><span>●</span><span>●</span>
          </div>
        </div>

        <p v-if="errorMessage" class="chat-error">{{ errorMessage }}</p>
      </div>

      <div class="chat-input-row">
        <input
          v-model="message"
          type="text"
          placeholder="예: 이번 주말 대전 축제 추천해줘"
          @keyup.enter="send"
        />
        <button
          @click="send"
          class="send-btn"
          :disabled="isLoading || !message.trim()"
        >
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import MyButton from '@/components/MyButton.vue'
import { buildChatPayload, requestChatReply } from '@/services/chatService'
import { loadRegionCategoryItems } from '@/services/calendarService'

const MAX_HISTORY_LENGTH = 6
const CHAT_HISTORY_KEY = 'chatbot_history'
const OUT_OF_SCOPE_PATTERN = /(날씨|기상|현재 날씨|온도|환율|주식|주가|정책|교통|지진|재난|비행기|항공|대중교통|교통상황|뉴스)/i

const CATEGORY_PATTERNS = [
  { pattern: /(축제|공연|행사)/i, categories: ['축제/공연/행사'] },
  { pattern: /(맛집|음식점|식당)/i, categories: ['음식점'] },
  { pattern: /(숙박|호텔|게스트하우스|모텔)/i, categories: ['숙박'] },
  {
    pattern: /(관광지|레포츠|문화시설|쇼핑|명소|볼거리)/i,
    categories: ['관광지', '레포츠', '문화시설', '쇼핑'],
  },
]

const open = ref(false)
const message = ref('')
const defaultMessages = [
  {
    role: 'assistant',
    content: '안녕하세요! 대전 여행 정보와 이 사이트 사용 방법을 도와드릴게요.',
  },
]
const messages = ref([...defaultMessages])
const isLoading = ref(false)
const errorMessage = ref('')
const scrollRef = ref(null)
const categoryData = ref({})

function loadChatHistory() {
  const saved = localStorage.getItem(CHAT_HISTORY_KEY)
  if (!saved) return

  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) {
      messages.value = parsed
    }
  } catch {
    messages.value = [...defaultMessages]
  }
}

function saveChatHistory() {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.value))
}

watch(
  messages,
  async () => {
    saveChatHistory()

    await nextTick()
    const el = scrollRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  },
  { deep: true }
)

onMounted(async () => {
  loadChatHistory()
  categoryData.value = await loadRegionCategoryItems()
})

function getHistoryMessages() {
  return messages.value.slice(-MAX_HISTORY_LENGTH)
}

function buildSiteContext(text) {
  if (!categoryData.value) return ''

  const matched = CATEGORY_PATTERNS.find(entry => entry.pattern.test(text))
  if (!matched) return ''

  const items = matched.categories.flatMap(cat => categoryData.value[cat] || [])
  const list = items.slice(0, 3).map(item => {
    return `- ${item.title}${item.dateKey ? ` (${item.dateKey})` : ''}${
      item.subtitle ? ` - ${item.subtitle}` : ''
    }`
  })

  if (!list.length) return ''

  return [
    `아래는 이 사이트가 보유한 대전 ${matched.categories.join(', ')} 정보입니다.`,
    ...list,
    '위 정보를 참고해 사용자 질문에 답변해 주세요.',
  ].join('\n')
}

const send = async () => {
  const text = message.value.trim()
  if (!text) return

  errorMessage.value = ''
  messages.value.push({ role: 'user', content: text })
  message.value = ''

  if (OUT_OF_SCOPE_PATTERN.test(text)) {
    messages.value.push({
      role: 'assistant',
      content:
        '죄송합니다. 질문을 이해하지 못했거나, 현재 이 사이트에서 제공하지 않는 정보일 수 있습니다. ' +
        '대전 관광, 맛집, 숙박, 축제, 여행 일정 관련 질문으로 다시 말씀해 주세요.',
    })
    return
  }

  isLoading.value = true
  try {
    const context = buildSiteContext(text)
    const payload = buildChatPayload(text, getHistoryMessages(), context)
    const reply = await requestChatReply(payload)

    if (!reply?.trim()) {
      throw new Error('응답을 받지 못했습니다.')
    }

    messages.value.push({ role: 'assistant', content: reply })
  } catch (error) {
    errorMessage.value =
      error.message || '챗봇 응답 중 오류가 발생했습니다. 다시 시도해주세요.'
    messages.value.push({
      role: 'assistant',
      content:
        '죄송합니다. 질문을 이해하지 못했거나, 현재 이 사이트에서 제공하지 않는 정보일 수 있습니다. ' +
        '대전 관광, 맛집, 숙박, 축제, 여행 일정 관련 질문으로 다시 말씀해 주세요.',
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
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
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
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
.chat-error {
  margin: 4px 2px 0;
  font-size: 11px;
  color: #a63c26;
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
  min-width: 0;
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
  flex-shrink: 0;
}
.chat-input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
