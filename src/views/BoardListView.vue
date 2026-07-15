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
        <a href="#" @click.prevent="goToCalendar">일정 캘린더</a>
      </nav>
    </header>

    <section class="intro-section">
      <div class="intro-copy">
        <span class="eyebrow">LOG BOARD · 탐험 기록부</span>
        <h2>동네 소식통</h2>
        <p>
          대전을 가장 잘 아는 로컬들이 실시간으로 제보하는 생생하고 가치 있는 동네 이야기를 만나보세요.
        </p>
      </div>
    </section>

    <main class="main">
      <section class="content-card">
        <div class="filter-row">
          <button
            @click="selectCategory('전체')"
            :class="selectedCategory === '전체' ? 'chip active' : 'chip'"
          >
            👣 전체보기
          </button>

          <button
            v-for="cat in categories"
            :key="cat.filterName"
            @click="selectCategory(cat.filterName)"
            :class="selectedCategory === cat.filterName ? 'chip active' : 'chip'"
          >
            <span>{{ cat.emoji }}</span> {{ cat.name }}
          </button>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <span>🔍</span>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="동네 소식 검색... (제목 + 내용 검색)"
            />
          </div>

          <div class="toolbar-actions">
            <select v-model="sortBy">
              <option value="latest">📅 최신순</option>
              <option value="views">👀 조회수순</option>
              <option value="likes">👍 추천순</option>
            </select>

            <button class="write-btn" @click="openCreatePostModal">✏️ 새 게시글 작성</button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>분류</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회</th>
                <th>추천</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in paginatedPosts" :key="post.id" @click="viewPostDetail(post)">
                <td>
                  <span
                    class="post-tag"
                    :style="{ backgroundColor: getCategoryColor(post.category) }"
                  >
                    {{ post.category }}
                  </span>
                </td>
                <td class="title-cell">{{ post.title }}</td>
                <td>{{ post.author }}</td>
                <td>{{ post.views }}</td>
                <td>{{ post.likes }}</td>
                <td>{{ formatPCDate(post.createdAt) }}</td>
              </tr>

              <tr v-if="filteredPosts.length === 0">
                <td colspan="6" class="empty-state">
                  검색 결과나 해당 카테고리에 등록된 게시글이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button @click="changePage(1)" :disabled="currentPage === 1">««</button>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">«</button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="currentPage === page ? 'page-btn active' : 'page-btn'"
          >
            {{ page }}
          </button>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">»</button>
          <button @click="changePage(totalPages)" :disabled="currentPage === totalPages">»»</button>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div>
        <h4>🗺️ 대동여지도</h4>
        <p>대전 동네 로컬 제보와 여행 정보를 함께 나누는 따뜻한 커뮤니티입니다.</p>
      </div>
    </footer>

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

    <div v-if="selectedPost" class="modal-overlay" @click.self="selectedPost = null">
      <div class="modal-card">
        <div class="modal-head">
          <h3>{{ selectedPost.title }}</h3>
          <button @click="selectedPost = null">×</button>
        </div>
        <div class="meta">
          <span>🏷️ {{ selectedPost.category }}</span>
          <span>✍️ {{ selectedPost.author }}</span>
          <span>👀 조회수 {{ selectedPost.views }}</span>
          <span>👍 추천수 {{ selectedPost.likes }}</span>
          <span>📅 {{ formatPCDate(selectedPost.createdAt) }}</span>
        </div>
        <div class="modal-content">{{ selectedPost.content }}</div>
        <div class="modal-actions">
          <button class="write-btn" @click="likePost(selectedPost)">👍 추천하기</button>
          <button class="secondary-btn" @click="promptPasswordCheck('edit')">✏️ 수정하기</button>
          <button class="secondary-btn" @click="promptPasswordCheck('delete')">🗑️ 삭제하기</button>
          <button class="secondary-btn" @click="selectedPost = null">닫기</button>
        </div>
      </div>
    </div>

    <div v-if="isCreateModalOpen" class="modal-overlay" @click.self="isCreateModalOpen = false">
      <div class="modal-card">
        <div class="modal-head">
          <h3>✏️ 새 게시글 작성</h3>
          <button @click="isCreateModalOpen = false">×</button>
        </div>
        <div class="form-grid">
          <label>
            분류 선택
            <select v-model="newPost.category">
              <option v-for="cat in categories" :key="cat.filterName" :value="cat.name">
                {{ cat.emoji }} {{ cat.name }}
              </option>
            </select>
          </label>
          <label>
            작성자명
            <input v-model="newPost.author" type="text" placeholder="이름을 입력하세요" />
          </label>
          <label>
            비밀번호
            <input
              v-model="newPost.password"
              type="password"
              inputmode="numeric"
              maxlength="4"
              placeholder="수정·삭제용 숫자 4자리"
              @input="newPost.password = sanitizePin(newPost.password)"
            />
          </label>
          <label class="full">
            제목
            <input v-model="newPost.title" type="text" placeholder="제목을 입력하세요" />
          </label>
          <label class="full">
            내용
            <textarea v-model="newPost.content" rows="6" placeholder="내용을 작성하세요"></textarea>
          </label>
        </div>
        <div class="form-actions" style="margin-top: 18px;">
          <button class="write-btn" @click="submitNewPost">등록하기</button>
          <button class="secondary-btn" @click="isCreateModalOpen = false">취소</button>
        </div>
      </div>
    </div>

    <div v-if="isEditModalOpen" class="modal-overlay" @click.self="isEditModalOpen = false">
      <div class="modal-card">
        <div class="modal-head">
          <h3>✏️ 게시글 수정</h3>
          <button @click="isEditModalOpen = false">×</button>
        </div>
        <div class="form-grid">
          <label class="full">
            제목
            <input v-model="editPost.title" type="text" placeholder="제목을 입력하세요" />
          </label>
          <label class="full">
            내용
            <textarea v-model="editPost.content" rows="6" placeholder="내용을 작성하세요"></textarea>
          </label>
        </div>
        <div class="form-actions" style="margin-top: 18px;">
          <button class="write-btn" @click="submitEditPost">수정 완료</button>
          <button class="secondary-btn" @click="isEditModalOpen = false">취소</button>
        </div>
      </div>
    </div>

    <div v-if="isPasswordModalOpen" class="modal-overlay" @click.self="isPasswordModalOpen = false">
      <div class="modal-card compact">
        <div class="modal-head">
          <h3>🔒 비밀번호 확인</h3>
          <button @click="isPasswordModalOpen = false">×</button>
        </div>
        <div class="form-grid">
          <label>
            게시글 비밀번호
            <input
              v-model="passwordInput"
              type="password"
              inputmode="numeric"
              maxlength="4"
              placeholder="숫자 4자리"
              @input="passwordInput = sanitizePin(passwordInput)"
              @keyup.enter="validatePasswordAndCommit"
            />
          </label>
          <p v-if="passwordError" class="error">비밀번호가 일치하지 않습니다.</p>
        </div>
        <div class="form-actions" style="margin-top: 18px;">
          <button class="write-btn" @click="validatePasswordAndCommit">확인</button>
          <button class="secondary-btn" @click="isPasswordModalOpen = false">취소</button>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/store/board'
