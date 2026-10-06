import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "surrealism", "mode": "surreal", "colors": {"bg": "#EAE4F0", "text": "#33263F", "accent": "#76538A"}, "brand": "S", "eyebrow": "A different way of seeing"};
export default function SurrealismTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
