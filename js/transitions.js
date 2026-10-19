// Module Switch — page transitions (js/transitions.js, MODULE-SWITCH task 3).
// Isolated from content rendering: no page data, no framework, plain navigation only.
(function () {
    'use strict';

    var html = document.documentElement;
    var overlay = document.getElementById('module-switch');
    var commandEl = document.getElementById('module-command');
    var statusTextEl = document.getElementById('module-status-text');

    var PAGES = {
        'index.html':    { key: 'index',    cmd: 'portfolio.sys' },
        'studio.html':   { key: 'studio',   cmd: 'studio.exe' },
        'media.html':    { key: 'media',    cmd: 'media.log' },
        'projects.html': { key: 'projects', cmd: 'projects.dir' },
        'contact.html':  { key: 'contact',  cmd: 'contact.exe' }
    };

    // minimal dictionary fallback, kept aligned with i18n.js transition_status_* keys
    var STATUS = {
        en: {
            index: 'Opening portfolio…',
            studio: 'Opening studio…',
            media: 'Opening media…',
            projects: 'Opening projects…',
            contact: 'Opening contacts…'
        },
        uk: {
            index: 'Переходимо до портфоліо…',
            studio: 'Переходимо до студії…',
            media: 'Переходимо до медіа…',
            projects: 'Переходимо до проєктів…',
            contact: 'Переходимо до контактів…'
        }
    };

    // --- helpers ---------------------------------------------------------
    function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
    function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); return true; } catch (e) { return false; } }
    function ssDel(k) { try { window.sessionStorage.removeItem(k); } catch (e) {} }

    function canonSearch(search) {
        if (!search || search.length < 2) return '';
        return search.replace(/^\?/, '').split('&').sort().join('&');
    }

    function reducedMotion() {
        try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
    }

    function langOf() { return html.getAttribute('lang') === 'uk' ? 'uk' : 'en'; }

    function statusFor(file) {
        var page = PAGES[file];
        var text = null;
        try {
            if (typeof translations !== 'undefined' && translations) {
                text = translations[langOf()]['transition_status_' + page.key];
            }
        } catch (e) {}
        return text || STATUS[langOf()][page.key];
    }

    // --- entrance cover (arrival) ---------------------------------------
    var fadeTimer = null;

    function entranceEnded() {
        // let the segment indicator keep animating through the fade-out
        if (overlay) {
            overlay.classList.add('fading');
            if (fadeTimer) clearTimeout(fadeTimer);
            fadeTimer = setTimeout(function () {
                fadeTimer = null;
                if (overlay) overlay.classList.remove('fading');
            }, 300);
        }
        if (html.hasAttribute('data-switch-in')) html.removeAttribute('data-switch-in');
        unlockScroll();
    }

    function beginEntrance() {
        // the one-shot marker is consumed here even if it does not match
        var marker = null;
        try { marker = JSON.parse(ssGet('yurii_nav') || 'null'); } catch (e) { marker = null; }
        ssDel('yurii_nav');
        if (!overlay || !html.hasAttribute('data-switch-in')) return; // plain load / marker absent / broken env
        lockScroll();
        var since = (window.__yuriiSplash && window.__yuriiSplash.since) || Date.now();
        var finish = function () {
            // double rAF performs the removal within the next two frames after the setup/dispatch
            requestAnimationFrame(function () {
                requestAnimationFrame(entranceEnded);
            });
        };
        if (window.__yuriiReady) finish();
        else window.addEventListener('yurii:content-ready', finish, { once: true });
        // emergency hide, independent of script.js: the content can never remain covered
        setTimeout(entranceEnded, Math.max(0, 1200 - (Date.now() - since)));
    }

    // --- outgoing cover (click on an internal link) ----------------------
    var exitTimer = null;
    var exiting = false;

    function beginExit(targetHref, file) {
        exiting = true;
        if (commandEl) commandEl.textContent = '> open ' + PAGES[file].cmd;
        if (statusTextEl) statusTextEl.textContent = statusFor(file);
        lockScroll();
        overlay.classList.add('enabled');
        exitTimer = setTimeout(function () {
            exitTimer = null;
            window.location.href = targetHref;
        }, 210); // navigate as soon as the eased cover is opaque; no hold phase
    }

    // scroll freeze with width compensation: removing the scrollbar must not
    // shift the layout while a cover is visible (reserved gutter via padding)
    var sbComp = 0;

    function lockScroll() {
        try {
            sbComp = window.innerWidth - html.clientWidth;
            if (sbComp > 0) html.style.paddingRight = sbComp + 'px';
        } catch (e) { sbComp = 0; }
        html.setAttribute('data-switch-lock', '');
    }

    function unlockScroll() {
        html.removeAttribute('data-switch-lock');
        if (sbComp > 0) {
            html.style.paddingRight = '';
            sbComp = 0;
        }
    }

    function resetExitState() {
        exiting = false;
        if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
        unlockScroll();
        if (overlay) overlay.classList.remove('enabled');
    }

    // --- link interception ----------------------------------------------
    document.addEventListener('click', function (e) {
        if (!overlay) return;
        // only plain, unmodified primary clicks
        if (e.button !== 0) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        if (e.defaultPrevented) return;
        if (exiting) { e.preventDefault(); return; } // double-click protection: one pending transition
        if (reducedMotion()) return; // reduced motion: native navigation, no splash at all

        var host = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!host) return;
        var href = host.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') return;      // in-document anchors: native
        if (host.target && host.target !== '_self') return; // _blank etc: native
        if (host.hasAttribute('download')) return;
        var url;
        try { url = new URL(host.href, location.href); } catch (err) { return; }
        var localFile = location.protocol === 'file:' && url.protocol === 'file:';
        if (!localFile && (!/^https?:$/.test(url.protocol) || url.origin !== location.origin)) return;
        // file: origins are opaque; restrict them by host and directory instead.
        if (localFile && url.host !== location.host) return;

        // only within the current base directory
        var baseDir = location.pathname.replace(/[^/]*$/, '');
        var file = url.pathname.slice(baseDir.length);
        if (url.pathname.slice(0, baseDir.length) !== baseDir || !PAGES[file]) return;
        var destQuery = canonSearch(url.search);
        // same page with same query (hash may differ): native jump, no empty splash
        if (location.pathname === url.pathname && destQuery === canonSearch(location.search)) return;

        var marker = JSON.stringify({
            p: url.pathname,                       // full path: works in /personal_website/ too
            q: destQuery,
            ts: Date.now()
        });
        // Local files may have isolated or unavailable sessionStorage. The exit
        // cover still works; the arrival cover is optional if the marker cannot travel.
        ssSet('yurii_nav', marker);

        e.preventDefault();
        beginExit(host.href, file);
    });

    // restored page: leftover exit state must not survive; a bfcache restore
    // also force-clears entrance residue (normal first show must NOT bypass
    // the agreed content-ready / emergency-timer flow)
    window.addEventListener('pageshow', function (ev) {
        resetExitState();
        if (ev && ev.persisted) entranceEnded();
    });

    beginEntrance();
})();