import MyButton from '@/components/MyButton.vue'

const router = useRouter()
const store = useBoardStore()
const { posts, categories } = storeToRefs(store)

const selectedCategory = ref('전체')
const searchKeyword = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = 8

function selectCategory(name) {
  selectedCategory.value = name
  currentPage.value = 1
}

const filteredPosts = computed(() => {
  let list = [...posts.value]

  if (selectedCategory.value !== '전체') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  const keyword = searchKeyword.value.trim().toLowerCase()
  if (keyword) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword)
    )
  }

  if (sortBy.value === 'views') {
    list.sort((a, b) => b.views - a.views)
  } else if (sortBy.value === 'likes') {
    list.sort((a, b) => b.likes - a.likes)
  } else {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPosts.value.length / pageSize))
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function getCategoryColor(category) {
  return store.getCategoryColor(category)
}

function formatPCDate(dateStr) {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

const selectedPost = ref(null)

function viewPostDetail(post) {
  store.incrementViews(post.id)
  selectedPost.value = post
}

function likePost(post) {
  if (!post) return
  store.likePost(post.id)
}

const isCreateModalOpen = ref(false)
const newPost = ref({
  category: '⛰️ 관광',
  author: '',
  password: '',
  title: '',
  content: ''
})

function openCreatePostModal() {
  newPost.value = { category: '⛰️ 관광', author: '', password: '', title: '', content: '' }
  isCreateModalOpen.value = true
}

function submitNewPost() {
  if (!newPost.value.author || !newPost.value.title || !newPost.value.content) {
    showToast('작성자·제목·내용을 모두 입력해 주세요')
    return
  }
  if (!/^\d{4}$/.test(newPost.value.password)) {
    showToast('비밀번호는 숫자 4자리여야 합니다')
    return
  }
  const created = store.addPost({ ...newPost.value })
  if (!created) {
    showToast('게시글 등록에 실패했습니다')
    return
  }
  isCreateModalOpen.value = false
  selectedCategory.value = '전체'
  currentPage.value = 1
  showToast('게시글이 등록되었습니다')
}

const isPasswordModalOpen = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)
const pendingAction = ref(null)

