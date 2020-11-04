import { GameSystemWithFilter } from "../game_system_with_filter";
import { BeltReaderComponent } from "../components/belt_reader";
import { globalConfig } from "../../core/config";
import { BOOL_TRUE_SINGLETON, BOOL_FALSE_SINGLETON } from "../items/boolean_item";

export class BeltReaderSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [BeltReaderComponent]);
    }

    update() {
        const now = this.root.time.now();
        const minimumTime = now - globalConfig.readerAnalyzeIntervalSeconds;
        const minimumTimeForThroughput = now - 1;
        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];

            const readerComp = entity.components.BeltReader;
            const pinsComp = entity.components.WiredPins;

            // Remove outdated items
            while (readerComp.lastItemTimes[0] < minimumTime || readerComp.lastItemTimes.length > 24) {
                readerComp.lastItemTimes.shift();
            }

            pinsComp.slots[1].value = readerComp.lastItem;
            pinsComp.slots[0].value =
                (readerComp.lastItemTimes[readerComp.lastItemTimes.length - 1] || 0) >
                minimumTimeForThroughput
                    ? BOOL_TRUE_SINGLETON
                    : BOOL_FALSE_SINGLETON;

            if (now - readerComp.lastThroughputComputation > 0.5) {
                // Compute throughput
                readerComp.lastThroughputComputation = now;

                let throughput = 0;
                if (readerComp.lastItemTimes.length < 2) {
                    throughput = 0;
                } else {
                    throughput = (readerComp.lastItemTimes.length - 1) / (readerComp.lastItemTimes[readerComp.lastItemTimes.length-1] - readerComp.lastItemTimes[0]);
                }

                readerComp.lastThroughput = throughput;
            }
        }
    }
}
