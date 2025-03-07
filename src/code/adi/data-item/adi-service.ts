import { SysTick } from '@pbkware/js-utils';
import { ExerciseTimer } from '../../sys/internal-api';
import { AdiPublisher, DataDefinition } from '../common/internal-api';
import { DataItem } from './data-item';
import { DataMgr } from './data-mgr';

export class AdiService {
    private _dataMgr: DataMgr;
    private _exerciseTimer: ExerciseTimer;

    constructor(dataItemFactory: DataMgr.DataItemFactory, adiPublisherFactory: AdiPublisher.Factory) {
        this._dataMgr = new DataMgr(dataItemFactory, adiPublisherFactory);

        // Finally...
        this._exerciseTimer = new ExerciseTimer();
    }

    get dataMgr() { return this._dataMgr; }

    start() {
        this._exerciseTimer.run(() => { this.exercise(); });
    }

    stop() {
        this._exerciseTimer.stop();
    }

    pause() {
        // not supported on current exerciseTimer
    }

    continue() {
        // not supported on current exerciseTimer
    }

    subscribe(dataDefinition: DataDefinition): DataItem {
        return this._dataMgr.subscribe(dataDefinition);
    }

    unsubscribe(dataItem: DataItem): void {
        this._dataMgr.unsubscribe(dataItem);
    }

    private exercise(): void {
        const NowRec = SysTick.now();

        this._dataMgr.process(NowRec);
    }
}
