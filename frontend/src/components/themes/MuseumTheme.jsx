import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "museum", "mode": "gallery", "colors": {"bg": "#EEE9DF", "text": "#32302B", "accent": "#755A3C"}, "brand": "Mu", "eyebrow": "Personal portfolio / A collection of work"};
export default function MuseumTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
