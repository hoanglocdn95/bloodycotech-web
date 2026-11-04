"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type SettingsState = {
  muted: boolean;
  volume: number;
  toggleMuted: () => void;
  setVolume: (volume: number) => void;
};

export const useSettings = create<SettingsState>()((set) => ({
  muted: false,
  volume: 0.6,
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
  setVolume: (volume) => set({ volume }),
}));

export function VolumeControls() {
  const { muted, volume, toggleMuted } = useSettings(
    useShallow((state) => ({
      muted: state.muted,
      volume: state.volume,
      toggleMuted: state.toggleMuted,
    })),
  );

  return (
    <button type="button" onClick={toggleMuted} aria-pressed={muted}>
      {muted ? "Đang tắt tiếng" : `Âm lượng ${volume}`}
    </button>
  );
}
