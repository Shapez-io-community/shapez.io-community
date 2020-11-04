import { findNiceIntegerValue } from "../../core/utils";
import { GameMode } from "../game_mode";
import { ShapeDefinition } from "../shape_definition";
import { enumHubGoalRewards } from "../tutorial_goals";

const rocketShape = "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw";
const finalGameShape = "RuCw--Cw:----Ru--";
const preparementShape = "CpRpCp--:SwSwSwSw";
const blueprintShape = "CbCbCbRb:CwCwCwCw";

export const namedShapes = {
    circle: "CuCuCuCu",
    circleHalf: "----CuCu",
    rect: "RuRuRuRu",
    rectHalf: "RuRu----",
    circleHalfRotated: "Cu----Cu",
    circleQuad: "Cu------",
    circleRed: "CrCrCrCr",
    rectHalfBlue: "RbRb----",
    circlePurple: "CpCpCpCp",
    starCyan: "ScScScSc",
    fish: "CgScScCg",
    blueprint: "CbCbCbRb:CwCwCwCw",
    rectCircle: "RpRpRpRp:CwCwCwCw",
    watermelon: "--Cg----:--Cr----",
    starCircle: "SrSrSrSr:CyCyCyCy",
    starCircleStar: "SrSrSrSr:CyCyCyCy:SwSwSwSw",
    fan: "CbRbRbCb:CwCwCwCw:WbWbWbWb",
    monster: "Sg----Sg:CgCgCgCg:--CyCy--",
    bouquet: "CpRpCp--:SwSwSwSw",
    logo: "RuCw--Cw:----Ru--",
    target: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr",
    speedometer: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy",
    spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy:SyCcSyCc",
    compass: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy",
    plant: "Rg--Rg--:CwRwCwRw:--Rg--Rg",
    rocket: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw",

    mill: "CwCwCwCw:WbWbWbWb",
    star: "SuSuSuSu",
    circleStar: "CwCrCwCr:SgSgSgSg",
    clown: "WrRgWrRg:CwCrCwCr:SgSgSgSg",
    windmillRed: "WrWrWrWr",
    fanTriple: "WpWpWpWp:CwCwCwCw:WpWpWpWp",
    fanQuadruple: "WpWpWpWp:CwCwCwCw:WpWpWpWp:CwCwCwCw",
}

// Tiers need % of the previous tier as requirement too
const tierGrowth = 2.5;

/**
 * Generates all upgrades
 * @returns {Object<string, import("../game_mode").UpgradeTiers>} */
