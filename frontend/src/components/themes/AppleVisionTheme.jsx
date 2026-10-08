import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "apple-vision", "mode": "sheets", "colors": {"bg": "#EEF0F6", "text": "#282A3F", "accent": "#565BA9"}, "brand": "AV", "eyebrow": "A little space for my work"};
export default function AppleVisionTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
