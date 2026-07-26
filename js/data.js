const portfolioData = {
    experience: [
        { title: "Main Beach Advisors", role: "Video Editor / Partly Motion Designer", date: "2025 - Present", descUk: "Виробництво навчальних відео, монтаж, моушн-графіка.", descEn: "Production of educational videos, editing, and motion graphics." },
        { title: "COI", role: "Graphic Designer (Internship)", date: "2025", descUk: "Бренд-айдентика, типографіка, дизайн.", descEn: "Brand identity, typography, design." },
        { title: "Self-employed", role: "SMM/Copywriter", date: "2021 - 2024", descUk: "Ведення соцмереж, написання текстів.", descEn: "Social media management, copywriting." },
        { title: "LPNU", role: "UI/UX Student", date: "2021 - 2025", descUk: "Навчання основам UI/UX дизайну.", descEn: "Studying UI/UX design fundamentals." }
    ],
    projects: [
        {
            id: 1,
            title: "Documentation_Videos",
            category: "video",
            thumb: "assets/images/profile.jpg", 
            content: `<div class="iframe-container"><iframe src="https://www.youtube.com/embed/ScMzIvxBSi4" allowfullscreen></iframe></div>`,
            descEn: "Produced educational and documentation videos ranging from 2-minute explainers to 20-minute in-depth guides.",
            descUk: "Створення навчальних відео та документації: від 2-хвилинних експлейнерів до 20-хвилинних глибоких гайдів.",
            stack: "Premiere Pro, DaVinci Resolve",
            client: "Main Beach Advisors"
        },
        {
            id: 2,
            title: "Motion_Graphics",
            category: "video",
            thumb: "assets/images/profile.jpg",
            content: `<div class="iframe-container"><iframe src="https://player.vimeo.com/video/1213024891" allowfullscreen></iframe></div>`,
            descEn: "Logo animation and instance animations handled in After Effects.",
            descUk: "Анімація логотипів та елементів інтерфейсу в After Effects.",
            stack: "After Effects",
            client: "Various"
        },
        {
            id: 3,
            title: "UI_UX_Prototyping",
            category: "design",
            thumb: "assets/images/profile.jpg",
            content: `<img src="assets/images/profile.jpg" style="width:100%; height:auto;">`,
            descEn: "Wireframes and prototypes solving real business problems.",
            descUk: "Вайрфрейми та прототипи, що вирішують реальні бізнес-задачі.",
            stack: "Figma",
            client: "LPNU Projects"
        },
        {
            id: 4,
            title: "Telegram_Autopost_Bot",
            category: "code",
            thumb: "assets/images/profile.jpg",
            content: `<img src="assets/images/profile.jpg" style="width:100%; height:auto;">`,
            descEn: "[ Placeholder: Detailed description of the bot functionality. Edit this in data.js ]",
            descUk: "[ Плейсхолдер: Детальний опис функціоналу бота. Відредагуйте це у data.js ]",
            stack: "Python, Aiogram",
            client: "Pet Project"
        },
        {
            id: 5,
            title: "AI_Screenwriting_Assistant",
            category: "code",
            thumb: "assets/images/profile.jpg",
            content: `<img src="assets/images/profile.jpg" style="width:100%; height:auto;">`,
            descEn: "[ Placeholder: Describe how the AI assistant works and its features. Edit this in data.js ]",
            descUk: "[ Плейсхолдер: Опишіть, як працює ШІ-асистент та його фічі. Відредагуйте це у data.js ]",
            stack: "AI API, JS",
            client: "Pet Project"
        }
    ]
};
