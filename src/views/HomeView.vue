<!-- filepath: c:\team_project\Daedongyeojido\src\views\HomeView.vue -->
<template>
  <div class="app-shell">
    <!-- 배경 등고선 -->
    <svg class="contour-bg" viewBox="0 0 1200 1600" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d="M-50,180 C 250,120 450,240 750,150 S 1150,220 1350,140" class="contour" />
      <path d="M-80,340 C 220,300 480,400 760,300 S 1160,380 1380,300" class="contour" />
      <path d="M-60,980 C 260,930 470,1040 780,960 S 1180,1030 1360,970" class="contour" />
      <path d="M-60,1140 C 240,1100 500,1200 790,1110 S 1170,1180 1380,1120" class="contour" />
    </svg>

    <header class="topbar">
      <div class="brand">
        <div class="brand-seal">
          <img src="/favicon-source.png" alt="대동여지도 로고" />
        </div>
        <div class="brand-copy">
          <h1><span>대동여지도</span></h1>
          <p>DAEDONGYEOJIDO · 동네를 그리다</p>
        </div>
      </div>

      <nav class="nav-links">
        <a href="#">커뮤니티 게시판</a>
        <a href="#">일정 캘린더</a>
      </nav>
    </header>

    <main class="main">
      <section class="hero-card">
        <svg class="compass" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" class="compass-ring" />
          <circle cx="50" cy="50" r="2.5" class="compass-dot" />
          <path d="M50 8 L57 50 L50 92 L43 50 Z" class="compass-needle" />
          <text x="50" y="20" class="compass-label">N</text>
        </svg>

        <div class="hero-text">
          <span class="coord-tag">N 36°21' · E 127°23' — DAEJEON</span>
          <h2>밀가루 너머,<br />진짜 로컬을 걷다</h2>
          <p>대동여지도 : 대전 동네 여행 지도</p>

          <div class="hero-actions">
            <button class="btn-primary">축제/행사 찾아보기</button>
            <button class="btn-secondary">일정 등록</button>
          </div>
        </div>

        <div class="legend">
          <p class="legend-title">지도 범례 · LEGEND</p>
          <div class="legend-grid">
            <div class="legend-card">
              <span class="legend-mark mark-terrain">⛰</span>
              <span class="legend-name">관광지</span>
            </div>
            <div class="legend-card">
              <span class="legend-mark mark-food">🍲</span>
              <span class="legend-name">맛집</span>
            </div>
            <div class="legend-card">
              <span class="legend-mark mark-event">🎪</span>
              <span class="legend-name">축제/행사</span>
            </div>
            <div class="legend-card">
              <span class="legend-mark mark-talk">💬</span>
              <span class="legend-name">자유게시판</span>
            </div>
          </div>
        </div>
      </section>

      <section class="news-section">
        <div class="news-title-row">
          <h3>탐험 기록부 <span>최근 등록된 동네 소식</span></h3>
        </div>

        <div class="log-list">
          <article class="log-entry">
            <span class="log-tag tag-food">맛집</span>
            <div class="log-body">
              <p class="log-title">성심당 대기 줄 안 서는 시간대 공유</p>
              <p class="log-meta">대전시민A · 07.15</p>
            </div>
            <div class="log-stats">
              <span>조회 142</span>
              <span>추천 32</span>
            </div>
          </article>

          <article class="log-entry">
            <span class="log-tag tag-terrain">관광</span>
            <div class="log-body">
              <p class="log-title">가을 계족산 황톳길 맨발 코스 후기</p>
              <p class="log-meta">로컬가이드 · 07.14</p>
            </div>
            <div class="log-stats">
              <span>조회 98</span>
              <span>추천 15</span>
            </div>
          </article>

          <article class="log-entry">
            <span class="log-tag tag-talk">자유</span>
            <div class="log-body">
              <p class="log-title">유성온천 근처 조용하고 힙한 카페 추천좀</p>
              <p class="log-meta">빵돌이 · 07.14</p>
            </div>
            <div class="log-stats">
              <span>조회 54</span>
              <span>추천 4</span>
            </div>
          </article>

          <article class="log-entry">
            <span class="log-tag tag-event">축제</span>
            <div class="log-body">
              <p class="log-title">이번 주말 엑스포 음악분수 시간표 정보</p>
              <p class="log-meta">꿈돌이 · 07.13</p>
            </div>
            <div class="log-stats">
              <span>조회 210</span>
              <span>추천 45</span>
            </div>
          </article>

          <article class="log-entry">
            <span class="log-tag tag-food">맛집</span>
            <div class="log-body">
              <p class="log-title">칼국수 골목 진짜 원조 숨은 노포 찾음</p>
              <p class="log-meta">밀가루매니아 · 07.12</p>
            </div>
            <div class="log-stats">
              <span>조회 120</span>
              <span>추천 28</span>
            </div>
          </article>
        </div>

        <div class="news-more">
          <a href="#">동네 소식 더 보기 &gt;</a>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-frame">
        <p>대동여지도 서비스 소개 · 지역 탐험의 새로운 기준</p>
        <span>© 2026 Daedongyeojido</span>
      </div>
    </footer>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700;900&family=Noto+Sans+KR:wght@400;500;700;800&display=swap');

