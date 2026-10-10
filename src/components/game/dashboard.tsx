"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Trophy,
  BookOpen,
  Mic,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  RotateCcw,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { useGameStore } from "@/store/game-store";
import { TOPICS, TIP_BANK } from "@/lib/ielts-data";
import { useMemo } from "react";

interface DashboardProps {
  onNavigate: (view: string, topicId?: string) => void;
}

const MODES = [
  {
    id: "part1",
    title: "Part 1 Sprint",
    desc: "Rapid-fire Q&A — 5 questions, 30s each",
    emoji: "⚡",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "part2",
    title: "Part 2 Long Turn",
    desc: "Cue card + 1 min prep + 2 min speaking",
    emoji: "🎤",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "part3",
    title: "Part 3 Discussion",
    desc: "Abstract questions for deeper thinking",
    emoji: "💭",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    id: "vocab",
    title: "Vocab Flashcards",
    desc: "Flip cards to learn topic vocabulary",
    emoji: "📖",
    gradient: "from-sky-400 to-cyan-500",
  },
  {
    id: "wheel",
    title: "Topic Wheel",
    desc: "Spin to get a random challenge",
    emoji: "🎡",
    gradient: "from-fuchsia-400 to-purple-500",
  },
  {
    id: "assessment",
    title: "Band Self-Assessment",
    desc: "Score yourself with IELTS rubric",
    emoji: "📊",
    gradient: "from-lime-400 to-green-500",
  },
] as const;

export function Dashboard({ onNavigate }: DashboardProps) {
  // Select primitive values directly to avoid infinite re-render from object literal returns
  const sessions = useGameStore((s) => s.sessions);
  const vocabProgress = useGameStore((s) => s.vocabProgress);
  const learnedTopicIds = useGameStore((s) => s.learnedTopicIds);
  const streak = useGameStore((s) => s.streak);
  const tipOfDay = useMemo(() => {
    const dayIdx = new Date().getDate();
    return TIP_BANK[dayIdx % TIP_BANK.length];
  }, []);

  // Compute stats with useMemo to keep stable reference
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const scored = sessions.filter((s) => typeof s.bandScore === "number");
    const avgBand =
      scored.length > 0
        ? scored.reduce((sum, s) => sum + (s.bandScore || 0), 0) / scored.length
        : 0;
    const totalVocab = Object.values(vocabProgress).filter((v) => v.learned).length;
    const uniqueTopics = new Set(sessions.map((s) => s.topicId)).size;
    const totalPracticeMin = sessions.reduce(
      (sum, s) => sum + (s.durationSec || 0) / 60,
      0
    );
    return {
      totalSessions,
      avgBand: Math.round(avgBand * 10) / 10,
      totalVocab,
      uniqueTopics,
      totalPracticeMin: Math.round(totalPracticeMin),
      streak,
    };
  }, [sessions, vocabProgress, streak]);

  const statCards = [
    {
      label: "Day Streak",
      value: stats.streak,
      icon: Flame,
      color: "text-orange-500",
      hint: stats.streak > 0 ? "Tetap panaskan!" : "Mulai hari ini",
    },
    {
      label: "Sessions",
      value: stats.totalSessions,
      icon: Mic,
      color: "text-primary",
      hint: "Total practice",
    },
    {
      label: "Avg Band",
      value: stats.avgBand || "—",
      icon: Trophy,
      color: "text-amber-500",
      hint: stats.avgBand ? "Self-assessed" : "Belum ada skor",
    },
    {
      label: "Vocab",
      value: stats.totalVocab,
      icon: BookOpen,
      color: "text-sky-500",
      hint: "Words learned",
    },
    {
      label: "Topics",
      value: `${learnedTopicIds.length}/${TOPICS.length}`,
      icon: Target,
      color: "text-rose-500",
      hint: "Topics explored",
    },
    {
      label: "Practice",
      value: `${stats.totalPracticeMin}m`,
      icon: Clock,
      color: "text-emerald-500",
      hint: "Total minutes",
    },
  ];

  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive IELTS Speaking Game
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
            Speak Up, Score Higher.
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-6 max-w-2xl">
            Berlatih IELTS Speaking dengan 15+ topik populer, mode terapan berwaktu,
            perekaman suara, transkrip otomatis, dan self-assessment berbasis rubrik band
            resmi. Dibuat agar practice terasa seperti bermain game.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-white/90 shadow-lg gap-2"
              onClick={() => onNavigate("wheel")}
            >
              <Sparkles className="h-4 w-4" /> Surprise Me
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white gap-2"
              onClick={() => onNavigate("part1")}
            >
              <Mic className="h-4 w-4" /> Start Part 1
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Your Progress
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((s) => (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold tabular-nums">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-1">{s.hint}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Game Modes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Game Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map((mode) => (
            <Card
              key={mode.id}
              className="group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              onClick={() => onNavigate(mode.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${mode.gradient}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-3xl`}>{mode.emoji}</div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-base mb-1">{mode.title}</h3>
                <p className="text-xs text-muted-foreground">{mode.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tip of the day + Recent activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-900/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" /> Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{tipOfDay}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Recent Sessions
            </CardTitle>
            {sessions.length > 0 && (
              <Badge variant="secondary" className="text-xs">{sessions.length} total</Badge>
            )}
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Mic className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Belum ada sesi practice. Yuk mulai dari salah satu mode di atas!
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                {recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                  >
                    <div className="text-xl">
                      {TOPICS.find((t) => t.id === s.topicId)?.emoji || "📝"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.topicName}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(s.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {s.mode === "part1" ? "Part 1" : s.mode === "part2" ? "Part 2" : s.mode === "part3" ? "Part 3" : s.mode === "vocab" ? "Vocab" : s.mode === "wheel" ? "Wheel" : "Assessment"}
                        {s.durationSec ? ` · ${Math.floor(s.durationSec / 60)}m ${s.durationSec % 60}s` : ""}
                      </div>
                    </div>
                    {typeof s.bandScore === "number" && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        Band {s.bandScore}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Quick topic grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Browse Topics</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("library")} className="gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TOPICS.slice(0, 10).map((t) => {
            const learned = learnedTopicIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => onNavigate("library", t.id)}
                className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-md transition-all p-4 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.category}</div>
                  {learned && (
                    <div className="absolute top-0 right-0 text-emerald-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
