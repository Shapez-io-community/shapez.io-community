import { DrawParameters } from "../../core/draw_parameters";
import { types } from "../../savegame/serialization";
import { BaseItem } from "../base_item";
import { ShapeDefinition } from "../shape_definition";
import { THEME } from "../theme";
import { globalConfig } from "../../core/config";
import { smoothenDpi } from "../../core/dpi_manager";
import { enumColors, enumColorsToHexCode, enumColorToShortcode, enumShortcodeToColor } from "../colors";
import { ShapeItem } from "./shape_item"


const ERROR = "tErRrRrOrRr";

export class ShapestItem extends ShapeItem {
    static getId() {
        return "shapest";
    }

    static getSchema() {
        return types.string;
    }

    static isValidShortKey(code) {
        return !code.split(':').find(e => !ShapestLayer.isValidKey(e));
    }

    static fromShortKey(code) {
        return new ShapestItem(code);
    }

    serialize() {
        return this.layers.join(':');
        return this.hash;
    }

    deserialize(data) {
        this.hash = data;
    }

    /** @returns {"shape"} **/
    getItemType() {
        return "shape";
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
        super(null);

        /**
         * This property must not be modified on runtime, you have to clone the class in order to change the definition
         */
        this.hash = hash || ERROR;
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
     * @param {number} x
     * @param {number} y
     * @param {DrawParameters} parameters
     * @param {number=} diameter
     */
    drawItemCenteredImpl(x, y, parameters, diameter = globalConfig.defaultItemDiameter) {
        this.drawCentered(x, y, parameters, diameter);
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

        for (let layer of this.layers) {
            context.save();

            context.strokeStyle = THEME.items.outline;
            context.lineWidth = THEME.items.outlineWidth;
            context.miterLimit = 2;
            context.textAlign = "center";
            context.textBaseline = "middle";

            layer.draw(context)

            context.restore();
        }
    }

    /**
     * @returns {ShapestItemDefinition}
     */
    get do() {
        return new ShapestItemDefinition(this);
    }
    /**
     * @returns {ShapestItemDefinition}
     */
    get definition() {
        return new ShapestItemDefinition(this);
    }
    set definition(v) { }


    get layers() {
        return this.hash.split(':').map(ShapestLayer.create);
    }
}


// /**
// * @typedef {{
// *   app: string,
// *   version: string,
// *   image: string,
// *   format: string,
// *   size: Size,
// *   scale: string,
// *   smartupdate: string
// * }} ShapestQuad
// */


class ShapestLayer {
    /**
     * @param {string} hash
     * paran {number} layer
     */
    constructor(hash, layer) {
        this.hash = hash;
        this.layer = layer;
    }

    static layerHash() {
        abstract;
        return "";
    }

    layerHash() {
        return this.constructor.layerHash();
    }

    toString() {
        return `${this.hash}`;
    }

    get scale() {
        return Math.max(1, 9 - this.layer * 2.2);
    }

    static create(hash, layer) {
        switch (hash[0]) {
            case "n": return new NumberLayer(hash, layer);
            case "t": return new TextLayer(hash, layer);
            case "e": return new EmojiLayer(hash, layer);
            case "4": return new Shape4Layer(hash, layer);
            case "6": return new Shape6Layer(hash, layer);
        }
        throw new Error('can\'t create layer ' + hash);
    }

    static isValidKey(hash) {
        switch (hash[0]) {
            case "n": return NumberLayer.isValidKey(hash);
            case "t": return TextLayer.isValidKey(hash);
            case "e": return EmojiLayer.isValidKey(hash);
            case "4": return Shape4Layer.isValidKey(hash);
            case "6": return Shape6Layer.isValidKey(hash);
        }
        return false;
    }

    color(i) { abstract; }
    colorHex(i) {
        return enumColorsToHexCode[enumShortcodeToColor[this.color(i)]];
    }

    draw(context) { abstract; }
    do_paint(clr) { abstract; }
    do_rotate(rot) { abstract; }
    can_fall_through(layer) { return false; }
    can_stack_with(layer) { return this.hash[0] == layer.hash[0]; }
    do_stack_with(layer) { abstract; }

}

// n123
class NumberLayer extends ShapestLayer {
    static layerHash() {
        return "n";
    }

