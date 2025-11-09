import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import * as THREE from "three";
import playerModel from "../../../../../assets/models/Player.glb";
import { usePlayerStore } from "./usePlayerStore";

export default function Player() {
  const group = useRef<THREE.Group>(null);
  const { scene, nodes, materials, animations } = useGLTF(playerModel);
  const { actions, mixer } = useAnimations(animations, group);

  const currentAnimation = usePlayerStore((state) => state.currentAnimation);

  useEffect(() => {

    if (!actions) return;
    Object.values(actions).forEach((a: any) => a.stop()); 

    const selected = actions[currentAnimation];
    if (selected) {
      selected.reset().fadeIn(0.3).play();
    } else {
      console.warn(`Animación "${currentAnimation}" no encontrada.`);
    }
  }, [currentAnimation, actions]);

  useFrame((_, delta) => mixer?.update(delta));

  return (
    <>

    <group ref={group}  dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="Mannequin"
            position={[0.001, -0.014, 0]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
            scale={100}>
            <skinnedMesh
              castShadow
              name="Mannequin_1"
              geometry={nodes.Mannequin_1.geometry}
              material={materials.M_Main}
              skeleton={nodes.Mannequin_1.skeleton}
            />
            <skinnedMesh
              name="Mannequin_2"
              geometry={nodes.Mannequin_2.geometry}
              material={materials.M_Joints}
              skeleton={nodes.Mannequin_2.skeleton}
            />
          </group>
          <group
            name="Rig"
            position={[0.001, -0.014, 0]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
            scale={100}>
            <primitive object={nodes.root} />
          </group>
        </group>
      </group>
    </group>    </>
  );
}

useGLTF.preload(playerModel);
