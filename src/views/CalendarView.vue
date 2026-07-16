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

    <section class="calendar-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 intro-copy">
        <span class="eyebrow">TRAVEL PLANNER · 나의 일정</span>
        <h2 class="page-title">나만의 여행 플래너</h2>
        <p class="text-sm text-[#6b5b45]">기존 로컬 데이터를 바탕으로 일정이 자동 생성됩니다.</p>
      </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Calendar -->
      <div class="lg:col-span-8 bg-[#f8f1de] p-4 rounded-md border border-[#e0cfaa]">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <button @click="moveCalendar(-1)"
                    class="px-3 py-2 border rounded text-[#2c2318] border-[#e0cfaa] bg-[#fdf8ec] hover:bg-[#efe1bf]">
              ◀
            </button>
            <div class="text-lg font-bold text-[#2c2318]">{{ monthYearText }}</div>
            <button @click="moveCalendar(1)"
                    class="px-3 py-2 border rounded text-[#2c2318] border-[#e0cfaa] bg-[#fdf8ec] hover:bg-[#efe1bf]">
              ▶
            </button>
          </div>
          <div class="text-sm text-[#6b5b45]">총 이벤트: <strong>{{ totalEventCount }}</strong></div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-[#6b5b45] mb-2">
          <div class="text-[#a63c26]">SUN</div>
          <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div>
          <div class="text-[#a2712c]">SAT</div>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div v-for="(cell, idx) in calendarCells" :key="idx"
               @click="!cell.isBlank && selectDate(cell.dateStr)"
               :class="[ 'min-h-[90px] p-2 rounded border cursor-pointer flex flex-col',
                 cell.isBlank ? 'bg-[#efe4cc] opacity-70 border-transparent' :
                   (cell.isSelected ? 'ring-2 ring-[#33553e] bg-[#efe1bf]' : 'bg-[#fdf8ec]')
               ]">
            <div class="flex items-center justify-between mb-1">
              <span :class="['w-7 h-7 inline-flex items-center justify-center rounded-full text-sm font-bold',
                             cell.isSelected ? 'bg-[#33553e] text-white' : 'text-[#2c2318]']">
                {{ cell.day || '' }}
              </span>
            </div>

            <div class="flex flex-col gap-1 overflow-hidden">
              <div v-for="ev in cell.events" :key="ev.id"
                   class="text-xs truncate px-1.5 py-0.5 rounded"
                   :style="{ background: colorBackground(ev.color), color: colorText(ev.color) }">
                {{ ev.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal memo -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <div class="bg-[#f8f1de] p-4 rounded-md border border-[#e0cfaa]">
          <h4 class="panel-title mb-2">개인 일정 메모</h4>
          <div class="text-sm text-[#6b5b45] mb-4">
            선택된 날짜: <strong class="text-[#2c2318]">{{ selectedDateStr || '날짜를 선택하세요' }}</strong>
          </div>

          <label class="block text-xs font-semibold mb-1 text-[#2c2318]">메모 제목</label>
          <input v-model="form.title"
                 class="w-full px-3 py-2 border rounded mb-2 border-[#e0cfaa]"
                 placeholder="예) 점심 약속" />

          <label class="block text-xs font-semibold mb-1 text-[#2c2318]">시간</label>
          <input v-model="form.time"
                 type="time"
                 class="w-full px-3 py-2 border rounded mb-2 border-[#e0cfaa]" />

          <label class="block text-xs font-semibold mb-1 text-[#2c2318]">메모</label>
          <textarea v-model="form.note"
                    rows="3"
                    class="w-full px-3 py-2 border rounded mb-3 border-[#e0cfaa]"
                    placeholder="개인 일정에 대한 간단한 메모를 입력하세요."></textarea>

          <label class="block text-xs font-semibold mb-1 text-[#2c2318]">카테고리</label>
          <select v-model="form.color"
                  class="w-full px-3 py-2 border rounded mb-3 border-[#e0cfaa]">
            <option value="sky">관광</option>
            <option value="rose">맛집</option>
            <option value="amber">숙박</option>
            <option value="emerald">기타</option>
          </select>

          <button @click="addScheduleEvent"
                  class="w-full py-2 rounded bg-[#33553e] text-white hover:bg-[#264430]">
            개인 일정 추가
          </button>
        </div>

        <div class="bg-[#f8f1de] p-4 rounded-md border border-[#e0cfaa] flex-1 overflow-auto">
          <div class="flex justify-between items-center mb-3">
            <h4 class="panel-title">선택일 일정 ({{ scheduleCount }})</h4>
            <button @click="clearSelectedEvents" class="text-sm text-[#a63c26]">모두 삭제</button>
          </div>

          <div v-if="selectedEvents.length === 0" class="text-[#6b5b45] text-center py-8">
            등록된 일정이 없습니다.
          </div>

          <div v-for="ev in selectedEvents" :key="ev.id"
               class="flex items-center gap-3 p-2 mb-2 border rounded border-[#e0cfaa]">
            <div :style="{ background: colorBackground(ev.color), color: colorText(ev.color) }"
                 class="w-10 h-10 rounded-full flex items-center justify-center font-bold">
              {{ ev.time || '--' }}
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm text-[#2c2318]">{{ ev.title }}</div>
              <div class="text-xs text-[#6b5b45]">{{ ev.note || ev.subtitle || '메모 없음' }}</div>
            </div>
            <button @click="deleteScheduleEvent(ev.id)" class="text-sm text-[#a63c26]">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <div ref="categorySectionRef" class="mt-8 bg-[#f8f1de] p-4 rounded-md border border-[#e0cfaa]">
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="tab in categoryTabs"
          :key="tab"
          @click="selectCategory(tab)"
          :class="[ 
            'px-3 py-2 rounded-full border text-sm font-medium transition',
            selectedCategory === tab
              ? 'bg-[#33553e] text-white border-[#33553e]'
              : 'bg-[#fdf8ec] text-[#2c2318] border-[#e0cfaa]'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <div class="search-box flex-1">
          <span>🔍</span>
          <input
            v-model="searchKeyword"
            type="text"
            :placeholder="`${selectedCategory} 검색 (이름 · 주소)`"
          />
        </div>
        <button
          v-if="searchKeyword"
          @click="searchKeyword = ''"
          class="reset-btn"
        >
          초기화
        </button>
      </div>

      <div class="text-sm text-[#6b5b45] mb-4">
        <strong class="text-[#2c2318]">{{ selectedCategory }}</strong> 카테고리
        · 총 <strong class="text-[#2c2318]">{{ filteredCategoryItems.length }}</strong>건
        <span v-if="searchKeyword"> ("{{ searchKeyword }}" 검색 결과)</span>
      </div>

      <div v-if="filteredCategoryItems.length === 0" class="text-[#6b5b45] text-center py-12">
        {{ searchKeyword ? '검색 결과가 없습니다.' : '선택된 카테고리의 데이터가 없습니다.' }}
      </div>

      <div class="grid gap-3">
        <div v-for="item in pagedCategoryItems" :key="item.id"
             class="p-4 border rounded bg-[#efe1bf] border-[#e0cfaa]">
          <div class="flex flex-col gap-4">
            <div class="flex gap-4">
              <img
                :src="item.image || defaultImage"
                @error="handleImageError"
                alt="이미지"
                class="w-28 h-28 rounded object-cover border border-[#e0cfaa]"
              />
              <div class="min-w-0">
                <div class="font-semibold text-base text-[#2c2318]">{{ item.title }}</div>
                <div class="text-sm text-[#6b5b45] mt-1">
                  {{ item.subtitle || item.addr || item.tel || '세부 정보 없음' }}
                </div>
                <div v-if="item.startDate" class="text-xs text-[#6b5b45] mt-2">
                  📅 {{ item.startDate }}<template v-if="item.endDate && item.endDate !== item.startDate"> ~ {{ item.endDate }}</template>
                </div>
                <div v-if="item.startTime" class="text-xs text-[#6b5b45] mt-1">
                  🕒 {{ item.startTime }}<template v-if="item.endTime"> ~ {{ item.endTime }}</template>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 items-end">
              <button
                v-if="pendingAddItemId !== item.id"
                @click="setPendingAddItem(item)"
                class="px-4 py-2 rounded bg-[#33553e] text-white text-sm hover:bg-[#264430]"
              >
                캘린더에 추가
              </button>

              <div v-else class="flex flex-col gap-2 w-full sm:w-auto">
                <input type="date"
                       v-model="pendingAddDate"
                       class="w-full px-3 py-2 border rounded border-[#e0cfaa]" />
                <input type="time"
                       v-model="pendingAddTime"
                       class="w-full px-3 py-2 border rounded border-[#e0cfaa]" />
                <div class="flex gap-2">
                  <button
                    @click="confirmAddPendingItem(item)"
                    class="px-4 py-2 rounded bg-[#33553e] text-white text-sm hover:bg-[#264430]"
                  >
                    추가
                  </button>
                  <button
                    @click="cancelPendingAdd"
                    class="px-4 py-2 rounded border border-[#e0cfaa] bg-[#fdf8ec] text-[#2c2318] text-sm hover:bg-[#efe1bf]"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-2 mt-4">
        <button
          @click="prevCategoryPage"
          :disabled="currentCategoryPage === 1"
          class="px-3 py-2 rounded border border-[#e0cfaa] text-[#2c2318] bg-[#fdf8ec] hover:bg-[#efe1bf] disabled:opacity-50"
        >
          이전
        </button>

        <div class="text-sm text-[#6b5b45]">
          {{ currentCategoryPage }} / {{ totalCategoryPages }}
        </div>

        <button
          @click="nextCategoryPage"
          :disabled="currentCategoryPage === totalCategoryPages"
          class="px-3 py-2 rounded border border-[#e0cfaa] text-[#2c2318] bg-[#fdf8ec] hover:bg-[#efe1bf] disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  </section>

  <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppFooter from '@/components/common/AppFooter.vue'
import '@/assets/css/calendar.css'
import defaultImage from '@/assets/images/dadong.png'
import {
  calendarStore,
  initCalendarStore,
  addCalendarEvent,
  deleteCalendarEvent,
  clearCalendarEvents,
  moveCalendarMonth
} from '@/store/calendar'
import { loadRegionCategoryItems } from '@/services/calendarService'

const router = useRouter()
const route = useRoute()
const categorySectionRef = ref(null)

function goToHome() {
  router.push('/')
}

function goToBoard() {
  router.push('/board')
}

function goToCalendar() {
  router.push('/calendar')
}

const form = reactive({
  title: '',
  time: '12:00',
  note: '',
  color: 'sky'
})

const categoryTabs = [
  '관광지',
  '레포츠',
  '문화시설',
  '쇼핑',
  '숙박',
  '여행코스',
  '음식점',
  '축제/공연/행사'
]

const selectedCategory = ref('관광지')
const categoryItems = ref({})
const currentCategoryPage = ref(1)
const searchKeyword = ref('')
const pageSize = 10
const pendingAddItemId = ref(null)
const pendingAddDate = ref('')
const pendingAddTime = ref('12:00')

const monthYearText = computed(() => {
  const y = calendarStore.currentMonth.getFullYear()
  const m = calendarStore.currentMonth.getMonth() + 1
  return `${y}년 ${m}월`
})

function formatDateKey(dateObj) {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function colorBackground(color) {
  return {
    sky: '#f3e6c9',
    rose: '#f3ded5',
    amber: '#e8dab5',
    emerald: '#dde6dc'
  }[color] || '#efe1bf'
}
function colorText(color) {
  return {
    sky: '#8a5f22',
    rose: '#a63c26',
    amber: '#8a5f22',
    emerald: '#33553e'
  }[color] || '#6b5b45'
}

const calendarCells = computed(() => {
  const year = calendarStore.currentMonth.getFullYear()
  const month = calendarStore.currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDay; i++) {
    cells.push({ isBlank: true })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    const dateStr = formatDateKey(dateObj)
    const events = calendarStore.events[dateStr] || []
    const isSelected =
      calendarStore.selectedDate &&
      formatDateKey(calendarStore.selectedDate) === dateStr
    cells.push({ isBlank: false, day: d, dateStr, events, isSelected })
  }

  return cells
})

const selectedDateStr = computed(() =>
  calendarStore.selectedDate ? formatDateKey(calendarStore.selectedDate) : ''
)

const selectedEvents = computed(() => {
  const ds = selectedDateStr.value
  return ds ? calendarStore.events[ds] || [] : []
})

const scheduleCount = computed(() => selectedEvents.value.length)
const totalEventCount = computed(() =>
  Object.values(calendarStore.events).reduce(
    (sum, list) => sum + (list?.length || 0),
    0
  )
)

const currentCategoryItems = computed(() =>
  categoryItems.value[selectedCategory.value] || []
)

// 검색어(이름·주소·전화)로 현재 카테고리 항목 필터링
const filteredCategoryItems = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return currentCategoryItems.value

  return currentCategoryItems.value.filter((item) =>
    [item.title, item.subtitle, item.addr, item.tel]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(kw))
  )
})

