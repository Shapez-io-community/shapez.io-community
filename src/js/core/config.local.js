export default {
    // You can set any default debug options here!
    // -----------------------------------------------------------------------------------
    _sandboxMode: "Sandbox mode",
    sandboxMode: false,
    // -----------------------------------------------------------------------------------
    _fastGameEnter: "Quickly enters the game and skips the main menu - good for fast iterating",
    fastGameEnter: false,
    // -----------------------------------------------------------------------------------
    _resumeGameOnFastEnter:
        "When using fastGameEnter, controls whether a new game is started or the last one is resumed",
    resumeGameOnFastEnter: false,
    // -----------------------------------------------------------------------------------
    _disableUnlockDialog: "Disables the dialog when completing a level",
    disableUnlockDialog: false,
    // -----------------------------------------------------------------------------------
    _allBuildingsUnlocked: "Unlocks all buildings",
    allBuildingsUnlocked: false,
    // -----------------------------------------------------------------------------------
    _blueprintsNoCost: "Disables cost of blueprints",
    blueprintsNoCost: false,
    // -----------------------------------------------------------------------------------
    _upgradesNoCost: "Disables cost of upgrades",
    upgradesNoCost: false,
    // -----------------------------------------------------------------------------------
    _debugKeybindings: "Enable debug keybindings: b to levelup and i to reset zoom",
    debugKeybindings: false,
    // -----------------------------------------------------------------------------------
    _noArtificialDelays: "Skips any delays like transitions between states and such",
    noArtificialDelays: false,
    // -----------------------------------------------------------------------------------
    _disableSavegameWrite:
        "Disables writing of savegames, useful for testing the same savegame over and over",
    disableSavegameWrite: false,
    // -----------------------------------------------------------------------------------
    _showEntityBounds: "Shows bounds of all entities",
    showEntityBounds: false,
    // -----------------------------------------------------------------------------------
    _showAcceptorEjectors: "Shows arrows for every ejector / acceptor",
    showAcceptorEjectors: false,
    // -----------------------------------------------------------------------------------
    _disableMusic: "Disables the music (Overrides any setting, can cause weird behaviour)",
    disableMusic: false,
    // -----------------------------------------------------------------------------------
    _doNotRenderStatics: "Do not render static map entities (=most buildings)",
    doNotRenderStatics: false,
    // -----------------------------------------------------------------------------------
    _disableZoomLimits: "Allow to zoom freely without limits",
    disableZoomLimits: false,
    // -----------------------------------------------------------------------------------
    _rewardsInstant: "All rewards can be unlocked by passing just 1 of any shape",
    rewardsInstant: false,
    // -----------------------------------------------------------------------------------
    _disableLogicTicks: "Disables the simulation - This effectively pauses the game.",
    disableLogicTicks: false,
    // -----------------------------------------------------------------------------------
    _testClipping: "Test the rendering if everything is clipped out properly",
    testClipping: false,
    // -----------------------------------------------------------------------------------
    // Allows to render slower, useful for recording at half speed to avoid stuttering
    // framePausesBetweenTicks: 250,
    // -----------------------------------------------------------------------------------
    _testTranslations: "Replace all translations with emojis to see which texts are translateable",
    testTranslations: false,
    // -----------------------------------------------------------------------------------
    _enableEntityInspector: "Enables an inspector which shows information about the entity below the curosr",
    enableEntityInspector: false,
    // -----------------------------------------------------------------------------------
    _testAds: "Enables ads in the local build (normally they are deactivated there)",
    testAds: false,
    // -----------------------------------------------------------------------------------
    _disableMapOverview: "Disables the automatic switch to an overview when zooming out",
    disableMapOverview: false,
    // -----------------------------------------------------------------------------------
    _disableUpgradeNotification:
        "Disables the notification when there are new entries in the changelog since last played",
    disableUpgradeNotification: false,
    // -----------------------------------------------------------------------------------
    _instantBelts: "Makes belts almost infinitely fast",
    instantBelts: false,
    // -----------------------------------------------------------------------------------
    _instantProcessors: "Makes item processors almost infinitely fast",
    instantProcessors: false,
    // -----------------------------------------------------------------------------------
    _instantMiners: "Makes miners almost infinitely fast",
    instantMiners: false,
    // -----------------------------------------------------------------------------------
    _renderForTrailer: "Special option used to render the trailer",
    renderForTrailer: false,
    // -----------------------------------------------------------------------------------
    _renderChanges: "Whether to render changes",
    renderChanges: false,
    // -----------------------------------------------------------------------------------
    _renderBeltPaths: "Whether to render belt paths",
    renderBeltPaths: false,
    // -----------------------------------------------------------------------------------
    _checkBeltPaths: "Whether to check belt paths",
    checkBeltPaths: false,
    // -----------------------------------------------------------------------------------
    _detailedStatistics: "Whether to items / s instead of items / m in stats",
    detailedStatistics: false,
    // -----------------------------------------------------------------------------------
    _showAtlasInfo: "Shows detailed information about which atlas is used",
    showAtlasInfo: false,
    // -----------------------------------------------------------------------------------
    _renderWireRotations: "Renders the rotation of all wires",
    renderWireRotations: false,
    // -----------------------------------------------------------------------------------
    _renderWireNetworkInfos: "Renders information about wire networks",
    renderWireNetworkInfos: false,
    // -----------------------------------------------------------------------------------
    _disableEjectorProcessing: "Disables ejector animations and processing",
    disableEjectorProcessing: false,
    // -----------------------------------------------------------------------------------
    _manualTickOnly: "Allows manual ticking",
    manualTickOnly: false,
    // -----------------------------------------------------------------------------------
    _enableSlowAsserts: "Enables slow asserts, useful for debugging performance",
    enableSlowAsserts: false,
    // -----------------------------------------------------------------------------------
};
