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

  let photos = Array.isArray(window.JACKPOT_GALLERY) ? window.JACKPOT_GALLERY : [];
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

  function renderGallery() {
    track.innerHTML = '';
    if (!photos.length) {
      track.hidden = true;
      empty.hidden = false;
      prev.hidden = true;
      next.hidden = true;
      return;
    }

    empty.hidden = true;
    track.hidden = false;
    prev.hidden = false;
    next.hidden = false;
    photos.forEach((photo, index) => {
      const button = document.createElement('button');
      const image = document.createElement('img');
      const enlarge = document.createElement('span');
      button.className = 'gallery-card';
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge: ${photo.alt}`);
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = 'lazy';
      enlarge.textContent = '↗';
      enlarge.setAttribute('aria-hidden', 'true');
      button.append(image, enlarge);
      button.addEventListener('click', () => {
        showLightbox(index);
        lightbox.showModal();
      });
      track.appendChild(button);
    });
  }

  async function discoverGithubPhotos() {
    if (photos.length || !location.hostname.endsWith('.github.io')) return;
    const owner = location.hostname.split('.')[0];
    const firstPathPart = location.pathname.split('/').filter(Boolean)[0];
    const repository = firstPathPart || `${owner}.github.io`;
    const cacheKey = `jackpot-gallery-${owner}-${repository}`;

    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (cached && Date.now() - cached.savedAt < 15 * 60 * 1000) {
        photos = cached.photos;
        renderGallery();
        return;
      }

      const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/contents/img`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error('Gallery could not be loaded');
      const files = await response.json();
      const supported = /\.(jpe?g|png|webp|gif|avif)$/i;
      photos = files
        .filter((file) => file.type === 'file' && supported.test(file.name))
        .filter((file) => file.name.toLowerCase() !== 'jackpot-roofing-logo.jpg')
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
        .map((file, index) => ({
          src: file.download_url,
          alt: `Completed roofing project ${index + 1} by Jackpot Roofing & Gutters`
        }));
      localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), photos }));
      renderGallery();
    } catch (error) {
      renderGallery();
    }
  }

  renderGallery();
  discoverGithubPhotos();

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
