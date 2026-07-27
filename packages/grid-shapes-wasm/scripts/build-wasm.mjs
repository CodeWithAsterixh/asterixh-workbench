import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import wabtFactory from "wabt";

const root = fileURLToPath(new URL("..", import.meta.url));
const watPath = path.join(root, "src", "geometry.wat");
const outPath = path.join(root, "src", "module-bytes.js");

const wabt = await wabtFactory();
const source = await fs.readFile(watPath, "utf8");
const parsed = wabt.parseWat("geometry.wat", source);
const { buffer } = parsed.toBinary({ log: false, write_debug_names: true });
const bytes = Array.from(buffer, (n) => `0x${n.toString(16).padStart(2, "0")}`).join(", ");
const file = `export const wasmBytes = new Uint8Array([${bytes}]);\n`;
await fs.writeFile(outPath, file, "utf8");
