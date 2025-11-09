import { Button, Pressable, StyleSheet, Text, View } from 'react-native';


import { Canvas, useFrame } from '@react-three/fiber/native';
import React, { Suspense, useRef, useState } from 'react';
import { Environment, EnvironmentCube, Plane, Sky, Stars } from '@react-three/drei/native';
import { useCreateGeometry } from './threejs/createGeometry/CreateGeometry';

import { WaterMaterial } from './threejs/shaders/WaterMaterial';
import useControls from 'r3f-native-orbitcontrols'
import GoalKeep from './threejs/3dmodels/GoalKeep';
import { useCreateInstanced } from './threejs/createGeometry/CreateInstancedMesh';
import Lights from './threejs/lights/Lights';
import * as THREE from 'three';
import Player from './threejs/3dmodels/player/Player';
import { usePerfStore } from './threejs/performance/usePerfStore';
import PerfMonitor from './threejs/performance/Perf';
import { usePlayerStore } from './threejs/3dmodels/player/usePlayerStore';
import Penalti from './threejs/3dmodels/Penalti';
// import { useCreateNormalGeometry } from './threejs/createGeometry/CreateNormalMaterials';
// import { animated, a, useSpring } from '@react-spring/three';
// import * as THREE from 'three';

export default function HomeScreen() {

  // const { createRandomGeometry, reset, RenderMeshes } = useCreateGeometry();
  const { createInstancedMesh, RenderInstancedMeshes , reset } = useCreateInstanced();
  const [OrbitControls, events] = useControls()

  const fps = usePerfStore((state) => state.fps);

  // chat gpt code para limpiar consola, ignorar mensajes EXGL
  // if (__DEV__) {
  //   const originalLog = console.log.bind(console);
  //   console.log = (...args) => {
  //     const msg = args[0];
  //     if (typeof msg === "string" && (msg.includes("pixelStorei") || msg.includes("EXGL"))) {
  //       return;
  //     }
  //     originalLog(...args);
  //   };
  // }


  return (
    <View style={styles.container} {...events}>
      <View style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        {/* <Pressable onPress={createRandomGeometry} style={{ padding: 10, backgroundColor: 'lightblue' }}>
          <Text>Create</Text>
        </Pressable> */}
        <Pressable onPress={createInstancedMesh} style={{ padding: 10, backgroundColor: 'lightblue' }}>
          <Text>Create Instanced</Text>
        </Pressable>
  
        <Pressable onPress={reset} style={{ padding: 10, backgroundColor: 'lightcoral', marginTop: 10 }}>
          <Text>Reset</Text>
        </Pressable>
        <Text style={{ marginTop: 10, color: 'white' }}>FPS: {fps}</Text>

        {/* animaciones del player  */}

        <Pressable onPress={() => usePlayerStore.getState().setAnimation("Rig|Sword_Attack")} style={{ padding: 10, backgroundColor: 'lightblue', marginTop: 10 }}>
          <Text>Sword Attack</Text>
        </Pressable>


      </View>

      <Canvas shadows>
        {/* <PerfMonitor /> */}
        <OrbitControls />
        {/* <RenderMeshes /> */}
        <RenderInstancedMeshes />
        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} args={[20, 20]}>
          <WaterMaterial />
        </Plane>
        <Suspense>
          <GoalKeep />
          <Penalti />
          <Player />
        </Suspense>
        <color attach="background" args={['#000000ff']} />
        <Lights />

        {/* <Stars radius={120} depth={60} count={5000} factor={3} fade speed={1} /> */}
        {/* <Sky /> */}
        {/* <TestinAnimation /> */}
        {/* <BoxShader /> */}
        {/* <RenderNormalMeshes /> */}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
});
