"use client";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain, ChevronRight, RotateCcw, CheckCircle2, Sparkles, Lightbulb, MessageSquare,
} from "lucide-react";
import { TOPICS, type Topic } from "@/lib/ielts-data";
import { useGameStore, type SessionRecord } from "@/store/game-store";
import { VoicePanel } from "./voice-panel";
import { TranscriptPanel } from "./transcript-panel";

interface Part3DiscussionProps {
  presetTopicId?: string | null;
  onExit: () => void;
}

export function Part3Discussion({ presetTopicId, onExit }: Part3DiscussionProps) {
  const addSession = useGameStore((s) => s.addSession);
  const showTranscript = useGameStore((s) => s.showTranscript);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(
    presetTopicId ? TOPICS.find((t) => t.id === presetTopicId) || null : null
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  const startSession = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentIdx(0);
    setTranscript("");
    setAnswers(new Array(topic.part3.length).fill(""));
  }, []);

  const saveAndExit = useCallback(() => {
    if (!selectedTopic) return;
    const session: SessionRecord = {
      id: `s-${Date.now()}`,
      topicId: selectedTopic.id,
      topicName: selectedTopic.name,
      mode: "part3",
      date: new Date().toISOString(),
      transcript: answers.filter(Boolean).join("\n---\n"),
    };
    addSession(session);
    onExit();
  }, [selectedTopic, answers, addSession, onExit]);

  // INTRO
  if (!selectedTopic) {
    return (
      <div className="space-y-6 animate-fade-up">
        <header className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40">
                <Brain className="h-4 w-4 text-rose-600" />
              </div>
              <h1 className="text-2xl font-bold">Part 3 Discussion</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Pertanyaan abstrak yang menuntut pemikiran kritis, opini, dan argumentasi terstruktur.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Card>
          <CardHeader><CardTitle className="text-base">Pilih topik diskusi</CardTitle></CardHeader>
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
                  <div className="text-[10px] text-muted-foreground">{t.part3.length} discussion Q</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-semibold">Tips Part 3</p>
              <ul className="text-muted-foreground space-y-1 list-disc pl-4">
                <li>Struktur jawaban: Posisi → Alasan → Contoh → Kontra-argumen (opsional).</li>
                <li>Gunakan penanda wacana: "On the other hand", "In addition", "However".</li>
                <li>Jangan takut mengubah opini di tengah jawaban — itu menunjukkan fleksibilitas.</li>
                <li>Hubungkan jawaban dengan pengalaman atau observasi pribadi.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topic = selectedTopic;
  const question = topic.part3[currentIdx];
  const isLast = currentIdx === topic.part3.length - 1;

  const handleNext = () => {
    setAnswers((a) => {
      const next = [...a];
      next[currentIdx] = transcript;
      return next;
    });
    if (isLast) {
      saveAndExit();
    } else {
      setCurrentIdx((i) => i + 1);
      setTranscript("");
    }
  };

  return (
    <div className="space-y-5 animate-fade-up max-w-4xl mx-auto">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{topic.emoji}</span>
          <div>
            <div className="text-sm font-semibold">{topic.name}</div>
            <div className="text-xs text-muted-foreground">
              Discussion {currentIdx + 1} / {topic.part3.length}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
      </header>

      <Card className="relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${topic.color}`} />
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="h-3 w-3" /> Discussion Q
            </Badge>
          </div>
          <p className="text-xl md:text-2xl font-semibold leading-snug mb-6">{question}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Jawabanmu (bisa ditulis atau ditranskrip dari suara)</label>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Tulis jawabanmu di sini, atau aktifkan speech recognition di bawah..."
                className="min-h-[200px]"
              />
              <div className="text-[10px] text-muted-foreground mt-1 text-right">
                {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words
              </div>
            </div>
            <div className="space-y-3">
              <VoicePanel compact />
              <TranscriptPanel enabled={showTranscript} onTranscriptChange={setTranscript} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentIdx > 0) {
              setCurrentIdx((i) => i - 1);
              setTranscript(answers[currentIdx - 1] || "");
            }
          }}
          disabled={currentIdx === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext} className="gap-2">
          {isLast ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Finish
            </>
          ) : (
            <>
              Next Question <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
