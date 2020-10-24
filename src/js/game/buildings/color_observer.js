import { enumDirection, Vector } from "../../core/vector";
import { enumPinSlotType, WiredPinsComponent } from "../components/wired_pins";
import { Entity } from "../entity";
import { MetaBuilding } from "../meta_building";
import { GameRoot } from "../root";
import { ColorObserverComponent } from "../components/color_observer";
import { enumHubGoalRewards } from "../tutorial_goals";
import { RandomNumberGenerator } from "../../core/rng";

export class MetaColorObserverBuilding extends MetaBuilding {
    constructor() {
        super("color_observer");
        this.SilhouetteColor = "#aaaaaa";
    }

    getIsRotateable() {
        return true;
    }

    getSilhouetteColor() {
        return this.SilhouetteColor;
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_filter_and_color_observer);
    }

    getDimensions() {
        return new Vector(3, 1);
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
                        pos: new Vector(0, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.logicalEjector,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.logicalEjector,
                    },
                    {
                        pos: new Vector(2, 0),
                        direction: enumDirection.top,
                        type: enumPinSlotType.logicalEjector,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.bottom,
                        type: enumPinSlotType.logicalAcceptor,
                    },
                ],
            })
        );
        entity.addComponent(new ColorObserverComponent());
    }
}
