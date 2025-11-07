import { Vector3 } from 'three';
import { create } from 'zustand';


export type GeometryType = 'box' | 'sphere' | 'torus';
export type ShaderType = 'colorShift' | 'pulse' | 'wave';

export interface SingleGeometry {
    id: string;
    type: GeometryType;
    shaderType: ShaderType;
    color: string;
    position: [number, number, number];
    scale: number;
    rotation: [number, number, number];
}

interface GeometryState {
    geometries: SingleGeometry[];
    addGeometry: (geometry: SingleGeometry) => void;
    updateRotation: (id: string | number, rotation: [number, number, number]) => void; // 👈 nueva función
    updatePosition: (id: string | number, position: [number, number, number]) => void; // 👈 nueva función
    removeGeometry: (id: string) => void;
    reset: () => void;
}




export const useGeometryStore = create<GeometryState>((set) => ({
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

        removeGeometry: (id) => set((state) => ({
            geometries: state.geometries.filter((geo) => geo.id !== id),
        })),
    reset: () => set({ geometries: [] }),
}));


