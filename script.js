(() => {
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const reelElements = [...document.querySelectorAll('.reel .symbol')];
  const spinButton = document.getElementById('spinButton');
  const winner = document.getElementById('winner');
  const symbolClasses = ['roof-symbol', 'star-symbol', 'hammer-symbol', 'jackpot-symbol'];
  let isSpinning = false;

  function setSymbol(element, symbolClass) {
    element.className = `symbol ${symbolClass} spinning`;
    element.innerHTML = symbolClass === 'jackpot-symbol' ? '<i></i><b>J</b>' : '';
  }

  function spin() {
    if (isSpinning) return;
    isSpinning = true;
    winner.classList.add('hidden');
    spinButton.disabled = true;

    reelElements.forEach((reel, reelIndex) => {
      let tick = 0;
      const interval = window.setInterval(() => {
        setSymbol(reel, symbolClasses[tick % symbolClasses.length]);
        tick += 1;
      }, 58 + reelIndex * 7);

      window.setTimeout(() => {
        window.clearInterval(interval);
        setSymbol(reel, 'jackpot-symbol');
        reel.classList.remove('spinning');
        if (reelIndex === reelElements.length - 1) {
          winner.classList.remove('hidden');
          spinButton.disabled = false;
          isSpinning = false;
        }
      }, 1350 + reelIndex * 460);
    });
  }

  spinButton.addEventListener('click', spin);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setTimeout(spin, 650);
  }

  const photos = Array.isArray(window.JACKPOT_GALLERY) ? window.JACKPOT_GALLERY : [];
  const track = document.getElementById('galleryTrack');
  const empty = document.getElementById('galleryEmpty');
  const prev = document.getElementById('galleryPrev');
  const next = document.getElementById('galleryNext');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let activeImage = 0;

  function showLightbox(index) {
    if (!photos.length) return;
    activeImage = (index + photos.length) % photos.length;
    lightboxImage.src = photos[activeImage].src;
    lightboxImage.alt = photos[activeImage].alt;
    lightboxCaption.textContent = photos[activeImage].alt;
  }

  if (photos.length) {
    empty.hidden = true;
    photos.forEach((photo, index) => {
      const button = document.createElement('button');
      button.className = 'gallery-card';
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge: ${photo.alt}`);
      button.innerHTML = `<img src="${photo.src}" alt="${photo.alt}" loading="lazy"><span aria-hidden="true">↗</span>`;
      button.addEventListener('click', () => {
        showLightbox(index);
        lightbox.showModal();
      });
      track.appendChild(button);
    });
  } else {
    track.hidden = true;
    prev.hidden = true;
    next.hidden = true;
  }

  const scrollGallery = (direction) => track.scrollBy({ left: direction * Math.min(window.innerWidth * .72, 558), behavior: 'smooth' });
  prev.addEventListener('click', () => scrollGallery(-1));
  next.addEventListener('click', () => scrollGallery(1));
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
  document.getElementById('lightboxPrev').addEventListener('click', () => showLightbox(activeImage - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => showLightbox(activeImage + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') showLightbox(activeImage - 1);
    if (event.key === 'ArrowRight') showLightbox(activeImage + 1);
  });
})();
