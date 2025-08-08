<template>
  <div class="container mt-5">
    <div class="card border-danger">
      <div class="card-header bg-danger text-white">
        <h1 class="card-title"><i class="bi bi-shield-lock me-2"></i>Access Denied</h1>
      </div>
      <div class="card-body">
        <p class="card-text">
          You are not authorized to access this page. Please log in with your credentials.
        </p>
        
        <div v-if="fromPath" class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          You were trying to access: <code>{{ fromPath }}</code>
        </div>
        
        <router-link 
          :to="loginRoute" 
          class="btn btn-primary btn-lg mt-3"
        >
          <i class="bi bi-box-arrow-in-right me-2"></i>Go to Login Page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 获取原始请求路径
const fromPath = computed(() => route.query.from);

// 创建登录路由（包含重定向参数）
const loginRoute = computed(() => {
  return {
    path: '/login',
    query: { 
      redirect: fromPath.value || '/' 
    }
  };
});
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-header {
  font-size: 1.5rem;
}

.card-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
</style>