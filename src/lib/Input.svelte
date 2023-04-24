<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Toggle from "./Toggle.svelte";
	export let valid = true;
	export let value: string;
	export let validate: (e: string) => boolean;
	export let autoRender = false;

	let input: HTMLTextAreaElement;

	$: valid = validate(value);

	$: if (valid && autoRender && value) {
		dispatch("render");
	}

	const dispatch = createEventDispatcher();
</script>

<textarea class:valid bind:this={input} id="input" class="tile" bind:value />
<span class="auto tile">
	<Toggle label="Auto Render" bind:checked={autoRender} />
</span>
<button class:valid class="render" on:click={() => dispatch("render")}>Render</button>

<style lang="scss">
	.container {
		flex: 1;
		padding: 0;
		position: relative;
	}
	.auto {
		display: flex;
		justify-content: end;
	}
	#input {
		&:focus {
			outline: solid 2px var(--red);
		}
		&.valid:focus {
			outline: solid 2px var(--green);
		}
		color: inherit;
		font-family: Consolas, "Courier New", Courier, monospace;
		resize: none;
		padding: 1rem;
		border: none;
		width: 100%;
		height: 100%;
	}
	@media (max-width: 700px) {
		#input {
			min-height: 20rem;
		}
	}
</style>