:global(body) {
  margin: 0;
  background: #f2e8d3;
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
}

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
  overflow: hidden;
  background:
    radial-gradient(ellipse at 15% 0%, rgba(166, 60, 38, 0.05), transparent 55%),
    radial-gradient(ellipse at 85% 100%, rgba(51, 85, 62, 0.06), transparent 55%),
    var(--paper);
  color: var(--ink);
  padding-bottom: 40px;
}

.contour-bg {
  position: absolute;
  top: 0;
  left: 0;
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

.topbar,
.main,
.footer {
  position: relative;
  z-index: 1;
}

.topbar {
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
}

.brand-seal {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--paper-deep);
  border: 2px solid var(--brass);
  box-shadow: 0 0 0 3px var(--paper), 0 0 0 4px var(--brass);
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
  color: var(--ink);
}

.brand-copy h1 span {
  font-size: 14px;
  font-weight: 700;
  margin-left: 6px;
  color: var(--ink-soft);
}

.brand-copy p {
  margin: 3px 0 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--brass);
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  text-decoration: none;
  color: var(--ink-soft);
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
  background: var(--route);
  transition: width 0.2s ease;
}

.nav-links a:hover {
  color: var(--ink);
}

.nav-links a:hover::after {
  width: 100%;
}

.main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* ---------- HERO ---------- */

.hero-card {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 32px;
  background: linear-gradient(160deg, #f8f1de 0%, #efe1bf 100%);
  border: 1px solid rgba(44, 35, 24, 0.18);
  border-radius: 6px;
  padding: 48px 44px;
  box-shadow: 0 18px 40px rgba(44, 35, 24, 0.1);
}

.hero-card::before {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(162, 113, 44, 0.35);
  border-radius: 3px;
  pointer-events: none;
}

.compass {
  position: absolute;
  top: 24px;
  right: 32px;
  width: 54px;
  height: 54px;
  opacity: 0.85;
}

.compass-ring {
  fill: none;
  stroke: var(--brass);
  stroke-width: 1.4;
}

.compass-needle {
  fill: var(--route);
}

.compass-dot {
  fill: var(--ink);
}

.compass-label {
  font-size: 9px;
  font-weight: 800;
  fill: var(--ink-soft);
  text-anchor: middle;
}

.coord-tag {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--route);
  border: 1px solid rgba(166, 60, 38, 0.4);
  border-radius: 999px;
  padding: 4px 12px;
  margin-bottom: 18px;
}

