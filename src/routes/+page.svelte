<script lang="ts">
	import '../app.css';
	import { Canvas } from '@threlte/core';
	import { World, Debug } from '@threlte/rapier';
	import Scene from '$lib/components/Scene.svelte';
	import { Pane, Checkbox } from 'svelte-tweakpane-ui';
	import { debug } from '$lib/stores';
	import { Listeners } from '@manapotion/svelte';
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
</Pane>
