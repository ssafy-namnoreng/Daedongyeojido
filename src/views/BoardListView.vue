<template>
  <section>게시판 목록</section>
</template>

<script setup>
</script>
<!-- 1. AppHeader (상단 네비게이션) -->
<header class="sticky top-0 bg-[#F2EADA]/90 backdrop-blur-md z-40 border-b border-[#82997B]/30 shadow-sm">
  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <!-- 브랜드 로고 영역 -->
    <div class="flex items-center gap-2 cursor-pointer" @click="goToHome">
      <span class="text-2xl">🗺️</span>
      <h1 class="text-xl font-bold tracking-tight flex items-center font-serif text-[#3F2B20]">
        대동여지도
        <span class="text-xs text-[#237B47] font-semibold bg-[#237B47]/10 px-1.5 py-0.5 rounded ml-2 font-sans">Daedongyeojido</span>
      </h1>
    </div>

    <!-- 네비게이션 메뉴 -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-semibold">
      <a href="#" @click.prevent="goToHome" class="hover:text-[#237B47] transition-colors pb-1">홈</a>
      <a href="#" @click.prevent="selectCategory('⛰️ 관광')" :class="['transition-colors pb-1', selectedCategory === '⛰️ 관광' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">⛰️ 관광지</a>
      <a href="#" @click.prevent="selectCategory('🍲 맛집')" :class="['transition-colors pb-1', selectedCategory === '🍲 맛집' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">🍲 맛집</a>
      <a href="#" @click.prevent="selectCategory('🎪 축제')" :class="['transition-colors pb-1', selectedCategory === '🎪 축제' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">🎪 축제</a>
      <a href="#" @click.prevent="selectCategory('💬 자유')" :class="['transition-colors pb-1', selectedCategory === '💬 자유' ? 'text-[#237B47] border-b-2 border-[#237B47]' : 'hover:text-[#237B47]']">💬 소식통</a>
    </nav>

    <div class="flex items-center gap-3">
      <button 
        @click="isChatOpen = !isChatOpen" 
        class="bg-[#237B47] hover:bg-[#1C6339] text-[#F2EADA] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border border-[#E0BA73]/40"
      >
        <span>🧭</span> AI 가이드
      </button>
    </div>
  </div>
</header>

<!-- 2. 게시판 헤더 및 인트로 배너 -->
<section class="max-w-5xl w-full mx-auto px-4 pt-10 pb-4">
  <div class="border-l-4 border-[#237B47] pl-4">
    <h2 class="text-2xl md:text-3xl font-bold font-serif text-[#3F2B20] flex items-center gap-2">
      📢 동네 소식통
    </h2>
    <p class="text-xs md:text-sm text-[#82997B] mt-1.5 font-medium leading-relaxed">
      대전을 가장 잘 아는 로컬들이 실시간으로 제보하는 생생하고 가치 있는 동네 이야기를 만나보세요.
    </p>
  </div>
</section>

