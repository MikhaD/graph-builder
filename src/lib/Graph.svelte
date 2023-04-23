<script lang="ts">
	import mermaid from "mermaid";
	import { renderSVG } from "../utils";

	mermaid.initialize({
		startOnLoad: false,
		flowchart: {
			useMaxWidth: true,
			padding: 20, // padding in pixels around each node
		},
	});

	/** The mermaid data to be converted into a graph */
	export let data: string;
	/** The graph is only updated when this value is true */
	export let update: boolean;
	/**
	 * A function that is called on the input string before it is passed to mermaid to be converted
	 * to an SVG.
	 * @param e The string
	 */
	export let preprocess: (e: string) => string = (e) => e;
	/**
	 * A function that is called on the generated SVG element before it is rendered, and returns a
	 * modified version of the SVG.
	 * @param e The svg element
	 */
	export let postprocess: (e: SVGSVGElement) => SVGSVGElement = (e) => e;

	let container: HTMLDivElement;

	$: update && container && container.appendChild(renderSVG(preprocess(data), postprocess));
</script>

<div class="graph tile" bind:this={container} />

<style>
	.graph {
		display: grid;
		place-items: center;
	}
</style>
