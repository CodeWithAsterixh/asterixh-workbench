import type { ComponentType } from "react";
import type { CategoryId } from "@/data/categories";
import type { ToolSpec } from "@/data/tools";
import { AgeCalculatorTool } from "@/features/age-calculator";
import { Base64Tool } from "@/features/base64-tool";
import { BorderRadiusGeneratorTool } from "@/features/border-radius-generator";
import { BoxShadowGeneratorTool } from "@/features/box-shadow-generator";
import { ColorContrastCheckerTool } from "@/features/color-contrast-checker";
import { ContactSheetTool } from "@/features/contact-sheet";
import { DateDifferenceTool } from "@/features/date-difference";
import { DesignTokensTool } from "@/features/design-tokens";
import { DevToolkitTool } from "@/features/dev-toolkit";
import { FaviconGeneratorTool } from "@/features/favicon-generator";
import { GifMakerTool } from "@/features/gif-maker";
import { GridShapesTool } from "@/features/grid-shapes";
import { HtmlTool } from "@/features/html-tool";
import { ImageCompressorTool } from "@/features/image-compressor";
import { JsonFormatterTool } from "@/features/json-formatter";
import { LoanCalculatorTool } from "@/features/loan-calculator";
import { PdfToolsTool } from "@/features/pdf-tools";
import { PercentageCalculatorTool } from "@/features/percentage-calculator";
import { QrCodeTool } from "@/features/qr-code";
import { RegexTesterTool } from "@/features/regex-tester";
import { SlugGeneratorTool } from "@/features/slug-generator";
import { SpriteSheetPackerTool } from "@/features/sprite-sheet-packer";
import { TextShufflerTool } from "@/features/text-shuffler";
import { TimestampConverterTool } from "@/features/timestamp-converter";
import { UrlTool } from "@/features/url-tool";
import { UuidGeneratorTool } from "@/features/uuid-generator";
import { CodeGeneratorTool, generatorToolSpecs } from "@/features/code-generators";
import { VideoToFramesTool } from "@/features/video-to-frames";
import { WordCounterTool } from "@/features/word-counter";
import { ImageWorkbenchTool, PdfWorkbenchTool, MediaWorkbenchTool, CssWorkbenchTool } from "@/features/utility-lab";

type ToolView = ComponentType;

function makeImageView(mode: Parameters<typeof ImageWorkbenchTool>[0]["mode"], title: string, summary: string, acceptMultiple?: boolean): ToolView {
  return function ImageView() {
    return <ImageWorkbenchTool mode={mode} title={title} summary={summary} acceptMultiple={acceptMultiple} />;
  };
}

function makePdfView(mode: Parameters<typeof PdfWorkbenchTool>[0]["mode"], title: string, summary: string): ToolView {
  return function PdfView() {
    return <PdfWorkbenchTool mode={mode} title={title} summary={summary} />;
  };
}

function makeMediaView(
  kind: Parameters<typeof MediaWorkbenchTool>[0]["kind"],
  mode: Parameters<typeof MediaWorkbenchTool>[0]["mode"],
  title: string,
  summary: string,
): ToolView {
  return function MediaView() {
    return <MediaWorkbenchTool kind={kind} mode={mode} title={title} summary={summary} />;
  };
}

function makeCssView(mode: Parameters<typeof CssWorkbenchTool>[0]["mode"], title: string, summary: string): ToolView {
  return function CssView() {
    return <CssWorkbenchTool mode={mode} title={title} summary={summary} />;
  };
}

function makeGeneratorView(slug: string): ToolView {
  return function GeneratorView() {
    return <CodeGeneratorTool slug={slug} />;
  };
}

