import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "terminal-os", "mode": "files", "colors": {"bg": "#111816", "text": "#E5F2E7", "accent": "#92D5A3"}, "brand": "OS", "eyebrow": "Personal portfolio / Read the source"};
export default function TerminalOSTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
