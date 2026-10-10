"use client";
import { Mic, Pause, Play, Square, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

interface VoicePanelProps {
  onRecordingComplete?: (blob: Blob | null, durationSec: number) => void;
  compact?: boolean;
}

export function VoicePanel({ onRecordingComplete, compact }: VoicePanelProps) {
  const {
    isRecording,
    isPaused,
    durationSec,
    audioUrl,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useVoiceRecorder();

  const handleStop = async () => {
    const blob = await stop();
    onRecordingComplete?.(blob, durationSec);
  };

  return (
    <div className={`flex flex-col gap-3 ${compact ? "" : "p-4 rounded-xl border bg-card"}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {isRecording ? (
            <span className="relative inline-flex h-3 w-3 text-destructive recording-dot">
              <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
            </span>
          ) : (
            <span className="inline-flex h-3 w-3 rounded-full bg-muted-foreground/40" />
          )}
          <span className="font-mono text-sm tabular-nums">
            {fmtTime(durationSec)}
          </span>
          {isRecording && (
            <Badge variant={isPaused ? "secondary" : "destructive"} className="text-xs">
              {isPaused ? "Paused" : "Recording"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button size="sm" onClick={start} className="gap-2">
              <Mic className="h-4 w-4" /> Record
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button size="sm" variant="outline" onClick={resume} className="gap-2">
                  <Play className="h-4 w-4" /> Resume
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={pause} className="gap-2">
                  <Pause className="h-4 w-4" /> Pause
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={handleStop} className="gap-2">
                <Square className="h-4 w-4" /> Stop
              </Button>
            </>
          )}
          {audioUrl && !isRecording && (
            <Button size="sm" variant="ghost" onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {audioUrl && !isRecording && (
        <audio controls src={audioUrl} className="w-full h-10" />
      )}
    </div>
  );
}
