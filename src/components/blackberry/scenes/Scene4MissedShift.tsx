import React from "react";
import { SwissGrid } from "../SwissGrid";
import { EcosystemDiagram } from "../EcosystemDiagram";

export const Scene4MissedShift: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  return (
    <SwissGrid
      title="THE MISSED SHIFT"
      category="04 / ECOSYSTEM COMPETITION"
      timeCode="00:31 – 00:43"
      isWide={isWide}
    >
      <EcosystemDiagram isWide={isWide} />
    </SwissGrid>
  );
};
