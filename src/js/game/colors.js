var colors = [];

var HexToRGB = function(hex) {
    var aRgbHex = hex.match(/.{1,2}/g);
    var R = parseInt(aRgbHex[0], 16).toString();
    var G = parseInt(aRgbHex[1], 16).toString();
    var B = parseInt(aRgbHex[2], 16).toString();
    while (R.length < 3){R = "0" + R};
    while (G.length < 3){G = "0" + G};
    while (B.length < 3){B = "0" + B};
    return R + G + B;
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

export const HexToReadableRGB = function (hex) {
    const RGB = HexToRGB(hex);
    const R = RGB.slice(0,3);
    const G = RGB.slice(3,6);
    const B = RGB.slice(6,9);
    return "(" + R + "," + G + "," + B + ")"
}

export const mixColors = function(color1, color2) {
    if (color1 && color2) {
        if (color1.length == 6) {
            var c1 = color1 //color1.slice(1, 7);
        } else return color1;
        if (color2.length == 6) {
            var c2 = color2 // color2.slice(1, 7);
        } else return color2;
        var aRgbHex = c1.match(/.{1,2}/g);
        const r1 = parseInt(aRgbHex[0], 16);
        const g1 = parseInt(aRgbHex[1], 16);
        const b1 = parseInt(aRgbHex[2], 16);
        var aRgbHex = c2.match(/.{1,2}/g);
        const r2 = parseInt(aRgbHex[0], 16);
        const g2 = parseInt(aRgbHex[1], 16);
        const b2 = parseInt(aRgbHex[2], 16);
        let rR = r1 + r2;
        let gR = g1 + g2;
        let bR = b1 + b2;
        if (rR > 255) {rR = colorCount * colorMultiplier};
        if (gR > 255) {gR = colorCount * colorMultiplier};
        if (bR > 255) {bR = colorCount * colorMultiplier};
        return RandGandBToHex(rR, gR, bR);
    }
}

if (!colorCount) {
    var colorCount = 5;
}

const CountToMultiplier = {
    "2":"100",
    "5":"50",
    "10":"25",
    "50":"5",
    "255":"1",
}

var colorMultiplier = CountToMultiplier[colorCount];

var hexcode = colorToHex(colorMultiplier);

var red = hexcode + "0000"
var green = "00" + hexcode + "00";
var blue = "0000" + hexcode;
var black = "000000";

export var colorPalatte = [red, green, blue, black];

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

if (colorCount < 20) {
    colors.push("aaaaaa");
}

export const enumColors = {};


export const oldShortCodeToNewShortCode = {
    r: "(fa6464)",
    g: "(64fa64)",
    b: "(6496fa)",
    y: "(fafa32)",
    c: "(00fafa)",
    p: "(c864fa)",
    w: "(fafafa)",
    u: "(aaaaaa)"
}

for(const c of colors) {
    enumColors[c] = c;
}