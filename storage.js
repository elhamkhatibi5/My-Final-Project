export function getCapsules() { return JSON.parse(localStorage.getItem('pc_capsules_index')||'[]'); }
export function saveCapsuleToStorage(c) {
  let index=getCapsules();
  const existing=index.find(x=>x.id===c.id);
  if(existing) Object.assign(existing,{title:c.title,subject:c.subject,level:c.level,updatedAt:c.updatedAt});
  else index.push({id:c.id,title:c.title,subject:c.subject,level:c.level,updatedAt:c.updatedAt});
  localStorage.setItem('pc_capsules_index',JSON.stringify(index));
  localStorage.setItem(`pc_capsule_${c.id}`,JSON.stringify(c));
}
export function getCapsule(id){return JSON.parse(localStorage.getItem(`pc_capsule_${id}`)||'{}');}
export function deleteCapsule(id){localStorage.removeItem(`pc_capsule_${id}`); localStorage.setItem('pc_capsules_index',JSON.stringify(getCapsules().filter(c=>c.id!==id)));}
export function generateId(){return 'c'+Date.now();}
export function exportCapsule(c){const b=new Blob([JSON.stringify({schema:'pocket-classroom/v1',capsule:c},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=`${c.title.replace(/\s+/g,'_')}.json`; a.click();}
export function importCapsule(file){return new Promise((res,rej)=>{const r=new FileReader(); r.onload=e=>{try{const d=JSON.parse(e.target.result); if(d.schema!=='pocket-classroom/v1') throw 'Invalid schema'; const c=d.capsule; c.id=generateId(); saveCapsuleToStorage(c); res(c);}catch(err){rej(err);}}; r.readAsText(file);});}