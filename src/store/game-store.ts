// Game store — tracks progress, scores, completed sessions, streak
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";

export type GameMode = "part1" | "part2" | "part3" | "vocab" | "wheel" | "assessment";

export interface SessionRecord {
  id: string;
  topicId: string;
  topicName: string;
  mode: GameMode;
  date: string; // ISO string
  bandScore?: number;
  durationSec?: number;
  transcript?: string;
  notes?: string;
}

export interface VocabProgress {
  word: string;
  topicId: string;
  learned: boolean;
  reviewedAt?: string;
}

interface GameState {
  // navigation
  activeView: GameMode | "dashboard" | "library";
  selectedTopicId: string | null;

  // session data
  sessions: SessionRecord[];
  vocabProgress: Record<string, VocabProgress>;
  learnedTopicIds: string[];
  lastVisitDate: string | null;
  streak: number;

  // ui prefs
  autoRecord: boolean;
  showTranscript: boolean;

  // actions
  setActiveView: (v: GameState["activeView"]) => void;
  setSelectedTopicId: (id: string | null) => void;
  addSession: (s: SessionRecord) => void;
  toggleVocabLearned: (word: string, topicId: string) => void;
  markTopicLearned: (id: string) => void;
  setAutoRecord: (v: boolean) => void;
  setShowTranscript: (v: boolean) => void;
  updateStreak: () => void;
  resetAll: () => void;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

function calcStreak(lastVisit: string | null, currentStreak: number): number {
  const today = todayStr();
  if (!lastVisit) return 1;
  if (lastVisit === today) return Math.max(currentStreak, 1);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastVisit === yesterday) return currentStreak + 1;
  return 1; // streak broken
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      activeView: "dashboard",
      selectedTopicId: null,
      sessions: [],
      vocabProgress: {},
      learnedTopicIds: [],
      lastVisitDate: null,
      streak: 0,
      autoRecord: true,
      showTranscript: true,

      setActiveView: (v) => set({ activeView: v }),
      setSelectedTopicId: (id) => set({ selectedTopicId: id }),
      addSession: (s) =>
        set((state) => ({
          sessions: [s, ...state.sessions].slice(0, 200),
        })),
      toggleVocabLearned: (word, topicId) =>
        set((state) => {
          const existing = state.vocabProgress[word];
          return {
            vocabProgress: {
              ...state.vocabProgress,
              [word]: {
                word,
                topicId,
                learned: existing ? !existing.learned : true,
                reviewedAt: new Date().toISOString(),
              },
            },
          };
        }),
      markTopicLearned: (id) =>
        set((state) => ({
          learnedTopicIds: state.learnedTopicIds.includes(id)
            ? state.learnedTopicIds
            : [...state.learnedTopicIds, id],
        })),
      setAutoRecord: (v) => set({ autoRecord: v }),
      setShowTranscript: (v) => set({ showTranscript: v }),
      updateStreak: () =>
        set((state) => ({
          streak: calcStreak(state.lastVisitDate, state.streak),
          lastVisitDate: todayStr(),
        })),
      resetAll: () =>
        set({
          sessions: [],
          vocabProgress: {},
          learnedTopicIds: [],
          streak: 0,
          lastVisitDate: null,
        }),
    }),
    {
      name: "ielts-speaking-game",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      skipHydration: true,
    }
  )
);

// Hook to manually hydrate the store on the client (avoids SSR infinite loop).
// Must run inside useEffect to avoid setState-during-render warnings.
export function useHydrateStore() {
  useEffect(() => {
    const persistApi = useGameStore.persist;
    if (!persistApi.hasHydrated()) {
      persistApi.rehydrate();
    }
  }, []);
}

// Derived selectors
export function selectStats(state: GameState) {
  const totalSessions = state.sessions.length;
  const scored = state.sessions.filter((s) => typeof s.bandScore === "number");
  const avgBand =
    scored.length > 0
      ? scored.reduce((sum, s) => sum + (s.bandScore || 0), 0) / scored.length
      : 0;
  const totalVocab = Object.values(state.vocabProgress).filter((v) => v.learned).length;
  const uniqueTopics = new Set(state.sessions.map((s) => s.topicId)).size;
  const totalPracticeMin = state.sessions.reduce(
    (sum, s) => sum + (s.durationSec || 0) / 60,
    0
  );
  return {
    totalSessions,
    avgBand: Math.round(avgBand * 10) / 10,
    totalVocab,
    uniqueTopics,
    totalPracticeMin: Math.round(totalPracticeMin),
    streak: state.streak,
  };
}
