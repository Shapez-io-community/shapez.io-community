import { colorPalatte } from "./colors";

export const THEMES = {
    dark: require("./themes/dark.json"),
    light: require("./themes/light.json"),
};

for (var i = 0; i < colorPalatte.length; i++) {
    THEMES.light.map.resources[colorPalatte[i]] = "#" + colorPalatte[i];
    THEMES.dark.map.resources[colorPalatte[i]] = "#" + colorPalatte[i];
}

export let THEME = THEMES.light;

export function applyGameTheme(id) {
    THEME = THEMES[id];
}
