// Sections & Navbar
const sections = {
  library: document.getElementById('library-section'),
  author: document.getElementById('author-section'),
  learn: document.getElementById('learn-section')
};
const navLinks = document.querySelectorAll('.nav-link');

// SPA Navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    Object.values(sections).forEach(sec => sec.classList.add('d-none'));
    sections[link.getAttribute('data-section')].classList.remove('d-none');
  });
});

// Library & Author
const form = document.getElementById('author-form');
const libraryList = document.getElementById('library-list');
const searchInput = document.getElementById('search-input');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importInput = document.getElementById('importInput');

let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentIndex = 0;

// Add note
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();
  if (!title || !content) return;
  const note = { title, content };
  notes.push(note);
  saveNotes();
  addNoteToLibrary(note);
  form.reset();
  showLearnCard();
});

// Render note in Library
function addNoteToLibrary(note) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-start';
  li.innerHTML = `<span>${note.title}: ${note.content}</span>`;
  const delBtn = document.createElement('button');
  delBtn.className = 'btn btn-sm btn-danger';
  delBtn.textContent = 'حذف';
  delBtn.addEventListener('click', () => {
    notes = notes.filter(n => n !== note);
    saveNotes();
    libraryList.removeChild(li);
    if (currentIndex >= notes.length) currentIndex = 0;
    showLearnCard();
  });
  li.appendChild(delBtn);
  libraryList.appendChild(li);
}

// Save to LocalStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Render Library
function renderLibrary(filteredNotes = notes) {
  libraryList.innerHTML = '';
  filteredNotes.forEach(addNoteToLibrary);
}

// Search functionality
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = notes.filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
  renderLibrary(filtered);
});

// Learn section
const learnTitle = document.getElementById('learn-title');
const learnContent = document.getElementById('learn-content');
const nextBtn = document.getElementById('next-btn');

function showLearnCard() {
  if (!notes.length) {
    learnTitle.textContent = 'هیچ فلش کارتی موجود نیست';
    learnContent.textContent = '';
    return;
  }
  const note = notes[currentIndex];
  learnTitle.textContent = note.title;
  learnContent.textContent = note.content;
}

nextBtn.addEventListener('click', () => {
  if (!notes.length) return;
  currentIndex = (currentIndex + 1) % notes.length;
  showLearnCard();
});

// Export JSON
exportBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(notes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pocket_classroom.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import JSON
importBtn.addEventListener('click', () => importInput.click());
importInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (Array.isArray(imported)) {
        notes = imported;
        saveNotes();
        renderLibrary();
        currentIndex = 0;
        showLearnCard();
      }
    } catch (err) {
      alert('فایل JSON معتبر نیست');
    }
  };
  reader.readAsText(file);
});

// Initial load: add sample notes if empty
if (!notes.length) {
  notes = [
    { title: 'فلش‌کارت ۱', content: 'محتوای نمونه ۱' },
    { title: 'فلش‌کارت ۲', content: 'محتوای نمونه ۲' },
    { title: 'فلش‌کارت ۳', content: 'محتوای نمونه ۳' }
  ];
  saveNotes();
}

renderLibrary();
showLearnCard();
