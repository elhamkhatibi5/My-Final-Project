
import { getCapsulesIndex } from './storage.js';

export function renderLibrary() {
  const container = document.getElementById('librarySection');
  const capsules = getCapsulesIndex();
  
  if (!capsules.length) {
    container.innerHTML = `<div class="text-center mt-5 text-muted">No capsules yet. Click “Author” to create one!</div>`;
    return;
  }

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Your Library</h2>
      <button class="btn btn-success" id="newCapsuleBtn">+ New Capsule</button>
    </div>
    <div class="row g-3">
      ${capsules.map(c => `
        <div class="col-md-4">
          <div class="card text-dark h-100 shadow">
            <div class="card-body">
              <h5>${c.title}</h5>
              <p class="mb-1"><span class="badge bg-info">${c.level}</span> ${c.subject}</p>
              <small class="text-muted">${new Date(c.updatedAt).toLocaleString()}</small>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-sm btn-primary">Learn</button>
              <button class="btn btn-sm btn-warning">Edit</button>
              <button class="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
