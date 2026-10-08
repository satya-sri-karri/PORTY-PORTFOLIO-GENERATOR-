import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "ai-assistant", "mode": "assistant", "colors": {"bg": "#F4F5F2", "text": "#22322D", "accent": "#28705A"}, "brand": "A", "eyebrow": "An introduction, in my own words"};
export default function AIAssistantTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
