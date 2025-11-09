import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber/native";
import * as THREE from "three";
import { Text3D } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import gsap from "gsap";
import Font from "../../../../assets/fonts/fuente.json";

function PulseMaterial({ color = new THREE.Color(0, 0.5, 1), intensity = 1 }) {
  const materialRef = useRef<any>(null);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color: { value: color },
      intensity: { value: intensity },
    }),
    [color, intensity]
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta;
    }
  });

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    precision mediump float;
    varying vec2 vUv;
    uniform float time;
    uniform float intensity;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float hex(vec2 p) {
      vec2 q = vec2(p.x * 0.57735 * 2.0, p.y + mod(floor(p.x), 2.0) * 0.5);
      vec2 i = floor(q);
      vec2 f = fract(q);
      float v = 8.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash(i + g) * vec2(0.5);
          vec2 r = f - g - o;
          v = min(v, length(r));
        }
      }
      return v;
    }

    void main() {
      vec2 uv = vUv * 10.0;
      uv.y += sin(time * 0.5) * 0.2;
      float h = hex(uv);
      float lines = smoothstep(0.18, 0.2, h);
      vec3 color = mix(vec3(0.05), vec3(1.0), lines);
      float glow = abs(sin(time * intensity)) * 0.15;
      color += glow;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <shaderMaterial
      ref={materialRef}
      attach="material"
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
}

function GoalText({ visible, onEnd }: { visible: boolean; onEnd?: () => void }) {
  const { scale, opacity, positionY } = useSpring({
    from: { scale: 0, opacity: 0, positionY: 0 },
    to: visible
      ? [
          { scale: 1.3, opacity: 1, positionY: 0.3 },
          { scale: 1, opacity: 1, positionY: 0 },
        ]
      : { opacity: 0, scale: 0 },
    config: { tension: 170, friction: 26 },
    onRest: () => !visible && onEnd?.(),
  });

  return (
    <a.group scale={scale} position-y={positionY}>
      <Text3D
        font={Font}
        size={0.7}
        height={0.2}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        position={[-1.5, 1, -2]}
      >
        GOAL!
        <a.meshStandardMaterial
          color="orange"
          transparent
          opacity={opacity}
          emissive={"#ff8800"}
          metalness={0.6}
          roughness={0.3}
        />
      </Text3D>
    </a.group>
  );
}

function FireworkMaterial({ color }: { color: THREE.Color }) {
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uColor: { value: color },
    }),
    [color]
  );

  const vertexShader = /* glsl */ `
    attribute float aSize;
    attribute float aTimeMultiplier;
    uniform float uProgress;
    varying float vAlpha;

    float remap(float v, float a, float b, float c, float d){
      return c + (v - a) * (d - c) / (b - a);
    }

    void main(){
      float progress = uProgress * aTimeMultiplier;
      vec3 newPosition = position;

      float explode = remap(progress, 0.0, 0.15, 0.0, 1.0);
      explode = clamp(explode, 0.0, 1.0);
      explode = 1.0 - pow(1.0 - explode, 3.0);
      newPosition = mix(vec3(0.0), newPosition, explode);

      float fall = remap(progress, 0.15, 1.0, 0.0, 1.0);
      fall = clamp(fall, 0.0, 1.0);
      newPosition.y -= fall * 0.3;

      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = 40.0 * aSize * (1.0 / -mvPosition.z);
      vAlpha = 1.0 - progress;
      if(gl_PointSize < 1.0) gl_Position = vec4(9999.9);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      if(d > 0.5) discard;
      gl_FragColor = vec4(uColor, (1.0 - d * 2.0) * vAlpha);
    }
  `;

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => {
    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 2.8,
      ease: "linear",
      onComplete: () => mat.dispose(),
    });
  }, []);

  return mat;
}

