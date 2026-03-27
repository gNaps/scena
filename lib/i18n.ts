export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export function getLocalizedValue(
  items: { code: string; value: string }[],
  locale: string
): string {
  return (
    items.find((i) => i.code === locale)?.value ??
    items.find((i) => i.code === defaultLocale)?.value ??
    items[0]?.value ??
    ""
  );
}

export function getLocalizedName(
  items: { code: string; name: string }[],
  locale: string
): string {
  return (
    items.find((i) => i.code === locale)?.name ??
    items.find((i) => i.code === defaultLocale)?.name ??
    items[0]?.name ??
    ""
  );
}

const translations = {
  it: {
    hero: {
      tagline: "La piattaforma per i",
      highlight: "videogiochi italiani",
      sub: "Scopri i videogiochi italiani che ancora non conosci. Una community per sviluppatori, appassionati e curiosi.",
      cta_games: "Esplora giochi",
      cta_studios: "Unisciti come studio",
    },
    quickLinks: [
      { title: "Esplora i giochi", description: "Scopri titoli indipendenti made in Italy, dal puzzle game all'action RPG." },
      { title: "Esplora gli studi", description: "Conosci i team dietro i giochi: storie, visioni e progetti in corso." },
      { title: "Candida il tuo gioco", description: "Hai un gioco italiano? Portalo sulla piattaforma e fatti trovare." },
      { title: "Candida il tuo studio", description: "Crea il profilo del tuo studio e connettiti con la community italiana." },
    ],
    map: { title: "Dove siamo", sub: "Gli studi italiani sulla mappa." },
    stats: {
      title: "Il mercato italiano",
      highlight: "cresce",
      sub: "Numeri reali, storie vere, talento italiano.",
      items: ["Studi registrati", "Giochi pubblicati", "Regioni coperte"],
    },
    games: {
      title: "Giochi",
      subtitle: "Videogiochi italiani indipendenti.",
      search: "Cerca per nome o studio...",
      filter_status: "Stato",
      filter_genre: "Genere",
      filter_studio: "Studio",
      empty: "Nessun gioco trovato.",
      back: "Giochi",
    },
    studios: {
      title: "Studi",
      subtitle: "I team italiani dietro i giochi.",
      search: "Cerca per nome studio...",
      filter_region: "Regione",
      empty: "Nessuno studio trovato.",
      back: "Studi",
    },
    gameDetail: {
      description: "Descrizione",
      genres: "Generi",
      screenshots: "Screenshot",
      videos: "Video",
      platforms: "Piattaforme",
      available: "Disponibile su",
      studio: "Studio",
    },
    studioDetail: {
      about: "Chi siamo",
      games: "Giochi",
      no_games: "Nessun gioco registrato.",
      copied: "Copied!",
    },
  },
  en: {
    hero: {
      tagline: "The platform for",
      highlight: "Italian video games",
      sub: "Discover Italian indie games you didn't know existed. A community for developers, enthusiasts and curious minds.",
      cta_games: "Explore games",
      cta_studios: "Join as a studio",
    },
    quickLinks: [
      { title: "Explore games", description: "Discover indie titles made in Italy, from puzzle games to action RPGs." },
      { title: "Explore studios", description: "Meet the teams behind the games: stories, visions and ongoing projects." },
      { title: "Submit your game", description: "Have an Italian game? Bring it to the platform and get discovered." },
      { title: "Submit your studio", description: "Create your studio profile and connect with the Italian community." },
    ],
    map: { title: "Where we are", sub: "Italian studios on the map." },
    stats: {
      title: "The Italian market",
      highlight: "is growing",
      sub: "Real numbers, real stories, Italian talent.",
      items: ["Registered studios", "Published games", "Regions covered"],
    },
    games: {
      title: "Games",
      subtitle: "Italian independent video games.",
      search: "Search by name or studio...",
      filter_status: "Status",
      filter_genre: "Genre",
      filter_studio: "Studio",
      empty: "No games found.",
      back: "Games",
    },
    studios: {
      title: "Studios",
      subtitle: "The Italian teams behind the games.",
      search: "Search by studio name...",
      filter_region: "Region",
      empty: "No studios found.",
      back: "Studios",
    },
    gameDetail: {
      description: "Description",
      genres: "Genres",
      screenshots: "Screenshots",
      videos: "Videos",
      platforms: "Platforms",
      available: "Available on",
      studio: "Studio",
    },
    studioDetail: {
      about: "About us",
      games: "Games",
      no_games: "No games registered.",
      copied: "Copied!",
    },
  },
} as const;

export function t(locale: string) {
  return translations[locale as Locale] ?? translations[defaultLocale];
}
