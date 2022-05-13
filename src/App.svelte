<script lang="ts">
	import mermaid from "mermaid";
	import Controls from "./Controls.svelte";
	import Input from "./Input.svelte";
	import { direction } from "./stores";

	let input = "5\n0 4 15\n1 0 14 2 7 3 23\n2 0 7\n3 1 23 4 16\n4 2 15 3 9\n2\n0 3\n3\n1 4 2";
	let output: HTMLDivElement;
	let svgElement: SVGSVGElement;
	let valid = true;
	let rendered = false;

	direction.subscribe(() => {
		if (valid && rendered) {
			render(input);
		}
	});

	mermaid.initialize({
		startOnLoad: false,
		flowchart: {
			diagramPadding: 1,
			// doesn't seem to be working for some reason
			useMaxWidth: true,
			padding: 20,
		},
	});

	function formatInput(lines: string[]) {
		const result: string[] = [`flowchart ${$direction}`];
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

	function render(data: string) {
		if (data == "") return;
		const lines = data.split("\n");
		const clients = lines.at(-1).split(" ");
		const shops = lines.at(-3).split(" ");
		const graphString = formatInput(lines);
		mermaid.render("graph", graphString, (code) => {
			const svg = document.createRange().createContextualFragment(code).querySelector("svg");
			svg.removeAttribute("style");
			svg.removeAttribute("height");
			svg.querySelector("style").remove();
			for (const node of svg.querySelectorAll(".node")) {
				const nodeName = node.id.split("-")[1];
				if (clients.includes(nodeName)) {
					node.classList.add("client");
				} else if (shops.includes(nodeName)) {
					node.classList.add("shop");
				}
				(node.firstChild as HTMLElement).setAttribute("rx", "8");
				(node.firstChild as HTMLElement).setAttribute("ry", "8");
			}
			output.appendChild(svg);
			svgElement = svg;
		});
		rendered = true;
	}

	// haven't had time to implement
	function download() {}
</script>

<main>
	<div class="input-container">
		<Input bind:valid bind:value={input} />
		<button class:valid on:click={() => valid && render(input)} class="render">Render</button>
	</div>
	<div class="graph-container">
		<div bind:this={output} class="graph" />
		<Controls {rendered} on:download={download} />
	</div>
</main>

<style lang="scss">
	main {
		height: 100%;
		display: flex;
		padding: 1rem;
		gap: 1rem;
	}
	.input-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 30vw;
		min-width: 30rem;
	}
	.render {
		color: inherit;
		padding: 1rem;
		font-weight: bold;
		font-size: 2.5rem;
		border: none;
		border-radius: var(--br);
		background-color: var(--red);
		cursor: not-allowed;
		&.valid {
			background-color: var(--green);
			cursor: pointer;
			&:hover {
				scale: 1.01;
			}
			&:active {
				scale: 1;
			}
		}
	}
	.graph-container {
		flex-grow: 1;
		background-color: var(--bg-secondary);
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: var(--br);
		padding: 1rem;
		height: 100%;
	}
	.graph {
		flex-grow: 1;
		display: flex;
		place-items: center;
	}
	@media (max-width: 700px) {
		main {
			display: grid;
			grid-template: 2fr 3fr / 1fr;
		}
		.input-container {
			width: 100%;
			height: 50vh;
		}
		.graph-container {
			flex-direction: column-reverse;
		}
	}
</style>
