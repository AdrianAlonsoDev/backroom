// Renders the hero's cumulus banks into public/images/landing/hero-clouds-*.webp.
//
//   pnpm render:sky
//
// Original volumetric renderer: cumulus built from smoothly united, stretched spheres, eroded by
// billow noise, lit with a short shadow march and a multiple-scattering approximation. The view is
// orthographic into a slab, so the layout below maps directly to the image. Output is transparent:
// the CSS sky shows through. Rendered at 2x and downsampled; a Mac GPU takes a few seconds, the
// software fallback a few minutes.

import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import sharp from "sharp";

const output = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../public/images/landing",
);

/** [x, base y (up from the bottom), width, height, depth, scale] per cumulus, in image pixels. */
const layouts = {
	// Desktop: towers rise beside the 1080px frame; its top edge sits 380px down (38%).
	wide: {
		W: 2400,
		H: 1000,
		glowPos: [1200, 620, 120],
		clouds: [
			[600, 470, 320, 205, 230],
			[400, 430, 400, 230, 270],
			[170, 450, 440, 300, 300],
			[1800, 475, 320, 205, 230],
			[2000, 440, 380, 230, 270],
			[2240, 455, 440, 290, 300],
		],
	},
	// Tablets and phones: small tops peek over the frame's edge, which sits 480px down (63%).
	compact: {
		W: 1800,
		H: 760,
		glowPos: [900, 280, 120],
		clouds: [
			[250, 185, 300, 200, 230],
			[490, 205, 250, 160, 260],
			[905, 170, 360, 100, 300, 0.8],
			[1320, 200, 250, 165, 260],
			[1560, 180, 300, 200, 230],
		],
	},
};

/** Day is a golden hour lit from the upper left and in front; night keeps only a faint warm backlight. */
const lights = {
	day: {
		light: [-0.72, 0.62, -0.32],
		sun: [3, 2.72, 2.2],
		ambTop: [0.8, 0.64, 0.46],
		ambBot: [0.44, 0.31, 0.2],
		glowAmt: 0.35,
		erode: 0.55,
		soft: 0.14,
		fog: [0.99, 0.9, 0.76],
		fogAmt: 0.45,
		exposure: 1.4,
		od: 0.24,
		ms: 0.3,
		steps: 140,
	},
	// Dark, near-neutral silhouettes with a thin warm rim, so the product's glow stays the brightest
	// light at night. The bodies stay almost grey: a stronger warm tint turns them brown.
	night: {
		light: [0.5, 0.6, 0.62],
		sun: [0.22, 0.17, 0.1],
		ambTop: [0.016, 0.015, 0.014],
		ambBot: [0.005, 0.0045, 0.004],
		glowAmt: 0.04,
		erode: 0.62,
		soft: 0.26,
		fog: [0.03, 0.025, 0.018],
		fogAmt: 0.32,
		exposure: 0.7,
		od: 0.32,
		ms: 0.16,
		steps: 160,
	},
};

const shared = {
	seed: 47,
	density: 1,
	freq: 0.016,
	depth: 420,
	sig: 0.11,
	octaves: 4,
	union: 0.14,
};

const scenes = {
	"hero-clouds-day": { ...shared, ...layouts.wide, ...lights.day, glowRad: 520 },
	"hero-clouds-night": { ...shared, ...layouts.wide, ...lights.night, glowRad: 430 },
	"hero-clouds-compact-day": { ...shared, ...layouts.compact, ...lights.day, glowRad: 420 },
	"hero-clouds-compact-night": { ...shared, ...layouts.compact, ...lights.night, glowRad: 360 },
};

const fragment = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uSS; uniform float uSeed;
uniform vec4 uS[192]; uniform float uB[192]; uniform int uN; uniform float uUnion;
uniform vec3 uLight; uniform vec3 uSun; uniform vec3 uAmbTop; uniform vec3 uAmbBot;
uniform vec3 uGlowPos; uniform float uGlowAmt; uniform float uGlowRad;
uniform float uDensity; uniform float uErode; uniform float uFreq; uniform float uDepth; uniform float uSoft;
uniform float uOct; uniform float uOd; uniform float uSig; uniform float uMs; uniform float uSteps;
uniform vec3 uFog; uniform float uFogAmt; uniform float uExposure;
out vec4 o;

