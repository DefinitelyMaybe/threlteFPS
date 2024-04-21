<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';
	import { AutoColliders } from '@threlte/rapier';
	import * as THREE from 'three';

	const { scene } = useThrelte();

	scene.background = new THREE.Color(0x88ccee);
	scene.fog = new THREE.Fog(0x88ccee, 0, 50);
</script>

<T.PerspectiveCamera near={0.1} far={1000} makeDefault position={[-10, 10, 10]} fov={70}>
	<OrbitControls enableDamping target.y={1.5} />
</T.PerspectiveCamera>

<T.DirectionalLight color={0xffffff} intensity={2.5} position={[-5, 25, -1]} />
<T.AmbientLight intensity={0.2} />
<T.HemisphereLight args={[0x8dc1de, 0x00668d, 1.5]} position={[2, 1, 1]} />

<Grid
	position.y={-0.001}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={0}
	cellSize={2}
	infiniteGrid
/>

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<AutoColliders>
		<T.Mesh position.y={1.2} position.z={-0.75}>
			<T.BoxGeometry />
			<T.MeshStandardMaterial color="#0059BA" />
		</T.Mesh>
	</AutoColliders>
</Float>

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<T.Mesh position={[1.2, 1.5, 0.75]} rotation.x={5} rotation.y={71}>
		<T.TorusKnotGeometry args={[0.5, 0.15, 100, 12, 2, 3]} />
		<T.MeshStandardMaterial color="#F85122" />
	</T.Mesh>
</Float>

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<T.Mesh position={[-1.4, 1.5, 0.75]} rotation={[-5, 128, 10]}>
		<T.IcosahedronGeometry />
		<T.MeshStandardMaterial color="#F8EBCE" />
	</T.Mesh>
</Float>
