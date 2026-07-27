export type CategoryId =
  | "video"
  | "audio"
  | "images"
  | "icons-graphics"
  | "design"
  | "css"
  | "documents"
  | "developer"
  | "calculators"
  | "text";

export interface CategorySpec {
  id: CategoryId;
  label: string;
  description: string;
}

export const categories: CategorySpec[] = [
  { id: "video", label: "Video & Animation", description: "Frame extraction and GIF export." },
  { id: "audio", label: "Audio", description: "Trim, join, convert, and clean audio locally." },
  { id: "images", label: "Image Tools", description: "Compress, pack, and lay out batches of images." },
  { id: "icons-graphics", label: "Icons & Graphics", description: "Generate icon sets and QR codes." },
  { id: "design", label: "Design", description: "Shapes and color systems for real projects." },
  { id: "css", label: "CSS Utilities", description: "Generators for layout, motion, and styling rules." },
  { id: "documents", label: "Documents", description: "Split and merge PDFs." },
  { id: "developer", label: "Developer Utilities", description: "JSON, regex, encoding, and timestamp tools." },
  { id: "calculators", label: "Calculators", description: "Percentage and everyday number helpers." },
  { id: "text", label: "Text", description: "Plain-text manipulation." },
];

export function getCategory(id: CategoryId): CategorySpec {
  return categories.find((c) => c.id === id)!;
}
