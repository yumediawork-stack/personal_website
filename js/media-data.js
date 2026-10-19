// Centralized media data. All unconfirmed metrics are null (0 only for a confirmed zero).
// Fill in profileUrl / handle / followers / measuredAt with real, user-confirmed values.
const mediaPlatforms = [
    {
        platform: "Instagram",
        handle: "@elyukyur_digital",
        profileUrl: "https://www.instagram.com/elyukyur_digital/",
        followers: 5,
        measuredAt: "2026-10-19",
        descEn: "Visual notes of the process and short announcements of new works.",
        descUk: "Візуальні нотатки процесу та короткі анонси нових робіт."
    },
    {
        platform: "Threads",
        handle: "@elyukyur_digital",
        profileUrl: "https://www.threads.com/@elyukyur_digital",
        followers: 2,
        measuredAt: "2026-10-19",
        descEn: "Short texts about creativity, technology and current experiments.",
        descUk: "Короткі тексти про творчість, технології та поточні експерименти."
    },
    {
        platform: "YouTube",
        handle: "@Elyuk_digital",
        profileUrl: "https://www.youtube.com/@Elyuk_digital",
        followers: 5,
        measuredAt: "2026-10-19",
        descEn: "Videos about how ideas turn into working projects.",
        descUk: "Відео про те, як ідеї перетворюються на працюючі проєкти."
    }
];

// Editorial materials. Published pieces get real title / platform / status / url records.
const mediaMaterials = [
    {
        id: "media-site-video",
        placeholder: "media_001",
        titleEn: "From an idea to a personal website",
        titleUk: "Від ідеї до власного сайту",
        descEn: "A planned editorial piece about my personal experience of turning an idea into my own website, when AI helps cover part of the skills needed.",
        descUk: "Запланований авторський матеріал про особистий досвід реалізації задуму — власного сайту, коли частину необхідних навичок допомагає надолужити ШІ.",
        ideaEn: "Think Different \u2192 Be Different \u2014 the author's idea behind this piece.",
        ideaUk: "Think Different \u2192 Be Different \u2014 авторська ідея цього матеріалу.",
        platform: null,
        status: "planned",
        url: null
    }
];

// expose for centralized access / tests
window.mediaPlatforms = mediaPlatforms;
window.mediaMaterials = mediaMaterials;
