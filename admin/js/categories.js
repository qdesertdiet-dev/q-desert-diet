import { db } from '../../shared/firebase.js';
import { localizedText, localizedValue } from '../../shared/multilingual.js';
import { collection, addDoc, onSnapshot, deleteDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const categoryName = document.getElementById('categoryName');
const categoryNameAr = document.getElementById('category-name-ar');
const categoryList = document.getElementById('categoryList');
const addButton = document.getElementById('addCategory');
const categoryStatus = document.getElementById('category-status');
const categoryForm = document.getElementById('category-form');
const categoryId = document.getElementById('category-id');
let categories = [];

function setCategoryStatus(message, state='info') {
  if (!categoryStatus) return;
  categoryStatus.textContent = message;
  categoryStatus.dataset.state = state;
}

function ensureFirestoreReady() {
  if (!db) {
    alert('Firebase Firestore is not connected. Check Firebase config and project setup.');
    return false;
  }
  return true;
}

function renderCategories() {
  if (!db || !categoryList) return;

  onSnapshot(collection(db, 'categories'), (snap) => {
    categoryList.innerHTML = '';
    if (snap.empty) {
      categoryList.innerHTML = '<div class="empty-state">No categories yet.</div>';
      return;
    }

    categories = snap.docs.map(docSnap=>({id:docSnap.id,...docSnap.data()}));
    categories.forEach((data) => {
      const item = document.createElement('div');
      item.className = 'list-item';
      const name = document.createElement('span');
      name.textContent = localizedText(data.name,'en') || 'Unnamed category';
      const editButton = document.createElement('button');
      editButton.className = 'edit';
      editButton.dataset.id = data.id;
      editButton.textContent = 'Edit';
      const deleteButton = document.createElement('button');
      deleteButton.className = 'del';
      deleteButton.dataset.id = data.id;
      deleteButton.textContent = 'Delete';
      item.append(name, editButton, deleteButton);
      categoryList.appendChild(item);
    });
  }, (error) => {
    console.error('Could not load categories:', error);
    categoryList.textContent = 'Could not load categories. Check Firestore read permissions.';
  });
}

categoryForm && categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!ensureFirestoreReady()) return;

  const name = categoryName.value.trim();
  if (!name) return alert('Please enter a category name.');

  try {
    const id = categoryId.value;
    const categoryData = {
      name:localizedValue(name,categoryNameAr.value.trim()),
      ...(id ? {updatedAt:Date.now()} : {createdAt:Date.now()})
    };
    if(id) await setDoc(doc(db,'categories',id),categoryData,{merge:true});
    else await addDoc(collection(db,'categories'),categoryData);
    categoryForm.reset();
    categoryId.value = '';
    addButton.textContent = 'Add Category';
    setCategoryStatus(id ? 'Updated' : 'Added', 'success');
  } catch (err) {
    console.error('Add category failed', err);
    setCategoryStatus(err.message || 'Could not save category.', 'error');
  }
});

categoryForm && categoryForm.addEventListener('reset',()=>{
  categoryId.value = '';
  addButton.textContent = 'Add Category';
});

categoryList && categoryList.addEventListener('click', async (e) => {
  const target = e.target;
  if (!target || !target.dataset.id) return;

  if(target.classList.contains('edit')){
    const category = categories.find(entry=>entry.id === target.dataset.id);
    if(!category) return;
    categoryId.value = category.id;
    categoryName.value = localizedText(category.name,'en');
    categoryNameAr.value = category.name && typeof category.name === 'object' ? category.name.ar || '' : '';
    addButton.textContent = 'Save Category';
    setCategoryStatus('Editing category.', 'info');
  }

  if (target.classList.contains('del')) {
    if (!ensureFirestoreReady()) return;
    if (!confirm('Delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', target.dataset.id));
    } catch (err) {
      console.error('Delete category failed', err);
      const code = err && err.code ? err.code : 'unknown';
      const message = err && err.message ? err.message : 'Unknown error';
      alert(`Failed to delete category. Firebase error: ${code} - ${message}`);
    }
  }
});

renderCategories();