export const toolViewsByCategory: Record<CategoryId, Record<string, ToolView>> = {
  video: {
    "video-to-frames": VideoToFramesTool,
    "gif-maker": GifMakerTool,
    "video-converter": makeMediaView("video", "convert", "Video Converter", "Convert a local video with browser-native recording."),
    "video-trimmer": makeMediaView("video", "trim", "Video Trimmer", "Trim the start and end of a video without uploading it."),
    "video-cropper": makeMediaView("video", "crop", "Video Cropper", "Crop a video frame to a tighter area."),
    "video-resizer": makeMediaView("video", "resize", "Video Resizer", "Resize a video to a new output size locally."),
    "video-reverser": makeMediaView("video", "reverse", "Video Reverser", "Reverse playback into a new browser-rendered clip."),
    "video-reencoder": makeMediaView("video", "convert", "Video Reencoder", "Re-record a local clip into a new format."),
    "video-clip-cutter": makeMediaView("video", "trim", "Video Clip Cutter", "Trim a clip down to the section you need."),
    "video-dimension-changer": makeMediaView("video", "resize", "Video Dimension Changer", "Resize a clip to a new output frame."),
  },
  audio: {
    "audio-extractor": makeMediaView("video", "audio-extract", "Audio Extractor", "Pull the audio track out of a video file."),
    "mp3-converter": makeMediaView("audio", "convert", "MP3 Converter", "Convert or re-encode audio with the fastest supported browser codec."),
    "wav-converter": makeMediaView("audio", "convert", "WAV Converter", "Export audio as WAV with a native browser pipeline."),
    "audio-trimmer": makeMediaView("audio", "trim", "Audio Trimmer", "Trim audio clips by time range."),
    "volume-booster": makeMediaView("audio", "boost", "Volume Booster", "Increase or reduce audio gain before export."),
    "noise-reduction": makeMediaView("audio", "noise-reduction", "Noise Reduction", "Apply a lightweight cleanup pass for spoken audio."),
    "audio-joiner": makeMediaView("audio", "join", "Audio Joiner", "Combine multiple clips into one track."),
    "audio-splitter": makeMediaView("audio", "split", "Audio Splitter", "Break a track into evenly sized chunks."),
    "audio-loudness-booster": makeMediaView("audio", "boost", "Audio Loudness Booster", "Raise or lower gain with a single browser-side pass."),
    "audio-cleanup-pass": makeMediaView("audio", "noise-reduction", "Audio Cleanup Pass", "Smooth rough edges from spoken audio."),
    "audio-track-joiner": makeMediaView("audio", "join", "Audio Track Joiner", "Combine multiple clips into one file."),
  },
  images: {
    "image-compressor": ImageCompressorTool,
    "contact-sheet": ContactSheetTool,
    "sprite-sheet-packer": SpriteSheetPackerTool,
    "image-resizer": makeImageView("resize", "Image Resizer", "Resize images to an exact frame or a contained max size.", true),
    "image-cropper": makeImageView("crop", "Image Cropper", "Crop images to a centered aspect ratio with a live canvas preview.", true),
    "image-rotator": makeImageView("rotate", "Image Rotator", "Rotate images by any angle without leaving the browser.", true),
    "image-flipper": makeImageView("flip", "Image Flipper", "Flip one or many images horizontally or vertically.", true),
    "image-blur": makeImageView("blur", "Image Blur", "Soft-focus any image with a browser canvas blur pass.", true),
    "image-sharpener": makeImageView("sharpen", "Image Sharpener", "Bring back edge detail with a lightweight sharpen pass.", true),
    "image-converter": makeImageView("convert", "Image Converter", "Convert images between PNG, JPEG, and WebP locally.", true),
    "background-removal": makeImageView("background-removal", "Background Removal", "Cut out a simple background key color fast in the browser.", true),
    "image-splitter": makeImageView("split", "Image Splitter", "Split a source image into a grid of tiles for exports or layouts.", true),
    "image-merger": makeImageView("merge", "Image Merger", "Place several images into one fast stitched strip.", true),
    "image-collage": makeImageView("collage", "Image Collage", "Build a tidy image collage grid with browser canvas rendering.", true),
    "image-upscaler": makeImageView("resize", "Image Upscaler", "Scale an image up or down with a browser canvas pass.", true),
    "image-thumbnail-generator": makeImageView("crop", "Image Thumbnail Generator", "Crop a source image into a compact thumbnail for cards and galleries.", true),
    "image-smoother": makeImageView("blur", "Image Smoother", "Blur images locally for a soft-focus result.", true),
    "image-edge-enhancer": makeImageView("sharpen", "Image Edge Enhancer", "Restore edge detail with a lightweight sharpen pass.", true),
    "image-format-switcher": makeImageView("convert", "Image Format Switcher", "Convert images between PNG, JPEG, and WebP locally.", true),
    "alpha-cutout": makeImageView("background-removal", "Alpha Cutout", "Remove a flat background and keep the subject.", true),
    "image-tile-splitter": makeImageView("split", "Image Tile Splitter", "Break an image into a grid of tiles for layout or export.", true),
    "image-board-builder": makeImageView("collage", "Image Board Builder", "Arrange multiple images into a polished collage board.", true),
  },
  "icons-graphics": {
    "favicon-generator": FaviconGeneratorTool,
    "qr-code": QrCodeTool,
  },
  design: {
    "grid-shapes": GridShapesTool,
    "design-tokens": DesignTokensTool,
    "color-contrast-checker": ColorContrastCheckerTool,
    "border-radius-generator": BorderRadiusGeneratorTool,
    "box-shadow-generator": BoxShadowGeneratorTool,
  },
  css: {
    "glassmorphism-generator": makeCssView("glassmorphism", "Glassmorphism Generator", "Design a frosted card with live CSS output."),
    "neumorphism-generator": makeCssView("neumorphism", "Neumorphism Generator", "Tune soft inset and outset shadows for a neumorphic surface."),
    "gradient-generator": makeCssView("gradient", "Gradient Generator", "Build a polished CSS gradient and copy the rule."),
    "grid-generator": makeCssView("grid", "Grid Generator", "Lay out a clean CSS grid template and gap system."),
    "flexbox-builder": makeCssView("flexbox", "Flexbox Builder", "Tune align and justify values for a flex layout."),
    "clamp-calculator": makeCssView("clamp", "Clamp Calculator", "Generate a responsive clamp() font-size or spacing rule."),
    "aspect-ratio-generator": makeCssView("aspect-ratio", "Aspect Ratio Generator", "Set a simple CSS aspect-ratio declaration."),
    "clip-path-generator": makeCssView("clip-path", "Clip Path Generator", "Build a polygon clip-path for modern layouts."),
    "mask-generator": makeCssView("mask", "Mask Generator", "Draft a CSS mask gradient for fades and reveals."),
    "animation-generator": makeCssView("animation", "Animation Generator", "Compose a simple CSS animation with easing and duration."),
    "keyframe-generator": makeCssView("keyframe", "Keyframe Generator", "Generate the keyframes that power a motion preset."),
    "transform-generator": makeCssView("transform", "Transform Generator", "Compose translate, scale, rotate, and skew values."),
    "filter-generator": makeCssView("filter", "Filter Generator", "Tune a live CSS filter stack for previews and UI art."),
    "panel-glass-generator": makeCssView("glassmorphism", "Panel Glass Generator", "Shape a frosted glass card for UI surfaces."),
    "card-shadow-generator": makeCssView("neumorphism", "Card Shadow Generator", "Create a soft surface with layered depth."),
    "hero-gradient-generator": makeCssView("gradient", "Hero Gradient Generator", "Compose a landing-page gradient background."),
    "dashboard-grid-generator": makeCssView("grid", "Dashboard Grid Generator", "Lay out a tidy app grid with spacing controls."),
  },
  "tailwind-css": Object.fromEntries(
    generatorToolSpecs
      .filter((spec) => spec.category === "tailwind-css")
      .map((spec) => [spec.slug, makeGeneratorView(spec.slug)]),
  ),
  nextjs: Object.fromEntries(
    generatorToolSpecs
      .filter((spec) => spec.category === "nextjs")
      .map((spec) => [spec.slug, makeGeneratorView(spec.slug)]),
  ),
  documents: {
    "pdf-tools": PdfToolsTool,
    "pdf-compressor": makePdfView("compress", "PDF Compressor", "Rasterize and compress PDFs locally with quality controls."),
    "pdf-rotator": makePdfView("rotate", "PDF Rotator", "Rotate every page in a PDF by a chosen angle."),
    "pdf-unlocker": makePdfView("unlock", "PDF Unlocker", "Open and flatten PDFs into a clean unprotected copy."),
    "pdf-protector": makePdfView("protect", "PDF Protector", "Flatten and watermark PDFs to make them harder to edit."),
    "pdf-watermark": makePdfView("watermark", "PDF Watermark", "Stamp a text watermark across every PDF page."),
    "pdf-reorder": makePdfView("reorder", "PDF Reorder", "Move pages around and rebuild the document in a new order."),
    "pdf-to-images": makePdfView("pdf-to-images", "PDF to Images", "Render each PDF page to downloadable images."),
    "images-to-pdf": makePdfView("images-to-pdf", "Images to PDF", "Turn a batch of images into a single PDF."),
    "pdf-ocr": makePdfView("ocr", "PDF OCR", "Run OCR on pages and export the recognized text."),
    "pdf-page-exporter": makePdfView("pdf-to-images", "PDF Page Exporter", "Render pages out of a PDF locally and bundle them for download."),
    "pdf-image-builder": makePdfView("images-to-pdf", "PDF Image Builder", "Combine a set of images into one clean PDF export."),
    "pdf-page-optimizer": makePdfView("compress", "PDF Page Optimizer", "Rebuild a lighter PDF for sharing."),
    "pdf-page-reorderer": makePdfView("reorder", "PDF Page Reorderer", "Move pages into a new order and export the rebuilt document."),
    "pdf-text-reader": makePdfView("ocr", "PDF Text Reader", "Extract text from page images locally and export the transcript."),
  },
  developer: {
    "json-formatter": JsonFormatterTool,
    "regex-tester": RegexTesterTool,
    "dev-toolkit": DevToolkitTool,
    "base64-tool": Base64Tool,
    "url-tool": UrlTool,
    "html-tool": HtmlTool,
    "uuid-generator": UuidGeneratorTool,
    "timestamp-converter": TimestampConverterTool,
  },
  calculators: {
    "percentage-calculator": PercentageCalculatorTool,
    "loan-calculator": LoanCalculatorTool,
    "date-difference-calculator": DateDifferenceTool,
    "age-calculator": AgeCalculatorTool,
  },
  text: {
    "text-shuffler": TextShufflerTool,
    "slug-generator": SlugGeneratorTool,
    "word-counter": WordCounterTool,
  },
};

export function getToolView(tool: ToolSpec): ToolView | undefined {
  return toolViewsByCategory[tool.category]?.[tool.slug];
}
