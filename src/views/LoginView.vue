<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h2 class="card-title mb-0"><i class="bi bi-person-lock me-2"></i>Login</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  required
                  placeholder="Enter your username"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                <i class="bi bi-box-arrow-in-right me-2"></i>Login
              </button>
            </form>
            
            <div v-if="error" class="alert alert-danger mt-3">
              <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();
const username = ref('');
const password = ref('');
const error = ref('');

const authStore = useAuthStore();

// 定义用户角色和凭证
const validUsers = [
  { username: 'admin', password: 'admin', name: 'Admin User', role: 'admin' },
  { username: 'manager', password: 'manager', name: 'Manager User', role: 'manager' },
  { username: 'user', password: 'user', name: 'Regular User', role: 'user' }
];

const login = () => {
  const foundUser = validUsers.find(
    u => u.username === username.value && u.password === password.value
  );

  if (foundUser) {
    authStore.login({
      name: foundUser.name,
      role: foundUser.role,
      username: foundUser.username
    });
    
    // 重定向到原始请求页面或首页
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } else {
    error.value = 'Invalid username or password. Please try again.';
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
}

.card-header {
  border-radius: 0.5rem 0.5rem 0 0 !important;
}

.btn-primary {
  padding: 0.5rem 1rem;
}
</style>