const totalCategoryPages = computed(() => {
  return Math.max(1, Math.ceil(filteredCategoryItems.value.length / pageSize))
})

const pagedCategoryItems = computed(() => {
  const start = (currentCategoryPage.value - 1) * pageSize
  return filteredCategoryItems.value.slice(start, start + pageSize)
})

// 검색어가 바뀌면 첫 페이지로 되돌리고 추가 대기 상태 정리
watch(searchKeyword, () => {
  currentCategoryPage.value = 1
  cancelPendingAdd()
})

async function loadCategoryLists() {
  categoryItems.value = await loadRegionCategoryItems()
}

function moveCalendar(direction) {
  moveCalendarMonth(direction)
}

function selectCategory(tab) {
  selectedCategory.value = tab
  currentCategoryPage.value = 1
  searchKeyword.value = ''
  cancelPendingAdd()
}

function selectDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  calendarStore.selectedDate = new Date(+y, +m - 1, +d)
  cancelPendingAdd()
}

function setPendingAddItem(item) {
  pendingAddItemId.value = item.id
  pendingAddDate.value = formatDateKey(calendarStore.selectedDate)
  pendingAddTime.value = item.time || '12:00'
}

function confirmAddPendingItem(item) {
  if (!pendingAddDate.value) {
    alert('추가할 날짜를 선택하세요.')
    return
  }

  addCalendarEvent(pendingAddDate.value, {
    id: `${item.id}-${Date.now()}`,
    title: item.title,
    time: pendingAddTime.value || item.time || '12:00',
    color: item.color || 'sky',
    subtitle: item.subtitle || item.addr || '',
    addr: item.addr || '',
    tel: item.tel || ''
  })
  cancelPendingAdd()
}

