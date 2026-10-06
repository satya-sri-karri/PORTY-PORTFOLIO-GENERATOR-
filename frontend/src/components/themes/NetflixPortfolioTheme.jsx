import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "netflix-portfolio", "mode": "carousel", "colors": {"bg": "#171717", "text": "#F5EEEE", "accent": "#FF9B96"}, "brand": "N", "eyebrow": "Personal portfolio / The work behind the story"};
export default function NetflixPortfolioTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
