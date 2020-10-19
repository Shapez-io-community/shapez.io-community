import { DrawParameters } from "../../core/draw_parameters";
import { types } from "../../savegame/serialization";
import { BaseItem } from "../base_item";
import { ShapeDefinition } from "../shape_definition";
import { THEME } from "../theme";
import { globalConfig } from "../../core/config";
import { smoothenDpi } from "../core/dpi_manager";

export class ShapestItem extends BaseItem {
    static getId() {
        return "shapest";
    }


    static getSchema() {
        return types.string;
    }

    serialize() {
        return this.hash;
    }

    deserialize(data) {
        this.hash = data;
    }

    /** @returns {"shapest"} **/
    getItemType() {
        return "shapest";
    }

    /**
     * @returns {string}
     */
    getAsCopyableKey() {
        return this.hash;
    }

    /**
     * @returns {string}
     */
    getHash() {
        return this.hash;
    }

    /**
     * @param {BaseItem} other
     */
    equalsImpl(other) {
        return this.getHash() === other.getHash();
    }

    /**
     * @param {string} hash
     */
    constructor(hash) {
        super();

        /**
         * This property must not be modified on runtime, you have to clone the class in order to change the definition
         */
        this.hash = hash;
    }

    getBackgroundColorAsResource() {
        return THEME.map.resources.shape;
    }

    /**
     * Draws the item to a canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} size
     */
    drawFullSizeOnCanvas(context, size) {
        this.internalGenerateShapeBuffer(null, context, size, size, 1);
    }

    /**
     * Draws the shape definition
     * @param {number} x
     * @param {number} y
     * @param {DrawParameters} parameters
     * @param {number=} diameter
     */
    drawCentered(x, y, parameters, diameter = 20) {
        const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
        const key = diameter + "/" + dpi + "/" + this.hash;
        const canvas = parameters.root.buffers.getForKey({
            key: "shapedef",
            subKey: key,
            w: diameter,
            h: diameter,
            dpi,
            redrawMethod: this.internalGenerateShapeBuffer.bind(this),
        });
        parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
    }


    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} w
     * @param {number} h
     * @param {number} dpi
     */
    internalGenerateShapeBuffer(canvas, context, w, h, dpi) {
        context.translate((w * dpi) / 2, (h * dpi) / 2);
        context.scale((dpi * w) / 23, (dpi * h) / 23);

        context.fillStyle = "#e9ecf7";

        const quadrantSize = 10;
        const quadrantHalfSize = quadrantSize / 2;

        context.fillStyle = THEME.items.circleBackground;
        context.beginCircle(0, 0, quadrantSize * 1.15);
        context.fill();

        for (let layerIndex = 0; layerIndex < this.layers.length; ++layerIndex) {
            const quadrants = this.layers[layerIndex];

            const layerScale = Math.max(0.1, 0.9 - layerIndex * 0.22);

            for (let quadrantIndex = 0; quadrantIndex < 4; ++quadrantIndex) {
                if (!quadrants[quadrantIndex]) {
                    continue;
                }
                const { subShape, color } = quadrants[quadrantIndex];

                const quadrantPos = arrayQuadrantIndexToOffset[quadrantIndex];
                const centerQuadrantX = quadrantPos.x * quadrantHalfSize;
                const centerQuadrantY = quadrantPos.y * quadrantHalfSize;

                const rotation = Math.radians(quadrantIndex * 90);

                context.translate(centerQuadrantX, centerQuadrantY);
                context.rotate(rotation);

                context.fillStyle = enumColorsToHexCode[color];
                context.strokeStyle = THEME.items.outline;
                context.lineWidth = THEME.items.outlineWidth;

                const insetPadding = 0.0;

                switch (subShape) {
                    case enumSubShape.rect: {
                        context.beginPath();
                        const dims = quadrantSize * layerScale;
                        context.rect(
                            insetPadding + -quadrantHalfSize,
                            -insetPadding + quadrantHalfSize - dims,
                            dims,
                            dims
                        );

                        break;
                    }
                    case enumSubShape.star: {
                        context.beginPath();
                        const dims = quadrantSize * layerScale;

                        let originX = insetPadding - quadrantHalfSize;
                        let originY = -insetPadding + quadrantHalfSize - dims;

                        const moveInwards = dims * 0.4;
                        context.moveTo(originX, originY + moveInwards);
                        context.lineTo(originX + dims, originY);
                        context.lineTo(originX + dims - moveInwards, originY + dims);
                        context.lineTo(originX, originY + dims);
                        context.closePath();
                        break;
                    }

                    case enumSubShape.windmill: {
                        context.beginPath();
                        const dims = quadrantSize * layerScale;

                        let originX = insetPadding - quadrantHalfSize;
                        let originY = -insetPadding + quadrantHalfSize - dims;
                        const moveInwards = dims * 0.4;
                        context.moveTo(originX, originY + moveInwards);
                        context.lineTo(originX + dims, originY);
                        context.lineTo(originX + dims, originY + dims);
                        context.lineTo(originX, originY + dims);
                        context.closePath();
                        break;
                    }

                    case enumSubShape.circle: {
                        context.beginPath();
                        context.moveTo(insetPadding + -quadrantHalfSize, -insetPadding + quadrantHalfSize);
                        context.arc(
                            insetPadding + -quadrantHalfSize,
                            -insetPadding + quadrantHalfSize,
                            quadrantSize * layerScale,
                            -Math.PI * 0.5,
                            0
                        );
                        context.closePath();
                        break;
                    }

                    default: {
                        assertAlways(false, "Unkown sub shape: " + subShape);
                    }
                }

                context.fill();
                context.stroke();

                context.rotate(-rotation);
                context.translate(-centerQuadrantX, -centerQuadrantY);
            }
        }
    }
}



