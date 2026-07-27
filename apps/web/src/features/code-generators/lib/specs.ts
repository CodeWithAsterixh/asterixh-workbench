import type { GeneratorSpec, GeneratorValues } from "./common";
import {
  colorField,
  numberField,
  selectField,
  textField,
  toggleField,
  toTitleCase,
} from "./common";

const twPaletteFields = [
  textField("themeName", "Theme name", "Nebula"),
  colorField("primary", "Primary", "#c07d2d"),
  colorField("secondary", "Secondary", "#f6efe3"),
  colorField("accent", "Accent", "#1f2937"),
  colorField("surface", "Surface", "#fffaf2"),
];

const twButtonFields = [
  textField("label", "Button label", "Get started"),
  selectField("variant", "Variant", "solid", [
    { label: "Solid", value: "solid" },
    { label: "Outline", value: "outline" },
    { label: "Ghost", value: "ghost" },
  ]),
  colorField("accent", "Accent", "#b37d28"),
  numberField("radius", "Radius", 16, 0, 64, 1),
];

const twCardFields = [
  textField("title", "Card title", "Launch faster"),
  textField("body", "Card body", "Ship polished interfaces with a small set of tokens."),
  colorField("accent", "Accent", "#b37d28"),
  selectField("shadow", "Shadow", "soft", [
    { label: "Soft", value: "soft" },
    { label: "Strong", value: "strong" },
    { label: "Inset", value: "inset" },
  ]),
];

const twDashboardFields = [
  textField("title", "Dashboard title", "Admin overview"),
  numberField("widgets", "Widgets", 4, 2, 12, 1),
  numberField("sidebarWidth", "Sidebar width", 280, 220, 420, 4),
  selectField("density", "Density", "comfortable", [
    { label: "Comfortable", value: "comfortable" },
    { label: "Compact", value: "compact" },
  ]),
];

const twHeroFields = [
  textField("headline", "Headline", "Build cleaner interfaces"),
  textField("subhead", "Subhead", "Use one consistent system for spacing, color, and layout."),
  textField("cta", "Call to action", "Try the tool"),
  colorField("accent", "Accent", "#b37d28"),
];

const twConfigFields = [
  textField("projectName", "Project name", "workbench-ui"),
  textField("contentGlobs", "Content globs", "./src/**/*.{ts,tsx,mdx}"),
  toggleField("forms", "Include forms plugin", true),
  toggleField("typography", "Include typography plugin", true),
];

const twSpacingFields = [
  selectField("property", "Property", "padding", [
    { label: "Padding", value: "padding" },
    { label: "Margin", value: "margin" },
    { label: "Gap", value: "gap" },
    { label: "Font size", value: "text" },
  ]),
  numberField("mobile", "Mobile", 4, 0, 20, 1),
  numberField("tablet", "Tablet", 6, 0, 24, 1),
  numberField("desktop", "Desktop", 8, 0, 32, 1),
];

const twFlexFields = [
  selectField("direction", "Direction", "row", [
    { label: "Row", value: "row" },
    { label: "Column", value: "column" },
  ]),
  selectField("justify", "Justify", "between", [
    { label: "Start", value: "start" },
    { label: "Center", value: "center" },
    { label: "Between", value: "between" },
    { label: "Around", value: "around" },
  ]),
  selectField("align", "Align", "center", [
    { label: "Start", value: "start" },
    { label: "Center", value: "center" },
    { label: "End", value: "end" },
    { label: "Stretch", value: "stretch" },
  ]),
  numberField("gap", "Gap", 4, 0, 12, 1),
];

const twGridFields = [
  numberField("columns", "Columns", 3, 1, 12, 1),
  numberField("rows", "Rows", 2, 1, 12, 1),
  numberField("gap", "Gap", 6, 0, 12, 1),
];

const twTypographyFields = [
  numberField("fontSize", "Font size", 28, 12, 96, 1),
  numberField("lineHeight", "Line height", 1.15, 1, 2, 0.01),
  numberField("tracking", "Tracking", -0.02, -0.1, 0.2, 0.01),
  selectField("weight", "Weight", "semibold", [
    { label: "Medium", value: "medium" },
    { label: "Semibold", value: "semibold" },
    { label: "Bold", value: "bold" },
  ]),
];

const twContainerFields = [
  selectField("maxWidth", "Max width", "1200", [
    { label: "1024px", value: "1024" },
    { label: "1200px", value: "1200" },
    { label: "1440px", value: "1440" },
  ]),
  numberField("padding", "Padding", 24, 8, 48, 1),
  toggleField("center", "Center content", true),
];