    static isValidKey(hash) {
        return hash[0] == this.layerHash() && Number.isInteger(+hash.slice(2));
    }

    get color() {
        return enumColorsToHexCode[enumShortcodeToColor[this.hash[1]]];
    }

    get value() {
        return +this.hash.slice(2);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.fillStyle = this.color;

        ctx.font = `${this.scale}px Sans-serif`;

        ctx.strokeText(this.value + '', 0, 0, 20);
        ctx.fillText(this.value + '', 0, 0, 20);

    }

}

// twqwerty
class TextLayer extends ShapestLayer {
    static layerHash() {
        return "t";
    }

    static isValidKey(hash) {
        return hash[0] == this.layerHash() && hash.length % 2 && hash.length >= 3;
    }

    get length() {
        return (this.hash.length - 1) / 2;
    }

    color(i) {
        return enumColorsToHexCode[enumShortcodeToColor[this.hash[2 + 2 * i]]];
    }

    shape(i) {
        return this.hash[1 + 2 * i];
    }

    get value() {
        return this.hash.split('').filter((e, i) => i % 2).join('');
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.fillStyle = this.color(0);

        ctx.font = `${this.scale}px Sans-serif`;

        let fullw = 0;
        for (let i = 0; i < this.length; i++) {
            fullw += ctx.measureText(this.shape(i)).width;
        }
        let x = -fullw / 2;
        for (let i = 0; i < this.length; i++) {
            let w = ctx.measureText(this.shape(i)).width;
            x += w / 2;
            ctx.strokeText(this.shape(i), x, 0, 20);
            ctx.fillText(this.shape(i), x, 0, 20);
            x += w / 2;
        }


    }

    can_fall_through(layer) {
        return layer.layerHash() == this.layerHash();
    }

    do_stack_with(layer) {
        if (layer.layerHash() != this.layerHash()) return ERROR;
        return this.hash + layer.hash.slice(1);
    }

}

// e💩
class EmojiLayer extends ShapestLayer {
    static layerHash() {
        return "e";
    }

    static isValidKey(hash) {
        return hash[0] == this.layerHash() && hash.length >= 2;
    }

    get value() {
        return this.hash.slice(1);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.fillStyle = "white";
        ctx.font = `${this.scale}px Sans-serif`;

        ctx.strokeText(this.value, 0, 0, 20);
        ctx.fillText(this.value, 0, 0, 20);

    }

}

const shape4svg = {
    R: "M 0 0 v 1 h 1 v -1 z",
    C: "M 0 0 l 1 0 a 1 1 0 0 1 -1 1 z ",
    S: "M 0 0 L 0 0.6 1 1 0.6 0 z",
    W: "M 0 0 L 0 0.6 1 1 1 0 z",
    "-": "M 0 0",
}

// 4CwCrCgCb
class Shape4Layer extends ShapestLayer {
    static layerHash() {
        return "4";
    }

    static isValidKey(hash) {
        return hash[0] == this.layerHash() && hash.length == 4 * 2 + 1;
    }

    get length() {
        return 4;
    }

    color(i) {
        return this.hash[2 + 2 * i];
    }

    shape(i) {
        return this.hash[1 + 2 * i];
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.scale(this.scale, this.scale);
        ctx.lineWidth /= this.scale;
        ctx.rotate(-Math.PI / 2)

        for (let i = 0; i < 4; i++) {
            let p = new Path2D(shape4svg[this.shape(i)]);
            ctx.fillStyle = this.colorHex(i);
            ctx.fill(p);
            ctx.stroke(p);
            ctx.rotate(Math.PI / 2);
        }

    }

    can_fall_through(layer) {
        switch (layer.layerHash()) {
            case "4": {
                for (let i = 0; i < 4; i++)
                    if (this.shape(i) != '-' && layer.shape(i) != '-') return false;
                return true;
            }
            case "6": {
                if (this.shape(0) != '-' && (layer.shape(0) != '-' || layer.shape(1) != '-')) return false;
                if (this.shape(1) != '-' && (layer.shape(1) != '-' || layer.shape(2) != '-')) return false;
                if (this.shape(2) != '-' && (layer.shape(3) != '-' || layer.shape(4) != '-')) return false;
                if (this.shape(3) != '-' && (layer.shape(4) != '-' || layer.shape(5) != '-')) return false;
                return true;
            }

            default: return false;
        }
    }

