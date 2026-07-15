cat > src/views/HomeView.vue <<'Vue'
<template>
  <section class="home-page">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1>밀가루 너머, 진짜 로컬을 걷다</h1>
          <p class="lead">대동여지도 : 대전 동네 여행 지도</p>
          <div class="hero-actions">
            <button class="btn primary">축제/행사 찾아보기</button>
            <button class="btn">일정 등록</button>
            <button class="btn ghost">게시판 이동</button>
          </div>
        </div>

        <div class="quick-categories">
          <div class="quick-title">퀵 카테고리 가이드</div>
          <div class="chips">
            <button class="chip">⛰️ 관광지</button>
            <button class="chip">🍲 맛집</button>
            <button class="chip">🎪 축제/행사</button>
            <button class="chip">💬 자유게시판</button>
          </div>
        </div>
      </div>
    </section>

    <section class="recent">
      <h2>최근 등록된 동네 소식</h2>
      <div class="news-card">
        <table class="news-table">
          <thead>
            <tr><th>카테고리</th><th>제목</th><th>작성자</th><th>조회</th><th>추천</th><th>날짜</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in recentList" :key="idx">
              <td class="cat">{{ item.cat }}</td>
              <td class="title">{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.view }}</td>
              <td>{{ item.like }}</td>
              <td>{{ item.date }}</td>
            </tr>
          </tbody>
        </table>

        <div class="more">
          <router-link to="/board">동네 소식 더 보기 &gt;</router-link>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const recentList = ref([
  { cat: '🍲 맛집', title: '성심당 대기 줄 안 서는 시간대 공유', author: '대전시민A', view: 142, like: 32, date: '07.15' },
  { cat: '⛰️ 관광', title: '가을 계족산 황톳길 맨발 코스 후기', author: '로컬가이드', view: 98, like: 15, date: '07.14' },
  { cat: '💬 자유', title: '유성온천 근처 조용하고 힙한 카페 추천좀', author: '빵돌이', view: 54, like: 4, date: '07.14' },
  { cat: '🎪 축제', title: '이번 주말 엑스포 음악분수 시간표 정보', author: '꿈돌이', view: 210, like: 45, date: '07.13' },
  { cat: '🍲 맛집', title: '칼국수 골목 진짜 원조 숨은 노포 찾음', author: '밀가루매니아', view: 120, like: 28, date: '07.12' },
]);
</script>

<style scoped>
.home-page { padding: 28px; max-width:1100px; margin:0 auto; }
.hero { background:#F2EADA; border: 3px solid #82997B; border-radius:14px; padding:28px; margin-bottom:24px; }
.hero-inner { display:flex; justify-content:space-between; gap:20px; align-items:flex-start; }
.hero-text h1 { margin:0; font-size:28px; color:#3F2B20; font-weight:800; }
.lead { color:#4b5563; margin:8px 0 18px; }
.hero-actions { display:flex; gap:12px; margin-top:12px; }
.btn { padding:10px 16px; border-radius:10px; border:1px solid #cbd5e1; background:#fff; cursor:pointer; }
.btn.primary { background:#237B47; color:#fff; border: none; }
.btn.ghost { background:transparent; border:1px solid rgba(0,0,0,0.08); }

.quick-categories { width:320px; }
.quick-title { font-weight:700; margin-bottom:10px; color:#2b3f2f; }
.chips { display:flex; flex-direction:column; gap:8px; }
.chip { text-align:left; padding:10px; border-radius:8px; background:#fff; border:1px solid #e6e6e6; cursor:pointer; }

.recent h2 { margin: 8px 0 12px; font-size:18px; }
.news-card { background:#fff; border-radius:10px; padding:12px; border:1px solid #e6e6e6; }
.news-table { width:100%; border-collapse:collapse; font-size:14px; }
.news-table thead th { text-align:left; padding:8px 10px; color:#475569; font-weight:700; }
.news-table tbody td { padding:10px; border-top:1px solid #f1f5f9; }
.title { max-width:520px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.more { text-align:right; margin-top:8px; }
</style>
Vue