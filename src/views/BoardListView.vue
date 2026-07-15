<!-- filepath: c:\team_project\Daedongyeojido\src\views\BoardListView.vue -->
<template>
  <section>
    <!-- 1. AppHeader (상단 네비게이션) -->
    <header class="sticky top-0 bg-[#F2EADA]/90 backdrop-blur-md z-40 border-b border-[#82997B]/30 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <!-- 브랜드 로고 영역 -->
        <div class="flex items-center gap-2 cursor-pointer" @click="goToHome">
          <span class="text-2xl">🗺️</span>
          <h1 class="text-xl font-bold tracking-tight flex items-center font-serif text-[#3F2B20]">
            대동여지도
            <span class="text-xs text-[#237B47] font-semibold bg-[#237B47]/10 px-1.5 py-0.5 rounded ml-2 font-sans">Daedongyeojido</span>
          </h1>
        </div>

        <!-- 네비게이션 메뉴 -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-semibold">
          <a href="#" @click.prevent="goToHome" class="hover:text-[#237B47] transition-colors pb-1">홈</a>
          <a href="#" @click.prevent="selectCategory('⛰️ 관광')" :class="['transition-colors pb-1', selectedCategory === '⛰️ 관광' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">⛰️ 관광지</a>
          <a href="#" @click.prevent="selectCategory('🍲 맛집')" :class="['transition-colors pb-1', selectedCategory === '🍲 맛집' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">🍲 맛집</a>
          <a href="#" @click.prevent="selectCategory('🎪 축제')" :class="['transition-colors pb-1', selectedCategory === '🎪 축제' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">🎪 축제</a>
          <a href="#" @click.prevent="selectCategory('💬 자유')" :class="['transition-colors pb-1', selectedCategory === '💬 자유' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">💬 소식통</a>
        </nav>

        <div class="flex items-center gap-3">
          <button
            @click="isChatOpen = !isChatOpen"
            class="bg-[#237B47] hover:bg-[#1C6339] text-[#F2EADA] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border border-[#E0BA73]/40"
          >
            <span>🧭</span> AI 가이드
          </button>
        </div>
      </div>
    </header>

    <!-- 2. 게시판 헤더 및 인트로 배너 -->
    <section class="max-w-5xl w-full mx-auto px-4 pt-10 pb-4">
      <div class="border-l-4 border-[#237B47] pl-4">
        <h2 class="text-2xl md:text-3xl font-bold font-serif text-[#3F2B20] flex items-center gap-2">
          📢 동네 소식통
        </h2>
        <p class="text-xs md:text-sm text-[#82997B] mt-1.5 font-medium leading-relaxed">
          대전을 가장 잘 아는 로컬들이 실시간으로 제보하는 생생하고 가치 있는 동네 이야기를 만나보세요.
        </p>
      </div>
    </section>

    <!-- 3. 메인 기능 영역 (필터, 검색, 리스트) -->
    <main class="flex-grow max-w-5xl w-full mx-auto px-4 pb-16">
      <div class="bg-[#FBF9F4] rounded-3xl p-6 md:p-8 border-2 border-[#82997B]/30 shadow-lg relative">
        <div class="absolute top-2 left-2 right-2 bottom-2 rounded-[22px] border border-[#82997B]/10 pointer-events-none"></div>

        <!-- 카테고리 가로 필터 탭 -->
        <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-4 mb-6 scrollbar-none relative z-10">
          <button
            @click="selectCategory('전체')"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-xs',
              selectedCategory === '전체'
                ? 'bg-[#237B47] text-[#F2EADA] border-[#237B47]'
                : 'bg-[#F2EADA] text-[#3F2B20]/80 border-[#82997B]/30 hover:bg-[#82997B]/10'
            ]"
          >
            👣 전체보기
          </button>
          <button
            v-for="cat in categories"
            :key="cat.filterName"
            @click="selectCategory(cat.filterName)"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-xs flex items-center gap-1',
              selectedCategory === cat.filterName
                ? 'bg-[#237B47] text-[#F2EADA] border-[#237B47]'
                : 'bg-[#F2EADA] text-[#3F2B20]/80 border-[#82997B]/30 hover:bg-[#82997B]/10'
            ]"
          >
            <span>{{ cat.emoji }}</span> {{ cat.name }}
          </button>
        </div>

        <!-- 검색바 및 정렬, 글쓰기 영역 -->
        <div class="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center mb-6 relative z-10">
          <div class="relative flex-grow max-w-md">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-sm">🔍</span>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="동네 소식 검색... (제목 + 내용 검색)"
              class="w-full bg-white border border-[#82997B]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3F2B20] focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47] outline-none placeholder-[#82997B]/70 shadow-inner"
            />
          </div>

          <div class="flex items-center gap-3 justify-between md:justify-end">
            <select
              v-model="sortBy"
              class="bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#3F2B20]/80 outline-none focus:ring-1 focus:ring-[#237B47]"
            >
              <option value="latest">📅 최신순</option>
              <option value="views">👀 조회수순</option>
              <option value="likes">👍 추천순</option>
            </select>

            <button
              @click="openCreatePostModal"
              class="bg-[#E0BA73] hover:bg-[#D3A95E] text-[#3F2B20] px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 border border-[#3F2B20]/10"
            >
              ✏️ 새 제보 남기기
            </button>
          </div>
        </div>

        <!-- 동적 게시글 목록 테이블 -->
        <div class="overflow-hidden rounded-2xl border-2 border-[#82997B]/20 bg-[#F2EADA]/30 relative z-10 shadow-inner">
          <div class="min-w-full">
            <div class="hidden md:flex bg-[#82997B]/20 px-5 py-3.5 text-xs font-bold text-[#3F2B20] border-b border-[#82997B]/30">
              <div class="w-24">분류</div>
              <div class="flex-grow">제목</div>
              <div class="w-28 text-center">제보자</div>
              <div class="w-16 text-center">조회</div>
              <div class="w-16 text-center">추천</div>
              <div class="w-24 text-right">등록일</div>
            </div>

            <div class="divide-y divide-[#82997B]/20">
              <div
                v-for="post in paginatedPosts"
                :key="post.id"
                @click="viewPostDetail(post)"
                class="flex flex-col md:flex-row md:items-center px-5 py-4 cursor-pointer hover:bg-[#82997B]/10 transition-all duration-150"
              >
                <div class="w-24 mb-1.5 md:mb-0">
                  <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs" :style="{ backgroundColor: getCategoryColor(post.category) }">
                    {{ post.category }}
                  </span>
                </div>

                <div class="flex-grow flex items-center justify-between gap-2">
                  <div class="font-bold text-[#3F2B20] text-sm md:text-base truncate max-w-[280px] sm:max-w-xl md:max-w-none hover:text-[#237B47] transition-colors">
                    {{ post.title }}
                  </div>
                </div>

                <div class="flex md:hidden items-center gap-3 text-[11px] text-[#82997B] mt-2">
                  <span>👤 {{ post.author }}</span>
                  <span>👀 {{ post.views }}</span>
                  <span>👍 {{ post.likes }}</span>
                  <span class="ml-auto">📅 {{ formatMobileDate(post.createdAt) }}</span>
                </div>

                <div class="hidden md:flex items-center w-full md:w-auto text-sm">
                  <div class="w-28 text-center text-[#3F2B20]/80 font-medium truncate">{{ post.author }}</div>
                  <div class="w-16 text-center text-[#82997B] font-semibold">{{ post.views }}</div>
                  <div class="w-16 text-center text-[#E0BA73] font-bold">{{ post.likes }}</div>
                  <div class="w-24 text-right text-xs text-[#82997B] font-mono">{{ formatPCDate(post.createdAt) }}</div>
                </div>
              </div>

              <div v-if="filteredPosts.length === 0" class="py-20 text-center">
                <span class="text-4xl block mb-3">🧭</span>
                <p class="text-sm text-[#82997B] font-medium">검색 결과나 해당 카테고리에 등록된 제보가 없습니다.</p>
                <p class="text-[11px] text-[#82997B]/75 mt-1">대동여지도의 첫 번째 주인공이 되어 새로운 소식을 등록해보세요!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-1.5 relative z-10">
          <button @click="changePage(1)" :disabled="currentPage === 1" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold">&lt;&lt;</button>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold">&lt;</button>

          <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="['w-8 h-8 rounded-lg text-xs font-bold transition-all', currentPage === page ? 'bg-[#237B47] text-white' : 'border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10']">
            {{ page }}
          </button>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold">&gt;</button>
          <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold">&gt;&gt;</button>
        </div>
      </div>
    </main>

    <!-- footer / chat / modals 등은 동일하게 유지 -->
    <!-- AppFooter -->
    <footer class="bg-[#3F2B20] text-[#F2EADA] py-12 px-6 mt-auto border-t-2 border-[#82997B]/30">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 class="text-lg font-serif font-bold text-[#E0BA73] mb-3">🗺️ 대동여지도</h4>
          <p class="text-xs text-[#F2EADA]/70 leading-relaxed">
            대전 지역 소상공인과 동네 주민, 여행객들을 위해 탄생한 무정전 익명 로컬 공유 네트워크 서비스입니다. 진짜 대전을 찾아 여행을 떠나보세요.
          </p>
        </div>
        <div>
          <h4 class="text-sm font-bold text-[#E0BA73] mb-3">📍 빠른 카테고리</h4>
          <div class="grid grid-cols-2 gap-2 text-xs text-[#F2EADA]/80 font-medium">
            <a href="#" @click.prevent="selectCategory('⛰️ 관광')" class="hover:underline">⛰️ 대전 관광지</a>
            <a href="#" @click.prevent="selectCategory('🍲 맛집')" class="hover:underline">🍲 대전 로컬맛집</a>
            <a href="#" @click.prevent="selectCategory('🎪 축제')" class="hover:underline">🎪 축제 및 행사</a>
            <a href="#" @click.prevent="selectCategory('💬 자유')" class="hover:underline">💬 자유 이야기판</a>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <div>
            <h4 class="text-sm font-bold text-[#E0BA73] mb-2">💡 협업 및 제보 안내</h4>
            <p class="text-xs text-[#F2EADA]/70">틀린 정보가 있거나 제안 사항이 있으시면 자유 게시판에 흔적을 남겨주시면 감사하겠습니다.</p>
          </div>
          <p class="text-[11px] text-[#F2EADA]/40 mt-4 font-mono">
            &copy; 2026 daedongyeojido Team. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- Chat floating button (간략) -->
    <div class="fixed bottom-6 right-6 z-50">
      <button @click="isChatOpen = !isChatOpen" class="w-14 h-14 rounded-full bg-[#237B47] text-white">🧭</button>
      <div v-if="isChatOpen" class="mt-2 w-80 p-3 bg-white rounded shadow">AI 가이드 열림</div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// UI state
