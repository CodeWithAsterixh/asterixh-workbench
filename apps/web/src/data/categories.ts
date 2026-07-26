export type CategoryId =
  | "video"
  | "images"
  | "icons-graphics"
  | "design"
  | "documents"
  | "developer"
  | "text";

export interface CategorySpec {
  id: CategoryId;
  label: string;
  description: string;
}

export const categories: CategorySpec[] = [
  { id: "video", label: "Video & Animation", description: "Frame extraction and GIF export." },
  { id: "images", label: "Image Tools", description: "Compress, pack, and lay out batches of images." },
  { id: "icons-graphics", label: "Icons & Graphics", description: "Generate icon sets and QR codes." },
  { id: "design", label: "Design", description: "Shapes and color systems for real projects." },
  { id: "documents", label: "Documents", description: "Split and merge PDFs." },
  { id: "developer", label: "Developer Utilities", description: "JSON, regex, and everyday encoding tools." },
  { id: "text", label: "Text", description: "Plain-text manipulation." },
];

export function getCategory(id: CategoryId): CategorySpec {
  return categories.find((c) => c.id === id)!;
}
