const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-5-mini'

if (!OPENAI_API_URL) {
  throw new Error('VITE_OPENAI_API_URL이 설정되어 있지 않습니다.')
}
if (!OPENAI_API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY가 설정되어 있지 않습니다.')
}

export function createSystemPrompt() {
  return {
    role: 'system',
    content:
      '너는 대전 지역 여행 가이드이자 이 웹사이트의 안내 도우미다. ' +
      '사용자가 대전 관광지, 맛집, 숙박, 축제, 여행 일정 관련 질문을 하면 친절하고 구체적으로 답해줘. ' +
      '이 사이트가 제공하는 대전 정보를 기반으로 답변하고, 실시간 정보는 제공하지 않는다. ' +
      '사이트 범위를 벗어난 질문에는 “질문을 이해하지 못했거나, 현재 이 사이트에서 제공하지 않는 정보일 수 있습니다.”라고 정중히 안내해줘.',
  }
}

export function buildChatPayload(userMessage, history = [], context = '') {
  const messages = [createSystemPrompt(), ...history]

  if (context) {
    messages.push({
      role: 'system',
      content: context,
    })
  }

  messages.push({
    role: 'user',
    content: userMessage,
  })

  return messages
}

export async function requestChatReply(messages) {
  const body = {
    model: OPENAI_MODEL,
    messages,
    temperature: 1,
    // gpt-5 계열은 추론 모델이라 기본값이면 추론 토큰이 예산을 다 소모해
    // content가 빈 문자열로 반환된다. 추론을 최소화하고 출력 예산을 확보한다.
    reasoning_effort: 'minimal',
    max_completion_tokens: 700,
  }

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  console.log('OpenAI raw response:', text)

  if (!res.ok) {
    let errorMessage = text
    try {
      const json = JSON.parse(text)
      errorMessage = json.error?.message || text
    } catch {
      // ignore parse error
    }
    throw new Error(`Chat API 오류: ${res.status} ${errorMessage}`)
  }

  const data = JSON.parse(text)
  console.log('OpenAI parsed data:', data)

  const content = data.choices?.[0]?.message?.content || ''
  return content.trim()
}