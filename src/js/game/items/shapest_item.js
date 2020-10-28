import { DrawParameters } from "../../core/draw_parameters";
import { types } from "../../savegame/serialization";
import { BaseItem } from "../base_item";
import { ShapeDefinition } from "../shape_definition";
import { THEME } from "../theme";
import { globalConfig } from "../../core/config";
import { smoothenDpi } from "../../core/dpi_manager";
import { enumColors, enumColorsToHexCode, enumColorToShortcode, enumShortcodeToColor } from "../colors";
import { ShapeItem } from "./shape_item"
import { ColorItem, COLOR_ITEM_SINGLETONS } from "../items/color_item";
import { makeOffscreenBuffer } from "../../core/buffer_utils";


export const ERROR = "tErRrRrOrRr";

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
     * Generates this shape as a canvas
     * @param {number} size
     */
    generateAsCanvas(size = 120) {
        const [canvas, context] = makeOffscreenBuffer(size, size, {
            smooth: true,
            label: "definition-canvas-cache-" + this.getHash(),
            reusable: false,
        });

        this.internalGenerateShapeBuffer(canvas, context, size, size, 1);
        return canvas;
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
        return this.hash.split(':').filter(Boolean).map(ShapestLayer.create);
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

            case "-":
            case "R":
            case "C":
            case "S":
            case "W": return new Shape4Layer("4" + hash, layer);
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

            case "-":
            case "R":
            case "C":
            case "S":
            case "W": return Shape4Layer.isValidKey("4" + hash);
        }
        return false;
    }

    color(i) { abstract; }
    colorHex(i) {
        return enumColorsToHexCode[enumShortcodeToColor[this.color(i)]];
    }

    sameLayerAs(layer) {
        return this.layerHash() == layer.layerHash();
    }

    draw(context) { abstract; }
    can_fall_through(layer) { return this.can_stack_with(layer); }
    can_stack_with(layer) { return this.sameLayerAs(layer); }
    /** @returns {any} */
    do_stack_with(layer) { return ERROR; }
    /** @returns {any} */
    do_paint(clr) { return ERROR; }
    /** @returns {any} */
    do_paint4(clrs) { return ERROR; }
    /** @returns {any} */
    do_rotate(rot) { return ERROR; }
    /** @returns {any[]} */
    do_cut2() { return [ERROR, ERROR]; }
    /** @returns {any[]} */
    do_cut4() { return [ERROR, ERROR, ERROR, ERROR]; }
    virt_analyze() { return [null, null, null]; }

}

// n123
class NumberLayer extends ShapestLayer {
    static layerHash() {
        return "n";
    }

    static isValidKey(hash) {
        return hash[0] == this.layerHash() && Number.isInteger(+hash.slice(2));
    }

    color() {
        return this.hash[1];
    }

    get value() {
        return +this.hash.slice(2);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.fillStyle = this.colorHex(0);

        ctx.font = `${this.scale}px Sans-serif`;

        ctx.strokeText(this.value + '', 0, 0, 20);
        ctx.fillText(this.value + '', 0, 0, 20);

    }

    toTextLayer() {
        let value = this.value.toString().split('').map(e => e + this.color()).join('');
        return new TextLayer('t' + value, this.layer);
    }

    can_fall_through(layer) {
        return this.sameLayerAs(layer) || layer.layerHash() == 't';
    }

    do_stack_with(layer) {
        if (layer.layerHash() == 't') return this.toTextLayer().do_stack_with(layer);
        if (!this.sameLayerAs(layer) || this.color() != layer.color()) return ERROR;
        return new NumberLayer(`n${this.color()}${this.value + layer.value}`, this.layer);
    }
    do_paint(clr) {
        return new NumberLayer(`n${clr}${this.value}`, this.layer);
    }
    do_rotate(rot) {
        let value = rot == 1 ? this.value + 1 : rot == -1 ? this.value - 1 : -this.value;
        return new NumberLayer(`n${this.color()}${value}`, this.layer);
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
        return this.hash[2 + 2 * i];
    }

