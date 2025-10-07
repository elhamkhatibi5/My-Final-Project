import { getCapsules, getCapsule } from './storage.js';

export function initLearn(){
  const select=document.getElementById('learn-capsule-select');
  select.innerHTML='';
  const capsules=getCapsules();
  capsules.forEach(c=>{const opt=document.createElement('option'); opt.value=c.id; opt.text=c.title; select.appendChild(opt);});

  const notesTab=document.getElementById('notes-tab');
  const flashTab=document.getElementById('flashcards-tab');
  const quizTab=document.getElementById('quiz-tab');

  function renderNotes(capsule){
    notesTab.innerHTML='<ol>'+capsule.notes.map(n=>'<'+'li>'+n+'</li>').join('')+'</ol>';
  }

  function renderFlashcards(capsule){
    if(capsule.flashcards.length===0){flashTab.innerHTML='<p>No flashcards.</p>'; return;}
    let idx=0;
    const fcDiv=document.createElement('div');
    const front=document.createElement('div'); front.className='flashcard flashcard-front'; front.textContent=capsule.flashcards[idx].front;
    const back=document.createElement('div'); back.className='flashcard flashcard-back'; back.textContent=capsule.flashcards[idx].back;
    fcDiv.appendChild(front); fcDiv.appendChild(back);
    flashTab.innerHTML=''; flashTab.appendChild(fcDiv);
  }

  function renderQuiz(capsule){quizTab.innerHTML='<p>Quiz ready.</p>';}

  function render(capsule){renderNotes(capsule); renderFlashcards(capsule); renderQuiz(capsule);}

  select.onchange=()=>{const c=getCapsule(select.value); render(c);};
  if(capsules.length>0){select.value=capsules[0].id; render(getCapsule(capsules[0].id));}
}