function Firework({ position }: { position: [number, number, number] }) {
  const count = 300 + Math.floor(Math.random() * 400);
  const radius = 0.7 + Math.random() * 0.4;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const times = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const spherical = new THREE.Spherical(
      radius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    const v = new THREE.Vector3().setFromSpherical(spherical);
    positions[i3] = v.x;
    positions[i3 + 1] = v.y;
    positions[i3 + 2] = v.z;
    sizes[i] = Math.random();
    times[i] = 1 + Math.random();
  }

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute("aTimeMultiplier", new THREE.Float32BufferAttribute(times, 1));
    return geo;
  }, []);

  const color = useMemo(() => {
    const c = new THREE.Color();
    c.setHSL(Math.random(), 1, 0.6);
    return c;
  }, []);

  const mat = FireworkMaterial({ color });

  return <points geometry={geometry} material={mat} position={position} />;
}

export default function Penalti() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState<[number, number, number]>([0, 0, 0]);
  const [isKicked, setIsKicked] = useState(false);
  const [selectedDir, setSelectedDir] = useState<"left" | "center" | "right" | null>(null);
  const [goalVisible, setGoalVisible] = useState(false);
  const [fireworks, setFireworks] = useState<JSX.Element[]>([]);

  const gravity = -9.8 * 0.05;
  const friction = 0.99;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.position;
    let [vx, vy, vz] = velocity;

    if (isKicked) {
      pos.x += vx * delta * 5;
      pos.y += vy * delta * 5;
      pos.z += vz * delta * 5;
      vy += gravity * delta * 5;

      if (pos.z < -6 && pos.y < 1.5) {
        setGoalVisible(true);
        spawnFirework([0, 2, -6]);
        setTimeout(() => {
          setGoalVisible(false);
          setTimeout(() => handleReset(), 1000);
        }, 2000);
      }
      if (pos.y < 0.5) {
        pos.y = 0.5;
        vy = 0;
        vz = 0;
        setIsKicked(false);
        setSelectedDir(null);
      }

      setVelocity([vx * friction, vy, vz * friction]);
    }
  });

  const spawnFirework = (pos: [number, number, number]) => {
    setFireworks((prev) => [...prev, <Firework key={Math.random()} position={pos} />]);
    setTimeout(() => {
      setFireworks((prev) => prev.slice(1));
    }, 3000);
  };

  const directions = {
    left: new THREE.Vector3(-0.25, 0.4, -1).normalize(),
    center: new THREE.Vector3(0, 0.5, -1).normalize(),
    right: new THREE.Vector3(0.2, 0.4, -1).normalize(),
  };

  const handleSelectDirection = (dir: "left" | "center" | "right") => {
    setSelectedDir(dir);
  };

  const handleKick = () => {
    if (!selectedDir || isKicked) return;
    const dir = directions[selectedDir];
    const power = 3;
    const newVel: [number, number, number] = [dir.x * power, dir.y * power, dir.z * power];
    setVelocity(newVel);
    setIsKicked(true);
  };

  const handleReset = () => {
    if (meshRef.current) {
      meshRef.current.position.set(0, 0.5, 3);
      setVelocity([0, 0, 0]);
      setIsKicked(false);
      setSelectedDir(null);
    }
  };

  return (
    <>
      <group position={[0, 0, -5]}>
        {/* Bola */}
        <mesh ref={meshRef} position={[0, 0.5, 3]} onPointerDown={handleKick} scale={0.5}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <PulseMaterial
            color={selectedDir ? new THREE.Color("orange") : new THREE.Color("white")}
            intensity={selectedDir ? 2 : 0.5}
          />
        </mesh>

        {/* Direcciones */}
        {!isKicked && (
          <group position={[0, 1.5, -5]}>
            <DirectionButton x={-2} onClick={() => handleSelectDirection("left")} active={selectedDir === "left"} />
            <DirectionButton x={0} onClick={() => handleSelectDirection("center")} active={selectedDir === "center"} />
            <DirectionButton x={1.75} onClick={() => handleSelectDirection("right")} active={selectedDir === "right"} />
          </group>
        )}
      </group>

      <GoalText visible={goalVisible} />
      {fireworks}
    </>
  );
}

/* 🔹 Botones dirección */
function DirectionButton({
  x,
  onClick,
  active,
}: {
  x: number;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <mesh position={[x, 0, 0]} onPointerDown={onClick}>
      <planeGeometry args={[0.7, 0.7]} />
      <meshStandardMaterial color={active ? "yellow" : "gray"} />
    </mesh>
  );
}