const nextBoilerplateFields = [
  textField("projectName", "Project name", "workbench-app"),
  toggleField("withAuth", "Include auth shell", false),
  toggleField("withApi", "Include API route", true),
];

const nextRouteFields = [
  textField("routePath", "Route path", "/api/status"),
  textField("name", "Resource name", "status"),
  selectField("method", "Method", "GET", [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "DELETE", value: "DELETE" },
  ]),
];

const nextMetadataFields = [
  textField("title", "Title", "Workbench"),
  textField("description", "Description", "Browser-first tools for fast work."),
  textField("canonical", "Canonical URL", "https://example.com"),
  textField("image", "OG image", "/og.png"),
];

function str(values: GeneratorValues, key: string, fallback = ""): string {
  return String(values[key] ?? fallback);
}

function num(values: GeneratorValues, key: string, fallback = 0): number {
  const value = values[key];
  return typeof value === "number" ? value : Number(value ?? fallback) || fallback;
}

function bool(values: GeneratorValues, key: string): boolean {
  return Boolean(values[key]);
}

function className(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function title(value: string): string {
  return toTitleCase(value);
}

function makeSwatchOutput(values: GeneratorValues, themeName: string): string {
  return `export const ${themeName}Theme = {
  colors: {
    primary: "${str(values, "primary")}",
    secondary: "${str(values, "secondary")}",
    accent: "${str(values, "accent")}",
    surface: "${str(values, "surface")}",
  },
};`;
}

function makeTailwindButton(values: GeneratorValues): string {
  const variant = str(values, "variant");
  const radius = num(values, "radius");
  const accent = str(values, "accent");
  const base = "inline-flex items-center justify-center px-5 py-3 font-medium transition";
  const classes =
    variant === "outline"
      ? `${base} border border-[${accent}] text-[${accent}] hover:bg-[${accent}] hover:text-white`
      : variant === "ghost"
        ? `${base} text-[${accent}] hover:bg-[${accent}]/10`
        : `${base} bg-[${accent}] text-white hover:opacity-90`;
  return `<button className="${className(`${classes} rounded-[${radius}px]`)}">
  ${str(values, "label")}
</button>`;
}

function makeTailwindCard(values: GeneratorValues): string {
  const shadow = str(values, "shadow");
  const boxShadow =
    shadow === "strong"
      ? "0 28px 80px rgba(15, 23, 42, 0.18)"
      : shadow === "inset"
        ? "inset 0 1px 0 rgba(255,255,255,0.6), 0 18px 40px rgba(15, 23, 42, 0.10)"
        : "0 18px 42px rgba(15, 23, 42, 0.10)";
  return `<article className="rounded-3xl border border-white/10 bg-white/80 p-6 backdrop-blur" style={{ boxShadow: "${boxShadow}" }}>
  <h3 className="text-lg font-semibold">${str(values, "title")}</h3>
  <p className="mt-3 text-sm text-slate-600">${str(values, "body")}</p>
</article>`;
}

function makeTailwindHero(values: GeneratorValues): string {
  return `<section className="rounded-[32px] bg-[${str(values, "accent")}] p-12 text-white">
  <p className="text-sm uppercase tracking-[0.3em] opacity-80">Featured</p>
  <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight">${str(values, "headline")}</h1>
  <p className="mt-5 max-w-xl text-white/85">${str(values, "subhead")}</p>
  <button className="mt-8 rounded-full bg-white px-5 py-3 font-medium text-slate-900">${str(values, "cta")}</button>
</section>`;
}

function makeFileTree(titleLine: string, entries: string[]): string {
  return [`${titleLine}/`, ...entries.map((entry) => `  ${entry}`)].join("\n");
}

function makeAppRouterOutput(values: GeneratorValues): string {
  const name = str(values, "projectName");
  return `${makeFileTree(name, [
  "app/",
  "  layout.tsx",
  "  page.tsx",
  "  globals.css",
  bool(values, "withAuth") ? "  auth/" : "  (no auth shell)",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
])}

import type { ReactNode } from "react";

// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;
}

function makePagesRouterOutput(values: GeneratorValues): string {
  const name = str(values, "projectName");
  return `${makeFileTree(name, [
  "pages/",
  "  _app.tsx",
  "  index.tsx",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
  "  styles/",
])}

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}`;
}

function makeRouteHandlerOutput(values: GeneratorValues): string {
  return `export async function ${str(values, "method")}() {
  return Response.json({ ${str(values, "name")}: "ok" });
}`;
}

function makeMetadataOutput(values: GeneratorValues): string {
  return `export const metadata = {
  title: "${str(values, "title")}",
  description: "${str(values, "description")}",
  alternates: {
    canonical: "${str(values, "canonical")}",
  },
  openGraph: {
    images: ["${str(values, "image")}"],
  },
};`;
}

function makeServerActionOutput(values: GeneratorValues): string {
  return `"use server";

export async function ${str(values, "exportName")}(formData: FormData) {
  const value = formData.get("${str(values, "name")}")?.toString() ?? "";
  return { ok: true, value };
}`;
}

function makeLayoutOutput(values: GeneratorValues): string {
  return `import type { ReactNode } from "react";

export default function ${title(str(values, "name"))}Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6">
      {children}
    </section>
  );
}`;
}

function makeErrorOutput(values: GeneratorValues): string {
  return `export default function ErrorPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">${str(values, "code")}</p>
      <h1 className="mt-4 text-4xl font-semibold">${str(values, "message")}</h1>
      <p className="mt-4 text-slate-600">${str(values, "support")}</p>
    </div>
  );
}`;
}

function makeBoilerplateTree(values: GeneratorValues, entries: string[]): string {
  return makeFileTree(str(values, "projectName"), entries);
}

function makeDashboardLayout(values: GeneratorValues): string {
  return `import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen gap-6 lg:grid-cols-[${num(values, "sidebarWidth")}px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-white/10 bg-slate-950 p-6 text-white">Sidebar</aside>
      <main className="grid gap-6 p-6">{
        Array.from({ length: ${num(values, "widgets")} }, (_, index) => (
          <section key={index} className="rounded-3xl border border-white/10 bg-white p-6 shadow-sm">Widget {index + 1}</section>
        ))
      }</main>
    </div>
  );
}`;
}

function makeTypographyOutput(values: GeneratorValues): string {
  const weight = str(values, "weight");
  const fontClass = weight === "semibold" ? "font-semibold" : `font-${weight}`;
  return `className="text-[${num(values, "fontSize")}px] leading-[${num(values, "lineHeight")}] tracking-[${num(values, "tracking")}em] ${fontClass}";`;
}

function makeContainerOutput(values: GeneratorValues): string {
  const align = bool(values, "center") ? "mx-auto" : "mx-0";
  return `<div className="${className(`${align} w-full max-w-[${num(values, "maxWidth")}px] px-[${num(values, "padding")}px]`)}">
  ...
