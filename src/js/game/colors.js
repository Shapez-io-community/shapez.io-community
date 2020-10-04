var colors = [];

for (var r = 0; r < 2; r++) {
    for (var g = 0; g < 2; g++) {
        for (var b = 0; b < 2; b++) {
            colors.push(fullColorHex(r * 100, g * 100, b * 100));
        }
    }   
}

//const enumColors = {};

//for(const c of colors) {
    //enumColors["#" + c] = c;
//}

//for(const c of ['red', 'blue', 'green', 'cyan', 'yellow', 'purple', 'white', 'uncolored']) {
//    enumColors[c] = c;
//}

//console.log(enumColors);

export const enumColors = {
    red: "red",
    green: "green",
    blue: "blue",

    yellow: "yellow",
    purple: "purple",
    cyan: "cyan",

    white: "white",
    uncolored: "uncolored",
};

/** @enum {string} */
export const enumColorToShortcode = {
    [enumColors.red]: "r",
    [enumColors.green]: "g",
    [enumColors.blue]: "b",

    [enumColors.yellow]: "y",
    [enumColors.purple]: "p",
    [enumColors.cyan]: "c",

    [enumColors.white]: "w",
    [enumColors.uncolored]: "u",
};

/** @enum {enumColors} */
export const enumShortcodeToColor = {};
for (const key in enumColorToShortcode) {
    enumShortcodeToColor[enumColorToShortcode[key]] = key;
}

/** @enum {string} */
export const enumColorsToHexCode = {
    [enumColors.red]: "#ff666a",
    [enumColors.green]: "#78ff66",
    [enumColors.blue]: "#66a7ff",

    // red + green
    [enumColors.yellow]: "#fcf52a",

    // red + blue
    [enumColors.purple]: "#dd66ff",

    // blue + green
    [enumColors.cyan]: "#00fcff",

    // blue + green + red
    [enumColors.white]: "#ffffff",

    // black + white
    [enumColors.uncolored]: "#aaaaaa",

    // white + white
    [enumColors.black]: "#000000",
};

const c = enumColors;
/** @enum {Object.<string, string>} */
export const enumColorMixingResults = {
    // 255, 0, 0
    [c.red]: {
        [c.green]: c.yellow,
        [c.blue]: c.purple,

        [c.yellow]: c.yellow,
        [c.purple]: c.purple,
        [c.cyan]: c.white,
    },

    // 0, 255, 0
    [c.green]: {
        [c.blue]: c.cyan,

        [c.yellow]: c.yellow,
        [c.purple]: c.white,
        [c.cyan]: c.cyan,
    },

    // 0, 255, 0
    [c.blue]: {
        [c.yellow]: c.white,
        [c.purple]: c.purple,
        [c.cyan]: c.cyan,
    },

    // 255, 255, 0
    [c.yellow]: {
        [c.purple]: c.white,
        [c.cyan]: c.white,
    },

    // 255, 0, 255
    [c.purple]: {
        [c.cyan]: c.white,
    },

    // 0, 255, 255
    [c.cyan]: {
    },

    //// SPECIAL COLORS

    // 255, 255, 255
    [c.white]: {
        //auto
    },

    // X, X, X
    [c.uncolored]: {
        // auto
    },
};

var HexToRGB = function(hex) {
    var aRgbHex = hex.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

function rgbToHex(rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
}

function fullColorHex(r,g,b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red+green+blue;
}

// Create same color lookups
for (const color in enumColors) {
    enumColorMixingResults[color][color] = color;    
    //enumColorMixingResults[color][undefined] = color; 
    enumColorMixingResults[color][c.white] = c.white;
    // Anything with uncolored is the same color
    enumColorMixingResults[color][c.uncolored] = color;
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
            enumColorMixingResults[colorB][colorA] = resultColor;
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