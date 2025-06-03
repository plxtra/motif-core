import {
    AssertInternalError,
    compareDate,
    ComparisonResult,
    Integer,
    isSameDay,
    MultiEvent,
    UsableListChangeTypeId
} from '@pbkware/js-utils';
import {
    assert,
    Badness,
    defined,
} from '../sys/internal-api';
import {
    DataMessage,
    TopShareholder,
    TopShareholdersDataDefinition
} from './common/internal-api';
import { DataItem } from './data-item/internal-api';
import { LowLevelTopShareholdersDataItem } from './low-level-top-shareholders-data-item';

export class TopShareholdersDataItem extends DataItem {
    private _topShareholders: TopShareholder[] = [];
    private _topShareholdersListChangeMultiEvent = new MultiEvent<TopShareholdersDataItem.ListChangeEventHandler>();

    private _dataItemA: LowLevelTopShareholdersDataItem | undefined;
    private _dataItemB: LowLevelTopShareholdersDataItem | undefined;
    private _dataItemCorrectnessChangedEventA: MultiEvent.SubscriptionId;
    private _dataItemCorrectnessChangedEventB: MultiEvent.SubscriptionId;

    get topShareholders(): TopShareholder[] {
        return this._topShareholders;
    }
    get count(): Integer {
        return this._topShareholders.length;
    }

    override processMessage(msg: DataMessage) {
        super.processMessage(msg);
    }

    subscribeListChangeEvent(
        handler: TopShareholdersDataItem.ListChangeEventHandler
    ) {
        return this._topShareholdersListChangeMultiEvent.subscribe(handler);
    }

    unsubscribeListChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._topShareholdersListChangeMultiEvent.unsubscribe(subscriptionId);
    }

    // protected processStarting() {
    //     super.processStarting();

    //     if (!this.error && this.starting) {
    //         const typedDefinition = this.definition as TopShareholdersDataDefinition;
    //         assert(assigned(typedDefinition.dataIvemId), 'ID:3031162500');
    //         assert(!assigned(this._dataItemA), 'ID:3131163418');
    //         assert(!assigned(this._dataItemB), 'ID:3231163428');

    //         const { dateA, dateB } = getDatesForQueries(typedDefinition);

    //         {
    //             const definitionA = new LowLevelTopShareholdersDataDefinition();
    //             definitionA.dataIvemId = typedDefinition.dataIvemId;
    //             definitionA.tradingDate = dateA;
    //             this._dataItemA = this.onRequireDataItem(definitionA) as LowLevelTopShareholdersDataItem;
    //             this._dataItemCorrectnessChangedEventA =
    //                 this._dataItemA.subscribeCorrectnessChangedEvent(() => this.handleLowLevelDataCorrectnessChangedEvent());
    //         }

    //         if (defined(dateB)) {
    //             const definitionB = new LowLevelTopShareholdersDataDefinition();
    //             definitionB.dataIvemId = typedDefinition.dataIvemId;
    //             definitionB.tradingDate = dateB;
    //             this._dataItemB = this.onRequireDataItem(definitionB) as LowLevelTopShareholdersDataItem;
    //             this._dataItemCorrectnessChangedEventB =
    //                 this._dataItemB.subscribeCorrectnessChangedEvent(() => this.handleLowLevelDataCorrectnessChangedEvent());
    //         }

    //         if (this.isLowLevelOk()) {
    //             this.readTopShareholderInfo();
    //         }

    //         this.processStarted();
    //     }
    // }

    protected override stop() {
        assert(this.active, 'ID:5131162510');
        this.releaseDataItems();
        super.stop();
    }

    protected calculateUsabilityBadness() {
        if (this.isLowLevelOk()) {
            return Badness.notBad;
        } else {
            return this.calculateLowLevelBadness();
        }
    }

    protected override processUsableChanged() {
        if (this.usable) {
            this.notifyListChange(UsableListChangeTypeId.PreUsableClear, 0, 0);
            if (this.count > 0) {
                this.notifyListChange(
                    UsableListChangeTypeId.PreUsableAdd,
                    0,
                    this.count
                );
            }
            this.notifyListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.notifyListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    private notifyListChange(
        listChangeTypeId: UsableListChangeTypeId,
        index: Integer,
        count: Integer
    ) {
        const handlers = this._topShareholdersListChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](listChangeTypeId, index, count);
        }
    }

    private checkUsableNotifyListChange(
        listChangeTypeId: UsableListChangeTypeId,
        index: Integer,
        count: Integer
    ) {
        if (this.usable) {
            this.notifyListChange(listChangeTypeId, index, count);
        }
    }

    private handleLowLevelDataCorrectnessChangedEvent() {
        if (this.isLowLevelOk()) {
            this.readTopShareholderInfo();
        } else {
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            if (this._dataItemA !== undefined && this._dataItemA.error) {
                this.setUnusable(this._dataItemA.badness);
                this.releaseDataItems();
            } else {
                // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                if (this._dataItemB !== undefined && this._dataItemB.error) {
                    this.setUnusable(this._dataItemB.badness);
                    this.releaseDataItems();
                }
            }
        }
    }

    private isLowLevelOk() {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        const okA = this._dataItemA !== undefined && this._dataItemA.usable;
        // DataItemB will only be assigned if we're comparing dates.
        const okB = this._dataItemB === undefined || this._dataItemB.usable;
        return okA && okB;
    }

    private calculateLowLevelBadness() {
        // Does not calculate composite which it should.  Fix if ever needed
        if (this._dataItemA !== undefined && !this._dataItemA.usable) {
            return this._dataItemA.badness;
        } else {
            if (this._dataItemB !== undefined && !this._dataItemB.usable) {
                return this._dataItemB.badness;
            } else {
                return Badness.notBad;
            }
        }
    }

    private readTopShareholderInfo(): void {
        this.beginUpdate();
        try {
            const readBadness: Badness = {
                reasonId: Badness.ReasonId.Reading,
                reasonExtra: '',
            };
            this.setUnusable(readBadness);
            this.notifyUpdateChange();
            if (this._dataItemA && this._dataItemB) {
                this._topShareholders = readTopShareholderInfo_CompareDates(
                    this._dataItemA,
                    this._dataItemB
                );
            } else if (this._dataItemA) {
                this._topShareholders = readTopShareholderInfo_SingleDate(
                    this._dataItemA
                );
            } else {
                throw new AssertInternalError('TSHDIRTSHI987221');
            }
            this.trySetUsable();
        } finally {
            this.endUpdate();
        }

        this.releaseDataItems();
    }

    private releaseDataItems(): void {
        if (this._dataItemA && defined(this._dataItemCorrectnessChangedEventA)) {
            this._dataItemA.unsubscribeCorrectnessChangedEvent(
                this._dataItemCorrectnessChangedEventA
            );
            this.onReleaseDataItem(this._dataItemA);
            this._dataItemCorrectnessChangedEventA = undefined;
            this._dataItemA = undefined;
        }

        if (this._dataItemB && defined(this._dataItemCorrectnessChangedEventB)) {
            this._dataItemB.unsubscribeCorrectnessChangedEvent(
                this._dataItemCorrectnessChangedEventB
            );
            this.onReleaseDataItem(this._dataItemB);
            this._dataItemCorrectnessChangedEventB = undefined;
            this._dataItemB = undefined;
        }
    }
}