</div>`;
}

function makeSpacingOutput(values: GeneratorValues): string {
  const property = str(values, "property");
  const classes =
    property === "padding"
      ? `p-${num(values, "mobile")} md:p-${num(values, "tablet")} lg:p-${num(values, "desktop")}`
      : property === "margin"
        ? `m-${num(values, "mobile")} md:m-${num(values, "tablet")} lg:m-${num(values, "desktop")}`
        : property === "gap"
          ? `gap-${num(values, "mobile")} md:gap-${num(values, "tablet")} lg:gap-${num(values, "desktop")}`
          : `text-[${num(values, "mobile")}px] md:text-[${num(values, "tablet")}px] lg:text-[${num(values, "desktop")}px]`;
  return `className="${classes}"`;
}

function makeFlexOutput(values: GeneratorValues): string {
  return `className="${className(`flex flex-${str(values, "direction")} items-${str(values, "align")} justify-${str(values, "justify")} gap-${num(values, "gap")}`)}"`;
}

function makeGridOutput(values: GeneratorValues): string {
  return `className="grid grid-cols-${num(values, "columns")} gap-${num(values, "gap")}";\n// rows: ${num(values, "rows")}`;
}

function makeConfigOutput(values: GeneratorValues): string {
  return `import type { Config } from "tailwindcss";

export default {
  content: ["${str(values, "contentGlobs")}"],
  theme: { extend: {} },
  plugins: [
    ${bool(values, "forms") ? 'require("@tailwindcss/forms"),' : ""}
    ${bool(values, "typography") ? 'require("@tailwindcss/typography"),' : ""}
  ],
} satisfies Config;`;
}

