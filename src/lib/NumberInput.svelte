<script lang="ts">
	export let label = "";
	export let value: number;
	export let min = 0;
	export let max = 100;

	$: value = Math.min(Math.max(value || 0, min), max);

	function onInput(e: InputEvent & { currentTarget: HTMLInputElement & EventTarget }) {
		if (isNaN(+e.currentTarget.value)) {
			e.currentTarget.value = value.toString();
		} else {
			value = +e.currentTarget.value;
		}
	}

	function onBlur(e: FocusEvent & { currentTarget: HTMLInputElement & EventTarget }) {
		value = Math.min(Math.max(value || 0, min), max);
		e.currentTarget.value = value.toString();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === "ArrowUp") {
			value = Math.min(value + 1, max);
		} else if (e.key === "ArrowDown") {
			value = Math.max(value - 1, min);
		}
	}
</script>

<label>
	<span>{label}</span>
	<input
		type="text"
		inputmode="numeric"
		{value}
		on:input={onInput}
		on:blur={onBlur}
		on:keydown={onKey}
	/>
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
