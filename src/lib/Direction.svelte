<script lang="ts">
	export let orientation: Orientation = "LR";
</script>

<div class="orientation">
	<div on:click={() => (orientation = "LR")} class:selected={orientation == "LR"}>►</div>
	<div on:click={() => (orientation = "TB")} class:selected={orientation == "TB"}>▼</div>
	<div on:click={() => (orientation = "RL")} class:selected={orientation == "RL"}>◄</div>
	<div on:click={() => (orientation = "BT")} class:selected={orientation == "BT"}>▲</div>
</div>

<style lang="scss">
	.orientation {
		display: flex;
		gap: 1rem;
		& > div {
			width: 3rem;
			aspect-ratio: 1;
			border-radius: 0.25rem;
			background-color: var(--bg-alt);
			cursor: pointer;
			display: grid;
			place-items: center;
			user-select: none;
		}
	}

	div.selected {
		scale: 0.9;
		background-color: var(--bg-primary);
	}
</style>
