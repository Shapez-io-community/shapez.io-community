import { globalConfig } from "../../core/config";
import { BaseItem } from "../base_item";
import { ColorObserverComponent } from "../components/color_observer";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { ColorItem, COLOR_ITEM_SINGLETONS } from "../items/color_item";
import { MapChunkView } from "../map_chunk_view";
import { HexToReadableRGB } from "../colors"

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
                return item
            }

            case "shape": {
                return null;
            }

            default:
                assertAlways(false, "Unknown item type: " + value.getItemType());
        }
    }

    DrawDisplayers(ctx, x, y, position, hex, a) {
        const color = HexToReadableRGB(hex);
        ctx.textAlign = "center";
        var text = "";

        if (hex == "aaaaaa") {
            text = "uncolored";
            this.drawStroked(ctx, text, x + position + 15, y + 20, 64);  
        } else {
            text = color.slice(4 * a + 1, 4 * a + 4);
            ctx.fillStyle = "#" + hex;    
            ctx.fillRect(x + position, y, 30, 30);
            this.drawStroked(ctx, text, x + position + 15, y + 20, 32);    
        }
    }

    drawStroked(ctx, text, x, y, width) {
        ctx.font = '15px Sans-serif';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.miterLimit=2
        ctx.strokeText(text, x, y, width);
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y, width);
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
                const network = pinsComp.slots[3].linkedNetwork;

                if (!network || !network.hasValue()) {
                    pinsComp.slots[0].value = null;
                    pinsComp.slots[1].value = null;
                    pinsComp.slots[2].value = null;
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
                    if (color == "aaaaaa") {
                        this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 32, color, 0);
                    } else if (color != undefined){
                        this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 1.5, color.slice(0,2) + "0000", 0);
                        this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 32, "00" + color.slice(2,4) + "00", 1);
                        this.DrawDisplayers(parameters.context, GeneralX, GeneralY, 62.5, "0000" + color.slice(4,6), 2);
                        pinsComp.slots[0].value = COLOR_ITEM_SINGLETONS[color.slice(0,2) + "0000"];
                        pinsComp.slots[1].value = COLOR_ITEM_SINGLETONS["00" + color.slice(2,4) + "00"];
                        pinsComp.slots[2].value = COLOR_ITEM_SINGLETONS["0000" + color.slice(4,6)];
                    }
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
                parameters.context.fillStyle = "#" + value.color;
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
