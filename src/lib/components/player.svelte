<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { keyboard, mouse } from '@manapotion/svelte';

	const { camera } = useThrelte();

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
