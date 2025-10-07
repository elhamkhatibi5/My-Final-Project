
export function getCapsulesIndex() {
  return JSON.parse(localStorage.getItem('pc_capsules_index') || '[]');
}

export function saveCapsule(capsule) {
  const index = getCapsulesIndex();
  const existing = index.find(c => c.id === capsule.id);
  capsule.updatedAt = new Date().toISOString();

  if (!capsule.id) capsule.id = 'capsule_' + Date.now();
  if (!existing) index.push({ id: capsule.id, title: capsule.meta.title, subject: capsule.meta.subject, level: capsule.meta.level, updatedAt: capsule.updatedAt });

  localStorage.setItem('pc_capsules_index', JSON.stringify(index));
  localStorage.setItem(`pc_capsule_${capsule.id}`, JSON.stringify(capsule));
}
