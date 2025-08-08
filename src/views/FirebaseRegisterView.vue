<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h2 class="card-title mb-0"><i class="bi bi-person-plus me-2"></i>Create an Account</h2>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                required
                placeholder="Enter your email"
                autocomplete="email"
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
                autocomplete="new-password"
              />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                placeholder="Confirm your password"
                autocomplete="new-password"
              />
            </div>
            <button @click="register" class="btn btn-primary w-100">
              <i class="bi bi-person-plus me-2"></i>Create Account
            </button>
            
            <!-- 添加用户信息显示区域 -->
            <div v-if="currentUser" class="mt-4 p-3 bg-light rounded">
              <h4><i class="bi bi-person-badge me-2"></i>Registered User</h4>
              <pre class="mt-2">{{ currentUserInfo }}</pre>
              <button @click="copyToClipboard" class="btn btn-sm btn-outline-secondary mt-2">
                <i class="bi bi-clipboard me-1"></i>Copy to Clipboard
              </button>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-3">
              <i class="bi bi-exclamation-circle me-2"></i>{{ error }}
            </div>
            
            <div class="mt-4 text-center">
              <p>Already have an account? 
                <router-link to="/FireLogin" class="text-primary">Sign in here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore';

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const currentUser = ref(null);
const router = useRouter();
const auth = getAuth();
const authStore = useAuthStore();

// 格式化用户信息用于显示
const currentUserInfo = ref("");

const register = () => {
  // 验证密码匹配
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match. Please try again.";
    return;
  }
  
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Registration Successful!", userCredential.user);
      currentUser.value = userCredential.user;
      
      // 更新用户信息显示
      updateUserInfoDisplay();
      
      // 存储用户信息到认证状态管理器
      authStore.login({
        name: userCredential.user.email,
        role: 'user', // 默认角色
        email: userCredential.user.email,
        uid: userCredential.user.uid
      });
      
      // 延迟导航，让用户有时间查看信息
      setTimeout(() => {
        router.push("/");
      }, 2000);
    })
    .catch((error) => {
      console.error("Firebase Registration Error:", error);
      handleAuthError(error);
    });
};

// 更新用户信息显示
const updateUserInfoDisplay = () => {
  if (currentUser.value) {
    currentUserInfo.value = JSON.stringify({
      uid: currentUser.value.uid,
      email: currentUser.value.email,
      emailVerified: currentUser.value.emailVerified,
      providerId: currentUser.value.providerId,
      metadata: {
        creationTime: currentUser.value.metadata.creationTime,
        lastSignInTime: currentUser.value.metadata.lastSignInTime
      }
    }, null, 2);
  }
};

// 错误处理
const handleAuthError = (error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      error.value = 'Invalid email address.';
      break;
    case 'auth/email-already-in-use':
      error.value = 'This email is already in use.';
      break;
    case 'auth/weak-password':
      error.value = 'Password should be at least 6 characters.';
      break;
    case 'auth/operation-not-allowed':
      error.value = 'Account creation is currently disabled.';
      break;
    default:
      error.value = 'Registration failed. Please try again.';
  }
};

// 复制到剪贴板功能
const copyToClipboard = () => {
  navigator.clipboard.writeText(currentUserInfo.value)
    .then(() => {
      alert('User info copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      error.value = 'Failed to copy user info.';
    });
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

pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.25rem;
  max-height: 200px;
  overflow: auto;
}

.text-center {
  text-align: center;
}

.text-primary {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>