<script lang="ts">
	export let checked: boolean = false;
	export let label: string = "";
</script>

<label>
	{label}
	<input type="checkbox" bind:checked />
	<div class="switch" tabindex="-1" />
</label>

<style lang="scss">
	label {
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		justify-content: space-between;
		width: 100%;
	}
	input {
		display: none;
	}
	input:checked + .switch {
		background-color: var(--green);
		&:before {
			transform: translateX(100%);
		}
	}
	.switch {
		--height: 2rem;
		display: inline-block;
		width: calc(var(--height) * 2);
		height: var(--height);
		border-radius: 1rem;
		background-color: var(--bg-primary);
		transition: 0.2s;
		position: relative;
		&:before {
			content: "";
			left: 0;
			position: absolute;
			width: var(--height);
			height: var(--height);
			border-radius: 50%;
			background-color: white;
			transition: transform 0.2s;
		}
		&:focus-visible {
			outline: solid 2px teal;
		}
	}
</style>
