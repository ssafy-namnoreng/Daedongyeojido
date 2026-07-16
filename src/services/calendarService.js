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

// 행사 playtime 문자열("15:00~21:00", "11:00~20:00(5.8 ...)" 등)에서
// 시작시간·끝시간(HH:MM)만 추출한다. 형식이 다양해 첫 두 개의 시:분을 사용.
export function parsePlaytime(playtime) {
  if (!playtime) return { startTime: '', endTime: '' }
  const times = String(playtime).match(/\d{1,2}:\d{2}/g)
  if (!times || times.length === 0) return { startTime: '', endTime: '' }
  return { startTime: times[0], endTime: times[1] || '' }
}

export function normalizeCategoryItem(item, fileName) {
  const title = item.title || item.name
  if (!title) return null

  const { startTime, endTime } = parsePlaytime(item.playtime)

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
    startDate: parseEventDate(item.eventstartdate) || null,
    endDate: parseEventDate(item.eventenddate) || null,
    startTime,
    endTime,
    playtime: item.playtime || '',
  }
}

// 시작일~종료일(YYYY-MM-DD) 사이의 모든 날짜 문자열 반환 (안전장치: 최대 90일)
function expandDateRange(startKey, endKey) {
  if (!startKey) return []

  const start = new Date(`${startKey}T00:00:00`)
  if (Number.isNaN(start.getTime())) return []

  let end = endKey ? new Date(`${endKey}T00:00:00`) : new Date(start)
  if (Number.isNaN(end.getTime()) || end < start) end = new Date(start)

  const dates = []
  const cursor = new Date(start)
  for (let i = 0; i < 90 && cursor <= end; i++) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, '0')
    const d = String(cursor.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
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
        // 실제 개최일(eventstartdate)이 있는 항목만 달력에 표시한다.
        // (관광지·음식점 등 날짜 없는 데이터가 등록일 기준으로 뿌려지던 문제 제거)
        const startKey = parseEventDate(item.eventstartdate)
        if (!startKey) return
        const endKey = parseEventDate(item.eventenddate) || startKey
        const { startTime, endTime } = parsePlaytime(item.playtime)

        const base = normalizeEventItem(item, fileName)
        if (!base) return

        // 다일(多日) 축제는 시작일~종료일 전체 날짜에 걸쳐 표시
        expandDateRange(startKey, endKey).forEach(dateStr => {
          if (!events[dateStr]) events[dateStr] = []
          events[dateStr].push({
            ...base,
            dateKey: dateStr,
            time: startTime || '', // 축제 시작시간을 일정 시간으로 기록
            startTime,
            endTime,
            startDate: startKey,
            endDate: endKey,
          })
        })
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