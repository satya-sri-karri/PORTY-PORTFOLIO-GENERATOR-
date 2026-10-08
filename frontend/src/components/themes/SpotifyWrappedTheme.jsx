import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "spotify-wrapped", "mode": "slides", "colors": {"bg": "#152B21", "text": "#F1F7DA", "accent": "#B9DF70"}, "brand": "W", "eyebrow": "Personal portfolio / My work, on repeat"};
export default function SpotifyWrappedTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
