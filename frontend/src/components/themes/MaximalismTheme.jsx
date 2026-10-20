import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "maximalism", "mode": "maximal", "colors": {"bg": "#F8EED8", "text": "#352735", "accent": "#913F64"}, "brand": "MX", "eyebrow": "Personal portfolio / More to the story"};
export default function MaximalismTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
