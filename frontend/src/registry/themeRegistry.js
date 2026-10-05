import { lazy } from "react";
/**
 * Theme Registry
 * Maps theme ID → { component, config, preview }
 * Every theme consumes the same `data` prop — pluggable architecture
 */

const AuroraTheme = lazy(() => import("../components/themes/AuroraTheme"));
const MinimalistTheme = lazy(() => import("../components/themes/MinimalistTheme"));
const EditorialTheme = lazy(() => import("../components/themes/EditorialTheme"));
const NeonTerminalTheme = lazy(() => import("../components/themes/NeonTerminalTheme"));
const BrutalistTheme = lazy(() => import("../components/themes/BrutalistTheme"));
const NeumorphicTheme = lazy(() => import("../components/themes/NeumorphicTheme"));
const KineticTheme = lazy(() => import("../components/themes/KineticTheme"));
const ExecutiveTheme = lazy(() => import("../components/themes/ExecutiveTheme"));
const RetroWaveTheme = lazy(() => import("../components/themes/RetroWaveTheme"));
const OrganicTheme = lazy(() => import("../components/themes/OrganicTheme"));
const BentoTheme = lazy(() => import("../components/themes/BentoTheme"));
const DarkLuxeTheme = lazy(() => import("../components/themes/DarkLuxeTheme"));
const AppleVisionTheme = lazy(() => import("../components/themes/AppleVisionTheme"));
const BlueprintTheme = lazy(() => import("../components/themes/BlueprintTheme"));
const Cyberpunk2077Theme = lazy(() => import("../components/themes/Cyberpunk2077Theme"));
const AIAssistantTheme = lazy(() => import("../components/themes/AIAssistantTheme"));
const Interactive3DTheme = lazy(() => import("../components/themes/Interactive3DTheme"));
const TimelineJourneyTheme = lazy(() => import("../components/themes/TimelineJourneyTheme"));
const DashboardPortfolioTheme = lazy(() => import("../components/themes/DashboardPortfolioTheme"));
const SpaceExplorerTheme = lazy(() => import("../components/themes/SpaceExplorerTheme"));
const InfiniteCanvasTheme = lazy(() => import("../components/themes/InfiniteCanvasTheme"));
const StorybookTheme = lazy(() => import("../components/themes/StorybookTheme"));
const SpotifyWrappedTheme = lazy(() => import("../components/themes/SpotifyWrappedTheme"));
const NetflixPortfolioTheme = lazy(() => import("../components/themes/NetflixPortfolioTheme"));
const GoogleMapsPortfolioTheme = lazy(() => import("../components/themes/GoogleMapsPortfolioTheme"));
const ComicBookTheme = lazy(() => import("../components/themes/ComicBookTheme"));
const TerminalOSTheme = lazy(() => import("../components/themes/TerminalOSTheme"));
const NewspaperTheme = lazy(() => import("../components/themes/NewspaperTheme"));
const MuseumTheme = lazy(() => import("../components/themes/MuseumTheme"));
const HackerMatrixTheme = lazy(() => import("../components/themes/HackerMatrixTheme"));

const ScrapbookTheme = lazy(() => import("../components/themes/ScrapbookTheme"));
const Y2KAestheticTheme = lazy(() => import("../components/themes/Y2KAestheticTheme"));
const ProductShowcaseTheme = lazy(() => import("../components/themes/ProductShowcaseTheme"));

