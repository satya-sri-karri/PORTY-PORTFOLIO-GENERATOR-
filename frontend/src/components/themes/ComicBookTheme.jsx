import React from "react";
import ExtendedPortfolio from "./common/ExtendedPortfolio";
const config = {"id": "comic-book", "mode": "comic", "colors": {"bg": "#FFF2CF", "text": "#28261F", "accent": "#A52D25"}, "brand": "CB", "eyebrow": "Personal portfolio / Meet the maker"};
export default function ComicBookTheme({ data }) { return <ExtendedPortfolio data={data} config={config} />; }
