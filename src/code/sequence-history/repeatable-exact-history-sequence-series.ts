import { Integer } from '@pbkware/js-utils';
import { HistorySequenceSeries } from './history-sequence-series';
import { RepeatableExactHistorySequencer } from './repeatable-exact-history-sequencer';

export abstract class RepeatableExactHistorySequenceSeries extends HistorySequenceSeries {

    constructor(private _repeatableExactSequencer: RepeatableExactHistorySequencer) {
        super(_repeatableExactSequencer);
    }

    get repeatableExactSequencer() { return this._repeatableExactSequencer; }
    get sequencerPoints() { return this._repeatableExactSequencer.pointList; }

    getSequencerPoint(idx: Integer) { return this.sequencerPoints.getAt(idx); }
}

export namespace RepeatableExactHistorySequenceSeries {
    export interface Point extends HistorySequenceSeries.Point {
    }
}
