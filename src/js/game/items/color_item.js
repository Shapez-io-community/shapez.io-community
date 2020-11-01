import { globalConfig } from "../../core/config";
import { DrawParameters } from "../../core/draw_parameters";
import { Loader } from "../../core/loader";
import { types } from "../../savegame/serialization";
import { BaseItem } from "../base_item";
import { enumColors, enumColorToShortcode, enumShortcodeToColor } from "../colors";
import { THEME } from "../theme";
import { initializeCustomColors } from "../custom/colors";

export class ColorItem extends BaseItem {
    static getId() {
        return "color";
    }

    static getSchema() {
        return types.enum(enumColors);
    }

    serialize() {
        return this.color;
    }

    deserialize(data) {
        this.color = data;
    }

    /** @returns {"color"} **/
    getItemType() {
        return "color";
    }

    getHash() {
        return enumColorToShortcode[this.color];
    }

    /**
     * @returns {string}
     */
    getAsCopyableKey() {
        return this.color;
    }

    /**
     * @param {BaseItem} other
     */
    equalsImpl(other) {
        return this.color === /** @type {ColorItem} */ (other).color;
    }

    /**
     * @param {enumColors} color
     */
    constructor(color) {
        super();
        this.color = color;
    }

    getBackgroundColorAsResource() {
        return THEME.map.resources[this.color];
    }

    /**
     * Draws the item to a canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} size
     */
    drawFullSizeOnCanvas(context, size) {
        if (!this.cachedSprite) {
            this.cachedSprite = Loader.getSprite("sprites/colors/" + this.color + ".png");
        }
        this.cachedSprite.drawCentered(context, size / 2, size / 2, size);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} diameter
     * @param {DrawParameters} parameters
     */
    drawItemCenteredClipped(x, y, parameters, diameter = globalConfig.defaultItemDiameter) {
        const realDiameter = diameter * 0.6;
        if (!this.cachedSprite) {
            this.cachedSprite = Loader.getSprite("sprites/colors/" + this.color + ".png");
        }
        this.cachedSprite.drawCachedCentered(parameters, x, y, realDiameter);
    }

    static initializeCustomColors(enable) {
        if (enable) {
            initializeCustomColors();
            for (const color in COLOR_ITEM_SINGLETONS) {
                delete COLOR_ITEM_SINGLETONS[color];
            }
            for (const color in enumColors) {
                delete COLOR_ITEM_SINGLETONS[color];
                COLOR_ITEM_SINGLETONS[color] = new ColorItem(color);
            }
        } else {
            // alert("disabling color wheel is not supported, reload page to apply");
        }
    }

    static virt_rotate(hash, dir) {
        if (recipeCache[hash + dir]) {
            return recipeCache[hash + dir];
        }
        let colorWheel = "roylgscabvpz";
        if (!COLOR_ITEM_SINGLETONS.orange) {
            colorWheel = "rygcbp";
        }

        let index = colorWheel.indexOf(hash);
        if (index == -1) {
            return recipeCache[hash + dir] = COLOR_ITEM_SINGLETONS[enumShortcodeToColor[hash]];
        }

        if (dir == 1 || dir == -1) {
            index += dir;
        } else {
            index += colorWheel.length / 2;
        }
        let color = colorWheel[(index + colorWheel.length) % colorWheel.length];

        return recipeCache[hash + dir] = COLOR_ITEM_SINGLETONS[enumShortcodeToColor[color]];
    }
}

/**
 * Singleton instances
 * @type {Object<enumColors, ColorItem>}
 */
export const COLOR_ITEM_SINGLETONS = {};

for (const color in enumColors) {
    COLOR_ITEM_SINGLETONS[color] = new ColorItem(color);
}

const recipeCache = {};