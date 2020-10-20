import { enumDirection, Vector } from "../../core/vector";
import { enumPinSlotType, WiredPinsComponent } from "../components/wired_pins";
import { Entity } from "../entity";
import { MetaBuilding } from "../meta_building";
import { GameRoot } from "../root";
import { DisplayComponent } from "../components/display";
import { enumHubGoalRewards } from "../tutorial_goals";

const sizeX = 1;
const sizeY = 1;

export const Dimension = new Vector(sizeX, sizeY);

export class MetaDisplayBuilding extends MetaBuilding {
    constructor() {
        super("display");
        this.SilhouetteColor = "#aaaaaa";
    }

    getSilhouetteColor() {
        return this.SilhouetteColor;
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_display);
    }

    getDimensions() {
        return Dimension;
    }

    getShowWiresLayerPreview() {
        return true;
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new WiredPinsComponent({
                slots: [
                    {
                        pos: new Vector(Math.floor((Dimension.x - 1) / 2), Dimension.y - 1),
                        direction: enumDirection.bottom,
                        type: enumPinSlotType.logicalAcceptor,
                    },
                ],
            })
        );
        entity.addComponent(new DisplayComponent());
    }
}
