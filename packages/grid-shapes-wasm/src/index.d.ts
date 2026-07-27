export interface GridEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ownerRow: number;
  ownerCol: number;
}

export declare function collectBoundaryEdgesFromGrid(grid: Uint8Array, rows: number, cols: number): GridEdge[];
