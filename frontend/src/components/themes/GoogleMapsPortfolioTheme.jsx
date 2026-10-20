import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "google-maps-portfolio", "mode": "map", "colors": {"bg": "#EAF0E9", "text": "#29392F", "accent": "#386B4E"}, "brand": "M", "eyebrow": "Personal portfolio / Find your way around"};
export default function GoogleMapsPortfolioTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
