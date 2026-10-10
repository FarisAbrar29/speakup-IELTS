"use client";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { FILLER_WORDS, DISCOURSE_MARKERS } from "@/lib/ielts-data";
import { AlertCircle } from "lucide-react";

interface TranscriptPanelProps {
  enabled: boolean;
  onTranscriptChange?: (text: string) => void;
  className?: string;
}

function highlightFillers(text: string) {
  if (!text) return null;
  const tokens = text.split(/(\s+)/);
  return tokens.map((tok, i) => {
    const lower = tok.toLowerCase().replace(/[.,!?;:"]/g, "");
    if (FILLER_WORDS.includes(lower)) {
      return (
        <mark key={i} className="bg-amber-200/70 dark:bg-amber-500/30 rounded px-0.5">
          {tok}
        </mark>
      );
    }
    if (DISCOURSE_MARKERS.includes(lower)) {
      return (
        <span key={i} className="text-primary font-semibold">
          {tok}
        </span>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}

export function TranscriptPanel({ enabled, onTranscriptChange, className }: TranscriptPanelProps) {
  const { supported, listening, transcript, interimTranscript, error, start, stop, reset } =
    useSpeechRecognition();

  useEffect(() => {
    onTranscriptChange?.(transcript);
  }, [transcript, onTranscriptChange]);

  if (!enabled) return null;

  const words = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const fillerCount = (transcript.toLowerCase().match(new RegExp(`\\b(${FILLER_WORDS.join("|")})\\b`, "g")) || []).length;
  const markerCount = (transcript.toLowerCase().match(new RegExp(`\\b(${DISCOURSE_MARKERS.join("|")})\\b`, "g")) || []).length;
  const wpm = words > 0 && listening ? Math.round((words / Math.max(1, 1)) * 60) : 0;

  return (
    <div className={`flex flex-col gap-3 ${className || ""}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={listening ? "default" : "secondary"} className="gap-1">
            {listening ? "● Listening" : "Idle"}
          </Badge>
          {!supported && (
            <Badge variant="outline" className="text-amber-600">
              Not supported
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {!listening ? (
            <button
              type="button"
              onClick={start}
              disabled={!supported}
              className="text-xs text-primary hover:underline disabled:opacity-50"
            >
              Start transcription
            </button>
          ) : (
            <button
              type="button"
              onClick={stop}
              className="text-xs text-destructive hover:underline"
            >
              Stop
            </button>
          )}
          {transcript && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-muted-foreground hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-lg border bg-muted/40 p-4 min-h-[120px] max-h-[280px] overflow-y-auto scrollbar-thin">
        <p className="text-sm leading-relaxed">
          {transcript ? (
            highlightFillers(transcript)
          ) : (
            <span className="text-muted-foreground italic">
              {supported
                ? "Transkrip akan muncul di sini saat kamu berbicara..."
                : "Browser ini tidak mendukung speech recognition. Coba Chrome atau Edge."}
            </span>
          )}
          {interimTranscript && (
            <span className="text-muted-foreground/60 italic"> {interimTranscript}</span>
          )}
        </p>
      </div>

      {transcript && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded-md bg-card border p-2">
            <div className="text-muted-foreground">Words</div>
            <div className="font-semibold text-base">{words}</div>
          </div>
          <div className="rounded-md bg-card border p-2">
            <div className="text-muted-foreground">Fillers</div>
            <div className="font-semibold text-base text-amber-600">{fillerCount}</div>
          </div>
          <div className="rounded-md bg-card border p-2">
            <div className="text-muted-foreground">Markers</div>
            <div className="font-semibold text-base text-primary">{markerCount}</div>
          </div>
          <div className="rounded-md bg-card border p-2">
            <div className="text-muted-foreground">~WPM</div>
            <div className="font-semibold text-base">{wpm}</div>
          </div>
        </div>
      )}
    </div>
  );
}
