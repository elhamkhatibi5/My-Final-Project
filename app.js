import {storage} from './storage.js';
import {renderLibrary, bindLibraryActions} from './library.js';
import {bindAuthor, loadCapsuleToAuthor} from './author.js';
import {bindLearn} from './learn.js';

const $ = s => document.querySelector(s);
const views = {library:$('#libraryView'), author:$('#authorView'), learn:$('#learnView')};

function showView(name){
  Object.values(views).forEach(v=>v.classList.add('d-none'));
  views[name].classList.remove('d-none');
  localStorage.setItem('pc_last_view', name);
}

document.addEventListener('DOMContentLoaded', async ()=> {
  // initial bind
  document.getElementById('newCapsuleBtn').addEventListener('click', ()=> {
    loadCapsuleToAuthor(null);
    showView('author');
  });
  document.getElementById('importBtn').addEventListener('click', ()=> $('#importInput').click());
  $('#importInput').addEventListener('change', async (e)=> {
    const f = e.target.files[0];
    if (!f) return;
    const text = await f.text();
    try {
      const j = JSON.parse(text);
      await storage.importJSON(j);
      renderLibrary();
      alert('Imported capsule.');
    } catch(err){ alert('Import failed: '+err.message) }
    e.target.value='';
  });

  // navbar shortcuts
  document.addEventListener('keydown', (e)=>{
    if (e.key === '[') { document.querySelector('[data-tab="notes"]').click(); }
    if (e.key === ']') { document.querySelector('[data-tab="flashcards"]').click(); }
  });

  // theme toggle
  $('#themeToggle').addEventListener('click', ()=> {
    document.body.classList.toggle('text-dark');
    document.body.classList.toggle('text-light');
    alert('Theme toggled (quick).');
  });

  // load libs
  await renderLibrary();
  bindLibraryActions();
  bindAuthor();
  bindLearn();

  // restore last view
  const last = localStorage.getItem('pc_last_view') || 'library';
  showView(last);
});
