import { globalConfig } from "../../core/config";
import { Loader } from "../../core/loader";
import { BaseItem } from "../base_item";
import { enumColors, enumColorsToHexCode} from "../colors";
import { ColorObserverComponent } from "../components/color_observer";
import { MetaColorObserverBuilding } from "../buildings/color_observer";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { isTrueItem } from "../items/boolean_item";
import { ColorItem, COLOR_ITEM_SINGLETONS } from "../items/color_item";
import { MapChunkView } from "../map_chunk_view";
import { MetaAnalyzerBuilding } from "../buildings/analyzer";
import { THEME } from "../theme";
import { Rectangle } from "../../core/rectangle";
import { HexCodeToRGBCode } from "../colors"

export class ColorObserverSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [ColorObserverComponent]);

        /** @type {Object<string, import("../../core/draw_utils").AtlasSprite>} */
    }

    /**
     * Returns the color / value a display should show
     * @param {BaseItem} value
     * @returns {BaseItem}
     */
    getDisplayItem(value) {
        let V = value;
        if (!value) {
            return null;
        }

        switch (value.getItemType()) {
            case "boolean": {
                return null
            }

            case "color": {
                const item = /**@type {ColorItem} */ (value);
                return item.color === enumColors[969696] ? null : item;
            }

            case "shape": {
                return null;
            }

            default:
                assertAlways(false, "Unknown item type: " + value.getItemType());
        }
    }

    IsItDarkOrNot(hex) {
        var c = hex.substring(1);    // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue

        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

        if (luma < 40) {
            return true;
        }
    }

    DrawDisplayers(ctx, x, y, position, hex, a) {
        const color = HexCodeToRGBCode[hex];
        const text = color.slice(4 * a + 1, 4 * a + 4);
        ctx.fillStyle = enumColorsToHexCode[hex];
        ctx.fillRect(x + position, y, 30, 30);
        ctx.textAlign = "center";
        this.drawStroked(ctx, text, x + position + 15, y + 20);
    }

    drawStroked(ctx, text, x, y) {
        ctx.font = '15px Sans-serif';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.miterLimit=2
        ctx.strokeText(text, x, y, 32);
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y, 32);
    }

    /**
     * Draws a given chunk
     * @param {import("../../core/draw_utils").DrawParameters} parameters
     * @param {MapChunkView} chunk
     */
    drawChunk(parameters, chunk) {
        const contents = chunk.containedEntitiesByLayer.regular;
        for (let i = 0; i < contents.length; ++i) {
            const entity = contents[i];
            if (entity && entity.components.ColorObserver) {
                const pinsComp = entity.components.WiredPins;
                const network = pinsComp.slots[0].linkedNetwork;

                if (!network || !network.hasValue()) {
                    continue;
                }

                const value = this.getDisplayItem(network.currentValue);

                if (!value) {
                    continue;
                }

                const origin = entity.components.StaticMapEntity.origin;
                if (value.getItemType() === "color") {
                    const color = value.getAsCopyableKey();
                    const GeneralX = (origin.x + 0.5) * globalConfig.tileSize - 15;
                    const GeneralY = (origin.y + 0.5) * globalConfig.tileSize - 15;
                    this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 1.5, color.slice(0,2) + "0000", 0);
                    this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 32, "00" + color.slice(2,4) + "00", 1);
                    this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 62.5, "0000" + color.slice(4,6), 2);
                }
            }
        }
    }
    /**
     * Draws overlay of a given chunk
     * @param {import("../../core/draw_utils").DrawParameters} parameters
     * @param {MapChunkView} chunk
     */
    drawChunkOverlay(parameters, chunk) {
        const contents = chunk.containedEntitiesByLayer.regular;
        for (let i = 0; i < contents.length; ++i) {
            const entity = contents[i];
            if (!entity || !entity.components.ColorObserver) {
                continue;
            }

            const pinsComp = entity.components.WiredPins;
            const network = pinsComp.slots[0].linkedNetwork;

            if (!network || !network.hasValue()) {
                continue;
            }

            const value = this.getDisplayItem(network.currentValue);

            if (!value) {
                continue;
            }

            const origin = entity.components.StaticMapEntity.origin;
            if (value instanceof ColorItem) {
                parameters.context.fillStyle = enumColorsToHexCode[value.color];
                parameters.context.fillRect(
                    origin.x * globalConfig.tileSize,
                    origin.y * globalConfig.tileSize,
                    globalConfig.tileSize,
                    globalConfig.tileSize
                );
            }
        }
    }
}