    shape(i) {
        let l = this.hash[1 + 2 * i]
        return l != '_' ? l : i == 0 || i == this.length - 1 ? ' ' : l;
    }

    get value() {
        return this.hash.split('').filter((e, i) => i % 2).join('');
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.font = `${this.scale}px Sans-serif`;

        let actw = ctx.measureText(this.value).width;
        let fullw = 0;
        for (let i = 0; i < this.length; i++) {
            fullw += ctx.measureText(this.shape(i)).width;
        }
        let mul = Math.min(fullw, 20) / fullw;
        let x = -fullw / 2;
        for (let i = 0; i < this.length; i++) {
            let w = ctx.measureText(this.shape(i)).width;
            x += w / 2;
            ctx.fillStyle = this.colorHex(i);
            ctx.strokeText(this.shape(i), x * mul, 0, w * mul);
            ctx.fillText(this.shape(i), x * mul, 0, w * mul);
            x += w / 2;
        }

    }

    can_fall_through(layer) {
        return this.sameLayerAs(layer) || layer.layerHash() == 'n';
    }

    do_stack_with(layer) {
        if (layer.layerHash() == 'n') return this.do_stack_with(layer.toTextLayer());
        if (!this.sameLayerAs(layer)) return ERROR;
        return this.hash + layer.hash.slice(1);
    }
    do_paint(clr) {
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            s += this.shape(i) + clr;
        }
        return new TextLayer(s, this.layer);
    }
    do_paint4(clrs) {
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            s += this.shape(i) + (clrs[i] || this.color(i));
        }
        return new TextLayer(s, this.layer);
    }
    do_rotate(rot) {
        // !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
        let list_low = 'abcdefghijklmnopqrstuvwxyz';
        let list_high = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let list_sym = '_!"#$%&\'()*+,-./<=>?[]^{|}';

        assert(list_low.length == list_high.length && list_high.length == list_sym.length);

        if (this.length != 1) {
            let list = this.hash.slice(1).match(/[^][^]/g);
            if (rot == 1) {
                list.push(list.shift());
            } else if (rot == -1) {
                list.unshift(list.pop());
            } else if (rot == 0) {
                list.reverse();
            }
            return new TextLayer(`t${list.join('')}`, this.layer);
        } else {
            let dblist = list_low + list_low + list_high + list_high + list_sym + list_sym;
            let qlist = list_low + list_high + list_sym + list_low;

            let letter = this.shape(0);
            if (rot == 1) {
                letter = dblist[dblist.indexOf(letter) + 1];
            } else if (rot == -1) {
                letter = dblist[dblist.lastIndexOf(letter) - 1];
            } else if (rot == 0) {
                letter = qlist[qlist.indexOf(letter) + list_low.length];
            }
            return new TextLayer(`t${letter}${this.color(0)}`, this.layer);
        }

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

export const shape4svg = {
    R: "M 0 0 L 1 0 L 1 1 L 0 1 Z",
    C: "M 0 0 L 1 0 A 1 1 0 0 1 0 1 Z",
    S: "M 0 0 L 0 0.6 L 1 1 L 0.6 0 Z",
    W: "M 0 0 L 0 0.6 L 1 1 L 1 0 Z",
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

    do_paint(clr) {
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            s += this.shape(i) == '-' ? '--' : this.shape(i) + clr;
        }
        return new Shape4Layer(s, this.layer);
    }
    do_paint4(clrs) {
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            s += this.shape(i) == '-' ? '--' : this.shape(i) + (clrs[i] || this.color(i));
        }
        return new Shape4Layer(s, this.layer);
    }
    do_rotate(rot) {
        let value = this.hash.slice(1);
        if (rot == 1) {
            value = value.slice(-2) + value.slice(0, -2);
        } else if (rot == -1) {
            value = value.slice(2) + value.slice(0, 2);
        } else if (rot == 0) {
            value = value.slice(this.length) + value.slice(0, this.length);
        }
        return new Shape4Layer(this.layerHash() + value, this.layer);
    }
    do_cut2() {
        let half1 = this.hash.slice(1, this.length + 1);
        let half2 = this.hash.slice(this.length + 1);
        if (half1 == '-'.repeat(this.length)) half1 = null;
        if (half2 == '-'.repeat(this.length)) half2 = null;
        return [half1 && new Shape4Layer(this.layerHash() + half1 + '-'.repeat(this.length), 0), half2 && new Shape4Layer(this.layerHash() + '-'.repeat(this.length) + half2, 0)];
    }
    do_cut4() {
        let parts = Array(this.length).fill(0).map((e, i) => this.shape(i) + this.color(i));

        return parts
            .map((e, i) => Array(this.length).fill('--').map((elm, ind) => i == ind ? e : elm).join(''))
            .map(e => e == '--'.repeat(this.length) ? null : new Shape4Layer(this.layerHash() + e, this.layer));
    }

    virt_analyze() {
        return [new Shape4Layer(this.layerHash() + (this.shape(0) + 'u').repeat(this.length), 0), this.color(0)];
    }
}

