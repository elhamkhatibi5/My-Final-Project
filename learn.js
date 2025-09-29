// learn.js - Learn mode
import { loadCapsule } from "./storage.js";
import { escapeHTML } from "./utils.js";

export function renderLearn(app, id) {
  const capsule = loadCapsule(id);
  if (!capsule) { app.innerHTML = `<div class="alert alert-danger">Capsule not found</div>`; return; }

  app.innerHTML = `
    <h3>Learn: ${escapeHTML(capsule.meta.title)}</h3>
    <ul class="nav nav-pills mb-3">
      <li class="nav-item"><a class="nav-link active" data-bs-toggle="pill" data-bs-target="#notesTab">Notes</a></li>
      <li class="nav-item"><a class="nav-link" data-bs-toggle="pill" data-bs-target="#flashTab">Flashcards</a></li>
      <li class="nav-item"><a class="nav-link" data-bs-toggle="pill" data-bs-target="#quizTab">Quiz</a></li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane fade show active" id="notesTab"></div>
      <div class="tab-pane fade" id="flashTab"></div>
      <div class="tab-pane fade" id="quizTab"></div>
    </div>
  `;

  // Notes
  const notesDiv = app.querySelector("#notesTab");
  notesDiv.innerHTML = "<ul class='list-group mb-3'>" + capsule.notes.map(n=>`<li class='list-group-item'>${escapeHTML(n)}</li>`).join("") + "</ul>";

  // Flashcards
  let fIndex = 0;
  const flashDiv = app.querySelector("#flashTab");
  function renderFlash() {
    if (capsule.flashcards.length===0) { flashDiv.innerHTML="<div class='alert alert-info'>No flashcards</div>"; return; }
    const fc = capsule.flashcards[fIndex];
    flashDiv.innerHTML = `
      <div class="flashcard mb-3" id="flash">
        <div class="flashcard-inner">
          <div class="flashcard-front">${escapeHTML(fc.front)}</div>
          <div class="flashcard-back">${escapeHTML(fc.back)}</div>
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-secondary" id="prevBtn">Prev</button>
        <button class="btn btn-sm btn-secondary" id="nextBtn">Next</button>
      </div>
    `;
    const card = flashDiv.querySelector("#flash");
    card.onclick = ()=> card.classList.toggle("flip");
    flashDiv.querySelector("#prevBtn").onclick = ()=>{fIndex=(fIndex-1+capsule.flashcards.length)%capsule.flashcards.length; renderFlash();};
    flashDiv.querySelector("#nextBtn").onclick = ()=>{fIndex=(fIndex+1)%capsule.flashcards.length; renderFlash();};
  }
  renderFlash();

  // Quiz
  const quizDiv = app.querySelector("#quizTab");
  if (capsule.quiz.length===0) {
    quizDiv.innerHTML="<div class='alert alert-info'>No quiz</div>";
  } else {
    let qIndex=0, score=0;
    function renderQ() {
      const q = capsule.quiz[qIndex];
      quizDiv.innerHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <h5>${escapeHTML(q.q)}</h5>
            ${q.choices.map((c,i)=>`<button class="btn btn-outline-primary d-block w-100 my-1" data-i="${i}">${escapeHTML(c)}</button>`).join("")}
          </div>
        </div>
        <div>Question ${qIndex+1} of ${capsule.quiz.length}</div>
      `;
      quizDiv.querySelectorAll("button").forEach(btn=>{
        btn.onclick=()=>{
          if(parseInt(btn.dataset.i)===q.answer) {score++;btn.classList.add("btn-success");}
          else btn.classList.add("btn-danger");
          setTimeout(()=>{
            qIndex++;
            if(qIndex<cap

---

### 📄 js/main.js
(قبلاً برات فرستادم، بذار همینجا دوباره بذارم برای کامل بودن 👇)
```javascript
// main.js -
