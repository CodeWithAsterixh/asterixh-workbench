export interface HowItWorksStep {
  title: string;
  body: string;
}

export interface HowItWorks {
  input: string;
  output: string;
  steps: HowItWorksStep[];
}

export const howItWorks: Record<string, HowItWorks> = {
  "video-to-frames": {
    input: "A video file (MP4, WebM, MOV \u2014 anything your browser can decode), a frame count, an optional trim range, and an output format.",
    output: "A grid of preloaded frame images, plus one .zip once you compile it \u2014 file count and exact size shown before the download starts.",
    steps: [
      { title: "Drop in a video", body: "Or try the built-in sample clip. It's read locally \u2014 nothing uploads." },
      { title: "Set frame count and trim", body: "Choose how many frames to pull, evenly spaced, and skip any dead time at the start or end." },
      { title: "Frames extract and preload", body: "Each frame decodes the moment it's captured, so the preview grid fills in with zero flash." },
      { title: "Compile and download", body: "One click builds a .zip with every frame, sized and ready before you commit to the download." },
    ],
  },
  "gif-maker": {
    input: "A batch of images, in the order you want them to play, plus a frame delay and loop setting.",
    output: "One animated .gif file, sized to the width you choose.",
    steps: [
      { title: "Add your images", body: "Drop in as many as you like \u2014 each becomes one frame." },
      { title: "Reorder them", body: "Move frames up or down until the sequence plays the way you want." },
      { title: "Set delay and loop", body: "Choose how long each frame holds, and whether the GIF loops forever or plays once." },
      { title: "Build and download", body: "Frames are quantized and encoded client-side, then handed back as a ready .gif." },
    ],
  },
  "image-compressor": {
    input: "A batch of images, an output format (JPEG, WebP, or PNG), a quality level, and an optional max width.",
    output: "Recompressed images with an exact before/after size for each one, plus a .zip of the whole batch.",
    steps: [
      { title: "Drop in your images", body: "Any number, mixed formats are fine." },
      { title: "Pick format, quality, and max width", body: "PNG stays lossless; JPEG/WebP expose a quality slider." },
      { title: "Compress", body: "Each image is redrawn to canvas and re-encoded \u2014 you see the size saved per file." },
      { title: "Download the batch", body: "Everything compiles into one .zip, sized before you download it." },
    ],
  },
  "sprite-sheet-packer": {
    input: "A batch of images and a padding value.",
    output: "One packed PNG sprite sheet plus a JSON manifest listing every frame's exact x/y/width/height, zipped together.",
    steps: [
      { title: "Drop in your frames", body: "Order doesn't matter \u2014 they pack left to right, top to bottom." },
      { title: "Set padding", body: "Space between frames so nothing bleeds into its neighbor." },
      { title: "Pack", body: "Every image lands in a uniform grid sized to the largest frame." },
      { title: "Download sheet + manifest", body: "One .zip with the PNG and a JSON file mapping each frame's coordinates." },
    ],
  },
  "contact-sheet": {
    input: "A batch of images, a title, and a column count.",
    output: "One labeled grid image (PNG) \u2014 a shareable storyboard or contact sheet.",
    steps: [
      { title: "Drop in your images", body: "They're arranged in the order you add them." },
      { title: "Set a title and column count", body: "Controls the header and how wide the grid runs." },
      { title: "Build the sheet", body: "Each image is center-cropped to a square thumbnail with its filename labeled below." },
      { title: "Download the PNG", body: "One flat image, ready to share or drop into a doc." },
    ],
  },
  "favicon-generator": {
    input: "One image, ideally square and at least 512\u00d7512.",
    output: "Every standard favicon/app-icon size (16 through 512px), a web manifest, and a copy-paste HTML snippet \u2014 all zipped.",
    steps: [
      { title: "Drop in a source image", body: "It's center-cropped to a square automatically if it isn't one already." },
      { title: "Sizes generate", body: "Six standard sizes render in sequence \u2014 browser tab, iOS, Android, PWA." },
      { title: "Review the set", body: "Every generated size previews before you commit to a download." },
      { title: "Download the zip", body: "Icons, a site.webmanifest, and an HTML snippet with the exact <link> tags to paste in." },
    ],
  },
  "qr-code": {
    input: "Text or a URL, an error-correction level, a size, and foreground/background colors.",
    output: "A downloadable QR code as PNG or SVG.",
    steps: [
      { title: "Type your text or link", body: "The preview updates live as you type." },
      { title: "Choose error correction", body: "Higher levels stay scannable even if part of the code is damaged or covered." },
      { title: "Style it", body: "Set the size and pick foreground/background colors to match your use." },
      { title: "Download PNG or SVG", body: "Pick whichever format fits where it's going." },
    ],
  },
  "grid-shapes": {
    input: "A grid you paint by clicking or dragging \u2014 each filled cell is one unit of the final shape \u2014 plus a corner radius, colors, and stroke.",
    output: "A single SVG path with every corner, outer and inner, rounded automatically \u2014 downloadable as .svg, copyable as markup, or as a CSS clip-path.",
    steps: [
      { title: "Paint the grid", body: "Click or drag like a brush to fill or clear cells." },
      { title: "Set a corner radius", body: "One global value, or switch to Radius mode and click a filled cell to override just that one." },
      { title: "Style fill and stroke", body: "Pick a fill color, an optional stroke color, and a stroke width." },
      { title: "Export", body: "Download the SVG file, copy its markup, or copy a ready-to-paste CSS clip-path." },
    ],
  },
  "design-tokens": {
    input: "One image and how many colors to extract.",
    output: "The dominant palette as CSS custom properties, a Tailwind config snippet, or JSON \u2014 individually or zipped together.",
    steps: [
      { title: "Drop in an image", body: "A photo, screenshot, or illustration \u2014 anything with color in it." },
      { title: "Choose a color count", body: "Between 3 and 10 \u2014 a k-means pass finds that many dominant clusters." },
      { title: "Review the swatches", body: "Each extracted color shows as a hex-labeled swatch." },
      { title: "Copy or download", body: "Grab one format from the tabs, or download all three at once as a zip." },
    ],
  },
  "pdf-tools": {
    input: "Merge: two or more PDFs, in the order you want them combined. Split: one PDF.",
    output: "Merge: one combined PDF. Split: a .zip with every page as its own PDF file.",
    steps: [
      { title: "Pick a mode", body: "Merge combines files; split breaks one file into its pages." },
      { title: "Add your PDF(s)", body: "For merging, reorder the list with the up/down controls before combining." },
      { title: "Process", body: "Pages are copied directly between documents \u2014 no re-rendering, no quality loss." },
      { title: "Download the result", body: "One merged.pdf, or a zip of individually numbered page files." },
    ],
  },
  "json-formatter": {
    input: "Any JSON text, pasted or typed in.",
    output: "The same JSON, formatted or minified \u2014 or a clear error with the exact line and column if it doesn't parse.",
    steps: [
      { title: "Paste in JSON", body: "Validity is checked as you type." },
      { title: "Format or minify", body: "Format pretty-prints with 2-space indent; minify strips it all to one line." },
      { title: "Fix errors if flagged", body: "Invalid JSON shows the parser's message plus a line/column pointer where it can." },
      { title: "Copy the result", body: "One click copies the current textarea content to your clipboard." },
    ],
  },
  "regex-tester": {
    input: "A regular expression pattern, flags (g/i/m/s/u), and a block of test text.",
    output: "Every match highlighted inline, plus a breakdown of each match's capture groups.",
    steps: [
      { title: "Write a pattern", body: "Standard JavaScript regex syntax \u2014 no delimiters needed." },
      { title: "Toggle flags", body: "g finds every match; i, m, s, and u change how the pattern behaves." },
      { title: "Paste test text", body: "Matches highlight live as you edit either the pattern or the text." },
      { title: "Read the match list", body: "Each match shows its position and any numbered capture groups." },
    ],
  },
  "dev-toolkit": {
    input: "Text (for Base64 or hashing) \u2014 or nothing at all for UUIDs.",
    output: "Base64-encoded/decoded text, a SHA hash digest, or a list of UUIDs.",
    steps: [
      { title: "Pick a tab", body: "Base64, Hash, or UUID \u2014 each is independent." },
      { title: "Base64", body: "Edit either side \u2014 plain text or encoded \u2014 and the other updates automatically." },
      { title: "Hash", body: "Type text and choose SHA-1/256/384/512; the digest updates live." },
      { title: "UUID", body: "Set a count and generate that many v4 UUIDs at once, with a copy-all button." },
    ],
  },
  "base64-tool": {
    input: "Any readable text to encode, or any valid Base64 string to decode.",
    output: "The converted text, ready to copy into code, configs, or messages.",
    steps: [
      { title: "Paste text", body: "Start with plain text or an existing Base64 string." },
      { title: "Encode or decode", body: "Pick the direction you need and let the browser do the conversion locally." },
      { title: "Inspect the output", body: "The result appears in a second panel so it is easy to verify." },
      { title: "Copy the result", body: "Move the converted text wherever you need it." },
    ],
  },
  "uuid-generator": {
    input: "A count of how many UUIDs you want to generate.",
    output: "A batch of RFC 4122 version 4 UUIDs, ready to copy or regenerate.",
    steps: [
      { title: "Pick a count", body: "Choose how many UUIDs you want in the batch." },
      { title: "Generate", body: "The browser creates each UUID locally using its native crypto API." },
      { title: "Review the list", body: "Each value is shown on its own line for easy scanning." },
      { title: "Copy all", body: "Copy the whole batch to paste into config files, test data, or fixtures." },
    ],
  },
  "timestamp-converter": {
    input: "A local date/time or a Unix timestamp in seconds or milliseconds.",
    output: "Converted local time, UTC time, ISO string, Unix seconds, and Unix milliseconds.",
    steps: [
      { title: "Enter a date", body: "Start with either a local date/time or a Unix timestamp." },
      { title: "Choose the Unix unit", body: "Switch between seconds and milliseconds to match your source data." },
      { title: "Read the normalized values", body: "The tool keeps the formats synchronized so each representation is easy to copy." },
      { title: "Export what you need", body: "Use the copy buttons to move ISO or Unix values into your code or logs." },
    ],
  },
  "color-contrast-checker": {
    input: "A foreground color and a background color.",
    output: "A contrast ratio, WCAG pass/fail status, and a live preview of the pair.",
    steps: [
      { title: "Choose colors", body: "Pick foreground and background values with the color pickers or type hex codes directly." },
      { title: "Review the ratio", body: "The checker calculates the contrast ratio using standard WCAG luminance rules." },
      { title: "Check accessibility", body: "See whether the pair passes AA and AAA text requirements." },
      { title: "Swap or copy", body: "Flip the colors or copy the ratio for design notes and reviews." },
    ],
  },
  "percentage-calculator": {
    input: "A base amount, a percentage, and whether you want the result as a raw percentage, an increase, or a decrease.",
    output: "The calculated percentage value and the final adjusted amount.",
    steps: [
      { title: "Enter the numbers", body: "Type the base amount and the percentage you want to apply." },
      { title: "Pick the operation", body: "Choose whether to get the raw percentage, increase the amount, or decrease it." },
      { title: "Review the result", body: "The tool shows the percentage value and the final total immediately." },
      { title: "Copy the summary", body: "Copy the generated calculation into notes, docs, or spreadsheets." },
    ],
  },
  "date-difference-calculator": {
    input: "Two timestamps in local date/time form.",
    output: "The gap between them, broken into days, hours, minutes, and seconds.",
    steps: [
      { title: "Choose the two dates", body: "Pick a start and end timestamp using the built-in date controls." },
      { title: "Swap if needed", body: "Flip the order if you want to measure the difference the other way around." },
      { title: "Read the breakdown", body: "The calculator shows the span in multiple time units at once." },
      { title: "Copy the summary", body: "Use the result in notes, schedules, or project planning." },
    ],
  },
  "word-counter": {
    input: "Any block of pasted or typed text.",
    output: "Word count, character count, character count without spaces, lines, paragraphs, sentences, and reading time.",
    steps: [
      { title: "Paste text", body: "Drop in a paragraph, article, draft, or any longer block of copy." },
      { title: "Let the metrics update", body: "The tool counts words, characters, lines, and paragraphs live as you edit." },
      { title: "Check reading time", body: "Use the estimate to gauge how long the text will take to read." },
      { title: "Copy or clear", body: "Keep the text, replace it with the sample, or clear it out and start again." },
    ],
  },
  "slug-generator": {
    input: "Any title, heading, or phrase.",
    output: "A lowercase, URL-safe slug made from that text.",
    steps: [
      { title: "Paste a title", body: "Use a post title, page heading, or any phrase you want to turn into a slug." },
      { title: "Let it normalize", body: "The tool removes punctuation, accents, and repeated separators." },
      { title: "Review the slug", body: "You get a clean URL segment that is ready for routes or CMS entries." },
      { title: "Copy it", body: "Move the slug straight into a CMS, file name, or route definition." },
    ],
  },
  "text-shuffler": {
    input: "Any block of text and a delimiter \u2014 a comma, period, space, or any custom string.",
    output: "The same pieces of text, rejoined in a new random order.",
    steps: [
      { title: "Paste in text", body: "Or use the preloaded example." },
      { title: "Pick a delimiter", body: "Use a quick preset or type any custom string \u2014 even an empty one shuffles individual characters." },
      { title: "Shuffle", body: "A proper Fisher\u2013Yates shuffle reorders the split pieces \u2014 click again for a new order." },
      { title: "Copy the result", body: "The rejoined text is ready to copy, alongside a chip view of every shuffled piece." },
    ],
  },
};
