"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOPICS } from "@/lib/ielts-data";
import { useGameStore } from "@/store/game-store";
import { Search, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { useMemo, useState } from "react";

interface TopicLibraryProps {
  onSelectTopic: (topicId: string, mode: "part1" | "part2" | "part3" | "vocab") => void;
}

export function TopicLibrary({ onSelectTopic }: TopicLibraryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const learnedTopicIds = useGameStore((s) => s.learnedTopicIds);
  const sessions = useGameStore((s) => s.sessions);

  const categories = useMemo(() => {
    const set = new Set(TOPICS.map((t) => t.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return TOPICS.filter((t) => {
      const matchesCat = category === "All" || t.category === category;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.vocabulary.some((v) => v.word.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold mb-1">Topic Library</h1>
        <p className="text-sm text-muted-foreground">
          {TOPICS.length} topik siap pakai. Setiap topik punya soal Part 1, cue card Part 2, pertanyaan Part 3, dan kosakata.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari topik atau kata kosakata..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              className="flex-shrink-0"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const learned = learnedTopicIds.includes(t.id);
          const topicSessions = sessions.filter((s) => s.topicId === t.id);
          return (
            <Card key={t.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${t.color}`} />
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{t.emoji}</div>
                  <div className="flex flex-col items-end gap-1">
                    {learned && (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:border-emerald-700 gap-1 text-[10px]">
                        <CheckCircle2 className="h-3 w-3" /> Learned
                      </Badge>
                    )}
                    {topicSessions.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Clock className="h-3 w-3" /> {topicSessions.length}×
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                <Badge variant="outline" className="self-start mb-3 text-[10px]">{t.category}</Badge>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{t.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-4">
                  <div>Part 1: {t.part1.length} Q</div>
                  <div>Cue card: 1</div>
                  <div>Part 3: {t.part3.length} Q</div>
                  <div>Vocab: {t.vocabulary.length}</div>
                </div>

                <div className="mt-auto grid grid-cols-4 gap-1">
                  <Button size="sm" variant="outline" onClick={() => onSelectTopic(t.id, "part1")} className="text-xs h-8">P1</Button>
                  <Button size="sm" variant="outline" onClick={() => onSelectTopic(t.id, "part2")} className="text-xs h-8">P2</Button>
                  <Button size="sm" variant="outline" onClick={() => onSelectTopic(t.id, "part3")} className="text-xs h-8">P3</Button>
                  <Button size="sm" variant="outline" onClick={() => onSelectTopic(t.id, "vocab")} className="text-xs h-8">Vocab</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>Tidak ada topik yang cocok. Coba kata kunci lain.</p>
        </div>
      )}
    </div>
  );
}