// 비밀번호는 숫자 4자리로만 관리 (숫자 외 제거 + 4자리 컷)
function sanitizePin(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 4)
}

function promptPasswordCheck(action) {
  pendingAction.value = action
  passwordInput.value = ''
  passwordError.value = false
  isPasswordModalOpen.value = true
}

function validatePasswordAndCommit() {
  if (!selectedPost.value) return

  if (pendingAction.value === 'delete') {
    const success = store.deletePost(selectedPost.value.id, passwordInput.value)
    if (success) {
      isPasswordModalOpen.value = false
      selectedPost.value = null
      showToast('게시글이 삭제되었습니다')
    } else {
      passwordError.value = true
    }
  } else if (pendingAction.value === 'edit') {
    if (store.verifyPassword(selectedPost.value.id, passwordInput.value)) {
      verifiedPassword.value = sanitizePin(passwordInput.value)
      isPasswordModalOpen.value = false
      openEditModal()
    } else {
      passwordError.value = true
    }
  }
}

// 수정 모달 상태
const isEditModalOpen = ref(false)
const verifiedPassword = ref('')
const editPost = ref({ id: null, title: '', content: '' })

// 비밀번호 확인 통과 후, 현재 글 내용으로 수정 폼을 채워 연다
function openEditModal() {
  const p = selectedPost.value
  if (!p) return
  editPost.value = { id: p.id, title: p.title, content: p.content }
  isEditModalOpen.value = true
}

function submitEditPost() {
  if (!editPost.value.title.trim() || !editPost.value.content.trim()) {
    showToast('제목과 내용을 모두 입력해 주세요')
    return
  }

  const success = store.updatePost(editPost.value.id, verifiedPassword.value, {
    title: editPost.value.title.trim(),
    content: editPost.value.content.trim()
  })

  if (success) {
    isEditModalOpen.value = false
    verifiedPassword.value = ''
    showToast('게시글이 수정되었습니다')
  } else {
    showToast('수정에 실패했습니다')
  }
}

const toastMessage = ref('')
let toastTimer = null

function showToast(message) {
  toastMessage.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2500)
}

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

// 홈 화면으로 이동하는 라우터 함수
function goToHome() {
  router.push('/')
}

// 게시판 목록 화면으로 이동하는 라우터 함수 (메뉴 활성화용)
function goToBoard() {
  router.push('/board')
}

