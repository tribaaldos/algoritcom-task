// useCreateGeometry.tsx
import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber/native";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { useGeometryStore } from "./useCreateGeometry";
import { ColorShiftMaterial, PulseMaterial, WaveMaterial } from "../shaders/BoxTestShader";
import { a, animated, useSpring, useTransition } from "@react-spring/three";


export const useCreateGeometry = () => {
    const { geometries, addGeometry, reset, updateRotation, updatePosition, removeGeometry } = useGeometryStore();

    const createRandomGeometry = () => {
        const types = ["box", "sphere", "torus"] as const;
        const shaders = ["colorShift", "pulse", "wave"] as const;

        const type = types[Math.floor(Math.random() * types.length)];
        const shaderType = shaders[Math.floor(Math.random() * shaders.length)];
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const position: [number, number, number] = [
            Math.random() * 6 - 3,
            Math.random() * 4 - 2,
            Math.random() * 6 - 3,
        ];
        const scale = Math.random() * 1.5 + 0.5;

        addGeometry({
            id: Math.random().toString(36).substring(2, 9),
            type,
            shaderType,
            color,
            position,
            scale,
            rotation: [0, 0, 0],
        });
    };

    const GeometryMesh: React.FC<{
        id: string;
        type: "box" | "sphere" | "torus";
        shaderType: "colorShift" | "pulse" | "wave";
        color: string;
        position: [number, number, number];
        scale: number;
        rotation: [number, number, number];
    }> = ({ id, type, shaderType, position, scale, rotation, color }) => {
        const meshRef = useRef<THREE.Mesh>(null);
        const materialRef = useRef<any>(null);


        useFrame((_, delta) => {
            if (meshRef.current) {
                meshRef.current.rotation.x += delta * 0.4;
                meshRef.current.rotation.y += delta * 0.6;
                updateRotation(id, [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z]);
                updatePosition(id, [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]);
            }
            if (materialRef.current) {
                materialRef.current.time += delta;
            }
        });


        // animaciones react spring 
        const [visible, setVisible] = useState(true);
        const { opacity, positionY } = useSpring({
            positionY: visible ? 0 : 2, 
            from: { opacity: 0, positionY: 0 },
            to: { opacity: visible ? 1 : 0, positionY: visible ? 0 : 2 },
            opacity: visible ? 1 : 0,
            config: { duration: 1500 },
            onRest: () => {
                if (!visible) {
                    setTimeout(() => removeGeometry(id), 1000); // 1 segundo
                }
            },
        });
 

        return (
            <>
                    <a.mesh
                        // key={geo.id}
                        ref={meshRef}
                        position={position}
                        rotation={rotation}
                        position-y={positionY}
                        scale={scale}
                        userData={{ id, shaderType, type }}
                        onPointerDown={(e: Event) => {
                            e.stopPropagation();
                            console.log('mesh :D', e);
                            console.log('id:', id);
                            setVisible(false);
                            setTimeout(() => removeGeometry(id), 1000); // 1 segundo
                        }}
                    >
                        {type === "box" && <boxGeometry args={[1, 1, 1]} />}
                        {type === "sphere" && <sphereGeometry args={[0.7, 32, 32]} />}
                        {type === "torus" && <torusGeometry args={[0.6, 0.25, 16, 100]} />}
                        {/* {shaderType === "pulse" && (<PulseMaterial />)}
                {shaderType === "wave" && (<WaveMaterial />)}
                {shaderType === "colorShift" && (<ColorShiftMaterial />)} */}
                        {shaderType === "pulse" && (<a.meshStandardMaterial ref={materialRef} transparent opacity={opacity} color={color} />)}
                        {shaderType === "wave" && (<a.meshStandardMaterial ref={materialRef} transparent opacity={opacity} color={color} />)}
                        {shaderType === "colorShift" && (<a.meshStandardMaterial ref={materialRef} transparent opacity={opacity} color={color} />)}
                    </a.mesh>
                </>
        );
    };

    const RenderMeshes = useMemo(() =>
        () =>
            geometries.map((geo: any) =>
                <GeometryMesh key={geo.id} {...geo} />
            ),
        [geometries.length] // solo se actualiza cuando cambia la cantidad de geometrías
    );

    return { createRandomGeometry, reset, RenderMeshes };
};
