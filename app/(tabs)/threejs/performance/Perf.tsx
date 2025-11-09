import { useFrame, useThree } from "@react-three/fiber/native";
import { useRef } from "react";
import { usePerfStore } from "./usePerfStore";

export default function PerfMonitor() {
  const { gl } = useThree();
  const setFps = usePerfStore((state) => state.setFps);

  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useFrame((state, delta) => {
    frameCount.current++;
    const now = Date.now();
    const elapsed = now - lastTime.current;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);

      // Acceder al renderer real de Three.js (Expo GL)
      const drawCalls = gl.info?.render?.calls || 0;
      const triangles = gl.info?.render?.triangles || 0;

      // Guarda FPS en Zustand
      setFps(fps);


      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}
