import { makeOffscreenBuffer } from "./buffer_utils";
import { AtlasSprite, BaseSprite, RegularSprite, SpriteAtlasLink } from "./sprites";
import { cachebust } from "./cachebust";
import { createLogger } from "./logging";

/**
 * @typedef {import("../application").Application} Application
 * @typedef {import("./atlas_definitions").AtlasDefinition} AtlasDefinition;
 */

/**
 * @callback SpriteDrawer
 * @param {Object} param0
 * @param {HTMLCanvasElement} param0.canvas
 */
 // canvas, context, canvas2, context2, w, h, smooth, mipmap, resolution

const logger = createLogger("loader");

const missingSpriteIds = {};

class LoaderImpl {
    constructor() {
        this.app = null;

        /** @type {Map<string, BaseSprite>} */
        this.sprites = new Map();

        this.rawImages = [];

        if (LoaderImpl._drawSpriteList) {
            for (let args of LoaderImpl._drawSpriteList) {
                this.drawSprite(...args);
            }
        }
    }

    /**
     * @param {Application} app
     */
    linkAppAfterBoot(app) {
        this.app = app;
        this.makeSpriteNotFoundCanvas();
    }

    /**
     * Fetches a given sprite from the cache
     * @param {string} key
     * @returns {BaseSprite}
     */
    getSpriteInternal(key) {
        const sprite = this.sprites.get(key);
        if (!sprite) {
            if (!missingSpriteIds[key]) {
                // Only show error once
                missingSpriteIds[key] = true;
                logger.error("Sprite '" + key + "' not found!");
            }
            return this.spriteNotFoundSprite;
        }
        return sprite;
    }

    /**
     * Returns an atlas sprite from the cache
     * @param {string} key
     * @returns {AtlasSprite}
     */
    getSprite(key) {
        const sprite = this.getSpriteInternal(key);
        assert(sprite instanceof AtlasSprite || sprite === this.spriteNotFoundSprite, "Not an atlas sprite");
        return /** @type {AtlasSprite} */ (sprite);
    }

    /**
     * Returns a regular sprite from the cache
     * @param {string} key
     * @returns {RegularSprite}
     */
    getRegularSprite(key) {
        const sprite = this.getSpriteInternal(key);
        assert(
            sprite instanceof RegularSprite || sprite === this.spriteNotFoundSprite,
            "Not a regular sprite"
        );
        return /** @type {RegularSprite} */ (sprite);
    }