function makeThemeOutput(values: GeneratorValues): string {
  return `:root {
  --theme-primary: ${str(values, "primary")};
  --theme-secondary: ${str(values, "secondary")};
  --theme-surface: ${str(values, "surface")};
  --theme-radius: 24px;
}

.theme-${str(values, "themeName").toLowerCase().replace(/\s+/g, "-")} {
  background: linear-gradient(135deg, var(--theme-surface), ${str(values, "primary")});
  color: ${str(values, "accent")};
  border-radius: var(--theme-radius);
}`;
}

function makePaletteOutput(values: GeneratorValues): string {
  return `export const palette = {
  base: "${str(values, "primary")}",
  muted: "${str(values, "secondary")}",
  accent: "${str(values, "accent")}",
  surface: "${str(values, "surface")}",
};`;
}

function makeNextRouteOutput(values: GeneratorValues): string {
  const routePath = str(values, "routePath");
  return `export async function ${str(values, "method")}() {
  return Response.json({ route: "${routePath}", resource: "${str(values, "name")}" });
}`;
}

const tailwindGeneratorSpecs: GeneratorSpec[] = [
  {
    slug: "tailwind-color-generator",
    name: "Tailwind Color Generator",
    tagline: "Turn a tiny palette into reusable Tailwind theme tokens.",
    description: "Generate color tokens, CSS variables, and a preview strip for a Tailwind project.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "colors", "theme"],
    fileName: "tailwind-colors.ts",
    outputLabel: "Theme colors",
    previewKind: "swatches",
    fields: twPaletteFields,
    buildOutput: (values) => makeSwatchOutput(values, "tailwind"),
    featured: true,
  },
  {
    slug: "tailwind-palette-generator",
    name: "Tailwind Palette Generator",
    tagline: "Build a full palette from a single visual direction.",
    description: "Create a usable palette for interfaces, surfaces, and accent states.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "palette", "design"],
    fileName: "palette.ts",
    outputLabel: "Palette",
    previewKind: "swatches",
    fields: twPaletteFields,
    buildOutput: makePaletteOutput,
  },
  {
    slug: "tailwind-config-builder",
    name: "Tailwind Config Builder",
    tagline: "Draft a production-ready Tailwind config fast.",
    description: "Produce a base Tailwind config with content globs and plugin toggles.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "config"],
    fileName: "tailwind.config.ts",
    outputLabel: "Config",
    previewKind: "code",
    fields: twConfigFields,
    buildOutput: makeConfigOutput,
    featured: true,
  },
  {
    slug: "tailwind-theme-generator",
    name: "Tailwind Theme Generator",
    tagline: "Shape a theme surface with color and radius tokens.",
    description: "Create a compact theme block with CSS variables and a live preview.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "theme"],
    fileName: "theme.css",
    outputLabel: "Theme CSS",
    previewKind: "theme",
    fields: twPaletteFields,
    buildOutput: makeThemeOutput,
  },
  {
    slug: "responsive-class-builder",
    name: "Responsive Class Builder",
    tagline: "Build responsive utility strings without guessing the scale.",
    description: "Generate responsive class names for spacing and text size in one pass.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "responsive"],
    fileName: "responsive-class.txt",
    outputLabel: "Class string",
    previewKind: "layout",
    fields: twSpacingFields,
    buildOutput: makeSpacingOutput,
  },
  {
    slug: "flex-playground",
    name: "Flex Playground",
    tagline: "Tune flex alignment, direction, and gap in one place.",
    description: "Generate a small flex container snippet with the alignment you need.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "flex"],
    fileName: "flexbox.txt",
    outputLabel: "Flex classes",
    previewKind: "layout",
    fields: twFlexFields,
    buildOutput: makeFlexOutput,
  },
  {
    slug: "grid-playground",
    name: "Grid Playground",
    tagline: "Draft a CSS grid layout with a small Tailwind grid shell.",
    description: "Create a class string for columns, rows, and gaps with a live preview grid.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "grid"],
    fileName: "grid.txt",
    outputLabel: "Grid classes",
    previewKind: "layout",
    fields: twGridFields,
    buildOutput: makeGridOutput,
  },
  {
    slug: "typography-builder",
    name: "Typography Builder",
    tagline: "Shape type scale rules for a consistent interface.",
    description: "Generate a Tailwind-friendly typography string for headings, body text, and labels.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "type"],
    fileName: "type.txt",
    outputLabel: "Typography",
    previewKind: "component",
    fields: twTypographyFields,
    buildOutput: makeTypographyOutput,
  },
  {
    slug: "container-builder",
    name: "Container Builder",
    tagline: "Create a centered container rule with the right padding.",
    description: "Output a reusable layout wrapper that keeps content aligned and readable.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "layout"],
    fileName: "container.txt",
    outputLabel: "Container",
    previewKind: "layout",
    fields: twContainerFields,
    buildOutput: makeContainerOutput,
  },
  {
    slug: "button-generator",
    name: "Button Generator",
    tagline: "Generate a polished button component with one glance.",
    description: "Compose a Tailwind button snippet with variant, color, and radius choices.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "component"],
    fileName: "button.tsx",
    outputLabel: "Button",
    previewKind: "component",
    fields: twButtonFields,
    buildOutput: makeTailwindButton,
    featured: true,
  },
  {
    slug: "card-generator",
    name: "Card Generator",
    tagline: "Build a reusable content card with a clean shadow treatment.",
    description: "Create a card component with title, body, accent, and shadow style.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "card"],
    fileName: "card.tsx",
    outputLabel: "Card",
    previewKind: "component",
    fields: twCardFields,
    buildOutput: makeTailwindCard,
  },
  {
    slug: "dashboard-layout-generator",
    name: "Dashboard Layout Generator",
    tagline: "Lay out an admin shell with a sidebar and widget grid.",
    description: "Generate a dashboard scaffold with the chosen sidebar width and card density.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "dashboard"],
    fileName: "dashboard.tsx",
    outputLabel: "Layout",
    previewKind: "layout",
    fields: twDashboardFields,
    buildOutput: makeDashboardLayout,
  },
  {
    slug: "hero-section-generator",
    name: "Hero Section Generator",
    tagline: "Create a landing-page hero that feels ready to ship.",
    description: "Produce a bold hero section snippet with headline, subhead, CTA, and accent color.",
    category: "tailwind-css",
    cluster: "tailwind",
    tags: ["tailwind", "hero"],
    fileName: "hero.tsx",
    outputLabel: "Hero section",
    previewKind: "component",
    fields: twHeroFields,
    buildOutput: makeTailwindHero,
  },
];

