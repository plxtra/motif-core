import { DataIvemIdPriceVolumeSequenceHistoryModule } from './data-ivem-id-price-volume-sequence-history';
import { HistorySequencerModule } from './history-sequencer';
import { IntervalHistorySequencerModule } from './interval-history-sequencer';

/** @internal */
export namespace SequenceHistoryStaticInitialise {
    export function initialise() {
        HistorySequencerModule.initialiseStatic();
        IntervalHistorySequencerModule.initialiseStatic();
        DataIvemIdPriceVolumeSequenceHistoryModule.initialiseStatic();
    }
}