    do_stack_with(layer) {
        if (layer.layerHash() != this.layerHash()) return ERROR;
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            if (this.shape(i) != '-') {
                s += this.shape(i) + this.color(i);
            } else {
                s += layer.shape(i) + layer.color(i);
            }
        }
        return s;
    }

}

const shape6svg = {
    R: `M 0 0 L 1 0 1 ${Math.sin(Math.PI / 6) / Math.cos(Math.PI / 6)} ${Math.cos(Math.PI / 3)} ${Math.sin(Math.PI / 3)} Z`,
    C: "M 0 0 l 1 0 a 1 1 0 0 1 -1 1 z ",
    S: "M 0 0 L 0 0.6 1 1 0.6 0 z",
    W: "M 0 0 L 0 0.6 1 1 1 0 z",
    "-": "M 0 0",
}

// 6CwCrCgCbRcRy
class Shape6Layer extends ShapestLayer {
    static layerHash() {
        return "6";
    }

    static isValidKey(hash) {
        return hash[0] == this.layerHash() && hash.length == 6 * 2 + 1;
    }

    get length() {
        return 6;
    }

    color(i) {
        return enumColorsToHexCode[enumShortcodeToColor[this.hash[2 + 2 * i]]];
    }

    shape(i) {
        return this.hash[1 + 2 * i];
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.scale(this.scale, this.scale);
        ctx.lineWidth /= this.scale;
        ctx.rotate(-Math.PI / 2)

        for (let i = 0; i < 6; i++) {
            let p = new Path2D(shape6svg[this.shape(i)]);
            ctx.fillStyle = this.color(i);
            ctx.fill(p);
            ctx.stroke(p);
            ctx.rotate(Math.PI / 3);
        }

    }

    can_fall_through(layer) {
        switch (layer.layerHash()) {
            case "6": {
                for (let i = 0; i < 6; i++)
                    if (this.shape(i) != '-' && layer.shape(i) != '-') return false;
                return true;
            }
            case "4": {
                return layer.can_fall_through(this);
            }

            default: return false;
        }
    }

    do_stack_with(layer) {
        if (layer.layerHash() != this.layerHash()) return ERROR;
        let s = '6';
        for (let i = 0; i < this.length; i++) {
            if (this.shape(i) != '-') {
                s += this.shape(i) + this.color(i);
            } else {
                s += layer.shape(i) + layer.color(i);
            }
        }
        return s;
    }

}


const cache = {
    do_stack: new Map(),
};


export class ShapestItemDefinition {
    constructor(item) {
        this.hash = item.hash;
    }
    getHash() {
        return this.hash;
    }

    static getCached(opName, opHash) {
        return this.lastCached = cache[opName].get(opHash);
    }
    static addCached(opName, opHash, opResult) {
        cache[opName].set(opHash, opResult);
        return opResult;
    }

    static do_stack(lowerItem, upperItem) {
        if (this.getCached('do_stack', lowerItem + ':::' + upperItem)) return this.lastCached;

        let lowerLayers = new ShapestItem(lowerItem).layers;
        let upperLayers = new ShapestItem(upperItem).layers;

        let fall = lowerLayers.length;
        outerLoop: for (let tryFall = lowerLayers.length - 1; tryFall >= 0; tryFall--) {

            for (let upi = 0; upi < upperLayers.length; upi++) {
                let lowi = upi + tryFall;
                if (!lowerLayers[lowi]) continue;
                if (!upperLayers[upi].can_fall_through(lowerLayers[lowi]))
                    break outerLoop;
            }

            fall = tryFall;

        }

        let resultLayers = [];
        for (let i = 0; i < 5; i++) {
            if (lowerLayers[i] && upperLayers[i - fall]) {
                resultLayers[i] = lowerLayers[i].do_stack_with(upperLayers[i - fall]);
            } else if (lowerLayers[i]) {
                resultLayers[i] = lowerLayers[i];
            } else if (upperLayers[i - fall]) {
                resultLayers[i] = upperLayers[i - fall];
            }
        }

        let result = new ShapestItem(resultLayers.join(':'));

        return this.addCached('do_stack', lowerItem + ':::' + upperItem, result);
    }
}