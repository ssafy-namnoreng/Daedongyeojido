// filepath: c:\team_project\Daedongyeojido\src\stores\board.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 지도 팔레트와 통일된 카테고리 색상
const CATEGORY_COLORS = {
  '⛰️ 관광': '#33553E', // 소나무 그린
  '🍲 맛집': '#A63C26', // 벽돌 레드
  '🎪 축제': '#A2712C', // 놋쇠 브라스
  '💬 자유': '#6B5B45'  // 잉크 소프트
}

const CATEGORIES = [
  { filterName: '⛰️ 관광', name: '관광지', emoji: '⛰️' },
  { filterName: '🍲 맛집', name: '맛집', emoji: '🍲' },
  { filterName: '🎪 축제', name: '축제/행사', emoji: '🎪' },
  { filterName: '💬 자유', name: '자유게시판', emoji: '💬' }
]

// 데모용 목데이터 (백엔드 연결 전까지 사용)
const MOCK_POSTS = [
  {
    id: 5,
    category: '🍲 맛집',
    title: '성심당 대기 줄 안 서는 시간대 공유',
    author: '대전시민A',
    password: '1234',
    content: '평일 오후 2~3시가 그나마 한산해요. 주말은 언제 가도 줄이 있는 편이니 참고하세요!',
    views: 142,
    likes: 32,
    createdAt: '2026-07-15T09:20:00'
  },
  {
    id: 4,
    category: '⛰️ 관광',
    title: '가을 계족산 황톳길 맨발 코스 후기',
    author: '로컬가이드',
    password: '1234',
    content: '황톳길 초입 매표소에서 발 씻는 곳 위치 안내해드려요. 수건은 꼭 챙기세요.',
    views: 98,
    likes: 15,
    createdAt: '2026-07-14T18:40:00'
  },
  {
    id: 3,
    category: '💬 자유',
    title: '유성온천 근처 조용하고 힙한 카페 추천좀',
    author: '빵돌이',
    password: '1234',
    content: '스터디하기 좋은 곳으로 부탁드려요. 콘센트 있는 곳이면 더 좋아요!',
    views: 54,
    likes: 4,
    createdAt: '2026-07-14T11:05:00'
  },
  {
    id: 2,
    category: '🎪 축제',
    title: '이번 주말 엑스포 음악분수 시간표 정보',
    author: '꿈돌이',
    password: '1234',
    content: '저녁 8시, 8시 40분 두 타임 진행됩니다. 자리 일찍 잡으시는 걸 추천해요.',
    views: 210,
    likes: 45,
    createdAt: '2026-07-13T20:15:00'
  },
  {
    id: 1,
    category: '🍲 맛집',
    title: '칼국수 골목 진짜 원조 숨은 노포 찾음',
    author: '밀가루매니아',
    password: '1234',
    content: '간판도 없는 집인데 30년 넘게 하셨대요. 현금만 받으니 참고하세요.',
    views: 120,
    likes: 28,
    createdAt: '2026-07-12T13:30:00'
  }
]

export const useBoardStore = defineStore('board', () => {
  const posts = ref([...MOCK_POSTS])
  const categories = ref(CATEGORIES)

  const nextId = computed(() =>
    posts.value.length ? Math.max(...posts.value.map((p) => p.id)) + 1 : 1
  )

  function addPost({ category, author, password, title, content }) {
    const newPost = {
      id: nextId.value,
      category,
      author,
      password,
      content,
      title,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    }
    posts.value.unshift(newPost)
    return newPost
  }

  function incrementViews(id) {
    const post = posts.value.find((p) => p.id === id)
    if (post) post.views += 1
  }

  function likePost(id) {
    const post = posts.value.find((p) => p.id === id)
    if (post) post.likes += 1
  }

  function deletePost(id, password) {
    const post = posts.value.find((p) => p.id === id)
    if (!post) return false
    if (post.password !== password) return false
    posts.value = posts.value.filter((p) => p.id !== id)
    return true
  }

  function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || '#6B5B45'
  }

  return {
    posts,
    categories,
    addPost,
    incrementViews,
    likePost,
    deletePost,
    getCategoryColor
  }
})