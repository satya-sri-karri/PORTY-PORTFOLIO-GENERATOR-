import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "pixel-art", "mode": "pixel", "colors": {"bg": "#EBF0DD", "text": "#293929", "accent": "#486B35"}, "brand": "PX", "eyebrow": "Personal portfolio / A world I am building"};
export default function PixelArtTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
