import type { CategoryId } from "@/data/categories";

export type GeneratorCluster = "tailwind" | "nextjs";
export type GeneratorPreviewKind = "swatches" | "layout" | "component" | "theme" | "file-tree" | "code";
export type GeneratorValue = string | number | boolean;
export type GeneratorValues = Record<string, GeneratorValue>;

export interface GeneratorFieldBase {
  key: string;
  label: string;
}

export interface TextField extends GeneratorFieldBase {
  type: "text";
  defaultValue: string;
  placeholder?: string;
}

export interface TextareaField extends GeneratorFieldBase {
  type: "textarea";
  defaultValue: string;
  rows?: number;
  placeholder?: string;
}

export interface NumberField extends GeneratorFieldBase {
  type: "number";
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ColorField extends GeneratorFieldBase {
  type: "color";
  defaultValue: string;
}

export interface SelectField extends GeneratorFieldBase {
  type: "select";
  defaultValue: string;
  options: Array<{ label: string; value: string }>;
}

export interface ToggleField extends GeneratorFieldBase {
  type: "toggle";
  defaultValue: boolean;
}

export type GeneratorField = TextField | TextareaField | NumberField | ColorField | SelectField | ToggleField;

export interface GeneratorStep {
  title: string;
  body: string;
}

export interface GeneratorHowItWorks {
  input: string;
  output: string;
  steps: GeneratorStep[];
}

export interface GeneratorSpec {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  cluster: GeneratorCluster;
  tags: string[];
  fileName: string;
  outputLabel: string;
  previewKind: GeneratorPreviewKind;
  fields: GeneratorField[];
  buildOutput: (values: GeneratorValues) => string;
  featured?: boolean;
}

export const textField = (key: string, label: string, defaultValue: string, placeholder?: string): TextField => ({
  key,
  label,
  type: "text",
  defaultValue,
  placeholder,
});

export const textareaField = (key: string, label: string, defaultValue: string, rows = 4, placeholder?: string): TextareaField => ({
  key,
  label,
  type: "textarea",
  defaultValue,
  rows,
  placeholder,
});

export const numberField = (
  key: string,
  label: string,
  defaultValue: number,
  min?: number,
  max?: number,
  step?: number,
): NumberField => ({
  key,
  label,
  type: "number",
  defaultValue,
  min,
  max,
  step,
});

export const colorField = (key: string, label: string, defaultValue: string): ColorField => ({
  key,
  label,
  type: "color",
  defaultValue,
});

export const selectField = (
  key: string,
  label: string,
  defaultValue: string,
  options: Array<{ label: string; value: string }>,
): SelectField => ({
  key,
  label,
  type: "select",
  defaultValue,
  options,
});

export const toggleField = (key: string, label: string, defaultValue: boolean): ToggleField => ({
  key,
  label,
  type: "toggle",
  defaultValue,
});

export function toTitleCase(value: string): string {
  return value
    .replace(/[-_/]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function humanizeCluster(cluster: GeneratorCluster): string {
  return cluster === "tailwind" ? "Tailwind CSS" : "Next.js";
}

export function buildGeneratorHowItWorks(spec: GeneratorSpec): GeneratorHowItWorks {
  const clusterLabel = humanizeCluster(spec.cluster);

  if (spec.cluster === "tailwind") {
    return {
      input: `A ${clusterLabel} direction for ${spec.name.toLowerCase()} plus the colors, spacing, and layout choices you want to lock in.`,
      output: `${spec.name} code ready to paste into a Tailwind project, with a clean preview and copyable snippet.`,
      steps: [
        { title: "Pick the base direction", body: `Set the theme, layout, or component style you want ${spec.name.toLowerCase()} to generate.` },
        { title: "Tune the inputs", body: "Adjust color, spacing, radius, or typography values until the preview matches the job." },
        { title: "Review the code", body: "The output panel shows the exact Tailwind-ready snippet before you copy it." },
        { title: "Paste it into the project", body: "Use the snippet as-is or tweak it to fit your existing design system." },
      ],
    };
  }

  return {
    input: `A ${clusterLabel} starter brief for ${spec.name.toLowerCase()} plus the route, structure, and configuration choices you want.`,
    output: `${spec.name} starter files and snippet output, ready to copy into a Next.js project.`,
    steps: [
      { title: "Choose the scaffold", body: `Pick the starter structure that matches the way you want to build ${spec.name.toLowerCase()}.` },
      { title: "Set the project details", body: "Adjust names, routes, and config flags so the generated code matches your app." },
      { title: "Review the structure", body: "Check the file tree and code preview before copying anything over." },
      { title: "Paste the starter pieces", body: "Move the generated files into your Next.js project and continue from there." },
    ],
  };
}
