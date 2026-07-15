<template>
  <AppHeader />
  <router-view />
  <ChatBotFloating />
</template>

<script setup>
import AppHeader from './components/common/AppHeader.vue'
import ChatBotFloating from './components/chatbot/ChatBotFloating.vue'
</script>