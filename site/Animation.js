(() => {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupParallax() {
    const items = document.querySelectorAll('[data-parallax]');
    if (!items.length || REDUCED) return;

    items.forEach(el => {
      el.style.willChange = 'transform';
      const s = parseFloat(el.dataset.parallaxScale || '1');
      if (!Number.isNaN(s) && s !== 1) el.dataset._scale = String(s);
    });

    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;

      items.forEach(el => {
        const speed = Number(el.dataset.parallax || 0.2) || 0;
        const axis = (el.dataset.parallaxAxis || 'y').toLowerCase();
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - vh / 2;
        const offset = Math.round(center * speed);
        const dx = axis === 'x' ? offset : 0;
        const dy = axis === 'y' ? offset : 0;
        const scale = parseFloat(el.dataset._scale || '1');
        const scaleStr = scale !== 1 ? ` scale(${scale})` : '';
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)${scaleStr}`;
      });
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    update();
  }

  document.addEventListener('DOMContentLoaded', setupParallax);
})();
