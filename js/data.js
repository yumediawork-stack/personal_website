const portfolioData = {
    experience: [
        { title: "Main Beach Advisors", role: "Video Editor / Motion Designer (Freelance)", date: "2025 - Present", descUk: "Документаційні та навчальні відео, реліз-ноут відео, логотип-анімація для AI-платформи Sapience.", descEn: "Documentation and educational videos, release-note videos, and logo animation for the AI platform Sapience." },
        { title: "Energoresurs", role: "Video Editor (Freelance client)", date: "Sep 2025 - Present", descUk: "10+ рекламних, інформаційних та кейс-стаді відео для промислового/енергетичного клієнта.", descEn: "10+ promotional, informational, and case-study videos for an industrial/energy-sector client." },
        { title: "Nova Poshta", role: "Client Success / Account Manager", date: "Jan - May 2025", descUk: "Координація команди підтримки, розподіл завдань, контроль якості, клієнтська комунікація.", descEn: "Coordinated a support team, distributed tasks, owned quality control and client communication." },
        { title: "COI", role: "Graphic Designer (Internship)", date: "2025, 2 mo.", descUk: "Бренд-айдентика, типографіка для 2 клієнтів.", descEn: "Brand identity and typography for 2 clients." },
        { title: "SMM Team (2-person)", role: "SMM / Copywriter", date: "2021 - Present", descUk: "Розвиток YouTube-каналів, ведення Facebook-спільнот, кризовий менеджмент у соцмережах.", descEn: "Growing YouTube channels, managing Facebook communities, and leading social-media crisis/reputation management." },
        { title: "LPNU", role: "UI/UX & Business Analytics, M.Sc.", date: "2021 - Present", descUk: "User research, wireframing, prototyping, usability testing. Курс бізнес-аналітики від LinkUp та QubStudio.", descEn: "User research, wireframing, prototyping, usability testing. Business Analytics fundamentals from LinkUp and QubStudio experts." }
    ],
    projects: [
        {
            id: 1,
            title: "Documentation_Videos",
            category: "video",
            thumb: "assets/images/thumbs/sapience-docs.svg",
            content: `<div class="iframe-container"><iframe src="https://www.youtube.com/embed/ScMzIvxBSi4" allowfullscreen></iframe></div>`,
            descEn: "Produced educational and documentation videos for the AI platform Sapience, ranging from 2-minute explainers to 20-minute in-depth guides.",
            descUk: "Створення навчальних та документаційних відео для AI-платформи Sapience: від 2-хвилинних експлейнерів до 20-хвилинних глибоких гайдів.",
            stack: "Premiere Pro, DaVinci Resolve",
            client: "Main Beach Advisors / Sapience"
        },
        {
            id: 2,
            title: "Motion_Graphics",
            category: "video",
            thumb: "assets/images/thumbs/sapience-motion.svg",
            content: `<div class="iframe-container"><iframe src="https://player.vimeo.com/video/1213024891" allowfullscreen></iframe></div>`,
            descEn: "Logo animation and interface element animation for the Sapience brand, built in After Effects.",
            descUk: "Анімація логотипу та елементів інтерфейсу для бренду Sapience, зроблено в After Effects.",
            stack: "After Effects",
            client: "Main Beach Advisors / Sapience"
        },
        {
            id: 6,
            title: "Energoresurs_Video",
            category: "video",
            thumb: "assets/images/thumbs/energoresurs.svg",
            content: `<div class="iframe-container"><iframe src="https://drive.google.com/file/d/1M1Vdc2gZI4pPn3CDXEBQyGma5O37jqzZ/preview" allow="autoplay" allowfullscreen></iframe></div>`,
            descEn: "One of 10+ promotional, informational, and case-study videos produced independently for an industrial/energy-sector client across multiple facility projects.",
            descUk: "Один з 10+ рекламних, інформаційних та кейс-стаді відео, знятих самостійно для промислового/енергетичного клієнта на кількох обʼєктах.",
            stack: "Premiere Pro, DaVinci Resolve",
            client: "Energoresurs (Freelance)"
        },
        {
            id: 3,
            title: "UI_UX_Prototyping",
            category: "design",
            thumb: "assets/images/thumbs/figma-lab8.svg",
            content: `<div class="iframe-container"><iframe src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2FpxkQeA4knjtQpvxTOQIUO3%2Flab_8--prototype-%3Ft%3DmOYBe9mZEprhWAzX-1" allowfullscreen></iframe></div>`,
            descEn: "Wireframes and a clickable prototype built during UI/UX coursework at LPNU, focused on solving a real business scenario.",
            descUk: "Вайрфрейми та клікабельний прототип, зроблені під час навчального курсу UI/UX в LPNU, під реальний бізнес-сценарій.",
            stack: "Figma",
            client: "LPNU coursework"
        },
        {
            id: 7,
            title: "RGR_LUGX",
            category: "design",
            thumb: "assets/images/thumbs/figma-rgr.svg",
            content: `<div class="iframe-container"><iframe src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fp1pa2ZSgjSX8bLpNCtpFX8%2FRGR_LUGX%3Fnode-id%3D0-1%26t%3DwcOOEgD7LQSB5UQs-1" allowfullscreen></iframe></div>`,
            descEn: "A second course project exploring UX/UI fundamentals in Figma. UI/UX is not the current main focus — this reflects early-stage practice, not a specialization.",
            descUk: "Другий навчальний проєкт з основ UX/UI в Figma. UI/UX зараз не основний фокус — це радше практика на старті, а не спеціалізація.",
            stack: "Figma",
            client: "LPNU coursework"
        },
        {
            id: 4,
            title: "Content_Automation",
            category: "code",
            thumb: "assets/images/thumbs/telegram-bot.svg",
            content: `<div style="padding: 1.5rem; text-align:center;"><img src="assets/images/thumbs/telegram-bot.svg" style="width:100%; max-width:480px; height:auto; margin:0 auto; display:block;"></div>`,
            descEn: "Automated content posting to Telegram and Instagram, built as a no-code automation in n8n rather than a custom bot framework.",
            descUk: "Автоматичний постинг контенту в Telegram та Instagram, зроблено як no-code автоматизацію на n8n, а не окремого бота на коді.",
            stack: "n8n (no-code automation)",
            client: "Pet Project"
        },
        {
            id: 5,
            title: "Antigravity_Scripts",
            category: "code",
            thumb: "assets/images/thumbs/antigravity-scripts.jpg",
            content: `<img src="assets/images/thumbs/antigravity-scripts.jpg" style="width:100%; height:auto;">`,
            descEn: "A desktop co-writing app for screenwriters: analyzes a user's writing style from uploaded samples and helps draft screenplay scenes and dialogue in a Markdown-based editor with a chat co-writer.",
            descUk: "Десктопний застосунок-співавтор для сценаристів: аналізує стиль письма користувача на основі завантажених прикладів і допомагає писати сцени та діалоги в Markdown-редакторі з чат-асистентом.",
            stack: "AI API, JS, local backend",
            client: "Pet Project"
        }
    ]
};
