import React, { useMemo } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

// shaders d pruebas, no optimizadas ni nada serio, solo para testear
export function ColorShiftMaterial({ color = new THREE.Color(1, 0, 0), speed = 1 }) {
    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            color: { value: color },
            speed: { value: speed },
        }),
        [color, speed]
    );

    const vertexShader = /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = /* glsl */`
    uniform float time;
    uniform vec3 color;
    uniform float speed;
    varying vec2 vUv;
    void main() {
      vec3 shifting = 0.5 + 0.5 * sin(vUv.yxx * 4.0 + time * speed);
      gl_FragColor = vec4(shifting * color, 1.0);
    }
  `;

    return (
        <shaderMaterial
            attach="material"
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
        />
    );
}




export function PulseMaterial({ color = new THREE.Color(0, 0.5, 1), intensity = 1 }) {
    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            color: { value: color },
            intensity: { value: intensity },
        }),
        [color, intensity]
    );

    const vertexShader = /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = /* glsl */ `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    varying vec2 vUv;
    void main() {
      float pulse = abs(sin(time * intensity));
      gl_FragColor = vec4(color * pulse, 1.0);
    }
  `;

    return (
        <shaderMaterial
            attach="material"
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
        />
    );
}



export function WaveMaterial({ color = new THREE.Color(0.5, 1, 0.3), frequency = 3.0 }) {
    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            color: { value: color },
            frequency: { value: frequency },
        }),
        [color, frequency]
    );

    const vertexShader =/* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader =/* glsl */ `
    uniform float time;
    uniform vec3 color;
    uniform float frequency;
    varying vec2 vUv;
    void main() {
      float wave = 0.5 + 0.5 * sin((vUv.x + vUv.y) * frequency + time * 2.0);
      gl_FragColor = vec4(wave * color, 1.0);
    }
  `;

    return (
        <shaderMaterial
            attach="material"
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
        />
    );
}



