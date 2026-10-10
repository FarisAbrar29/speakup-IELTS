"use client";
import { useRef, useState, useCallback, useEffect } from "react";

// Minimal type defs for Web Speech API (not in default lib.dom.d.ts)
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface UseSpeechRecognitionReturn {
  supported: boolean;
  listening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(lang = "en-US"): UseSpeechRecognitionReturn {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;
    if (SpeechRecognition) {
      // Defer setSupported to next tick to avoid synchronous setState in effect body
      const id = setTimeout(() => setSupported(true), 0);
      const rec = new SpeechRecognition();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onresult = (e: SpeechRecognitionEvent) => {
        let finalText = "";
        let interimText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const result = e.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript + " ";
          } else {
            interimText += result[0].transcript;
          }
        }
        if (finalText) {
          setTranscript((prev) => (prev + " " + finalText).trim());
        }
        setInterimTranscript(interimText);
      };
      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error !== "no-speech" && e.error !== "aborted") {
          setError(`Speech recognition error: ${e.error}`);
        }
      };
      rec.onend = () => {
        setListening(false);
        setInterimTranscript("");
      };
      rec.onstart = () => {
        setListening(true);
        setError(null);
      };
      recognitionRef.current = rec;
      return () => {
        clearTimeout(id);
        try {
          recognitionRef.current?.abort();
        } catch {
          // ignore
        }
      };
    }
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
    };
  }, [lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch {
      // already started
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return { supported, listening, transcript, interimTranscript, error, start, stop, reset };
}
