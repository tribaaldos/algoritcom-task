import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber/native";
import * as THREE from "three";
import { Instances, Instance } from "@react-three/drei";
import { useSprings, a } from "@react-spring/three";
import { useInstancedGeometry } from "./useInstancedGeometry";

/**
 * Hook optimizado con instanced meshes, animaciones y sincronización
 * con el estado global (updatePosition / updateRotation).
 */
export const useCreateInstanced = () => {
  const {
    geometries,
    addGeometry,
    resetInstanced,
    removeGeometry,
    updatePosition,
    updateRotation,
  } = useInstancedGeometry();

  // 🔹 Crea una geometría aleatoria
  const createInstancedMesh = () => {
    const types = ["box", "sphere", "torus"] as const;
    const type = types[Math.floor(Math.random() * types.length)];

    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const position: [number, number, number] = [
      Math.random() * 6 - 3,
      Math.random() * 2 + 0.5,
      Math.random() * 6 - 3,
    ];
    const scale = Math.random() * 1.5 + 0.5;

    addGeometry({
      id: Math.random().toString(36).substring(2, 9),
      type,
      color,
      shaderType: null,
      position,
      scale,
      rotation: [0, 0, 0],
    });
  };

  // 🔹 Render de los instanced con animación y actualización global
  const RenderInstancedMeshes = () => {
    const groupRef = useRef<THREE.Group>(null);

    // rotación global del grupo
    useFrame((_, delta) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.25;
      }
    });

    // animaciones iniciales con react-spring
    const [springs] = useSprings(
      geometries.length,
      geometries.map(() => ({
        scale: 1,
        opacity: 1,
        from: { scale: 0, opacity: 0 },
        config: { tension: 120, friction: 10 },
      })),
      [geometries]
    );

    // agrupar por tipo
    const boxes = geometries.filter((g) => g.type === "box");
    const spheres = geometries.filter((g) => g.type === "sphere");
    const torus = geometries.filter((g) => g.type === "torus");

    // 🔸 función para eliminar con animación
    const handleRemove = (id: string) => {
      setTimeout(() => removeGeometry(id), 500);
    };

    // 🔸 actualización de posición/rotación para cada frame
    useFrame(() => {
      if (!groupRef.current) return;

      // recorremos las geometrías visibles
      geometries.forEach((geo, i) => {
        const instance = groupRef.current?.children.find(
          (child: any) => child.userData?.id === geo.id
        ) as THREE.Object3D;

        if (instance) {
          const { position, rotation } = instance;
          updatePosition(geo.id, [position.x, position.y, position.z]);
          updateRotation(geo.id, [rotation.x, rotation.y, rotation.z]);
        }
      });
    });

    // función genérica para renderizar tipos
    const renderInstances = (
      items: any[],
      geometry: JSX.Element,
      material: JSX.Element
    ) => (
      <Instances limit={500}>
        {geometry}
        {material}
        {items.map((geo, i) => (
          <a.group
            key={geo.id}
            scale={springs[i].scale}
            rotation-y={(i / items.length) * Math.PI * 2}
            userData={{ id: geo.id }}
            onPointerDown={() => handleRemove(geo.id)}
          >
            <Instance position={geo.position} color={geo.color} />
          </a.group>
        ))}
      </Instances>
    );

    return (
      <group ref={groupRef}>
        {boxes.length > 0 &&
          renderInstances(
            boxes,
            <boxGeometry />,
            <meshStandardMaterial metalness={0.3} roughness={0.6} />
          )}
        {spheres.length > 0 &&
          renderInstances(
            spheres,
            <sphereGeometry args={[0.7, 16, 16]} />,
            <meshStandardMaterial metalness={0.2} roughness={0.5} />
          )}
        {torus.length > 0 &&
          renderInstances(
            torus,
            <torusGeometry args={[0.6, 0.25, 16, 64]} />,
            <meshStandardMaterial metalness={0.4} roughness={0.5} />
          )}
      </group>
    );
  };

  return { createInstancedMesh, resetInstanced, RenderInstancedMeshes };
};
