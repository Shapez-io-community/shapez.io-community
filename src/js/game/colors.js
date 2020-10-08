import { addSyntheticLeadingComment } from "typescript";

var colors = [];

var HexToRGB = function(hex) {
    var aRgbHex = hex.match(/.{1,2}/g);
    var r = parseInt(aRgbHex[0], 16);
    var g = parseInt(aRgbHex[1], 16);
    var b = parseInt(aRgbHex[2], 16);
    var R = r.toString();
    var G = g.toString();
    var B = b.toString();
    while (R.length < 3){R = "0" + R};
    while (G.length < 3){G = "0" + G};
    while (B.length < 3){B = "0" + B};
    return R + G + B;
}

var rgbToHex = function(rgb) {
    var r = colorToHex(rgb.slice(0, 3));
    var g = colorToHex(rgb.slice(3, 6));
    var b = colorToHex(rgb.slice(6, 9));
    return r+g+b;
}

var RandGandBToHex = function(R, G, B) {
    var r = colorToHex(R);
    var g = colorToHex(G);
    var b = colorToHex(B);
    return r+g+b;
}

var colorToHex = function (color) { 
    var hex = Number(color).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

var mixColors = function(color1, color2) {
    var R1 = color1.slice(1, 4);
    var G1 = color1.slice(4, 7);
    var B1 = color1.slice(7, 10);
    var c2 = color2.slice(1, 10);
}

for (var R = 0; R < 2; R++) {
    for (var G = 0; G < 2; G++) {
        for (var B = 0; B < 2; B++) {
            var color = RandGandBToHex(R * 100, G * 100, B * 100);
            colors.push(color);
        }
    }   
}

export const enumColors = {};
export const enumColorToShortcode = {};
export const enumShortcodeToColor = {};
export const enumColorsToHexCode = {}
export const enumColorMixingResults = {};


for(const c of colors) {
    enumColors["#" + c] = c;
}

/** @enum {string} */
for(const c of colors) {
    enumColorToShortcode[c] = HexToRGB(c);
}

/** @enum {string} */
for(const c of colors) {
    enumColorsToHexCode[c] = ("#" + c);
}

/** @enum {enumColors} */
for (const key in enumColorToShortcode) {
    enumShortcodeToColor[enumColorToShortcode[key]] = key;
}

for (const c1 in enumColors) {
    for (const c2 in enumColors) {
        var resultColor = mixColors(c1, c2);
        results[c2] = c3;
        enumColorMixingResults[c1] = results;
    }
}

//for (const color in enumColors) {
//    if (color != "white") {
//        enumColorMixingResults[color][color] = color;
//        enumColorMixingResults[color][c.white] = c.white;
//        enumColorMixingResults[color][c.black] = c.black;
//    }  
//    // Anything with uncolored is the same color
//    enumColorMixingResults[color][c.uncolored] = color;
//}

// Create reverse lookup and check color mixing lookups
//for (const colorA in enumColorMixingResults) {
//    for (const colorB in enumColorMixingResults[colorA]) {
//        const resultColor = enumColorMixingResults[colorA][colorB];
//        if (!enumColorMixingResults[colorB]) {
//            enumColorMixingResults[colorB] = {
//                [colorA]: resultColor,
//            };
//        } else {
//            const existingResult = enumColorMixingResults[colorB][colorA];
//            if (existingResult && existingResult !== resultColor) {
//                assertAlways(
//                    false,
//                    "invalid color mixing configuration, " +
//                        colorA +
//                        " + " +
//                        colorB +
//                        " is " +
//                        resultColor +
//                        " but " +
//                        colorB +
//                        " + " +
//                        colorA +
//                        " is " +
//                        existingResult
//                );
//            }
//            enumColorMixingResults[colorB][colorA] = resultColor;
//        }
//    }
//}

for (const colorA in enumColors) {
    for (const colorB in enumColors) {
        if (!enumColorMixingResults[colorA][colorB]) {
            enumColorMixingResults[colorA][colorB] = mixColors(colorA, colorB);
        }
    }
}

for (const colorA in enumColorMixingResults) {
    for (const colorB in enumColorMixingResults) {
        if (!enumColorMixingResults[colorA][colorB]) {
            enumColorMixingResults[colorA][colorB] = mixColors(colorA, colorB);
        }
    }
}