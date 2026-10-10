"use client";
import { useEffect, useRef } from "react";

interface TimerRingProps {
  totalSec: number;
  remainingSec: number;
  size?: number;
  label?: string;
  phaseLabel?: string;
  accent?: "primary" | "destructive" | "accent";
}

export function TimerRing({
  totalSec,
  remainingSec,
  size = 200,
  label,
  phaseLabel,
  accent = "primary",
}: TimerRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSec > 0 ? remainingSec / totalSec : 0;
  const dashOffset = circumference * (1 - progress);

  const colorVar =
    accent === "destructive"
      ? "var(--destructive)"
      : accent === "accent"
      ? "var(--accent)"
      : "var(--primary)";

  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const isUrgent = remainingSec <= 10 && remainingSec > 0;

  useEffect(() => {
    if (isUrgent && ref.current) {
      ref.current.classList.add("breathe");
    } else if (ref.current) {
      ref.current.classList.remove("breathe");
    }
  }, [isUrgent]);

  return (
    <div className="flex flex-col items-center gap-2">
      {phaseLabel && (
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {phaseLabel}
        </div>
      )}
      <div
        ref={ref}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={stroke}
            opacity={0.4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isUrgent ? "var(--destructive)" : colorVar}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`font-mono font-bold tabular-nums ${
              size > 150 ? "text-4xl" : "text-2xl"
            } ${isUrgent ? "text-destructive" : ""}`}
          >
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          {label && (
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
}
