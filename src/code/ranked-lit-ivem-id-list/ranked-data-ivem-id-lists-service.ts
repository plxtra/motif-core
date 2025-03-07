import { MultiEvent } from '@pbkware/js-utils';
import { ScanList, ScansService } from '../scan/internal-api';

export class RankedDataIvemIdListsService /* extends LockOpenList<RankedDataIvemIdList>*/ {
    private readonly _scanList: ScanList;
    private _scanListBadnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _scanListCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _scanListListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _scansService: ScansService) {
        this._scanList = this._scansService.scanList;

        this._scanListBadnessChangedSubscriptionId = this._scanList.subscribeBadnessChangedEvent(() => { this.processScanListBadnessChangedEvent(); });
        this._scanListCorrectnessChangedSubscriptionId = this._scanList.subscribeCorrectnessChangedEvent(() => { this.processScanListCorrectnessChangedEvent(); });
        this._scanListListChangeSubscriptionId = this._scanList.subscribeListChangeEvent(() => { this.processScanListListChangedEvent(); });

        if (!this._scanList.usable) {
            const scanCount = this._scanList.count;
            // const maxItemCount = scanCount;
            // const addItems = new Array<ScanMatchesRankedDataIvemIdListImplementation>(maxItemCount);
            // let itemCount = 0;

            for (let i = 0; i < scanCount; i++) {
                const scan = this._scanList.getAt(i);
                if (scan.symbolListEnabled) {
                    // const matchesDataIvemIdList = new ScanMatchesRankedDataIvemIdList(scan.mapKey);
                    // addItems[itemCount++] = matchesDataIvemIdList;
                }
            }

            // this.addItems(addItems, itemCount);
        }
    }

    finalise() {
        this._scanList.unsubscribeBadnessChangedEvent(this._scanListBadnessChangedSubscriptionId);
        this._scanListBadnessChangedSubscriptionId = undefined;
        this._scanList.unsubscribeCorrectnessChangedEvent(this._scanListCorrectnessChangedSubscriptionId);
        this._scanListCorrectnessChangedSubscriptionId = undefined;
        this._scanList.unsubscribeListChangeEvent(this._scanListListChangeSubscriptionId);
        this._scanListListChangeSubscriptionId = undefined;
    }

    private processScanListBadnessChangedEvent() {
        //
    }

    private processScanListCorrectnessChangedEvent() {
        //
    }

    private processScanListListChangedEvent() {
        //
    }
}
