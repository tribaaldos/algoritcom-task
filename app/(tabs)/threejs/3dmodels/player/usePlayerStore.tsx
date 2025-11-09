import { create } from "zustand";

type PlayerAnimation = "Rig|Idle_Loop" | "Rig|Sword_Attack" | "Walk" | "Kick";

interface PlayerState {
  currentAnimation: PlayerAnimation;
  setAnimation: (anim: PlayerAnimation) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentAnimation: "Rig|Idle_Loop",
  setAnimation: (anim) => set({ currentAnimation: anim }),
}));