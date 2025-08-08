<template>
  <div class="mt-5">
    <h2>Book List</h2>
    
    <!-- Filter Controls -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">Filter Options</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Filter Field:</label>
            <select v-model="filterField" class="form-select">
              <option value="isbn">ISBN</option>
              <option value="name">Book Name</option>
              <option value="createdAt">Created Date</option>
            </select>
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Operator:</label>
            <select v-model="filterOperator" class="form-select">
              <option value=">">Greater Than</option>
              <option value=">=">Greater Than or Equal</option>
              <option value="==">Equal To</option>
              <option value="!=">Not Equal</option>
              <option value="<">Less Than</option>
              <option value="<=">Less Than or Equal</option>
              <option value="array-contains">Contains</option>
            </select>
          </div>
          
          <div class="col-md-4">
            <label class="form-label">Filter Value:</label>
            <input 
              v-if="filterField === 'createdAt'"
              type="date"
              v-model="filterValue"
              class="form-control"
            >
            <input 
              v-else-if="filterField === 'isbn'"
              type="number"
              v-model.number="filterValue"
              class="form-control"
            >
            <input 
              v-else
              type="text"
              v-model.trim="filterValue"
              class="form-control"
            >
          </div>
          
          <div class="col-md-1 d-flex align-items-end">
            <button 
              class="btn btn-primary"
              @click="applyFilter"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order and Limit Controls -->
    <div class="mb-3">
      <label class="me-2">Order By:</label>
      <select v-model="orderByField" class="form-select d-inline-block w-auto">
        <option value="isbn">ISBN</option>
        <option value="name">Name</option>
        <option value="createdAt">Created At</option>
      </select>
      
      <select v-model="orderDirection" class="form-select d-inline-block w-auto ms-2">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      
      <label class="ms-3 me-2">Limit:</label>
      <input 
        type="number" 
        v-model.number="limitCount" 
        min="1"
        class="form-control d-inline-block w-auto"
      >
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <!-- Results -->
    <div v-else>
      <div v-if="activeFilter" class="alert alert-info mb-3">
        Active Filter: {{ filterField }} {{ filterOperator }} {{ filterValue }}
      </div>
      
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Book Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.isbn }}</td>
            <td>{{ book.name }}</td>
            <td>{{ formatDate(book.createdAt) }}</td>
            <td>
              <button 
                class="btn btn-sm btn-warning me-2"
                @click="startEdit(book)"
              >
                Edit
              </button>
              <button 
                class="btn btn-sm btn-danger"
                @click="deleteBook(book.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="books.length === 0" class="alert alert-info">
        No books found matching the filter criteria
      </div>
    </div>
    
    <!-- Edit Modal -->
    <div v-if="editingBook" class="modal" style="display: block; background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Book</h5>
            <button type="button" class="btn-close" @click="cancelEdit"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">ISBN:</label>
              <input 
                type="number" 
                v-model.number="editingBook.isbn" 
                class="form-control"
                required
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Book Name:</label>
              <input 
                type="text" 
                v-model.trim="editingBook.name" 
                class="form-control"
                required
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveEdit">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import db from '@/firebase/init';

const books = ref([]);
const loading = ref(true);
const editingBook = ref(null);
const originalBook = ref(null);
const activeFilter = ref(false);

// Filter parameters
const filterField = ref('isbn');
const filterOperator = ref('>');
const filterValue = ref(1000);

// Order and limit parameters
const orderByField = ref('isbn');
const orderDirection = ref('desc');
const limitCount = ref(5);

onMounted(() => {
  fetchBooks();
});

// Watch query parameters for changes
watch([orderByField, orderDirection, limitCount], () => {
  fetchBooks();
});

const applyFilter = () => {
  activeFilter.value = true;
  fetchBooks();
};

const fetchBooks = async () => {
  try {
    loading.value = true;
    
    // Create base query
    let q = query(
      collection(db, 'books'),
      orderBy(orderByField.value, orderDirection.value),
      limit(limitCount.value)
    );
    
    // Add where clause if filter is active
    if (activeFilter.value && filterValue.value !== '') {
      // Convert date string to Date object if needed
      let value = filterValue.value;
      
      // 处理字符串包含查询
      if (filterField.value === 'name' && filterOperator.value === 'array-contains') {
        // 对于字符串字段，使用字符串操作符而不是 array-contains
        q = query(q, where(filterField.value, '>=', value));
        q = query(q, where(filterField.value, '<=', value + '\uf8ff'));
      }
      // 处理日期筛选
      else if (filterField.value === 'createdAt') {
        // 创建日期范围 (00:00:00 到 23:59:59)
        const startDate = new Date(value);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(value);
        endDate.setHours(23, 59, 59, 999);
        
        if (filterOperator.value === '==') {
          // 对于日期相等，使用范围查询
          q = query(q, where('createdAt', '>=', startDate));
          q = query(q, where('createdAt', '<=', endDate));
        } else {
          // 其他日期操作符
          q = query(q, where('createdAt', filterOperator.value, startDate));
        }
      }
      // 处理其他字段类型
      else {
        q = query(q, where(filterField.value, filterOperator.value, value));
      }
    }
    
    const querySnapshot = await getDocs(q);
    
    books.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
    
  } catch (error) {
    console.error('Error fetching books:', error);
    alert('Failed to fetch books: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

const startEdit = (book) => {
  editingBook.value = { ...book };
  originalBook.value = { ...book };
};

const cancelEdit = () => {
  editingBook.value = null;
  originalBook.value = null;
};

const saveEdit = async () => {
  try {
    if (!editingBook.value) return;
    
    await updateDoc(doc(db, 'books', editingBook.value.id), {
      isbn: editingBook.value.isbn,
      name: editingBook.value.name
    });
    
    // Update local state
    const index = books.value.findIndex(b => b.id === editingBook.value.id);
    if (index !== -1) {
      books.value[index] = { ...editingBook.value };
    }
    
    alert('Book updated successfully!');
    cancelEdit();
  } catch (error) {
    console.error('Error updating book:', error);
    alert('Failed to update book: ' + error.message);
  }
};

const deleteBook = async (id) => {
  if (!confirm('Are you sure you want to delete this book?')) return;
  
  try {
    await deleteDoc(doc(db, 'books', id));
    books.value = books.value.filter(book => book.id !== id);
    alert('Book deleted successfully!');
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('Failed to delete book: ' + error.message);
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>