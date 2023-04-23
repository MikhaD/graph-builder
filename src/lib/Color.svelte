<script lang="ts">
	export let color: string;
	export let label: string;
</script>

<label class="color">
	{label}
	<input type="color" bind:value={color} />
</label>

<style lang="scss">
	.color {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		user-select: none;
		cursor: pointer;
		& input {
			display: inline-block;
			width: 3rem;
			height: 3rem;
			border: 1px solid var(--fg-primary);
			outline: none;
			padding: 0;
		}
	}
</style>
