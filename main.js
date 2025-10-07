// main.js

// ————————————————————
// بخش‌ها و تب‌ها
// ————————————————————
const sections = {
  library: document.getElementById('section-library'),
  author: document.getElementById('section-author'),
  learn: document.getElementById('section-learn')
};

function showSection(name) {
  Object.keys(sections).forEach(key => {
    sections[key].classList.toggle('d-none', key !== name);
  });
}

document.getElementById('nav-library').addEventListener('click', () => showSection('library'));
document.getElementById('nav-author').addEventListener('click', () => showSection('author'));
document.getElementById('nav-learn').addEventListener('click', () => showSection('learn'));

// ————————————————————
// LocalStorage Capsules
// ————————————————————
let capsules = JSON.parse(localStorage.getItem('capsules') || '[]');
let editingIndex = null;

const grid = document.getElementById('capsule-grid');
const emptyMsg = document.getElementById('empty-library');

function renderLibrary() {
  grid.innerHTML = '';
  if (capsules.length === 0) {
    emptyMsg.classList.remove('d-none');
    return;
  }
  emptyMsg.classList.add('d-none');

  capsules.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'col-md-3';
    card.innerHTML = `
      <div class="card p-2 shadow-sm">
        <h5>${c.title}</h5>
        <p>${c.subject || ''}</p>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-light" onclick="editCapsule(${i})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCapsule(${i})">Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
renderLibrary();

// ————————————————————
// New Capsule / Cancel
// ————————————————————
document.getElementById('btn-new').addEventListener('click', () => {
  showSection('author');
  document.getElementById('author-form').reset();
  editingIndex = null;
});

document.getElementById('cancel-edit').addEventListener('click', () => {
  showSection('library');
});

// ————————————————————
// Save Capsule
// ————————————————————
document.getElementById('save-capsule').addEventListener('click', (e) => {
  e.preventDefault();
  const capsule = {
    title: document.getElementById('meta-title').value,
    subject: document.getElementById('meta-subject').value,
    level: document.getElementById('meta-level').value,
    desc: document.getElementById('meta-desc').value,
    notes: document.getElementById('notes-text').value.split('\n'),
    flashcards: flashcards,
    quiz: quiz
  };

  if (editingIndex !== null) {
    capsules[editingIndex] = capsule;
  } else {
    capsules.push(capsule);
  }

  localStorage.setItem('capsules', JSON.stringify(capsules));
  renderLibrary();
  showSection('library');
  resetAuthor();
});

// ————————————————————
// Edit / Delete Capsule
// ————————————————————
window.editCapsule = function(i) {
  editingIndex = i;
  const c = capsules[i];
  showSection('author');
  document.getElementById('meta-title').value = c.title;
  document.getElementById('meta-subject').value = c.subject;
  document.getElementById('meta-level').value = c.level;
  document.getElementById('meta-desc').value = c.desc;
  document.getElementById('notes-text').value = c.notes.join('\n');
  flashcards = c.flashcards || [];
  quiz = c.quiz || [];
  renderFlashcards();
  renderQuiz();
}

window.deleteCapsule = function(i) {
  if (!confirm('Delete this capsule?')) return;
  capsules.splice(i,1);
  localStorage.setItem('capsules', JSON.stringify(capsules));
  renderLibrary();
}

// ————————————————————
// Flashcards
// ————————————————————
let flashcards = [];

document.getElementById('add-flashcard').addEventListener('click', (e) => {
  e.preventDefault();
  flashcards.push({front:'Front', back:'Back'});
  renderFlashcards();
});

function renderFlashcards() {
  const container = document.getElementById('flashcards-rows');
  container.innerHTML = '';
  flashcards.forEach((f, i) => {
    const div = document.createElement('div');
    div.className = 'mb-2 d-flex gap-2 align-items-center';
    div.innerHTML = `
      <input class="form-control form-control-sm" placeholder="Front" value="${f.front}" onchange="flashcards[${i}].front=this.value">
      <input class="form-control form-control-sm" placeholder="Back" value="${f.back}" onchange="flashcards[${i}].back=this.value">
      <button class="btn btn-sm btn-outline-danger" onclick="removeFlashcard(${i})">Delete</button>
    `;
    container.appendChild(div);
  });
}

window.removeFlashcard = function(i) {
  flashcards.splice(i,1);
  renderFlashcards();
}

// ————————————————————
// Quiz
// ————————————————————
let quiz = [];

document.getElementById('add-quiz').addEventListener('click', (e)=>{
  e.preventDefault();
  quiz.push({question:'Question?', choices:['A','B','C','D'], answer:0});
  renderQuiz();
});

function renderQuiz() {
  const container = document.getElementById('quiz-rows');
  container.innerHTML = '';
  quiz.forEach((qst,i)=>{
    const div = document.createElement('div');
    div.className = 'mb-2';
    div.innerHTML = `
      <input class="form-control form-control-sm mb-1" placeholder="Question" value="${qst.question}" onchange="quiz[${i}].question=this.value">
      <div class="d-flex gap-1 mb-1">
        ${qst.choices.map((c,j)=>`
          <input class="form-control form-control-sm" value="${c}" onchange="quiz[${i}].choices[${j}]=this.value">
        `).join('')}
      </div>
      <select class="form-select form-select-sm mb-1" onchange="quiz[${i}].answer=this.selectedIndex">
        ${qst.choices.map((c,j)=>`<option ${qst.answer===j?'selected':''}>${c}</option>`).join('')}
      </select>
      <button class="btn btn-sm btn-outline-danger" onclick="removeQuiz(${i})">Delete</button>
    `;
    container.appendChild(div);
  });
}

window.removeQuiz = function(i){
  quiz.splice(i,1);
  renderQuiz();
}

// ————————————————————
// Reset Author Form
// ————————————————————
function resetAuthor(){
  document.getElementById('author-form').reset();
  flashcards = [];
  quiz = [];
  renderFlashcards();
  renderQuiz();
}
