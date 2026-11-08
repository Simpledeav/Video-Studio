import React from "react";
import { SwissGrid } from "../SwissGrid";
import { CybersecurityDiagram } from "../CybersecurityDiagram";

export const Scene6Transformation: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  return (
    <SwissGrid
      title="THE TRANSFORMATION"
      category="06 / SOFTWARE & SECURITY"
      timeCode="00:56 – 01:09"
      isWide={isWide}
    >
      <CybersecurityDiagram isWide={isWide} />
    </SwissGrid>
  );
};
