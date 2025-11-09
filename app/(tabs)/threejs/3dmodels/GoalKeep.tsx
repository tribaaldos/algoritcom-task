import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { Gltf, useGLTF } from '@react-three/drei/native';
import Porteria from '../../../../assets/models/porteria.glb';

export default function GoalKeep(props: any) {
  // const ref = useRef<any>();

  // //chat gpt code porq no funcionaban glbs.... usando legacy en vez del import normal, he cambiado node_modulos
  // si actualizo react three fiber drei hay q cambiar seguramente el nombre de todos los archivos de la carpeta /reactthreefiber/native/dist
  // todos los archcivos que tengan expo/file/sistem ... añadir legacy al final ª.º 
  // si se rompe el color del modelo glb usar el useframe de abajo


  // useFrame(() => {
  //   if (ref.current) {
  //     ref.current.traverse((child: any) => {
  //       if (child.material?.color) {
  //         const color = child.material.color.getStyle();
  //         if (color?.length === 9 && color.endsWith('ff')) {
  //           // ej: #000000ff → #000000
  //           child.material.color.set(color.slice(0, 7));
  //         }
  //       }
  //     });
  //   }
  // });

  return (
    <>

    <Gltf
    
      receiveShadow
      // ref={ref}
      src={Porteria}
      scale={1}
      position={[0, 0, 0]}
      {...props}
      />
      </>
  );
}
