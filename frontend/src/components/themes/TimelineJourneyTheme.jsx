import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "timeline-journey", "mode": "journey", "colors": {"bg": "#F5ECE3", "text": "#40352E", "accent": "#8C4B31"}, "brand": "J", "eyebrow": "Personal portfolio / The journey so far"};
export default function TimelineJourneyTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
