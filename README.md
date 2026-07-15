# localhub

대전·충청 여행 허브 Vue SPA 프로젝트

## 프로젝트 개요

- Vue 3 + Vite 기반 SPA
- 지역 관광 데이터, 게시판, 일정 관리, 챗봇 UI 구성 예정
- Netlify 배포 대상

## 요구 환경

- Node.js 18 이상 권장
- `npm` 사용
- Git 저장소 클론 후 작업

## 설치

```bash
cd /c/NAM/day03/project
npm install
```

## 로컬 개발 서버 실행

```bash
npm run dev
```

- 실행 후 브라우저에서 `http://localhost:5173` 접속
- 코드 수정 시 자동 HMR 적용

## 빌드

```bash
npm run build
```

- `dist/` 폴더 생성

## 로컬 빌드 미리보기

```bash
npm run preview
```

- 빌드 결과를 로컬 서버로 확인

## 환경 변수

- 민감한 키는 `.env.local`에 저장
- `.env.local`은 `.gitignore`에 등록되어 Git에 커밋되지 않음

예시:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Netlify 배포

1. GitHub / GitLab 저장소 연결
2. Netlify에서 사이트 생성
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 환경 변수 등록
   - `VITE_OPENAI_API_KEY`

### SPA 리다이렉트 설정

`public/_redirects` 파일을 생성하고 아래 내용을 추가하면 `history` 모드 라우터에서 새로고침도 정상 동작합니다.

```text
/* /index.html 200
```

## Git 관리

- 포함
  - `package.json`
  - `package-lock.json`
  - `src/`
  - `public/`
- 제외
  - `node_modules/`
  - `dist/`
  - `.env.local`
  - `.vscode/`
  - `*.log`

## 파일 구조 요약

| 경로 | 설명 |
| --- | --- |
| `src/main.js` | 애플리케이션 진입점 |
| `src/App.vue` | 공통 레이아웃 |
| `src/router/index.js` | 라우터 설정 |
| `src/views/` | 페이지 컴포넌트 |
| `src/components/` | 재사용 UI 컴포넌트 |
| `src/store/` | 상태 관리 |
| `src/services/` | OpenAI / API 호출 로직 |
| `public/data/` | 로컬 데이터 파일 |

## 실행 순서

1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`
3. 화면 확인: `http://localhost:5173`
4. 배포 준비: `npm run build`
