import { globalConfig } from "../../core/config";
import { BaseItem } from "../base_item";
import { enumColors} from "../colors";
import { DisplayComponent } from "../components/display";
import { Dimension } from "../buildings/display";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { isTrueItem } from "../items/boolean_item";
import { ColorItem, COLOR_ITEM_SINGLETONS } from "../items/color_item";
import { MapChunkView } from "../map_chunk_view";

export class DisplaySystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [DisplayComponent]);

        /** @type {Object<string, import("../../core/draw_utils").AtlasSprite>} */
        this.displaySprites = {};

        for (const colorId in enumColors) {
            if (colorId === enumColors["aaaaaa"]) {
                continue;
            }
            this.displaySprites[colorId] = null //Loader.getSprite("sprites/wires/display/" + colorId + ".png");
        }
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
                return isTrueItem(value) ? COLOR_ITEM_SINGLETONS[enumColors.white] : null;
            }

            case "color": {
                const item = /**@type {ColorItem} */ (value);
                return item.color === enumColors["aaaaaa"] ? null : item;
            }

            case "shape": {
                return value;
            }

            default:
                assertAlways(false, "Unknown item type: " + value.getItemType());
        }
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
            if (entity && entity.components.Display) {
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
                    const D_context = parameters.context;
                    D_context.fillStyle = "#" + value.getAsCopyableKey();
                    D_context.fillRect((origin.x + 0.5) * globalConfig.tileSize - 15 + Dimension.x / 2 - 0.5, (origin.y + 0.5) * globalConfig.tileSize - 15 + Dimension.y / 2, 30 * Dimension.x, 30 * Dimension.y - 0.5)
                } else if (value.getItemType() === "shape") {
                    if (this.root.currentLayer == "wires") {
                        value.drawItemCenteredClipped(
                            (origin.x + 0.5) * globalConfig.tileSize,
                            (origin.y + 0.5) * globalConfig.tileSize,
                            parameters,
                            30
                        );                 
                    }
                    value.drawItemCenteredClipped(
                        (origin.x + 0.5) * globalConfig.tileSize,
                        (origin.y + 0.5) * globalConfig.tileSize,
                        parameters,
                        30
                    );
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
            if (!entity || !entity.components.Display) {
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
