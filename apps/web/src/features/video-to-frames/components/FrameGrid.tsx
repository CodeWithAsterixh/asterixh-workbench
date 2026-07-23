import type { ExtractedFrame } from "@workbench-tools/video-to-frames";
import { formatBytes } from "@workbench-tools/video-to-frames";

export function FrameGrid({ frames }: { frames: ExtractedFrame[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {frames.map((frame) => (
        <div key={frame.index} className="relative aspect-square group panel-frame overflow-hidden">
          {/* Each frame was already decoded during extraction (preload: true),
              so the browser serves this from its decode cache — no flash. */}
          <img
            src={frame.dataUrl}
            alt={`Frame ${frame.index + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 bg-[var(--surface)]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-150 px-1.5 py-1 flex items-center justify-between">
            <span className="timecode">{String(frame.index + 1).padStart(3, "0")}</span>
            <span className="timecode">{formatBytes(frame.sizeBytes)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
