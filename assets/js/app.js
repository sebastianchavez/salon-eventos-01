document.addEventListener('DOMContentLoaded', () => {
  if (typeof seedData === 'function') seedData();
});

window.addEventListener('load', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});