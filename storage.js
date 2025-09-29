// storage.js - LocalStorage helpers
export function loadIndex() {
  return JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
}
export function saveIndex(index) {
  localStorage.setItem("pc_capsules_index", JSON.stringify(index));
}
export function loadCapsule(id) {
  return JSON.parse(localStorage.getItem("pc_capsule_" + id) || "null");
}
export function saveCapsule(capsule) {
  localStorage.setItem("pc_capsule_" + capsule.id, JSON.stringify(capsule));
}
export function deleteCapsule(id) {
  localStorage.removeItem("pc_capsule_" + id);
  const index = loadIndex().filter(c => c.id !== id);
  saveIndex(index);
}
