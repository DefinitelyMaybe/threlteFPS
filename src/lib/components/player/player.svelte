<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { RigidBody, AutoColliders } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { mouse } from '@manapotion/svelte';
	import { Vector3 } from 'three';
	import type { Actions } from './PlayerTypes';
	import Input from './input.svelte';
	import { setContext } from 'svelte';

	const { camera } = useThrelte();

	let playerRigidBody: RapierRigidBody;
	let playerOnGround = false;

	const actions: Actions = {
		moveleft: 0,
		moveright: 0,
		moveforward: 0,
		movebackward: 0,
		jump: 0
	};

	$: if ($mouse.buttons.left) {
		if ($mouse.locked) {
			console.log('throw ball');
			// throwBall();
		}
	}

	setContext('playerContext', { actions, grounded: playerOnGround });

	useTask(() => {
		teleportPlayerIfOob();
		updatePlayerRigidBody();
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

	function updatePlayerRigidBody() {
		let initVel = playerRigidBody.linvel();
		let newVel = new Vector3(initVel.x, initVel.y, initVel.z);

		const temp = new Vector3(
			-actions.moveleft + actions.moveright,
			0,
			-actions.moveforward + actions.movebackward
		).normalize();

		// 	// gives a bit of air control
		// 	const speedDelta = delta * (playerOnFloor ? 25 : 8);

		playerRigidBody.setLinvel(newVel, true);
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

<Input />

<T.Group {...$$restProps}>
	<RigidBody
		bind:rigidBody={playerRigidBody}
		type="dynamic"
		enabledRotations={[false, false, false]}
	>
		<AutoColliders>
			<T.Mesh>
				<T.SphereGeometry />
				<T.MeshStandardMaterial />
			</T.Mesh>
			<T.PerspectiveCamera near={0.1} far={1000} makeDefault fov={70} />
		</AutoColliders>
	</RigidBody>
</T.Group>