float h13(vec3 p) { p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float n3(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float billow(vec3 p) {
  float a = .5, s = 0., w = 0.;
  for (int i = 0; i < 5; i++) { if (float(i) >= uOct) break; s += a * (1. - abs(n3(p) * 2. - 1.)); w += a; p = p * 2.07 + vec3(13.1, 7.7, 3.3); a *= .52; }
  return s / w;
}
float fbm(vec3 p) { float a = .5, s = 0.; for (int i = 0; i < 3; i++) { s += a * n3(p); p = p * 2.01 + vec3(5.2, 1.3, 7.9); a *= .5; } return s / .875; }
float smax(float a, float b, float k) { float h = clamp(.5 + .5 * (a - b) / k, 0., 1.); return mix(b, a, h) + k * h * (1. - h); }

// Smooth union of stretched spheres; the floor is the contribution-weighted base of the cloud.
float shape(vec3 p, out float base) {
  float d = -2., wsum = 0., bsum = 0.;
  for (int i = 0; i < 192; i++) {
    if (i >= uN) break;
    vec4 s = uS[i]; float k = 1. - length((p - s.xyz) / vec3(1.22, 1., 1.12)) / s.w;
    d = smax(d, k, uUnion); float w = exp(clamp(k, -1., 1.) * 9.); wsum += w; bsum += w * uB[i];
  }
  base = bsum / max(wsum, 1e-5);
  return d;
}
float density(vec3 p, out float hgt) {
  float base; float s = shape(p, base); hgt = 0.;
  if (s < -.3) return 0.;
  vec3 q = p * uFreq + vec3(uSeed * 17., uSeed * 7., uSeed * 3.);
  vec3 warp = vec3(fbm(q * .45), fbm(q * .45 + 3.1), fbm(q * .45 + 7.3)) - .5;
  float d = s - (1. - billow(q + warp * 1.3)) * uErode * (1.15 - clamp(s, 0., 1.) * .8);
  float floorF = smoothstep(base - 8., base + 46., p.y);
  d = d * floorF - (1. - floorF) * .2;
  hgt = clamp((p.y - base) / 320., 0., 1.);
  return clamp(smoothstep(0., uSoft, d) * uDensity, 0., 1.);
}
// Shadows follow the broad volume only, so they never streak along fine detail.
float densityLow(vec3 p) {
  float base; float s = shape(p, base);
  if (s < -.3) return 0.;
  vec3 q = p * uFreq * .5 + vec3(uSeed * 17., uSeed * 7., uSeed * 3.);
  float d = s - (1. - (n3(q) * .6 + n3(q * 2.03 + 4.1) * .4)) * uErode * .55;
  d *= smoothstep(base - 8., base + 46., p.y);
  return clamp(smoothstep(0., .3, d) * uDensity, 0., 1.);
}
float lightMarch(vec3 p, float j) {
  float acc = 0.;
  for (int i = 0; i < 10; i++) { float w = 22. * (1. + float(i) * .22); acc += densityLow(p + uLight * (float(i) + j) * w) * w; }
  return acc;
}
float HG(float c, float g) { float g2 = g * g; return (1. - g2) / pow(1. + g2 - 2. * g * c, 1.5); }
vec3 glowColor(float x) {
  float t = x / uRes.x; vec3 a = vec3(1., .62, .12), c = vec3(1., .46, .2), b = vec3(1., .8, .45);
  return t < .5 ? mix(a, c, smoothstep(.3, .5, t)) : mix(c, b, smoothstep(.5, .7, t));
}
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }

void main() {
  vec2 fc = gl_FragCoord.xy / uSS;
  float T = 1.; vec3 C = vec3(0.);
  float st = uDepth / uSteps, jit = h13(vec3(fc, uSeed)) * st, cosT = uLight.z;
  for (float i = 0.; i < 240.; i++) {
    if (i >= uSteps) break;
    vec3 p = vec3(fc, jit + i * st);
    float hgt; float dens = density(p, hgt);
    if (dens <= .003) continue;
    float sig = dens * uSig, od = lightMarch(p, h13(p * 1.37 + uSeed)) * uOd;
    vec3 direct = vec3(0.); float a = 1., b = 1., c = 1.;
    for (int k = 0; k < 3; k++) { direct += a * exp(-od * b) * mix(HG(cosT, .55 * c), HG(cosT, -.3 * c), .55); a *= uMs; b *= .35; c *= .5; }
    vec3 col = uSun * direct * mix(.65, 1., 1. - exp(-sig * st * 3.)) + mix(uAmbBot, uAmbTop, smoothstep(0., 1., hgt * 1.15));
    vec3 g = p - uGlowPos; g.y *= 1.5; float gd = length(g) / uGlowRad;
    col += glowColor(p.x) * uGlowAmt / (1. + gd * gd * 2.5);
    col = mix(col, uFog, clamp(pow(p.z / uDepth, 1.5) * uFogAmt, 0., 1.));
    float al = 1. - exp(-sig * st);
    C += T * al * col; T *= 1. - al;
    if (T < .005) break;
  }
  float A = 1. - T;
  vec3 s = pow(aces((A > 1e-4 ? C / A : vec3(0.)) * uExposure), vec3(1. / 2.2));
  A = smoothstep(0., 1., A);
  o = vec4(s * A, A);
}`;

/** Runs in the page: builds the spheres from the layout and returns the render as a PNG data URL. */
function render({ scene, fragment, ss }) {
	let t = scene.seed >>> 0;
	const random = () => {
		t += 0x6d2b79f5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
	const spheres = [];
	for (const [cx, base, w, h, z, scale = 1] of scene.clouds) {
		const n1 = 4 + Math.floor(random() * 3);
		const r1 = w / (n1 * 1.05);
		for (let i = 0; i < n1; i++) {
			const at = n1 === 1 ? 0.5 : i / (n1 - 1);
			const x = cx - w / 2 + r1 * 0.5 + (w - r1) * at;
			const edge = 1 - Math.abs(at - 0.5) * 1.1;
			spheres.push([
				x + (random() - 0.5) * r1 * 0.35,
				base + r1 * (0.5 + random() * 0.15),
				z + (random() - 0.5) * r1 * 0.9,
				r1 * (0.7 + random() * 0.25 + edge * 0.2) * scale,
				base,
			]);
		}
		const n2 = 3 + Math.floor(random() * 3);
		const r2 = r1 * (0.85 + random() * 0.2);
		for (let i = 0; i < n2; i++) {
			spheres.push([
				cx + (random() - 0.5) * w * 0.6,
				base + h * (0.4 + random() * 0.14),
				z + (random() - 0.5) * r2 * 0.7,
				r2 * (0.72 + random() * 0.3) * scale,
				base,
			]);
		}
		const n3 = 2 + Math.floor(random() * 2);
		const r3 = r2 * (0.7 + random() * 0.15);
		for (let i = 0; i < n3; i++) {
			spheres.push([
				cx + (random() - 0.5) * w * 0.3,
				base + h * (0.62 + random() * 0.12),
				z + (random() - 0.5) * r3 * 0.5,
				r3 * (0.85 + random() * 0.25) * scale,
				base,
			]);
		}
		const r4 = r3 * (0.72 + random() * 0.12);
		spheres.push([
			cx + (random() - 0.5) * w * 0.14,
			base + h * (0.8 + random() * 0.08),
			z,
			r4 * scale,
			base,
		]);
	}
	const canvas = document.createElement("canvas");
	canvas.width = scene.W * ss;
	canvas.height = scene.H * ss;
	const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, preserveDrawingBuffer: true });
	const compile = (type, source) => {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			throw new Error(gl.getShaderInfoLog(shader));
		return shader;
	};
	const program = gl.createProgram();
	gl.attachShader(
		program,
		compile(
			gl.VERTEX_SHADER,
			"#version 300 es\nlayout(location = 0) in vec2 p;\nvoid main() { gl_Position = vec4(p, 0., 1.); }",
		),
	);
	gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
	gl.linkProgram(program);
	gl.useProgram(program);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
	const u = (name) => gl.getUniformLocation(program, name);
	const pad = (values, size) =>
		new Float32Array([...values, ...new Array(size - values.length).fill(0)]);
	const light = Math.hypot(...scene.light);
	gl.uniform2f(u("uRes"), scene.W, scene.H);
	gl.uniform1f(u("uSS"), ss);
	gl.uniform1f(u("uSeed"), scene.seed % 97);
	gl.uniform4fv(
		u("uS"),
		pad(
			spheres.flatMap((s) => s.slice(0, 4)),
			192 * 4,
		),
	);
	gl.uniform1fv(
		u("uB"),
		pad(
			spheres.map((s) => s[4]),
			192,
		),
	);
	gl.uniform1i(u("uN"), spheres.length);
	gl.uniform3f(u("uLight"), ...scene.light.map((v) => v / light));
	for (const [name, key] of [
		["uSun", "sun"],
		["uAmbTop", "ambTop"],
		["uAmbBot", "ambBot"],
		["uGlowPos", "glowPos"],
		["uFog", "fog"],
	]) {
		gl.uniform3fv(u(name), scene[key]);
	}
	for (const [name, key] of [
		["uUnion", "union"],
		["uGlowAmt", "glowAmt"],
		["uGlowRad", "glowRad"],
		["uDensity", "density"],
		["uErode", "erode"],
		["uFreq", "freq"],
		["uDepth", "depth"],
		["uSoft", "soft"],
		["uOct", "octaves"],
		["uOd", "od"],
		["uSig", "sig"],
		["uMs", "ms"],
		["uSteps", "steps"],
		["uFogAmt", "fogAmt"],
		["uExposure", "exposure"],
	]) {
		gl.uniform1f(u(name), scene[key]);
	}
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	gl.finish();
	return canvas.toDataURL("image/png");
}

const browser = await chromium.launch({ args: ["--use-angle=metal", "--enable-gpu"] });
const page = await browser.newPage();
for (const [name, scene] of Object.entries(scenes)) {
	const png = await page.evaluate(render, { scene, fragment, ss: 2 });
	const file = path.join(output, `${name}.webp`);
	const info = await sharp(Buffer.from(png.split(",")[1], "base64"))
		.resize(scene.W, scene.H, { kernel: "lanczos3" })
		.webp({ quality: 82, alphaQuality: 90, effort: 6, smartSubsample: true })
		.toFile(file);
	console.log(`${name}.webp`, `${Math.round(info.size / 1024)} KB`);
}
await browser.close();
