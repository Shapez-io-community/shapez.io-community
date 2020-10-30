import { ShapestItem, shape4svg, shape6svg } from "../items/shapest_item";

Object.assign(shape4svg, {
	"L": "M 0 0 L 0 0.650 C 0 1.300 0.650 1.300 0.585 0.585 C 1.300 0.650 1.300 0 0.650 0 Z",
	"T": "M 0 0 L 0 0.6 0.459 1.109 0.424 0.424 1.109 0.459 0.6 0 Z",
	"B": "M 0 0 L 1.2 0 L 1.171 0 A 0.012 0.012 0 0 1 1.18 0.02 L 0.02 1.18 A 0.012 0.012 0 0 1 0 1.171 Z",
	"P": "M 0 0 L 1.1 0 1.1 0.5 0.5 0.5 0.5 1.1 0 1.1 z",
	"Z": "M 0 0 L 0 0.55 C 0.33 0.55 0.33 1.1 0 1.1 C 0.55 1.1 0.7 0.7 0.389 0.389 C 0.623 0.155 1.011 0.544 0.778 0.778 C 1.167 0.389 0.99 0 0.55 0 Z",
	"U": "M 0 0 L 0.869 0 A 0.538 0.538 90 0 0 1.066 0.416 L 1.048 0.459 A 0.538 0.538 90 0 0 0.459 1.048 L 0.416 1.066 A 0.538 0.538 90 0 0 0 0.869 Z",
	"F": "M 0 0 v 0.5 a 0.5 0.5 0 0 0 0.5 0.5 h 0.5 v -0.5 a 0.5 0.5 0 0 0 -0.5 -0.5 z",
	"D": "M 0 0 l 0 0.5 0.5 0.5 0.5 0 0 -0.5 -0.5 -0.5 z",
	"M": "M 0 0 L 1 0 L 1 1 Z",
	// "H": "M 0 0 L 0 1.000 A 0.450 0.450 0 0 0 0.300 0.300 A 0.450 0.450 0 0 0 1.000 0 Z",
	"Y": "M 0.414 0 A 0.414 0.414 90 1 0 0.707 0.707 A 1 1 90 0 0 0.707 -0.707 A 0.414 0.414 90 0 1 0.414 0 Z M 0.414 0.331 A 0.083 0.083 90 1 1 0.413 0.331 Z",
	"O": "M 0 0 L 0 1 0.4142 1 1 0.4142 1 0 Z"
})

// registerCustomShape({
//     id: "sun",
//     code: "U",
//     ...customDefaults,
//     spawnColor: "yellow",
//     draw({ dims, innerDims, layer, quad, context, color, begin }) {
//         begin({ size: 1.3, path: true, zero: true });
//         const PI = Math.PI;
//         const PI3 = ((PI * 3) / 8) * 0.75;
//         const c = 1 / Math.cos(Math.PI / 8);
//         const b = c * Math.sin(Math.PI / 8);

//         context.moveTo(0, 0);
//         context.rotate(Math.PI / 2);
//         context.arc(c, 0, b, -PI, -PI + PI3);
//         context.rotate(-Math.PI / 4);
//         context.arc(c, 0, b, -PI - PI3, -PI + PI3);
//         context.rotate(-Math.PI / 4);
//         context.arc(c, 0, b, PI - PI3, PI);
//     },
// });
