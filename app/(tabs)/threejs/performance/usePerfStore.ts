import { create } from "zustand";

interface PerfState {
  fps: number;
  setFps: (fps: number) => void;
}

export const usePerfStore = create<PerfState>((set) => ({
  fps: 0,
  setFps: (fps) => set({ fps }),
}));
