export default function Lights() {
    return (
        <>
            <ambientLight intensity={0.2} />

            {/* Foco delantero derecho */}
            <spotLight
                position={[8, 12, 8]}
                angle={0.6}
                intensity={300}
                penumbra={0.4}
                castShadow
                color="#ffffff"
            />

            {/* foco delantero izquierdo */}
            <spotLight
                position={[-8, 12, 8]}
                angle={0.6}
                intensity={300}
                penumbra={0.4}
                castShadow
                color="#ffffff"
            />

            {/* foco trasero derecho */}
            {/* <spotLight
                position={[8, 12, -8]}
                angle={0.6}
                intensity={300.5}
                penumbra={0.4}
                castShadow
                color="#b0e0ff"
            /> */}

            {/* ffoco trasero izquierdo */}
            {/* <spotLight
                position={[-8, 12, -8]}
                angle={0.6}
                intensity={300.5}
                penumbra={0.4}
                castShadow
                color="#b0e0ff"
            /> */}
            {/* gradas izquierda */}
            <pointLight
                position={[-27, 5, -8]}
                // angle={0.6}
                intensity={20.5}
                // penumbra={0.4}
                castShadow
                color="#b0e0ff"
            />

        </>
    )
}