export namespace TopShareholdersDataItem {
    export type ListChangeEventHandler = (
        listChangeType: UsableListChangeTypeId,
        index: Integer,
        count: Integer
    ) => void;
}

function getDatesForQueriesIgnored(
    definition: TopShareholdersDataDefinition
): { dateA: Date; dateB: Date | undefined } {
    const dateA = defined(definition.tradingDate)
        ? definition.tradingDate
        : new Date();

    const dateB =
        defined(definition.compareToTradingDate) &&
        !isSameDay(dateA, definition.compareToTradingDate)
            ? definition.compareToTradingDate
            : undefined;

    return defined(dateB) && compareDate(dateA, dateB) === ComparisonResult.LeftLessThanRight
        ? { dateA: dateB, dateB: dateA } // Swap dates so that dateA is always greater.
        : { dateA, dateB };
}

function readTopShareholderInfo_SingleDate(
    dataItemA: LowLevelTopShareholdersDataItem
): TopShareholder[] {
    if (!dataItemA.usable) {
        throw new AssertInternalError('TSHDIRTSHISDAS2395');
    }
    if (!defined(dataItemA.topShareholders)) {
        throw new AssertInternalError('TSHDIRTSHISDAU2324');
    }
    return dataItemA.topShareholders.map(
        (shareholder): TopShareholder => {
            const result = new TopShareholder();
            result.name = shareholder.name;
            result.designation = shareholder.designation;
            result.holderKey = shareholder.holderKey;
            result.sharesHeld = shareholder.sharesHeld;
            result.totalShareIssue = shareholder.totalShareIssue;
            result.sharesChanged = undefined;
            return result;
        }
    );
}

function readTopShareholderInfo_CompareDates(
    dataItemA: LowLevelTopShareholdersDataItem,
    dataItemB: LowLevelTopShareholdersDataItem
): TopShareholder[] {
    function getSharesChanged(
        sharesHeldA: Integer | undefined,
        sharesHeldB: Integer | undefined
    ): Integer | undefined {
        return defined(sharesHeldA) && defined(sharesHeldB)
            ? sharesHeldA - sharesHeldB
            : undefined;
    }

    if (!dataItemA.usable || !dataItemB.usable) {
        throw new AssertInternalError('TSHDIRTSHICDS3998');
    }
    if (
        !defined(dataItemA.topShareholders) ||
        !defined(dataItemB.topShareholders)
    ) {
        throw new AssertInternalError('TSHDIRTSHICDU9825');
    }

    const topShareholders = dataItemA.topShareholders.map(
        (shareholderA): TopShareholder => {
            const result = new TopShareholder();
            result.name = shareholderA.name;
            result.designation = shareholderA.designation;
            result.holderKey = shareholderA.holderKey;
            result.sharesHeld = shareholderA.sharesHeld;
            result.totalShareIssue = shareholderA.totalShareIssue;
            return result;
        }
    );

    dataItemB.topShareholders.forEach((shareholderB) => {
        const indexA = topShareholders.findIndex((shareholderA) =>
            TopShareholder.isSame(shareholderA, shareholderB)
        );
        if (indexA >= 0) {
            topShareholders[indexA].sharesChanged = getSharesChanged(
                topShareholders[indexA].sharesHeld,
                shareholderB.sharesHeld
            );
        } else {
            const shareholder = new TopShareholder();
            shareholder.name = shareholderB.name;
            shareholder.designation = shareholderB.designation;
            shareholder.sharesHeld = shareholderB.sharesHeld;
            shareholder.totalShareIssue = shareholderB.totalShareIssue;
            shareholder.sharesChanged = defined(shareholderB.sharesHeld)
                ? -shareholderB.sharesHeld
                : undefined;

            topShareholders.push(shareholder);
        }
    });

    return topShareholders;
}
