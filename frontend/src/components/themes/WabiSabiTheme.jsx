import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "wabi-sabi", "mode": "quiet", "colors": {"bg": "#ECE8DF", "text": "#45453B", "accent": "#6F735B"}, "brand": "W", "eyebrow": "Personal portfolio / Room to breathe"};
export default function WabiSabiTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
