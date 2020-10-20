import { IS_DEMO } from "../core/config";
import { findNiceIntegerValue } from "../core/utils";
import { ShapeDefinition } from "./shape_definition";

export const preparementShape = "C(640000)C(640000)C(640000)C(640000)";
export const finalGameShape = "C(640000)C(640000)C(640000)C(640000)";
export const rocketShape = "C(640000)C(640000)C(640000)C(640000)";
export const blueprintShape = "C(640000)C(640000)C(640000)C(640000)";

const fixedImprovements = [];

for (let i = 0; i < 6; i++) {
    fixedImprovements.push(0.25);
}

for (let i = 0; i < 1; i++) {
    fixedImprovements.push(0.5);
}

const numEndgameUpgrades = !IS_DEMO ? 20 - fixedImprovements.length - 1 : 0;

function generateEndgameUpgrades() {
    return new Array(numEndgameUpgrades).fill(null).map((_, i) => ({
        required: [
            { shape: preparementShape, amount: 30000 + i * 10000 },
            { shape: finalGameShape, amount: 20000 + i * 5000 },
            { shape: rocketShape, amount: 20000 + i * 5000 },
        ],
        excludePrevious: true,
    }));
}

if (numEndgameUpgrades != 0) {
    for (let i = 0; i < 8; i++) {
        fixedImprovements.push(0.5);
    }

    for (let i = 0; i < 4; i++) {
        fixedImprovements.push(0.75);
    }
}

/** @typedef {{
 *   shape: string,
 *   amount: number
 * }} UpgradeRequirement */

/** @typedef {{
 *   required: Array<UpgradeRequirement>
 *   improvement?: number,
 *   excludePrevious?: boolean
 * }} TierRequirement */

/** @typedef {Array<TierRequirement>} UpgradeTiers */

/** @type {Object<string, UpgradeTiers>} */
export const UPGRADES = {
    belt: [
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 60 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 500 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 1000 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 6000 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 25000 }],
        },
        {
            required: [{ shape: preparementShape, amount: 25000 }],
            excludePrevious: true,
        },
        {
            required: [
                { shape: preparementShape, amount: 25000 },
                { shape: finalGameShape, amount: 50000 },
            ],
            excludePrevious: true,
        },
        ...generateEndgameUpgrades(),
    ],

    miner: [
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 300 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 800 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 3500 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 23000 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 50000 }],
        },
        {
            required: [{ shape: preparementShape, amount: 25000 }],
            excludePrevious: true,
        },
        {
            required: [
                { shape: preparementShape, amount: 25000 },
                { shape: finalGameShape, amount: 50000 },
            ],
            excludePrevious: true,
        },
        ...generateEndgameUpgrades(),
    ],

    processors: [
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 500 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 600 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 3500 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 25000 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 50000 }],
        },
        {
            required: [{ shape: preparementShape, amount: 25000 }],
            excludePrevious: true,
        },
        {
            required: [
                { shape: preparementShape, amount: 25000 },
                { shape: finalGameShape, amount: 50000 },
            ],
            excludePrevious: true,
        },
        ...generateEndgameUpgrades(),
    ],

    painting: [
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 600 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 3800 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 6500 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 25000 }],
        },
        {
            required: [{ shape: "C(640000)C(640000)C(640000)C(640000)", amount: 50000 }],
        },
        {
            required: [{ shape: preparementShape, amount: 25000 }],
            excludePrevious: true,
        },
        {
            required: [
                { shape: preparementShape, amount: 25000 },
                { shape: finalGameShape, amount: 50000 },
            ],
            excludePrevious: true,
        },
        ...generateEndgameUpgrades(),
    ],
};

// Tiers need % of the previous tier as requirement too
const tierGrowth = 2.5;

// Automatically generate tier levels
for (const upgradeId in UPGRADES) {
    const upgradeTiers = UPGRADES[upgradeId];

    let currentTierRequirements = [];
    for (let i = 0; i < upgradeTiers.length; ++i) {
        const tierHandle = upgradeTiers[i];
        tierHandle.improvement = fixedImprovements[i];
        const originalRequired = tierHandle.required.slice();

        for (let k = currentTierRequirements.length - 1; k >= 0; --k) {
            const oldTierRequirement = currentTierRequirements[k];
            if (!tierHandle.excludePrevious) {
                tierHandle.required.unshift({
                    shape: oldTierRequirement.shape,
                    amount: oldTierRequirement.amount,
                });
            }
        }
        currentTierRequirements.push(
            ...originalRequired.map(req => ({
                amount: req.amount,
                shape: req.shape,
            }))
        );
        currentTierRequirements.forEach(tier => {
            tier.amount = findNiceIntegerValue(tier.amount * tierGrowth);
        });
    }
}

// VALIDATE
if (G_IS_DEV) {
    for (const upgradeId in UPGRADES) {
        UPGRADES[upgradeId].forEach(tier => {
            tier.required.forEach(({ shape }) => {
                try {
                    ShapeDefinition.fromShortKey(shape);
                } catch (ex) {
                    throw new Error("Invalid upgrade goal: '" + ex + "' for shape" + shape);
                }
            });
        });
    }
}
