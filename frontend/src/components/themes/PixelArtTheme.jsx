import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "pixel-art", "mode": "pixel", "colors": {"bg": "#11182A", "text": "#E5FFF5", "accent": "#7CF6BC"}, "brand": "PX", "eyebrow": "Personal portfolio / A world I am building"};
export default function PixelArtTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
