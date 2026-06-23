/* ============================================================
   Loomrate homepage interactions.
   Defensive: every feature is wrapped so a failure can't break
   the page (which is fully usable without JS).
   ============================================================ */
(function () {
    'use strict';
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Sticky nav: glass once scrolled ---- */
    function initNav() {
        var nav = document.getElementById('hxNav');
        if (!nav) return;
        var onScroll = function () {
            if (window.scrollY > 24) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Parallax (transform only, rAF-batched) ---- */
    function initParallax() {
        if (reduced) return;
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
        if (!els.length) return;
        var ticking = false;
        var apply = function () {
            var y = window.scrollY;
            els.forEach(function (el) {
                var sp = parseFloat(el.getAttribute('data-parallax')) || 0;
                el.style.transform = 'translate3d(0,' + (y * sp).toFixed(1) + 'px,0)';
            });
            ticking = false;
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { window.requestAnimationFrame(apply); ticking = true; }
        }, { passive: true });
        apply();
    }

    /* ---- Reveal on scroll ---- */
    function initReveal() {
        var els = Array.prototype.slice.call(document.querySelectorAll('.hx-reveal'));
        if (!els.length) return;
        if (reduced || !('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var obs = new IntersectionObserver(function (entries, o) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        els.forEach(function (el) { obs.observe(el); });
        window.setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 2200);
    }

    /* ---- Count-up numbers ---- */
    function animateCount(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduced) { el.textContent = prefix + target + suffix; return; }
        var dur = 1400, start = null;
        var step = function (ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (p < 1) window.requestAnimationFrame(step);
            else el.textContent = prefix + target + suffix;
        };
        window.requestAnimationFrame(step);
    }
    function initCounts() {
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
        if (!els.length) return;
        if (!('IntersectionObserver' in window)) { els.forEach(animateCount); return; }
        var obs = new IntersectionObserver(function (entries, o) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { animateCount(e.target); o.unobserve(e.target); }
            });
        }, { threshold: 0.5 });
        els.forEach(function (el) { obs.observe(el); });
    }

    /* ---- One-time count-up of the live hero rate ---- */
    function initRateCountUp() {
        var el = document.getElementById('preview_true_rate');
        if (!el || reduced) return;
        var txt = el.textContent || '';
        var m = txt.match(/([\d.]+)/);
        if (!m) return;
        var target = parseFloat(m[1]);
        if (isNaN(target)) return;
        var dur = 1100, start = null;
        var step = function (ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = '$' + (target * eased).toFixed(2) + '/hr';
            if (p < 1) window.requestAnimationFrame(step);
            else el.textContent = txt;
        };
        window.requestAnimationFrame(step);
    }

    /* ---- Bento pointer glow ---- */
    function initCardGlow() {
        if (reduced) return;
        document.querySelectorAll('.hx-card').forEach(function (card) {
            card.addEventListener('pointermove', function (ev) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
                card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
            });
        });
    }

    function init() {
        try { initNav(); } catch (e) {}
        try { initParallax(); } catch (e) {}
        try { initReveal(); } catch (e) {}
        try { initCounts(); } catch (e) {}
        try { initCardGlow(); } catch (e) {}
        // Let the inline DOMContentLoaded (updatePreview) set the rate first.
        window.setTimeout(function () { try { initRateCountUp(); } catch (e) {} }, 60);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else { init(); }
})();
