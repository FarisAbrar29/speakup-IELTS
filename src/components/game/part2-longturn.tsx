"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic, ChevronRight, RotateCcw, CheckCircle2, Sparkles, Lightbulb, Clock, Pencil,
} from "lucide-react";
import { TOPICS, type Topic } from "@/lib/ielts-data";
import { useGameStore, type SessionRecord } from "@/store/game-store";
import { VoicePanel } from "./voice-panel";
import { TranscriptPanel } from "./transcript-panel";
import { TimerRing } from "./timer-ring";

type Phase = "intro" | "prep" | "speak" | "summary";

const PREP_SEC = 60;
const SPEAK_SEC = 120;

interface Part2LongTurnProps {
  presetTopicId?: string | null;
  onExit: () => void;
}

export function Part2LongTurn({ presetTopicId, onExit }: Part2LongTurnProps) {
  const addSession = useGameStore((s) => s.addSession);
  const markTopicLearned = useGameStore((s) => s.markTopicLearned);
  const showTranscript = useGameStore((s) => s.showTranscript);

  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(
    presetTopicId ? TOPICS.find((t) => t.id === presetTopicId) || null : null
  );
  const [timeLeft, setTimeLeft] = useState(PREP_SEC);
  const [notes, setNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startSession = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setNotes("");
    setTranscript("");
    setAudioBlob(null);
    setTimeLeft(PREP_SEC);
    setPhase("prep");
  }, []);

  const finishSession = useCallback(() => {
    if (!selectedTopic) return;
    const session: SessionRecord = {
      id: `s-${Date.now()}`,
      topicId: selectedTopic.id,
      topicName: selectedTopic.name,
      mode: "part2",
      date: new Date().toISOString(),
      durationSec: PREP_SEC + SPEAK_SEC,
      transcript,
      notes,
    };
    addSession(session);
    markTopicLearned(selectedTopic.id);
    setPhase("summary");
  }, [selectedTopic, transcript, notes, addSession, markTopicLearned]);

  // timer
  useEffect(() => {
    if (phase !== "prep" && phase !== "speak") return;
    if (timeLeft <= 0) {
      // Defer state transitions to next tick to avoid synchronous setState in effect
      const id = setTimeout(() => {
        if (phase === "prep") {
          setPhase("speak");
          setTimeLeft(SPEAK_SEC);
        } else {
          finishSession();
        }
      }, 0);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, finishSession]);

  const handleFinish = useCallback(() => {
    finishSession();
  }, [finishSession]);

  // INTRO
  if (phase === "intro") {
    return (
      <div className="space-y-6 animate-fade-up">
        <header className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                <Mic className="h-4 w-4 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold">Part 2 Long Turn</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Cue card + 1 menit persiapan + 2 menit berbicara. Mode paling menantang untuk fluency dan koherensi.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Card>
          <CardHeader><CardTitle className="text-base">Pilih topik cue card</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => startSession(t)}
                  className="group p-3 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{t.cueCard.prompt}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-semibold">Tips Part 2</p>
              <ul className="text-muted-foreground space-y-1 list-disc pl-4">
                <li>Gunakan 1 menit untuk menulis kata kunci, bukan kalimat penuh.</li>
                <li>Ikuti bullet points sebagai panduan, tapi tidak harus urut.</li>
                <li>Bicara minimal 1 menit 30 detik — jangan berhenti terlalu cepat.</li>
                <li>Struktur: pengenalan → detail → contoh → refleksi pribadi.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // PREP PHASE
  if (phase === "prep") {
    const topic = selectedTopic!;
    return (
      <div className="space-y-5 animate-fade-up max-w-4xl mx-auto">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{topic.emoji}</span>
            <div>
              <div className="text-sm font-semibold">{topic.name}</div>
              <div className="text-xs text-muted-foreground">Preparation phase</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Card className="relative overflow-hidden">
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${topic.color}`} />
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="gap-1">
                <Pencil className="h-3 w-3" /> Cue Card
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" /> Prep: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </Badge>
            </div>
            <p className="text-xl md:text-2xl font-semibold leading-snug mb-4">
              {topic.cueCard.prompt}
            </p>
            <ul className="space-y-2 mb-4">
              {topic.cueCard.bulletPoints.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Catatan persiapan (kata kunci saja):</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tulis poin-poin singkat di sini..."
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <TimerRing
            totalSec={PREP_SEC}
            remainingSec={timeLeft}
            size={140}
            phaseLabel="Preparation"
            label={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")} left`}
            accent="accent"
          />
        </div>

        <div className="flex justify-center">
          <Button onClick={() => { setPhase("speak"); setTimeLeft(SPEAK_SEC); }} className="gap-2">
            <Mic className="h-4 w-4" /> Start speaking now
          </Button>
        </div>
      </div>
    );
  }

  // SPEAK PHASE
  if (phase === "speak") {
    const topic = selectedTopic!;
    return (
      <div className="space-y-5 animate-fade-up max-w-4xl mx-auto">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{topic.emoji}</span>
            <div>
              <div className="text-sm font-semibold">{topic.name}</div>
              <div className="text-xs text-muted-foreground">Speaking phase</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">{topic.cueCard.prompt}</p>
            <div className="flex flex-wrap gap-1.5">
              {topic.cueCard.bulletPoints.map((b, i) => (
                <Badge key={i} variant="outline" className="text-[10px] font-normal">{b}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <TimerRing
            totalSec={SPEAK_SEC}
            remainingSec={timeLeft}
            size={220}
            phaseLabel="Speaking"
            label={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")} left`}
            accent={timeLeft <= 30 ? "destructive" : "primary"}
          />
        </div>

        <Card>
          <CardContent className="p-4">
            <VoicePanel
              onRecordingComplete={(blob) => setAudioBlob(blob)}
              compact
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <TranscriptPanel enabled={showTranscript} onTranscriptChange={setTranscript} />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={handleFinish} className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Finish early
          </Button>
        </div>
      </div>
    );
  }

  // SUMMARY
  const topic = selectedTopic!;
  return (
    <div className="space-y-6 animate-fade-up max-w-2xl mx-auto text-center">
      <div className="inline-flex p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
        <CheckCircle2 className="h-10 w-10 text-amber-600" />
      </div>
      <h1 className="text-3xl font-bold">Long Turn Selesai! 🎉</h1>
      <p className="text-muted-foreground">
        Hebat! Kamu menyelesaikan cue card tentang <strong>{topic.name}</strong>.
      </p>

      <Card>
        <CardContent className="p-6 space-y-4 text-left">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cue Card</div>
            <p className="text-sm font-medium">{topic.cueCard.prompt}</p>
          </div>
          {notes && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your Notes</div>
              <p className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">{notes}</p>
            </div>
          )}
          {transcript && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your Transcript</div>
              <p className="text-sm leading-relaxed">{transcript}</p>
            </div>
          )}
          {audioBlob && (
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <Mic className="h-3.5 w-3.5" /> Recording saved
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30">
        <CardContent className="p-4 text-left">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Sample Answer</div>
          <p className="text-sm leading-relaxed italic">{topic.sampleAnswer}</p>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => startSession(topic)} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button onClick={onExit} className="gap-2">
          <Sparkles className="h-4 w-4" /> Back to dashboard
        </Button>
      </div>
    </div>
  );
}
