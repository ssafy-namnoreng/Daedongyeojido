# 대동여지도 (LocalHub)

공공데이터 기반 **대전·충청 지역 정보 공유 커뮤니티** — 백엔드 없이 브라우저에서 동작하는 Vue 3 정적 SPA.

배포: https://ai-onboarding-team.netlify.app/

## 주요 기능

- **홈** — 대전 지도(Leaflet)에 관광지·맛집·축제 등 장소를 카테고리 이모지 마커로 표시(클러스터링), 최신 게시글 요약, 카테고리 바로가기
- **커뮤니티 게시판** — 회원가입/로그인 없는 익명 게시판. 목록·상세·작성·수정·삭제(CRUD), 제목+내용 검색, 카테고리 필터, 페이지네이션
  - 게시글은 브라우저 `localStorage`에 저장
  - 수정·삭제는 작성 시 지정한 **숫자 4자리 비밀번호**로 확인 (서버가 없어 평문 저장·비교하는 교육용 설계)
- **일정 캘린더** — 공공데이터의 축제/행사를 **실제 개최일(시작~종료일)** 기준으로 달력에 표시, 개인 일정 메모(localStorage), 하단 카테고리 목록 검색 및 "캘린더에 추가"
- **AI 챗봇** — OpenAI API를 프론트에서 직접 호출. 사이트가 보유한 지역 데이터를 컨텍스트로 주입해 응답, 대화 히스토리 유지, 모바일 전체화면 대응

## 기술 스택

- Vue 3 (`<script setup>`) + Vite
- Vue Router (History 모드 SPA)
- Pinia (게시판 상태 관리)
- Tailwind CSS + 커스텀 스코프 스타일
- Leaflet + leaflet.markercluster (지도, OpenStreetMap 타일 — API 키 불필요)
- OpenAI API (챗봇)

## 요구 환경

- Node.js **20.19+** (Vite 8 요구 사항)
- npm

## 설치 및 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 로컬 미리보기
```

## 환경 변수

챗봇용 OpenAI 키는 `.env.local`에 저장하며, `.gitignore`에 등록되어 저장소에 커밋되지 않는다.

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_API_URL=https://api.openai.com/v1/chat/completions
VITE_OPENAI_MODEL=gpt-5-mini
```

> ⚠️ `VITE_` 접두사 값은 빌드 결과물(브라우저 번들)에 인라인되어 노출된다. 반드시 **사용량·결제 한도를 낮춘 전용 키**만 사용할 것. 환경 변수가 없어도 앱은 정상 동작하며 챗봇만 비활성화된다.

## 데이터

`public/data/대전_충청권/` 아래 8개 카테고리 JSON(한국관광공사 대전/충청 공공데이터)을 프론트엔드에서 `fetch`로 로드한다.

- 관광지 · 레포츠 · 문화시설 · 쇼핑 · 숙박 · 여행코스 · 음식점 · 축제/공연/행사

## Netlify 배포

배포 설정은 `netlify.toml`에 포함되어 있어, Netlify 대시보드에서는 **환경 변수만** 등록하면 된다.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA 폴백 리다이렉트(`/* → /index.html 200`) 및 Node 버전 고정 포함
- Netlify **Environment variables**에 `VITE_OPENAI_API_KEY` / `VITE_OPENAI_API_URL` / `VITE_OPENAI_MODEL` 등록 후 재배포

> VITE_ 키는 번들에 포함되므로, Netlify의 기본 secrets scanning이 빌드를 막을 경우 `netlify.toml`에서 해당 키를 스캔 예외로 지정한다.

## 프로젝트 구조

```
public/data/대전_충청권/   지역 공공데이터(JSON)
src/
  main.js                  진입점 (Vue · Router · Pinia 마운트)
  App.vue                  루트 (router-view + 전역 챗봇)
  router/index.js          라우팅 (/ · /board · /calendar)
  views/                   HomeView · BoardListView · CalendarView
  components/
    common/                AppHeader · AppFooter
    chatbot/               ChatBotFloating
    map/                   RegionMap (Leaflet 지도)
    MyButton.vue           공용 버튼(챗봇 토글 등)
  store/                   board.js · calendar.js (Pinia / localStorage)
  services/                chatService.js(OpenAI) · calendarService.js(데이터 로딩)
```

## Git 관리

- 커밋 제외: `node_modules/`, `dist/`, `.env.local`
