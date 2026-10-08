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

const SurrealismTheme = lazy(() => import("../components/themes/SurrealismTheme"));

const PixelArtTheme = lazy(() => import("../components/themes/PixelArtTheme"));

const MaximalismTheme = lazy(() => import("../components/themes/MaximalismTheme"));

const ConceptualSketchTheme = lazy(() => import("../components/themes/ConceptualSketchTheme"));

const BohemianTheme = lazy(() => import("../components/themes/BohemianTheme"));

const VictorianTheme = lazy(() => import("../components/themes/VictorianTheme"));

const WabiSabiTheme = lazy(() => import("../components/themes/WabiSabiTheme"));

const ScrollCinemaTheme = lazy(() => import("../components/themes/ScrollCinemaTheme"));

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
    description: "Frosted surfaces, section navigation and readable depth",
    colors: {"bg": "#EEF0F6", "accent": "#565BA9", "text": "#282A3F"},
    tags: ["Premium", "Glass", "Elegant"],
    component: AppleVisionTheme,
    preview: {
      bg: "#EEF0F6",
      accent: "#565BA9",
    },
  },
  blueprint: {
    id: "blueprint",
    name: "Blueprint",
    persona: "Mechanical / Civil / Architecture",
    description: "Technical drawing sheets with real section destinations and active location",
    colors: {"bg": "#10293C", "accent": "#9DD6F4", "text": "#E7F2F6"},
    tags: ["Technical", "Engineering", "Architecture"],
    component: BlueprintTheme,
    preview: {
      bg: "#10293C",
      accent: "#9DD6F4",
    },
  },
  "cyberpunk-2077": {
    id: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    persona: "AI Engineer / ML Engineer / Robotics",
    description: "Original Cybercore typography, readable project dossiers and static scanlines",
    colors: {"bg": "#141511", "accent": "#E8D85C", "text": "#F5F3DF"},
    tags: ["Cyberpunk", "Neon", "Hacker"],
    component: Cyberpunk2077Theme,
    preview: {
      bg: "#141511",
      accent: "#E8D85C",
    },
  },
  "ai-assistant": {
    id: "ai-assistant",
    name: "AI Assistant",
    persona: "Anyone (viral-friendly)",
    description: "Preset portfolio guide with factual replies, destinations and direct browsing",
    colors: {"bg": "#F4F5F2", "accent": "#28705A", "text": "#22322D"},
    tags: ["Chat", "AI", "Conversational"],
    component: AIAssistantTheme,
    preview: {
      bg: "#F4F5F2",
      accent: "#28705A",
    },
  },
  "interactive-3d": {
    id: "interactive-3d",
    name: "Interactive 3D",
    persona: "3D artist / creative developer",
    description: "Original illustrated desk with linked objects, optional CSS depth and a reading view",
    colors: {"bg": "#F0EADF", "accent": "#674B95", "text": "#332B42"},
    tags: ["3D", "Interactive", "Creative"],
    component: Interactive3DTheme,
    preview: {
      bg: "#F0EADF",
      accent: "#674B95",
    },
  },
  "timeline-journey": {
    id: "timeline-journey",
    name: "Timeline Journey",
    persona: "Student / career changer",
    description: "Career milestones from actual experience and complete chronological content",
    colors: {"bg": "#F5ECE3", "accent": "#8C4B31", "text": "#40352E"},
    tags: ["Timeline", "Student", "Story"],
    component: TimelineJourneyTheme,
    preview: {
      bg: "#F5ECE3",
      accent: "#8C4B31",
    },
  },
  "dashboard-portfolio": {
    id: "dashboard-portfolio",
    name: "Dashboard Portfolio",
    persona: "Developer / PM",
    description: "Actual content counts, modular project evidence and readable widgets",
    colors: {"bg": "#121B28", "accent": "#97BDF0", "text": "#E7EFF9"},
    tags: ["Dashboard", "Widgets", "Data"],
    component: DashboardPortfolioTheme,
    preview: {
      bg: "#121B28",
      accent: "#97BDF0",
    },
  },
  "space-explorer": {
    id: "space-explorer",
    name: "Space Explorer",
    persona: "Dreamer / storyteller",
    description: "Stable constellations, expansive typography and grounded project missions",
    colors: {"bg": "#0D1428", "accent": "#A8BDF7", "text": "#EDF0FD"},
    tags: ["Space", "Visual", "Storytelling"],
    component: SpaceExplorerTheme,
    preview: {
      bg: "#0D1428",
      accent: "#A8BDF7",
    },
  },
  "infinite-canvas": {
    id: "infinite-canvas",
    name: "Infinite Canvas",
    persona: "Designer / creative thinker",
    description: "Oriented project board with direct navigation and a keyboard-friendly reading view",
    colors: {"bg": "#F3F0E9", "accent": "#9F442D", "text": "#30302A"},
    tags: ["Canvas", "Whiteboard", "Creative"],
    component: InfiniteCanvasTheme,
    preview: {
      bg: "#F3F0E9",
      accent: "#9F442D",
    },
  },
  storybook: {
    id: "storybook",
    name: "Storybook",
    persona: "Writer / filmmaker",
    description: "Considered book composition, real chapters and native unfolding project stories",
    colors: {"bg": "#F3ECDF", "accent": "#8A4932", "text": "#3B2D29"},
    tags: ["Story", "Book", "Cinematic"],
    component: StorybookTheme,
    preview: {
      bg: "#F3ECDF",
      accent: "#8A4932",
    },
  },
  "spotify-wrapped": {
    id: "spotify-wrapped",
    name: "Spotify Wrapped",
    persona: "Music lover / social sharer",
    description: "Personal story slides with actual swipe, labelled controls and direct full browsing",
    colors: {"bg": "#152B21", "accent": "#B9DF70", "text": "#F1F7DA"},
    tags: ["Music", "Viral", "Animated"],
    component: SpotifyWrappedTheme,
    preview: {
      bg: "#152B21",
      accent: "#B9DF70",
    },
  },
  "netflix-portfolio": {
    id: "netflix-portfolio",
    name: "Netflix Portfolio",
    persona: "Entertainer / media creator",
    description: "Complete identity and a keyboard-accessible project carousel with real links",
    colors: {"bg": "#171717", "accent": "#FF9B96", "text": "#F5EEEE"},
    tags: ["Entertainment", "Video", "Cards"],
    component: NetflixPortfolioTheme,
    preview: {
      bg: "#171717",
      accent: "#FF9B96",
    },
  },
  "google-maps-portfolio": {
    id: "google-maps-portfolio",
    name: "Google Maps Portfolio",
    persona: "Traveler / global professional",
    description: "Illustrated section map, supplied location and direct content without inferred distances",
    colors: {"bg": "#EAF0E9", "accent": "#386B4E", "text": "#29392F"},
    tags: ["Maps", "Travel", "Journey"],
    component: GoogleMapsPortfolioTheme,
    preview: {
      bg: "#EAF0E9",
      accent: "#386B4E",
    },
  },
  "comic-book": {
    id: "comic-book",
    name: "Comic Book",
    persona: "Illustrator / storyteller",
    description: "Ink panels, legible speech composition and responsive project storytelling",
    colors: {"bg": "#FFF2CF", "accent": "#A52D25", "text": "#28261F"},
    tags: ["Comic", "Illustration", "Playful"],
    component: ComicBookTheme,
    preview: {
      bg: "#FFF2CF",
      accent: "#A52D25",
    },
  },
  "terminal-os": {
    id: "terminal-os",
    name: "Terminal OS",
    persona: "DevOps / sysadmin / Linux enthusiast",
    description: "Working file destinations and complete career, project and credential panes",
    colors: {"bg": "#111816", "accent": "#92D5A3", "text": "#E5F2E7"},
    tags: ["Terminal", "Linux", "DevOps"],
    component: TerminalOSTheme,
    preview: {
      bg: "#111816",
      accent: "#92D5A3",
    },
  },
  newspaper: {
    id: "newspaper",
    name: "Newspaper",
    persona: "Journalist / publisher",
    description: "Stable portfolio edition, print hierarchy and responsive project columns",
    colors: {"bg": "#F3EDDE", "accent": "#70533F", "text": "#302A24"},
    tags: ["Newspaper", "Vintage", "Print"],
    component: NewspaperTheme,
    preview: {
      bg: "#F3EDDE",
      accent: "#70533F",
    },
  },
  museum: {
    id: "museum",
    name: "Museum",
    persona: "Artist / curator",
    description: "Curated exhibits with full captions, image framing and native story details",
    colors: {"bg": "#EEE9DF", "accent": "#755A3C", "text": "#32302B"},
    tags: ["Museum", "Art", "Gallery"],
    component: MuseumTheme,
    preview: {
      bg: "#EEE9DF",
      accent: "#755A3C",
    },
  },
  "hacker-matrix": {
    id: "hacker-matrix",
    name: "Hacker Matrix",
    persona: "Cybersecurity / hacker",
    description: "Readable technical content with optional pausable rain and a static fallback",
    colors: {"bg": "#0C1710", "accent": "#87DCA0", "text": "#DDF0E0"},
    tags: ["Matrix", "Hacker", "Cyber"],
    component: HackerMatrixTheme,
    preview: {
      bg: "#0C1710",
      accent: "#87DCA0",
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

  "surrealism": { id: "surrealism", name: "Surrealism", persona: "Dreamlike / visual creative", description: "Dreamlike original compositions with grounded text and complete project stories", colors: {"bg": "#EAE4F0", "accent": "#76538A", "text": "#33263F"}, tags: ["Surrealism", "Creative"], component: SurrealismTheme, preview: {"bg": "#EAE4F0", "accent": "#76538A"} },

  "pixel-art": { id: "pixel-art", name: "Pixel Art", persona: "Game maker / playful creator", description: "A green pixel world with stepped weather, a playable explorer and real project paths", colors: {"bg": "#EBF0DD", "accent": "#486B35", "text": "#293929"}, palettes: [{name:"Night world",bg:"#11182A",accent:"#7CF6BC",text:"#E5FFF5"}], tags: ["Pixel Art", "Creative", "Interactive"], component: PixelArtTheme, preview: {"bg": "#EBF0DD", "accent": "#486B35"} },

  "maximalism": { id: "maximalism", name: "Maximalism", persona: "Expressive / eclectic creator", description: "Layered type, patterns and vivid project frames with a deliberate reading order", colors: {"bg": "#F8EED8", "accent": "#913F64", "text": "#352735"}, tags: ["Maximalism", "Creative"], component: MaximalismTheme, preview: {"bg": "#F8EED8", "accent": "#913F64"} },

  "conceptual-sketch": { id: "conceptual-sketch", name: "Conceptual Sketch", persona: "Designer / process thinker", description: "Sketchbook rules, pencil-like annotations and genuine process stories", colors: {"bg": "#F4F0E5", "accent": "#5D6350", "text": "#34332D"}, tags: ["Conceptual Sketch", "Creative"], component: ConceptualSketchTheme, preview: {"bg": "#F4F0E5", "accent": "#5D6350"} },

  "bohemian": { id: "bohemian", name: "Bohemian", persona: "Warm / handmade creator", description: "Textile-inspired borders, warm portrait framing and tactile project sheets", colors: {"bg": "#EEE3D1", "accent": "#875535", "text": "#49382B"}, tags: ["Bohemian", "Creative"], component: BohemianTheme, preview: {"bg": "#EEE3D1", "accent": "#875535"} },

  "victorian": { id: "victorian", name: "Victorian", persona: "Ornamental / editorial creator", description: "Original engraved-style frames, refined type and restrained project reveals", colors: {"bg": "#241C2B", "accent": "#D7BB84", "text": "#F0E5CE"}, tags: ["Victorian", "Creative"], component: VictorianTheme, preview: {"bg": "#241C2B", "accent": "#D7BB84"} },

  "wabi-sabi": { id: "wabi-sabi", name: "Wabi-sabi", persona: "Quiet / thoughtful creator", description: "Muted asymmetry, generous breathing room and tactile minimal project composition", colors: {"bg": "#ECE8DF", "accent": "#6F735B", "text": "#45453B"}, tags: ["Wabi-sabi", "Creative"], component: WabiSabiTheme, preview: {"bg": "#ECE8DF", "accent": "#6F735B"} },

  "scroll-cinema": { id: "scroll-cinema", name: "Scroll Cinema", persona: "Cinematic / narrative creator", description: "Continuous introduction, work and journey scenes with direct chapter navigation", colors: {"bg": "#171D26", "accent": "#CDA887", "text": "#F0ECE1"}, tags: ["Scroll Cinema", "Creative"], component: ScrollCinemaTheme, preview: {"bg": "#171D26", "accent": "#CDA887"} },

};

export const THEME_GROUPS = {
  "All": Object.keys(THEME_REGISTRY),
  "Minimal": ["wabi-sabi", "minimalist", "organic", "product-showcase"],
  "Bold": ["maximalism", "pixel-art", "brutalist", "kinetic", "retro-wave", "cyberpunk-2077", "comic-book", "y2k-aesthetic"],
  "Creative": ["surrealism", "pixel-art", "maximalism", "conceptual-sketch", "bohemian", "victorian", "scroll-cinema", "aurora", "editorial", "dark-luxe", "interactive-3d", "space-explorer", "infinite-canvas", "storybook", "scrapbook", "y2k-aesthetic"],
  "Professional": ["executive", "neumorphic", "bento", "apple-vision", "blueprint", "dashboard-portfolio", "product-showcase"],
  "Developer": ["neon-terminal", "terminal-os", "hacker-matrix", "ai-assistant", "timeline-journey"],
  "Social": ["spotify-wrapped", "netflix-portfolio", "google-maps-portfolio", "newspaper", "museum"],
};

export const getTheme = (id) => Object.prototype.hasOwnProperty.call(THEME_REGISTRY, id) ? THEME_REGISTRY[id] : THEME_REGISTRY["minimalist"];
export const getAllThemes = () => Object.values(THEME_REGISTRY);
export default THEME_REGISTRY;
