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
	let jumpStrength = 25;
	let ballThrowStrength = 60;

	let ballRigidBody: RapierRigidBody;

	const actions: Actions = {
		moveleft: 0,
		moveright: 0,
		moveforward: 0,
		movebackward: 0,
		jump: 0
	};

	$: if ($mouse.buttons.left) {
		if ($mouse.locked) {
			throwBall();
		}
	}

	setContext('playerContext', { actions, grounded: playerOnGround });

	useTask((delta) => {
		updatePlayerRigidBody(delta);
		teleportPlayerIfOob();
		resetBall();
	});

	function updatePlayerRigidBody(delta: number) {
		let initVel = playerRigidBody.linvel();

		const speedDelta = delta * 1000;
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
		const camDirection = new Vector3();
		$camera.getWorldDirection(camDirection);

		const playerPos = playerRigidBody.translation();
		const newBallPos = new Vector3(playerPos.x, playerPos.y, playerPos.z);
		newBallPos.addScaledVector(camDirection, 2.5);

		camDirection.multiplyScalar(ballThrowStrength);

		ballRigidBody.setTranslation(newBallPos, true);
		ballRigidBody.setLinvel(camDirection, true);
	}

	function teleportPlayerIfOob() {
		if (playerRigidBody) {
			const pos = playerRigidBody.translation();
			if (pos.y <= -25) {
				playerRigidBody.setTranslation({ x: -6.9, y: 5, z: -5.2 }, true);
				playerRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
			}
		}
	}

	function resetBall() {
		const ballPos = ballRigidBody.translation();
		if (ballPos.y <= -25) {
			ballRigidBody.setTranslation({ x: -6.9, y: 5, z: -5.2 }, true);
			ballRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		}
	}
</script>

<Input />

<T.Group position={[-6.9, 4, -5.2]}>
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
				<T.CapsuleGeometry args={[1, 1, 2, 10]} />
				<T.MeshStandardMaterial />
			</T.Mesh>
			<T.PerspectiveCamera near={0.1} far={1000} makeDefault fov={70} />
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[-6.9, 4, -5.2]}>
	<RigidBody type="dynamic" linearDamping={0.5} bind:rigidBody={ballRigidBody}>
		<AutoColliders shape="ball">
			<T.Mesh>
				<T.SphereGeometry args={[0.4]} />
				<T.MeshStandardMaterial color={0xdede8d} />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
