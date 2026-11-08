import React from "react";
import { SwissGrid } from "../SwissGrid";
import { MarketShareChart } from "../MarketShareChart";

export const Scene5Numbers: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  return (
    <SwissGrid
      title="THE NUMBERS"
      category="05 / DATA ANALYSIS (2009–2016)"
      timeCode="00:43 – 00:56"
      isWide={isWide}
    >
      <MarketShareChart isWide={isWide} />
    </SwissGrid>
  );
};
