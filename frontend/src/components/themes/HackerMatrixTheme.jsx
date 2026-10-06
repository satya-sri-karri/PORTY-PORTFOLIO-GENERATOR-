import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "hacker-matrix", "mode": "matrix", "colors": {"bg": "#0C1710", "text": "#DDF0E0", "accent": "#87DCA0"}, "brand": "HM", "eyebrow": "Personal portfolio / Beyond the code"};
export default function HackerMatrixTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
