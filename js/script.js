document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        themeBtn.innerText = `[ Theme: ${next.charAt(0).toUpperCase() + next.slice(1)} ]`;
    });

    // 2. Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    langBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'uk' : 'en';
        setLanguage(nextLang);
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        if(activeFilterBtn) renderProjects(activeFilterBtn.getAttribute('data-filter')); 
        renderExperience(); // Re-render to translate slider content
    });

    // 3. Experience Slider with Matrix Reveal
    const timeline = document.getElementById('timeline-container');
    
    // Add mouse wheel scroll for the timeline
    timeline.addEventListener('wheel', (evt) => {
        if (evt.deltaY !== 0) {
            evt.preventDefault();
            timeline.scrollLeft += evt.deltaY * 2; // Multiply for faster scroll
        }
    });

    // Add drag-to-scroll (LMB) functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    timeline.style.cursor = 'grab';

    timeline.addEventListener('mousedown', (e) => {
        isDown = true;
        timeline.style.cursor = 'grabbing';
        startX = e.pageX - timeline.offsetLeft;
        scrollLeft = timeline.scrollLeft;
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
        const walk = (x - startX) * 2; // Scroll-fast multiplier
        timeline.scrollLeft = scrollLeft - walk;
    });

    function renderExperience() {
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
                    if(target && !target.classList.contains('revealed')) {
                        applyMatrixReveal(target);
                        target.classList.add('revealed');
                    }
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.slide-item').forEach(slide => observer.observe(slide));
    }

    function applyMatrixReveal(element) {
        // Drop in animation with proper word wrapping
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
                wordSpan.style.whiteSpace = 'nowrap'; // Keep letters of a word together
                
                for(let i=0; i<word.length; i++) {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = word[i];
                    charSpan.style.animationDelay = `${delay}s`;
                    charSpan.className = 'matrix-char';
                    wordSpan.appendChild(charSpan);
                    delay += 0.01; 
                }
                
                node.appendChild(wordSpan);
                if (wIdx < words.length - 1) {
                    node.appendChild(document.createTextNode(' ')); // Real space for wrapping
                }
            });
        });
    }

    // 4. Populate Portfolio
    const grid = document.getElementById('portfolio-grid');
    
    window.renderProjects = (filter) => {
        grid.innerHTML = '';
        const filtered = filter === 'all' ? portfolioData.projects : portfolioData.projects.filter(p => p.category === filter);
        
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card window';
            card.innerHTML = `
                <div class="window-header"><span class="window-title">${p.title}.exe</span></div>
                <div class="window-content" style="padding:0; border-bottom: 2px solid var(--window-border);">
                    <img src="${p.thumb}" class="project-thumb" alt="${p.title}">
                </div>
                <div class="window-footer">
                    <p class="terminal-text small">> ${currentLang === 'en' ? p.descEn : p.descUk}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(p, 'project-modal'));
            grid.appendChild(card);
        });
    };

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProjects(e.target.getAttribute('data-filter'));
        });
    });

    // 5. Modal Logic
    const modals = {
        'project-modal': document.getElementById('project-modal'),
        'contact-modal': document.getElementById('contact-modal')
    };

    function openModal(project, modalId) {
        const modal = modals[modalId];
        if(!modal) return;

        if (modalId === 'project-modal') {
            document.getElementById('modal-title').innerText = project.title + ".exe";
            document.getElementById('modal-content').innerHTML = project.content;
            
            const t = translations[currentLang];
            const desc = currentLang === 'en' ? project.descEn : project.descUk;
            
            document.getElementById('modal-footer').innerHTML = `
                <div class="modal-info-grid terminal-text small">
                    <p><span class="modal-info-label">${t.lbl_client}</span> ${project.client}</p>
                    <p><span class="modal-info-label">${t.lbl_stack}</span> ${project.stack}</p>
                    <p style="margin-top: 0.5rem;"><span class="modal-info-label">${t.lbl_desc}</span> ${desc}</p>
                </div>
            `;
        }
        modal.classList.add('active');
    }

    function closeModal(modalId) {
        const modal = modals[modalId];
        if(modal) {
            modal.classList.remove('active');
            if(modalId === 'project-modal') {
                setTimeout(() => { document.getElementById('modal-content').innerHTML = ''; }, 300);
            }
        }
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.getAttribute('data-target'));
        });
    });

    // Close on outside click
    Object.values(modals).forEach(modal => {
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal(modal.id);
        });
    });

    // Contact button logic
    document.getElementById('btn-contact').addEventListener('click', () => {
        modals['contact-modal'].classList.add('active');
    });

    // 6. Matrix Background Canvas
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    // Characters from skills and name
    const chars = "UI/UXVIDEOMOTIONSMM101010YURIISHMALIUK010101".split("");
    const fontSize = 16;
    let columns = canvas.width / fontSize;
    let drops = [];
    
    for(let x = 0; x < columns; x++) drops[x] = 1;
    
    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || "#39FF14";
        ctx.font = fontSize + "px monospace";
        
        for(let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);

    window.addEventListener('resize', () => {
        resizeCanvas();
        columns = canvas.width / fontSize;
        drops = [];
        for(let x = 0; x < columns; x++) drops[x] = 1;
    });

    // Initialize
    setLanguage('en');
    renderExperience();
    renderProjects('all');
});
