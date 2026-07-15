<template>
  <section class="calendar-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#2B3F2F]">나만의 여행 플래너</h2>
      <p class="text-sm text-[#4F6B50]">기존 로컬 데이터를 바탕으로 일정이 자동 생성됩니다.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Calendar -->
      <div class="lg:col-span-8 bg-[#F9F7EE] p-4 rounded-2xl border border-[#D6E4D4]">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <button @click="moveCalendar(-1)"
                    class="px-3 py-2 border rounded-lg text-[#2B3F2F] border-[#C5D9C0] bg-white hover:bg-[#EDF7EF]">
              ◀
            </button>
            <div class="text-lg font-bold text-[#2B3F2F]">{{ monthYearText }}</div>
            <button @click="moveCalendar(1)"
                    class="px-3 py-2 border rounded-lg text-[#2B3F2F] border-[#C5D9C0] bg-white hover:bg-[#EDF7EF]">
              ▶
            </button>
          </div>
          <div class="text-sm text-[#4F6B50]">총 이벤트: <strong>{{ totalEventCount }}</strong></div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-[#4F6B50] mb-2">
          <div class="text-[#C81D1D]">SUN</div>
          <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div>
          <div class="text-[#1E90FF]">SAT</div>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div v-for="(cell, idx) in calendarCells" :key="idx"
               @click="!cell.isBlank && selectDate(cell.dateStr)"
               :class="[ 'min-h-[90px] p-2 rounded-2xl border cursor-pointer flex flex-col',
                 cell.isBlank ? 'bg-[#F3F2E8] opacity-70 border-transparent' :
                   (cell.isSelected ? 'ring-2 ring-[#237B47] bg-[#EDF7EF]' : 'bg-white')
               ]">
            <div class="flex items-center justify-between mb-1">
              <span :class="['w-7 h-7 inline-flex items-center justify-center rounded-full text-sm font-bold',
                             cell.isSelected ? 'bg-[#237B47] text-white' : 'text-[#2B3F2F]']">
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
        <div class="bg-[#F9F7EE] p-4 rounded-2xl border border-[#D6E4D4]">
          <h4 class="font-bold mb-2 text-[#2B3F2F]">개인 일정 메모</h4>
          <div class="text-sm text-[#4F6B50] mb-4">
            선택된 날짜: <strong class="text-[#2B3F2F]">{{ selectedDateStr || '날짜를 선택하세요' }}</strong>
          </div>

          <label class="block text-xs font-semibold mb-1 text-[#2B3F2F]">메모 제목</label>
          <input v-model="form.title"
                 class="w-full px-3 py-2 border rounded-lg mb-2 border-[#C5D9C0]"
                 placeholder="예) 점심 약속" />

          <label class="block text-xs font-semibold mb-1 text-[#2B3F2F]">시간</label>
          <input v-model="form.time"
                 type="time"
                 class="w-full px-3 py-2 border rounded-lg mb-2 border-[#C5D9C0]" />

          <label class="block text-xs font-semibold mb-1 text-[#2B3F2F]">메모</label>
          <textarea v-model="form.note"
                    rows="3"
                    class="w-full px-3 py-2 border rounded-lg mb-3 border-[#C5D9C0]"
                    placeholder="개인 일정에 대한 간단한 메모를 입력하세요."></textarea>

          <label class="block text-xs font-semibold mb-1 text-[#2B3F2F]">카테고리</label>
          <select v-model="form.color"
                  class="w-full px-3 py-2 border rounded-lg mb-3 border-[#C5D9C0]">
            <option value="sky">관광</option>
            <option value="rose">맛집</option>
            <option value="amber">숙박</option>
            <option value="emerald">기타</option>
          </select>

          <button @click="addScheduleEvent"
                  class="w-full py-2 rounded-lg bg-[#237B47] text-white hover:bg-[#1F5938]">
            개인 일정 추가
          </button>
        </div>

        <div class="bg-[#F9F7EE] p-4 rounded-2xl border border-[#D6E4D4] flex-1 overflow-auto">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-bold text-[#2B3F2F]">선택일 일정 ({{ scheduleCount }})</h4>
            <button @click="clearSelectedEvents" class="text-sm text-[#A32020]">모두 삭제</button>
          </div>

          <div v-if="selectedEvents.length === 0" class="text-[#6D7E64] text-center py-8">
            등록된 일정이 없습니다.
          </div>

          <div v-for="ev in selectedEvents" :key="ev.id"
               class="flex items-center gap-3 p-2 mb-2 border rounded-2xl border-[#D6E4D4]">
            <div :style="{ background: colorBackground(ev.color), color: colorText(ev.color) }"
                 class="w-10 h-10 rounded-full flex items-center justify-center font-bold">
              {{ ev.time || '--' }}
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm text-[#2B3F2F]">{{ ev.title }}</div>
              <div class="text-xs text-[#4F6B50]">{{ ev.note || ev.subtitle || '메모 없음' }}</div>
            </div>
            <button @click="deleteScheduleEvent(ev.id)" class="text-sm text-[#A32020]">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-[#F9F7EE] p-4 rounded-2xl border border-[#D6E4D4]">
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="tab in categoryTabs"
          :key="tab"
          @click="selectCategory(tab)"
          :class="[ 
            'px-3 py-2 rounded-full border text-sm font-medium transition',
            selectedCategory === tab
              ? 'bg-[#237B47] text-white border-[#237B47]'
              : 'bg-white text-[#2B3F2F] border-[#C5D9C0]'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <div class="text-sm text-[#4F6B50] mb-4">
        <strong class="text-[#2B3F2F]">{{ selectedCategory }}</strong> 카테고리 목록
      </div>

      <div v-if="currentCategoryItems.length === 0" class="text-[#6D7E64] text-center py-12">
        선택된 카테고리의 데이터가 없습니다.
      </div>

      <div class="grid gap-3">
        <div v-for="item in pagedCategoryItems" :key="item.id"
             class="p-4 border rounded-2xl bg-[#EDF7EF] border-[#D6E4D4]">
          <div class="flex flex-col gap-4">
            <div class="flex gap-4">
              <img
                :src="item.image || defaultImage"
                @error="handleImageError"
                alt="이미지"
                class="w-28 h-28 rounded-2xl object-cover border border-[#C5D9C0]"
              />
              <div class="min-w-0">
                <div class="font-semibold text-base text-[#2B3F2F]">{{ item.title }}</div>
                <div class="text-sm text-[#4F6B50] mt-1">
                  {{ item.subtitle || item.addr || item.tel || '세부 정보 없음' }}
                </div>
                <div v-if="item.dateKey" class="text-xs text-[#6D7E64] mt-2">
                    {{ item.dateKey }}
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 items-end">
              <button
                v-if="pendingAddItemId !== item.id"
                @click="setPendingAddItem(item)"
                class="px-4 py-2 rounded-lg bg-[#237B47] text-white text-sm hover:bg-[#1F5938]"
              >
                캘린더에 추가
              </button>

              <div v-else class="flex flex-col gap-2 w-full sm:w-auto">
                <input type="date"
                       v-model="pendingAddDate"
                       class="w-full px-3 py-2 border rounded-lg border-[#C5D9C0]" />
                <input type="time"
                       v-model="pendingAddTime"
                       class="w-full px-3 py-2 border rounded-lg border-[#C5D9C0]" />
                <div class="flex gap-2">
                  <button
                    @click="confirmAddPendingItem(item)"
                    class="px-4 py-2 rounded-lg bg-[#237B47] text-white text-sm hover:bg-[#1F5938]"
                  >
                    추가
                  </button>
                  <button
                    @click="cancelPendingAdd"
                    class="px-4 py-2 rounded-lg border border-[#C5D9C0] bg-white text-[#2B3F2F] text-sm hover:bg-[#EDF7EF]"
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
          class="px-3 py-2 rounded-lg border border-[#C5D9C0] text-[#2B3F2F] bg-white hover:bg-[#EDF7EF] disabled:opacity-50"
        >
          이전
        </button>

        <div class="text-sm text-[#4F6B50]">
          {{ currentCategoryPage }} / {{ totalCategoryPages }}
        </div>

        <button
          @click="nextCategoryPage"
          :disabled="currentCategoryPage === totalCategoryPages"
          class="px-3 py-2 rounded-lg border border-[#C5D9C0] text-[#2B3F2F] bg-white hover:bg-[#EDF7EF] disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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
    sky: '#DFF6E9',
    rose: '#F6EAE8',
    amber: '#FEF6E6',
    emerald: '#EAF7EE'
  }[color] || '#EDF7EF'
}
function colorText(color) {
  return {
    sky: '#166534',
    rose: '#9A3412',
    amber: '#92400E',
    emerald: '#065F46'
  }[color] || '#14532D'
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

const totalCategoryPages = computed(() => {
  return Math.max(1, Math.ceil(currentCategoryItems.value.length / pageSize))
})

const pagedCategoryItems = computed(() => {
  const start = (currentCategoryPage.value - 1) * pageSize
  return currentCategoryItems.value.slice(start, start + pageSize)
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
})
</script>