import { saveCapsule } from "./storage.js";

export function renderAuthor() {
  const section = document.getElementById("authorSection");
  section.innerHTML = `
    <div class="container">
      <h2 class="mb-3">✏️ Create / Edit Capsule</h2>

      <!-- Meta Info -->
      <div class="card bg-light text-dark mb-3">
        <div class="card-body">
          <div class="row g-2">
            <div class="col-md-4">
              <input id="titleInput" class="form-control" placeholder="Title *" required>
            </div>
            <div class="col-md-4">
              <input id="subjectInput" class="form-control" placeholder="Subject">
            </div>
            <div class="col-md-4">
              <select id="levelInput" class="form-select">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <textarea id="descInput" class="form-control mt-2" rows="2" placeholder="Description..."></textarea>
        </div>
      </div>

      <!-- Notes -->
      <div class="card bg-light text-dark mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>📝 Notes</span>
        </div>
        <div class="card-body">
          <textarea id="notesInput" class="form-control" rows="5" placeholder="Write each note on a new line..."></textarea>
        </div>
      </div>

      <!-- Flashcards -->
      <div class="card bg-light text-dark mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>🎴 Flashcards</span>
          <button id="addFlashcardBtn" class="btn btn-sm btn-success">+ Add Card</button>
        </div>
        <div class="card-body" id="flashcardsContainer"></div>
      </div>

      <!-- Quiz -->
      <div class="card bg-light text-dark mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>❓ Quiz Questions</span>
          <button id="addQuestionBtn" class="btn btn-sm btn-success">+ Add Question</button>
        </div>
        <div class="card-body" id="quizContainer"></div>
      </div>

      <div class="text-end">
        <button class="btn btn-primary px-4" id="saveCapsuleBtn">💾 Save Capsule</button>
      </div>
    </div>
  `;

  // Add new flashcard
  const flashcardsContainer = section.querySelector("#flashcardsContainer");
  section.querySelector("#addFlashcardBtn").addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "row g-2 align-items-center mb-2";
    row.innerHTML = `
      <div class="col-md-5"><input class="form-control front" placeholder="Front"></div>
      <div class="col-md-5"><input class="form-control back" placeholder="Back"></div>
      <div class="col-md-2"><button class="btn btn-danger removeBtn">✕</button></div>
    `;
    row.querySelector(".removeBtn").onclick = () => row.remove();
    flashcardsContainer.appendChild(row);
  });

  // Add new quiz question
  const quizContainer = section.querySelector("#quizContainer");
  section.querySelector("#addQuestionBtn").addEventListener("click", () => {
    const block = document.createElement("div");
    block.className = "border p-2 mb-3";
    block.innerHTML = `
      <input class="form-control mb-2 question" placeholder="Question text">
      ${["A","B","C","D"].map((opt,i)=>`
        <div class="input-group mb-1">
          <span class="input-group-text">${opt}</span>
          <input class="form-control choice" data-index="${i}" placeholder="Option ${opt}">
        </div>`).join("")}
      <div class="mb-2">
        <label>Correct answer:</label>
        <select class="form-select correctIndex">
          <option value="0">A</option>
          <option value="1">B</option>
          <option value="2">C</option>
          <option value="3">D</option>
        </select>
      </div>
      <textarea class="form-control explanation" placeholder="Explanation (optional)" rows="1"></textarea>
      <div class="text-end mt-2">
        <button class="btn btn-sm btn-outline-danger removeQ">🗑️ Remove</button>
      </div>
    `;
    block.querySelector(".removeQ").onclick = () => block.remove();
    quizContainer.appendChild(block);
  });

  // Save button logic
  section.querySelector("#saveCapsuleBtn").addEventListener("click", () => {
    const title = section.querySelector("#titleInput").value.trim();
    if (!title) return alert("⚠️ Title is required!");

    // Collect data
    const capsule = {
      schema: "pocket-classroom/v1",
      id: null,
      meta: {
        title,
        subject: section.querySelector("#subjectInput").value.trim(),
        level: section.querySelector("#levelInput").value,
        description: section.querySelector("#descInput").value.trim(),
      },
      notes: section.querySelector("#notesInput").value
        .split("\n")
        .filter(l => l.trim().length > 0),
      flashcards: Array.from(flashcardsContainer.querySelectorAll(".row")).map(row => ({
        front: row.querySelector(".front").value.trim(),
        back: row.querySelector(".back").value.trim()
      })).filter(f => f.front && f.back),
      quiz: Array.from(quizContainer.children).map(block => ({
        question: block.querySelector(".question").value.trim(),
        choices: Array.from(block.querySelectorAll(".choice")).map(c=>c.value.trim()),
        correctIndex: parseInt(block.querySelector(".correctIndex").value),
        explanation: block.querySelector(".explanation").value.trim()
      })).filter(q => q.question && q.choices.some(c=>c))
    };

    if (!capsule.notes.length && !capsule.flashcards.length && !capsule.quiz.length) {
      alert("⚠️ Please add at least one Notes, Flashcard, or Quiz item.");
      return;
    }

    saveCapsule(capsule);
    alert("✅ Capsule saved successfully!");
  });
}
