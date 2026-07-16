<template>
  <div class="region-map-wrap">
    <div ref="mapEl" class="region-map"></div>
    <p v-if="loadError" class="region-map-error">지도를 불러오지 못했습니다.</p>
    <p v-else-if="markerCount" class="region-map-caption">
      지도에 표시된 장소 {{ markerCount.toLocaleString() }}곳
    </p>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { loadRegionCategoryItems } from '@/services/calendarService'

// 대전/충청 권역 중심 (대전 시청 부근)
const DAEJEON_CENTER = [36.3504, 127.3845]

const mapEl = ref(null)
const loadError = ref(false)
const markerCount = ref(0)
let map = null

onMounted(async () => {
  const L = window.L
  if (!L || !mapEl.value) {
    loadError.value = true
    return
  }

  // 기본 마커 아이콘을 CDN 경로로 고정 (미지정 시 마커 이미지가 깨질 수 있음)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  map = L.map(mapEl.value, {
    center: DAEJEON_CENTER,
    zoom: 12,
    scrollWheelZoom: false, // 페이지 스크롤 방해 방지 (버튼으로 확대/축소)
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // 컨테이너 크기가 확정된 뒤 타일이 전체 영역을 덮도록 재계산
  await nextTick()
  map.invalidateSize()
  setTimeout(() => map && map.invalidateSize(), 300)

  // 우리 데이터 좌표(mapx/mapy)로 핀 표시 — 가까운 핀은 클러스터로 묶음
  try {
    const categoryData = await loadRegionCategoryItems()
    const items = Object.values(categoryData).flat()

    const group = L.markerClusterGroup
      ? L.markerClusterGroup({ maxClusterRadius: 55 })
      : L.layerGroup()

    // 좌표가 한국 범위를 벗어난 이상치(0,0 등)는 제외
    const inKorea = (lat, lng) => lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132

    let count = 0
    items.forEach(item => {
      if (item.lat == null || item.lng == null) return
      if (!inKorea(item.lat, item.lng)) return
      const marker = L.marker([item.lat, item.lng])
      marker.bindTooltip(item.title)
      group.addLayer(marker)
      count += 1
    })

    map.addLayer(group)
    markerCount.value = count
  } catch (error) {
    console.warn('지도 마커 로딩 실패:', error)
  }
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.region-map-wrap {
  position: relative;
}

.region-map {
  width: 100%;
  height: 440px;
  border-radius: 6px;
  border: 1px solid rgba(44, 35, 24, 0.18);
  box-shadow: 0 8px 24px rgba(44, 35, 24, 0.08);
  z-index: 0;
}

.region-map-caption {
  margin: 8px 2px 0;
  font-size: 12.5px;
  color: #6b5b45;
  text-align: right;
}

.region-map-error {
  margin: 8px 0 0;
  font-size: 13px;
  color: #a63c26;
}

@media (max-width: 560px) {
  .region-map {
    height: 320px;
  }
}
</style>