function dotPos(l, a) {
    return `${l * Math.cos(Math.PI / a)} ${l * Math.sin(Math.PI / a)}`;
}

function sinPiBy(a) {
    return Math.sin(Math.PI / a);
}
function cosPiBy(a) {
    return Math.cos(Math.PI / a);
}

let shape6long = 1 / cosPiBy(6);

export const shape6svg = {
    R: `M 0 0 L 1 0 L ${dotPos(shape6long, 6)} L ${dotPos(1, 3)} Z`,
    C: `M 0 0 L 1 0 A 1 1 0 0 1 ${dotPos(1, 3)} Z`,
    S: `M 0 0 L 0.6 0 L ${dotPos(shape6long, 6)} L ${dotPos(0.6, 3)} Z`,
    W: `M 0 0 L 0.6 0 L ${dotPos(shape6long, 6)} L ${dotPos(1, 3)} Z`,
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

        for (let i = 0; i < 6; i++) {
            let p = new Path2D(shape6svg[this.shape(i)]);
            ctx.fillStyle = this.colorHex(i);
            ctx.fill(p);
            ctx.stroke(p);
            ctx.rotate(Math.PI / 3);
        }

    }

    can_fall_through(layer) {
        switch (layer.layerHash()) {
            case "6": {
                for (let i = 0; i < this.length; i++)
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

    do_paint(clr) {
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            s += this.shape(i) == '-' ? '--' : this.shape(i) + clr;
        }
        return new Shape6Layer(s, this.layer);
    }
    do_paint4(clrs) {
        let s = this.layerHash();
        for (let i = 0; i < this.length; i++) {
            s += this.shape(i) == '-' ? '--' : this.shape(i) + (clrs[i] || this.color(i));
        }
        return new Shape4Layer(s, this.layer);
    }
    do_rotate(rot) {
        let value = this.hash.slice(1);
        if (rot == 1) {
            value = value.slice(-2) + value.slice(0, -2);
        } else if (rot == -1) {
            value = value.slice(2) + value.slice(0, 2);
        } else if (rot == 0) {
            value = value.slice(this.length) + value.slice(0, this.length);
        }
        return new Shape6Layer(this.layerHash() + value, this.layer);
    }
    do_cut2() {
        let half1 = this.hash.slice(1, this.length + 1);
        let half2 = this.hash.slice(this.length + 1);
        if (half1 == '-'.repeat(this.length)) half1 = null;
        if (half2 == '-'.repeat(this.length)) half2 = null;
        return [half1 && new Shape6Layer(this.layerHash() + half1 + '-'.repeat(this.length), 0), half2 && new Shape6Layer(this.layerHash() + '-'.repeat(this.length) + half2, 0)];
    }
    do_cut4() {
        let partCount = 3;
        let parts = Array(partCount).fill(0).map((e, i) => this.hash.slice(1 + 4 * i, 5 + 4 * i));

        return parts
            .map((e, i) => Array(partCount).fill('----').map((elm, ind) => i == ind ? e : elm).join(''))
            .map(e => e == '--'.repeat(this.length) ? null : new Shape6Layer(this.layerHash() + e, this.layer))
            .concat([null]);
    }
    virt_analyze() {
        return [new Shape6Layer(this.layerHash() + (this.shape(0) + 'u').repeat(this.length), 0), this.color(0)];
    }
}


const cache = {
    do_stack: new Map(),
    do_rotate: new Map(),
    do_paint: new Map(),
    do_paint4: new Map(),
    do_cut2: new Map(),
    do_cut4: new Map(),
    virt_unstack_bottom: new Map(),
    virt_analyze: new Map(),
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

        let resultItem = new ShapestItem(resultLayers.join(':'));

        return this.addCached('do_stack', lowerItem + ':::' + upperItem, resultItem);
    }

    static do_rotate(item, dir) {
        if (this.getCached('do_rotate', item + ':::' + dir)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let resultLayers = layers.map(e => e.do_rotate(dir));

        let resultItem = new ShapestItem(resultLayers.join(':'));

        return this.addCached('do_rotate', item + ':::' + dir, resultItem);
    }

    static do_paint(item, clr) {
        if (this.getCached('do_paint', item + ':::' + clr)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let resultLayers = layers.map(e => e.do_paint(clr));

        let resultItem = new ShapestItem(resultLayers.join(':'));

        return this.addCached('do_paint', item + ':::' + clr, resultItem);
    }

    static do_paint4(item, clr) {
        if (this.getCached('do_paint4', item + ':::' + clr)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let resultLayers = layers.map(e => e.do_paint4(clr));

        let resultItem = new ShapestItem(resultLayers.join(':'));

        return this.addCached('do_paint4', item + ':::' + clr, resultItem);
    }

    static do_cut2(item) {
        if (this.getCached('do_cut2', item)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let resultLayers1 = layers.map(e => e.do_cut2()[0]).filter(Boolean);
        let resultLayers2 = layers.map(e => e.do_cut2()[1]).filter(Boolean);

        let resultItem1 = resultLayers1.length ? new ShapestItem(resultLayers1.join(':')) : null;
        let resultItem2 = resultLayers2.length ? new ShapestItem(resultLayers2.join(':')) : null;

        return this.addCached('do_cut2', item, [resultItem1, resultItem2]);
    }
    static do_cut4(item) {
        if (this.getCached('do_cut4', item)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let result = Array(4).fill(0)
            .map((e, i) => layers.map(e => e.do_cut4()[i]).filter(Boolean))
            .map(e => e.length ? new ShapestItem(e.join(':')) : null);

        return this.addCached('do_cut4', item, result);
    }

    static virt_unstack_bottom(item) {
        if (this.getCached('virt_unstack_bottom', item)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let lowerItem = new ShapestItem(layers[0] + '');
        let upperItem = layers.length > 1 ? new ShapestItem(layers.slice(1).join(':')) : null;

        return this.addCached('virt_unstack_bottom', item, [lowerItem, upperItem]);
    }

    static virt_analyze(item) {
        if (this.getCached('virt_analyze', item)) return this.lastCached;

        let layers = new ShapestItem(item).layers;

        let result = layers[0].virt_analyze();

        let shapeItem = result[0] && new ShapestItem(result[0] + '');
        let colorItem = result[1] && result[1] != '-' ? COLOR_ITEM_SINGLETONS[enumShortcodeToColor[result[1]]] : null;

        return this.addCached('virt_analyze', item, [shapeItem, colorItem]);
    }
}

/// DEBUG:


globalThis.shape6 = shape6svg;

globalThis.clearCaches = function() {
    for (let k in cache) {
        cache[k].clear();
    }
}

globalThis.cache = function() {
    let es = Object.entries(cache)
    let es2 = es.map(([k, map]) => {
        return [
            k,
            Object.fromEntries(
                [...map.entries()].map(([k,v])=>[k,
                    Array.isArray(v) ? v.map(e=>e&&e.hash) : v.hash
                    ])
            )
        ]
    })
    return Object.fromEntries(es2);
}


console.log(shape6svg);