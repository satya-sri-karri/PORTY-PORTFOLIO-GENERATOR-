import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "bohemian", "mode": "bohemian", "colors": {"bg": "#EEE3D1", "text": "#49382B", "accent": "#875535"}, "brand": "Bo", "eyebrow": "Personal portfolio / Made with intention"};
export default function BohemianTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
