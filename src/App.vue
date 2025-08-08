<script setup>
import BHeader from './components/BHeader.vue'
import { createPinia } from 'pinia'; 
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main>
    <router-view></router-view>
  </main>
</template>

<style>
/* 全局容器样式 - 从HomeView.vue移动过来 */
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 95%;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
body {
  font-size: 16px;
  background-color: #f8f9fa;
  padding-bottom: 40px; /* 底部留白 */
}
@media (max-width: 768px) {
  .container {
    max-width: 100%;
    margin: 10px;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>

<style scoped>
/* 保留原有的作用域样式 */
</style>