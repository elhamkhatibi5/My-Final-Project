// main.js

// بخش‌ها
const sections = {
  library: document.getElementById('section-library'),
  author: document.getElementById('section-author'),
  learn: document.getElementById('section-learn')
};

// سوئیچ بین بخش‌ها
document.getElementById('nav-library').addEventListener('click', () => showSection('library'));
document.getElementById('nav-author').addEventListener('click', () => showSection('author'));
document.getElementById('nav-learn').addEventListener('click', () => showSection('learn'));

function showSection(name) {
  Object.keys(sections).forEach(key => {
    sections[key].classList.toggle('d-none', key !== name);
  });
}

// مدیریت Library
let capsules = JSON.parse(localStorage.getItem('capsules') || '[]');
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
        <button class="btn btn-sm btn-outline-light" onclick="editCapsule(${i})">Edit</button>
      </div>
    `;
    grid.appendChild(card);
  });
}
renderLibrary();

// New Capsule
document.getElementById('btn-new').addEventListener('click', () => {
  showSection('author');
  document.getElementById('author-form').reset();
});

// Save Capsule
document.getElementById('save-capsule').addEventListener('click', (e) => {
  e.preventDefault();
  const capsule = {
    title: document.getElementById('meta-title').value,
    subject: document.getElementById('meta-subject').value,
    level: document.getElementById('meta-level').value,
    desc: document.getElementById('meta-desc').value,
    notes: document.getElementById('notes-text').value.split('\n')
  };
  capsules.push(capsule);
  localStorage.setItem('capsules', JSON.stringify(capsules));
  renderLibrary();
  showSection('library');
});

// Cancel Edit
document.getElementById('cancel-edit').addEventListener('click', () => {
  showSection('library');
});

// Edit Capsule
window.editCapsule = function(i) {
  const c = capsules[i];
  showSection('author');
  document.getElementById('meta-title').value = c.title;
  document.getElementById('meta-subject').value = c.subject;
  document.getElementById('meta-level').value = c.level;
  document.getElementById('meta-desc').value = c.desc;
  document.getElementById('notes-text').value = c.notes.join('\n');
}
