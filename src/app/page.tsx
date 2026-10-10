"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home as HomeIcon, Library, Zap, Mic, Brain, BookOpen, Dices, BarChart3, Flame, Menu, X,
} from "lucide-react";
import { useGameStore, useHydrateStore, type GameMode } from "@/store/game-store";
import { Dashboard } from "@/components/game/dashboard";
import { TopicLibrary } from "@/components/game/topic-library";
import { Part1Sprint } from "@/components/game/part1-sprint";
import { Part2LongTurn } from "@/components/game/part2-longturn";
import { Part3Discussion } from "@/components/game/part3-discussion";
import { VocabFlashcards } from "@/components/game/vocab-flashcards";
import { TopicWheel } from "@/components/game/topic-wheel";
import { BandAssessment } from "@/components/game/band-assessment";
import { ThemeToggle } from "@/components/theme-toggle";

type View = GameMode | "dashboard" | "library";

const NAV_ITEMS: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Home", icon: HomeIcon },
  { id: "library", label: "Topics", icon: Library },
  { id: "part1", label: "Part 1", icon: Zap },
  { id: "part2", label: "Part 2", icon: Mic },
  { id: "part3", label: "Part 3", icon: Brain },
  { id: "vocab", label: "Vocab", icon: BookOpen },
  { id: "wheel", label: "Wheel", icon: Dices },
  { id: "assessment", label: "Assess", icon: BarChart3 },
];

export default function Home() {
  const activeView = useGameStore((s) => s.activeView);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const selectedTopicId = useGameStore((s) => s.selectedTopicId);
  const setSelectedTopicId = useGameStore((s) => s.setSelectedTopicId);
  const streak = useGameStore((s) => s.streak);
  const updateStreak = useGameStore((s) => s.updateStreak);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Manually hydrate Zustand persist store on the client to avoid SSR mismatch loops
  useHydrateStore();

  // update streak after hydration completes
  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => {
      updateStreak();
    });
    if (useGameStore.persist.hasHydrated()) {
      updateStreak();
    }
    return unsub;
  }, [updateStreak]);

  const navigate = useCallback(
    (view: string, topicId?: string) => {
      if (topicId !== undefined) setSelectedTopicId(topicId);
      setActiveView(view as View);
      setMobileNavOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setActiveView, setSelectedTopicId]
  );

  const handleTopicSelect = useCallback(
    (topicId: string, mode: GameMode) => {
      setSelectedTopicId(topicId);
      setActiveView(mode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setActiveView, setSelectedTopicId]
  );

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "library":
        return <TopicLibrary onSelectTopic={handleTopicSelect} />;
      case "part1":
        return <Part1Sprint presetTopicId={selectedTopicId} onExit={() => navigate("dashboard")} />;
      case "part2":
        return <Part2LongTurn presetTopicId={selectedTopicId} onExit={() => navigate("dashboard")} />;
      case "part3":
        return <Part3Discussion presetTopicId={selectedTopicId} onExit={() => navigate("dashboard")} />;
      case "vocab":
        return <VocabFlashcards presetTopicId={selectedTopicId} onExit={() => navigate("dashboard")} />;
      case "wheel":
        return (
          <TopicWheel
            onSelectTopic={handleTopicSelect}
            onExit={() => navigate("dashboard")}
          />
        );
      case "assessment":
        return <BandAssessment onExit={() => navigate("dashboard")} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Mic className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-sm leading-tight">SpeakUp</div>
              <div className="text-[10px] text-muted-foreground leading-tight">IELTS Speaking Game</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-2xl">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side: streak + theme */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {streak > 0 && (
              <Badge variant="outline" className="gap-1 text-amber-700 dark:text-amber-400 border-amber-300/50 dark:border-amber-700/50">
                <Flame className="h-3.5 w-3.5" /> {streak}
              </Badge>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <nav className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-4 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white">
              <Mic className="h-3 w-3" />
            </div>
            <span>SpeakUp IELTS · Practice Game</span>
          </div>
          <div className="flex items-center gap-4">
            <span>15+ topics · 6 game modes · Voice + Transcript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
