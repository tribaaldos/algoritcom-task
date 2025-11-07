// useGlobalTime.ts
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function useGlobalTime() {
  const time = useRef(0);
  useFrame((_, delta) => {
    time.current += delta;
  });
  return time;
}
