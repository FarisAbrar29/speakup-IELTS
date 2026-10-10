"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap, Mic, ChevronRight, RotateCcw, CheckCircle2, X, Sparkles, Lightbulb,
} from "lucide-react";
import { TOPICS, type Topic } from "@/lib/ielts-data";
import { useGameStore, type SessionRecord } from "@/store/game-store";
import { VoicePanel } from "./voice-panel";
import { TranscriptPanel } from "./transcript-panel";

type Phase = "intro" | "question" | "feedback" | "summary";

const QUESTION_TIME_SEC = 30;
const QUESTIONS_PER_SESSION = 5;

interface Part1SprintProps {
  presetTopicId?: string | null;
  onExit: () => void;
}

export function Part1Sprint({ presetTopicId, onExit }: Part1SprintProps) {
  const addSession = useGameStore((s) => s.addSession);
  const showTranscript = useGameStore((s) => s.showTranscript);

  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(
    presetTopicId ? TOPICS.find((t) => t.id === presetTopicId) || null : null
  );
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SEC);
  const [transcript, setTranscript] = useState("");
  const [skipLog, setSkipLog] = useState<boolean[]>([]);

  // timer
  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft <= 0) {
      // Defer state transition to next tick
      const id = setTimeout(() => setPhase("feedback"), 0);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const startSession = useCallback((topic: Topic) => {
    const shuffled = [...topic.part1].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SESSION);
    setSelectedTopic(topic);
    setQuestions(shuffled);
    setSkipLog(new Array(shuffled.length).fill(false));
    setCurrentIdx(0);
    setTranscript("");
    setTimeLeft(QUESTION_TIME_SEC);
    setPhase("question");
  }, []);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      // save session
      const session: SessionRecord = {
        id: `s-${Date.now()}`,
        topicId: selectedTopic!.id,
        topicName: selectedTopic!.name,
        mode: "part1",
        date: new Date().toISOString(),
        durationSec: QUESTIONS_PER_SESSION * QUESTION_TIME_SEC - timeLeft + currentIdx * QUESTION_TIME_SEC,
        transcript,
      };
      addSession(session);
      setPhase("summary");
    } else {
      setCurrentIdx((i) => i + 1);
      setTimeLeft(QUESTION_TIME_SEC);
      setTranscript("");
      setPhase("question");
    }
  }, [currentIdx, questions.length, selectedTopic, timeLeft, transcript, addSession]);

  const skipQuestion = useCallback(() => {
    setSkipLog((log) => {
      const next = [...log];
      next[currentIdx] = true;
      return next;
    });
    handleNext();
  }, [currentIdx, handleNext]);

  const restart = useCallback(() => {
    if (selectedTopic) startSession(selectedTopic);
  }, [selectedTopic, startSession]);

  // INTRO PHASE
  if (phase === "intro") {
    return (
      <div className="space-y-6 animate-fade-up">
        <header className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <Zap className="h-4 w-4 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold">Part 1 Sprint</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              5 pertanyaan acak, masing-masing {QUESTION_TIME_SEC} detik untuk menjawab. Latih kecepatan dan kelancaran.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pilih topik</CardTitle>
          </CardHeader>
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
                  <div className="text-[10px] text-muted-foreground">{t.part1.length} soal tersedia</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Tips Part 1</p>
              <p className="text-muted-foreground">Jawab dengan 2–3 kalimat. Mulai dengan jawaban langsung, lalu beri alasan atau contoh. Hindari jawaban "yes/no" pendek.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // QUESTION / FEEDBACK PHASE
  if (phase === "question" || phase === "feedback") {
    const topic = selectedTopic!;
    const progress = ((currentIdx + (phase === "feedback" ? 1 : 0)) / questions.length) * 100;
    return (
      <div className="space-y-5 animate-fade-up max-w-4xl mx-auto">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{topic.emoji}</span>
            <div>
              <div className="text-sm font-semibold">{topic.name}</div>
              <div className="text-xs text-muted-foreground">
                Question {currentIdx + 1} / {questions.length}
                {skipLog[currentIdx] && " · skipped"}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Progress value={progress} className="h-1.5" />

        <Card className="relative overflow-hidden">
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${topic.color}`} />
          <CardContent className="p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Examiner asks</div>
            <p className="text-xl md:text-2xl font-semibold leading-snug mb-6">
              {questions[currentIdx]}
            </p>

            {phase === "question" && (
              <div className="flex items-center justify-center my-6">
                <div className="relative">
                  <div className={`h-32 w-32 rounded-full flex items-center justify-center ${timeLeft <= 10 ? "bg-destructive/10" : "bg-primary/10"} breathe`}>
                    <div className={`text-5xl font-mono font-bold tabular-nums ${timeLeft <= 10 ? "text-destructive" : "text-primary"}`}>
                      {timeLeft}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {phase === "feedback" && (
              <div className="rounded-lg border bg-muted/30 p-4 mb-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your answer (transcribed)</div>
                <p className="text-sm leading-relaxed">
                  {transcript ? transcript : <span className="italic text-muted-foreground">Tidak ada transkrip. Aktifkan speech recognition atau rekam suara untuk merekam jawabanmu.</span>}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <VoicePanel compact />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <TranscriptPanel enabled={showTranscript} onTranscriptChange={setTranscript} />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={skipQuestion} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" /> Skip
          </Button>
          {phase === "question" ? (
            <Button onClick={() => setPhase("feedback")} className="gap-2">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              {currentIdx + 1 >= questions.length ? "Finish" : "Next Question"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // SUMMARY PHASE
  const completedCount = questions.length - skipLog.filter(Boolean).length;
  return (
    <div className="space-y-6 animate-fade-up max-w-2xl mx-auto text-center">
      <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-2">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-bold">Sprint Selesai! 🎉</h1>
      <p className="text-muted-foreground">
        Kamu menyelesaikan {completedCount} dari {questions.length} pertanyaan tentang <strong>{selectedTopic?.name}</strong>.
      </p>

      <Card>
        <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{completedCount}</div>
            <div className="text-xs text-muted-foreground">Answered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-500">{skipLog.filter(Boolean).length}</div>
            <div className="text-xs text-muted-foreground">Skipped</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{questions.length * QUESTION_TIME_SEC / 60}m</div>
            <div className="text-xs text-muted-foreground">Total time</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={restart} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button onClick={onExit} className="gap-2">
          <Sparkles className="h-4 w-4" /> Back to dashboard
        </Button>
      </div>
    </div>
  );
}
