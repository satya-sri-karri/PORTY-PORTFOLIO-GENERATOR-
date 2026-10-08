import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "dashboard-portfolio", "mode": "dashboard", "colors": {"bg": "#121B28", "text": "#E7EFF9", "accent": "#97BDF0"}, "brand": "DP", "eyebrow": "Personal portfolio / Work at a glance"};
export default function DashboardPortfolioTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