<!-- 3. 메인 기능 영역 (필터, 검색, 리스트) -->
<main class="flex-grow max-w-5xl w-full mx-auto px-4 pb-16">
  <div class="bg-[#FBF9F4] rounded-3xl p-6 md:p-8 border-2 border-[#82997B]/30 shadow-lg relative">
    <div class="absolute top-2 left-2 right-2 bottom-2 rounded-[22px] border border-[#82997B]/10 pointer-events-none"></div>

    <!-- 카테고리 가로 필터 탭 (반응형 터치 스크롤 지원) -->
    <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-4 mb-6 scrollbar-none relative z-10">
      <button 
        @click="selectCategory('전체')"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-xs',
          selectedCategory === '전체' 
            ? 'bg-[#237B47] text-[#F2EADA] border-[#237B47]' 
            : 'bg-[#F2EADA] text-[#3F2B20]/80 border-[#82997B]/30 hover:bg-[#82997B]/10'
        ]"
      >
        👣 전체보기
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat.filterName"
        @click="selectCategory(cat.filterName)"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-xs flex items-center gap-1',
          selectedCategory === cat.filterName 
            ? 'bg-[#237B47] text-[#F2EADA] border-[#237B47]' 
            : 'bg-[#F2EADA] text-[#3F2B20]/80 border-[#82997B]/30 hover:bg-[#82997B]/10'
        ]"
      >
        <span>{{ cat.emoji }}</span> {{ cat.name }}
      </button>
    </div>

    <!-- 검색바 및 정렬, 글쓰기 영역 -->
    <div class="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center mb-6 relative z-10">
      
      <!-- 검색창 (실시간 computed 필터 연동) -->
      <div class="relative flex-grow max-w-md">
        <span class="absolute inset-y-0 left-3.5 flex items-center text-sm">🔍</span>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="동네 소식 검색... (제목 + 내용 검색)" 
          class="w-full bg-white border border-[#82997B]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3F2B20] focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47] outline-none placeholder-[#82997B]/70 shadow-inner"
        />
      </div>

      <!-- 정렬 & 글쓰기 버튼 -->
      <div class="flex items-center gap-3 justify-between md:justify-end">
        <select 
          v-model="sortBy"
          class="bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#3F2B20]/80 outline-none focus:ring-1 focus:ring-[#237B47]"
        >
          <option value="latest">📅 최신순</option>
          <option value="views">👀 조회수순</option>
          <option value="likes">👍 추천순</option>
        </select>

        <button 
          @click="openCreatePostModal"
          class="bg-[#E0BA73] hover:bg-[#D3A95E] text-[#3F2B20] px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 border border-[#3F2B20]/10"
        >
          ✏️ 새 제보 남기기
        </button>
      </div>

    </div>

    <!-- 동적 게시글 목록 테이블 -->
    <div class="overflow-hidden rounded-2xl border-2 border-[#82997B]/20 bg-[#F2EADA]/30 relative z-10 shadow-inner">
      <div class="min-w-full">
        
        <!-- 데스크탑 헤더 (PC에서만 보임) -->
        <div class="hidden md:flex bg-[#82997B]/20 px-5 py-3.5 text-xs font-bold text-[#3F2B20] border-b border-[#82997B]/30">
          <div class="w-24">분류</div>
          <div class="flex-grow">제목</div>
          <div class="w-28 text-center">제보자</div>
          <div class="w-16 text-center">조회</div>
          <div class="w-16 text-center">추천</div>
          <div class="w-24 text-right">등록일</div>
        </div>

        <!-- 데이터 렌더링 영역 -->
        <div class="divide-y divide-[#82997B]/20">
          <div 
            v-for="post in paginatedPosts" 
            :key="post.id"
            @click="viewPostDetail(post)"
            class="flex flex-col md:flex-row md:items-center px-5 py-4 cursor-pointer hover:bg-[#82997B]/10 transition-all duration-150"
          >
            <!-- 카테고리 배지 -->
            <div class="w-24 mb-1.5 md:mb-0">
              <span 
                class="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                :style="{ backgroundColor: getCategoryColor(post.category) }"
              >
                {{ post.category }}
              </span>
            </div>

            <!-- 제목 및 모바일 전용 메타 정보가 결합된 정보 구역 -->
            <div class="flex-grow flex items-center justify-between gap-2">
              <div class="font-bold text-[#3F2B20] text-sm md:text-base truncate max-w-[280px] sm:max-w-xl md:max-w-none hover:text-[#237B47] transition-colors">
                {{ post.title }}
              </div>
            </div>

            <!-- 모바일 전용 하단 메타 레이아웃 -->
            <div class="flex md:hidden items-center gap-3 text-[11px] text-[#82997B] mt-2">
              <span>👤 {{ post.author }}</span>
              <span>👀 {{ post.views }}</span>
              <span>👍 {{ post.likes }}</span>
              <span class="ml-auto">📅 {{ formatMobileDate(post.createdAt) }}</span>
            </div>

            <!-- PC 데스크탑 전용 컬럼 레이아웃 -->
            <div class="hidden md:flex items-center w-full md:w-auto text-sm">
              <div class="w-28 text-center text-[#3F2B20]/80 font-medium truncate">{{ post.author }}</div>
              <div class="w-16 text-center text-[#82997B] font-semibold">{{ post.views }}</div>
              <div class="w-16 text-center text-[#E0BA73] font-bold">{{ post.likes }}</div>
              <div class="w-24 text-right text-xs text-[#82997B] font-mono">{{ formatPCDate(post.createdAt) }}</div>
            </div>

          </div>

          <!-- 검색 결과 혹은 등록된 글이 전혀 없을 때 예외 처리 -->
          <div v-if="filteredPosts.length === 0" class="py-20 text-center">
            <span class="text-4xl block mb-3">🧭</span>
            <p class="text-sm text-[#82997B] font-medium">검색 결과나 해당 카테고리에 등록된 제보가 없습니다.</p>
            <p class="text-[11px] text-[#82997B]/75 mt-1">대동여지도의 첫 번째 주인공이 되어 새로운 소식을 등록해보세요!</p>
          </div>
        </div>

      </div>
    </div>

    <!-- 슬라이딩 방식 페이지네이션 영역 -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-1.5 relative z-10">
      <button 
        @click="changePage(1)" 
        :disabled="currentPage === 1"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold"
      >
        &lt;&lt;
      </button>
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold"
      >
        &lt;
      </button>

      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="changePage(page)"
        :class="[
          'w-8 h-8 rounded-lg text-xs font-bold transition-all',
          currentPage === page 
            ? 'bg-[#237B47] text-white' 
            : 'border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10'
        ]"
      >
        {{ page }}
      </button>

      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold"
      >
        &gt;
      </button>
      <button 
        @click="changePage(totalPages)" 
        :disabled="currentPage === totalPages"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-[#82997B]/30 text-[#3F2B20] bg-white hover:bg-[#82997B]/10 disabled:opacity-40 disabled:hover:bg-white transition-all font-bold"
      >
        &gt;&gt;
      </button>
    </div>

  </div>
</main>

<!-- 4. AppFooter -->
<footer class="bg-[#3F2B20] text-[#F2EADA] py-12 px-6 mt-auto border-t-2 border-[#82997B]/30">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h4 class="text-lg font-serif font-bold text-[#E0BA73] mb-3">🗺️ 대동여지도</h4>
      <p class="text-xs text-[#F2EADA]/70 leading-relaxed">
        대전 지역 소상공인과 동네 주민, 여행객들을 위해 탄생한 무정전 익명 로컬 공유 네트워크 서비스입니다. 진짜 대전을 찾아 여행을 떠나보세요.
      </p>
    </div>
    <div>
      <h4 class="text-sm font-bold text-[#E0BA73] mb-3">📍 빠른 카테고리</h4>
      <div class="grid grid-cols-2 gap-2 text-xs text-[#F2EADA]/80 font-medium">
        <a href="#" @click.prevent="selectCategory('⛰️ 관광')" class="hover:underline">⛰️ 대전 관광지</a>
        <a href="#" @click.prevent="selectCategory('🍲 맛집')" class="hover:underline">🍲 대전 로컬맛집</a>
        <a href="#" @click.prevent="selectCategory('🎪 축제')" class="hover:underline">🎪 축제 및 행사</a>
        <a href="#" @click.prevent="selectCategory('💬 자유')" class="hover:underline">💬 자유 이야기판</a>
      </div>
    </div>
    <div class="flex flex-col justify-between">
      <div>
        <h4 class="text-sm font-bold text-[#E0BA73] mb-2">💡 협업 및 제보 안내</h4>
        <p class="text-xs text-[#F2EADA]/70">틀린 정보가 있거나 제안 사항이 있으시면 자유 게시판에 흔적을 남겨주시면 감사하겠습니다.</p>
      </div>
      <p class="text-[11px] text-[#F2EADA]/40 mt-4 font-mono">
        &copy; 2026 daedongyeojido Team. All Rights Reserved.
      </p>
    </div>
  </div>
</footer>

<!-- 5. 🧭 AI Guide Floating Bot -->
<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
  
  <!-- 챗봇 패널 -->
  <transition name="chat-slide">
    <div 
      v-if="isChatOpen" 
      class="w-[320px] sm:w-[380px] h-[480px] bg-[#FBF9F4] rounded-2xl border-2 border-[#E0BA73] shadow-2xl flex flex-col mb-4 overflow-hidden relative"
    >
      <!-- 챗봇 헤더 -->
      <div class="bg-gradient-to-r from-[#237B47] to-[#82997B] p-4 text-white flex items-center justify-between border-b border-[#E0BA73]/30">
        <div class="flex items-center gap-2">
          <span class="text-xl">🧙‍♂️</span>
          <div>
            <h4 class="text-sm font-serif font-bold text-[#E0BA73]">대동여지도 AI 도우미</h4>
            <p class="text-[10px] text-[#F2EADA]/80">대전 로컬 전문 가이드 봇</p>
          </div>
        </div>
        <button @click="isChatOpen = false" class="text-white hover:text-[#E0BA73] transition-colors font-bold text-lg">×</button>
      </div>

      <!-- 대화창 메시지 본체 -->
      <div ref="scrollRef" class="flex-grow p-4 overflow-y-auto space-y-4 bg-[#F2EADA]/40">
        <div 
          v-for="(msg, idx) in chatMessages" 
          :key="idx" 
          :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div 
            :class="[
              'max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm',
              msg.role === 'user' 
                ? 'bg-[#237B47] text-[#F2EADA] rounded-tr-none' 
                : 'bg-white text-[#3F2B20] border border-[#82997B]/20 rounded-tl-none'
            ]"
          >
            <p class="whitespace-pre-line">{{ msg.content }}</p>
          </div>
        </div>

        <!-- 로딩 애니메이션 -->
        <div v-if="isChatTyping" class="flex justify-start">
          <div class="bg-white border border-[#82997B]/20 text-[#82997B] rounded-2xl rounded-tl-none px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm">
            <span class="animate-bounce">●</span>
            <span class="animate-bounce [animation-delay:0.2s]">●</span>
            <span class="animate-bounce [animation-delay:0.4s]">●</span>
          </div>
        </div>
      </div>

      <!-- 입력 및 전송 영역 -->
      <div class="p-3 bg-[#FBF9F4] border-t border-[#82997B]/20 flex gap-2">
        <input 
          v-model="userQuery" 
          @keyup.enter="sendChatMessage"
          type="text" 
          placeholder="대전에 대해 물어보세요! (예: 성심당, 계족산...)" 
          class="flex-grow bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs text-[#3F2B20] focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47] outline-none placeholder-[#82997B]/70"
        />
        <button 
          @click="sendChatMessage"
          class="bg-[#237B47] hover:bg-[#3F2B20] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          전송
        </button>
      </div>
    </div>
  </transition>

  <!-- 플로팅 나침반 토글 버튼 -->
  <button 
    @click="isChatOpen = !isChatOpen"
    class="relative w-14 h-14 bg-gradient-to-br from-[#237B47] to-[#82997B] rounded-full flex items-center justify-center text-2xl shadow-2xl border-2 border-[#E0BA73] hover:scale-110 active:scale-95 transition-all duration-300 group"
  >
    <span class="transform group-hover:rotate-12 transition-transform duration-300">🧭</span>
    <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#F2EADA] animate-ping"></span>
    <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#F2EADA]"></span>
  </button>

