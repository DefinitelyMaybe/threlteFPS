<script lang="ts">
	import * as THREE from 'three';
	import { useThrelte } from '@threlte/core';

	const { scene } = useThrelte();

	const NUM_SPHERES = 100;
	const SPHERE_RADIUS = 0.2;

	const sphereGeometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 5);
	const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xdede8d });

	const spheres = [];
	let sphereIdx = 0;

	for (let i = 0; i < NUM_SPHERES; i++) {
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.castShadow = true;
		sphere.receiveShadow = true;

		scene.add(sphere);

		spheres.push({
			mesh: sphere,
			collider: new THREE.Sphere(new THREE.Vector3(0, -100, 0), SPHERE_RADIUS),
			velocity: new THREE.Vector3()
		});
	}
</script>
