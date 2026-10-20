import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "conceptual-sketch", "mode": "sketch", "colors": {"bg": "#F4F0E5", "text": "#34332D", "accent": "#5D6350"}, "brand": "SK", "eyebrow": "Personal portfolio / Notes in progress"};
export default function ConceptualSketchTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
