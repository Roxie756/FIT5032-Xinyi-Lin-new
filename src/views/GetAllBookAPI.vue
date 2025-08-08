<template>
  <div class="api-container">
    <div class="header">
      <h1 class="display-4">Library Books API</h1>
      <p class="lead">Get all books data in JSON format</p>
    </div>
    
    <div class="api-controls">
      <button @click="getAllBooks" class="btn btn-primary">
        <i class="bi bi-book me-2"></i>Get All Books
      </button>
      <div class="stats-card">
        <div class="stat-item">
          <i class="bi bi-book-half"></i>
          <span>Total Books: {{ totalBooks }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading book data...</p>
    </div>
    
    <div v-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>
    
    <div v-if="allBooksData" class="api-response">
      <div class="response-header">
        <h3>All Books API Response</h3>
        <div class="view-options">
          <button @click="showRawJson = true" class="btn btn-sm" :class="showRawJson ? 'btn-primary' : 'btn-outline-primary'">
            Raw JSON
          </button>
          <button @click="showRawJson = false" class="btn btn-sm ms-2" :class="!showRawJson ? 'btn-primary' : 'btn-outline-primary'">
            Table View
          </button>
        </div>
      </div>
      
      <div v-if="showRawJson" class="json-view">
        <pre>{{ JSON.stringify(allBooksData, null, 2) }}</pre>
      </div>
      
      <div v-else class="table-view">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Genres</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in allBooksData.data.books" :key="book.title + book.author">
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.year }}</td>
              <td>{{ book.genres.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <i class="bi bi-book fs-1 text-muted"></i>
      <p class="mt-3">Click "Get All Books" to retrieve book data</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import authorsData from '@/assets/json/authors.json'

const loading = ref(false)
const error = ref(null)
const allBooksData = ref(null)
const showRawJson = ref(true)
const totalBooks = ref(0)

const getAllBooks = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 提取所有书籍数据
    const allBooks = []
    
    authorsData.forEach(author => {
      author.famousWorks.forEach(book => {
        allBooks.push({
          title: book.title,
          author: author.name,
          year: book.year,
          genres: author.genres
        })
      })
    })
    
    totalBooks.value = allBooks.length
    
    allBooksData.value = {
      success: true,
      data: {
        totalBooks: totalBooks.value,
        books: allBooks
      },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    error.value = `Error loading book data: ${err.message}`
    console.error('Error loading book data:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.api-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  padding: 30px;
  border-radius: 15px;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header p {
  opacity: 0.9;
}

.api-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.stats-card {
  display: flex;
  gap: 25px;
  background: #f8f9fa;
  padding: 15px 30px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 500;
}

.stat-item i {
  font-size: 1.8rem;
  color: #6c5ce7;
}

.api-response {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  padding: 25px;
  margin-top: 20px;
  border: 1px solid #e9ecef;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f3f5;
}

.view-options {
  display: flex;
}

.json-view {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 25px;
  border-radius: 12px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Courier New', monospace;
  max-height: 600px;
  overflow-y: auto;
  font-size: 0.95rem;
}

pre {
  margin: 0;
  line-height: 1.5;
}

.table-view {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #6c5ce7;
  color: white;
  border-top: none;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(108, 92, 231, 0.05);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  margin-top: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  margin-top: 20px;
  color: #6c757d;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  opacity: 0.5;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .api-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-card {
    width: 100%;
    justify-content: center;
  }
  
  .response-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .view-options {
    width: 100%;
    justify-content: center;
  }
}
</style>