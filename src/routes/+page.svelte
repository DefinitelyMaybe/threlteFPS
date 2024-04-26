<script lang="ts">
	import '../app.css';
	import { Canvas } from '@threlte/core';
	import { World, Debug } from '@threlte/rapier';
	import Scene from '$lib/components/Scene.svelte';
	import { Pane, Checkbox, Button } from 'svelte-tweakpane-ui';
	import { debug, cameraControls } from '$lib/stores';
	import {
		Listeners,
		browser,
		mouse,
		enterFullscreen,
		exitFullscreen,
		lockPointer,
		unlockPointer
	} from '@manapotion/svelte';
	import { VSMShadowMap } from 'three';
</script>

<Listeners />

<div class="h-screen w-screen">
	<Canvas shadows={VSMShadowMap}>
		<World>
			{#if $debug}
				<Debug />
			{/if}
			<Scene />
		</World>
	</Canvas>
</div>

<Pane position="fixed">
	<Checkbox bind:value={$debug} label="debug" />
	<Button
		title="toggle fullscreen"
		on:click={$browser.isFullscreen ? exitFullscreen : enterFullscreen}
	/>
	<!-- <Button title="toggle mouseLock" on:click={$mouse.locked ? unlockPointer : lockPointer} /> -->
	<Button
		title="toggle mouseLock"
		on:click={() => {
			if ($cameraControls) {
				$cameraControls.lockPointer();
			}
		}}
	/>
</Pane>
