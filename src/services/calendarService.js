const BASE_PATH = '/data/대전_충청권/'
const REGION_FILES = [
  { fileName: '대전_충청권_관광지.json', category: '관광지' },
  { fileName: '대전_충청권_레포츠.json', category: '레포츠' },
  { fileName: '대전_충청권_문화시설.json', category: '문화시설' },
  { fileName: '대전_충청권_쇼핑.json', category: '쇼핑' },
  { fileName: '대전_충청권_숙박.json', category: '숙박' },
  { fileName: '대전_충청권_여행코스.json', category: '여행코스' },
  { fileName: '대전_충청권_음식점.json', category: '음식점' },
  { fileName: '대전_충청권_축제공연행사.json', category: '축제/공연/행사' }
]

export function parseKmaDate(dateString) {
  if (!dateString) return null
  const s = String(dateString)
  if (s.length < 8) return null
  const y = s.slice(0, 4)
  const m = s.slice(4, 6)
  const d = s.slice(6, 8)
  if (+m < 1 || +m > 12 || +d < 1 || +d > 31) return null
  return `${y}-${m}-${d}`
}

export function parseEventDate(dateString) {
  return parseKmaDate(dateString)
}

export function parseKmaTime(dateString) {
  if (!dateString) return '12:00'
  const s = String(dateString)
  if (s.length >= 12) {
    const hh = s.slice(8, 10)
    const mm = s.slice(10, 12)
    return `${hh}:${mm}`
  }
  return '12:00'
}

export function normalizeCategory(fileName) {
  if (fileName.includes('음식점')) return 'rose'
  if (fileName.includes('숙박')) return 'amber'
  if (fileName.includes('축제공연행사')) return 'sky'
  if (fileName.includes('관광지')) return 'emerald'
  if (fileName.includes('레포츠')) return 'sky'
  if (fileName.includes('문화시설')) return 'emerald'
  if (fileName.includes('쇼핑')) return 'emerald'
  if (fileName.includes('여행코스')) return 'emerald'
  return 'emerald'
}

export function normalizeEventItem(item, fileName) {
  const startDate = parseEventDate(item.eventstartdate)
  const endDate = parseEventDate(item.eventenddate)
  const dateKey =
    startDate ||
    endDate ||
    parseEventDate(item.modifiedtime) ||
    parseEventDate(item.createdtime) ||
    parseEventDate(item.createdTime)

  if (!dateKey) return null

  return {
    id:
      item.contentid ||
      `${fileName}-${item.title || item.name || Math.random()}`,
    title: item.title || item.name || '알 수 없는 일정',
    subtitle: item.addr1 || item.addr2 || item.tel || '',
    addr: item.addr1 || '',
    tel: item.tel || '',
    image: item.firstimage || item.firstimage2 || '',
    time:
      startDate || parseKmaTime(item.modifiedtime) || parseKmaTime(item.createdtime) || '12:00',
    color: normalizeCategory(fileName),
    dateKey,
  }
}

export function normalizeCategoryItem(item, fileName) {
  const title = item.title || item.name
  if (!title) return null

  return {
    id:
      item.contentid ||
      `${fileName}-${title}-${Math.random()}`,
    title,
    subtitle: item.addr1 || item.addr2 || item.tel || '',
    addr: item.addr1 || '',
    tel: item.tel || '',
    image: item.firstimage || item.firstimage2 || '',
    time: item.eventstartdate ? parseKmaTime(item.eventstartdate) : '',
    color: normalizeCategory(fileName),
    dateKey:
      parseEventDate(item.eventstartdate) ||
      parseEventDate(item.eventenddate) ||
      null,
  }
}

export async function loadRegionCalendarEvents() {
  const events = {}
  for (const { fileName } of REGION_FILES) {
    try {
      const res = await fetch(BASE_PATH + fileName)
      if (!res.ok) continue
      const json = await res.json()
      if (!json.items || !Array.isArray(json.items)) continue

      json.items.forEach(item => {
        const normalized = normalizeEventItem(item, fileName)
        if (!normalized) return
        if (!events[normalized.dateKey]) events[normalized.dateKey] = []
        events[normalized.dateKey].push(normalized)
      })
    } catch (error) {
      console.warn('calendarService load error:', fileName, error)
    }
  }
  return events
}

export async function loadRegionCategoryItems() {
  const categoryItems = {}

  for (const { fileName, category } of REGION_FILES) {
    try {
      const res = await fetch(BASE_PATH + fileName)
      if (!res.ok) {
        categoryItems[category] = []
        continue
      }

      const json = await res.json()
      if (!json.items || !Array.isArray(json.items)) {
        categoryItems[category] = []
        continue
      }

      categoryItems[category] = json.items
        .map(item => normalizeCategoryItem(item, fileName))
        .filter(Boolean)
        .map(normalized => ({
          ...normalized,
          category,
        }))
    } catch (error) {
      console.warn('calendarService loadCategoryItems error:', fileName, error)
      categoryItems[category] = []
    }
  }

  return categoryItems
}