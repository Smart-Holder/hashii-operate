import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useRef, useEffect, useState } from "react";
import React from "react";
import { Mesh } from "three";
interface IGlbProps {
	glb_url: string;
}

const Model = (props: IGlbProps) => {
	const { glb_url } = props;
	const gltf = useLoader(
		GLTFLoader,
		// "https://nftimg.stars-mine.com/img/dev-2023-04/68d40db7-dde4-11ed-b3ff-0242ac110006.glb"
		// "https://files.smartholder.jp/img/test-2023-04/77b51e8c-d527-11ed-aa13-0242ac110004.glb"
		glb_url
	);
	// / Use useRef hook to access the mesh element
	const mesh = useRef<Mesh>();

	//Basic animation to rotate our cube using animation frame
	useFrame(() => (mesh.current.rotation.y += 0.01));
	useThree(({ camera }) => {
		// camera.rotation.set(deg2rad(330), 100, 100);
		camera.position.set(0, 3, 3);
	});
	// useThree(({ camera }) => {
	// 	camera.rotation.set(deg2rad(-66660), 0, 0);
	// });
	// Jsx to render our 3d cube. Our cube will have height
	return (
		<>
			<mesh position={[0, -1.5, 0]} ref={mesh}>
				<primitive object={gltf.scene} scale={6} />
			</mesh>
		</>
	);
};

export default function Glb(props: IGlbProps) {
	// const canvas = document.querySelector(".glb_canvas canvas");
	// console.log(canvas, "canvas");
	// canvas
	const [showglb, setshowglb] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			setshowglb(true);
		}, 500);
	}, []);
	return (
		<div className="glb_canvas">
			{showglb && (
				<Canvas style={{ background: "#ccc" }}>
					<Suspense fallback={null}>
						<Model {...props} />
						<OrbitControls />
						<ambientLight />
						<pointLight position={[10, 10, 10]} />
					</Suspense>
				</Canvas>
			)}
		</div>
	);
}