const THEME_REGISTRY = {
  aurora: {
    id: "aurora",
    name: "Aurora",
    persona: "Ethereal / creative generalist",
    description: "Luminous atmosphere, delicate serif type, complete project stories and pausable motion",
    colors: { bg: "#101525", accent: "#C1B0F0", text: "#EDF0FA" },
    tags: ["Ethereal", "Creative", "Visual", "Artistic"],
    component: AuroraTheme,
    preview: {
      bg: "#101525",
      accent: "#C1B0F0",
    },
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    persona: "Swiss Design / precise typography",
    description: "Swiss typographic grids, confident hierarchy, purposeful rules and responsive project layouts",
    colors: { bg: "#F7F6F2", accent: "#B33B28", text: "#20211F" },
    tags: ["Swiss Design", "Clean", "Professional", "Focused"],
    component: MinimalistTheme,
    preview: {
      bg: "#F7F6F2",
      accent: "#B33B28",
    },
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    persona: "Designer / writer",
    description: "Magazine cover, asymmetric lead story, complete project index and grounded case studies",
    colors: { bg: "#F5F0E8", accent: "#A13825", text: "#25211E" },
    tags: ["Design", "Editorial", "Print"],
    component: EditorialTheme,
    preview: {
      bg: "#F5F0E8",
      accent: "#A13825",
    },
  },
  "neon-terminal": {
    id: "neon-terminal",
    name: "Neon Terminal",
    persona: "Developer / hacker",
    description: "Readable code-editor workspace, functional file navigation and card/compact project views",
    colors: { bg: "#101518", accent: "#70ECAB", text: "#E0E9E4" },
    tags: ["Developer", "Terminal", "Hacker"],
    component: NeonTerminalTheme,
    preview: {
      bg: "#101518",
      accent: "#70ECAB",
    },
  },
  brutalist: {
    id: "brutalist",
    name: "Brutalist",
    persona: "Bold creative / artist",
    description: "Oversized ink typography, outlines, hard shadows and curated Neo-brutalist palettes",
    colors: { bg: "#F5F5F0", accent: "#C53924", text: "#191916" },
    tags: ["Neo-brutalism", "Bold", "Creative", "Provocative"],
    palettes: [
      { name: "Raw red", bg: "#F5F5F0", text: "#191916", accent: "#C53924" },
      { name: "Neo-brutalism", bg: "#F7DE4F", text: "#191916", accent: "#5B2C8E" },
      { name: "Neo lilac", bg: "#DED5F1", text: "#231C2E", accent: "#9B2F28" },
    ],
    component: BrutalistTheme,
    preview: {
      bg: "#F5F5F0",
      accent: "#C53924",
    },
  },
  neumorphic: {
    id: "neumorphic",
    name: "Neumorphic",
    persona: "Product / UI designer",
    description: "Palette-aware embossed surfaces, readable contrast and tactile project cards",
    colors: { bg: "#E8ECED", accent: "#4659A8", text: "#263339" },
    tags: ["Design", "Soft UI", "Tactile"],
    component: NeumorphicTheme,
    preview: {
      bg: "#E8ECED",
      accent: "#4659A8",
    },
  },
  kinetic: {
    id: "kinetic",
    name: "Kinetic",
    persona: "Motion designer / frontend",
    description: "Expressive Signature Studio typography, framed imagery and working gallery/index project views",
    colors: { bg: "#F3EDE3", accent: "#AD3820", text: "#24221E" },
    tags: ["Motion", "Energy", "Frontend"],
    palettes: [{ name: "Electric studio", bg: "#171717", text: "#FAF6EB", accent: "#FFE500" }],
    component: KineticTheme,
    preview: {
      bg: "#F3EDE3",
      accent: "#AD3820",
    },
  },
  executive: {
    id: "executive",
    name: "Executive",
    persona: "Consultant / business",
    description: "Considered business typography, complete project evidence and a responsive career ledger",
    colors: { bg: "#F5F3EE", accent: "#795A28", text: "#192D3E" },
    tags: ["Business", "Formal", "Professional"],
    palettes: [{ name: "Navy dossier", bg: "#122335", text: "#F2F0E8", accent: "#D4B16F" }],
    component: ExecutiveTheme,
    preview: {
      bg: "#F5F3EE",
      accent: "#795A28",
    },
  },
  "retro-wave": {
    id: "retro-wave",
    name: "Retro Wave",
    persona: "Game dev / creative coder",
    description: "Synthwave horizon, static perspective grid, readable liner notes and complete project stories",
    colors: { bg: "#140D25", accent: "#FF93CF", text: "#F8ECFA" },
    tags: ["Retro", "Gaming", "80s"],
    palettes: [{ name: "Night drive", bg: "#140D25", text: "#F8ECFA", accent: "#FF93CF" }, { name: "Daybreak", bg: "#F8EDF5", text: "#351B3F", accent: "#9E275F" }],
    component: RetroWaveTheme,
    preview: {
      bg: "#140D25",
      accent: "#FF93CF",
    },
  },
  organic: {
    id: "organic",
    name: "Organic",
    persona: "Photographer / wellness",
    description: "Natural paper texture, expressive portrait framing and image-led responsive projects",
    colors: { bg: "#F1EEE4", accent: "#526342", text: "#303D2F" },
    tags: ["Nature", "Wellness", "Photography"],
    palettes: [{ name: "Forest", bg: "#202E24", text: "#EDF0E3", accent: "#B5C69C" }],
    component: OrganicTheme,
    preview: {
      bg: "#F1EEE4",
      accent: "#526342",
    },
  },
  bento: {
    id: "bento",
    name: "Bento Grid",
    persona: "Modern SaaS / startup dev",
    description: "Content-sized modular tiles, every optional section and an accessible View all project collection",
    colors: { bg: "#F0F2F5", accent: "#315DD2", text: "#202D3B" },
    tags: ["Modern", "SaaS", "Startup"],
    palettes: [{ name: "Blue hour", bg: "#161E2C", text: "#EEF2FB", accent: "#98B9FF" }],
    component: BentoTheme,
    preview: {
      bg: "#F0F2F5",
      accent: "#315DD2",
    },
  },
  "dark-luxe": {
    id: "dark-luxe",
    name: "Dark Luxe",
    persona: "Luxury typography / editorial",
    description: "Warm dark surfaces, luxurious serif typography, substantial project imagery and complete credentials",
    colors: { bg: "#141612", accent: "#DBC39A", text: "#F4EFDF" },
    tags: ["Luxury Typography", "Editorial", "Elegant", "Dark"],
    component: DarkLuxeTheme,
    preview: {
      bg: "#080808",
      accent: "#C9A84C",
    },
  },
  "apple-vision": {
    id: "apple-vision",
    name: "Apple Vision",
    persona: "Product Engineer / Apple Enthusiast",
    description: "Frosted glass, floating cards, blur, huge rounded corners",
    colors: { bg: "#0A0A0A", accent: "#E07A9E", text: "#FFFFFF" },
    tags: ["Premium", "Glass", "Elegant"],
    component: AppleVisionTheme,
    preview: {
      bg: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 100%)",
      accent: "#E07A9E",
    },
  },
  blueprint: {
    id: "blueprint",
    name: "Blueprint",
    persona: "Mechanical / Civil / Architecture",
    description: "Engineering blueprints, grid overlays, wireframe lines",
    colors: { bg: "#0A1628", accent: "#4FC3F7", text: "#E3F2FD" },
    tags: ["Technical", "Engineering", "Architecture"],
    component: BlueprintTheme,
    preview: {
      bg: "#0A1628",
      accent: "#4FC3F7",
    },
  },
  "cyberpunk-2077": {
    id: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    persona: "AI Engineer / ML Engineer / Robotics",
    description: "Yellow + black, neon, HUD, scanlines, glitch effects",
    colors: { bg: "#0A0A0A", accent: "#FFD700", text: "#FFFFFF" },
    tags: ["Cyberpunk", "Neon", "Hacker"],
    component: Cyberpunk2077Theme,
    preview: {
      bg: "linear-gradient(135deg, #0A0A0A 0%, #1A0A00 100%)",
      accent: "#FFD700",
    },
  },
  "ai-assistant": {
    id: "ai-assistant",
    name: "AI Assistant",
    persona: "Anyone (viral-friendly)",
    description: "ChatGPT-style chat interface, conversational bubbles",
    colors: { bg: "#131314", accent: "#10A37F", text: "#ECECF1" },
    tags: ["Chat", "AI", "Conversational"],
    component: AIAssistantTheme,
    preview: {
      bg: "#131314",
      accent: "#10A37F",
    },
  },
  "interactive-3d": {
    id: "interactive-3d",
    name: "Interactive 3D",
    persona: "3D artist / creative developer",
    description: "Spline/Three.js inspired, floating cards, CSS 3D transforms",
    colors: { bg: "#0A0A0F", accent: "#6C5CE7", text: "#DFE6E9" },
    tags: ["3D", "Interactive", "Creative"],
    component: Interactive3DTheme,
    preview: {
      bg: "linear-gradient(135deg, #0A0A0F 0%, #1A0A2E 100%)",
      accent: "#6C5CE7",
    },
  },
  "timeline-journey": {
    id: "timeline-journey",
    name: "Timeline Journey",
    persona: "Student / career changer",
    description: "Vertical timeline with year markers, scrolly design",
    colors: { bg: "#0F0F1A", accent: "#6366F1", text: "#E8E8F0" },
    tags: ["Timeline", "Student", "Story"],
    component: TimelineJourneyTheme,
    preview: {
      bg: "linear-gradient(180deg, #0F0F1A 0%, #1A0F2E 100%)",
      accent: "#6366F1",
    },
  },
  "dashboard-portfolio": {
    id: "dashboard-portfolio",
    name: "Dashboard Portfolio",
    persona: "Developer / PM",
    description: "GitHub/Linear/Notion style, widgets, stats, data",
    colors: { bg: "#0D1117", accent: "#58A6FF", text: "#C9D1D9" },
    tags: ["Dashboard", "Widgets", "Data"],
    component: DashboardPortfolioTheme,
    preview: {
      bg: "#0D1117",
      accent: "#58A6FF",
    },
  },
  "space-explorer": {
    id: "space-explorer",
    name: "Space Explorer",
    persona: "Dreamer / storyteller",
    description: "Stars, constellations, planets as skills, galaxies as projects",
    colors: { bg: "#05050A", accent: "#7C3AED", text: "#E8E8FF" },
    tags: ["Space", "Visual", "Storytelling"],
    component: SpaceExplorerTheme,
    preview: {
      bg: "#05050A",
      accent: "#7C3AED",
    },
  },
  "infinite-canvas": {
    id: "infinite-canvas",
    name: "Infinite Canvas",
    persona: "Designer / creative thinker",
    description: "Figma/Miro whiteboard style, freely placed rotated notes",
    colors: { bg: "#F0F0F0", accent: "#FF6B6B", text: "#1A1A1A" },
    tags: ["Canvas", "Whiteboard", "Creative"],
    component: InfiniteCanvasTheme,
    preview: {
      bg: "#F0F0F0",
      accent: "#FF6B6B",
    },
  },
  storybook: {
    id: "storybook",
    name: "Storybook",
    persona: "Writer / filmmaker",
    description: "Book aesthetic, page turning, illustrated sections",
    colors: { bg: "#1A1423", accent: "#E8A87C", text: "#F5F0E8" },
    tags: ["Story", "Book", "Cinematic"],
    component: StorybookTheme,
    preview: {
      bg: "linear-gradient(135deg, #1A1423 0%, #2A1A3E 100%)",
      accent: "#E8A87C",
    },
  },
  "spotify-wrapped": {
    id: "spotify-wrapped",
    name: "Spotify Wrapped",
    persona: "Music lover / social sharer",
    description: "Dark + green, animated slides, music-inspired cards",
    colors: { bg: "#121212", accent: "#1DB954", text: "#FFFFFF" },
    tags: ["Music", "Viral", "Animated"],
    component: SpotifyWrappedTheme,
    preview: {
      bg: "#121212",
      accent: "#1DB954",
    },
  },
  "netflix-portfolio": {
    id: "netflix-portfolio",
    name: "Netflix Portfolio",
    persona: "Entertainer / media creator",
    description: "Netflix-style browsing, movie cards, hover scale, rows",
    colors: { bg: "#141414", accent: "#E50914", text: "#FFFFFF" },
    tags: ["Entertainment", "Video", "Cards"],
    component: NetflixPortfolioTheme,
    preview: {
      bg: "#141414",
      accent: "#E50914",
    },
  },
  "google-maps-portfolio": {
    id: "google-maps-portfolio",
    name: "Google Maps Portfolio",
    persona: "Traveler / global professional",
    description: "Google Maps inspired, projects pinned as map locations",
    colors: { bg: "#1A2332", accent: "#EA4335", text: "#E8EAED" },
    tags: ["Maps", "Travel", "Journey"],
    component: GoogleMapsPortfolioTheme,
    preview: {
      bg: "#1A2332",
      accent: "#EA4335",
    },
  },
  "comic-book": {
    id: "comic-book",
    name: "Comic Book",
    persona: "Illustrator / storyteller",
    description: "Comic panels, speech bubbles, halftone dots, onomatopoeia",
    colors: { bg: "#FFF8E7", accent: "#FF3333", text: "#1A1A1A" },
    tags: ["Comic", "Illustration", "Playful"],
    component: ComicBookTheme,
    preview: {
      bg: "#FFF8E7",
      accent: "#FF3333",
    },
  },
  "terminal-os": {
    id: "terminal-os",
    name: "Terminal OS",
    persona: "DevOps / sysadmin / Linux enthusiast",
    description: "Linux terminal, split panes, file explorer, interactive shell",
    colors: { bg: "#0C0C0C", accent: "#00FF41", text: "#00FF41" },
    tags: ["Terminal", "Linux", "DevOps"],
    component: TerminalOSTheme,
    preview: {
      bg: "#0C0C0C",
      accent: "#00FF41",
    },
  },
  newspaper: {
    id: "newspaper",
    name: "Newspaper",
    persona: "Journalist / publisher",
    description: "Vintage newspaper, columns, serif, masthead, BREAKING",
    colors: { bg: "#F5F0E0", accent: "#1A1A1A", text: "#1A1A1A" },
    tags: ["Newspaper", "Vintage", "Print"],
    component: NewspaperTheme,
    preview: {
      bg: "#F5F0E0",
      accent: "#1A1A1A",
    },
  },
  museum: {
    id: "museum",
    name: "Museum",
    persona: "Artist / curator",
    description: "Art gallery, projects in frames, gallery walk, spotlights",
    colors: { bg: "#1A1A1A", accent: "#C9A84C", text: "#FFF8E7" },
    tags: ["Museum", "Art", "Gallery"],
    component: MuseumTheme,
    preview: {
      bg: "linear-gradient(135deg, #1A1A1A 0%, #2A1A1A 100%)",
      accent: "#C9A84C",
    },
  },
  "hacker-matrix": {
    id: "hacker-matrix",
    name: "Hacker Matrix",
    persona: "Cybersecurity / hacker",
    description: "Matrix rain, green on black, nodes, network graph, glitch",
    colors: { bg: "#000000", accent: "#00FF41", text: "#00FF41" },
    tags: ["Matrix", "Hacker", "Cyber"],
    component: HackerMatrixTheme,
    preview: {
      bg: "#000000",
      accent: "#00FF41",
    },
  },
  scrapbook: {
    id: "scrapbook",
    name: "Scrapbook",
    persona: "Personal storytelling / creative",
    description: "Textured paper, photo mounts, handwritten details and unfolding project stories",
    colors: { bg: "#EEE7DA", accent: "#7A3D2C", text: "#302B27" },
    tags: ["Personal", "Creative", "Paper", "Warm"],
    component: ScrapbookTheme,
    preview: { bg: "#EEE7DA", accent: "#7A3D2C" },
  },
  "y2k-aesthetic": {
    id: "y2k-aesthetic",
    name: "Y2K Aesthetic",
    persona: "Digital creative / playful",
    description: "Chrome lettering, translucent browser windows, soft iridescence and tactile controls",
    colors: { bg: "#E9EDF8", accent: "#464396", text: "#22283E" },
    tags: ["Y2K", "Chrome", "Playful", "Digital"],
    component: Y2KAestheticTheme,
    preview: { bg: "linear-gradient(135deg, #E9EDF8, #DDD9EE)", accent: "#464396" },
  },
  "product-showcase": {
    id: "product-showcase",
    name: "Product Showcase",
    persona: "Product designer / builder",
    description: "Actual screenshots in device frames and clear case studies using your real project evidence",
    colors: { bg: "#F4F5F0", accent: "#315E46", text: "#202A27" },
    tags: ["Product", "Case Study", "Professional", "Clean"],
    component: ProductShowcaseTheme,
    preview: { bg: "#F4F5F0", accent: "#315E46" },
  },

};

