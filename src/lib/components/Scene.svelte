<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import * as THREE from 'three';
	import Map from './models/collision-world.svelte';
	import Player from './player.svelte';

	const { scene } = useThrelte();

	scene.background = new THREE.Color(0x88ccee);
	scene.fog = new THREE.Fog(0x88ccee, 20, 100);
</script>

<Player />

<T.DirectionalLight
	color={0xffffff}
	intensity={2.5}
	position={[-5, 25, -1]}
	castShadow
	shadow.camera.near={0.01}
	shadow.camera.far={500}
	shadow.camera.right={30}
	shadow.camera.left={-30}
	shadow.camera.top={30}
	shadow.camera.bottom={-30}
	shadow.mapSize.width={1024}
	shadow.mapSize.height={1024}
	shadow.radius={4}
	shadow.bias={-0.00006}
/>

<T.HemisphereLight args={[0x8dc1de, 0x00668d, 1.5]} position={[2, 1, 1]} />

<Grid infiniteGrid />

<T.AxesHelper />

<Map />
