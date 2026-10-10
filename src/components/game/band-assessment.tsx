"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BarChart3, Trophy, RotateCcw, Sparkles, Info,
} from "lucide-react";
import { TOPICS, BAND_DESCRIPTORS } from "@/lib/ielts-data";
import { useGameStore, type SessionRecord } from "@/store/game-store";

type Criterion = "fluency" | "lexical" | "grammar" | "pronunciation";

interface BandAssessmentProps {
  onExit: () => void;
}

const CRITERIA: { key: Criterion; label: string; weight: number; description: string }[] = [
  { key: "fluency", label: "Fluency & Coherence", weight: 0.25, description: "Kelancaran, alur bicara, koherensi antar kalimat" },
  { key: "lexical", label: "Lexical Resource", weight: 0.25, description: "Kosakata, paraphrase, idiom, kolokasi" },
  { key: "grammar", label: "Grammatical Range", weight: 0.25, description: "Variasi struktur kalimat & akurasi tata bahasa" },
  { key: "pronunciation", label: "Pronunciation", weight: 0.25, description: "Intonasi, stress, individual sounds" },
];

export function BandAssessment({ onExit }: BandAssessmentProps) {
  const addSession = useGameStore((s) => s.addSession);
  const sessions = useGameStore((s) => s.sessions);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id);
  const [scores, setScores] = useState<Record<Criterion, number>>({
    fluency: 6,
    lexical: 6,
    grammar: 6,
    pronunciation: 6,
  });
  const [submitted, setSubmitted] = useState(false);

  const overall = useMemo(() => {
    const sum = CRITERIA.reduce((acc, c) => acc + scores[c.key] * c.weight, 0);
    return Math.round(sum * 2) / 2; // round to nearest .5
  }, [scores]);

  const submit = () => {
    const topic = TOPICS.find((t) => t.id === selectedTopicId)!;
    const session: SessionRecord = {
      id: `s-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      mode: "assessment",
      date: new Date().toISOString(),
      bandScore: overall,
      notes: `F:${scores.fluency} L:${scores.lexical} G:${scores.grammar} P:${scores.pronunciation}`,
    };
    addSession(session);
    setSubmitted(true);
  };

  const reset = () => {
    setScores({ fluency: 6, lexical: 6, grammar: 6, pronunciation: 6 });
    setSubmitted(false);
  };

  const bandColor = (b: number) => {
    if (b >= 8) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30";
    if (b >= 7) return "text-lime-600 bg-lime-50 dark:bg-lime-950/30";
    if (b >= 6) return "text-amber-600 bg-amber-50 dark:bg-amber-950/30";
    if (b >= 5) return "text-orange-600 bg-orange-50 dark:bg-orange-950/30";
    return "text-rose-600 bg-rose-50 dark:bg-rose-950/30";
  };

  const recentAssessments = sessions.filter((s) => s.mode === "assessment").slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl mx-auto">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-lime-100 dark:bg-lime-900/40">
              <BarChart3 className="h-4 w-4 text-lime-600" />
            </div>
            <h1 className="text-2xl font-bold">Band Self-Assessment</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Skor dirimu sendiri pakai rubrik resmi IELTS. Jujur adalah kunci untuk improvement yang nyata.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
      </header>

      {submitted ? (
        <Card className="text-center p-8">
          <CardContent className="space-y-4">
            <div className="inline-flex p-4 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Trophy className="h-10 w-10 text-amber-600" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your Estimated Band</div>
              <div className={`text-7xl font-bold ${bandColor(overall)}`}>
                {overall.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {BAND_DESCRIPTORS.find((b) => b.band === Math.floor(overall))?.label || "Competent"}
              </div>
            </div>
            <Card className="text-left">
              <CardContent className="p-4 grid grid-cols-2 gap-3 text-sm">
                {CRITERIA.map((c) => (
                  <div key={c.key} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{c.label}</span>
                    <Badge variant="outline" className="font-mono">{scores[c.key].toFixed(1)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Assess again
              </Button>
              <Button onClick={onExit} className="gap-2">
                <Sparkles className="h-4 w-4" /> Done
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Topic selector */}
          <Card>
            <CardHeader><CardTitle className="text-base">Topik yang kamu latih</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopicId(t.id)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedTopicId === t.id
                        ? "border-primary bg-primary/5"
                        : "bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="text-2xl">{t.emoji}</div>
                    <div className="text-[11px] font-medium">{t.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Criteria */}
          {CRITERIA.map((c) => (
            <Card key={c.key}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{c.label}</span>
                  <Badge variant="outline" className="font-mono text-base">
                    {scores[c.key].toFixed(1)}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={scores[c.key].toString()}
                  onValueChange={(v) => setScores((s) => ({ ...s, [c.key]: Number(v) }))}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  {BAND_DESCRIPTORS.map((b) => (
                    <Label
                      key={b.band}
                      htmlFor={`${c.key}-${b.band}`}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/40 ${
                        scores[c.key] === b.band ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <RadioGroupItem value={b.band.toString()} id={`${c.key}-${b.band}`} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-base">Band {b.band}</span>
                          <Badge variant="secondary" className="text-[10px]">{b.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {b[c.key]}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Overall preview */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Overall Band (preview)</div>
                <div className={`text-4xl font-bold ${bandColor(overall)}`}>
                  {overall.toFixed(1)}
                </div>
              </div>
              <Button onClick={submit} className="gap-2">
                <Trophy className="h-4 w-4" /> Save Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Recent assessments */}
          {recentAssessments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" /> Recent Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                  {recentAssessments.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg border bg-card">
                      <div className="text-xl">{TOPICS.find((t) => t.id === s.topicId)?.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{s.topicName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(s.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <Badge className={`font-mono ${bandColor(s.bandScore || 0)}`}>
                        {s.bandScore?.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
