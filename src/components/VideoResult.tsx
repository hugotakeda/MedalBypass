"use client";

import { Download, PlayCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface VideoResultProps {
  src: string;
  clipId: string;
}

export default function VideoResult({ src, clipId }: VideoResultProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      // Fetch as blob to force download instead of open in new tab
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `MedalTV_${clipId}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: simply open link in new tab if fetching blob fails due to CORS
      window.open(src, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl group">
        <video
          src={src}
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23111'/%3E%3C/svg%3E"
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-500 mix-blend-overlay" />
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 text-zinc-400" />
            Download mp4
          </>
        )}
      </button>
    </div>
  );
}
