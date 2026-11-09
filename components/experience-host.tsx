"use client";

import { BoardGameArcade, type BoardGameId } from "@/components/board-game-arcade";
import { DinoRunExperience, GoldMinerExperience, PachinkoExperience } from "@/components/experiences/canvas-games";
import { Lines98Experience } from "@/components/experiences/lines98";
import { ExerciseExperience, PomodoroExperience, QuoteExperience, StoryExperience, WorkSceneExperience } from "@/components/experiences/simple-apps";
import type { ExperienceId, Locale } from "@/lib/personalization";

export function ExperienceHost({ id, locale }: { id: ExperienceId; locale: Locale }) {
  if (id === "pomodoro") return <PomodoroExperience locale={locale} />;
  if (id === "exercise") return <ExerciseExperience locale={locale} />;
  if (id === "work-scene") return <WorkSceneExperience locale={locale} />;
  if (id === "lines98") return <Lines98Experience locale={locale} />;
  if (id === "gold-miner") return <GoldMinerExperience locale={locale} />;
  if (id === "dino-run") return <DinoRunExperience locale={locale} />;
  if (id === "quotes") return <QuoteExperience locale={locale} />;
  if (id === "story") return <StoryExperience locale={locale} />;
  if (id === "pachinko") return <PachinkoExperience locale={locale} />;
  return <BoardGameArcade locale={locale} fixedGame={id as BoardGameId} />;
}

