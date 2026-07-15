<template>
  <div class="app-shell">
    <svg class="contour-bg" viewBox="0 0 1200 1600" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d="M-50,180 C 250,120 450,240 750,150 S 1150,220 1350,140" class="contour" />
      <path d="M-80,340 C 220,300 480,400 760,300 S 1160,380 1380,300" class="contour" />
      <path d="M-60,980 C 260,930 470,1040 780,960 S 1180,1030 1360,970" class="contour" />
      <path d="M-60,1140 C 240,1100 500,1200 790,1110 S 1170,1180 1380,1120" class="contour" />
    </svg>

    <header class="topbar">
      <div class="brand" @click="goToHome">
        <div class="brand-seal">
          <img src="/favicon-source.png" alt="대동여지도 로고" />
        </div>
        <div class="brand-copy">
          <h1>대동여지도</h1>
          <p>DAEDONGYEOJIDO · 동네를 그리다</p>
        </div>
      </div>

      <nav class="nav-links">
        <a href="#" @click.prevent="goToHome">홈</a>
        <a href="#" @click.prevent="goToBoard">커뮤니티 게시판</a>
        <a href="#">일정 캘린더</a>
      </nav>
    </header>

    <section class="intro-section">
      <div class="intro-copy">
        <span class="eyebrow">WRITE LOG · 새로운 탐험 기록</span>
        <h2>기록하기</h2>
        <p>
          내가 발견한 대전의 숨은 명소나 특별한 골목길 이야기를 이웃들과 나눌 수 있도록 정성스레 기록해 주세요.
        </p>
      </div>
    </section>

    <main class="main">
      <div class="content-card">
        <h3 class="write-title">✏️ 새 게시글 작성</h3>

        <div v-if="formErrorMessage" class="global-error-banner">
          ⚠️ {{ formErrorMessage }}
        </div>

        <form @submit.prevent="submitPost" class="write-form" novalidate>
          
          <div class="form-grid">
            
            <div class="form-group">
              <label for="category">✒️ 기록 분류</label>
              <select id="category" ref="categoryInput" v-model="postData.category">
                <option v-for="cat in categories" :key="cat.filterName" :value="cat.name">
                  {{ cat.emoji }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group" :class="{ 'has-error': errors.author }">
              <label for="author">👤 작성자 이름 <span class="required">*</span></label>
              <input 
                id="author" 
                ref="authorInput"
                v-model="postData.author" 
                type="text" 
                placeholder="이름을 입력하세요" 
                @input="clearError('author')"
              />
              <span v-if="errors.author" class="field-error-msg">작성자 이름을 적어주세요.</span>
            </div>

            <div class="form-group" :class="{ 'has-error': errors.password }">
              <label for="password">🔒 비밀번호 (숫자 4자리) <span class="required">*</span></label>
              <input 
                id="password" 
                ref="passwordInput"
                v-model="postData.password" 
                type="password" 
                placeholder="숫자 4자리 입력" 
                @input="handlePasswordInput"
              />
              <span v-if="errors.password" class="field-error-msg">{{ errors.password }}</span>
            </div>
            
          </div>

          <div class="form-group full-width" :class="{ 'has-error': errors.title }">
            <label for="title">📍 이야기 제목 <span class="required">*</span></label>
            <input 
              id="title" 
              ref="titleInput"
              v-model="postData.title" 
              type="text" 
              placeholder="제목을 입력하세요" 
              @input="clearError('title')"
            />
            <span v-if="errors.title" class="field-error-msg">이야기 제목을 채워주세요.</span>
          </div>

          <div class="form-group full-width" :class="{ 'has-error': errors.content }">
            <label for="content">📜 기록 본문 <span class="required">*</span></label>
            <textarea 
              id="content" 
              ref="contentInput"
              v-model="postData.content" 
              rows="12" 
              placeholder="내용을 작성하세요" 
              @input="clearError('content')"
            ></textarea>
            <span v-if="errors.content" class="field-error-msg">기록 본문을 작성해주세요.</span>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="goToBoard">
              취소
            </button>
            <button type="submit" class="submit-btn">
              등록하기
            </button>
          </div>

        </form>
      </div>
    </main>

    <footer class="footer">
      <div>
        <h4>🗺️ 대동여지도</h4>
        <p>대전 동네 로컬 제보와 여행 정보를 함께 나누는 따뜻한 커뮤니티입니다.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/store/board'

const router = useRouter()
const store = useBoardStore()

const { categories } = storeToRefs(store)

// 폼 입력 데이터 상태 관리
const postData = ref({
  category: '관광',
  author: '',
  password: '',
  title: '',
  content: ''
})

// 각 필드별 에러 메시지 상태 관리
const errors = ref({
  author: false,
  password: '',
  title: false,
  content: false
})

// 상단 알림 배너 메시지
const formErrorMessage = ref('')

// DOM 포커싱용 ref 정의
const authorInput = ref(null)
const passwordInput = ref(null)
const titleInput = ref(null)
const contentInput = ref(null)

function goToHome() {
  router.push('/')
}

function goToBoard() {
  router.push('/board')
}

/**
 * 비밀번호 실시간 검증 및 가공 핸들러
 * 1. 숫자가 아닌 문자는 실시간으로 제거합니다.
 * 2. 4자리가 넘어가면 자동으로 뒤를 잘라내 강력하게 제재합니다.
 */
function handlePasswordInput(e) {
  clearError('password')
  
  // 숫자가 아닌 문자 제거
  let cleanValue = e.target.value.replace(/\D/g, '')
  
  // 4자리 제재
  if (cleanValue.length > 4) {
    cleanValue = cleanValue.slice(0, 4)
  }
  
  postData.value.password = cleanValue
}

// 실시간 입력 시 개별 에러 표기 지우기
function clearError(field) {
  if (field === 'password') {
    errors.value.password = ''
  } else {
    errors.value[field] = false
  }
  
  // 에러 상태가 전부 해결되면 상단 배너도 비우기
  if (!errors.value.author && !errors.value.password && !errors.value.title && !errors.value.content) {
    formErrorMessage.value = ''
  }
}

// 유효성 검사 (Validation)
function validateForm() {
  let isValid = true
  formErrorMessage.value = ''
  
  // 초기 에러 초기화
  errors.value = { author: false, password: '', title: false, content: false }

  // 1. 작성자 이름 검사
  if (!postData.value.author.trim()) {
    errors.value.author = true
    isValid = false
  }

  // 2. 제목 검사
  if (!postData.value.title.trim()) {
    errors.value.title = true
    isValid = false
  }

  // 3. 본문 검사
  if (!postData.value.content.trim()) {
    errors.value.content = true
    isValid = false
  }

  // 4. 비밀번호 검사
  const pwd = postData.value.password.trim()
  const isFourDigits = /^\d{4}$/.test(pwd)

  if (!pwd) {
    errors.value.password = '수정/삭제용 비밀번호를 적어주세요.'
    isValid = false
  } else if (!isFourDigits) {
    errors.value.password = '비밀번호는 반드시 숫자 4자리여야 합니다.'
    isValid = false
  }

  return isValid
}

// 새 글 제출
function submitPost() {
  if (!validateForm()) {
    // 폼 검증 탈락 시 상단 배너에 경고 노출 및 첫 에러 필드로 포커스 이동
    formErrorMessage.value = '입력 항목에 오류가 있습니다. 붉게 표시된 영역을 확인해 주세요.'
    
    if (errors.value.author) {
      authorInput.value.focus()
    } else if (errors.value.password) {
      passwordInput.value.focus()
    } else if (errors.value.title) {
      titleInput.value.focus()
    } else if (errors.value.content) {
      contentInput.value.focus()
    }
    return
  }

  // 통과 시 Pinia 저장 및 리다이렉트
  store.addPost({ ...postData.value })
  alert('🎉 성공적으로 기록되었습니다! 게시판으로 이동합니다.')
  router.push('/board')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700;900&family=Noto+Sans+KR:wght@400;500;700;800&display=swap');

/* 공통 고전 스타일 정의 */
.app-shell {
  --paper: #f2e8d3;
  --paper-deep: #e8dab5;
  --ink: #2c2318;
  --ink-soft: #6b5b45;
  --brass: #a2712c;
  --pine: #33553e;
  --route: #a63c26;

  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #fcf7e8 0%, #f7efe0 50%, #f2efdf 100%);
  color: var(--ink);
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
}

.contour-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.9;
}

.contour {
  fill: none;
  stroke: rgba(118, 99, 60, 0.16);
  stroke-width: 2;
  stroke-linecap: round;
}

.topbar,
.intro-section,
.main,
.footer {
  position: relative;
  z-index: 1;
}

/* 상단 네비게이션 바 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 32px;
  background: rgba(248, 241, 224, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(44, 35, 24, 0.14);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.brand-seal {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--paper-deep);
  border: 2px solid var(--brass);
  box-shadow: 0 0 0 3px var(--paper), 0 0 0 4px var(--brass);
  overflow: hidden;
}

.brand-seal img {
  width: 78%;
  height: 78%;
  object-fit: cover;
  border-radius: 50%;
}

.brand-copy h1 {
  margin: 0;
  font-family: 'Noto Serif KR', serif;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.02em;
  color: var(--ink);
}

.brand-copy p {
  margin: 3px 0 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--brass);
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  text-decoration: none;
  color: var(--ink-soft);
  font-weight: 700;
  font-size: 14px;
  position: relative;
  transition: color 0.2s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 1.5px;
  background: var(--route);
  transition: width 0.2s ease;
}

.nav-links a:hover {
  color: var(--ink);
}

.nav-links a:hover::after {
  width: 100%;
}

/* 인트로 타이틀 영역 */
.intro-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 44px 24px 18px;
}

