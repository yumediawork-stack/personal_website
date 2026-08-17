const translations = {
    en: {
        hero_title: "Yurii Shmaliuk",
        hero_subtitle: "> Creative Generalist transitioning from video editing into design.",
        hero_cta: "> Execute_Contact",
        about_text: "I move between disciplines without losing quality — video, motion, design, and content are all part of my toolkit. I can jump into a project at any stage and figure out what's needed fast.<br><br>I've worked in teams, managed tasks within structured environments, and know how to push semi-commercial projects from idea to result.",
        exp_title: "Career_Log",
        port_title: "System.Works",
        slider_hint: "< Swipe to view >",
        contact_msg: "> Establishing connection...",
        skills: [
            "UX Research (Interviews, Usability Testing)",
            "Business Analysis (Requirements, Agile)",
            "Video Editing (Premiere Pro, DaVinci Resolve)",
            "Motion Design (After Effects)",
            "Graphic Design (Photoshop, Illustrator)",
            "SMM, Copywriting & Crisis Management",
            "No-code Automation (n8n)",
            "Team & Client Management"
        ],
        lbl_desc: "Description:",
        lbl_stack: "Stack:",
        lbl_client: "Client:"
    },
    uk: {
        hero_title: "Юрій Шмалюк",
        hero_subtitle: "> Креативний дженераліст. Від відеомонтажу до дизайну.",
        hero_cta: "> Зв'язатися",
        about_text: "Я вільно переходжу між дисциплінами без втрати якості — відео, моушн, дизайн та контент. Можу долучитися до проєкту на будь-якому етапі та швидко зрозуміти, що потрібно зробити.<br><br>Маю досвід роботи в командах, управління завданнями в структурованому середовищі та доведення проєктів від ідеї до результату.",
        exp_title: "Журнал_кар'єри",
        port_title: "Система.Роботи",
        slider_hint: "< Гортайте для перегляду >",
        contact_msg: "> Встановлення з'єднання...",
        skills: [
            "UX-дослідження (Інтерв'ю, Юзабіліті-тестування)",
            "Бізнес-аналіз (Вимоги, Agile)",
            "Монтаж відео (Premiere Pro, DaVinci Resolve)",
            "Моушн дизайн (After Effects)",
            "Графічний дизайн (Photoshop, Illustrator)",
            "SMM, Копірайтинг та Кризовий менеджмент",
            "No-code автоматизація (n8n)",
            "Командний та клієнтський менеджмент"
        ],
        lbl_desc: "Опис:",
        lbl_stack: "Стек:",
        lbl_client: "Клієнт:"
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
    
    // Update skills manually
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        skillsList.innerHTML = '';
        translations[lang].skills.forEach(skill => {
            const li = document.createElement('li');
            li.className = 'terminal-text small';
            li.innerText = skill;
            skillsList.appendChild(li);
        });
    }

    document.getElementById('lang-toggle').innerText = `[ ${lang.toUpperCase()} ]`;
}
