export interface RegexMatch {
  index: number;
  match: string;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface TextSegment {
  text: string;
  matched: boolean;
}

export interface RegexRunResult {
  error?: string;
  matches: RegexMatch[];
  segments: TextSegment[];
}

const MAX_MATCHES = 1000;

export function runRegex(pattern: string, flags: string, text: string): RegexRunResult {
  if (!pattern) {
    return { matches: [], segments: [{ text, matched: false }] };
  }

  let re: RegExp;
  try {
    re = new RegExp(pattern, flags);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Invalid regular expression",
      matches: [],
      segments: [{ text, matched: false }],
    };
  }

  const matches: RegexMatch[] = [];

  if (flags.includes("g")) {
    for (const m of text.matchAll(re)) {
      matches.push({
        index: m.index ?? 0,
        match: m[0],
        groups: m.slice(1).map((g) => g ?? ""),
        namedGroups: m.groups,
      });
      if (matches.length >= MAX_MATCHES) break;
    }
  } else {
    const m = re.exec(text);
    if (m) {
      matches.push({
        index: m.index ?? 0,
        match: m[0],
        groups: m.slice(1).map((g) => g ?? ""),
        namedGroups: m.groups,
      });
    }
  }

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.index > cursor) segments.push({ text: text.slice(cursor, m.index), matched: false });
    if (m.match.length > 0) segments.push({ text: m.match, matched: true });
    cursor = Math.max(cursor, m.index + m.match.length);
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), matched: false });
  if (segments.length === 0) segments.push({ text, matched: false });

  return { matches, segments };
}
