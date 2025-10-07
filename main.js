// Sections & Navbar
const sections = {
  library: document.getElementById('library-section'),
  author: document.getElementById('author-section'),
  learn: document.getElementById('learn-section')
};
const navLinks = document.querySelectorAll('.nav-link');

// SPA Navigation
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    Object.values(sections).forEach(sec => sec.classList.add('d-none'));
    sections[link.dataset.section].classList.remove('d-none');
  });
});

// Elements
const form = document.getElementById('author-form');
const editIndexInput = document.getElementById('edit-index');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const tagsInput = document.getElementById('note-tags');
const libraryList = document.getElementById('library-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importInput = document.getElementById('importInput');
const learnTitle = document.getElementById('learn-title');
const learnContent = document.getElementById('learn-content');
const learnTags = document.getElementById('learn-tags');
const learnDate = document.getElementById('learn-date');
const learnNextBtn = document.getElementById('learn-next-btn');
const learnDoneBtn = document.getElementById('learn-done-btn');

let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentIndex = 0;

// Save to LocalStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Render Library
function renderLibrary(filteredNotes = notes) {
  // مرتب‌سازی
  const sortVal = sortSelect.value;
  let sorted = [...filteredNotes];
  if (sortVal === 'date-asc') sorted.sort((a,b) => new Date(a.date) - new Date(b.date));
  else if (sortVal === 'date-desc') sorted.sort((a,b) => new Date(b.date) - new Date(a.date));
  else if (sortVal === 'title-asc') sorted.sort((a,b) => a.title.localeCompare(b.title));
  else if (sortVal === 'title-desc') sorted.sort((a,b) => b.title.localeCompare(a.title));

  libraryList.innerHTML = '';
  sorted.forEach((note, idx) => {
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `
      <div class="library-card">
        <h5>${note.title}</h5>
        <p>${note.content}</p>
        <p class="text-muted">تاریخ: ${note.date}</p>
        <p>${note.tags.map(t => `<span class="tag">${t}</span>`).join('')}</p>
        <button class="btn btn-sm btn-warning me-2">ویرایش</button>
        <button class="btn btn-sm btn-danger">حذف</button>
      </div>
    `;
    const [editBtn, delBtn] = div.querySelectorAll('button');
    // حذف
    delBtn.addEventListener('click', () => {
      notes = notes.filter(n => n !== note);
      saveNotes();
      renderLibrary();
      if(currentIndex >= notes.length) currentIndex = 0;
      showLearnCard();
    });
    // ویرایش
    editBtn.addEventListener('click', () => {
      editIndexInput.value = notes.indexOf(note);
      titleInput.value = note.title;
      contentInput.value = note.content;
      tagsInput.value = note.tags.join(', ');
      navLinks.forEach(l => l.classList.remove('active'));
      sections.author.classList.remove('d-none');
      document.querySelector('[data-section="author"]').classList.add('active');
    });
    libraryList.appendChild(div);
  });
}

// Add / Edit Note
form.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
  if(!title || !content) return;
  const date = new Date().toLocaleString();
  const editIndex = editIndexInput.value;
  if(editIndex) {
    notes[editIndex] = { ...notes[editIndex], title, content, tags, date };
    editIndexInput.value = '';
  } else {
    notes.push({ title, content, tags, date });
  }
  saveNotes();
  renderLibrary();
  form.reset();
  showLearnCard();
});

// Search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.content.toLowerCase().includes(query) ||
    n.tags.some(t => t.toLowerCase().includes(query))
  );
  renderLibrary(filtered);
});

// Sort
sortSelect.addEventListener('change', () => renderLibrary());

// Learn
function showLearnCard() {
  if(!notes.length) {
    learnTitle.textContent = 'هیچ فلش‌کارتی موجود نیست';
    learnContent.textContent = '';
    learnTags.textContent = '';
    learnDate.textContent = '';
    return;
  }
  const note = notes[currentIndex];
  learnTitle.textContent = note.title;
  learnContent.textContent = note.content;
  learnTags.innerHTML = note.tags.map(t => `<span class="tag">${t}</span>`).join('');
  learnDate.textContent = note.date;
}

learnNextBtn.addEventListener('click', () => {
  if(!notes.length) return;
  currentIndex = (currentIndex + 1) % notes.length;
  showLearnCard();
});

learnDoneBtn.addEventListener('click', () => {
  // حذف کارت آموخته شده
  if(!notes.length) return;
  notes.splice(currentIndex, 1);
  saveNotes();
  renderLibrary();
  if(currentIndex >= notes.length) currentIndex = 0;
  showLearnCard();
});

// Export
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(notes, null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pocket_classroom.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import
importBtn.addEventListener('click', () => importInput.click());
importInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const imported = JSON.parse(reader.result);
      if(Array.isArray(imported)){
        notes = imported.map(n => ({
          title: n.title||'',
          content: n.content||'',
          tags: n.tags||[],
          date: n.date||new Date().toLocaleString()
        }));
        saveNotes();
        renderLibrary();
        currentIndex = 0;
        showLearnCard();
      }
    }catch{
      alert('فایل JSON معتبر نیست');
    }
  };
  reader.readAsText(file);
});

// Sample notes
if(!notes.length){
  notes = [
    {title:'نمونه ۱', content:'محتوای نمونه ۱', tags:['ریاضی'], date:new Date().toLocaleString()},
    {title:'نمونه ۲', content:'محتوای نمونه ۲', tags:['فیزیک'], date:new Date().toLocaleString()},
    {title:'نمونه ۳', content:'محتوای نمونه ۳', tags:['شیمی'], date:new Date().toLocaleString()}
  ];
  saveNotes();
}

renderLibrary();
showLearnCard();  const dataStr = JSON.stringify(notes, null, 2);
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
