// Builds modules/home/components/palette-blue.css: the night-blue palette, scoped under
// html[data-palette="blue"].
//
//   node scripts/palette/blue.mjs [git-ref]
//
// The landing is written in its gold palette. The blue one is the dark mode of the landing as it
// was at `git-ref` (default below), before it turned gold. For every stylesheet, the script copies
// each colour declaration of that version and raises its selector, so blue wins over gold by
// specificity and keeps the old cascade between its own base and dark rules:
//   X        ->  html[data-palette="blue"] X
//   .dark X  ->  html.dark[data-palette="blue"] X
//   :root    ->  :root[data-palette="blue"]
// Rules for the old light mode are left out. Colour declarations that only the gold version has
// are printed at the end, so each one gets a reset in the block below.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ref = process.argv[2] ?? "3df833b";
const output = "modules/home/components/palette-blue.css";

const sheets = [
	"modules/home/components/landing-theme.css",
	"modules/home/components/landing.css",
	"modules/home/components/example-document.css",
	"modules/home/components/product-first/product-first.css",
	"modules/home/components/product-first/workspace-preview.css",
	"modules/home/components/v3/foundation.css",
	"modules/home/components/v3/hero.css",
	"modules/home/components/v3/sky.css",
	"modules/home/components/v3/closing.css",
	"modules/home/components/sections/sections.css",
	"modules/shared/ui/ui.css",
];

const colourProp = /color|background|border|shadow|fill|stroke|outline|filter|accent|caret|^--/;
const colourValue = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|color-mix|var\(|transparent|currentcolor/i;
const isColour = (decl) => colourProp.test(decl.prop) && colourValue.test(decl.value);

function raise(selector) {
	const s = selector.trim();
	if (s.includes(":not(.dark)")) return null;
	if (s.startsWith(":root")) return `:root[data-palette="blue"]${s.slice(5)}`;
	if (s === ".dark" || s.startsWith(".dark ") || s.startsWith(".dark.") || s.startsWith(".dark:")) {
		return `html.dark[data-palette="blue"]${s.slice(5)}`;
	}
	if (/(^|[\s>+~])\.dark\b/.test(s)) throw new Error(`Unexpected .dark position: ${s}`);
	return `html[data-palette="blue"] ${s}`;
}

/** The at-rule chain around a node, as written, so the copy keeps its media queries. */
function context(node) {
	const chain = [];
	for (let p = node.parent; p && p.type === "atrule"; p = p.parent)
		chain.unshift(`@${p.name} ${p.params}`);
	return chain;
}
const inKeyframes = (node) => context(node).some((c) => c.startsWith("@keyframes"));

function colourMap(css) {
	const map = new Map();
	postcss.parse(css).walkRules((rule) => {
		if (inKeyframes(rule)) return;
		for (const decl of rule.nodes.filter((n) => n.type === "decl" && isColour(n))) {
			for (const sel of rule.selectors)
				map.set(`${context(rule).join(" ")} | ${sel.trim()} | ${decl.prop}`, decl.value);
		}
	});
	return map;
}

const out = postcss.root();
const goldOnly = [];
for (const file of sheets) {
	const before = execFileSync("git", ["show", `${ref}:${file}`], { cwd: root, encoding: "utf8" });
	const current = readFileSync(path.join(root, file), "utf8");
	const parsed = postcss.parse(before);
	out.append(postcss.comment({ text: ` ${file} ` }));
	parsed.walkRules((rule) => {
		if (inKeyframes(rule)) return;
		// A background shorthand resets the clip, size and position, so they travel with it.
		const hasShorthand = rule.nodes.some(
			(n) => n.type === "decl" && n.prop === "background" && isColour(n),
		);
		const decls = rule.nodes.filter(
			(n) =>
				n.type === "decl" &&
				(isColour(n) || (hasShorthand && /^(-webkit-)?background-/.test(n.prop))),
		);
		if (!decls.length) return;
		const selectors = rule.selectors.map(raise).filter(Boolean);
		if (!selectors.length) return;
		let parent = out;
		for (let p = rule.parent, chain = []; ; p = p.parent) {
			if (!p || p.type !== "atrule") {
				for (const at of chain) {
					const copy = postcss.atRule({ name: at.name, params: at.params });
					parent.append(copy);
					parent = copy;
				}
				break;
			}
			chain.unshift(p);
		}
		parent.append(postcss.rule({ selectors, nodes: decls.map((d) => d.clone()) }));
	});
	const old = colourMap(before);
	for (const [key, value] of colourMap(current)) {
		if (!old.has(key) && !key.includes(":not(.dark)")) goldOnly.push(`${file} | ${key}: ${value}`);
	}
}

// What the copy cannot carry: the gold version's own additions, and the night clouds, whose file
// names stayed the same while their pixels turned gold.
const extra = `
/* Gold only: reset for blue. */
html.dark[data-palette="blue"] .v3-final-band {
	box-shadow: none;
}

/* Night clouds rendered before the gold change. */
html.dark[data-palette="blue"] .v3-clouds-layer {
	background-image: url("/images/landing/hero-clouds-night-blue.webp");
}
@media (max-width: 1100px) {
	html.dark[data-palette="blue"] .v3-clouds-layer {
		background-image: url("/images/landing/hero-clouds-compact-night-blue.webp");
	}
}
`;

const header = `/* The night-blue palette, generated by scripts/palette/blue.mjs from ${ref}. Do not edit by
   hand: change the generator instead. */\n`;
writeFileSync(path.join(root, output), header + out.toString() + "\n" + extra);
console.log(`wrote ${output}`);
if (goldOnly.length) console.log(`gold-only colour declarations:\n${goldOnly.join("\n")}`);
