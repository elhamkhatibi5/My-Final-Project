import { saveCapsuleToStorage, generateId } from './storage.js';

export function initAuthor(newForm=false){
  const f=document.getElementById('author-form');
  const flashcardsContainer=document.getElementById('flashcards-container');
  const quizContainer=document.getElementById('quiz-container');

  if(newForm){
    f.reset();
    flashcardsContainer.innerHTML='';
    quizContainer.innerHTML='';
  }

  document.getElementById('add-flashcard-btn').onclick=()=>{
    const row=document.createElement('div'); row.className='mb-2';
    row.innerHTML=`<input class="form-control mb-1 flash-front" placeholder="Front"><input class="form-control flash-back" placeholder="Back"><button type="button" class="btn btn-sm btn-danger remove-flashcard mt-1">Remove</button>`;
    flashcardsContainer.appendChild(row);
    row.querySelector('.remove-flashcard').onclick=()=>row.remove();
  };

  document.getElementById('add-quiz-btn').onclick=()=>{
    const qDiv=document.createElement('div'); qDiv.className='mb-2 border p-2 rounded';
    qDiv.innerHTML=`<input class="form-control mb-1 quiz-question" placeholder="Question">
    <div class="mb-1">
      <input class="form-control mb-1 quiz-choice" placeholder="Choice A">
      <input class="form-control mb-1 quiz-choice" placeholder="Choice B">
      <input class="form-control mb-1 quiz-choice" placeholder="Choice C">
      <input class="form-control mb-1 quiz-choice" placeholder="Choice D">
    </div>
    <select class="form-select correct-index mb-1">
      <option value="0">Correct A</option>
      <option value="1">Correct B</option>
      <option value="2">Correct C</option>
      <option value="3">Correct D</option>
    </select>
    <button type="button" class="btn btn-sm btn-danger remove-quiz">Remove</button>`;
    quizContainer.appendChild(qDiv);
    qDiv.querySelector('.remove-quiz').onclick=()=>qDiv.remove();
  };

  f.onsubmit=e=>{
    e.preventDefault();
    const capsule={
      id: generateId(),
      title: document.getElementById('capsule-title').value,
      subject: document.getElementById('capsule-subject').value,
      level: document.getElementById('capsule-level').value,
      description: document.getElementById('capsule-description').value,
      notes: document.getElementById('capsule-notes').value.split('\n').filter(n=>n.trim()),
      flashcards: Array.from(flashcardsContainer.children).map(r=>({front:r.querySelector('.flash-front').value, back:r.querySelector('.flash-back').value})).filter(fc=>fc.front||fc.back),
      quiz: Array.from(quizContainer.children).map(q=>({question:q.querySelector('.quiz-question').value, choices:Array.from(q.querySelectorAll('.quiz-choice')).map(c=>c.value), correctIndex:parseInt(q.querySelector('.correct-index').value)})).filter(q=>q.question),
      updatedAt: new Date().toISOString()
    };
    saveCapsuleToStorage(capsule);
    alert('Capsule saved!');
    f.reset(); flashcardsContainer.innerHTML=''; quizContainer.innerHTML='';
  };
}