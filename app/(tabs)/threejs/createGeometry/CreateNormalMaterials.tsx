// // useCreateGeometry.tsx
// import React, { useRef } from "react";
// import { useFrame } from "@react-three/fiber/native";
// import * as THREE from "three";
// import { shaderMaterial } from "@react-three/drei";
// import { extend } from "@react-three/fiber";
// import { useGeometryStore } from "./useCreateGeometry";
// import { ColorShiftMaterial, PulseMaterial, WaveMaterial } from "../shaders/BoxTestShader";


// export const useCreateNormalGeometry = () => {
//     const { geometries, addGeometry, reset, updateRotation, updatePosition } = useGeometryStore();

//     const createNormalGeometry = () => {
//         const types = ["box", "sphere", "torus"] as const;
//         const shaders = ["colorShift", "pulse", "wave"] as const;

//         const type = types[Math.floor(Math.random() * types.length)];
//         const shaderType = shaders[Math.floor(Math.random() * shaders.length)];
//         // const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
//         const position: [number, number, number] = [
//             Math.random() * 6 - 3,
//             Math.random() * 4 - 2,
//             Math.random() * 6 - 3,
//         ];
//         const scale = Math.random() * 1.5 + 0.5;

//         addGeometry({
//             id: Math.random().toString(36).substring(2, 9),
//             type,
//             shaderType,
//             color: [Math.random(), Math.random(), Math.random()],
//             position,
//             scale,
//             rotation: [0, 0, 0],
//         });
//     };

//     const GeometryMesh: React.FC<{
//         id: string;
//         type: "box" | "sphere" | "torus";
//         shaderType: "colorShift" | "pulse" | "wave";
//         color: [number, number, number];
//         position: [number, number, number];
//         scale: number;
//         rotation: [number, number, number];
//     }> = ({ id, type, shaderType, position, scale, rotation, color }) => {
//         const meshRef = useRef<THREE.Mesh>(null);
//         const materialRef = useRef<any>(null);


//         useFrame((_, delta) => {
//             if (meshRef.current) {
//                 meshRef.current.rotation.x += delta * 0.4;
//                 meshRef.current.rotation.y += delta * 0.6;
//                 updateRotation(id, [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z]);
//                 updatePosition(id, [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]);
//             }
//             if (materialRef.current) {
//                 materialRef.current.time += delta;
//             }
//         });
//         return (
//             <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} >
//                 {type === "box" && <boxGeometry args={[1, 1, 1]} />}
//                 {type === "sphere" && <sphereGeometry args={[0.7, 32, 32]} />}
//                 {type === "torus" && <torusGeometry args={[0.6, 0.25, 16, 100]} />}
//                 {shaderType === "pulse" && (<meshStandardMaterial color="red" />)}
//                 {shaderType === "wave" && (<meshStandardMaterial color="blue" />)}
//                 {shaderType === "colorShift" && (<meshStandardMaterial color="green" />)}
//                 {/* {shaderType === "wave" && (<WaveMaterial />)}
//                 {shaderType === "colorShift" && (<ColorShiftMaterial />)} */}
//             </mesh>
//         );
//     };

//     const RenderNormalMeshes = () => (
//         <>
//             {geometries.map((geo: any) => (
//                 <GeometryMesh key={geo.id} {...geo} />
//             ))}
//         </>
//     );
//     return { createNormalGeometry, reset, RenderNormalMeshes };
// };
