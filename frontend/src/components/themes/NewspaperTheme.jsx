import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "newspaper", "mode": "print", "colors": {"bg": "#F3EDDE", "text": "#302A24", "accent": "#70533F"}, "brand": "NP", "eyebrow": "The personal edition"};
export default function NewspaperTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
