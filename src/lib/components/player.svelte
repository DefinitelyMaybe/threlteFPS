<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { BasicPlayerController } from '@threlte/rapier';
	import { keyboard, mouse } from '@manapotion/svelte';
	// import CameraControls from './camera-controls.svelte';
	// import { cameraControls } from '../stores';
	import { CapsuleGeometry, Euler, MeshStandardMaterial } from 'three';

	const { camera } = useThrelte();

	const PI_2 = Math.PI / 2;
	const camEuler = new Euler(0, 0, 0, 'YXZ');
	let maxPolarAngle = Math.PI;
	let minPolarAngle = 0;
	let pointerSpeed = 1.0;

	let playerOnFloor = false;

	$: if ($mouse.buttons.left) {
		if ($mouse.locked) {
			console.log('throw ball');
			// throwBall();
		}
	}

	useTask((delta) => {
		handleInput(delta);
		teleportPlayerIfOob();
	});

	function getForwardVector() {
		camera.getWorldDirection(playerDirection);
		playerDirection.y = 0;
		playerDirection.normalize();

		return playerDirection;
	}

	function getSideVector() {
		camera.getWorldDirection(playerDirection);
		playerDirection.y = 0;
		playerDirection.normalize();
		playerDirection.cross(camera.up);

		return playerDirection;
	}

	function handleInput(delta: number) {
		// gives a bit of air control
		const speedDelta = delta * (playerOnFloor ? 25 : 8);

		if ($keyboard.codes['KeyW']) {
			// playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
		}

		if ($keyboard.codes['KeyS']) {
			// playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
		}

		if ($keyboard.codes['KeyA']) {
			// playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
		}

		if ($keyboard.codes['KeyD']) {
			// playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
		}

		if (playerOnFloor) {
			if ($keyboard.codes['Space']) {
				// playerVelocity.y = 15;
			}
		}
	}

	// inspired by https://github.com/mrdoob/three.js/examples/jsm/controls/PointerLockControls.js#L117
	function handleMouseMove(event: MouseEvent) {
		if ($mouse.locked) {
			camEuler.setFromQuaternion($camera.quaternion);

			camEuler.y -= event.movementX * 0.002 * pointerSpeed;
			camEuler.x -= event.movementY * 0.002 * pointerSpeed;

			camEuler.x = Math.max(PI_2 - maxPolarAngle, Math.min(PI_2 - minPolarAngle, camEuler.x));

			$camera.quaternion.setFromEuler(camEuler);
		}
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

	function teleportPlayerIfOob() {
		if ($camera.position.y <= -25) {
			console.log('YES, oob');
			// playerCollider.start.set(0, 0.35, 0);
			// playerCollider.end.set(0, 1, 0);
			// playerCollider.radius = 0.35;
			// camera.position.copy(playerCollider.end);
			// camera.rotation.set(0, 0, 0);
		}
	}
</script>

<svelte:body on:mousemove={handleMouseMove} />

<T.PerspectiveCamera near={0.1} far={1000} makeDefault position={[10, 10, 10]} fov={70}
></T.PerspectiveCamera>
<!-- <CameraControls
		on:create={({ ref }) => {
			$cameraControls = ref;
			// console.log(ref.azimuthRotateSpeed);
			ref.moveTo(10, 10, 10);
			ref.azimuthRotateSpeed = 1;
			ref.polarRotateSpeed = 1;
			ref.smoothTime = 0.1;
			ref.draggingSmoothTime = 0.1;
		}}
	/> -->

<BasicPlayerController position={[10, 10, 10]} speed={3}>
	<T.Mesh position.y={0.8}>
		<T.CapsuleGeometry args={[0.3, 1.8 - 0.3 * 2]} />
		<T.MeshStandardMaterial />
	</T.Mesh>
</BasicPlayerController>