.intro-copy {
  padding-left: 18px;
  border-left: 4px solid var(--brass);
}

.eyebrow {
  display: inline-block;
  color: var(--route);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  border: 1px solid rgba(166, 60, 38, 0.3);
  border-radius: 999px;
  padding: 4px 10px;
  margin-bottom: 10px;
  background: rgba(166, 60, 38, 0.05);
}

.intro-copy h2 {
  margin: 0 0 10px;
  font-size: 40px;
  font-weight: 900;
  line-height: 1.15;
  font-family: 'Noto Serif KR', serif;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.intro-copy p {
  margin: 0;
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.75;
}

/* 글쓰기 본문 카드 */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px 60px;
}

.content-card {
  background: linear-gradient(135deg, #fcf4e6 0%, #f7ebda 100%);
  border: 1px solid #d9c7a5;
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 16px 40px rgba(95, 75, 47, 0.08);
}

/* ✏️ 새 게시글 작성 타이틀 */
.write-title {
  margin: 0 0 24px 0;
  font-family: 'Noto Serif KR', serif;
  font-weight: 900;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: #2c2318;
  border-bottom: 2px solid var(--brass);
  padding-bottom: 14px;
}

/* 전체 경고 배너 */
.global-error-banner {
  background-color: #fdf2f2;
  border: 1px solid #f8b4b4;
  color: #9b1c1c;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 700;
  animation: fadeIn 0.2s ease-out;
}

/* 입력 폼 스타일링 */
.write-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 카테고리, 작성자, 비번 격자 배치 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  width: 100%;
}

