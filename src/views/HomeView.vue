<script setup>
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: ''
})

const submittedCards = ref([])

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  
  if (!errors.value.username && 
      !errors.value.password && 
      !errors.value.confirmPassword) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: ''
  }
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}

// Friend validation
const friendMessage = computed(() => {
  if (formData.value.reason.toLowerCase().includes('friend')) {
    return 'Great to have a friend'
  }
  return ''
})
</script>

<template>
  <!-- 表单容器 -->
  <div class="container mt-3">
    <div class="text-center mb-4">
      <h1 class="text-primary">🗄️ W5. Library Registration Form</h1>
      <p class="text-muted">
        This form now includes validation. Registered users are displayed in a data table below
        (PrimeVue).
      </p>
    </div>
    
    <form @submit.prevent="submitForm">
      <!-- Row 1: Username and Gender -->
      <div class="row mb-3">
        <div class="col-md-6 mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            @blur="() => validateName(true)"
            @input="() => validateName(false)"
            v-model="formData.username"
          />
          <div v-if="errors.username" class="text-danger small">{{ errors.username }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label for="gender" class="form-label">Gender</label>
          <select class="form-select" id="gender" v-model="formData.gender" required>
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <!-- Row 2: Password and Confirm Password -->
      <div class="row mb-3">
        <div class="col-md-6 mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            @blur="() => validatePassword(true)"
            @input="() => { validatePassword(false); validateConfirmPassword(false); }"
            v-model="formData.password"
          />
          <div v-if="errors.password" class="text-danger small">{{ errors.password }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            @blur="() => validateConfirmPassword(true)"
            @input="() => validateConfirmPassword(false)"
            v-model="formData.confirmPassword"
          />
          <div v-if="errors.confirmPassword" class="text-danger small">{{ errors.confirmPassword }}</div>
        </div>
      </div>

      <!-- Row 3: Australian Resident Checkbox -->
      <div class="row mb-3">
        <div class="col-md-12">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="isAustralian"
              v-model="formData.isAustralian"
            />
            <label class="form-check-label" for="isAustralian">Australian Resident?</label>
          </div>
        </div>
      </div>

      <!-- Row 4: Reason Textarea -->
      <div class="mb-3">
        <label for="reason" class="form-label">Reason for joining</label>
        <textarea
          class="form-control"
          id="reason"
          rows="3"
          v-model="formData.reason"
        ></textarea>
        <div v-if="friendMessage" class="text-success mt-1 small">{{ friendMessage }}</div>
      </div>

      <!-- Row 5: Suburb Input -->
      <div class="mb-4">
        <label for="suburb" class="form-label">Suburb</label>
        <input
          type="text"
          class="form-control"
          id="suburb"
          v-model="formData.suburb"
        />
      </div>

      <!-- Buttons -->
      <div class="text-center">
        <button type="submit" class="btn btn-primary me-2 px-4">Submit</button>
        <button type="button" class="btn btn-outline-secondary px-4" @click="clearForm">Clear</button>
      </div>
    </form>
  </div>

  <!-- 数据表格容器 -->
  <div class="container mt-4">
    <h4 class="mb-3">This is a Primevue Datatable.</h4>
    <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
      <Column field="username" header="Username"></Column>
      <Column field="password" header="Password"></Column>
      <Column field="isAustralian" header="Australian Resident">
        <template #body="{ data }">
          {{ data.isAustralian ? 'Yes' : 'No' }}
        </template>
      </Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="reason" header="Reason"></Column>
      <Column field="suburb" header="Suburb"></Column>
    </DataTable>
  </div>

  <!-- 卡片容器 -->
  <div class="container mt-4" v-if="submittedCards.length">
    <h4 class="mb-3">Registered Users</h4>
    <div class="d-flex flex-wrap justify-content-start">
      <div
        v-for="(card, index) in submittedCards"
        :key="index"
        class="card m-2"
        style="width: 18rem"
      >
        <div class="card-header">User Information</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Username: {{ card.username }}</li>
          <li class="list-group-item">Password: {{ card.password }}</li>
          <li class="list-group-item">
            Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
          </li>
          <li class="list-group-item">Gender: {{ card.gender }}</li>
          <li class="list-group-item">Reason: {{ card.reason }}</li>
          <li class="list-group-item">Suburb: {{ card.suburb }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 12px 15px;
  border-radius: 10px 10px 0 0 !important;
  font-weight: 600;
}

.list-group-item {
  padding: 10px 15px;
  font-size: 0.9rem;
}


.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .card {
    width: 100% !important;
    margin: 10px 0 !important;
  }
  
  .row {
    flex-direction: column;
  }
  
  .col-md-6 {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
    margin-right: 0 !important;
  }
  
  .text-center .btn {
    margin-right: 0 !important;
  }
  
  .p-datatable {
    font-size: 0.85rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>