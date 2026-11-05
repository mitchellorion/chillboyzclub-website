const gallery = document.getElementById('gallery');

async function loadGallery() {
  try {
    const response = await fetch('/api/media');
    const data = await response.json();
    const items = data.items || [];

    if (!items.length) {
      gallery.innerHTML = [
        '<div class="item tall"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" alt="" /></div>',
        '<div class="item"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80" alt="" /></div>',
        '<div class="item wide"><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80" alt="" /></div>',
        '<div class="item"><img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80" alt="" /></div>',
        '<div class="item tall"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80" alt="" /></div>',
        '<div class="item"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" alt="" /></div>',
        '<div class="item wide"><img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80" alt="" /></div>',
      ].join('');
      return;
    }

    gallery.innerHTML = items
      .map((item) => {
        const classes = ['item'];
        if (item.type === 'video') classes.push('video');
        if (Math.random() > 0.65) classes.push('wide');
        if (Math.random() > 0.75) classes.push('tall');

        if (item.type === 'video') {
          return `<div class="${classes.join(' ')}"><video controls src="${item.url}"></video></div>`;
        }

        return `<div class="${classes.join(' ')}"><img src="${item.url}" alt="" /></div>`;
      })
      .join('');
  } catch (error) {
    console.error(error);
  }
}

loadGallery();
