import React, { useMemo } from "react";
import * as THREE from "three";

export function WaterMaterial({
  color = new THREE.Color(0.0, 0.5, 0.8),
  speed = 1.0,
  amplitude = 0.15,
}) {
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color: { value: color },
      speed: { value: speed },
      amplitude: { value: amplitude },
    }),
    [color, speed, amplitude]
  );

  const vertexShader = `
    uniform float time;
    uniform float speed;
    uniform float amplitude;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + time * speed) * amplitude;
      pos.z += cos(pos.y * 2.0 + time * speed) * amplitude;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      float shade = 0.5 + 0.5 * sin(vUv.x * 8.0 + vUv.y * 8.0);
      gl_FragColor = vec4(color * shade, 1.0);
    }
  `;

  return (
    <shaderMaterial
      attach="material"
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={false}
    />
  );
}
