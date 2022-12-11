import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useGLTF, Bounds, Edges, Plane } from "@react-three/drei";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LayerMaterial, Depth, Fresnel, Color } from "lamina";
import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import StatsImp from "three/addons/libs/stats.module.js";

import * as THREE from "three";

export default function Scene() {
    return (
        <div className="w-full h-full bg-black text-[#fefefe] text-[13px] m-0 p-0 ">
            <Canvas
                className="w-screen h-screen"
                orthographic
                // dpr={[1, 2]}
                camera={{
                    position: [4, 5, 4],
                    left: window.innerWidth / -2,
                    right: window.innerWidth / -2,
                    top: window.innerHeight / 2,
                    bottom: window.innerHeight / 2,
                    near: 0.1,
                }}
            >
                {/* <Plane
                        scale={[1000, 1000, 10000]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, 0, 0]}
                    /> */}
                {/* <CameraController /> */}
                {/* <pointLight
                    position={[0, 10, 10]}
                    intensity={1}
                    color="#00FFE7"
                /> */}
                <Bounds fit clip observe margin={1.25}>
                    <Suspense fallback={null}>
                        <Rover
                            position={[-6, 0, -7]}
                            scale={[0.01, 0.01, 0.01]}
                            rotation-x={Math.PI * 0.5}
                            // rotation-z={Math.PI * 0.5}
                        />
                    </Suspense>
                </Bounds>
                <gridHelper
                    args={[100, 80, "#918e8e", "#525151"]}
                    position={[0, 1, 0]}
                    rotation={[0, 0, 0]}
                />
                <Stats />
                {/* <primitive object={new THREE.AxesHelper(10)} /> */}
            </Canvas>
        </div>
    );
}

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);

        controls.minDistance = 3;
        controls.maxDistance = 20;
        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    return null;
};

function Rover(props) {
    const ref = useRef(null);
    const gradient = 0.7;
    useFrame((state) => {
        const sin = Math.sin(state.clock.elapsedTime / 2) * 10;
        const cos = Math.cos(state.clock.elapsedTime / 2) * 10;
        ref.current.layers[0].origin.set(cos / 2, 0, 0);
        ref.current.layers[1].origin.set(cos, sin, cos);
        ref.current.layers[2].origin.set(sin, cos, sin);
        ref.current.layers[3].origin.set(cos, sin, cos);
    });

    const gltf = useLoader(GLTFLoader, "rover-processed.glb", (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/gltf/"
        );
        loader.setDRACOLoader(dracoLoader);
    });
    console.log(gltf);

    return (
        <mesh {...props} geometry={gltf.scene.children[0].geometry}>
            {/* <primitive object={gltf.scene} /> */}
            <LayerMaterial ref={ref} toneMapped={false}>
                <Depth
                    colorA="#ff0080"
                    colorB="black"
                    alpha={1}
                    mode="normal"
                    near={10 * gradient}
                    far={10}
                    origin={[0, 0, 0]}
                />
                <Depth
                    colorA="blue"
                    colorB="#f7b955"
                    alpha={1}
                    mode="add"
                    near={20 * gradient}
                    far={20}
                    origin={[0, 1, 1]}
                />
                <Depth
                    colorA="green"
                    colorB="#f7b955"
                    alpha={1}
                    mode="add"
                    near={30 * gradient}
                    far={30}
                    origin={[0, 1, -1]}
                />
                <Depth
                    colorA="white"
                    colorB="red"
                    alpha={1}
                    mode="overlay"
                    near={15 * gradient}
                    far={15}
                    origin={[1, -1, -1]}
                />
                <Fresnel
                    mode="add"
                    color="white"
                    intensity={0.5}
                    power={1.5}
                    bias={0.05}
                />
            </LayerMaterial>
            <Edges color="black" />
        </mesh>
    );
}

function Stats() {
    const [stats, setStats] = useState(() => new StatsImp());
    useEffect(() => {
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        return () => document.body.removeChild(stats.dom);
    }, []);
    return useFrame((state) => {
        stats.begin();
        state.gl.render(state.scene, state.camera);
        stats.end();
    }, 1);
}

// function Cursor(props) {
//     const ref = useRef(null);
//     const { nodes } = useGLTF("/rover.glb");

//     return (
//         <group ref={ref} {...props} dispose={null}>
//             <mesh>
//                 <primitive object={ndoes}
//             </mesh>
//         </group>
//     );
// }

// useGLTF.preload("/rover.glb");