function cancelPendingAdd() {
  pendingAddItemId.value = null
  pendingAddDate.value = ''
  pendingAddTime.value = '12:00'
}

function getSelectedDateKey() {
  if (!calendarStore.selectedDate) return null
  return formatDateKey(calendarStore.selectedDate)
}

function addScheduleEvent() {
  const dateKey = getSelectedDateKey()
  if (!dateKey) {
    alert('날짜를 먼저 선택하세요.')
    return
  }
  if (!form.title.trim() && !form.note.trim()) {
    alert('제목 또는 메모를 입력하세요.')
    return
  }

  addCalendarEvent(dateKey, {
    id: Date.now() + Math.random(),
    title: form.title.trim() || '개인 일정',
    time: form.time,
    color: form.color,
    subtitle: form.note.trim(),
    addr: '',
    tel: ''
  })
  form.title = ''
  form.note = ''
}

function deleteScheduleEvent(eventId) {
  const dateKey = getSelectedDateKey()
  if (!dateKey) return
  deleteCalendarEvent(dateKey, eventId)
}

function clearSelectedEvents() {
  const dateKey = getSelectedDateKey()
  if (!dateKey) return
  clearCalendarEvents(dateKey)
}

function prevCategoryPage() {
  if (currentCategoryPage.value > 1) {
    currentCategoryPage.value -= 1
    cancelPendingAdd()
  }
}

