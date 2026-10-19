// Safe localStorage access (may be unavailable or blocked)
const storage = (() => {
    try {
        const t = window.localStorage;
        t.setItem('__test__', '1');
        t.removeItem('__test__');
        return t;
    } catch (e) {
        return null;
    }
})();
function storageGet(key) {
    try { return storage ? storage.getItem(key) : null; } catch (e) { return null; }
}
function storageSet(key, value) {
    try { if (storage) storage.setItem(key, value); } catch (e) {}
}

function updateThemeText() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const t = translations[currentLang];
    themeBtn.innerText = current === 'dark' ? t.theme_dark : t.theme_light;
}

function updateNavAria() {
    const nav = document.querySelector('.retro-nav');
    if (nav) {
        const key = nav.getAttribute('data-i18n-aria');
        if (key && translations[currentLang][key]) nav.setAttribute('aria-label', translations[currentLang][key]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    // 0. Mobile nav disclosure (progressive enhancement)
    const headerEl = document.querySelector('.retro-header');
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');
    const desktopNav = window.matchMedia('(min-width: 1024px)');
    if (headerEl && navToggle && siteNav) {
        headerEl.classList.add('nav-ready'); // from now the panel is closed by default
        const setNavPanel = (open) => {
            headerEl.classList.toggle('nav-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        };
        navToggle.addEventListener('click', () => {
            setNavPanel(!headerEl.classList.contains('nav-open'));
        });
        // choosing a page closes the menu; theme/lang switches keep it open
        siteNav.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => setNavPanel(false));
        });
        headerEl.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape' || !headerEl.classList.contains('nav-open')) return;
            const focusInMenu = siteNav.contains(document.activeElement);
            setNavPanel(false);
            if (focusInMenu) navToggle.focus();
        });
        // crossing to desktop clears the mobile state; opening again starts closed
        const onNavMode = (ev) => { if (ev.matches) setNavPanel(false); };
        if (desktopNav.addEventListener) desktopNav.addEventListener('change', onNavMode);
        else if (desktopNav.addListener) desktopNav.addListener(onNavMode);
    }

    // 1. Theme toggle (with persistence; priority: explicit query param -> saved choice -> default)
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const presetTheme = urlParams.get('theme');
    const savedTheme = storageGet('site_theme');
    if (presetTheme === 'dark' || presetTheme === 'light') {
        currentTheme = presetTheme;
    } else if (savedTheme === 'dark' || savedTheme === 'light') {
        currentTheme = savedTheme;
    }
    document.documentElement.setAttribute('data-theme', currentTheme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            storageSet('site_theme', currentTheme);
            updateThemeText();
        });
    }

    // 2. Language toggle (with persistence)
    const presetLang = urlParams.get('lang');
    const savedLang = storageGet('site_lang');
    const startLang = (presetLang === 'en' || presetLang === 'uk') ? presetLang
        : (savedLang === 'en' || savedLang === 'uk') ? savedLang : 'en';

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'uk' : 'en';
            storageSet('site_lang', nextLang);
            setLanguage(nextLang);
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            if (activeFilterBtn && grid) renderProjects(activeFilterBtn.getAttribute('data-filter'));
            if (timeline) renderExperience();
            if (servicesContainer) renderStudioServices();
            if (mediaSections) renderMediaSections();
            if (contactMainEmail) renderContactCenter();
            if (timeline) {
                timeline.setAttribute('aria-label', (translations[currentLang] && translations[currentLang].timeline_aria) || 'Career log strips');
            }
            updateOpenModalLanguage();
        });
    }

    // 3. Experience Slider (index page only)
    const timeline = document.getElementById('timeline-container');

    if (timeline) {
        // vertical wheel converts to horizontal scroll only inside the slider;
        // at the start/end edges (or when there is nothing to scroll) the page
        // keeps scrolling natively — no dead zone above the timeline
        timeline.addEventListener('wheel', (evt) => {
            if (evt.deltaY === 0) return;
            const maxScroll = timeline.scrollWidth - timeline.clientWidth;
            if (maxScroll <= 0) return;
            const atStart = timeline.scrollLeft <= 0 && evt.deltaY < 0;
            const atEnd = timeline.scrollLeft >= maxScroll - 1 && evt.deltaY > 0;
            if (atStart || atEnd) return;
            evt.preventDefault();
            timeline.scrollLeft += evt.deltaY * 2;
        }, { passive: false });

        // keyboard access: focus the strip, then Left/Right scroll one card
        timeline.setAttribute('tabindex', '0');
        const t = translations[currentLang] || {};
        timeline.setAttribute('aria-label', t.timeline_aria || 'Career log strips');
        timeline.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); timeline.scrollLeft += 240; }
            if (e.key === 'ArrowLeft') { e.preventDefault(); timeline.scrollLeft -= 240; }
        });

        let isDown = false;
        let startX;
        let scrollLeftVal;

        timeline.style.cursor = 'grab';

        timeline.addEventListener('mousedown', (e) => {
            // synthesized mouse events from touch would fight native swipe
            if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
            isDown = true;
            timeline.style.cursor = 'grabbing';
            startX = e.pageX - timeline.offsetLeft;
            scrollLeftVal = timeline.scrollLeft;
        });
        timeline.addEventListener('mouseleave', () => {
            isDown = false;
            timeline.style.cursor = 'grab';
        });
        timeline.addEventListener('mouseup', () => {
            isDown = false;
            timeline.style.cursor = 'grab';
        });
        timeline.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timeline.offsetLeft;
            const walk = (x - startX) * 2;
            timeline.scrollLeft = scrollLeftVal - walk;
        });
        // touch swipe is native horizontal scrolling: no touchmove interception
    }

    function renderExperience() {
        if (!timeline || typeof portfolioData === 'undefined') return;
        timeline.innerHTML = '';
        portfolioData.experience.forEach((exp, index) => {
            const desc = currentLang === 'en' ? exp.descEn : exp.descUk;
            timeline.innerHTML += `
                <div class="slide-item window" data-index="${index}">
                    <div class="window-header"><span class="window-title">${exp.title}</span></div>
                    <div class="window-content matrix-reveal-target">
                        <p class="terminal-text" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">${exp.role}</p>
                        <p class="terminal-text small">> ${exp.date}</p>
                        <p class="terminal-text small" style="margin-top: 1rem; opacity: 0.8;">${desc}</p>
                    </div>
                </div>
            `;
        });
        setTimeout(setupScrollReveal, 100);
    }

    function setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target.querySelector('.matrix-reveal-target');
                    if (target && !target.classList.contains('revealed')) {
                        applyMatrixReveal(target);
                        target.classList.add('revealed');
                    }
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.slide-item').forEach(slide => observer.observe(slide));
    }

    function applyMatrixReveal(element) {
        const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === 1 && node.tagName === 'P');
        textNodes.forEach(node => {
            const text = node.innerText;
            node.innerHTML = '';
            node.classList.add('matrix-reveal');
            let delay = 0;
            const words = text.split(' ');

            words.forEach((word, wIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                for (let i = 0; i < word.length; i++) {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = word[i];
                    charSpan.style.animationDelay = `${delay}s`;
                    charSpan.className = 'matrix-char';
                    wordSpan.appendChild(charSpan);
                    delay += 0.01;
                }

                node.appendChild(wordSpan);
                if (wIdx < words.length - 1) {
                    node.appendChild(document.createTextNode(' '));
                }
            });
        });
    }

    // 4. Studio services (studio.html only)
    const servicesContainer = document.getElementById('studio-services');

    function renderStudioServices() {
        if (!servicesContainer) return;
        const t = translations[currentLang];
        const services = [
            { title: t.service_1_title, desc: t.service_1_desc },
            { title: t.service_2_title, desc: t.service_2_desc },
            { title: t.service_3_title, desc: t.service_3_desc }
        ];
        servicesContainer.innerHTML = '';
        services.forEach(s => {
            const win = document.createElement('div');
            win.className = 'service-window window';
            win.innerHTML = `
                <div class="window-header"><span class="window-title">${s.title}</span></div>
                <div class="window-content">
                    <p class="terminal-text small">> ${s.desc}</p>
                    <a href="contact.html?topic=client" class="btn secondary">${t.service_cta}</a>
                </div>
            `;
            servicesContainer.appendChild(win);
        });
    }

    // 5. Portfolio grid (index page only)
    const grid = document.getElementById('portfolio-grid');

    window.renderProjects = (filter) => {
        if (!grid) return;
        grid.innerHTML = '';
        const filtered = filter === 'all' ? portfolioData.works : portfolioData.works.filter(p => p.category === filter);
        const t = translations[currentLang];

            filtered.forEach((p, workIdx) => {
                // below-the-fold previews lazy-load; the hero portrait stays eager
                const imgTag = p.thumb
                    ? `<img src="${p.thumb}" class="project-thumb" alt="${p.title}"${workIdx > 2 ? ' loading="lazy"' : ''}>`
                    : '';
                const card = document.createElement('article');
            card.className = 'project-card window';
            const kindLabel = t['kind_' + p.kind] || '';
            const desc = currentLang === 'en' ? p.descEn : p.descUk;

            let actionHtml = '';
            if (p.content) {
                actionHtml = `<button type="button" class="btn secondary btn-view" data-work-title="${p.title}">${t.btn_view}</button>`;
            } else if (p.url) {
                actionHtml = `<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn secondary">${t.open_link}</a>`;
            }

            card.innerHTML = `
                <div class="window-header">
                    <span class="window-title">${p.title}.exe</span>
                    <span class="kind-label kind-inline terminal-text small">[${kindLabel}]</span>
                </div>
                <div class="window-content">
                    ${imgTag || `<div class="media-placeholder" aria-hidden="true"><span class="media-placeholder-text">${p.placeholder || p.title}</span></div>`}
                </div>
                <div class="window-footer">
                    <div class="card-body">
                        <p class="terminal-text small">> ${desc}</p>
                        <p class="terminal-text small"><span style="color: var(--accent-color);">${t.lbl_stack}</span> ${p.stack}</p>
                    </div>
                    <div class="card-actions">${actionHtml}</div>
                </div>
            `;

            const viewBtn = card.querySelector('.btn-view');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => openWorkModal(p, viewBtn));
            }
            grid.appendChild(card);
        });
    };

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            renderProjects(e.currentTarget.getAttribute('data-filter'));
        });
    });

    // 6. Media page (platforms, audience, materials)
    const mediaSections = document.getElementById('media-page');

    function renderMediaSections() {
        if (!mediaSections || typeof mediaPlatforms === 'undefined') return;
        const t = translations[currentLang];
        const locale = currentLang === 'uk' ? 'uk-UA' : 'en-US';
        const numberFmt = new Intl.NumberFormat(locale);
        const dateFmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' });
        // a follower metric is confirmed only as a finite non-negative number
        const isKnownCount = (pl) => typeof pl.followers === 'number' && Number.isFinite(pl.followers) && pl.followers >= 0;
        // validate YYYY-MM-DD without timezone drift: build the local calendar date
        const parseMeasurementDate = (value) => {
            if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
            const [y, m, d] = value.split('-').map(Number);
            const dt = new Date(y, m - 1, d);
            if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
            return dt;
        };
        // the date always belongs to its own confirmed metric; missing -> explicit localized note
        const metricDateHtml = (pl) => {
            const dt = parseMeasurementDate(pl.measuredAt);
            return `<span class="audience-date">(${dt ? dateFmt.format(dt) : t.audience_date_missing})</span>`;
        };

        // 6a. Platforms
        const platformsGrid = document.getElementById('platforms-grid');
        platformsGrid.innerHTML = '';
        mediaPlatforms.forEach(pl => {
            const confirmedMetric = isKnownCount(pl)
                ? `<p class="terminal-text small media-metric">> ${t.platform_followers}: ${numberFmt.format(pl.followers)} ${metricDateHtml(pl)}</p>`
                : '';
            const card = document.createElement('article');
            card.className = 'media-card window platform-card';
            card.innerHTML = `
                <div class="window-header">
                    <span class="window-title">${pl.platform}</span>
                    ${pl.handle ? `<span class="kind-label kind-inline terminal-text small">${pl.handle}</span>` : ''}
                </div>
                <div class="window-content">
                    <h3 class="media-title">${pl.platform}</h3>
                    <p class="terminal-text small">> ${currentLang === 'en' ? pl.descEn : pl.descUk}</p>
                    ${confirmedMetric}
                </div>
                <div class="window-footer">
                    ${pl.profileUrl
                        ? `<a href="${pl.profileUrl}" target="_blank" rel="noopener noreferrer" class="btn secondary">${t.platform_open}</a>`
                        : `<p class="media-status terminal-text small">[${t.platform_soon}]</p>`}
                </div>
            `;
            platformsGrid.appendChild(card);
        });

        // 6b. Audience
        const audienceBox = document.getElementById('audience-box');
        audienceBox.innerHTML = '';

        const known = mediaPlatforms.filter(isKnownCount);
        const allUnknown = known.length === 0;
        const maxVal = known.reduce((m, pl) => Math.max(m, pl.followers), 0);

        if (allUnknown) {
            // Neutral finished state: no fake bars, no fake zeros, no dates detached from metrics
            let rows = '';
            mediaPlatforms.forEach(pl => {
                rows += `<li><span class="char-name">${pl.platform}</span><span class="char-value">—</span></li>`;
            });
            audienceBox.innerHTML = `
                <p class="terminal-text">${t.audience_preparing}</p>
                <ul class="audience-list">${rows}</ul>
            `;
        } else {
            let rows = '';
            mediaPlatforms.forEach(pl => {
                let barWidth = 0;
                if (!isKnownCount(pl)) {
                    // missing data: no bar, no date claim
                    rows += `
                        <div class="bar-row">
                            <span class="char-name terminal-text small">${pl.platform}</span>
                            <span class="bar-track" role="img" aria-label="${pl.platform}: ${t.no_data}"><span class="bar-fill" style="width:0%"></span></span>
                            <span class="char-value">${t.no_data}</span>
                        </div>
                    `;
                } else {
                    // all-zero dataset must not scale by max (division by zero)
                    barWidth = maxVal > 0 ? Math.round((pl.followers / maxVal) * 100) : 0;
                    rows += `
                        <div class="bar-row">
                            <span class="char-name terminal-text small">${pl.platform}</span>
                            <span class="bar-track" role="img" aria-label="${pl.platform}: ${numberFmt.format(pl.followers)}"><span class="bar-fill" style="width:${barWidth}%"></span></span>
                            <span class="char-value">${numberFmt.format(pl.followers)} ${metricDateHtml(pl)}</span>
                        </div>
                    `;
                }
            });
            audienceBox.innerHTML = `
                <div class="audience-chart">${rows}</div>
            `;
        }

        const note = document.createElement('p');
        note.className = 'terminal-text small audience-note';
        note.innerText = t.audience_manual;
        audienceBox.prepend(note);

        // 6c. Materials
        const materialsGrid = document.getElementById('materials-grid');
        materialsGrid.innerHTML = '';
        mediaMaterials.forEach(m => {
            const card = document.createElement('article');
            card.className = 'media-card window';
            const title = currentLang === 'en' ? m.titleEn : m.titleUk;
            const desc = currentLang === 'en' ? m.descEn : m.descUk;
            const idea = currentLang === 'en' ? (m.ideaEn || '') : (m.ideaUk || '');

            let action = '';
            if (m.url) {
                action = `<a href="${m.url}" target="_blank" rel="noopener noreferrer" class="btn secondary media-link">${t.media_open}</a>`;
            } else {
                action = `<p class="media-status terminal-text small">[${t.status_planned}]</p>`;
            }

            card.innerHTML = `
                <div class="media-placeholder" aria-hidden="true">
                    <span class="media-placeholder-text">media/${m.placeholder || 'draft'}</span>
                </div>
                <div class="window-footer">
                    <h3 class="media-title">${title}</h3>
                    <p class="terminal-text small">> ${desc}</p>
                    ${idea ? `<p class="terminal-text small media-idea"><span style="color: var(--accent-color);">${t.media_idea_label}</span> ${idea}</p>` : ''}
                    <div class="card-actions">${action}</div>
                </div>
            `;
            materialsGrid.appendChild(card);
        });
    }

    // 7. Contact page (topic param -> highlight + mailto subject)
    const contactMainEmail = document.getElementById('contact-main-email');
    const validTopics = ['client', 'media', 'experiment'];

    function renderContactCenter() {
        if (!contactMainEmail) return;
        const t = translations[currentLang];
        const topicParam = urlParams.get('topic');
        const topic = validTopics.includes(topicParam) ? topicParam : null;

        document.querySelectorAll('.topic-card').forEach(card => {
            const cardTopic = card.getAttribute('data-topic');
            const active = topic && cardTopic === topic;
            card.classList.toggle('topic-active', !!active);
            card.setAttribute('data-active', active ? 'true' : 'false');
        });

        const subjectKey = topic ? 'subject_' + topic : 'subject_default';
        document.querySelectorAll('.js-mailto').forEach(link => {
            const linkTopic = link.getAttribute('data-topic');
            const key = 'subject_' + (linkTopic && validTopics.includes(linkTopic) ? linkTopic : 'default');
            link.setAttribute('href', 'mailto:yumediawork@gmail.com?subject=' + encodeURIComponent(translations[currentLang][key]));
        });
        contactMainEmail.setAttribute('href', 'mailto:yumediawork@gmail.com?subject=' + encodeURIComponent(t[subjectKey]));
    }

    // 8. Modal logic (project modal exists on index page only)
    const projectModal = document.getElementById('project-modal');
    let lastFocusedElement = null;
    let modalClearTimer = null;

    function getFocusableElements(container) {
        return Array.from(container.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])'))
            .filter(el => el.offsetParent !== null);
    }

    function openWorkModal(project, trigger) {
        if (!projectModal || !project.content) return;
        document.getElementById('modal-title').textContent = project.title + ".exe";
        document.getElementById('modal-content').innerHTML = project.content;

        const t = translations[currentLang];
        const desc = currentLang === 'en' ? project.descEn : project.descUk;
        document.getElementById('modal-footer').innerHTML = `
            <div class="modal-info-grid terminal-text small">
                <p><span class="modal-info-label">${t.lbl_client}</span> ${project.client}</p>
                <p><span class="modal-info-label">${t.lbl_stack}</span> ${project.stack}</p>
                <p style="margin-top: 0.5rem;"><span class="modal-info-label">${t.lbl_desc}</span> ${desc}</p>
                ${project.url ? `<p style="margin-top: 0.5rem;"><span class="modal-info-label">${t.lbl_url}</span> <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="modal-url-link">${project.url}</a></p>` : ''}
            </div>
        `;
        lastFocusedElement = trigger || document.activeElement;
        // a pending close-clear must never wipe the content of a newly opened work
        if (modalClearTimer) { clearTimeout(modalClearTimer); modalClearTimer = null; }
        projectModal.inert = false; // remove inert first: an inert dialog cannot take focus
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // defer focus so styles (visibility/inert removal) are applied first;
        // rAF guarantees paint-synced timing, setTimeout is a fallback for
        // environments that suppress animation frames
        const modalWindowEl = projectModal.querySelector('.modal-window');
        const focusFirst = () => {
            if (!projectModal.classList.contains('active')) return;
            const focusables = getFocusableElements(modalWindowEl);
            if (focusables.length && focusables[0] !== document.activeElement) focusables[0].focus();
        };
        requestAnimationFrame(() => requestAnimationFrame(focusFirst));
        setTimeout(focusFirst, 30);
    }

    function closeModal(modalId) {
        const modal = modalId === 'project-modal' ? projectModal : null;
        if (!modal) return;
        // make the dialog untabbable synchronously, then animate the fade-out
        modal.inert = true;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
        // stop embedded video/audio immediately
        modal.querySelectorAll('iframe, video, audio').forEach(node => node.remove());
        const contentEl = document.getElementById('modal-content');
        // deferred clear keeps content visible during the fade-out;
        // the timer is cancelled by any later openWorkModal so a re-open cannot be wiped
        if (modalClearTimer) clearTimeout(modalClearTimer);
        modalClearTimer = setTimeout(() => { contentEl.innerHTML = ''; modalClearTimer = null; }, 250);
    }

    function getOpenModal() {
        return document.querySelector('.modal.active');
    }

    document.addEventListener('keydown', (e) => {
        const open = getOpenModal();
        if (!open) return;

        if (e.key === 'Escape') {
            closeModal(open.id);
            return;
        }

        if (e.key === 'Tab') {
            const focusables = getFocusableElements(open);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    if (projectModal) {
        projectModal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => closeModal(e.currentTarget.getAttribute('data-target')));
        });
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal(projectModal.id);
        });
    }

    function updateOpenModalLanguage() {
        const open = getOpenModal();
        if (!open || open.id !== 'project-modal') return;
        const title = document.getElementById('modal-title').textContent.replace(/\.exe$/, '');
        const project = portfolioData.works.find(p => p.title === title);
        if (project) {
            openWorkModal(project, lastFocusedElement);
        }
    }

    // 9. Matrix Background Canvas
    const canvas = document.getElementById('matrix-bg');

    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        const chars = "UI/UXVIDEOMOTIONSMM101010YURIISHMALIUK010101".split("");
        const fontSize = 16;
        let columns = canvas.width / fontSize;
        let drops = [];

        for (let x = 0; x < columns; x++) drops[x] = 1;

        function drawMatrix() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || "#39FF14";
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let matrixInterval = null;
        // narrower viewports get a lighter decorative loop (fewer fps)
        const matrixIntervalMs = () => (window.innerWidth < 500 ? 80 : 50);
        function drawStep() {
            drawMatrix();
        }
        function startMatrix() {
            if (matrixInterval) return; // never run two loops concurrently
            matrixInterval = setInterval(drawStep, matrixIntervalMs());
        }
        function stopMatrix() {
            if (matrixInterval) { clearInterval(matrixInterval); matrixInterval = null; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (reducedMotion.matches) { stopMatrix(); } else { startMatrix(); }
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) stopMatrix(); else startMatrix();
        });
        // decorative loop pauses entirely in hidden tabs
        document.addEventListener('visibilitychange', () => {
            if (document.hidden || reducedMotion.matches) stopMatrix();
            else startMatrix();
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
            columns = canvas.width / fontSize;
            drops = [];
            for (let x = 0; x < columns; x++) drops[x] = 1;
        });
    }

    // 10. Render everything that exists on this page
    window.renderMediaSections = renderMediaSections;
    window.renderContactCenter = renderContactCenter;

    setLanguage(startLang);
    if (timeline) renderExperience();
    if (servicesContainer) renderStudioServices();
    if (grid) renderProjects('all');
    if (mediaSections) renderMediaSections();
    if (contactMainEmail) renderContactCenter();

    // Module Switch: announce that synchronous initial rendering is complete
    window.__yuriiReady = true;
    window.dispatchEvent(new CustomEvent('yurii:content-ready'));
});
