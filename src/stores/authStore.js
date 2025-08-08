import { ref, computed } from 'vue';

// 创建全局响应式认证状态
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');
const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null);

// 登录方法（添加角色和用户信息支持）
const login = (userData) => {
  isAuthenticated.value = true;
  currentUser.value = userData;
  
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('currentUser', JSON.stringify(userData));
  
  // 通知所有订阅者状态已更新
  updateSubscribers();
};

// 登出方法
const logout = () => {
  isAuthenticated.value = false;
  currentUser.value = null;
  
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
  
  // 通知所有订阅者状态已更新
  updateSubscribers();
};

// 获取用户角色
const userRole = computed(() => {
  return currentUser.value?.role || 'guest';
});

// 获取用户名
const userName = computed(() => {
  return currentUser.value?.name || 'Guest';
});

// 订阅者列表
const subscribers = new Set();

// 添加状态变化监听
const subscribe = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

// 通知所有订阅者
const updateSubscribers = () => {
  subscribers.forEach(callback => callback({
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
    userRole: userRole.value,
    userName: userName.value
  }));
};

// 导出可复用的认证状态和方法
export function useAuthStore() {
  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    currentUser: computed(() => currentUser.value),
    userRole,
    userName,
    login,
    logout,
    subscribe
  };
}