export const THEME_GROUPS = {
  "All": [
    "aurora", "minimalist", "editorial", "neon-terminal", "brutalist",
    "neumorphic", "kinetic", "executive", "retro-wave", "organic", "bento",
    "dark-luxe", "apple-vision", "blueprint", "cyberpunk-2077", "ai-assistant",
    "interactive-3d", "timeline-journey", "dashboard-portfolio", "space-explorer",
    "infinite-canvas", "storybook", "spotify-wrapped", "netflix-portfolio",
    "google-maps-portfolio", "comic-book", "terminal-os", "newspaper",
    "museum", "hacker-matrix", "scrapbook", "y2k-aesthetic", "product-showcase"
  ],
  "Minimal": ["minimalist", "organic", "product-showcase"],
  "Bold": ["brutalist", "kinetic", "retro-wave", "cyberpunk-2077", "comic-book", "y2k-aesthetic"],
  "Creative": ["aurora", "editorial", "dark-luxe", "interactive-3d", "space-explorer", "infinite-canvas", "storybook", "scrapbook", "y2k-aesthetic"],
  "Professional": ["executive", "neumorphic", "bento", "apple-vision", "blueprint", "dashboard-portfolio", "product-showcase"],
  "Developer": ["neon-terminal", "terminal-os", "hacker-matrix", "ai-assistant", "timeline-journey"],
  "Social": ["spotify-wrapped", "netflix-portfolio", "google-maps-portfolio", "newspaper", "museum"],
};

export const getTheme = (id) => Object.prototype.hasOwnProperty.call(THEME_REGISTRY, id) ? THEME_REGISTRY[id] : THEME_REGISTRY["minimalist"];
export const getAllThemes = () => Object.values(THEME_REGISTRY);
export default THEME_REGISTRY;
