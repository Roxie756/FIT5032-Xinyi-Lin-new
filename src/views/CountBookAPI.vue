<!-- src/views/CountBookAPI.vue -->
<template>
  <div class="api-container">
    <div class="header">
      <h1 class="display-4">Library Statistics API</h1>
      <p class="lead">Get author and book statistics from local JSON files</p>
    </div>
    
    <div class="api-controls">
      <button @click="getApiData" class="btn btn-primary">
        <i class="bi bi-arrow-repeat me-2"></i>Refresh the data
      </button>
      <div class="stats-card">
        <div class="stat-item">
          <i class="bi bi-people-fill"></i>
          <span>Number of authors: {{ authorsCount }}</span>
        </div>
        <div class="stat-item">
          <i class="bi bi-book-half"></i>
          <span>Total number of books: {{ totalBooks }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading data...</p>
    </div>
    
    <div v-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>
    
    <div v-if="apiResponse" class="api-response">
      <div class="response-header">
        <h3>API response data</h3>
        <button @click="toggleJsonView" class="btn btn-sm btn-outline-secondary">
          {{ showRawJson ? 'Table view' : 'Raw JSON' }}
        </button>
      </div>
      
      <div v-if="showRawJson" class="json-view">
        <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
      </div>
      
      <div v-else class="table-view">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>author</th>
              <th>Number of works</th>
              <th>Main types</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="author in apiResponse.data.authors" :key="author.name">
              <td>{{ author.name }}</td>
              <td>{{ author.bookCount }}</td>
              <td>{{ author.genres.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 从assets导入JSON数据
import authorsData from '@/assets/json/authors.json'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)
const showRawJson = ref(true)

const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const toggleJsonView = () => {
  showRawJson.value = !showRawJson.value
}

const getApiData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    authors.value = authorsData
    calculateStats()
    
    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map(author => ({
          name: author.name,
          bookCount: author.famousWorks.length,
          genres: author.genres
        }))
      },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    error.value = `Error loading author data: ${err.message}`
    console.error('Error loading author data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getApiData()
})
</script>

<style scoped>
.api-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.api-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.stats-card {
  display: flex;
  gap: 25px;
  background: #f8f9fa;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 500;
}

.stat-item i {
  font-size: 1.5rem;
  color: #0d6efd;
}

.api-response {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px;
  margin-top: 20px;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.json-view {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  max-height: 500px;
  overflow-y: auto;
}

pre {
  margin: 0;
}

.table-view {
  overflow-x: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .api-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-card {
    width: 100%;
  }
}
</style>