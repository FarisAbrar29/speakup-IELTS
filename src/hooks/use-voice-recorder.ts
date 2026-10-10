"use client";
import { useRef, useState, useCallback, useEffect } from "react";

interface UseVoiceRecorderOptions {
  onChunk?: (blob: Blob) => void;
}

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  durationSec: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => Promise<Blob | null>;
  reset: () => void;
  error: string | null;
}

export function useVoiceRecorder(opts: UseVoiceRecorderOptions = {}): UseVoiceRecorderReturn {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Browser tidak mendukung perekaman audio.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          opts.onChunk?.(e.data);
        }
      };
      recorder.start(250);
      startTimeRef.current = Date.now();
      accumulatedRef.current = 0;
      setIsRecording(true);
      setIsPaused(false);
      setDurationSec(0);
      timerRef.current = setInterval(() => {
        if (recorder.state === "recording") {
          const elapsed = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000;
          setDurationSec(Math.floor(elapsed));
        }
      }, 250);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Tidak bisa mengakses mikrofon: ${err.message}`
          : "Gagal mengakses mikrofon."
      );
    }
  }, [opts]);

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
      setIsPaused(true);
      clearTimer();
    }
  }, []);

  const resume = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      startTimeRef.current = Date.now();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        if (recorder.state === "recording") {
          const elapsed = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000;
          setDurationSec(Math.floor(elapsed));
        }
      }, 250);
    }
  }, []);

  const stop = useCallback(async () => {
    return new Promise<Blob | null>((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        clearTimer();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        resolve(blob);
      };
      if (recorder.state !== "inactive") {
        recorder.stop();
      } else {
        resolve(null);
      }
    });
  }, []);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDurationSec(0);
    setIsRecording(false);
    setIsPaused(false);
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      clearTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { isRecording, isPaused, durationSec, audioBlob, audioUrl, start, pause, resume, stop, reset, error };
}
