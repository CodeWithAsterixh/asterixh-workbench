export interface IconSpec {
  size: number;
  filename: string;
  purpose: string;
}

export const ICON_SPECS: IconSpec[] = [
  { size: 16, filename: "favicon-16x16.png", purpose: "Browser tab (small)" },
  { size: 32, filename: "favicon-32x32.png", purpose: "Browser tab" },
  { size: 48, filename: "favicon-48x48.png", purpose: "Windows taskbar" },
  { size: 180, filename: "apple-touch-icon.png", purpose: "iOS home screen" },
  { size: 192, filename: "android-chrome-192x192.png", purpose: "Android home screen" },
  { size: 512, filename: "android-chrome-512x512.png", purpose: "PWA splash / install prompt" },
];

export function buildManifest(name: string): string {
  return JSON.stringify(
    {
      name,
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2,
  );
}

export function buildHtmlSnippet(): string {
  return [
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
  ].join("\n");
}
