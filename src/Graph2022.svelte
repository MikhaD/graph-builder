<script lang="ts">
	import Input from "./lib/Input.svelte";
	import { onDestroy } from "svelte";
	import Direction from "./lib/Direction.svelte";
	import Color from "./lib/Color.svelte";
	import Graph from "./lib/Graph.svelte";

	let input =
		localStorage.getItem("gb-2022-value") ||
		"5\n0 4 15\n1 0 14 2 7 3 23\n2 0 7\n3 1 23 4 16\n4 2 15 3 9\n2\n0 3\n3\n1 4 2";
	let graphInput = "";
	let valid = true;
	let rendered = false;
	let orientation: Orientation =
		(localStorage.getItem("gb-2022-orientation") as Orientation) ?? "LR";
	let clientColor = "#606060";
	let shopColor = "#000000";
	let shops: string[];
	let clients: string[];

	function preprocess(data: string) {
		if (data == "") return;
		const result: string[] = [`flowchart ${orientation}`];

		const lines = data.split("\n");
		clients = lines.at(-1).split(" ");
		shops = lines.at(-3).split(" ");

		for (let i = 1; i <= +lines[0]; ++i) {
			const points = lines[i].split(" ");
			const start = points.shift();
			if (points.length == 0) {
				result.push(start);
			}
			while (points.length > 0) {
				const end = points.shift();
				const weight = points.shift();
				result.push(`${start}-- ${weight} -->${end}`);
			}
		}
		return result.join("\n\t");
	}

	function postprocess(svg: SVGSVGElement) {
		for (const node of svg.querySelectorAll(".node")) {
			const nodeName = node.id.split("-")[1];
			if (clients.includes(nodeName)) {
				node.classList.add("client");
			} else if (shops.includes(nodeName)) {
				node.classList.add("shop");
			}
		}
		return svg;
	}

	function validate(value: string): boolean {
		// replace all instances of multiple spaces with a single space
		value = value.replaceAll(/[^\S\r\n]+/g, " ");
		// check if there are any non whitespace or numbers
		if (/[^\d\s]/g.test(value)) {
			return false;
		}
		// make sure that there are the correct number of lines
		const lines = value.split("\n");
		const line1 = +lines[0];
		if (isNaN(line1) || lines.length != +line1 + 5) {
			return false;
		}
		// make sure each line has an odd length
		const nodes = { listed: [], joined: [] };
		for (let i = 1; i <= line1; ++i) {
			const values = lines[i].trim().split(" ");
			nodes.listed.push(values[0]);
			nodes.joined = [...nodes.joined, ...values.filter((v, i) => i % 2 === 1)];
			if (values.length % 2 === 0) {
				return false;
			}
		}
		// make sure there are the correct number of clients and shops
		const shops = lines.at(-3).trim().split(" ");
		const clients = lines.at(-1).trim().split(" ");
		if (+lines.at(-4) !== shops.length || +lines.at(-2) !== clients.length) {
			return false;
		}
		// make sure there are no duplicate nodes and no invalid nodes
		const nodeSet = new Set<string>(nodes.listed);
		function invalidNode(val: string) {
			return !nodeSet.has(val);
		}
		if (nodeSet.size !== nodes.listed.length || nodes.joined.some(invalidNode)) {
			return false;
		}
		const shopsSet = new Set(shops);
		const clientSet = new Set(clients);
		// make sure there are no duplicates in the clients or shops list, and no invalid nodes
		if (
			shopsSet.size !== shops.length ||
			clientSet.size !== clients.length ||
			shops.some(invalidNode) ||
			clients.some(invalidNode)
		) {
			return false;
		}
		// make sure no nodes are listed as clients and shops, and no nodes are left out
		if (shops.some((s) => clientSet.has(s))) {
			return false;
		}
		return true;
	}

	function render() {
		graphInput = input;
		rendered = true;
	}

	onDestroy(() => {
		localStorage.setItem("gb-2022-value", input);
		localStorage.setItem("gb-2022-orientation", orientation);
	});
</script>

<section>
	<div class="input-container">
		<Input {validate} bind:valid bind:value={input} on:render={render} />
	</div>
	<div class="graph-container" style:--client={clientColor} style:--shop={shopColor}>
		<div class="controls tile">
			<Direction bind:orientation />
			<div>
				<Color bind:color={clientColor} label="Client" />
				<Color bind:color={shopColor} label="Shop" />
			</div>
		</div>
		{#key rendered && orientation}
			<Graph update={valid && rendered} data={graphInput} {preprocess} {postprocess} />
		{/key}
	</div>
</section>

<style lang="scss">
	section {
		display: flex;
		padding: 1rem;
		gap: 1rem;
		height: 100%;
	}
	.controls {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.graph {
		display: grid;
		place-items: center;
	}
	@media (max-width: 700px) {
		section {
			display: grid;
			grid-template: 2fr 3fr / 1fr;
		}
	}
</style>
