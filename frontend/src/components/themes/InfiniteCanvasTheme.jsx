import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "infinite-canvas", "mode": "canvas", "colors": {"bg": "#F3F0E9", "text": "#30302A", "accent": "#9F442D"}, "brand": "IC", "eyebrow": "Personal portfolio / A board of ideas"};
export default function InfiniteCanvasTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
