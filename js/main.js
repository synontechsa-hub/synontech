/* ============================================================
   synontech — main.js
   Scroll-reveal observer + mobile hamburger toggle + stats sync.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Current Year Sync ──────────────────────────────────────
    const yearEls = document.querySelectorAll('#current-year');
    yearEls.forEach(el => el.textContent = new Date().getFullYear());

    // ── Scroll Reveal ─────────────────────────────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // ── Mobile Hamburger ──────────────────────────────────────────
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks  = document.getElementById('nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.textContent = isOpen ? '✕' : '☰';
      });

      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.textContent = '☰';
        });
      });
    }

    // ── GitHub Repo Sync ───────────────────────────────────────
    const repoCountEl = document.getElementById('repo-count');

    async function syncRepoCount() {
        if (!repoCountEl) return;
        try {
            const response = await fetch('https://api.github.com/users/synontechsa-hub/repos?per_page=100');
            if (!response.ok) throw new Error('GitHub API fail');
            const repos = await response.json();

            // Filter: exclude forks and "-website" mocks
            const projectRepos = repos.filter(repo =>
                !repo.fork &&
                !repo.name.toLowerCase().endsWith('-website')
            );

            const count = projectRepos.length;

            // Set up an observer to start animation when visible
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateValue(repoCountEl, 0, count, 1500);
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statsObserver.observe(repoCountEl);

        } catch (err) {
            console.warn('Repo sync failed, using fallback.', err);
        }
    }

    function animateValue(el, start, end, duration) {
        if (!el) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            el.textContent = current + (end > 0 ? '+' : '');
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    syncRepoCount();

    // ── Broken Link / 404 Fallback ───────────────────────────
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '404.html') {
                // Potential for a cool transition here later
            }
        });
    });

    // ── Dynamic HUD Coordinates ────────────────────────────────
    const coordsEl = document.getElementById('user-coords');

    function updateHUDCoords() {
        if (!coordsEl) return;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Format: N/S 00.0000 / E/W 00.0000
                const latDir = lat >= 0 ? 'N' : 'S';
                const lonDir = lon >= 0 ? 'E' : 'W';
                const absLat = Math.abs(lat).toFixed(4);
                const absLon = Math.abs(lon).toFixed(4);

                coordsEl.innerHTML = `${latDir} ${absLat}<br>${lonDir} ${absLon}`;
            }, (error) => {
                console.warn("Geolocation access denied or failed.");
                coordsEl.innerHTML = "LOCATION<br>ENCRYPTED";
            });
        } else {
            coordsEl.innerHTML = "SIGNAL<br>LOST";
        }
    }

    updateHUDCoords();
});
