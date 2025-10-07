import { getCapsules, deleteCapsule, exportCapsule } from './storage.js';

export function renderLibrary(){
  const grid=document.getElementById('library-grid');
  grid.innerHTML='';
  const capsules=getCapsules();
  if(capsules.length===0){grid.innerHTML='<p>No capsules yet.</p>'; return;}
  capsules.forEach(c=>{
    const col=document.createElement('div'); col.className='col-md-4';
    const card=document.createElement('div'); card.className='card p-3';
    card.innerHTML=`<h5>${c.title}</h5><p>${c.subject} | ${c.level}</p>
    <small>Updated: ${new Date(c.updatedAt).toLocaleString()}</small>
    <div class="mt-2">
      <button class="btn btn-sm btn-primary learn-btn">Learn</button>
      <button class="btn btn-sm btn-secondary edit-btn">Edit</button>
      <button class="btn btn-sm btn-success export-btn">Export</button>
      <button class="btn btn-sm btn-danger delete-btn">Delete</button>
    </div>`;
    col.appendChild(card);
    grid.appendChild(col);

    card.querySelector('.delete-btn').onclick=()=>{if(confirm('Delete?')){deleteCapsule(c.id); renderLibrary();}};
    card.querySelector('.export-btn').onclick=()=>exportCapsule(c);
    card.querySelector('.learn-btn').onclick=()=>document.querySelector('[data-tab=learn]').click();
    card.querySelector('.edit-btn').onclick=()=>document.querySelector('[data-tab=author]').click();
  });
}