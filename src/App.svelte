<script lang="ts">
	import Graph2022 from "./Graph2022.svelte";
	import Graph2023 from "./Graph2023.svelte";
	let selected = document.location.hash.slice(1) || "2023";
	const tabs = {
		"2022": Graph2022,
		"2023": Graph2023,
	};

	function onSelect(e: MouseEvent & { currentTarget: HTMLDivElement & EventTarget }) {
		if (e.currentTarget.dataset.name) {
			selected = e.currentTarget.dataset.name;
		}
	}

	$: document.location.hash = selected;
</script>

<div class="container">
	<nav>
		{#each Object.keys(tabs) as name}
			<div class="tab" on:click={onSelect} class:selected={name == selected} data-name={name}>
				{name}
			</div>
		{/each}
	</nav>
	<main>
		<svelte:component this={tabs[selected]} />
	</main>
</div>

<style lang="scss">
	.container {
		--border: solid 1px var(--bg-alt);
		height: 100%;
		display: grid;
		grid-template-rows: 5rem 1fr;
	}
	main {
		border: var(--border);
		border-top: none;
		height: 100%;
	}
	nav {
		display: flex;
	}
	.tab {
		display: grid;
		place-items: center;
		font-size: 2.5rem;
		font-weight: bold;
		cursor: pointer;
		flex: 1;
		background-color: var(--bg-secondary);
		border-bottom: var(--border);
		border-radius: var(--br) var(--br) 0 0;
	}
	.tab.selected {
		font-size: 3rem;
		background-color: var(--bg-primary);
		border: var(--border);
		border-bottom: none;
	}
</style>
