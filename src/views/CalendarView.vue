<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">나만의 여행 플래너</h2>
      <p class="text-sm text-gray-500">기존 로컬 데이터를 바탕으로 일정이 자동 생성됩니다.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Calendar -->
      <div class="lg:col-span-8 bg-white p-4 rounded-lg border">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <router-link
              to="/"
              class="px-3 py-2 border rounded bg-slate-50 hover:bg-slate-100 transition"
            >
              홈
            </router-link>

            <button @click="moveCalendar(-1)" class="px-3 py-2 border rounded">
              ◀
            </button>
            <div class="text-lg font-bold">{{ monthYearText }}</div>
            <button @click="moveCalendar(1)" class="px-3 py-2 border rounded">
              ▶
            </button>
          </div>
          <div class="text-sm text-gray-600">
            총 이벤트: <strong>{{ totalEventCount }}</strong>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500 mb-2">
          <div class="text-red-500">SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div class="text-sky-500">SAT</div>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            @click="!cell.isBlank && selectDate(cell.dateStr)"
            :class="[
              'min-h-[90px] p-2 rounded-lg border cursor-pointer flex flex-col',
              cell.isBlank
                ? 'bg-gray-50 opacity-40 border-transparent'
                : cell.isSelected
                ? 'ring-2 ring-blue-400 bg-blue-50'
                : 'bg-white'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span
                :class="[
                  'w-7 h-7 inline-flex items-center justify-center rounded-full text-sm font-bold',
                  cell.isSelected ? 'bg-blue-600 text-white' : 'text-gray-700'
                ]"
              >
                {{ cell.day || '' }}
              </span>
            </div>

            <div class="flex flex-col gap-1 overflow-hidden">
              <div
                v-for="ev in cell.events"
                :key="ev.id"
                class="text-xs truncate px-1.5 py-0.5 rounded"
                :style="{ background: colorBackground(ev.color), color: colorText(ev.color) }"
              >
                {{ ev.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls & List -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <div class="bg-white p-4 rounded-lg border">
          <h4 class="font-bold mb-2">선택된 날짜</h4>
          <div class="text-sm text-gray-700 mb-4">
            {{ selectedDateStr || '날짜를 선택하세요' }}
          </div>

          <label class="block text-xs font-semibold mb-1">일정 제목</label>
          <input
            v-model="form.title"
            class="w-full px-3 py-2 border rounded mb-2"
            placeholder="예) 성심당 방문"
          />

          <label class="block text-xs font-semibold mb-1">시간</label>
          <input
            v-model="form.time"
            type="time"
            class="w-full px-3 py-2 border rounded mb-2"
          />

          <label class="block text-xs font-semibold mb-1">카테고리</label>
          <select v-model="form.color" class="w-full px-3 py-2 border rounded mb-3">
            <option value="sky">관광</option>
            <option value="rose">맛집</option>
            <option value="amber">숙박</option>
            <option value="emerald">기타</option>
          </select>

          <button @click="addScheduleEvent" class="w-full py-2 bg-blue-600 text-white rounded">
            일정 추가
          </button>
        </div>

        <div class="bg-white p-4 rounded-lg border flex-1 overflow-auto">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-bold">선택일 일정 ({{ scheduleCount }})</h4>
            <button @click="clearSelectedEvents" class="text-sm text-red-500">
              모두 삭제
            </button>
          </div>

          <div v-if="selectedEvents.length === 0" class="text-gray-400 text-center py-8">
            등록된 일정이 없습니다.
          </div>

          <div
            v-for="ev in selectedEvents"
            :key="ev.id"
            class="flex items-center gap-3 p-2 mb-2 border rounded"
          >
            <div
              :style="{ background: colorBackground(ev.color), color: colorText(ev.color) }"
              class="w-10 h-10 rounded flex items-center justify-center font-bold"
            >
              {{ ev.time || '--' }}
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm">{{ ev.title }}</div>
              <div class="text-xs text-gray-500">{{ ev.time }}</div>
            </div>
            <button @click="deleteScheduleEvent(ev.id)" class="text-sm text-red-500">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import {
  calendarStore,
  initCalendarStore,
  addCalendarEvent,
  deleteCalendarEvent,
  clearCalendarEvents,
  moveCalendarMonth
} from '@/store/calendar'

const form = reactive({
  title: '',
  time: '12:00',
  color: 'sky'
})

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
    sky: '#E0F2FE',
    rose: '#FEE2E2',
    amber: '#FEF3C7',
    emerald: '#ECFDF5'
  }[color] || '#F3F4F6'
}

function colorText(color) {
  return {
    sky: '#0369A1',
    rose: '#C026D3',
    amber: '#B45309',
    emerald: '#065F46'
  }[color] || '#111827'
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

function moveCalendar(direction) {
  moveCalendarMonth(direction)
}

function selectDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  calendarStore.selectedDate = new Date(+y, +m - 1, +d)
}

function addScheduleEvent() {
  if (!calendarStore.selectedDate) {
    alert('날짜를 먼저 선택하세요.')
    return
  }
  if (!form.title.trim()) {
    alert('일정 제목을 입력하세요.')
    return
  }

  const dateKey = formatDateKey(calendarStore.selectedDate)
  addCalendarEvent(dateKey, {
    id: Date.now() + Math.random(),
    title: form.title.trim(),
    time: form.time,
    color: form.color,
    subtitle: '',
    addr: '',
    tel: ''
  })
  form.title = ''
}

function deleteScheduleEvent(eventId) {
  const dateKey = formatDateKey(calendarStore.selectedDate)
  deleteCalendarEvent(dateKey, eventId)
}

function clearSelectedEvents() {
  const dateKey = formatDateKey(calendarStore.selectedDate)
  clearCalendarEvents(dateKey)
}

onMounted(async () => {
  if (!calendarStore.initialized) {
    await initCalendarStore()
  }
})
</script>

<style scoped>
.min-h-\[90px\] {
  min-height: 90px;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>