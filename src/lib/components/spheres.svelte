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

	function throwBall() {
		const sphere = spheres[sphereIdx];

		camera.getWorldDirection(playerDirection);

		sphere.collider.center
			.copy(playerCollider.end)
			.addScaledVector(playerDirection, playerCollider.radius * 1.5);

		// throw the ball with more force if we hold the button longer, and if we move forward

		const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001));

		sphere.velocity.copy(playerDirection).multiplyScalar(impulse);
		sphere.velocity.addScaledVector(playerVelocity, 2);

		sphereIdx = (sphereIdx + 1) % spheres.length;
	}
</script>
