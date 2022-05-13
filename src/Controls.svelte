<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import { direction as selected } from "./stores";

	export let rendered: boolean;

	const root = document.querySelector(":root") as HTMLElement;
	const styles = window.getComputedStyle(root);

	let clientColor = styles.getPropertyValue("--client");
	let shopColor = styles.getPropertyValue("--shop");

	$: root.style.setProperty("--client", clientColor);
	$: root.style.setProperty("--shop", shopColor);

	const dispatch = createEventDispatcher();
</script>

<div class="controls">
	<div class="orientation">
		<div on:click={() => ($selected = "LR")} class:selected={$selected == "LR"} class="lr">
			►
		</div>
		<div on:click={() => ($selected = "TB")} class:selected={$selected == "TB"} class="tb">
			▼
		</div>
		<div on:click={() => ($selected = "RL")} class:selected={$selected == "RL"} class="rl">
			◄
		</div>
		<div on:click={() => ($selected = "BT")} class:selected={$selected == "BT"} class="bt">
			▲
		</div>
	</div>
	<div class="colors">
		Client<input type="color" bind:value={clientColor} />
		Shop<input type="color" bind:value={shopColor} />
	</div>
	<!-- <svg
		class="download"
		class:rendered
		viewBox="0 0 224 173"
		xmlns="http://www.w3.org/2000/svg"
		on:click={() => rendered && dispatch("download")}
	>
		<path
			d="M152.021 65.186l-3.893-13.8C142.201 30.376 122.877 15 100 15c-27.614 0-50 22.386-50 50 0 2.904.246 5.74.715 8.489l3.071 17.994L35 91c-11.046 0-20 8.954-20 20s8.954 20 20 20h20.5v15H35c-19.33 0-35-15.67-35-35 0-14.916 9.33-27.653 22.473-32.692 3.89-1.49 9.042-2.296 13.456-2.296A65.418 65.418 0 0135 65c0-1.343.04-2.677.121-4C37.187 26.965 65.445 0 100 0c29.768 0 54.862 20.01 62.565 47.314A50.146 50.146 0 01174 46c27.614 0 50 22.386 50 50s-22.386 50-50 50h-15v-15h15c19.33 0 35-15.67 35-35s-15.67-35-35-35c-2.776 0-5.458.32-8.018.92l-13.961 3.266z"
		/>
		<path d="M123 71H93v60H64l43.5 42 43.5-42h-28V71z" />
	</svg> -->
</div>

<style lang="scss">
	// .download {
	// 	width: 3rem;
	// 	fill: var(--bg-alt);
	// 	cursor: not-allowed;
	// 	&.rendered {
	// 		fill: var(--fg-primary);
	// 		cursor: pointer;
	// 	}
	// }
	.controls {
		display: flex;
		justify-content: center;
		gap: 3vw;
	}

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

	.colors {
		display: flex;
		align-items: center;
		gap: 1rem;
		user-select: none;
		& input {
			display: inline-block;
			width: 3rem;
			height: 3rem;
			border: 1px solid var(--fg-primary);
			outline: none;
			padding: 0;
			cursor: pointer;
		}
	}
</style>
