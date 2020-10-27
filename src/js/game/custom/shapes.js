import { ShapestItem, shape4svg, shape6svg } from "../items/shapest_item";

Object.assign(shape4svg, {
	"L": "M 0 0 L 0 0.650 C 0 1.300 0.650 1.300 0.585 0.585 C 1.300 0.650 1.300 0 0.650 0 Z",
	"T": "M 0 0 L 0 0.6 0.459 1.109 0.424 0.424 1.109 0.459 0.6 0 Z",
	"B": "M 0 0 L 0.3 0.7 L 0.5 0.5 Z",
	"P": "M 0 0 L 1.1 0 1.1 0.5 0.5 0.5 0.5 1.1 0 1.1 z",
	"Z": "M 0 0 L 0.3 0.7 L 0.5 0.5 Z",
	"U": "M 0 0 L 0.3 0.7 L 0.5 0.5 Z",
	"F": "M 0 0 v 0.5 a 0.5 0.5 0 0 0 0.5 0.5 h 0.5 v -0.5 a 0.5 0.5 0 0 0 -0.5 -0.5 z",
	"D": "M 0 0 l 0 0.5 0.5 0.5 0.5 0 0 -0.5 -0.5 -0.5 z",
	"M": "M 0 0 L 0 1 1 1 Z",
	// "H": "M 0 0 L 0 1.000 A 0.450 0.450 0 0 0 0.300 0.300 A 0.450 0.450 0 0 0 1.000 0 Z",
	"Y": "M 0 0.414 A 0.414 0.414 0 1 1 0.707 0.707 A 1.000 1.000 0 0 1 -0.707 0.707 A 0.414 0.414 0 0 0 0 0.414 Z M 0.331 0.414 A 0.083 0.083 0 1 0 0.331 0.414 Z",
	"O": "M 0 0 L 0 1 0.4142 1 1 0.4142 1 0 Z"
})

// registerCustomShape({
//     id: "rhombus",
//     code: "B",
//     ...customDefaults,
//     draw({ dims, innerDims, layer, quad, context, color, begin }) {
//         begin({ size: 1.2, path: true, zero: true });
//         const rad = 0.001;
//         // with rounded borders
//         context.arcTo(0, 1, 1, 0, rad);
//         context.arcTo(1, 0, 0, 0, rad);
//     },
// });


// registerCustomShape({
//     id: "saw",
//     code: "Z",
//     ...customDefaults,
//     draw({ dims, innerDims, layer, quad, context, color, begin }) {
//         begin({ size: 1.1, path: true, zero: true });
//         const inner = 0.5;
//         context.lineTo(inner, 0);
//         context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
//         context.bezierCurveTo(
//             1,
//             inner,
//             inner * Math.SQRT2 * 0.9,
//             inner * Math.SQRT2 * 0.9,
//             inner * Math.SQRT1_2,
//             inner * Math.SQRT1_2
//         );
//         context.rotate(Math.PI / 4);
//         context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
//         context.bezierCurveTo(
//             1,
//             inner,
//             inner * Math.SQRT2 * 0.9,
//             inner * Math.SQRT2 * 0.9,
//             inner * Math.SQRT1_2,
//             inner * Math.SQRT1_2
//         );
//     },
//     tier: 3,
// });

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
