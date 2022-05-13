<script lang="ts">
	type TextAreaInput = Event & {
		currentTarget: EventTarget & HTMLTextAreaElement;
	};

	export let valid = true;
	export let value: string;

	let input: HTMLTextAreaElement;

	function validate(e: TextAreaInput) {
		// replace all instances of multiple spaces with a single space
		value = e.currentTarget.value.replaceAll(/[^\S\r\n]+/g, " ");
		// check if there are any non whitespace or numbers
		if (/[^\d\s]/g.test(value)) {
			valid = false;
			return;
		}
		// make sure that there are the correct number of lines
		const lines = value.split("\n");
		const line1 = +lines[0];
		if (isNaN(line1) || lines.length != +line1 + 5) {
			valid = false;
			return;
		}
		// make sure each line has an odd length
		const nodes = { listed: [], joined: [] };
		for (let i = 1; i <= line1; ++i) {
			const values = lines[i].trim().split(" ");
			nodes.listed.push(values[0]);
			nodes.joined = [...nodes.joined, ...values.filter((v, i) => i % 2 === 1)];
			if (values.length % 2 === 0) {
				valid = false;
				return;
			}
		}
		// make sure there are the correct number of clients and shops
		const shops = lines.at(-3).trim().split(" ");
		const clients = lines.at(-1).trim().split(" ");
		if (+lines.at(-4) !== shops.length || +lines.at(-2) !== clients.length) {
			valid = false;
			return;
		}
		// make sure there are no duplicate nodes and no invalid nodes
		const nodeSet = new Set<string>(nodes.listed);
		const joinedSet = new Set(nodes.joined);
		function invalidNode(val: string) {
			return !nodeSet.has(val);
		}
		if (nodeSet.size !== nodes.listed.length || nodes.joined.some(invalidNode)) {
			valid = false;
			return;
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
			valid = false;
			return;
		}
		// make sure no nodes are listed as clients and shops, and no nodes are left out
		if (shops.some((s) => clientSet.has(s))) {
			valid = false;
			return;
		}
		valid = true;
	}
</script>

<textarea class:valid bind:this={input} id="input" on:input={validate} {value} />

<style lang="scss">
	#input {
		&:focus {
			outline: solid 2px var(--red);
		}
		&.valid:focus {
			outline: solid 2px var(--green);
		}
		color: inherit;
		font-family: Consolas, "Courier New", Courier, monospace;
		resize: none;
		padding: 1rem;
		flex-grow: 1;
		border: none;
		background-color: var(--bg-secondary);
		border-radius: var(--br);
	}
</style>
