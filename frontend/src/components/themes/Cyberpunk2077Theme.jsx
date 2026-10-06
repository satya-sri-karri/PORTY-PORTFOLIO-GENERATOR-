import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "cyberpunk-2077", "mode": "cyber", "colors": {"bg": "#141511", "text": "#F5F3DF", "accent": "#E8D85C"}, "brand": "CP", "eyebrow": "Personal portfolio / Signal and substance"};
export default function Cyberpunk2077Theme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
