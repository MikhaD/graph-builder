import mermaid from "mermaid";

/**
 * Convert a mermaid graph to an SVG element
 * @param graph The mermaid graph to render as SVG
 */
export function renderSVG(graph: string, preprocessor: (e: SVGSVGElement) => SVGSVGElement): SVGSVGElement {
	const svg = new DOMParser()
		.parseFromString(mermaid.render("graph", graph), "image/svg+xml")
		.querySelector("svg")!;
	svg.removeAttribute("style");
	svg.removeAttribute("height");
	svg.querySelector("style")?.remove();
	return preprocessor(svg);
}