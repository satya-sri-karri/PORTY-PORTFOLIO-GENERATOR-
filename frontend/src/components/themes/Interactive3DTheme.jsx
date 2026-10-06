import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "interactive-3d", "mode": "desk", "colors": {"bg": "#F0EADF", "text": "#332B42", "accent": "#674B95"}, "brand": "D", "eyebrow": "Personal portfolio / From my desk"};
export default function Interactive3DTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
