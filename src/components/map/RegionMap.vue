<template>
  <div class="region-map-wrap">
    <div ref="mapEl" class="region-map"></div>
    <p v-if="loadError" class="region-map-error">지도를 불러오지 못했습니다.</p>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

// 대전/충청 권역 중심 (대전 시청 부근)
const DAEJEON_CENTER = [36.3504, 127.3845]

const mapEl = ref(null)
const loadError = ref(false)
let map = null

onMounted(async () => {
  const L = window.L
  if (!L || !mapEl.value) {
    loadError.value = true
    return
  }

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
