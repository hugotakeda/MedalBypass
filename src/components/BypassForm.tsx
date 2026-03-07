"use client";

import { useState } from "react";
import { Loader2, Link as LinkIcon, AlertCircle } from "lucide-react";
import VideoResult from "./VideoResult";

export default function BypassForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ src: string; id: string } | null>(null);

  const extractClipID = (urlStr: string) => {
    const clipIdMatch = urlStr.match(/\/clips\/([^\/?&#]+)/);
    const contentIdMatch = urlStr.match(/[?&]contentId=([^&#]+)/);
    if (clipIdMatch) return clipIdMatch[1];
    if (contentIdMatch) return contentIdMatch[1];
    return "unknown";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/bypass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error(data.reasoning || "Failed to bypass watermark.");
      }

      setResult({ src: data.src, id: extractClipID(url) });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <LinkIcon className="h-5 w-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Medal URL here (e.g., https://medal.tv/clips/...)"
          required
          disabled={loading}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-32 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="absolute inset-y-2 right-2 px-6 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Bypass"
          )}
        </button>
      </form>

      {error && (
        <div className="flex animate-in fade-in slide-in-from-top-4 items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <VideoResult src={result.src} clipId={result.id} />
        </div>
      )}
    </div>
  );
}
