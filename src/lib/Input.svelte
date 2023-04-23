<script lang="ts">
	export let valid = true;
	export let value: string;
	export let validate: (e: string) => boolean;

	let input: HTMLTextAreaElement;

	$: valid = validate(value);
</script>

<textarea class:valid bind:this={input} id="input" class="tile" bind:value />

<style lang="scss">
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
		flex-grow: 1;
		border: none;
	}
</style>
