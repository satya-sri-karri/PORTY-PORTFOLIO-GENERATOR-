import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "scroll-cinema", "mode": "cinema", "colors": {"bg": "#171D26", "text": "#F0ECE1", "accent": "#CDA887"}, "brand": "SC", "eyebrow": "Personal portfolio / A story in motion"};
export default function ScrollCinemaTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
