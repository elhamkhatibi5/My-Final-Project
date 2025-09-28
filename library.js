import {storage} from './storage.js';
const $ = s => document.querySelector(s);

export function renderLibrary(){
  const grid = document.getElementById('capsuleGrid');
  grid.innerHTML = '';
  const idx = storage.list();
  document.getElementById('capsulesCount').textContent = idx.length ? `${idx.length} capsules` : '';
  if (!idx.length){
    document.getElementById('emptyLibrary').classList.remove('d-none');
    return;
  } else document.getElementById('emptyLibrary').classList.add('d-none');

  idx.forEach(item=>{
    const col = document.createElement('div'); col.className='col-12 col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card p-3 h-100">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5>${escapeHtml(item.title)}</h5>
            <div><span class="badge bg-info badge-level">${escapeHtml(item.level)}</span> <small class="text-muted">${escapeHtml(item.subject)}</small></div>
          </div>
          <div class="text-end">
            <small class="text-muted">${timeAgo(item.updatedAt)}</small>
          </div>
        </div>
        <div class="mt-3 d-flex justify-content-between">
          <div>
            <button class="btn btn-sm btn-light btn-learn" data-id="${item.id}">Learn</button>
            <button class="btn btn-sm btn-outline-light btn-edit" data-id="${item.id}">Edit</button>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-light btn-export" data-id="${item.id}">Export</button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

export function bindLibraryActions(){
  document.getElementById('capsuleGrid').addEventListener('click', async (e)=>{
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains('btn-delete')){
      if (!confirm('Delete capsule?')) return;
      storage.remove(id);
      renderLibrary();
      return;
    }
    if (btn.classList.contains('btn-export')){
      const j = storage.exportCapsule(id);
      const blob = new Blob([JSON.stringify(j,null,2)],{type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href=url; a.download = (storage.get(id).title||'capsule') + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      return;
    }
    if (btn.classList.contains('btn-edit')){
      const ev = new CustomEvent('editCapsule',{detail:{id}});
      window.dispatchEvent(ev);
      return;
    }
    if (btn.classList.contains('btn-learn')){
      const ev = new CustomEvent('learnCapsule',{detail:{id}});
      window.dispatchEvent(ev);
      return;
    }
  });
}

// utilities
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function timeAgo(iso){
  if(!iso) return '';
  const d = new Date(iso); const diff = (Date.now()-d.getTime())/1000;
  if (diff < 60) return Math.floor(diff) + 's';
  if (diff < 3600) return Math.floor(diff/60)+'m';
  if (diff < 86400) return Math.floor(diff/3600)+'h';
  return Math.floor(diff/86400)+'d';
}
