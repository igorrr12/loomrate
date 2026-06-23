/* ============================================================
   Loomrate — shared enhancement behaviour
   Defensive by design: if anything here fails, the page is
   already fully visible/usable (reveal classes are added by JS,
   never present in the static HTML).
   ============================================================ */
(function () {
    'use strict';

    /* Theme: pages default to dark (data-theme="dark" in the HTML).
       Honour a saved "light" preference on every page, including those
       (e.g. blog posts) that have no inline loadTheme(). */
    try {
        if (localStorage.getItem('fpa_theme') === 'light') {
            document.body.setAttribute('data-theme', 'light');
        }
    } catch (e) {}

    var prefersReduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Content elements that benefit from a gentle entrance.
    // Deliberately excludes anything the calculator app mutates.
    var REVEAL_SELECTOR = [
        '.explainer-card',
        '.tool-card',
        '.post-card',
        '.faq-item',
        '.glossary-item'
    ].join(',');

    function initReveal() {
        if (prefersReduced || !('IntersectionObserver' in window)) return;

        var nodes;
        try {
            nodes = document.querySelectorAll(REVEAL_SELECTOR);
        } catch (e) { return; }
        if (!nodes.length) return;

        var items = Array.prototype.slice.call(nodes);

        // Stagger siblings that share a parent for a polished cascade.
        items.forEach(function (el) {
            el.classList.add('lr-in');
            var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
            var delay = Math.min(idx, 5) * 70;
            el.style.transitionDelay = delay + 'ms';
        });

        var show = function (el) {
            el.classList.add('lr-shown');
            // Drop the delay after first paint so hover transitions stay snappy.
            window.setTimeout(function () { el.style.transitionDelay = ''; }, 700);
        };

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    show(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        items.forEach(function (el) { observer.observe(el); });

        // Safety net: never leave content hidden if the observer
        // somehow doesn't fire (e.g. element starts off-DOM/hidden).
        window.setTimeout(function () {
            items.forEach(function (el) {
                if (!el.classList.contains('lr-shown')) show(el);
            });
        }, 1600);
    }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    ready(initReveal);
})();