// 일정 캘린더 화면으로 이동하는 라우터 함수
function goToCalendar() {
  router.push('/calendar')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700;900&family=Noto+Sans+KR:wght@400;500;700;800&display=swap');

:global(body) {
  margin: 0;
  background: linear-gradient(135deg, #fcf7e8 0%, #f7efe0 50%, #f2efdf 100%);
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
}

:global(*) {
  box-sizing: border-box;
}

.app-shell {
  /* HomeView와 동일한 컬러 테마 변수 이식 */
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

.intro-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 44px 24px 18px;
}

.intro-copy {
  padding-left: 18px;
  border-left: 4px solid #6d7b34;
}

.eyebrow {
  display: inline-block;
  color: #a14c2f;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  border: 1px solid rgba(161, 76, 47, 0.3);
  border-radius: 999px;
  padding: 4px 8px;
  margin-bottom: 8px;
}

.intro-copy h2 {
  margin: 0 0 8px;
  font-size: 42px;
  font-weight: 900;
  line-height: 1.15;
  font-family: 'Noto Serif KR', serif;
  color: #2d241c;
  letter-spacing: -0.02em;
}

.intro-copy p {
  margin: 0;
  font-size: 15px;
  color: #6f5f47;
  line-height: 1.75;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px 60px;
}

.content-card {
  background: linear-gradient(135deg, #fcf4e6 0%, #f7ebda 100%);
  border: 1px solid #d9c7a5;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(95, 75, 47, 0.08);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #d8c4a1;
  background: #f8edd9;
  color: #3f3427;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}

.chip.active {
  background: linear-gradient(135deg, #6d7b34, #4d5f25);
  color: #f8f1e2;
  border-color: #4d5f25;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffdf8;
  border: 1px solid #e0cfaa;
  border-radius: 12px;
  padding: 10px 12px;
}

.search-box input,
.toolbar select,
.form-grid input,
.form-grid select,
.form-grid textarea,
.modal-card input {
  border: 1px solid #e0cfaa;
  border-radius: 12px;
  background: #fffdf8;
  color: #3f3427;
  padding: 10px 12px;
  outline: none;
  font-size: 13px;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.toolbar select {
  min-width: 110px;
}

.write-btn {
  background: linear-gradient(135deg, #a8672c, #8a5722);
  color: #fff8ee;
  padding: 10px 14px;
  box-shadow: 0 8px 16px rgba(168, 103, 44, 0.2);
  border: none;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 700;
}

.table-wrap {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid #e8d9c0;
  background: rgba(255, 255, 255, 0.95);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #efe3d0;
  text-align: left;
  font-size: 13px;
}

th {
  background: #f7ecdb;
  color: #6c5741;
  font-weight: 800;
}

tbody tr {
  cursor: pointer;
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: #f9f0e1;
}

.title-cell {
  font-weight: 700;
  color: #2d241c;
}

.post-tag {
  display: inline-block;
  color: #fff;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 32px 12px;
  color: #6f5f47;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.pagination button,
.page-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #d8c4a1;
  background: #fffdf8;
  border-radius: 10px;
  color: #3f3427;
  font-weight: 700;
  cursor: pointer;
}

.pagination button.active,
.page-btn.active {
  background: linear-gradient(135deg, #6d7b34, #4d5f25);
  color: white;
  border-color: #4d5f25;
}

.footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
  color: #7a694f;
  font-size: 14px;
}

.footer h4 {
  margin: 0;
  color: #2f2922;
}

.chatbot-float {
  position: fixed;   /* 화면에 고정 */
  bottom: 20px;      /* 아래에서 20px 띄우기 */
  right: 20px;       /* 우측에서 20px 띄우기 */
  z-index: 999;      /* 다른 화면 요소보다 위에 뜨도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.chat-panel {
  width: 340px;
  height: 480px;
  background: #fcf3e4;
  border: 2px solid #a8672c;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, #6d7b34, #4d5f25);
  color: #fff;
}

.chat-header h4 {
  margin: 0 0 2px;
  font-size: 14px;
}

.chat-header p {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.chat-header button {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.chat-body {
  height: 340px;
  padding: 14px;
  overflow-y: auto;
  background: rgba(248, 237, 217, 0.5);
}

.bubble {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 16px;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.bubble.user {
  margin-left: auto;
  background: #6d7b34;
  color: #f8f1e2;
}

.bubble.bot {
  background: #fffdf8;
  color: #2d241c;
  border: 1px solid #e8d9c0;
}

.typing {
  display: flex;
  gap: 4px;
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
  background: #fcf3e4;
  border-top: 1px solid #e8d9c0;
}

.chat-input-row input {
  flex: 1;
  border: 1px solid #e0cfaa;
  border-radius: 12px;
  padding: 9px 10px;
  background: #fffdf8;
}

.chat-input-row button {
  background: #6d7b34;
  color: white;
  padding: 9px 12px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.chat-toggle {
  padding: 12px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6d7b34, #4d5f25);
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 35, 24, 0.64);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 20px;
}

.modal-card {
  width: min(720px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 24px;
  background: #fcf3e4;
  border: 2px solid #a8672c;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
  padding: 24px;
}

.modal-card.compact {
  width: 360px;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-head h3 {
  margin: 0;
  font-size: 20px;
  color: #2d241c;
}

.modal-head button {
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #6c5741;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6c5741;
  margin-bottom: 14px;
}

.modal-content {
  color: #2d241c;
  line-height: 1.75;
  white-space: pre-wrap;
}

.modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.secondary-btn {
  border: 1px solid #e0cfaa;
  background: #fffdf8;
  color: #3f3427;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
}

.form-grid {
  display: grid;
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #2d241c;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #2d241c;
  color: #f8f1e2;
  padding: 10px 16px;
  border-radius: 999px;
  z-index: 80;
  font-size: 13px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.error {
  color: #a14c2f;
  font-size: 12px;
  font-weight: 700;
  margin-top: 6px;
}
</style>