const nextGeneratorSpecs: GeneratorSpec[] = [
  {
    slug: "app-router-boilerplate",
    name: "App Router Boilerplate",
    tagline: "Spin up a clean Next.js App Router starter.",
    description: "Produce a folder tree and root layout that match a modern App Router setup.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "boilerplate"],
    fileName: "app-router.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "app/",
  "  layout.tsx",
  "  page.tsx",
  "  globals.css",
  bool(values, "withAuth") ? "  auth/" : "  (no auth shell)",
])}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}`,
    featured: true,
  },
  {
    slug: "pages-router-boilerplate",
    name: "Pages Router Boilerplate",
    tagline: "Create a classic Next.js pages starter quickly.",
    description: "Generate a file tree and minimal app wrapper for the Pages Router.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "pages-router"],
    fileName: "pages-router.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "pages/",
  "  _app.tsx",
  "  index.tsx",
  "  api/",
  "  styles/",
])}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}`,
  },
  {
    slug: "saas-boilerplate",
    name: "SaaS Boilerplate",
    tagline: "Outline a SaaS starter with auth and billing hooks.",
    description: "Create the scaffold for a SaaS app with auth and optional API wiring.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "saas"],
    fileName: "saas-starter.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "app/",
  "  (marketing)/",
  "  (app)/",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
  "  billing/",
])}

// ${str(values, "projectName")} scaffold ready for auth, billing, and dashboard sections.`,
  },
  {
    slug: "dashboard-boilerplate",
    name: "Dashboard Boilerplate",
    tagline: "Start a dashboard app with the right layout skeleton.",
    description: "Generate the files and shell layout for a dashboard-focused Next.js app.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "dashboard"],
    fileName: "dashboard-starter.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "app/",
  "  dashboard/",
  "  settings/",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
  "  layout.tsx",
  "  page.tsx",
])}

// Dashboard shell for ${str(values, "projectName")}.`,
  },
  {
    slug: "blog-boilerplate",
    name: "Blog Boilerplate",
    tagline: "Set up a content-first Next.js blog starter.",
    description: "Generate a blog scaffold with a home feed and dynamic post route.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "blog"],
    fileName: "blog-starter.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "app/",
  "  blog/",
  "  posts/[slug]/",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
  "  layout.tsx",
  "  page.tsx",
])}

