import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "storybook", "mode": "chapters", "colors": {"bg": "#F3ECDF", "text": "#3B2D29", "accent": "#8A4932"}, "brand": "SB", "eyebrow": "Personal portfolio / Every chapter matters"};
export default function StorybookTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
