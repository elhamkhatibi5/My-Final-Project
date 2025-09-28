import {storage} from './storage.js';
import {renderLibrary} from './library.js';
const $ = s => document.querySelector(s);

let activeId = null;
let fcIndex = 0;
let fcFlipped = false;
let knownSet = new Set();

export function bindLearn(){
  // selectors
  window.addEventListener('learnCapsule', (e)=> {
    openLearn(e.detail.id);
  });

  // fill selector
  refreshSelector();
  $('#capsuleSelector').addEventListener('change', (e)=> openLearn(e.target.value));

  // tabs
  document.getElementById('learnTabs').addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    document.querySelectorAll('#learnTabs .nav-link').forEach(n=>n.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.learn-panel').forEach(p=>p.classList.add('d-none'));
    if (tab==='notes') document.getElementById('notesPanel').classList.remove('d-none');
    if (tab==='flashcards') document.getElementById('flashcardsPanel').classList.remove('d-none');
    if (tab==='quiz') document.getElementById('quizPanel').classList.remove('d-none');
  });

  // notes search
  $('#notesSearch').addEventListener('input', (e)=> renderNotes(e.target.value));

  // export
  $('#exportBtn').addEventListener('click', ()=>{
    if (!activeId) return alert('Select a capsule');
    const j = storage.exportCapsule(activeId);
    const blob = new Blob([JSON.stringify(j,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download = storage.get(activeId).title + '.json'; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  // flashcard controls
  $('#prevCard').addEventListener('click', ()=> {
    if (!activeId) return;
    fcIndex = Math.max(0, fcIndex-1); fcFlipped=false; renderFlashcard();
  });
  $('#nextCard').addEventListener('click', ()=> {
    if (!activeId) return;
    const capsule = storage.get(activeId);
    fcIndex = Math.min((capsule.flashcards||[]).length-1, fcIndex+1); fcFlipped=false; renderFlashcard();
  });
  $('#flipCard').addEventListener('click', ()=> { fcFlipped = !fcFlipped; renderFlashcard(); });
  $('#markKnown').addEventListener('click', ()=> { markKnown(true); });
  $('#markUnknown').addEventListener('click', ()=> { markKnown(false); });

  // keyboard shortcut: space flips
  document.addEventListener('keydown', (e)=> {
    if (e.code === 'Space' && document.querySelector('#flashcardsPanel').offsetParent !== null){
      e.preventDefault();
      fcFlipped = !fcFlipped; renderFlashcard();
    }
  });
}

function refreshSelector(){
  const sel = $('#capsuleSelector'); sel.innerHTML = '';
  const idx = storage.list();
  idx.forEach(i=> {
    const o = document.createElement('option'); o.value = i.id; o.textContent = i.title; sel.appendChild(o);
  });
  if (idx.length) { sel.value = idx[0].id; openLearn(idx[0].id); }
}

function openLearn(id){
  activeId = id;
  if (!id) return;
  const cap = storage.get(id);
  if (!cap) return alert('Capsule not found');
  $('#learnTitle').textContent = cap.title;
  renderNotes();
  // flashcards
  fcIndex = 0; fcFlipped = false;
  const prog = storage.getProgress(id) || {};
  knownSet = new Set(prog.knownFlashcards||[]);
  renderFlashcard();
  // quiz
  renderQuiz();
  // ensure view
  document.getElementById('libraryView').classList.add('d-none');
  document.getElementById('learnView').classList.remove('d-none');
}

function renderNotes(filter=''){
  const el = $('#notesRender'); el.innerHTML='';
  const cap = storage.get(activeId);
  if (!cap) return;
  const notes = (cap.notes||[]).filter(n=> n.toLowerCase().includes((filter||'').toLowerCase()));
  if (!notes.length) el.innerHTML = '<div class="text-muted">No notes</div>';
  notes.forEach(n=>{
    const item = document.createElement('div'); item.className='list-group-item'; item.textContent = n;
    el.appendChild(item);
  });
}

function renderFlashcard(){
  const box = document.getElementById('flashcardBox'); box.innerHTML='';
  const cap = storage.get(activeId);
  if (!cap) return;
  const cards = cap.flashcards||[];
  if (!cards.length){ box.innerHTML = '<div class="text-muted">No flashcards</div>'; document.getElementById('fcCounters').textContent=''; return; }
  const c = cards[fcIndex];
  const wrapper = document.createElement('div'); wrapper.className='inner'+(fcFlipped? ' flipped':'');
  wrapper.style.position='relative';
  // front
  const front = document.createElement('div'); front.className='side front'; front.textContent = c.front;
  const back = document.createElement('div'); back.className='side back'; back.textContent = c.back;
  wrapper.appendChild(front); wrapper.appendChild(back);
  box.appendChild(wrapper);
  document.getElementById('fcCounters').textContent = \`\${fcIndex+1}/\${cards.length} • Known: \${knownSet.has(fcIndex)?'Yes':'No'}\`;
}

function markKnown(yes){
  if (!activeId) return;
  if (yes) knownSet.add(fcIndex); else knownSet.delete(fcIndex);
  storage.saveProgress(activeId, { bestScore: storage.getProgress(activeId).bestScore || 0, knownFlashcards: Array.from(knownSet) });
  renderFlashcard();
}

function renderQuiz(){
  const area = $('#quizArea'); area.innerHTML='';
  const cap = storage.get(activeId);
  if (!cap) return;
  const qs = cap.quiz||[];
  if (!qs.length){ area.innerHTML='<div class="text-muted">No quiz questions</div>'; return; }

  let index = 0;
  let correct = 0;
  function showQuestion(){
    const q = qs[index];
    area.innerHTML = '';
    const qdiv = document.createElement('div');
    qdiv.innerHTML = \`<h5>Q\${index+1}. \${escapeHtml(q.q)}</h5>\`;
    q.choices.forEach((ch,i)=>{
      const btn = document.createElement('button'); btn.className='btn btn-outline-light d-block w-100 text-start mb-2';
      btn.textContent = ch || ('Choice '+(i+1));
      btn.addEventListener('click', ()=>{
        const correctIndex = Number(q.correct||0);
        if (i===correctIndex){ correct++; btn.classList.remove('btn-outline-light'); btn.classList.add('btn-success'); } else { btn.classList.remove('btn-outline-light'); btn.classList.add('btn-danger'); }
        setTimeout(()=>{
          index++;
          if (index<qs.length) showQuestion(); else finish();
        }, 700);
      });
      qdiv.appendChild(btn);
    });
    area.appendChild(qdiv);
  }
  function finish(){
    const pct = Math.round((correct/qs.length)*100);
    const prev = storage.getProgress(activeId).bestScore || 0;
    if (pct > prev) storage.saveProgress(activeId, { bestScore: pct, knownFlashcards: Array.from(knownSet) });
    $('#quizResult').style.display='block';
    $('#quizResult').innerHTML = \`<div class="alert alert-info">Score: \${pct}% (best: \${Math.max(prev,pct)}%)</div>\`;
  }
  showQuestion();
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
