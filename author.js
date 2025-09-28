import {storage} from './storage.js';
import {renderLibrary} from './library.js';
const $ = s => document.querySelector(s);

let current = null; // capsule object while editing
let autosaveTimer = null;

export function bindAuthor(){
  // DOM
  $('#authorCancelBtn').addEventListener('click', ()=> {
    renderLibrary();
    document.getElementById('authorView').classList.add('d-none');
    document.getElementById('libraryView').classList.remove('d-none');
  });

  $('#addFlashcardBtn').addEventListener('click', addFlashcardRow);
  $('#addQuestionBtn').addEventListener('click', addQuestionBlock);

  $('#authorSaveBtn').addEventListener('click', saveCapsule);

  // listen to edit events
  window.addEventListener('editCapsule', (e)=>{
    loadCapsuleToAuthor(e.detail.id);
  });
}

export function loadCapsuleToAuthor(id){
  if (!id){
    current = {title:'', subject:'', level:'Beginner', description:'', notes:[], flashcards:[], quiz:[]};
  } else {
    current = storage.get(id);
    if (!current) { alert('Not found'); return; }
  }
  // populate
  $('#metaTitle').value = current.title||'';
  $('#metaSubject').value = current.subject||'';
  $('#metaLevel').value = current.level||'Beginner';
  $('#metaDesc').value = current.description||'';
  $('#notesArea').value = (current.notes||[]).join('\n');
  renderFlashcards();
  renderQuiz();
  // show view
  document.getElementById('libraryView').classList.add('d-none');
  document.getElementById('authorView').classList.remove('d-none');

  // autosave on change
  ['metaTitle','metaSubject','metaLevel','metaDesc','notesArea'].forEach(id=>{
    document.getElementById(id).addEventListener('input', ()=> scheduleAutosave());
  });
}

function scheduleAutosave(){
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(()=> {
    try { quickSave(); } catch(e){ console.error(e) }
  }, 800);
}

function quickSave(){
  // gather minimal fields and save to localStorage temporarily (not full save)
  current.title = $('#metaTitle').value;
  current.subject = $('#metaSubject').value;
  current.level = $('#metaLevel').value;
  current.description = $('#metaDesc').value;
  current.notes = $('#notesArea').value.split('\n').map(s=>s.trim()).filter(Boolean);
  // store under a temp key
  localStorage.setItem('pc_autosave_temp', JSON.stringify(current));
}

function addFlashcardRow(){
  current.flashcards = current.flashcards || [];
  current.flashcards.push({front:'', back:''});
  renderFlashcards();
}

function renderFlashcards(){
  const el = $('#flashcardsList'); el.innerHTML='';
  (current.flashcards||[]).forEach((f,i)=>{
    const row = document.createElement('div'); row.className='input-group mb-2';
    row.innerHTML = `
      <input class="form-control fc-front" data-i="${i}" placeholder="Front" value="${escapeHtml(f.front)}">
      <input class="form-control fc-back" data-i="${i}" placeholder="Back" value="${escapeHtml(f.back)}">
      <button class="btn btn-danger btn-sm btn-remove-fc" data-i="${i}">&times;</button>
    `;
    el.appendChild(row);
  });
  // bind remove and change
  el.querySelectorAll('.btn-remove-fc').forEach(b=> b.addEventListener('click', (e)=>{
    const i = Number(e.target.dataset.i); current.flashcards.splice(i,1); renderFlashcards();
  }));
  el.querySelectorAll('.fc-front').forEach(inp=> inp.addEventListener('input', (e)=> {
    const i=Number(e.target.dataset.i); current.flashcards[i].front = e.target.value;
  }));
  el.querySelectorAll('.fc-back').forEach(inp=> inp.addEventListener('input', (e)=> {
    const i=Number(e.target.dataset.i); current.flashcards[i].back = e.target.value;
  }));
}

function addQuestionBlock(){
  current.quiz = current.quiz || [];
  current.quiz.push({q:'', choices:['','','',''], correct:0, explanation:''});
  renderQuiz();
}

