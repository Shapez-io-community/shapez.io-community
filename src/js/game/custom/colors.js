import {
    enumColors, enumColorToShortcode, enumShortcodeToColor,
    enumColorsToHexCode, enumColorMixingResults,
} from "../colors";
import { Loader } from "../../core/loader";
import { THEME } from "../theme";

export function initializeCustomColors() {

    const colorWheel = {
        red: 0,
        orange: 30,
        yellow: 60,
        lime: 90,
        green: 120,
        spring: 150,
        cyan: 180,
        azure: 210,
        blue: 240,
        violet: 270,
        purple: 300,
        zrose: 330,
    }
    // for (let k in enumColors) delete enumColors[k];

    for (let k in colorWheel) {
        enumColors[k] = k;
        enumColorToShortcode[k] = k[0];
        enumShortcodeToColor[k[0]] = k;
        enumColorMixingResults[k] = {};
        if (colorWheel[k] % 30) continue;
        enumColorsToHexCode[k] = `hsl(${colorWheel[k]}, 100%, 70%)`;
    }

    enumColors.white = "white";
    enumColors.uncolored = "uncolored";

    enumColorsToHexCode.white = "hsl(0, 0%, 100%)";
    enumColorsToHexCode.uncolored = "hsl(0, 0%, 67%)";

    // mixing:

    let mix = enumColorMixingResults

    for (let k in colorWheel) {
        for (let l in colorWheel) {
            let khue = colorWheel[k];
            let lhue = colorWheel[l];
            let delta = Math.abs(khue - lhue);
            if (Math.abs(delta - 180) <= 30) {
                enumColorMixingResults[k][l] = "white";
            } else if (delta < 180) {
                let target = (khue + lhue) / 2;
                let pair = Object.entries(colorWheel).find(([k, v]) => v == target || v == target - 15);
                let color = pair[0];
                enumColorMixingResults[k][l] = color;
            } else {
                let target = ((khue + lhue + 360) / 2) % 360;
                let pair = Object.entries(colorWheel).find(([k, v]) => v == target || v == target - 15);
                let color = pair[0];
                enumColorMixingResults[k][l] = color;
            }
        }

        enumColorMixingResults.white[k] = "white";
        enumColorMixingResults[k].white = "white";
        enumColorMixingResults.uncolored[k] = k;
        enumColorMixingResults[k].uncolored = k;
    }

    // drawing:

    for (let k in colorWheel) {
        if (colorWheel[k] % 30) continue;
        let callback = ({ canvas, context, canvas2, context2, w, h, smooth, mipmap, resolution }) => {
            let dpi = 1;
            context.translate((w * dpi) / 2, (h * dpi) / 2);
            context.scale((dpi * w) / 12, (dpi * h) / 12);

            function beginCircle(x, y, r) {
                context.beginPath();
                if (r < 0.05) {
                    context.rect(x, y, 1, 1);
                    return;
                }
                context.arc(x, y, r, 0, 2.0 * Math.PI);
            }

            context.fillStyle = enumColorsToHexCode[k];
            context.strokeStyle = THEME.items.outline;
            context.lineWidth = 2 * THEME.items.outlineWidth;
            beginCircle(2, -1, 3);
            context.stroke();
            context.fill();
            beginCircle(-2, -1, 3);
            context.stroke();
            context.fill();
            beginCircle(0, 2, 3);
            context.closePath();
            context.stroke();
            context.fill();
        };
        let url = `sprites/colors/${k}.png`;
        Loader.drawSprite(url, callback, { w: 128, h: 128, smooth: false, mipmap: false }, url);
    }

}