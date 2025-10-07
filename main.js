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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();
  if (!title || !content) return;

  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.push({ title, content });
  localStorage.setItem('notes', JSON.stringify(notes));

  addNoteToLibrary({ title, content });
  form.reset();
});

function addNoteToLibrary(note) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = `${note.title}: ${note.content}`;
  libraryList.appendChild(li);
}

// Load notes from LocalStorage
window.addEventListener('DOMContentLoaded', () => {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.forEach(addNoteToLibrary);
  if (notes.length) currentIndex = 0;
});

// Learn Section
const learnTitle = document.getElementById('learn-title');
const learnContent = document.getElementById('learn-content');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;

function showLearnCard() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
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
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  if (!notes.length) return;
  currentIndex = (currentIndex + 1) % notes.length;
  showLearnCard();
});

// Initial display for Learn section
window.addEventListener('DOMContentLoaded', showLearnCard);