const isChatOpen = ref(false)
const isCreateModalOpen = ref(false)
const isPasswordModalOpen = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)
const toastMessage = ref('')
const chatMessages = ref([])
const isChatTyping = ref(false)
const scrollRef = ref(null)

// categories used in template
const categories = [
  { filterName: '⛰️ 관광', emoji: '⛰️', name: '관광지' },
  { filterName: '🍲 맛집', emoji: '🍲', name: '맛집' },
  { filterName: '🎪 축제', emoji: '🎪', name: '축제' },
  { filterName: '💬 자유', emoji: '💬', name: '자유' },
]

// simple posts store (initially empty)
const posts = ref([])

// filters / controls
const selectedCategory = ref('전체')
const searchKeyword = ref('')
const sortBy = ref('latest')
const pageSize = 10
const currentPage = ref(1)

// new post model
const newPost = reactive({
  category: '⛰️ 관광',
  author: '',
  password: '',
  title: '',
  content: ''
})

// derived lists
const filteredPosts = computed(() => {
  let list = posts.value.slice()

  if (selectedCategory.value && selectedCategory.value !== '전체') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (searchKeyword.value.trim()) {
    const q = searchKeyword.value.toLowerCase()
    list = list.filter(p => (p.title + ' ' + p.content).toLowerCase().includes(q))
  }
  // basic sort
  if (sortBy.value === 'views') list.sort((a,b) => b.views - a.views)
  else if (sortBy.value === 'likes') list.sort((a,b) => b.likes - a.likes)
  else list.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0))
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

