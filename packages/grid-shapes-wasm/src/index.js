import { wasmBytes } from "./module-bytes.js";

const PAGE_SIZE = 65536;
const EDGE_BYTES = 24;
const MAX_MEMORY_PAGES = 512;

const memory = typeof WebAssembly === "undefined" ? null : new WebAssembly.Memory({ initial: 64, maximum: MAX_MEMORY_PAGES });

let wasmInstance = null;

function align4(value) {
  return (value + 3) & ~3;
}

function ensureMemory(requiredBytes) {
  if (!memory) return false;
  const current = memory.buffer.byteLength;
  if (current >= requiredBytes) return true;
  const missingPages = Math.ceil((requiredBytes - current) / PAGE_SIZE);
  memory.grow(missingPages);
  return true;
}

function initWasm() {
  if (!memory || wasmInstance || wasmBytes.length === 0) return wasmInstance;
  try {
    const module = new WebAssembly.Module(wasmBytes);
    wasmInstance = new WebAssembly.Instance(module, { env: { memory } });
  } catch {
    wasmInstance = null;
  }
  return wasmInstance;
}

function collectBoundaryEdgesFallback(grid, rows, cols) {
  const edges = [];

  const emit = (x1, y1, x2, y2, ownerRow, ownerCol) => {
    edges.push({ x1, y1, x2, y2, ownerRow, ownerCol });
  };

  for (let row = 0; row < rows; row++) {
    const rowBase = row * cols;
    for (let col = 0; col < cols; col++) {
      const idx = rowBase + col;
      if (!grid[idx]) continue;

      if (row === 0 || !grid[idx - cols]) emit(col, row, col + 1, row, row, col);
      if (col === cols - 1 || !grid[idx + 1]) emit(col + 1, row, col + 1, row + 1, row, col);
      if (row === rows - 1 || !grid[idx + cols]) emit(col + 1, row + 1, col, row + 1, row, col);
      if (col === 0 || !grid[idx - 1]) emit(col, row + 1, col, row, row, col);
    }
  }

  return edges;
}

export function collectBoundaryEdgesFromGrid(grid, rows, cols) {
  const instance = initWasm();
  if (!instance || !memory) {
    return collectBoundaryEdgesFallback(grid, rows, cols);
  }

  const gridBytes = grid.byteLength;
  const edgeCapacity = rows * cols * 4;
  const outBytes = edgeCapacity * EDGE_BYTES;
  const outPtr = align4(gridBytes + 16);
  const requiredBytes = outPtr + outBytes + 16;

  ensureMemory(requiredBytes);

  const memoryView = new Uint8Array(memory.buffer);
  memoryView.fill(0, 0, requiredBytes);
  memoryView.set(grid, 0);

  const count = instance.exports.collectBoundaryEdges(0, rows, cols, outPtr);
  const edges = new Array(count);
  const view = new DataView(memory.buffer, outPtr, count * EDGE_BYTES);

  for (let i = 0; i < count; i++) {
    const base = i * EDGE_BYTES;
    edges[i] = {
      x1: view.getInt32(base, true),
      y1: view.getInt32(base + 4, true),
      x2: view.getInt32(base + 8, true),
      y2: view.getInt32(base + 12, true),
      ownerRow: view.getInt32(base + 16, true),
      ownerCol: view.getInt32(base + 20, true),
    };
  }

  return edges;
}
