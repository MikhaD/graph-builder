<script lang="ts">
	export let label = "";
	export let value: number = 0;
</script>

<label>
	<span>{label}</span>
	<input type="number" inputmode="numeric" bind:value />
</label>

<style>
	input {
		border-radius: var(--br);
		border: 1px solid var(--bg-alt);
		padding: 0 1rem;
		outline: transparent;
		font: inherit;
		color: inherit;
		background-color: transparent;
		width: 10rem;
	}
	label {
		display: flex;
		justify-content: space-between;
	}
</style>
