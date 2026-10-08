import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "blueprint", "mode": "sheets", "colors": {"bg": "#10293C", "text": "#E7F2F6", "accent": "#9DD6F4"}, "brand": "BP", "eyebrow": "Personal portfolio / Working drawings"};
export default function BlueprintTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
