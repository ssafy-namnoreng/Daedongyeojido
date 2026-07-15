<template>
  <div class="chatbot-wrapper">
    <button
      v-if="!open"
      class="chatbot-toggle"
      @click="toggleOpen"
      :aria-expanded="open"
    >
      💬 AI 가이드
    </button>

    <div v-if="open" class="chatbot-panel">
      <div class="chatbot-header">
        <strong>AI 가이드</strong>
        <button @click="toggleOpen">✕</button>
      </div>

      <div class="chatbot-body" ref="scrollRef">
        <div
          v-for="(item, index) in messages"
          :key="index"
          :class="['chat-row', item.role]"
        >
          <div class="chat-bubble">
            <span>{{ item.content }}</span>
          </div>
        </div>

        <div v-if="isLoading" class="chat-loading">응답을 불러오는 중...</div>
        <div v-if="errorMessage" class="chat-error">{{ errorMessage }}</div>
      </div>

      <div class="chatbot-input">
        <input
          v-model="message"
          @keyup.enter="send"
          placeholder="예: 이번 주말 대전 축제 추천해줘"
        />
        <button @click="send" :disabled="isLoading || !message.trim()">
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { buildChatPayload, requestChatReply } from '@/services/chatService'
import { loadRegionCategoryItems } from '@/services/calendarService'

const MAX_HISTORY_LENGTH = 3
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
const messages = ref([
  {
    role: 'assistant',
    content: '안녕하세요! 대전 여행 정보와 이 사이트 사용 방법을 도와드릴게요.',
  },
])
const isLoading = ref(false)
const errorMessage = ref('')
const scrollRef = ref(null)
const categoryData = ref({})

const toggleOpen = () => {
  open.value = !open.value
}

watch(messages, async () => {
  await nextTick()
  const el = scrollRef.value
  if (el) el.scrollTop = el.scrollHeight
})

onMounted(async () => {
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
.chatbot-wrapper {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.chatbot-toggle {
  background: #3f2b20;
  color: #f2e8d3;
  padding: 12px 14px;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(63, 43, 32, 0.25);
  border: 1px solid rgba(224, 186, 115, 0.4);
  cursor: pointer;
  font-weight: 700;
}

.chatbot-toggle:hover {
  background: #5b412c;
}

.chatbot-panel {
  width: 340px;
  background: #f8f1de;
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(2, 6, 23, 0.18);
  overflow: hidden;
  border: 1px solid rgba(162, 113, 44, 0.2);
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #3f2b20;
  color: #f2e8d3;
  font-weight: 800;
}

.chatbot-header button {
  background: transparent;
  color: #f2e8d3;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.chatbot-body {
  padding: 14px 16px;
  min-height: 210px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff7e5;
}

.chat-row {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}

.chat-row.user {
  justify-content: flex-end;
}

.chat-row.assistant {
  justify-content: flex-start;
}

.chat-bubble {
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 75%;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
  background: #f6e8cf;
  color: #3f2b20;
  box-shadow: 0 6px 16px rgba(51, 85, 62, 0.08);
}

.chat-row.user .chat-bubble {
  background: #3f2b20;
  color: #f2e8d3;
}

.chat-loading {
  color: #64748b;
  font-size: 13px;
  padding: 6px 0;
}

.chat-error {
  color: #9d2a2b;
  font-size: 13px;
  margin-top: 8px;
}

.chatbot-input {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid rgba(162, 113, 44, 0.16);
  background: #f2e8d3;
}

.chatbot-input input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(131, 153, 123, 0.4);
  background: #fff;
  color: #3f2b20;
}

.chatbot-input button {
  padding: 10px 14px;
  background: #a2712c;
  color: #f2e8d3;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}

.chatbot-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>