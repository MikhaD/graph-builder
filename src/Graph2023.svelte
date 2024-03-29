<script lang="ts">
	import { onDestroy } from "svelte";
	import Direction from "./lib/Direction.svelte";
	import Graph from "./lib/Graph.svelte";
	import Input from "./lib/Input.svelte";
	import Generate from "./lib/Generate.svelte";

	let input =
		localStorage.getItem("gb-2023-value") ||
		"A B 4\nA D 1\nA E 5\nB G 1\nD B 2\nD E 3\nD F 8\nE F 4\nG F 2";
	let graphInput = "";
	let rendered = false;
	let dragOver = false;
	let autoRender = Boolean(+localStorage.getItem("gb-2023-autoRender")) ?? true;
	let orientation: Orientation =
		(localStorage.getItem("gb-2023-orientation") as Orientation) ?? "LR";

	function validate(value: string) {
		// replace all instances of multiple spaces with a single space
		value = value.replaceAll(/[^\S\r\n]+/g, " ");
		const lines = value.split("\n");
		for (const line of lines) {
			const tokens = line.trim().split(" ");
			if (tokens.length != 3) {
				// incorrect number of tokens in a line
				return false;
			}
			if (isNaN(+tokens[2])) {
				// third token is not a number
				return false;
			}
		}
		return true;
	}

	function preprocess(data: string) {
		const result = [`flowchart ${orientation}`];
		for (const line of data.split("\n")) {
			const tokens = line.trim().split(" ");
			result.push(`${tokens[0]}-- ${tokens[2]} -->${tokens[1]}`);
		}
		return result.join("\n\t");
	}

	function onUpload(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.currentTarget.files.length > 0) {
			const file = e.currentTarget.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					input = (e.target.result as string).trim();
				}
			};
			reader.readAsText(file);
		}
	}

	function onDownload(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
		const blob = new Blob([input], { type: "text/plain" });
		e.currentTarget.href = URL.createObjectURL(blob);
		e.currentTarget.download = "data.txt";
	}

	function onDrop(e: DragEvent & { currentTarget: HTMLLabelElement & EventTarget }) {
		dragOver = false;
		if (e.dataTransfer.items) {
			const file = e.dataTransfer.items[0].getAsFile();
			file.text().then((text) => {
				input = text.trim();
			});
		}
	}

	function onGenerate(e: CustomEvent<string>) {
		input = e.detail;
	}

	function onRender() {
		graphInput = input;
		rendered = true;
	}

	onDestroy(() => {
		localStorage.setItem("gb-2023-value", input);
		localStorage.setItem("gb-2023-orientation", orientation);
		localStorage.setItem("gb-2023-autoRender", (+autoRender).toString());
	});
</script>

<section
	class:drag-over={dragOver}
	on:dragover|preventDefault={function () {
		dragOver = true;
	}}
	on:dragleave={function () {
		dragOver = false;
	}}
	on:drop|preventDefault={onDrop}
>
	<aside class="input-container">
		<Generate on:generate={onGenerate} />
		<div class="buttons">
			<label for="upload-file" class="button">
				<svg viewBox="0 0 24 24">
					<path
						d="M7 19h2v-2H7c-1.654 0-3-1.346-3-3c0-1.404 1.199-2.756 2.673-3.015l.581-.102l.192-.558C8.149 8.274 9.895 7 12 7c2.757 0 5 2.243 5 5v1h1c1.103 0 2 .897 2 2s-.897 2-2 2h-3v2h3c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888C18.507 7.67 15.56 5 12 5C9.244 5 6.85 6.611 5.757 9.15C3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5zM13 19v-4h3l-4-5l-4 5h3v4z"
					/>
				</svg>
				Upload
				<input id="upload-file" type="file" accept=".txt" on:change={onUpload} />
			</label>
			<a class="button" id="download" on:click={onDownload}>
				<svg viewBox="0 0 24 24">
					<path
						d="M18.948 11.112C18.511 7.67 15.563 5 12.004 5c-2.756 0-5.15 1.611-6.243 4.15c-2.148.642-3.757 2.67-3.757 4.85c0 2.757 2.243 5 5 5h1v-2h-1c-1.654 0-3-1.346-3-3c0-1.404 1.199-2.757 2.673-3.016l.581-.102l.192-.558C8.153 8.273 9.898 7 12.004 7c2.757 0 5 2.243 5 5v1h1c1.103 0 2 .897 2 2s-.897 2-2 2h-2v2h2c2.206 0 4-1.794 4-4a4.008 4.008 0 0 0-3.056-3.888zM13.004 14v-4h-2v4h-3l4 5l4-5z"
					/>
				</svg>
				Download
			</a>
		</div>
		<Input {validate} bind:value={input} on:render={onRender} bind:autoRender />
	</aside>
	<div class="graph-container">
		<div class="orientation tile">
			<Direction bind:orientation />
		</div>
		{#key rendered && orientation}
			<Graph update={rendered} data={graphInput} {preprocess} />
		{/key}
	</div>
</section>

<style lang="scss">
	section {
		height: 100%;
		padding: 1rem;
		display: flex;
		gap: 1rem;
		&.drag-over::before {
			position: fixed;
			content: "Drop To Upload File";
			text-align: center;
			display: grid;
			place-items: center;
			font-size: 6rem;
			inset: 0;
			background-color: #0884;
			border: solid 2rem #088;
			z-index: 1;
		}
	}
	aside {
		display: flex;
		height: 100%;

		flex-direction: column;
		gap: 1rem;
	}
	.orientation {
		display: grid;
		place-items: center;
	}
	.buttons {
		display: flex;
		gap: 1rem;
		svg {
			fill: currentcolor;
			height: 100%;
		}
	}
	#upload-file {
		display: none;
	}
	@media (max-width: 700px) {
		section {
			display: grid;
		}
	}
</style>
