<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>Add Book</h1>
        <form @submit.prevent="addBook">
          <div class="mb-3">
            <label for="isbn" class="form-label">ISBN:</label>
            <input 
              type="number" 
              v-model.number="book.isbn" 
              id="isbn" 
              class="form-control"
              required
            >
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Book Name:</label>
            <input 
              type="text" 
              v-model.trim="book.name" 
              id="name" 
              class="form-control"
              required
            >
          </div>
          <button type="submit" class="btn btn-primary">Add Book</button>
        </form>
      </div>
      <div class="col-md-6">
        <BookList />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import db from '@/firebase/init';
import BookList from '@/components/BookList.vue';

const book = ref({
  isbn: null,
  name: ''
});

const addBook = async () => {
  try {
    const docRef = await addDoc(collection(db, 'books'), {
      isbn: book.value.isbn,
      name: book.value.name,
      createdAt: new Date()
    });
    
    console.log('Book added with ID:', docRef.id);
    book.value = { isbn: null, name: '' };
    alert('Book added successfully!');
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Failed to add book: ' + error.message);
  }
};
</script>