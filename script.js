const filterButtons = document.querySelectorAll('.filter');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    galleryItems.forEach((item) => {
      const category = item.dataset.category;
      const shouldShow = selectedFilter === 'all' || category === selectedFilter;
      item.classList.toggle('hidden', !shouldShow);
    });
  });
});