</div>

<!-- 6. 상세 보기 모달 레이어 -->
<transition name="fade">
  <div v-if="selectedPost" class="fixed inset-0 bg-[#3F2B20]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div class="bg-[#FBF9F4] rounded-3xl border-2 border-[#E0BA73] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative">
      
      <div class="flex justify-between items-center mb-4">
        <span 
          class="px-2.5 py-0.5 rounded text-xs font-bold text-white"
          :style="{ backgroundColor: getCategoryColor(selectedPost.category) }"
        >
          {{ selectedPost.category }}
        </span>
        <button @click="selectedPost = null" class="text-2xl text-[#82997B] hover:text-[#3F2B20] transition-colors font-bold">&times;</button>
      </div>

      <h2 class="text-xl md:text-2xl font-bold font-serif text-[#3F2B20] mb-3">{{ selectedPost.title }}</h2>
      
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#82997B] pb-4 border-b border-[#82997B]/20 mb-6 font-medium">
        <span>👤 제보자: <strong class="text-[#3F2B20]">{{ selectedPost.author }}</strong></span>
        <span>📅 등록일: {{ formatPCDate(selectedPost.createdAt) }}</span>
        <span>👀 조회: {{ selectedPost.views }}</span>
        <span>👍 추천: {{ selectedPost.likes }}</span>
      </div>

      <div class="text-sm md:text-base leading-relaxed text-[#3F2B20]/90 space-y-4 mb-8 whitespace-pre-wrap font-sans">
        {{ selectedPost.content }}
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#82997B]/20">
        <button 
          @click="likePost(selectedPost)"
          class="px-5 py-2 bg-[#E0BA73] hover:bg-[#D3A95E] text-[#3F2B20] rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 border border-[#3F2B20]/10"
        >
          👍 이 제보 추천하기 ({{ selectedPost.likes }})
        </button>
        <div class="flex items-center gap-2">
          <button 
            @click="promptPasswordCheck('delete')"
            class="px-3.5 py-2 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
          >
            🗑️ 삭제
          </button>
          <button 
            @click="selectedPost = null"
            class="px-3.5 py-2 bg-[#82997B]/20 text-[#3F2B20] hover:bg-[#82997B]/30 rounded-xl text-xs font-bold transition-all"
          >
            목록으로
          </button>
        </div>
      </div>

    </div>
  </div>
</transition>

<!-- 7. 신규 제보글 등록 모달 -->
<transition name="fade">
  <div v-if="isCreateModalOpen" class="fixed inset-0 bg-[#3F2B20]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div class="bg-[#FBF9F4] rounded-3xl border-2 border-[#82997B] shadow-2xl max-w-xl w-full p-6 md:p-8 relative">
      
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg md:text-xl font-bold font-serif text-[#3F2B20] flex items-center gap-2">
          <span>✏️</span> 대동여지도 새 제보 남기기
        </h3>
        <button @click="isCreateModalOpen = false" class="text-2xl text-[#82997B] hover:text-[#3F2B20] transition-colors font-bold">&times;</button>
      </div>

      <form @submit.prevent="submitNewPost" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#3F2B20] mb-1">분류 선택 *</label>
          <select 
            v-model="newPost.category" 
            class="w-full bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs md:text-sm text-[#3F2B20] outline-none focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47]"
            required
          >
            <option value="⛰️ 관광">⛰️ 관광지</option>
            <option value="🍲 맛집">🍲 맛집</option>
            <option value="🎪 축제">🎪 축제/행사</option>
            <option value="💬 자유">💬 자유게시판</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-[#3F2B20] mb-1">익명 제보자 이름 *</label>
            <input 
              v-model="newPost.author"
              type="text" 
              placeholder="예: 빵돌이"
              class="w-full bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs md:text-sm text-[#3F2B20] outline-none focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47]"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-[#3F2B20] mb-1">비밀번호 (수정/삭제용) *</label>
            <input 
              v-model="newPost.password"
              type="password" 
              placeholder="숫자 4자리"
              maxlength="4"
              class="w-full bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs md:text-sm text-[#3F2B20] outline-none focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47]"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#3F2B20] mb-1">제보 제목 *</label>
          <input 
            v-model="newPost.title"
            type="text" 
            placeholder="전달하고 싶은 소식의 한줄 제목"
            class="w-full bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs md:text-sm text-[#3F2B20] outline-none focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47]"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#3F2B20] mb-1">제보 내용 *</label>
          <textarea 
            v-model="newPost.content"
            rows="5" 
            placeholder="로컬들이 알아야 할 생생한 비법과 정보를 자세하게 채워주세요."
            class="w-full bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs md:text-sm text-[#3F2B20] outline-none focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47] resize-none"
            required
          ></textarea>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button 
            type="button" 
            @click="isCreateModalOpen = false"
            class="px-4 py-2 bg-[#82997B]/20 text-[#3F2B20] hover:bg-[#82997B]/30 rounded-xl text-xs font-bold transition-all"
          >
            취소하기
          </button>
          <button 
            type="submit"
            class="px-5 py-2 bg-[#237B47] hover:bg-[#3F2B20] text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            지도에 제보 올리기
          </button>
        </div>
      </form>

    </div>
  </div>
</transition>

<!-- 8. 비밀번호 입력 가설 팝업 모달 -->
<transition name="fade">
  <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-[#3F2B20]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div class="bg-[#FBF9F4] rounded-2xl border-2 border-[#E0BA73] shadow-2xl max-w-xs w-full p-6 text-center">
      <span class="text-3xl block mb-2">🔒</span>
      <h4 class="text-base font-serif font-bold text-[#3F2B20] mb-1">익명 제보자 확인</h4>
      <p class="text-xs text-[#82997B] mb-4">제보 작성시 등록했던 비밀번호를 입력해주세요.</p>
      
      <input 
        v-model="passwordInput"
        type="password" 
        placeholder="숫자 4자리"
        maxlength="4"
        class="w-full bg-white border border-[#82997B]/40 rounded-xl px-3 py-2 text-xs text-center font-bold tracking-widest text-[#3F2B20] outline-none focus:ring-1 focus:ring-[#237B47] focus:border-[#237B47] mb-3"
      />
      
      <p v-if="passwordError" class="text-[10px] text-rose-500 font-bold mb-3">🚨 비밀번호가 틀렸습니다.</p>

      <div class="flex gap-2 justify-center">
        <button 
          @click="isPasswordModalOpen = false"
          class="px-3.5 py-1.5 bg-[#82997B]/20 text-[#3F2B20] hover:bg-[#82997B]/30 rounded-lg text-xs font-bold transition-all"
        >
          취소
        </button>
        <button 
          @click="validatePasswordAndCommit"
          class="px-4 py-1.5 bg-[#237B47] hover:bg-[#3F2B20] text-white rounded-lg text-xs font-bold transition-all"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</transition>

<!-- 실시간 알림용 토스트 -->
<transition name="fade">
  <div 
    v-if="toastMessage" 
    class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#3F2B20] text-[#F2EADA] border border-[#E0BA73] py-2.5 px-5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2"
  >
    <span>🌟</span> {{ toastMessage }}
  </div>
</transition>
