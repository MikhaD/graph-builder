<script lang="ts" context="module">
	const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
</script>

<script lang="ts">
	import { randint } from "../utils";

	import NumberInput from "./NumberInput.svelte";
	import { createEventDispatcher } from "svelte";

	let nodes = 6;
	let edges = 9;
	let minEdgeWeight = 1;
	let maxEdgeWeight = 10;
	$: maxEdges = nodes * (nodes - 1);

	const dispatch = createEventDispatcher();

	function generate() {
		const nodeNames = [];
		const lines = [];
		for (let i = 0; i < nodes; ++i) {
			const number = Math.floor(i / 26);
			nodeNames.push(`${LETTERS[i % 26]}${number ? number : ""}`);
		}
		const letterMap = new Map();
		for (let i = 0; i < nodeNames.length; ++i) {
			letterMap.set(nodeNames[i], [...nodeNames]);
			letterMap.get(nodeNames[i]).splice(i, 1);
		}
		for (let i = 0; i < edges; ++i) {
			const source = nodeNames.splice(randint(0, nodeNames.length), 1)[0];

			const targets = letterMap.get(source);
			console.log(targets);
			const destination = targets.splice(randint(0, targets.length), 1)[0];
			if (targets.length === 0) {
				letterMap.delete(source);
			} else {
				nodeNames.push(source);
			}
			const weight = randint(minEdgeWeight, maxEdgeWeight);
			lines.push(`${source} ${destination} ${weight}`);
		}
		dispatch("generate", lines.join("\n"));
	}
</script>

<div class="controls tile">
	<NumberInput bind:value={nodes} min={2} label="Nodes" />
	<NumberInput bind:value={edges} max={maxEdges} label="Edges" />
	<NumberInput bind:value={minEdgeWeight} label="Min Edge Weight" />
	<NumberInput bind:value={maxEdgeWeight} label="Max Edge Weight" />
	<button class="button" on:click={generate}>Generate Data</button>
</div>

<style lang="scss">
	.controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
