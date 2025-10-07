import { renderLibrary } from './library.js';
import { initAuthor } from './author.js';
import { initLearn } from './learn.js';
import { importCapsule } from './storage.js';

const tabs = document.querySelectorAll('.navbar .nav-link');
const sections = document.querySelectorAll('.tab-section');

tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    sections.forEach(s => s.classList.add('d-none'));
    document.getElementById(`${target}-section`).classList.remove('d-none');
    if (target === 'library') renderLibrary();
    else if (target === 'author') initAuthor();
    else if (target === 'learn') initLearn();
  });
});

document.getElementById('new-capsule-btn').addEventListener('click', () => {
  document.querySelector('[data-tab="author"]').click();
  initAuthor(true);
});

document.getElementById('import-json').addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    importCapsule(file).then(c => { alert('Imported: '+c.title); renderLibrary(); })
    .catch(err=>alert('Error: '+err));
  }
});

document.addEventListener('DOMContentLoaded', () => renderLibrary());