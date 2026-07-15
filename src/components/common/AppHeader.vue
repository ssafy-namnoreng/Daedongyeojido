<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="brand">
        <img :src="logoUrl" alt="대동여지도" class="logo-img" />
        <div class="brand-text">
          <div class="title">대동여지도</div>
          <div class="subtitle">Daedongyeojido</div>
        </div>
      </div>

      <nav class="main-nav">
        <router-link to="/board">커뮤니티 게시판</router-link>
        <router-link to="/calendar">일정 캘린더</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import logoUrl from '../../assets/images/dadong.png'
</script>

<style scoped>
.site-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand { display:flex; align-items:center; gap:12px; }
.logo-img {
  width:48px;
  height:48px;
  border-radius:8px;
  object-fit:cover;
}
.brand-text .title { font-weight:700; font-size:18px; color:#3F2B20; }
.brand-text .subtitle { font-size:12px; color:#64748b; }
.main-nav a { margin-left:18px; color:#1f2937; font-weight:600; text-decoration:none; }
</style>