function nextCategoryPage() {
  if (currentCategoryPage.value < totalCategoryPages.value) {
    currentCategoryPage.value += 1
    cancelPendingAdd()
  }
}

function handleImageError(event) {
  event.target.src = defaultImage
}

onMounted(async () => {
  if (!calendarStore.initialized) {
    await initCalendarStore()
  }
  await loadCategoryLists()

  // 홈에서 카테고리를 지정해 넘어온 경우(예: ?category=축제/공연/행사) 해당 목록을 열고 스크롤
  const requested = route.query.category
  if (requested && categoryTabs.includes(requested)) {
    selectedCategory.value = requested
    currentCategoryPage.value = 1
    searchKeyword.value = ''
    await nextTick()
    categorySectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700;900&family=Noto+Sans+KR:wght@400;500;700;800&display=swap');

:global(body) {
  margin: 0;
  background: #f2e8d3;
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
}

/* 다른 페이지(홈·게시판)와 동일한 지도풍 배경/상단바 */
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
  background:
    radial-gradient(ellipse at 15% 0%, rgba(166, 60, 38, 0.05), transparent 55%),
    radial-gradient(ellipse at 85% 100%, rgba(51, 85, 62, 0.06), transparent 55%),
    var(--paper);
  color: var(--ink);
}

.contour-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.contour {
  fill: none;
  stroke: var(--brass);
  stroke-width: 1;
  opacity: 0.16;
}

.calendar-page {
  position: relative;
  z-index: 1;
}

.intro-copy {
  padding-left: 18px;
  border-left: 3px solid var(--pine);
}

.eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--route);
  border: 1px solid rgba(166, 60, 38, 0.4);
  border-radius: 999px;
  padding: 4px 12px;
  margin-bottom: 10px;
}

