<script lang="ts">
	import '../app.css';
	import { Canvas } from '@threlte/core';
	import { World, Debug } from '@threlte/rapier';
	import Scene from '$lib/components/Scene.svelte';
	import { Pane, Checkbox, Button } from 'svelte-tweakpane-ui';
	import { debug } from '$lib/stores';
	import { Listeners, browser, enterFullscreen, exitFullscreen } from '@manapotion/svelte';
</script>

<Listeners />

<div class="h-screen w-screen">
	<Canvas>
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
</Pane>
