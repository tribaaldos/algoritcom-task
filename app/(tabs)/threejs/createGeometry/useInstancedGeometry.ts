import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type GeometryType = "box" | "sphere" | "torus";
export type ShaderType = "colorShift" | "pulse" | "wave";

export interface SingleGeometry {
  id: string;
  type: GeometryType;
  shaderType: ShaderType | null;
  color: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

interface GeometryState {
  geometries: SingleGeometry[];
  addGeometry: (geometry: SingleGeometry) => void;
  updateRotation: (id: string, rotation: [number, number, number]) => void;
  updatePosition: (id: string, position: [number, number, number]) => void;
  removeGeometry: (id: string) => void;
  resetInstanced: () => void;
}

export const useInstancedGeometry = create<GeometryState>()(
  persist(
    (set) => ({
      geometries: [],

      addGeometry: (geometry) =>
        set((state) => ({
          geometries: [...state.geometries, geometry],
        })),

      updateRotation: (id, rotation) =>
        set((state) => ({
          geometries: state.geometries.map((geo) =>
            geo.id === id ? { ...geo, rotation } : geo
          ),
        })),

      updatePosition: (id, position) =>
        set((state) => ({
          geometries: state.geometries.map((geo) =>
            geo.id === id ? { ...geo, position } : geo
          ),
        })),

      removeGeometry: (id) =>
        set((state) => ({
          geometries: state.geometries.filter((geo) => geo.id !== id),
        })),

      resetInstanced: () => set({ geometries: [] }),
    }),

    {
      name: "geometry-storage", // nombre del storage key
      storage: createJSONStorage(() => AsyncStorage), // usa AsyncStorage
    }
  )
);
