<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { RigidBody, AutoColliders } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { mouse } from '@manapotion/svelte';
	import { Vector3, Group } from 'three';
	import type { Actions } from './PlayerTypes';
	import Input from './input.svelte';
	import { setContext } from 'svelte';
	import { playerRigidBody as playerStore } from '../../stores';

	const { camera } = useThrelte();
	const group = new Group();
	group.position.set(-6.9, 4, -5.2);

	let playerRigidBody: RapierRigidBody;
	let playerOnGround = false;
	let jumpStrength = 25;

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

	$: if (playerRigidBody) {
		$playerStore = playerRigidBody;
	}

	setContext('playerContext', { actions, grounded: playerOnGround });

	useTask((delta) => {
		teleportPlayerIfOob();
		updatePlayerRigidBody(delta);
	});

	function updatePlayerRigidBody(delta: number) {
		let initVel = playerRigidBody.linvel();

		const speedDelta = delta * 1000 * (playerOnGround ? 1 : 0.75);
		const temp = getMovementDirection()
			.applyQuaternion($camera.quaternion)
			.multiplyScalar(speedDelta);

		if (actions.jump == 1 && playerOnGround) {
			playerRigidBody.setLinvel({ x: temp.x, y: jumpStrength, z: temp.z }, true);
		} else {
			playerRigidBody.setLinvel({ x: temp.x, y: initVel.y, z: temp.z }, true);
		}
	}

	function getMovementDirection() {
		return new Vector3(
			-actions.moveleft + actions.moveright,
			0,
			-actions.moveforward + actions.movebackward
		).normalize();
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
		if (playerRigidBody) {
			const pos = playerRigidBody.translation();
			if (pos.y <= -25) {
				playerRigidBody.setTranslation({ x: -6.9, y: 4, z: -5.2 }, true);
			}
		}
	}
</script>

<Input />

<T is={group}>
	<RigidBody
		bind:rigidBody={playerRigidBody}
		type="dynamic"
		enabledRotations={[false, false, false]}
		on:contact={async () => {
			playerOnGround = true;
		}}
		on:collisionexit={() => {
			playerOnGround = false;
		}}
	>
		<AutoColliders>
			<T.Mesh castShadow>
				<T.CapsuleGeometry args={[2, 1, 2, 10]} />
				<T.MeshStandardMaterial />
			</T.Mesh>
			<T.PerspectiveCamera near={0.1} far={1000} makeDefault fov={70} />
		</AutoColliders>
	</RigidBody>
</T>