// Blog starter for ${str(values, "projectName")}.`,
  },
  {
    slug: "portfolio-boilerplate",
    name: "Portfolio Boilerplate",
    tagline: "Create a personal site starter with clear sections.",
    description: "Generate a portfolio scaffold with a landing page, projects, and contact flow.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "portfolio"],
    fileName: "portfolio-starter.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "app/",
  "  about/",
  "  projects/",
  "  contact/",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
  "  page.tsx",
])}

// Portfolio starter for ${str(values, "projectName")}.`,
  },
  {
    slug: "ecommerce-starter",
    name: "Ecommerce Starter",
    tagline: "Outline a product-led store starter with routes in place.",
    description: "Generate an ecommerce scaffold with product, cart, and checkout sections.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "ecommerce"],
    fileName: "store-starter.txt",
    outputLabel: "Starter",
    previewKind: "file-tree",
    fields: nextBoilerplateFields,
    buildOutput: (values) =>
      `${makeBoilerplateTree(values, [
  "app/",
  "  products/",
  "  cart/",
  "  checkout/",
  bool(values, "withApi") ? "  api/" : "  (no api routes)",
  "  page.tsx",
])}

// Store starter for ${str(values, "projectName")}.`,
  },
  {
    slug: "api-route-generator",
    name: "API Route Generator",
    tagline: "Generate an App Router route handler quickly.",
    description: "Build a route.ts snippet for a predictable GET, POST, PUT, or DELETE endpoint.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "api"],
    fileName: "route.ts",
    outputLabel: "Route handler",
    previewKind: "code",
    fields: nextRouteFields,
    buildOutput: makeRouteHandlerOutput,
    featured: true,
  },
  {
    slug: "server-action-generator",
    name: "Server Action Generator",
    tagline: "Create a server action stub with the right contract.",
    description: "Generate a use-server action that matches the fields you want to process.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "server-action"],
    fileName: "action.ts",
    outputLabel: "Action",
    previewKind: "code",
    fields: [
      textField("name", "Action name", "submitForm"),
      textField("exportName", "Export name", "submitData"),
      textField("description", "Description", "Save the submitted form data."),
    ],
    buildOutput: makeServerActionOutput,
  },
  {
    slug: "metadata-generator",
    name: "Metadata Generator",
    tagline: "Draft a Next.js metadata object for a page or section.",
    description: "Generate SEO metadata for a route, with canonical and social preview values.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "metadata", "seo"],
    fileName: "metadata.ts",
    outputLabel: "Metadata",
    previewKind: "code",
    fields: nextMetadataFields,
    buildOutput: makeMetadataOutput,
  },
  {
    slug: "route-handler-generator",
    name: "Route Handler Generator",
    tagline: "Build a direct route handler with a predictable response.",
    description: "Generate a clean route handler snippet for App Router APIs.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "route-handler"],
    fileName: "route-handler.ts",
    outputLabel: "Handler",
    previewKind: "code",
    fields: nextRouteFields,
    buildOutput: makeNextRouteOutput,
  },
  {
    slug: "layout-generator",
    name: "Layout Generator",
    tagline: "Draft a shared layout wrapper for a route segment.",
    description: "Generate a minimal layout.tsx snippet with a predictable container shell.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "layout"],
    fileName: "layout.tsx",
    outputLabel: "Layout",
    previewKind: "code",
    fields: [
      textField("name", "Layout name", "Dashboard"),
      toggleField("withSidebar", "Include sidebar", true),
      toggleField("withFooter", "Include footer", false),
    ],
    buildOutput: makeLayoutOutput,
  },
  {
    slug: "error-page-generator",
    name: "Error Page Generator",
    tagline: "Create an app error page that reads like a product surface.",
    description: "Generate an error.tsx component with a message, code, and support note.",
    category: "nextjs",
    cluster: "nextjs",
    tags: ["nextjs", "error-page"],
    fileName: "error.tsx",
    outputLabel: "Error page",
    previewKind: "component",
    fields: [
      textField("code", "Error code", "500"),
      textField("message", "Message", "Something went wrong."),
      textField("support", "Support note", "Please try again or contact support."),
    ],
    buildOutput: makeErrorOutput,
  },
];

export const generatorToolSpecs = [...tailwindGeneratorSpecs, ...nextGeneratorSpecs];

export function getGeneratorSpec(slug: string): GeneratorSpec | undefined {
  return generatorToolSpecs.find((spec) => spec.slug === slug);
}
