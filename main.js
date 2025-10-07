// دسترسی به بخش‌ها
const sections = {
  library: document.getElementById('library-section'),
  author: document.getElementById('author-section'),
  learn: document.getElementById('learn-section')
};

// دسترسی به لینک‌ها
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // حذف کلاس active از همه لینک‌ها
    navLinks.forEach(l => l.classList.remove('active'));
    // اضافه کردن active به لینک کلیک شده
    link.classList.add('active');

    // مخفی کردن همه بخش‌ها
    Object.values(sections).forEach(sec => sec.classList.add('d-none'));

    // نمایش بخش مربوطه
    const sectionKey = link.getAttribute('data-section');
    sections[sectionKey].classList.remove('d-none');
  });
});
