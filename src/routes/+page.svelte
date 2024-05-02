<script lang="ts">
	import '../app.css';
	import { Canvas } from '@threlte/core';
	import { World, Debug } from '@threlte/rapier';
	import Scene from '$lib/components/Scene.svelte';
	import { Pane, Checkbox, Button } from 'svelte-tweakpane-ui';
	import { debug, playerRigidBody } from '$lib/stores';
	import {
		Listeners,
		browser,
		enterFullscreen,
		exitFullscreen,
		mouse,
		unlockPointer,
		lockPointer
	} from '@manapotion/svelte';
	import { VSMShadowMap } from 'three';
</script>

<Listeners />

<div class="h-screen w-screen">
	<Canvas shadows={VSMShadowMap}>
		<World gravity={[0, -50, 0]}>
			{#if $debug}
				<Debug />
			{/if}
			<Scene />
		</World>
	</Canvas>
</div>

<div class="absolute top-0 w-full text-center text-white">
	<p>mouse to look around and click to throw ball</p>
	<p><span class="font-bold">wasd</span> to move, <span class="font-bold">Space</span> to jump</p>
	<a href="https://github.com/DefinitelyMaybe/threlteFPS">source code (MIT)</a>
</div>

<Pane position="fixed">
	<Checkbox bind:value={$debug} label="debug" />
	<Button
		title="toggle fullscreen"
		on:click={$browser.isFullscreen ? exitFullscreen : enterFullscreen}
	/>
	<Button title="toggle mouseLock" on:click={$mouse.locked ? unlockPointer : lockPointer} />
	<Button
		title="log value"
		on:click={() => {
			console.log($playerRigidBody?.translation());
		}}
	/>
	<!-- <Button
		title="toggle mouseLock"
		on:click={() => {
			if ($cameraControls) {
				$cameraControls.lockPointer();
			}
		}}
	/> -->
</Pane>
