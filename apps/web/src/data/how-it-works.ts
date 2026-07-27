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
  "url-tool": {
    input: "A URL, path segment, or query string you want to encode or decode.",
    output: "A URL-safe encoded string or the readable text recovered from it.",
    steps: [
      { title: "Paste the string", body: "Drop in a URL, parameter, or a percent-encoded value." },
      { title: "Encode or decode", body: "Choose the direction that matches the data you're working with." },
      { title: "Review the result", body: "Check the output before copying it into code or a browser address." },
      { title: "Copy it", body: "Use the result in links, query strings, or API requests." },
    ],
  },
  "html-tool": {
    input: "Text or markup that should be escaped or decoded.",
    output: "HTML entities or readable characters, depending on the direction you choose.",
    steps: [
      { title: "Paste markup", body: "Start with HTML, text, or a string of entities." },
      { title: "Encode or decode", body: "Switch between escaped entities and readable characters." },
      { title: "Verify the output", body: "Look over the transformed text before using it anywhere." },
      { title: "Copy the result", body: "Move the transformed HTML into templates or content fields." },
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
  "loan-calculator": {
    input: "A loan amount, annual interest rate, and loan term in years.",
    output: "Estimated monthly payment, total paid over the loan, and total interest.",
    steps: [
      { title: "Enter the loan", body: "Type the principal amount you want to finance." },
      { title: "Set the rate and term", body: "Add the APR and the number of years in the loan term." },
      { title: "Review payment math", body: "The calculator computes the monthly payment and full cost automatically." },
      { title: "Copy the summary", body: "Use the numbers for planning, comparison, or notes." },
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
  "age-calculator": {
    input: "A birth date and a reference date.",
    output: "Age in years, months, and days.",
    steps: [
      { title: "Pick the birth date", body: "Enter the date you want to measure from." },
      { title: "Set the reference date", body: "Choose the date you want the age measured against." },
      { title: "Read the breakdown", body: "The result shows age in years, months, and days." },
      { title: "Copy it", body: "Use the result for forms, profiles, or planning." },
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
  "border-radius-generator": {
    input: "Four corner radius values, one for each corner of a box.",
    output: "A CSS border-radius declaration and a live rounded preview.",
    steps: [
      { title: "Tune the corners", body: "Adjust each corner radius independently with the sliders." },
      { title: "Watch the preview", body: "The shape updates as soon as the values change." },
      { title: "Review the CSS", body: "The generated radius string is shown in the output panel." },
      { title: "Copy the declaration", body: "Paste the CSS into a component, layout, or design token file." },
    ],
  },
  "box-shadow-generator": {
    input: "Shadow offsets, blur, spread, opacity, and whether the shadow is inset.",
    output: "A custom box-shadow declaration with live preview.",
    steps: [
      { title: "Set the offsets", body: "Pick how far the shadow should move on the X and Y axes." },
      { title: "Shape the blur", body: "Adjust blur, spread, and opacity to get the right feel." },
      { title: "Preview the card", body: "Check the shadow on a live sample panel." },
      { title: "Copy the CSS", body: "Use the generated box-shadow in styles or design docs." },
    ],
  },
  "image-resizer": {
    input: "One or more image files and the target size you want to hit.",
    output: "Resized image files that are ready for download or batching into a zip.",
    steps: [
      { title: "Drop in your images", body: "Add one file or a whole batch in a browser-safe format." },
      { title: "Pick the target size", body: "Set the width and height you want the canvas to fit into." },
      { title: "Review the preview", body: "The output updates in the browser so you can check it before exporting." },
      { title: "Download the result", body: "Grab the file directly or compile the batch into one archive." },
    ],
  },
  "image-cropper": {
    input: "Image files and a crop ratio or canvas size.",
    output: "Cropped image files that keep the framing tight and centered.",
    steps: [
      { title: "Add images", body: "Drop in the files you want to trim." },
      { title: "Set the crop shape", body: "Use the width and height controls to define the final frame." },
      { title: "Check the crop", body: "The browser renders the crop locally so the framing stays predictable." },
      { title: "Export it", body: "Download the cropped image or zip up the full batch." },
    ],
  },
  "image-rotator": {
    input: "Image files and the angle you want to rotate them by.",
    output: "Rotated image files with expanded canvases when needed.",
    steps: [
      { title: "Drop the images", body: "Add the files you want to rotate." },
      { title: "Choose an angle", body: "Set the rotation to whatever fits the layout." },
      { title: "Preview locally", body: "The canvas render keeps the rotation smooth in the browser." },
      { title: "Download the output", body: "Save the rotated image or collect the set into one zip." },
    ],
  },
  "image-flipper": {
    input: "Image files and whether you want a horizontal or vertical flip.",
    output: "Flipped image files ready for quick reuse.",
    steps: [
      { title: "Add your files", body: "Drop one or many images into the workspace." },
      { title: "Choose the flip direction", body: "Toggle horizontal, vertical, or both if you need a mirrored result." },
      { title: "Review the preview", body: "The transformation stays local and fast, with no upload step." },
      { title: "Export the images", body: "Download the results directly or as a zip bundle." },
    ],
  },
  "image-blur": {
    input: "Image files and a blur strength.",
    output: "Blurred image exports with a soft canvas pass.",
    steps: [
      { title: "Drop in the image", body: "Pick the file you want to soften." },
      { title: "Set the blur", body: "Adjust the blur amount to the look you need." },
      { title: "Watch the preview", body: "The browser canvas updates without a heavy processing stack." },
      { title: "Download the export", body: "Save the blurred file or compile it with the rest of your batch." },
    ],
  },
  "image-sharpener": {
    input: "Image files that need a small edge boost.",
    output: "Sharpened image exports with more crispness in the details.",
    steps: [
      { title: "Drop the image", body: "Load one or many images into the tool." },
      { title: "Apply sharpen", body: "The tool uses a lightweight local sharpen pass." },
      { title: "Compare the preview", body: "Check the output before you send it anywhere." },
      { title: "Download the result", body: "Save the sharpened file or batch archive." },
    ],
  },
  "image-converter": {
    input: "Image files and the target format you want to use.",
    output: "Converted image files in PNG, JPEG, or WebP.",
    steps: [
      { title: "Add images", body: "Bring in the files you need to re-encode." },
      { title: "Choose the format", body: "Pick the output format that fits the destination." },
      { title: "Review the size", body: "See the new file size before you download anything." },
      { title: "Save the result", body: "Download one converted image or zip the full set." },
    ],
  },
  "background-removal": {
    input: "Image files, a background color, and a tolerance level.",
    output: "Transparent cutouts that keep the subject and remove a flat background.",
    steps: [
      { title: "Drop in the file", body: "Start with an image that has a mostly flat background." },
      { title: "Pick the key color", body: "Set the color you want to remove and adjust the tolerance." },
      { title: "Check the cutout", body: "The browser processes pixels locally so you can preview the alpha result." },
      { title: "Download the PNG", body: "The tool exports a transparent image that is ready to place elsewhere." },
    ],
  },
  "image-splitter": {
    input: "One or more image files and a rows/columns grid.",
    output: "A set of tiled image slices ready for layout or export.",
    steps: [
      { title: "Load the image", body: "Drop in a source image to split." },
      { title: "Set the grid", body: "Choose how many rows and columns you want." },
      { title: "Review the slices", body: "Each tile is rendered locally and previewed as an output card." },
      { title: "Download the tiles", body: "Compile the pieces into a zip when you are ready." },
    ],
  },
  "image-merger": {
    input: "Several images you want combined into one strip.",
    output: "One stitched image export with all the inputs arranged together.",
    steps: [
      { title: "Add the images", body: "Drop the files you want to combine." },
      { title: "Let the tool stitch them", body: "The browser lays them out in a single canvas pass." },
      { title: "Review the combined image", body: "The merged output appears instantly for a quick check." },
      { title: "Download it", body: "Save the strip directly or compile the batch if needed." },
    ],
  },
  "image-collage": {
    input: "A batch of images and a grid layout.",
    output: "A finished collage sheet rendered in the browser.",
    steps: [
      { title: "Drop the batch", body: "Add the images you want to place in the collage." },
      { title: "Set the grid", body: "Choose the rows and columns that fit the layout." },
      { title: "Check the arrangement", body: "The collage stays fast and readable on the canvas preview." },
      { title: "Export the sheet", body: "Download the final image or batch archive." },
    ],
  },
  "pdf-compressor": {
    input: "A PDF file and how aggressively you want to compress it.",
    output: "A rebuilt PDF that is lighter and easier to share.",
    steps: [
      { title: "Drop the PDF", body: "Add the document you want to optimize." },
      { title: "Choose the quality", body: "Set the rendering quality and compression level." },
      { title: "Review the result", body: "The tool rebuilds the PDF locally, keeping the flow simple." },
      { title: "Download the file", body: "Save the compressed PDF to your device." },
    ],
  },
  "pdf-rotator": {
    input: "A PDF file and the page rotation angle.",
    output: "A rotated PDF with every page updated.",
    steps: [
      { title: "Add the PDF", body: "Load the document you want to rotate." },
      { title: "Set the angle", body: "Choose the rotation that matches the source orientation." },
      { title: "Preview the change", body: "The rebuilt file stays local and fast." },
      { title: "Download the PDF", body: "Save the rotated copy when you are done." },
    ],
  },
  "pdf-unlocker": {
    input: "A supported PDF and, if needed, its password.",
    output: "A flattened PDF copy that is easier to open and reuse.",
    steps: [
      { title: "Load the file", body: "Drop the PDF into the tool." },
      { title: "Enter the password", body: "Provide it only if the document needs one." },
      { title: "Let the browser rebuild it", body: "The PDF is opened and flattened locally." },
      { title: "Download the copy", body: "Save the unlocked version for normal use." },
    ],
  },
  "pdf-protector": {
    input: "A PDF file and an optional watermark label.",
    output: "A flattened PDF copy with a light watermark for safer sharing.",
    steps: [
      { title: "Add the document", body: "Drop the PDF that needs a protection pass." },
      { title: "Set the watermark", body: "Choose the label you want to stamp onto the pages." },
      { title: "Review the rebuild", body: "The browser handles the processing without a server queue." },
      { title: "Download it", body: "Save the protected copy when the render is done." },
    ],
  },
  "pdf-watermark": {
    input: "A PDF file and the text you want stamped on it.",
    output: "A PDF with the watermark placed on every page.",
    steps: [
      { title: "Load the PDF", body: "Drop in the file you want to label." },
      { title: "Type the watermark", body: "Add the text you want to see across the pages." },
      { title: "Check the preview", body: "The text lands locally and stays lightweight." },
      { title: "Download the PDF", body: "Save the updated document when you are finished." },
    ],
  },
  "pdf-reorder": {
    input: "A PDF file and the page order you want to keep.",
    output: "A PDF rebuilt in a new page order.",
    steps: [
      { title: "Add the PDF", body: "Load the document you want to reorder." },
      { title: "Move the pages", body: "Use the list controls to arrange the pages." },
      { title: "Review the order", body: "Check that the page flow is the one you need." },
      { title: "Download the rebuilt file", body: "Save the reordered PDF locally." },
    ],
  },
  "pdf-to-images": {
    input: "A PDF file and the image format you want for the pages.",
    output: "A zip archive full of rendered page images.",
    steps: [
      { title: "Load the PDF", body: "Drop in the document you want to render." },
      { title: "Choose the format", body: "Pick PNG, JPEG, or WebP for the page images." },
      { title: "Render locally", body: "The tool turns each page into an image in the browser." },
      { title: "Download the archive", body: "Save the zip of rendered pages." },
    ],
  },
  "images-to-pdf": {
    input: "A batch of images you want combined into one PDF.",
    output: "A merged PDF built from the images in the order you add them.",
    steps: [
      { title: "Add the images", body: "Drop in the files you want to merge." },
      { title: "Keep the order", body: "Reorder if needed before you build the PDF." },
      { title: "Create the document", body: "The browser creates the PDF locally from the images." },
      { title: "Download it", body: "Save the combined PDF when it is ready." },
    ],
  },
  "pdf-ocr": {
    input: "A PDF file and a page rendering pass.",
    output: "Recognized text extracted from the pages.",
    steps: [
      { title: "Load the PDF", body: "Drop the document you want to read." },
      { title: "Run OCR", body: "The pages are rendered locally and passed through text recognition." },
      { title: "Inspect the text", body: "Review the extracted text in the browser." },
      { title: "Download the transcript", body: "Save the output as a text file when you are done." },
    ],
  },
  "video-converter": {
    input: "A local video file and the browser output format you want to use.",
    output: "A re-encoded video file rendered by browser capture APIs.",
    steps: [
      { title: "Drop in the video", body: "Add the clip you want to convert." },
      { title: "Choose the output", body: "Pick the format and frame settings that fit the destination." },
      { title: "Let it render", body: "The tool plays the video locally and records the result in-browser." },
      { title: "Download the file", body: "Save the converted video once it finishes." },
    ],
  },
  "video-trimmer": {
    input: "A local video and start/end times.",
    output: "A trimmed clip that keeps only the selected range.",
    steps: [
      { title: "Add the clip", body: "Drop in the video you want to cut." },
      { title: "Set the time range", body: "Enter the start and end seconds for the export." },
      { title: "Render locally", body: "The browser records the selected span without an upload step." },
      { title: "Download the trim", body: "Save the shortened clip when it is ready." },
    ],
  },
  "video-cropper": {
    input: "A video file plus the output size you want to keep.",
    output: "A cropped video export with a tighter visible frame.",
    steps: [
      { title: "Load the video", body: "Add the clip you want to crop." },
      { title: "Set the frame", body: "Choose the output width and height." },
      { title: "Preview the crop", body: "The canvas render shows the crop locally before export." },
      { title: "Download the result", body: "Save the cropped clip when you are done." },
    ],
  },
  "video-resizer": {
    input: "A local video and the output size you want to render.",
    output: "A resized clip built entirely in the browser.",
    steps: [
      { title: "Drop the clip", body: "Load the video file you want to resize." },
      { title: "Set the dimensions", body: "Enter the width and height for the output." },
      { title: "Record the result", body: "The browser redraws the frames into a new canvas stream." },
      { title: "Save the export", body: "Download the resized video when it is done." },
    ],
  },
  "video-reverser": {
    input: "A local video and the range you want to reverse.",
    output: "A reversed clip rendered from the browser frame sequence.",
    steps: [
      { title: "Add the video", body: "Drop in the clip you want to reverse." },
      { title: "Choose the section", body: "Set the start and end times for the reversed segment." },
      { title: "Render the frames", body: "The tool walks the video backward and records the output locally." },
      { title: "Download the clip", body: "Save the reversed export when it finishes." },
    ],
  },
  "audio-extractor": {
    input: "A video file that contains an audio track.",
    output: "An extracted audio file from the video.",
    steps: [
      { title: "Load the video", body: "Drop the clip you want to extract audio from." },
      { title: "Set the range", body: "Trim the section if you only want part of the track." },
      { title: "Record the audio", body: "The browser captures the audio track locally." },
      { title: "Download it", body: "Save the extracted file when it is ready." },
    ],
  },
  "mp3-converter": {
    input: "One or more audio files and a browser-supported output codec.",
    output: "A converted audio file in the fastest supported format.",
    steps: [
      { title: "Drop the audio", body: "Add the track you want to convert." },
      { title: "Pick the codec", body: "Choose the output format the browser supports best." },
      { title: "Let it render", body: "The file is re-recorded locally without leaving your device." },
      { title: "Download the result", body: "Save the converted audio file when it completes." },
    ],
  },
  "wav-converter": {
    input: "An audio file and a WAV export choice.",
    output: "A WAV file built from the source audio.",
    steps: [
      { title: "Add your track", body: "Drop in the file you want to export." },
      { title: "Choose WAV", body: "Use the WAV output when you want a simple uncompressed file." },
      { title: "Render locally", body: "The browser writes the audio to a new file in-memory." },
      { title: "Download it", body: "Save the WAV export when it is ready." },
    ],
  },
  "audio-trimmer": {
    input: "An audio file plus a start and end time.",
    output: "A trimmed audio clip from the selected range.",
    steps: [
      { title: "Load the file", body: "Drop in the audio you want to trim." },
      { title: "Set the times", body: "Choose the start and end seconds." },
      { title: "Create the clip", body: "The browser slices the buffer locally for a quick export." },
      { title: "Download the trim", body: "Save the shortened file when you are done." },
    ],
  },
  "volume-booster": {
    input: "An audio file and a gain level.",
    output: "A louder or quieter audio export.",
    steps: [
      { title: "Load the audio", body: "Add the clip you want to rebalance." },
      { title: "Set the gain", body: "Turn the volume up or down to the level you need." },
      { title: "Render the result", body: "The file is processed locally in the browser." },
      { title: "Download it", body: "Save the boosted file when it finishes." },
    ],
  },
  "noise-reduction": {
    input: "An audio file that needs a quick cleanup pass.",
    output: "A lightly smoothed audio export with reduced hiss and rough edges.",
    steps: [
      { title: "Add the file", body: "Drop the track you want to clean up." },
      { title: "Apply cleanup", body: "The tool uses a lightweight browser-side smoothing pass." },
      { title: "Review the output", body: "Check the result before you download it." },
      { title: "Save the clip", body: "Download the cleaned audio file." },
    ],
  },
  "audio-joiner": {
    input: "Multiple audio files in the order you want them combined.",
    output: "A single joined audio file.",
    steps: [
      { title: "Drop the clips", body: "Add every audio file you want to join." },
      { title: "Keep the order", body: "Arrange the inputs the way you want them to play." },
      { title: "Join locally", body: "The browser concatenates the buffers without an upload step." },
      { title: "Download the track", body: "Save the combined file when it finishes." },
    ],
  },
  "audio-splitter": {
    input: "One audio file and the number of pieces you want.",
    output: "A zip archive with evenly split audio segments.",
    steps: [
      { title: "Load the track", body: "Drop in the audio you want to split." },
      { title: "Set the chunk count", body: "Choose how many pieces to break it into." },
      { title: "Create the pieces", body: "The browser slices the buffer locally and packages it up." },
      { title: "Download the archive", body: "Save the zip once the split is ready." },
    ],
  },
  "glassmorphism-generator": {
    input: "Colors, blur, and radius values for a frosted panel.",
    output: "A glassmorphism CSS snippet and live preview.",
    steps: [
      { title: "Pick the colors", body: "Set the gradient or tint you want behind the panel." },
      { title: "Tune blur and radius", body: "Adjust the frosted look until it feels right." },
      { title: "Review the panel", body: "The preview stays lightweight and browser-native." },
      { title: "Copy the CSS", body: "Grab the generated code for your layout." },
    ],
  },
  "neumorphism-generator": {
    input: "A surface color, radius, and soft shadow values.",
    output: "A neumorphic CSS snippet and preview card.",
    steps: [
      { title: "Choose the surface", body: "Pick the neutral color that matches the design." },
      { title: "Tune the softness", body: "Use the radius and shadow feel to shape the panel." },
      { title: "Check the preview", body: "The card updates instantly with the new shadow language." },
      { title: "Copy the CSS", body: "Paste the output into your component or style sheet." },
    ],
  },
  "gradient-generator": {
    input: "Two or more colors and a direction.",
    output: "A CSS gradient declaration and a live preview.",
    steps: [
      { title: "Pick the colors", body: "Choose the stops you want in the gradient." },
      { title: "Set the angle", body: "Rotate the direction to match your layout." },
      { title: "Inspect the preview", body: "The gradient fills the sample panel instantly." },
      { title: "Copy the rule", body: "Use the generated CSS wherever you need it." },
    ],
  },
  "grid-generator": {
    input: "Rows, columns, and spacing for a CSS grid.",
    output: "A grid template CSS snippet and a live layout preview.",
    steps: [
      { title: "Set the grid", body: "Choose rows and columns for the layout." },
      { title: "Adjust the gap", body: "Dial in spacing that matches the design." },
      { title: "Review the sample", body: "The preview shows the grid structure in real time." },
      { title: "Copy the CSS", body: "Paste the template into your stylesheet." },
    ],
  },
  "flexbox-builder": {
    input: "Alignment and spacing values for a flex layout.",
    output: "A flexbox CSS rule and a live row preview.",
    steps: [
      { title: "Pick alignment", body: "Set align-items and justify-content to match the layout." },
      { title: "Set the gap", body: "Adjust spacing between the flex items." },
      { title: "Watch the row", body: "The sample updates as you tune the controls." },
      { title: "Copy the CSS", body: "Use the generated flex rule in your project." },
    ],
  },
  "clamp-calculator": {
    input: "Minimum, preferred, and maximum values.",
    output: "A single clamp() expression for responsive sizing.",
    steps: [
      { title: "Enter the bounds", body: "Set the minimum, preferred, and maximum sizes." },
      { title: "Check the rule", body: "The output updates into a ready-to-paste clamp() string." },
      { title: "Compare the scale", body: "The preview shows how the value feels in a live layout." },
      { title: "Copy the formula", body: "Paste the clamp rule into your CSS." },
    ],
  },
  "aspect-ratio-generator": {
    input: "Two numbers that describe the ratio you want to keep.",
    output: "A clean CSS aspect-ratio declaration.",
    steps: [
      { title: "Set the ratio", body: "Enter the width and height values." },
      { title: "Review the preview", body: "The box keeps its shape while you adjust the numbers." },
      { title: "Check the CSS", body: "The output shows the aspect-ratio rule directly." },
      { title: "Copy it", body: "Paste the declaration into your layout styles." },
    ],
  },
  "clip-path-generator": {
    input: "A polygon point list for a custom shape.",
    output: "A CSS clip-path polygon and live preview.",
    steps: [
      { title: "Edit the points", body: "Use the polygon string that matches your shape." },
      { title: "Preview the mask", body: "The browser clips the sample so you can inspect the result." },
      { title: "Tweak the shape", body: "Adjust the points until the silhouette feels right." },
      { title: "Copy the CSS", body: "Use the clip-path declaration in your design system." },
    ],
  },
  "mask-generator": {
    input: "A gradient stop list for a CSS mask.",
    output: "A mask-image rule and live preview.",
    steps: [
      { title: "Set the stops", body: "Tune the gradient values for the reveal effect." },
      { title: "Look at the preview", body: "The sample shows the mask in the browser." },
      { title: "Refine the fade", body: "Adjust the stop positions until it feels balanced." },
      { title: "Copy the CSS", body: "Paste the mask rule into your layout or component." },
    ],
  },
  "animation-generator": {
    input: "A duration and easing curve for a motion preset.",
    output: "A CSS animation snippet with a live motion preview.",
    steps: [
      { title: "Set the motion", body: "Choose the timing and easing values." },
      { title: "Watch the animation", body: "The preview keeps the motion visible in the browser." },
      { title: "Tighten the feel", body: "Adjust the values until the motion reads cleanly." },
      { title: "Copy the CSS", body: "Use the generated animation rule in your app." },
    ],
  },
  "keyframe-generator": {
    input: "A motion idea you want to turn into keyframes.",
    output: "A CSS @keyframes block ready to paste.",
    steps: [
      { title: "Choose the motion", body: "Use the default keyframe shape or adapt it later." },
      { title: "Review the rule", body: "The generated code is ready for component styles." },
      { title: "Check the preview", body: "The motion reads inside the sample panel." },
      { title: "Copy the block", body: "Paste the keyframes into your stylesheet." },
    ],
  },
  "transform-generator": {
    input: "Translate, scale, rotate, and skew values.",
    output: "A CSS transform declaration and a live transformed preview.",
    steps: [
      { title: "Tweak the transform", body: "Adjust translation, rotation, scale, and skew values." },
      { title: "Watch the preview", body: "The sample element updates as you edit the numbers." },
      { title: "Balance the motion", body: "Refine the values until the effect feels right." },
      { title: "Copy the CSS", body: "Paste the transform rule into your code." },
    ],
  },
  "filter-generator": {
    input: "Brightness, contrast, saturation, and hue values.",
    output: "A CSS filter declaration and preview.",
    steps: [
      { title: "Tune the filter", body: "Set brightness, contrast, saturation, and hue." },
      { title: "Inspect the preview", body: "The browser shows the effect on the sample card." },
      { title: "Refine the look", body: "Adjust until the visual tone fits the design." },
      { title: "Copy the CSS", body: "Paste the filter declaration into your stylesheet." },
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
