<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { mouse } from '@manapotion/svelte';
	import { Euler } from 'three';
	import { getContext } from 'svelte';
	import type { PlayerContext } from './PlayerTypes';

	const playerContext: PlayerContext = getContext('playerContext');
	const actions = playerContext.actions;

	const { camera } = useThrelte();

	const PI_2 = Math.PI / 2;
	const camEuler = new Euler(0, 0, 0, 'YXZ');
	let maxPolarAngle = Math.PI;
	let minPolarAngle = 0;
	let pointerSpeed = 1.0;

	function handleMouseMove(event: MouseEvent) {
		if ($mouse.locked) {
			camEuler.setFromQuaternion($camera.quaternion);

			camEuler.y -= event.movementX * 0.002 * pointerSpeed;
			camEuler.x -= event.movementY * 0.002 * pointerSpeed;

			camEuler.x = Math.max(PI_2 - maxPolarAngle, Math.min(PI_2 - minPolarAngle, camEuler.x));

			$camera.quaternion.setFromEuler(camEuler);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.code == 'KeyW') {
			actions.moveforward = 1;
		}

		if (event.code == 'KeyS') {
			actions.movebackward = 1;
		}

		if (event.code == 'KeyA') {
			actions.moveleft = 1;
		}

		if (event.code == 'KeyD') {
			actions.moveright = 1;
		}

		if (event.code == 'KeyE') {
			actions.jump = 1;
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.code == 'KeyW') {
			actions.moveforward = 0;
		}

		if (event.code == 'KeyS') {
			actions.movebackward = 0;
		}

		if (event.code == 'KeyA') {
			actions.moveleft = 0;
		}

		if (event.code == 'KeyD') {
			actions.moveright = 0;
		}

		if (event.code == 'KeyE') {
			actions.jump = 0;
		}
	}
</script>

<svelte:window on:mousemove={handleMouseMove} on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
