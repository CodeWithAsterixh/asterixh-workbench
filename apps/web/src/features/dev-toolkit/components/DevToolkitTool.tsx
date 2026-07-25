"use client";

import { useState } from "react";
import { Base64Panel } from "./Base64Panel";
import { HashPanel } from "./HashPanel";
import { UuidPanel } from "./UuidPanel";

const TABS = [
  { id: "base64", label: "Base64" },
  { id: "hash", label: "Hash" },
  { id: "uuid", label: "UUID" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DevToolkitTool() {
  const [tab, setTab] = useState<TabId>("base64");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="btn btn--ghost"
            style={{
              borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
              color: tab === t.id ? "var(--text-primary)" : undefined,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "base64" && <Base64Panel />}
      {tab === "hash" && <HashPanel />}
      {tab === "uuid" && <UuidPanel />}
    </div>
  );
}