function renderQuiz(){
  const el = $('#quizList'); el.innerHTML='';
  (current.quiz||[]).forEach((q,i)=>{
    const div = document.createElement('div'); div.className='mb-3 p-2 border rounded';
    div.innerHTML = `
      <div class="mb-1"><input class="form-control q-text" data-i="${i}" placeholder="Question" value="${escapeHtml(q.q)}"></div>
      <div class="d-flex gap-1 mb-1">
        <input class="form-control q-choice" data-i="${i}" data-c="0" placeholder="A" value="${escapeHtml(q.choices[0])}">
        <input class="form-control q-choice" data-i="${i}" data-c="1" placeholder="B" value="${escapeHtml(q.choices[1])}">
        <input class="form-control q-choice" data-i="${i}" data-c="2" placeholder="C" value="${escapeHtml(q.choices[2])}">
        <input class="form-control q-choice" data-i="${i}" data-c="3" placeholder="D" value="${escapeHtml(q.choices[3])}">
      </div>
      <div class="d-flex justify-content-between">
        <select class="form-select form-select-sm q-correct" data-i="${i}">
          <option value="0" ${q.correct===0? 'selected':''}>A</option>
          <option value="1" ${q.correct===1? 'selected':''}>B</option>
          <option value="2" ${q.correct===2? 'selected':''}>C</option>
          <option value="3" ${q.correct===3? 'selected':''}>D</option>
        </select>
        <button class="btn btn-danger btn-sm btn-remove-q" data-i="${i}">Remove</button>
      </div>
      <div class="mt-2"><input class="form-control q-ex" data-i="${i}" placeholder="Explanation (optional)" value="${escapeHtml(q.explanation)}"></div>
    `;
    el.appendChild(div);
  });

  // bind
  el.querySelectorAll('.btn-remove-q').forEach(b=> b.addEventListener('click', (e)=>{
    const i=Number(e.target.dataset.i); current.quiz.splice(i,1); renderQuiz();
  }));
  el.querySelectorAll('.q-text').forEach(inp=> inp.addEventListener('input', (e)=> {
    const i=Number(e.target.dataset.i); current.quiz[i].q = e.target.value;
  }));
  el.querySelectorAll('.q-choice').forEach(inp=> inp.addEventListener('input', (e)=> {
    const i=Number(e.target.dataset.i), c=Number(e.target.dataset.c); current.quiz[i].choices[c]=e.target.value;
  }));
  el.querySelectorAll('.q-correct').forEach(sel=> sel.addEventListener('change',(e)=>{
    const i=Number(e.target.dataset.i); current.quiz[i].correct = Number(e.target.value);
  }));
  el.querySelectorAll('.q-ex').forEach(inp=> inp.addEventListener('input',(e)=>{
    const i=Number(e.target.dataset.i); current.quiz[i].explanation = e.target.value;
  }));
}

function saveCapsule(){
  // validate
  const title = $('#metaTitle').value.trim();
  if (!title){ alert('Title required'); return; }
  // gather
  current.title = title;
  current.subject = $('#metaSubject').value.trim();
  current.level = $('#metaLevel').value;
  current.description = $('#metaDesc').value;
  current.notes = $('#notesArea').value.split('\n').map(s=>s.trim()).filter(Boolean);
  // clean flashcards and quiz
  current.flashcards = (current.flashcards||[]).map(f=>({front:(f.front||'').trim(), back:(f.back||'').trim()})).filter(f=>f.front||f.back);
  current.quiz = (current.quiz||[]).map(q=>({
    q:(q.q||'').trim(),
    choices:(q.choices||[]).map(c=>c.trim()),
    correct: Number(q.correct||0),
    explanation:(q.explanation||'').trim()
  })).filter(q=>q.q && q.choices.some(Boolean));
  if (!current.notes.length && !current.flashcards.length && !current.quiz.length){
    if (!confirm('You are saving an empty capsule. Continue?')) return;
  }
  const id = storage.saveCapsule(current);
  alert('Saved.');
  renderLibrary();
  // go to library
  document.getElementById('authorView').classList.add('d-none');
  document.getElementById('libraryView').classList.remove('d-none');
}
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
