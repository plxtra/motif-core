import { Integer } from '@pbkware/js-utils';
import { HistorySequenceSeries } from './history-sequence-series';
import { HistorySequencer } from './history-sequencer';

export interface OhlcHistorySequenceSeriesInterface extends HistorySequenceSeries {
    getSequencerPoint(idx: Integer): HistorySequencer.Point;
    getOhlcPoint(idx: Integer): OhlcHistorySequenceSeriesInterface.Point;
}

export namespace OhlcHistorySequenceSeriesInterface {
    export interface Point extends HistorySequenceSeries.Point {
        open: number;
        high: number;
        low: number;
        close: number;
    }
}
