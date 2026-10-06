import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "victorian", "mode": "victorian", "colors": {"bg": "#241C2B", "text": "#F0E5CE", "accent": "#D7BB84"}, "brand": "V", "eyebrow": "A personal collection"};
export default function VictorianTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
