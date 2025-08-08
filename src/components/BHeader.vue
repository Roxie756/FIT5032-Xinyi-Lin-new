<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-book me-2"></i>Library System
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              <i class="bi bi-house-door me-1"></i>Home
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">
              <i class="bi bi-info-circle me-1"></i>About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Firelogin" class="nav-link" active-class="active">
              <i class="bi bi-fire me-1"></i>Firebase Login
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/FireRegister" class="nav-link" active-class="active">
              <i class="bi bi-person-plus me-1"></i>Firebase Register
            </router-link>
          </li>
           <li class="nav-item">
            <router-link to="/addBook" class="nav-link" active-class="active">
              <i class="bi bi-person-plus me-1"></i>Add Book
            </router-link>
          </li>
          <li class="nav-item">
  <router-link to="/WeatherCheck" class="nav-link" active-class="active">
    <i class="bi bi-cloud-sun me-1"></i>Get Weather
  </router-link>
</li>
<li class="nav-item">
  <router-link to="/CountBookAPI" class="nav-link" active-class="active">
    <i class="bi bi-database me-1"></i>Library Statistics API
  </router-link>
</li>
<li class="nav-item">
  <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">
    <i class="bi bi-book me-1"></i>Get All Books API
  </router-link>
</li>
        </ul>
        
        <!-- 用户信息和操作区域 -->
        <div class="d-flex align-items-center">
          <div v-if="authStore.isAuthenticated.value" class="user-info me-3">
            <span class="text-light me-2">
              <i class="bi bi-person-circle me-1"></i>
              {{ authStore.userName.value }}
            </span>
            <span :class="roleClass">{{ authStore.userRole.value }}</span>
          </div>
          
          <div v-if="authStore.isAuthenticated.value">
            <button class="btn btn-outline-light" @click="logout">
              <i class="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
          <div v-else class="d-flex">
            <router-link to="/login" class="btn btn-outline-light me-2">
              <i class="bi bi-box-arrow-in-right me-1"></i>Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// 角色徽章样式
const roleClass = computed(() => {
  const role = authStore.userRole.value;
  return {
    'badge': true,
    'bg-danger': role === 'admin',
    'bg-success': role === 'manager',
    'bg-info': role === 'user',
    'bg-secondary': !role || role === 'guest'
  };
});

// 登出功能
const logout = () => {
  authStore.logout();
  router.push('/login');
};

// 订阅认证状态变化
let unsubscribe;
onMounted(() => {
  unsubscribe = authStore.subscribe((authStatus) => {
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
  padding: 0.8rem 1rem;
}

.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.nav-link:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem;
  }
  
  .navbar-brand {
    font-size: 1rem;
  }
  
  .navbar-collapse {
    background-color: #0d6efd;
    border-radius: 0.5rem;
    padding: 10px;
    margin-top: 10px;
  }
  
  .user-info {
    margin-bottom: 10px;
  }
  
  .d-flex {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>