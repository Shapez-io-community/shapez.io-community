import { BaseItem } from "../base_item";
import { enumColors } from "../colors";
import { enumLogicGateType, LogicGateComponent } from "../components/logic_gate";
import { enumPinSlotType } from "../components/wired_pins";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { BOOL_FALSE_SINGLETON, BOOL_TRUE_SINGLETON, BooleanItem, isTruthyItem } from "../items/boolean_item";
import { ColorItem, COLOR_ITEM_SINGLETONS } from "../items/color_item";
import { ShapeItem } from "../items/shape_item";
import { ShapestItem, ShapestItemDefinition } from "../items/shapest_item";
import { ShapeDefinition } from "../shape_definition";

export class LogicGateSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [LogicGateComponent]);

        this.boundOperations = {
            [enumLogicGateType.and]: this.compute_AND.bind(this),
            [enumLogicGateType.not]: this.compute_NOT.bind(this),
            [enumLogicGateType.xor]: this.compute_XOR.bind(this),
            [enumLogicGateType.or]: this.compute_OR.bind(this),
            [enumLogicGateType.transistor]: this.compute_IF.bind(this),

            [enumLogicGateType.rotater]: this.compute_ROTATE.bind(this),
            [enumLogicGateType.analyzer]: this.compute_ANALYZE.bind(this),
            [enumLogicGateType.cutter]: this.compute_CUT.bind(this),
            [enumLogicGateType.unstacker]: this.compute_UNSTACK.bind(this),
            [enumLogicGateType.compare]: this.compute_COMPARE.bind(this),
            [enumLogicGateType.stacker]: this.compute_STACKER.bind(this),
            [enumLogicGateType.painter]: this.compute_STACKER.bind(this),
        };
    }

    update() {
        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];
            const logicComp = entity.components.LogicGate;
            const slotComp = entity.components.WiredPins;

            const slotValues = [];

            // Store if any conflict was found
            let anyConflict = false;

            // Gather inputs from all connected networks
            for (let i = 0; i < slotComp.slots.length; ++i) {
                const slot = slotComp.slots[i];
                if (slot.type !== enumPinSlotType.logicalAcceptor) {
                    continue;
                }
                const network = slot.linkedNetwork;
                if (network) {
                    if (network.valueConflict) {
                        anyConflict = true;
                        break;
                    }
                    slotValues.push(network.currentValue);
                } else {
                    slotValues.push(null);
                }
            }

            // Handle conflicts
            if (anyConflict) {
                for (let i = 0; i < slotComp.slots.length; ++i) {
                    const slot = slotComp.slots[i];
                    if (slot.type !== enumPinSlotType.logicalEjector) {
                        continue;
                    }
                    slot.value = null;
                }
                continue;
            }

            // Compute actual result
            const result = this.boundOperations[logicComp.type](slotValues);

            if (Array.isArray(result)) {
                let resultIndex = 0;
                for (let i = 0; i < slotComp.slots.length; ++i) {
                    const slot = slotComp.slots[i];
                    if (slot.type !== enumPinSlotType.logicalEjector) {
                        continue;
                    }
                    slot.value = result[resultIndex++];
                }
            } else {
                // @TODO: For now we hardcode the value to always be slot 0
                assert(
                    slotValues.length === slotComp.slots.length - 1,
                    "Bad slot config, should have N acceptor slots and 1 ejector"
                );
                assert(slotComp.slots[0].type === enumPinSlotType.logicalEjector, "Slot 0 should be ejector");
                slotComp.slots[0].value = result;
            }
        }
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_AND(parameters) {
        assert(parameters.length === 2, "bad parameter count for AND");
        return isTruthyItem(parameters[0]) && isTruthyItem(parameters[1])
            ? BOOL_TRUE_SINGLETON
            : BOOL_FALSE_SINGLETON;
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_NOT(parameters) {
        return isTruthyItem(parameters[0]) ? BOOL_FALSE_SINGLETON : BOOL_TRUE_SINGLETON;
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_XOR(parameters) {
        assert(parameters.length === 2, "bad parameter count for XOR");
        return isTruthyItem(parameters[0]) !== isTruthyItem(parameters[1])
            ? BOOL_TRUE_SINGLETON
            : BOOL_FALSE_SINGLETON;
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_OR(parameters) {
        assert(parameters.length === 2, "bad parameter count for OR");
        return isTruthyItem(parameters[0]) || isTruthyItem(parameters[1])
            ? BOOL_TRUE_SINGLETON
            : BOOL_FALSE_SINGLETON;
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_IF(parameters) {
        assert(parameters.length === 2, "bad parameter count for IF");
        const flag = parameters[0];
        const value = parameters[1];

        // pass through item
        if (isTruthyItem(flag)) {
            return value;
        }

        return null;
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_ROTATE(parameters) {
        const item = parameters[0];
        if (!item || item.getItemType() !== "shape") {
            if (item && item.getItemType() == 'color') {
                return ColorItem.virt_rotate(item.getHash(), 1);
            }
            // Not a shape
            return null;
        }

        return ShapestItemDefinition.do_rotate(item.getHash(), 1);
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {[BaseItem, BaseItem]}
     */
    compute_ANALYZE(parameters) {
        const item = parameters[0];
        if (!item || item.getItemType() !== "shape") {
            // Not a shape
            return [null, null];
        }

        return ShapestItemDefinition.virt_analyze(item.getHash());
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {[BaseItem, BaseItem]}
     */
    compute_CUT(parameters) {
        const item = parameters[0];
        if (!item || item.getItemType() !== "shape") {
            // Not a shape
            return [null, null];
        }        
        return ShapestItemDefinition.do_cut2(item.getHash());
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {[BaseItem, BaseItem]}
     */
    compute_UNSTACK(parameters) {
        const item = parameters[0];
        if (!item || item.getItemType() !== "shape") {
            // Not a shape
            return [null, null];
        }

        return ShapestItemDefinition.virt_unstack_bottom(item.getHash());
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_STACKER(parameters) {
        const lowerItem = parameters[0];
        const upperItem = parameters[1];

        if (!lowerItem || !upperItem) {
            // Empty
            return null;
        }

        if (lowerItem.getItemType() == "shape") {
            if (upperItem.getItemType() == "shape") {
                return ShapestItemDefinition.do_stack(lowerItem.getHash(), upperItem.getHash());
            }
            if (upperItem.getItemType() == "color") {
                return ShapestItemDefinition.do_paint(lowerItem.getHash(), upperItem.getHash());
            }
        }
        if (lowerItem.getItemType() == "color") {
            if (upperItem.getItemType() == "shape") {
                return ShapestItemDefinition.do_paint(upperItem.getHash(), lowerItem.getHash());
            }
            if (upperItem.getItemType() == "color") {
                return ColorItem.virt_mix(lowerItem.getHash(), upperItem.getHash());
            }
        }

        return null;
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_PAINTER(parameters) {
        const shape = parameters[0];
        const color = parameters[1];

        if (!shape || !color) {
            // Empty
            return null;
        }

        if (shape.getItemType() !== "shape" || color.getItemType() !== "color") {
            // Bad type
            return null;
        }

        return ShapestItemDefinition.do_paint(shape.getHash(), color.getHash());
    }

    /**
     * @param {Array<BaseItem|null>} parameters
     * @returns {BaseItem}
     */
    compute_COMPARE(parameters) {
        const itemA = parameters[0];
        const itemB = parameters[1];

        if (!itemA || !itemB) {
            // Empty
            return null;
        }

        if (itemA.getItemType() !== itemB.getItemType()) {
            // Not the same type
            return BOOL_FALSE_SINGLETON;
        }

        switch (itemA.getItemType()) {
            case "shape": {
                return /** @type {ShapeItem} */ (itemA).definition.getHash() ===
                    /** @type {ShapeItem} */ (itemB).definition.getHash()
                    ? BOOL_TRUE_SINGLETON
                    : BOOL_FALSE_SINGLETON;
            }
            case "color": {
                return /** @type {ColorItem} */ (itemA).color === /** @type {ColorItem} */ (itemB).color
                    ? BOOL_TRUE_SINGLETON
                    : BOOL_FALSE_SINGLETON;
            }

            case "boolean": {
                return /** @type {BooleanItem} */ (itemA).value === /** @type {BooleanItem} */ (itemB).value
                    ? BOOL_TRUE_SINGLETON
                    : BOOL_FALSE_SINGLETON;
            }

            default: {
                assertAlways(false, "Bad item type: " + itemA.getItemType());
            }
        }
    }
}