// basic helpers used by template
function goToHome() {
  router.push('/')
}
function selectCategory(name) {
  selectedCategory.value = name
  currentPage.value = 1
}
function openCreatePostModal() {
  isCreateModalOpen.value = true
}
function viewPostDetail(post) {
  selectedPost.value = post
}
function getCategoryColor(cat) {
  if (!cat) return '#999'
  if (cat.includes('관광')) return '#237B47'
  if (cat.includes('맛집')) return '#E0BA73'
  if (cat.includes('축제')) return '#82997B'
  return '#64748b'
}
function formatMobileDate(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return `${d.getMonth()+1}/${d.getDate()}`
}
function formatPCDate(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return d.toLocaleDateString()
}
function changePage(n) {
  if (n < 1) n = 1
  if (n > totalPages.value) n = totalPages.value
  currentPage.value = n
}

// minimal actions
function submitNewPost() {
  posts.value.unshift({
    id: Date.now(),
    category: newPost.category,
    author: newPost.author || '익명',
    views: 0,
    likes: 0,
    title: newPost.title || '(제목 없음)',
    content: newPost.content || '',
    createdAt: Date.now()
  })
  // reset
  newPost.title = ''
  newPost.content = ''
  newPost.author = ''
  isCreateModalOpen.value = false
  toastMessage.value = '제보가 등록되었습니다.'
  setTimeout(() => (toastMessage.value = ''), 3000)
}

const selectedPost = ref(null)
function likePost(post) {
  if (!post) return
  post.likes = (post.likes || 0) + 1
}
function promptPasswordCheck(action) {
  isPasswordModalOpen.value = true
}
function validatePasswordAndCommit() {
  // noop stub
  isPasswordModalOpen.value = false
}
function sendChatMessage() {
  if (!chatMessages.value) chatMessages.value = []
  chatMessages.value.push({ role: 'user', content: '...' })
}

</script>

<style scoped>
/* 필요시 스타일 추가 */
</style>