.hero-text h2 {
  margin: 0 0 10px;
  font-family: 'Noto Serif KR', serif;
  font-size: 36px;
  line-height: 1.28;
  font-weight: 900;
  color: var(--ink);
}

.hero-text p {
  margin: 0 0 26px;
  font-size: 15px;
  color: var(--ink-soft);
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

button {
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-family: inherit;
  border-radius: 4px;
  padding: 13px 20px;
  font-size: 14px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--pine);
  color: #f6f0de;
  box-shadow: 0 8px 18px rgba(51, 85, 62, 0.28);
}

.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1.4px solid var(--ink);
}

.legend {
  position: relative;
  border-left: 1px dashed rgba(44, 35, 24, 0.3);
  padding-left: 28px;
}

.legend-title {
  margin: 0 0 14px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.legend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(248, 241, 224, 0.7);
  border: 1px solid rgba(44, 35, 24, 0.16);
  border-radius: 4px;
  padding: 16px 8px;
  cursor: default;
  transition: border-color 0.2s ease, transform 0.15s ease;
}

.legend-card:hover {
  border-color: var(--brass);
  transform: translateY(-2px);
}

.legend-mark {
  font-size: 22px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--paper);
  border: 1.4px solid currentColor;
}

.mark-terrain { color: var(--pine); }
.mark-food { color: var(--route); }
.mark-event { color: var(--brass); }
.mark-talk { color: #5a5140; }

.legend-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
}

/* ---------- NEWS / LOG ---------- */

.news-section {
  margin-top: 40px;
}

.news-title-row h3 {
  margin: 0 0 18px;
  font-family: 'Noto Serif KR', serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--ink);
}

.news-title-row h3 span {
  display: block;
  margin-top: 4px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-soft);
}

.log-list {
  display: flex;
  flex-direction: column;
  background: rgba(248, 241, 224, 0.6);
  border: 1px solid rgba(44, 35, 24, 0.15);
  border-radius: 6px;
  overflow: hidden;
}

.log-entry {
  display: grid;
  grid-template-columns: 68px 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 16px 22px;
  border-bottom: 1px dashed rgba(44, 35, 24, 0.16);
  transition: background 0.15s ease;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry:hover {
  background: rgba(162, 113, 44, 0.07);
}

.log-tag {
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  padding: 5px 0;
  border-radius: 3px;
  border: 1px solid currentColor;
  letter-spacing: 0.02em;
}

.tag-food { color: var(--route); }
.tag-terrain { color: var(--pine); }
.tag-talk { color: #5a5140; }
.tag-event { color: var(--brass); }

.log-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.log-meta {
  margin: 0;
  font-size: 12.5px;
  color: var(--ink-soft);
}

.log-stats {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--ink-soft);
  font-weight: 600;
  white-space: nowrap;
}

.news-more {
  padding: 16px 4px;
  text-align: right;
}

.news-more a {
  color: var(--pine);
  font-weight: 700;
  text-decoration: none;
  font-size: 13.5px;
}

.news-more a:hover {
  text-decoration: underline;
}

/* ---------- FOOTER ---------- */

.footer {
  max-width: 1180px;
  margin: 24px auto 0;
  padding: 0 24px;
}

.footer-frame {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(44, 35, 24, 0.2);
  padding-top: 18px;
  color: var(--ink-soft);
  font-size: 12.5px;
}

/* ---------- RESPONSIVE ---------- */

@media (max-width: 860px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .legend {
    border-left: none;
    border-top: 1px dashed rgba(44, 35, 24, 0.3);
    padding-left: 0;
    padding-top: 24px;
  }

  .log-entry {
    grid-template-columns: 52px 1fr;
  }

  .log-stats {
    grid-column: 2;
    padding-left: 0;
  }
}

@media (max-width: 560px) {
  .nav-links {
    display: none;
  }

  .hero-card {
    padding: 32px 22px;
  }

  .hero-text h2 {
    font-size: 27px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>