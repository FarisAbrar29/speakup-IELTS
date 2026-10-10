"use client";
import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Volume2, Shuffle,
} from "lucide-react";
import { TOPICS, type VocabItem, type Topic } from "@/lib/ielts-data";
import { useGameStore } from "@/store/game-store";
import { toast } from "sonner";

interface VocabFlashcardsProps {
  presetTopicId?: string | null;
  onExit: () => void;
}

export function VocabFlashcards({ presetTopicId, onExit }: VocabFlashcardsProps) {
  const toggleLearned = useGameStore((s) => s.toggleVocabLearned);
  const vocabProgress = useGameStore((s) => s.vocabProgress);
  const addSession = useGameStore((s) => s.addSession);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(
    presetTopicId ? TOPICS.find((t) => t.id === presetTopicId) || null : null
  );
const [shuffled, setShuffled] = useState<VocabItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedSet, setReviewedSet] = useState<Set<string>>(new Set());

  const startTopic = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setShuffled([...topic.vocabulary]);
    setCurrentIdx(0);
    setFlipped(false);
    setReviewedSet(new Set());
  }, []);

  const shuffleCards = useCallback(() => {
    setShuffled((s) => [...s].sort(() => Math.random() - 0.5));
    setCurrentIdx(0);
    setFlipped(false);
  }, []);

  const next = useCallback(() => {
    if (currentIdx < shuffled.length - 1) {
      setCurrentIdx((i) => i + 1);
      setFlipped(false);
    }
  }, [currentIdx, shuffled.length]);

  const prev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setFlipped(false);
    }
  }, [currentIdx]);

  const markLearned = useCallback(
    (item: VocabItem) => {
      toggleLearned(item.word, selectedTopic!.id);
      setReviewedSet((s) => new Set(s).add(item.word));
      const isLearned = vocabProgress[item.word]?.learned;
      toast.success(isLearned ? "Marked as not learned" : `Marked "${item.word}" as learned`);
    },
    [toggleLearned, selectedTopic, vocabProgress]
  );

  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }, []);

  const saveAndExit = useCallback(() => {
    if (selectedTopic && reviewedSet.size > 0) {
      addSession({
        id: `s-${Date.now()}`,
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        mode: "vocab",
        date: new Date().toISOString(),
        notes: `Reviewed ${reviewedSet.size} vocabulary items`,
      });
    }
    onExit();
  }, [selectedTopic, reviewedSet, addSession, onExit]);

  // INTRO
if (!selectedTopic || shuffled.length === 0) {
    return (
      <div className="space-y-6 animate-fade-up">
        <header className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/40">
                <BookOpen className="h-4 w-4 text-sky-600" />
              </div>
              <h1 className="text-2xl font-bold">Vocabulary Flashcards</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Pelajari kosakata tingkat lanjut per topik. Klik kartu untuk membalik, tandai yang sudah dikuasai.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </header>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {TOPICS.map((t) => {
                const learnedCount = t.vocabulary.filter((v) => vocabProgress[v.word]?.learned).length;
                return (
                  <button
                    key={t.id}
                    onClick={() => startTopic(t)}
                    className="group p-3 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all text-left"
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {learnedCount}/{t.vocabulary.length} learned
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (shuffled.length === 0) {
    return null;
  }

  const current = shuffled[currentIdx];
  const isLearned = vocabProgress[current.word]?.learned;
  const totalLearned = shuffled.filter((v) => vocabProgress[v.word]?.learned).length;

  return (
    <div className="space-y-5 animate-fade-up max-w-2xl mx-auto">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedTopic.emoji}</span>
          <div>
            <div className="text-sm font-semibold">{selectedTopic.name}</div>
            <div className="text-xs text-muted-foreground">
              Card {currentIdx + 1} / {shuffled.length} · {totalLearned} learned
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={shuffleCards} className="gap-1">
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </Button>
          <Button variant="ghost" size="sm" onClick={saveAndExit}>Exit</Button>
        </div>
      </header>

      {/* Flashcard */}
      <div
        className={`flip-card h-80 cursor-pointer ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flip-inner">
          {/* Front */}
          <div className="flip-face">
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-0 space-y-4">
                <Badge variant="outline" className="text-[10px]">{current.pos}</Badge>
                <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                  {current.word}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); speak(current.word); }}
                  className="gap-1 text-muted-foreground"
                >
                  <Volume2 className="h-4 w-4" /> Pronounce
                </Button>
                <p className="text-xs text-muted-foreground">Click anywhere to flip</p>
              </CardContent>
            </Card>
          </div>
          {/* Back */}
          <div className="flip-face flip-back">
            <Card className="h-full flex flex-col justify-center p-6 md:p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30">
              <CardContent className="p-0 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Definition</div>
                  <p className="text-sm md:text-base font-medium">{current.definition}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Example</div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">"{current.example}"</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); speak(current.example); }}
                  className="gap-1 text-xs self-start"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Hear example
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={prev} disabled={currentIdx === 0} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <Button
          variant={isLearned ? "default" : "outline"}
          size="sm"
          onClick={() => markLearned(current)}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isLearned ? "Learned" : "Mark as learned"}
        </Button>
        <Button variant="outline" size="sm" onClick={next} disabled={currentIdx === shuffled.length - 1} className="gap-1">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {shuffled.map((v, i) => {
          const learned = vocabProgress[v.word]?.learned;
          return (
            <button
              key={v.word}
              onClick={() => { setCurrentIdx(i); setFlipped(false); }}
              className={`h-2 rounded-full transition-all ${
                i === currentIdx
                  ? "w-6 bg-primary"
                  : learned
                  ? "w-2 bg-emerald-500"
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Card ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