    /**
     *
     * @param {string} key
     * @returns {Promise<HTMLImageElement|null>}
     */
    internalPreloadImage(key) {
        const url = cachebust("res/" + key);
        const image = new Image();

        let triesSoFar = 0;

        return Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(reject, G_IS_DEV ? 500 : 10000);
            }),

            new Promise(resolve => {
                image.onload = () => {
                    image.onerror = null;
                    image.onload = null;

                    if (typeof image.decode === "function") {
                        // SAFARI: Image.decode() fails on safari with svgs -> we dont want to fail
                        // on that
                        // FIREFOX: Decode never returns if the image is in cache, so call it in background
                        image.decode().then(
                            () => null,
                            () => null
                        );
                    }
                    resolve(image);
                };

                image.onerror = reason => {
                    logger.warn("Failed to load '" + url + "':", reason);
                    if (++triesSoFar < 4) {
                        logger.log("Retrying to load image from", url);
                        image.src = url + "?try=" + triesSoFar;
                    } else {
                        logger.warn("Failed to load", url, "after", triesSoFar, "tries with reason", reason);
                        image.onerror = null;
                        image.onload = null;
                        resolve(null);
                    }
                };

                image.src = url;
            }),
        ]);
    }

    /**
     * Preloads a sprite
     * @param {string} key
     * @returns {Promise<void>}
     */
    preloadCSSSprite(key) {
        return this.internalPreloadImage(key).then(image => {
            if (key.indexOf("game_misc") >= 0) {
                // Allow access to regular sprites
                this.sprites.set(key, new RegularSprite(image, image.width, image.height));
            }
            this.rawImages.push(image);
        });
    }

    /**
     * Preloads an atlas
     * @param {AtlasDefinition} atlas
     * @returns {Promise<void>}
     */
    preloadAtlas(atlas) {
        return this.internalPreloadImage(atlas.getFullSourcePath()).then(image => {
            // @ts-ignore
            image.label = atlas.sourceFileName;
            return this.internalParseAtlas(atlas, image);
        });
    }

    /**
     *
     * @param {AtlasDefinition} atlas
     * @param {HTMLImageElement} loadedImage
     */
    internalParseAtlas({ meta: { scale }, sourceData }, loadedImage) {
        this.rawImages.push(loadedImage);

        for (const spriteName in sourceData) {
            const { frame, sourceSize, spriteSourceSize } = sourceData[spriteName];

            let sprite = /** @type {AtlasSprite} */ (this.sprites.get(spriteName));

            if (!sprite) {
                sprite = new AtlasSprite(spriteName);
                this.sprites.set(spriteName, sprite);
            }

            const link = new SpriteAtlasLink({
                packedX: frame.x,
                packedY: frame.y,
                packedW: frame.w,
                packedH: frame.h,
                packOffsetX: spriteSourceSize.x,
                packOffsetY: spriteSourceSize.y,
                atlas: loadedImage,
                w: sourceSize.w,
                h: sourceSize.h,
            });
            sprite.linksByResolution[scale] = link;
        }
    }

    /**
     * Makes the canvas which shows the question mark, shown when a sprite was not found
     */
    makeSpriteNotFoundCanvas() {
        const dims = 128;

        const [canvas, context] = makeOffscreenBuffer(dims, dims, {
            smooth: false,
            label: "not-found-sprite",
        });
        context.fillStyle = "#f77";
        context.fillRect(0, 0, dims, dims);

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#eee";
        context.font = "25px Arial";
        context.fillText("???", dims / 2, dims / 2);

        // TODO: Not sure why this is set here
        // @ts-ignore
        canvas.src = "not-found";

        const sprite = new AtlasSprite("not-found");
        ["0.1", "0.25", "0.5", "0.75", "1"].forEach(resolution => {
            sprite.linksByResolution[resolution] = new SpriteAtlasLink({
                packedX: 0,
                packedY: 0,
                w: dims,
                h: dims,
                packOffsetX: 0,
                packOffsetY: 0,
                packedW: dims,
                packedH: dims,
                atlas: canvas,
            });
        });

        this.spriteNotFoundSprite = sprite;
    }

    /**
     * Draw sprite with function
     * @param {SpriteDrawer} callback
     */
    drawSprite(name, callback, { w = 128, h = 128, smooth = false, mipmap = false }, url) {
        // TODO: mipmap
        const [canvas, context] = makeOffscreenBuffer(w, h, {
            smooth,
            reusable: false,
            label: url,
        });
        const [canvas2, context2] = makeOffscreenBuffer(w, h, {
            smooth,
            reusable: true,
            label: url,
        });

        const resolution = 1; // mipmap scale, 1/0.75/0.5/...
        context.save();
        // TODO: scale and translate to make mipmap state same

        callback({ canvas, context, canvas2, context2, w, h, smooth, mipmap, resolution });

        const resolutions = ["0.1", "0.25", "0.5", "0.75", "1"];
        const sprite = new AtlasSprite(name);
        // TODO: remake for mipmapping
        for (let i = 0; i < resolutions.length; ++i) {
            const res = resolutions[i];
            const link = new SpriteAtlasLink({
                packedX: 0,
                packedY: 0,
                w,
                h,
                packOffsetX: 0,
                packOffsetY: 0,
                packedW: w,
                packedH: h,
                atlas: canvas,
            });
            sprite.linksByResolution[res] = link;
        }

        context.restore();
        this.sprites.set(name, sprite);
        canvas.src = url
    }

    /**
     * Draw sprite with function
     * @param {SpriteDrawer} callback
     */
    static drawSprite(name, callback, { w = 128, h = 128, smooth = false, mipmap = false }, url) {
        if (!this._drawSpriteList) this._drawSpriteList = [];
        this._drawSpriteList.push(arguments);
    }
}

export const Loader = new LoaderImpl();
