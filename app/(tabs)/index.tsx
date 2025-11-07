import { Button, Pressable, StyleSheet, Text, View } from 'react-native';


import { Canvas } from '@react-three/fiber/native';
import React, { useRef, useState } from 'react';
import { Environment, Plane } from '@react-three/drei/native';
import { useCreateGeometry } from './threejs/createGeometry/CreateGeometry';
// import BoxShader from './threejs/shaders/BoxTestShader';
import { extend } from "@react-three/fiber";
import { WaterMaterial } from './threejs/shaders/WaterMaterial';
import useControls from 'r3f-native-orbitcontrols'
// import { useCreateNormalGeometry } from './threejs/createGeometry/CreateNormalMaterials';
import { animated, a, useSpring } from '@react-spring/three';
import * as THREE from 'three';
export default function HomeScreen() {


  function TestinAnimation() {
    const [visible, setVisible] = useState(true);
    const meshRef = useRef<THREE.Mesh>(null);
    const { opacity } = useSpring({
      opacity: visible ? 1 : 0,
      config: { duration: 1500 },
      onRest: () => {
        if (!visible) {

        }
      },
    });
    return (
      <a.mesh position={[0, 0, 0]} onClick={() => { setVisible(false) }}>
        <boxGeometry />
        <a.meshStandardMaterial color={color} opacity={opacity} transparent />
      </a.mesh>
    )
  }
  const { createRandomGeometry, reset, RenderMeshes } = useCreateGeometry();
  // const { createNormalGeometry, RenderNormalMeshes } = useCreateNormalGeometry();
  const [OrbitControls, events] = useControls()

  const [color, setColor] = React.useState('red');

  return (
    <View style={styles.container} {...events}>
      <View style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        <Pressable onPress={createRandomGeometry} style={{ padding: 10, backgroundColor: 'lightblue' }}>
          <Text>Create</Text>
        </Pressable>
        {/* <Button title="Reset" onPress={() => reset()} /> */}
        <Pressable onPress={reset} style={{ padding: 10, backgroundColor: 'lightcoral', marginTop: 10 }}>
          <Text>Reset</Text>
        </Pressable>
      </View>
      {/* <Button title="Normal" onPress={() => createNormalGeometry()} /> */}
      <Canvas>
         
        <ambientLight intensity={0.3} />
        <OrbitControls />
        <RenderMeshes />
        {/* <TestinAnimation /> */}
        {/* <BoxShader /> */}
        {/* <RenderNormalMeshes /> */}
        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} args={[20, 20]}>
          <WaterMaterial />
        </Plane>

      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
