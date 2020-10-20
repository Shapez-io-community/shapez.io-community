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

var HexToReadableRGB = function (hex) {
    var RGB = HexToRGB(hex.slice(1));
    var R = RGB.slice(0,3);
    var G = RGB.slice(3,6);
    var B = RGB.slice(6,9);
    return "(" + R + "," + G + "," + B + ")"
}

var mixColors = function(color1, color2) {
    if (color1.length == 6) {
        var c1 = color1 //color1.slice(1, 7);
    } else return color1;
    if (color2.length == 6) {
        var c2 = color2 // color2.slice(1, 7);
    } else return color2;
    var aRgbHex = c1.match(/.{1,2}/g);
    var r1 = parseInt(aRgbHex[0], 16);
    var g1 = parseInt(aRgbHex[1], 16);
    var b1 = parseInt(aRgbHex[2], 16);
    var aRgbHex = c2.match(/.{1,2}/g);
    var r2 = parseInt(aRgbHex[0], 16);
    var g2 = parseInt(aRgbHex[1], 16);
    var b2 = parseInt(aRgbHex[2], 16);
    var rR = r1 + r2;
    var gR = g1 + g2;
    var bR = b1 + b2;
    if (rR > 255) {rR = colorCount * colorMultiplier};
    if (gR > 255) {gR = colorCount * colorMultiplier};
    if (bR > 255) {bR = colorCount * colorMultiplier};
    return RandGandBToHex(rR, gR, bR);
}

if (!colorCount) {
    var colorCount = 5;
}

export var updateColorCount = function(number) {
    colorCount = number;
}

const CountToMultiplier = {
    "2":"100",
    "5":"50",
    "10":"25",
    "50":"5"
}

var colorMultiplier = CountToMultiplier[colorCount];

var hexcode = colorToHex(colorMultiplier);

var red = hexcode + "0000"
var green = "00" + hexcode + "00";
var blue = "0000" + hexcode;

export var colorPalatte = [red, green, blue];

for (var R = 0; R < colorCount + 1; R++) {
    for (var G = 0; G < colorCount + 1; G++) {
        for (var B = 0; B < colorCount + 1; B++) {
            var color = RandGandBToHex(R * colorMultiplier,
                                       G * colorMultiplier,
                                       B * colorMultiplier);
            colors.push(color);
        }
    }   
}

export const enumColors = {};
export const enumColorToShortcode = {};
export const enumShortcodeToColor = {};
export const enumColorsToHexCode = {}
export const enumColorMixingResults = {};
export const HexCodeToRGBCode = {};
export const enumColorsToR_G_B = {};

for(const c of colors) {
    enumColors[c] = c;
}

/** @enum {string} */
for(const c of colors) {
    enumColorToShortcode[c] = c;
}

/** @enum {string} */
for(const c of colors) {
    enumColorsToHexCode[c] = ("#" + c);
}

/** @enum {enumColors} */
for (const key in enumColorToShortcode) {
    enumShortcodeToColor[enumColorToShortcode[key]] = key;
}

for (const c of colors) {
    HexCodeToRGBCode[c] = HexToReadableRGB(enumColorsToHexCode[c]);
}

for (const c1 in enumColors) {
    const result = {};
    for (const c2 in enumColors) {
        if (c1 == "969696") {
            result[c2] = c2;
        } else if (c2 == "969696") {
            result[c2] = c1;
        } else {
            var r_color = mixColors(c1, c2);
            result[c2] = r_color;
        }
    }
    enumColorMixingResults[c1] = result;
}

// Create reverse lookup and check color mixing lookups
for (const colorA in enumColorMixingResults) {
    for (const colorB in enumColorMixingResults[colorA]) {
        const resultColor = enumColorMixingResults[colorA][colorB];
        if (!enumColorMixingResults[colorB]) {
            enumColorMixingResults[colorB] = {
                [colorA]: resultColor,
            };
        } else {
            const existingResult = enumColorMixingResults[colorB][colorA];
            if (existingResult && existingResult !== resultColor) {
                assertAlways(
                    false,
                    "invalid color mixing configuration, " +
                        colorA +
                        " + " +
                        colorB +
                        " is " +
                        resultColor +
                        " but " +
                        colorB +
                        " + " +
                        colorA +
                        " is " +
                        existingResult
                );
            }
        }
    }
}

for (const colorA in enumColorMixingResults) {
    for (const colorB in enumColorMixingResults) {
        if (!enumColorMixingResults[colorA][colorB]) {
            assertAlways(false, "Color mixing of", colorA, "with", colorB, "is not defined");
        }
    }
}