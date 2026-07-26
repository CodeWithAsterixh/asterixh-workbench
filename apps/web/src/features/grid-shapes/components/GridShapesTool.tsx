"use client";

import { GridEditor } from "./GridEditor";
import { ShapePreview } from "./ShapePreview";
import { ShapeControls } from "./ShapeControls";
import { useGridShapes } from "../lib/useGridShapes";

export function GridShapesTool() {
  const gs = useGridShapes();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-8 items-start">
      <div className="flex flex-col gap-6 min-w-0">
        <GridEditor
          rows={gs.rows}
          cols={gs.cols}
          filled={gs.filled}
          mode={gs.mode}
          selectedCell={gs.selectedCell}
          cellHasOverride={(key) => gs.cellRadiusOverrides.has(key)}
          onPointerDownCell={gs.handlePointerDownOnCell}
          onPointerEnterCell={gs.handlePointerEnterCell}
          onPointerUp={gs.handlePointerUp}
        />

        <ShapePreview shape={gs.shape} fill={gs.fill} stroke={gs.stroke} strokeWidth={gs.strokeWidth} />
      </div>

      <ShapeControls gs={gs} />
    </div>
  );
}
