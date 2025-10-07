import { renderLibrary } from './js/library.js';
import { renderAuthor } from './js/author.js';
import { renderLearn } from './js/learn.js';

// Routing between views
const sections = {
  library: document.getElementById('librarySection'),
  author: document.getElementById('authorSection'),
  learn: document.getElementById('learnSection')
};

function showSection(name) {
  Object.values(sections).forEach(sec => sec.classList.add('d-none'));
  sections[name].classList.remove('d-none');
  if (name === 'library') renderLibrary();
  if (name === 'author') renderAuthor();
  if (name === 'learn') renderLearn();
}

document.getElementById('navLibrary').addEventListener('click', () => showSection('library'));
document.getElementById('navAuthor').addEventListener('click', () => showSection('author'));
document.getElementById('navLearn').addEventListener('click', () => showSection('learn'));

// Default
showSection('library');
