import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "space-explorer", "mode": "space", "colors": {"bg": "#0D1428", "text": "#EDF0FD", "accent": "#A8BDF7"}, "brand": "S", "eyebrow": "Personal portfolio / A world of possibilities"};
export default function SpaceExplorerTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
