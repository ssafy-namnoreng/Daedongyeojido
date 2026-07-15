import { reactive } from 'vue'
import { loadRegionCalendarEvents } from '@/services/calendarService'

const STORAGE_KEY = 'daedong-calendar-local-events'

function loadSavedEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { localEvents: {}, deletedEventIds: {} }
    const parsed = JSON.parse(raw)
    if (parsed.localEvents && parsed.deletedEventIds) {
      return parsed
    }
    return { localEvents: parsed, deletedEventIds: {} }
  } catch {
    return { localEvents: {}, deletedEventIds: {} }
  }
}

function saveLocalEvents(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    localEvents: state.localEvents,
    deletedEventIds: state.deletedEventIds
  }))
}

function mergeEventLists(base = [], extra = []) {
  const map = new Map()
  base.forEach(item => map.set(item.id, item))
  extra.forEach(item => map.set(item.id, item))
  return Array.from(map.values())
}

function mergeEvents(remoteEvents, localEvents, deletedEventIds) {
  const merged = {}

  for (const dateKey in remoteEvents) {
    merged[dateKey] = [...remoteEvents[dateKey]]
  }

  for (const dateKey in localEvents) {
    merged[dateKey] = mergeEventLists(merged[dateKey] || [], localEvents[dateKey])
  }

  for (const dateKey in merged) {
    const deleted = deletedEventIds[dateKey] || []
    merged[dateKey] = merged[dateKey].filter(event => !deleted.includes(event.id))
  }

  return merged
}

const saved = loadSavedEvents()

export const calendarStore = reactive({
  initialized: false,
  currentMonth: new Date(new Date().getFullYear(), new Date().getMonth()),
  selectedDate: new Date(),
  remoteEvents: {},
  localEvents: saved.localEvents,
  deletedEventIds: saved.deletedEventIds,
  events: {}
})

function refreshMergedEvents() {
  calendarStore.events = mergeEvents(
    calendarStore.remoteEvents,
    calendarStore.localEvents,
    calendarStore.deletedEventIds
  )
}

export async function initCalendarStore() {
  const remoteEvents = await loadRegionCalendarEvents()
  calendarStore.remoteEvents = remoteEvents
  refreshMergedEvents()
  calendarStore.initialized = true
}

export function addCalendarEvent(dateKey, event) {
  if (!calendarStore.localEvents[dateKey]) calendarStore.localEvents[dateKey] = []
  calendarStore.localEvents[dateKey].push(event)
  saveLocalEvents(calendarStore)
  refreshMergedEvents()
}

export function deleteCalendarEvent(dateKey, eventId) {
  if (!calendarStore.deletedEventIds[dateKey]) calendarStore.deletedEventIds[dateKey] = []
  if (!calendarStore.deletedEventIds[dateKey].includes(eventId)) {
    calendarStore.deletedEventIds[dateKey].push(eventId)
  }

  if (calendarStore.localEvents[dateKey]) {
    calendarStore.localEvents[dateKey] =
      calendarStore.localEvents[dateKey].filter(e => e.id !== eventId)
  }

  saveLocalEvents(calendarStore)
  refreshMergedEvents()
}

export function clearCalendarEvents(dateKey) {
  if (!calendarStore.deletedEventIds[dateKey]) calendarStore.deletedEventIds[dateKey] = []
  const existingIds = calendarStore.events[dateKey] || []
  existingIds.forEach(event => {
    if (!calendarStore.deletedEventIds[dateKey].includes(event.id)) {
      calendarStore.deletedEventIds[dateKey].push(event.id)
    }
  })

  calendarStore.localEvents[dateKey] = []
  saveLocalEvents(calendarStore)
  refreshMergedEvents()
}

export function moveCalendarMonth(delta) {
  const nextMonth = new Date(calendarStore.currentMonth)
  nextMonth.setMonth(nextMonth.getMonth() + delta)
  calendarStore.currentMonth = nextMonth
}