.page-title {
  margin: 0 0 4px;
  font-family: 'Noto Serif KR', serif;
  font-size: 24px;
  font-weight: 900;
  color: var(--ink);
}

.panel-title {
  margin: 0;
  font-family: 'Noto Serif KR', serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

/* 검색창: BoardListView와 동일한 아이콘+인풋 결합형 */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(248, 241, 224, 0.7);
  border: 1px solid rgba(44, 35, 24, 0.18);
  border-radius: 4px;
  padding: 10px 12px;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: var(--ink);
  font-size: 13px;
  font-family: inherit;
}

.reset-btn {
  border: 1px solid rgba(44, 35, 24, 0.18);
  background: rgba(248, 241, 224, 0.7);
  color: var(--ink);
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.reset-btn:hover {
  border-color: var(--brass);
}

.topbar {
  position: relative;
  z-index: 1;
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
  background: #e8dab5;
  border: 2px solid #a2712c;
  box-shadow: 0 0 0 3px #f2e8d3, 0 0 0 4px #a2712c;
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
  color: #2c2318;
}

.brand-copy p {
  margin: 3px 0 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #a2712c;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  text-decoration: none;
  color: #6b5b45;
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
  background: #a63c26;
  transition: width 0.2s ease;
}

.nav-links a:hover {
  color: #2c2318;
}

.nav-links a:hover::after {
  width: 100%;
}

@media (max-width: 560px) {
  .topbar {
    padding: 16px 18px;
  }

  .nav-links {
    gap: 16px;
  }
}
</style>