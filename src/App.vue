<template>
  <div id="app">
    <!-- 현재 주소에 맞는 뷰(Home, Board 등)를 렌더링하는 영역 -->
    <router-view />

    <!-- 위에서 만든 전역 챗봇 불러오기 -->
    <ChatBotFloating />
  </div>
</template>

<script setup>
import ChatBotFloating from './components/chatbot/ChatBotFloating.vue'
</script>

<style>
/* App 전체 공통 스타일 레이아웃 (필요시 작성) */
#app {
  width: 100%;
  min-height: 100vh;
}
</style>