.form-group label {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.required {
  color: var(--route);
  margin-left: 2px;
}

/* 인풋 폼 데코레이션 */
.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid #dcd1ba;
  border-radius: 12px;
  background: #fffdf9;
  color: var(--ink);
  padding: 14px 16px;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.25s ease;
  box-shadow: inset 0 2px 4px rgba(44, 35, 24, 0.04);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--brass);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(162, 113, 44, 0.12);
}

/* 에러 감지 스타일 */
.form-group.has-error input,
.form-group.has-error textarea {
  border-color: #e07272;
  background: #fffafa;
}

.form-group.has-error input:focus,
.form-group.has-error textarea:focus {
  border-color: #c93b3b;
  box-shadow: 0 0 0 3px rgba(197, 62, 62, 0.15);
}

.field-error-msg {
  color: #c93b3b;
  font-size: 12px;
  font-weight: 700;
  margin-top: 2px;
}

.form-group textarea {
  resize: vertical;
  line-height: 1.6;
}

/* 제어 버튼들 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px dashed rgba(44, 35, 24, 0.15);
}

.cancel-btn {
  background: #fffcf8;
  border: 1px solid #d8c4a1;
  color: var(--ink-soft);
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f7efe0;
  color: var(--ink);
}

.submit-btn {
  background: linear-gradient(135deg, var(--brass), #8a5722);
  color: #fff8ee;
  border: none;
  padding: 14px 36px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(162, 113, 44, 0.25);
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(162, 113, 44, 0.35);
}

/* 푸터 */
.footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
  color: var(--ink-soft);
  font-size: 13px;
  border-top: 1px solid rgba(44, 35, 24, 0.1);
}

.footer h4 {
  margin: 18px 0 6px;
  color: var(--ink);
  font-size: 14px;
}

.footer p {
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>