// Storage helpers
export const storage = {
  idxKey: 'pc_capsules_index',
  capsuleKey(id){ return `pc_capsule_${id}` },
  progressKey(id){ return `pc_progress_${id}` },

  _loadIndex(){
    try { return JSON.parse(localStorage.getItem(this.idxKey) || '[]') } catch(e){ return []; }
  },
  _saveIndex(idx){ localStorage.setItem(this.idxKey, JSON.stringify(idx)); },

  list(){
    return this._loadIndex();
  },

  saveCapsule(obj){
    if (!obj.id) obj.id = 'c_'+Date.now().toString(36);
    obj.updatedAt = new Date().toISOString();
    // write
    localStorage.setItem(this.capsuleKey(obj.id), JSON.stringify(obj));
    // update index
    const idx = this._loadIndex().filter(i=>i.id!==obj.id);
    idx.unshift({id:obj.id, title:obj.title||'Untitled', subject:obj.subject||'', level:obj.level||'Beginner', updatedAt:obj.updatedAt});
    this._saveIndex(idx);
    return obj.id;
  },

  get(id){
    try { return JSON.parse(localStorage.getItem(this.capsuleKey(id))); } catch(e){ return null; }
  },

  remove(id){
    localStorage.removeItem(this.capsuleKey(id));
    const idx = this._loadIndex().filter(i=>i.id!==id);
    this._saveIndex(idx);
    localStorage.removeItem(this.progressKey(id));
  },

  saveProgress(id, progress){
    localStorage.setItem(this.progressKey(id), JSON.stringify(progress));
  },

  getProgress(id){
    try { return JSON.parse(localStorage.getItem(this.progressKey(id)) || '{}'); } catch(e){ return {}; }
  },

  exportCapsule(id){
    const c = this.get(id);
    if (!c) throw new Error('Not found');
    const out = { schema: 'pocket-classroom/v1', capsule: c };
    return out;
  },

  async importJSON(j){
    if (!j.schema || j.schema !== 'pocket-classroom/v1') {
      throw new Error('Invalid schema. Expect pocket-classroom/v1');
    }
    const c = j.capsule;
    if (!c || !c.title) throw new Error('Missing capsule title');
    // assign new id
    delete c.id;
    const newId = this.saveCapsule(c);
    return newId;
  }
};
