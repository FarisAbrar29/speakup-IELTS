"use client";
import { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dices, Sparkles, ChevronRight, RotateCcw,
} from "lucide-react";
import { TOPICS, type Topic } from "@/lib/ielts-data";
import { useGameStore } from "@/store/game-store";

interface TopicWheelProps {
  onSelectTopic: (topicId: string, mode: "part1" | "part2" | "part3" | "vocab") => void;
  onExit: () => void;
}

const SEGMENT_ANGLE = 360 / TOPICS.length;

export function TopicWheel({ onSelectTopic, onExit }: TopicWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Topic | null>(null);
  const learnedTopicIds = useGameStore((s) => s.learnedTopicIds);

  const radius = 180;
  const cx = 200;
  const cy = 200;

  const spin = useCallback(() => {
    if (spinning) return;
    setWinner(null);
    const winIdx = Math.floor(Math.random() * TOPICS.length);
    const targetAngle = 360 * 6 + (360 - (winIdx * SEGMENT_ANGLE + SEGMENT_ANGLE / 2));
    const finalRotation = rotation + targetAngle - (rotation % 360);
    setRotation(finalRotation);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setWinner(TOPICS[winIdx]);
    }, 4200);
  }, [spinning, rotation]);

  const wheelSvg = useMemo(() => {
    const segments = TOPICS.map((topic, i) => {
      const startAngle = i * SEGMENT_ANGLE - 90;
      const endAngle = (i + 1) * SEGMENT_ANGLE - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      // Label position
      const midAngle = (startAngle + endAngle) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const labelX = cx + (radius * 0.65) * Math.cos(midRad);
      const labelY = cy + (radius * 0.65) * Math.sin(midRad);
      // Color from gradient — use raw hex from topic.color tailwind gradient
      const colors: Record<string, string> = {
        "from-emerald-400 to-teal-500": "#10b981",
        "from-amber-400 to-orange-500": "#f59e0b",
        "from-rose-400 to-pink-500": "#f43f5e",
        "from-orange-400 to-red-500": "#f97316",
        "from-sky-400 to-cyan-500": "#0ea5e9",
        "from-slate-500 to-gray-700": "#64748b",
        "from-green-500 to-emerald-600": "#22c55e",
        "from-purple-400 to-fuchsia-500": "#a855f7",
        "from-amber-500 to-yellow-600": "#d97706",
        "from-lime-400 to-green-500": "#84cc16",
        "from-pink-400 to-rose-500": "#ec4899",
        "from-cyan-400 to-blue-500": "#06b6d4",
        "from-indigo-400 to-violet-500": "#818cf8",
        "from-red-400 to-rose-600": "#ef4444",
        "from-fuchsia-400 to-pink-600": "#d946ef",
      };
      const fill = colors[topic.color] || "#10b981";
      return { path, labelX, labelY, fill, emoji: topic.emoji, midAngle };
    });
    return segments;
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/40">
              <Dices className="h-4 w-4 text-fuchsia-600" />
            </div>
            <h1 className="text-2xl font-bold">Topic Wheel</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Putar roda untuk tantangan acak. Cocok untuk simulasi ujian dengan topik yang tidak kamu pilih sendiri.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
      </header>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Pointer */}
          <div
            className="absolute left-1/2 -top-1 -translate-x-1/2 z-10"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path d="M 18 36 L 4 4 Q 18 12 32 4 Z" fill="var(--destructive)" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Wheel */}
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.16, 0.99)" : "none",
            }}
          >
            <circle cx={cx} cy={cy} r={radius + 4} fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
            {wheelSvg.map((seg, i) => (
              <g key={i}>
                <path d={seg.path} fill={seg.fill} stroke="white" strokeWidth="1.5" opacity={0.85} />
                <text
                  x={seg.labelX}
                  y={seg.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="22"
                  transform={`rotate(${seg.midAngle + 90} ${seg.labelX} ${seg.labelY})`}
                >
                  {seg.emoji}
                </text>
              </g>
            ))}
            <circle cx={cx} cy={cy} r="30" fill="var(--card)" stroke="var(--primary)" strokeWidth="3" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold" fill="var(--primary)">
              SPIN
            </text>
          </svg>
        </div>

        {!winner ? (
          <Button
            size="lg"
            onClick={spin}
            disabled={spinning}
            className="gap-2 px-8 glow-primary"
          >
            <Dices className={spinning ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
            {spinning ? "Spinning..." : "Spin the Wheel"}
          </Button>
        ) : (
          <Card className="w-full max-w-md animate-fade-up">
            <CardContent className="p-6 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Topic Selected
              </div>
              <div className="text-5xl mb-2">{winner.emoji}</div>
              <h2 className="text-2xl font-bold mb-1">{winner.name}</h2>
              <Badge variant="outline" className="mb-3">{winner.category}</Badge>
              <p className="text-sm text-muted-foreground mb-4">{winner.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => onSelectTopic(winner.id, "part1")} className="gap-1">
                  Part 1 <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" onClick={() => onSelectTopic(winner.id, "part2")} className="gap-1">
                  Part 2 <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" onClick={() => onSelectTopic(winner.id, "part3")} className="gap-1">
                  Part 3 <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" onClick={() => onSelectTopic(winner.id, "vocab")} className="gap-1">
                  Vocab <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={spin} className="mt-4 gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> Spin again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Learned topics summary */}
        {learnedTopicIds.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 inline mr-1" />
            {learnedTopicIds.length} dari {TOPICS.length} topik sudah kamu pelajari
          </div>
        )}
      </div>
    </div>
  );
}