function generateUpgrades(limitedVersion = false) {
    const fixedImprovements = [0.5, 0.5, 1, 1, 2, 1, 1];
    const numEndgameUpgrades = limitedVersion ? 0 : 1000 - fixedImprovements.length - 1;

    function generateInfiniteUnlocks() {
        return new Array(numEndgameUpgrades).fill(null).map((_, i) => ({
            required: [
                { shape: namedShapes.bouquet, amount: 30000 + i * 10000 },
                { shape: namedShapes.logo, amount: 20000 + i * 5000 },
                { shape: namedShapes.rocket, amount: 20000 + i * 5000 },
            ],
            excludePrevious: true,
        }));
    }

    // Fill in endgame upgrades
    for (let i = 0; i < numEndgameUpgrades; ++i) {
        if (i < 20) {
            fixedImprovements.push(0.1);
        } else if (i < 50) {
            fixedImprovements.push(0.05);
        } else if (i < 100) {
            fixedImprovements.push(0.025);
        } else {
            fixedImprovements.push(0.0125);
        }
    }

    const upgrades = {
        belt: [
            {
                required: [{ shape: namedShapes.circle, amount: 30 }],
            },
            {
                required: [{ shape: namedShapes.circleHalfRotated, amount: 500 }],
            },
            {
                required: [{ shape: namedShapes.circlePurple, amount: 1000 }],
            },
            {
                required: [{ shape: namedShapes.starCircle, amount: 6000 }],
            },
            {
                required: [{ shape: namedShapes.starCircleStar, amount: 25000 }],
            },
            {
                required: [{ shape: namedShapes.bouquet, amount: 25000 }],
                excludePrevious: true,
            },
            {
                required: [
                    { shape: namedShapes.bouquet, amount: 25000 },
                    { shape: namedShapes.logo, amount: 50000 },
                ],
                excludePrevious: true,
            },
            ...generateInfiniteUnlocks(),
        ],

        miner: [
            {
                required: [{ shape: namedShapes.rect, amount: 300 }],
            },
            {
                required: [{ shape: namedShapes.circleQuad, amount: 800 }],
            },
            {
                required: [{ shape: namedShapes.starCyan, amount: 3500 }],
            },
            {
                required: [{ shape: namedShapes.mill, amount: 23000 }],
            },
            {
                required: [{ shape: namedShapes.fan, amount: 50000 }],
            },
            {
                required: [{ shape: namedShapes.bouquet, amount: 25000 }],
                excludePrevious: true,
            },
            {
                required: [
                    { shape: namedShapes.bouquet, amount: 25000 },
                    { shape: namedShapes.logo, amount: 50000 },
                ],
                excludePrevious: true,
            },
            ...generateInfiniteUnlocks(),
        ],

        processors: [
            {
                required: [{ shape: namedShapes.star, amount: 500 }],
            },
            {
                required: [{ shape: namedShapes.rectHalf, amount: 600 }],
            },
            {
                required: [{ shape: namedShapes.fish, amount: 3500 }],
            },
            {
                required: [{ shape: namedShapes.circleStar, amount: 25000 }],
            },
            {
                required: [{ shape: namedShapes.clown, amount: 50000 }],
            },
            {
                required: [{ shape: namedShapes.bouquet, amount: 25000 }],
                excludePrevious: true,
            },
            {
                required: [
                    { shape: namedShapes.bouquet, amount: 25000 },
                    { shape: namedShapes.logo, amount: 50000 },
                ],
                excludePrevious: true,
            },
            ...generateInfiniteUnlocks(),
        ],

        painting: [
            {
                required: [{ shape: namedShapes.rectHalfBlue, amount: 600 }],
            },
            {
                required: [{ shape: namedShapes.windmillRed, amount: 3800 }],
            },
            {
                required: [{ shape: namedShapes.rectCircle, amount: 6500 }],
            },
            {
                required: [{ shape: namedShapes.fanTriple, amount: 25000 }],
            },
            {
                required: [{ shape: namedShapes.fanQuadruple, amount: 50000 }],
            },
            {
                required: [{ shape: namedShapes.bouquet, amount: 25000 }],
                excludePrevious: true,
            },
            {
                required: [
                    { shape: namedShapes.bouquet, amount: 25000 },
                    { shape: namedShapes.logo, amount: 50000 },
                ],
                excludePrevious: true,
            },
            ...generateInfiniteUnlocks(),
        ],
    };

    // Automatically generate tier levels
    for (const upgradeId in upgrades) {
        const upgradeTiers = upgrades[upgradeId];

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
        for (const upgradeId in upgrades) {
            upgrades[upgradeId].forEach(tier => {
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

    return upgrades;
}

/**
 * Generates the level definitions
 * @param {boolean} limitedVersion
 */
export function generateLevelDefinitions(limitedVersion = false) {
    const levelDefinitions = [
        // 1: Circle
        {
            shape: namedShapes.circle, // belts t1
            required: 30,
            reward: enumHubGoalRewards.reward_cutter_and_trash,
        },
        // 2: Cutter
        {
            shape: namedShapes.circleHalf, //
            required: 40,
            reward: enumHubGoalRewards.no_reward,
        },
        // 3: Rectangle
        {
            shape: namedShapes.rect, // miners t1
            required: 70,
            reward: enumHubGoalRewards.reward_balancer,
        },
        // 4
        {
            shape: namedShapes.rectHalf, // processors t2
            required: 70,
            reward: enumHubGoalRewards.reward_rotater,
        },
        // 5: Rotater
        {
            shape: namedShapes.circleHalfRotated, // belts t2
            required: 170,
            reward: enumHubGoalRewards.reward_tunnel,
        },
        // 6
        {
            shape: namedShapes.circleQuad, // miners t2
            required: 270,
            reward: enumHubGoalRewards.reward_painter,
        },
        // 7: Painter
        {
            shape: namedShapes.circleRed, // unused
            required: 300,
            reward: enumHubGoalRewards.reward_rotater_ccw,
        },
        // 8:
        {
            shape: namedShapes.rectHalfBlue, // painter t2
            required: 480,
            reward: enumHubGoalRewards.reward_mixer,
        },
        // 9: Mixing (purple)
        {
            shape: namedShapes.circlePurple, // belts t3
            required: 600,
            reward: enumHubGoalRewards.reward_merger,
        },
        // 10: STACKER: Star shape + cyan
        {
            shape: namedShapes.starCyan, // miners t3
            required: 800,
            reward: enumHubGoalRewards.reward_stacker,
        },
        // 11: Chainable miner
        {
            shape: namedShapes.fish, // processors t3
            required: 1000,
            reward: enumHubGoalRewards.reward_miner_chainable,
        },
        // 12: Blueprints
        {
            shape: namedShapes.blueprint,
            required: 1000,
            reward: enumHubGoalRewards.reward_blueprints,
        },
        // 13: Tunnel Tier 2
        {
            shape: namedShapes.rectCircle, // painting t3
            required: 3800,
            reward: enumHubGoalRewards.reward_underground_belt_tier_2,
        },
        // 14: Belt reader
        {
            shape: namedShapes.watermelon, // unused
            required: 8, // Per second!
            reward: enumHubGoalRewards.reward_belt_reader,
            throughputOnly: true,
        },
        // 15: Storage
        {
            shape: namedShapes.starCircle, // unused
            required: 10000,
            reward: enumHubGoalRewards.reward_storage,
        },
        // 16: Quad Cutter
        {
            shape: namedShapes.starCircleStar, // belts t4 (two variants)
            required: 6000,
            reward: enumHubGoalRewards.reward_cutter_quad,
        },
        // 17: Double painter
        {
            shape: namedShapes.fan, // miner t4 (two variants)
            required: 20000,
            reward: enumHubGoalRewards.reward_painter_double,
        },
        // 18: Rotater (180deg)
        {
            shape: namedShapes.monster, // unused
            required: 20000,
            reward: enumHubGoalRewards.reward_rotater_180,
        },
        // 19: Compact splitter
        {
            shape: namedShapes.bouquet,
            required: 25000,
            reward: enumHubGoalRewards.reward_splitter,
        },
        // 20: WIRES
        {
            shape: namedShapes.logo,
            required: 25000,
            reward: enumHubGoalRewards.reward_wires_painter_and_levers,
        },
        // 21: Filter
        {
            shape: namedShapes.target,
            required: 25000,
            reward: enumHubGoalRewards.reward_filter,
        },
        // 22: Constant signal
        {
            shape: namedShapes.speedometer,
            required: 25000,
            reward: enumHubGoalRewards.reward_constant_signal,
        },
        // 23: Display
        {
            shape: namedShapes.spikedBall,
            required: 25000,
            reward: enumHubGoalRewards.reward_display,
        },
        // 24: Logic gates
        {
            shape: namedShapes.compass,
            required: 25000,
            reward: enumHubGoalRewards.reward_logic_gates,
        },
        // 25: Virtual Processing
        {
            shape: namedShapes.plant,
            required: 25000,
            reward: enumHubGoalRewards.reward_virtual_processing,
        },
        // 26: Freeplay
        {
            shape: namedShapes.rocket,
            required: 50000,
            reward: enumHubGoalRewards.reward_freeplay,
        },
    ];

    if (G_IS_DEV) {
        levelDefinitions.forEach(({ shape }) => {
            try {
                ShapeDefinition.fromShortKey(shape);
            } catch (ex) {
                throw new Error("Invalid tutorial goal: '" + ex + "' for shape" + shape);
            }
        });
    }

    return levelDefinitions;
}

const fullVersionUpgrades = generateUpgrades(false);

const fullVersionLevels = generateLevelDefinitions(false);

export class RegularModifiedGameMode extends GameMode {
    constructor(root) {
        super(root);
    }

    getUpgrades() {
        return fullVersionUpgrades;
    }

    getIsFreeplayAvailable() {
        return true;
    }

    getBlueprintShapeKey() {
        return blueprintShape;
    }

    getLevelDefinitions() {
        return fullVersionLevels;
    }
}
