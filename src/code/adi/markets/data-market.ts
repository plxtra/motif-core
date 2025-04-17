import {
    AssertInternalError, ChangeSubscribableComparableList, CommaText, EnumInfoOutOfOrderError,
    Integer,
    isUndefinableArrayEqualUniquely,
    MultiEvent, RecordList, SourceTzOffsetDate,
    SourceTzOffsetDateTime, UsableListChangeTypeId
} from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/internal-api';
import {
    Correctness,
    CorrectnessId,
    FieldDataTypeId,
    KeyedCorrectnessListItem,
} from "../../sys/internal-api";
import {
    FeedClassId,
    FeedStatusId,
    MarketsDataMessage,
    TradingState,
    TradingStates,
    TradingStatesDataDefinition,
    ZenithEnvironmentedValueParts,
    ZenithMarketBoard,
    ZenithMarketBoards
} from '../common/internal-api';
import { AdiService } from '../data-item/adi-service';
// eslint-disable-next-line import/no-cycle
import { Exchange } from './exchange';
// eslint-disable-next-line import/no-cycle
import { ExchangeEnvironment } from './exchange-environment';
import { MarketsConfig } from './markets-config';
// eslint-disable-next-line import/no-cycle
import { Market } from './market';
// eslint-disable-next-line import/no-cycle
import { MarketBoard } from './market-board';
import { TradingStatesDataItem } from './trading-states-data-item';
// eslint-disable-next-line import/no-cycle
import { TradingMarket } from './trading-market';
import { ZenithDataMarket } from './zenith-data-market';

export class DataMarket extends Market implements KeyedCorrectnessListItem {
    readonly marketBoards = new DataMarket.MarketBoards();

    marketBoardListChangeForMarketServiceEventer: DataMarket.MarketBoardListChangeEventer | undefined;

    private _feedStatusId: FeedStatusId;
    private _tradingDate: SourceTzOffsetDate | undefined;
    private _marketTime: SourceTzOffsetDateTime | undefined;

    private _status: string | undefined;
    private _allowIds: TradingState.AllowIds | undefined;
    private _reasonId: TradingState.ReasonId | undefined;

    // Correctness is not fully implemented - might be now
    private _usable = false;
    private _correctnessId: CorrectnessId;

    private _bestTradingMarket: TradingMarket | undefined;
    private _bestLitForTradingMarkets: readonly TradingMarket[];

    private readonly _changeEvent = new MultiEvent<DataMarket.FieldValuesChangedEvent>();
    private readonly _feedStatusChangeEvent = new MultiEvent<DataMarket.FeedStatusChangeEvent>();
    private readonly _correctnessChangedEvent = new MultiEvent<DataMarket.CorrectnessChangedEventHandler>();

    private _tradingStatesDataItem: TradingStatesDataItem | undefined;
    private _tradingStatesDataItemCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _tradingStates: TradingStates = [];

    private _marketBoardsListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _adiService: AdiService,
        zenithCode: string,
        name: string,
        display: string,
        exchange: Exchange,
        exchangeEnvironment: ExchangeEnvironment,
        readonly _marketBoardConfigs: readonly MarketsConfig.Exchange.DataMarket.Board[],
        lit: boolean,
        displayPriority: number | undefined,
        unknown: boolean,
        private readonly _zenithDataMarket: ZenithDataMarket,

        private _listCorrectnessId: CorrectnessId,
    ) {
        super(Market.TypeId.Data, zenithCode, name, display, exchange, exchangeEnvironment, lit, displayPriority, unknown);

        this._feedStatusId = _zenithDataMarket.feedStatusId;
        this._tradingDate = _zenithDataMarket.tradingDate;
        this._marketTime = _zenithDataMarket.marketTime;
        this.setStatus(_zenithDataMarket.status);

        this._zenithDataMarket.changedEventerForDataMarket = () => this.change(this._zenithDataMarket);

        this.updateMarketBoards(_zenithDataMarket.zenithMarketBoards);

        this._marketBoardsListChangeSubscriptionId = this.subscribeMarketBoardListChange(
            (listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) => {
                if (this.marketBoardListChangeForMarketServiceEventer !== undefined) {
                    this.marketBoardListChangeForMarketServiceEventer(listChangeTypeId, idx, count);
                }
            }
        );

        if (unknown) {
            this.updateCorrectness();
        } else {
            const tradingStatesDefinition = new TradingStatesDataDefinition();
            tradingStatesDefinition.feedClassId = FeedClassId.Market;
            tradingStatesDefinition.marketZenithCode = zenithCode;
            const tradingStatesDataItem = this._adiService.subscribe(tradingStatesDefinition) as TradingStatesDataItem;
            this._tradingStatesDataItem = tradingStatesDataItem;

            if (this._tradingStatesDataItem.completed) {
                // Query so this should never occur
                this.processTradingStatesDataItemCompleted();
            } else {
                this._tradingStatesDataItemCorrectnessChangedSubscriptionId = this._tradingStatesDataItem.subscribeCorrectnessChangedEvent(
                    () => this.handleTradingStatesDataItemCorrectnessChangedEvent()
                );
                this.updateCorrectness();
            }
        }

        exchangeEnvironment.addDataMarket(this);
        exchange.addDataMarket(this);
    }

    get feedStatusId(): FeedStatusId { return this._feedStatusId; }
    get tradingDate(): SourceTzOffsetDate | undefined { return this._tradingDate; }
    get marketTime(): SourceTzOffsetDateTime | undefined { return this._marketTime; }
    get status(): string | undefined { return this._status; }
    get allowIds(): TradingState.AllowIds | undefined { return this._allowIds; }
    get reasonId(): TradingState.ReasonId | undefined { return this._reasonId; }

    get usable() { return this._usable; }
    get correctnessId(): CorrectnessId { return this._correctnessId; }
    get tradingStates(): TradingStates { return this._tradingStates; }
    get bestTradingMarket(): TradingMarket | undefined { return this._bestTradingMarket; }
    get bestLitForTradingMarkets(): readonly TradingMarket[] { return this._bestLitForTradingMarkets; }

    override destroy() {
        if (!this.destroyed) {
            this._zenithDataMarket.changedEventerForDataMarket = undefined;
            this.marketBoards.unsubscribeListChangeEvent(this._marketBoardsListChangeSubscriptionId);
            this._marketBoardsListChangeSubscriptionId = undefined;
            this.marketBoards.destroy();
            this.checkDisposeTradingStatesDataItem();

            super.destroy();
        }
    }

    setListCorrectness(value: CorrectnessId) {
        this._listCorrectnessId = value;
        if (Correctness.idIsUnusable(value)) {
            this.setFeedStatusId(FeedStatusId.Impaired);
        }
        this.updateCorrectness();
    }

    setBestTradingMarkets(bestTradingMarket: TradingMarket | undefined, bestLitFor: readonly TradingMarket[]) {
        this._bestTradingMarket = bestTradingMarket;
        this._bestLitForTradingMarkets = bestLitFor;
    }

    // createKey(): Market.Key {
    //     return new Market.Key(this.zenithCode);
    // }

    // matchesKey(key: Market.Key): boolean {
    //     return key.mapKey === this.mapKey;
    // }

    // generateMapKey(): MapKey {
    //     return Market.Key.generateMapKey(this.zenithCode);
    // }

    change(msgMarket: MarketsDataMessage.Market) {
        // eslint-disable-next-line max-len
        const changedFieldIds = new Array<DataMarket.FieldId>(DataMarket.Field.idCount - DataMarket.Field.readonlyCount); // won't include fields that do not change
        let changedCount = 0;
        const feedStatusChanged = msgMarket.feedStatusId !== this.feedStatusId;
        if (feedStatusChanged) {
            this._feedStatusId = msgMarket.feedStatusId;
            changedFieldIds[changedCount++] = DataMarket.FieldId.FeedStatusId;
        }
        if (!SourceTzOffsetDate.isUndefinableEqual(msgMarket.tradingDate, this.tradingDate)) {
            this._tradingDate = msgMarket.tradingDate;
            changedFieldIds[changedCount++] = DataMarket.FieldId.TradingDate;
        }
        if (!SourceTzOffsetDateTime.isUndefinableEqual(msgMarket.marketTime, this.marketTime)) {
            this._marketTime = msgMarket.marketTime;
            changedFieldIds[changedCount++] = DataMarket.FieldId.MarketTime;
        }

        if (msgMarket.status !== this.status) {
            const setStatusChangedFieldIds = this.setStatus(msgMarket.status);
            changedFieldIds[changedCount++] = DataMarket.FieldId.Status;
            for (let i = 0; i < setStatusChangedFieldIds.length; i++) {
                changedFieldIds[changedCount++] = setStatusChangedFieldIds[i];
            }
        }

        if (this.updateMarketBoards(msgMarket.zenithMarketBoards)) {
            changedFieldIds[changedCount++] = DataMarket.FieldId.MarketBoards;
        }

        if (changedCount >= 0) {
            if (feedStatusChanged) {
                this.notifyFeedStatusChange();
            }

            changedFieldIds.length = changedCount;
            this.notifyChange(changedFieldIds);
        }
    }

    // setUnknown() {
    //     // eslint-disable-next-line max-len
    //     const changedFieldIds = new Array<Market.FieldId>(Market.Field.count - Market.Field.readonlyCount); // won't include fields in key
    //     let changedCount = 0;
    //     const feedStatusChanged = this.feedStatusId !== undefined;
    //     if (feedStatusChanged) {
    //         this._feedStatusId = FeedStatusId.Inactive;
    //         changedFieldIds[changedCount++] = Market.FieldId.FeedStatusId;
    //     }
    //     if (this.tradingDate !== undefined) {
    //         this._tradingDate = undefined;
    //         changedFieldIds[changedCount++] = Market.FieldId.TradingDate;
    //     }
    //     if (this.marketTime !== undefined) {
    //         this._marketTime = undefined;
    //         changedFieldIds[changedCount++] = Market.FieldId.MarketTime;
    //     }
    //     if (this.status !== undefined) {
    //         const setStatusChangedFieldIds = this.setStatus(undefined);
    //         changedFieldIds[changedCount++] = Market.FieldId.Status;
    //         for (let i = 0; i < setStatusChangedFieldIds.length; i++) {
    //             changedFieldIds[changedCount++] = setStatusChangedFieldIds[i];
    //         }
    //     }
    //     if (this._marketBoards !== undefined) {
    //         this._marketBoards = undefined;
    //         changedFieldIds[changedCount++] = Market.FieldId.TradingMarkets;
    //     }

    //     if (changedCount >= 0) {
    //         if (feedStatusChanged) {
    //             this.notifyFeedStatusChange();
    //         }

    //         changedFieldIds.length = changedCount;
    //         this.notifyChange(changedFieldIds);
    //     }
    // }

    subscribeFieldValuesChangedEvent(handler: DataMarket.FieldValuesChangedEvent) {
        return this._changeEvent.subscribe(handler);
    }

    unsubscribeFieldValuesChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._changeEvent.unsubscribe(subscriptionId);
    }

    subscribeFeedStatusChangeEvent(handler: DataMarket.FeedStatusChangeEvent) {
        return this._feedStatusChangeEvent.subscribe(handler);
    }

    unsubscribeFeedStatusChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._feedStatusChangeEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: DataMarket.CorrectnessChangedEventHandler) {
        return this._correctnessChangedEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedEvent.unsubscribe(subscriptionId);
    }

    subscribeMarketBoardListChange(handler: RecordList.ListChangeEventHandler) {
        return this.marketBoards.subscribeListChangeEvent(handler);
    }

    unsubscribeMarketBoardListChange(subscriptionId: MultiEvent.SubscriptionId) {
        this.marketBoards.unsubscribeListChangeEvent(subscriptionId);
    }

    private handleTradingStatesDataItemCorrectnessChangedEvent() {
        const dataItem = this._tradingStatesDataItem;
        if (dataItem === undefined) {
            throw new AssertInternalError('MHTSFCCE1923688399993');
        } else {
            if (dataItem.completed) {
                this.processTradingStatesDataItemCompleted();
            } else {
                this.updateCorrectness();
            }
        }
    }

    private notifyChange(changedFieldIds: DataMarket.FieldId[]) {
        const handlers = this._changeEvent.copyHandlers();
        for (const handler of handlers) {
            handler(changedFieldIds);
        }
    }

    private notifyFeedStatusChange() {
        const handlers = this._feedStatusChangeEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private notifyCorrectnessChanged() {
        const handlers = this._correctnessChangedEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private setStatus(status: string | undefined) {
        this._status = status;
        return this.checkUpdateAllowIdsReasonId();
    }

    private checkUpdateAllowIdsReasonId() {
        const { allowIds, reasonId } = this.calculateAllowIdsReasonId(this.status);
        const changedFieldIds: DataMarket.FieldId[] = [];
        if (!isUndefinableArrayEqualUniquely(allowIds, this.allowIds)) {
            this._allowIds = allowIds;
            changedFieldIds.push(DataMarket.FieldId.AllowIds);
        }
        if (reasonId !== this.reasonId) {
            this._reasonId = reasonId;
            changedFieldIds.push(DataMarket.FieldId.ReasonId);
        }
        return changedFieldIds;
    }

    private updateMarketBoards(msgBoards: ZenithMarketBoards | undefined): boolean {
        const marketBoards = this.marketBoards;
        if (msgBoards === undefined) {
            marketBoards.checkUpdateFeedInitialising(true); // Ignore changes in market boards when calculating updated
            return false;
        } else {
            let updated = false;
            const oldCount = marketBoards.count;
            const removeIndices = new Array<Integer>(oldCount);
            let removeIndexCount = 0;
            for (let i = 0; i < oldCount; i++) {
                const board = marketBoards.getAt(i);
                const zenithCode = board.zenithCode;
                if (ZenithMarketBoards.indexOf(msgBoards, zenithCode) < 0) {
                    board.destroy();
                    removeIndices[removeIndexCount++] = i;
                }
            }

            if (removeIndexCount > 0) {
                removeIndices.length = removeIndexCount;
                marketBoards.removeAtIndices(removeIndices);
                updated = true;
            }

            marketBoards.checkUpdateFeedInitialising(false); // Ignore changes in market boards when calculating updated

            const msgCount = msgBoards.length;
            const addBoards = new Array<MarketBoard>(msgCount);
            let addCount = 0;

            for (let i = 0; i < msgCount; i++) {
                const msgState = msgBoards[i];

                const zenithCode = msgState.zenithCode;
                const status = msgState.status;
                const { allowIds, reasonId } = this.calculateAllowIdsReasonId(status);

                let marketBoard = marketBoards.findZenithCode(zenithCode);
                if (marketBoard === undefined) {
                    const { name, display } = this.calculateMarketBoardNameAndDisplay(zenithCode);
                    marketBoard = new MarketBoard(
                        // id: msgState.id,
                        // environmentId: msgState.environmentId,
                        zenithCode,
                        name,
                        display,
                        this,
                        status,
                        allowIds,
                        reasonId,
                    );
                    addBoards[addCount++] = marketBoard;
                } else {
                    marketBoard.update(status, allowIds, reasonId); // Ignore changes in market boards when calculating updated
                }
            }

            if (addCount > 0) {
                addBoards.length = addCount;
                marketBoards.addRange(addBoards);
                updated = true;
            }

            return updated;
        }
    }

    private findMarketBoardConfig(zenithCode: string) {
        const boardConfigs = this._marketBoardConfigs;
        const boardConfigCount = boardConfigs.length;
        for (let i = 0; i < boardConfigCount; i++) {
            const board = boardConfigs[i];
            if (board.zenithCode === zenithCode) {
                return board;
            }
        }
        return undefined;
    }

    private calculateMarketBoardNameAndDisplay(zenithCode: string): DataMarket.ResolvedMarketBoardConfig {
        const unenvironmentedZenithCode = ZenithEnvironmentedValueParts.getValueFromString(zenithCode);
        const board = this.findMarketBoardConfig(unenvironmentedZenithCode);
        if (board === undefined) {
            return {
                name: zenithCode,
                display: zenithCode,
            };
        } else {
            return {
                name: board.name ?? zenithCode,
                display: board.display ?? zenithCode,
            };
        }
    }

    private isMarketBoardsEqual(left: ZenithMarketBoards, right: readonly MarketBoard[]) {
        if (left.length !== right.length) {
            return false;
        } else {
            // assume no duplicates
            for (const leftBoard of left) {
                const rightBoard = MarketBoard.findInArray(right, leftBoard.zenithCode);
                if (rightBoard === undefined) {
                    return false;
                } else {
                    if (leftBoard.status !== rightBoard.status) {
                        return false;
                    }
                }
            }

            return true;
        }
    }

    private isUndefinableMarketBoardsEqual(left: ZenithMarketBoards | undefined, right: readonly MarketBoard[] | undefined) {
        if (left === undefined) {
            return right === undefined;
        } else {
            if (right === undefined) {
                return false;
            } else {
                return this.isMarketBoardsEqual(left, right);
            }
        }
    }

    private updateCorrectness() {
        let correctnessId: CorrectnessId;
        if (this._tradingStatesDataItem === undefined) {
            correctnessId = this._listCorrectnessId;
        } else {
            correctnessId = Correctness.merge2Ids(this._listCorrectnessId, this._tradingStatesDataItem.correctnessId);
        }

        if (correctnessId !== this._correctnessId) {
            this._correctnessId = correctnessId;
            this._usable = Correctness.idIsUsable(correctnessId);

            // if (!this.usable) {
            //     this.setUnknown();
            // }
            this.notifyCorrectnessChanged();
        }
    }

    private setFeedStatusId(value: FeedStatusId) {
        if (value !== this._feedStatusId) {
            this._feedStatusId = value;
            this.notifyFeedStatusChange();
            this.notifyChange([DataMarket.FieldId.FeedStatusId]);
        }
    }


    private checkDisposeTradingStatesDataItem() {
        if (this._tradingStatesDataItem !== undefined) {
            this._tradingStatesDataItem.unsubscribeCorrectnessChangedEvent(this._tradingStatesDataItemCorrectnessChangedSubscriptionId);
            this._tradingStatesDataItemCorrectnessChangedSubscriptionId = undefined;
            this._adiService.unsubscribe(this._tradingStatesDataItem);
            this._tradingStatesDataItem = undefined;
        }
    }

    private processTradingStatesDataItemCompleted() {
        const dataItem = this._tradingStatesDataItem;
        if (dataItem === undefined) {
            throw new AssertInternalError('MPRSDIC4401');
        } else {
            if (Correctness.idIsUsable(dataItem.correctnessId)) {
                this._tradingStates = dataItem.states;
                const changedFieldIds = this.checkUpdateAllowIdsReasonId();
                // MarketBoards has all fields of MarketsDataMessage.MarketBoards
                const marketBoards = this.marketBoards;
                if (marketBoards.feedInitialising) {
                    this.updateMarketBoards([]);
                } else {
                    const count = marketBoards.count;
                    const zenithMarketBoards = new Array<ZenithMarketBoard>(count);
                    let msgCount = 0;
                    for (let i = 0; i < count; i++) {
                        const marketBoard = marketBoards.getAt(i);
                        if (!marketBoard.destroyed) {
                            const zenithMarketBoard = marketBoard.createZenithMarketBoard();
                            if (zenithMarketBoard !== undefined) {
                                zenithMarketBoards[msgCount++] = zenithMarketBoard;
                            }
                        }
                    }
                    zenithMarketBoards.length = msgCount;
                    this.updateMarketBoards(zenithMarketBoards);
                }
                changedFieldIds.push(DataMarket.FieldId.MarketBoards);
                this.notifyChange(changedFieldIds);
                this.checkDisposeTradingStatesDataItem();
            }
            this.updateCorrectness();
        }
    }

    private calculateAllowIdsReasonId(status: string | undefined) {
        let reasonId: TradingState.ReasonId | undefined;
        let allowIds: TradingState.AllowIds | undefined;
        if (status === undefined) {
            reasonId = undefined;
            allowIds = undefined;
        } else {
            const state = TradingStates.find(this._tradingStates, status);
            if (state === undefined) {
                reasonId = undefined;
                allowIds = undefined;
            } else {
                reasonId = state.reasonId;
                allowIds = state.allowIds;
            }
        }
        return { allowIds, reasonId };
    }
}

export namespace DataMarket {
    export interface ResolvedMarketBoardConfig {
        name: string;
        display: string;
    }

    export type MarketBoardListChangeEventer = RecordList.ListChangeEventHandler;

    export const enum FieldId {
        ZenithCode,
        Name,
        Display,
        Lit,
        DisplayPriority,
        Unknown,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        ExchangeEnvironment,
        ExchangeEnvironmentIsDefault,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        Exchange,
        SymbologyCode,
        SymbologyExchangeSuffixCode,
        BestTradingMarket,
        BestLitForTradingMarkets,
        // The following fields' values can change - make sure reflected in readonlyCount
        MarketBoards,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        FeedStatusId,
        TradingDate,
        MarketTime,
        Status,
        AllowIds,
        ReasonId,
    }

    export type FieldValuesChangedEvent = (this: void, changedFieldIds: FieldId[]) => void;
    export type FeedStatusChangeEvent = (this: void) => void;
    export type CorrectnessChangedEventHandler = (this: void) => void;

    export namespace Field {
        interface Info {
            readonly id: FieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };

        const infosObject: InfosObject = {
            ZenithCode: {
                id: FieldId.ZenithCode,
                name: 'ZenithCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldHeading_ZenithCode,
                headingId: StringId.MarketFieldHeading_ZenithCode,
            },
            Name: {
                id: FieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldDisplay_Name,
                headingId: StringId.MarketFieldHeading_Name,
            },
            Display: {
                id: FieldId.Display,
                name: 'Display',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldDisplay_Display,
                headingId: StringId.MarketFieldHeading_Display,
            },
            Lit: {
                id: FieldId.Lit,
                name: 'Lit',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.MarketFieldDisplay_Lit,
                headingId: StringId.MarketFieldHeading_Lit,
            },
            DisplayPriority: {
                id: FieldId.DisplayPriority,
                name: 'DisplayPriority',
                dataTypeId: FieldDataTypeId.Number,
                displayId: StringId.MarketFieldDisplay_DisplayPriority,
                headingId: StringId.MarketFieldHeading_DisplayPriority,
            },
            Unknown: {
                id: FieldId.Unknown,
                name: 'Unknown',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.MarketFieldDisplay_Unknown,
                headingId: StringId.MarketFieldHeading_Unknown,
            },
            ExchangeEnvironment: {
                id: FieldId.ExchangeEnvironment,
                name: 'ExchangeEnvironment',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldDisplay_ExchangeEnvironment,
                headingId: StringId.MarketFieldHeading_ExchangeEnvironment,
            },
            ExchangeEnvironmentIsDefault: {
                id: FieldId.ExchangeEnvironmentIsDefault,
                name: 'ExchangeEnvironmentIsDefault',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.MarketFieldDisplay_ExchangeEnvironmentIsDefault,
                headingId: StringId.MarketFieldHeading_ExchangeEnvironmentIsDefault,
            },
            Exchange: {
                id: FieldId.Exchange,
                name: 'ExchangeDisplay',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldDisplay_Exchange,
                headingId: StringId.MarketFieldHeading_Exchange,
            },
            SymbologyCode: {
                id: FieldId.SymbologyCode,
                name: 'SymbologyCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldDisplay_SymbologyCode,
                headingId: StringId.MarketFieldHeading_SymbologyCode,
            },
            SymbologyExchangeSuffixCode: {
                id: FieldId.SymbologyExchangeSuffixCode,
                name: 'SymbologyExchangeSuffixCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketFieldDisplay_SymbologyExchangeSuffixCode,
                headingId: StringId.MarketFieldHeading_SymbologyExchangeSuffixCode,
            },
            BestTradingMarket: {
                id: FieldId.BestTradingMarket,
                name: 'BestTradingMarket',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataMarketFieldDisplay_BestTradingMarket,
                headingId: StringId.DataMarketFieldHeading_BestTradingMarket,
            },
            BestLitForTradingMarkets: {
                id: FieldId.BestLitForTradingMarkets,
                name: 'BestLitForTradingMarkets',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataMarketFieldDisplay_BestLitForTradingMarkets,
                headingId: StringId.DataMarketFieldHeading_BestLitForTradingMarkets,
            },
            MarketBoards: {
                id: FieldId.MarketBoards,
                name: 'MarketBoards',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataMarketFieldDisplay_MarketBoards,
                headingId: StringId.DataMarketFieldHeading_MarketBoards,
            },

            FeedStatusId: {
                id: FieldId.FeedStatusId,
                name: 'FeedStatusId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.DataMarketFieldDisplay_FeedStatusId,
                headingId: StringId.DataMarketFieldHeading_FeedStatusId,
            },
            TradingDate: {
                id: FieldId.TradingDate,
                name: 'TradingDate',
                dataTypeId: FieldDataTypeId.Date,
                displayId: StringId.DataMarketFieldDisplay_TradingDate,
                headingId: StringId.DataMarketFieldHeading_TradingDate,
            },
            MarketTime: {
                id: FieldId.MarketTime,
                name: 'MarketTime',
                dataTypeId: FieldDataTypeId.DateTime,
                displayId: StringId.DataMarketFieldDisplay_MarketTime,
                headingId: StringId.DataMarketFieldHeading_MarketTime,
            },
            Status: {
                id: FieldId.Status,
                name: 'Status',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataMarketFieldDisplay_Status,
                headingId: StringId.DataMarketFieldHeading_Status,
            },
            AllowIds: {
                id: FieldId.AllowIds,
                name: 'AllowIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.DataMarketFieldDisplay_AllowIds,
                headingId: StringId.DataMarketFieldHeading_AllowIds,
            },
            ReasonId: {
                id: FieldId.ReasonId,
                name: 'ReasonId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.DataMarketFieldDisplay_ReasonId,
                headingId: StringId.DataMarketFieldHeading_ReasonId,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;
        export const readonlyCount = 14; // Make sure matches list above

        (function initialiseField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('DataMarket.FieldId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        })();

        export function idToName(id: FieldId) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: FieldId) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: FieldId) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: FieldId) {
            return Strings[idToDisplayId(id)];
        }

        export function idToHeadingId(id: FieldId) {
            return infos[id].headingId;
        }

        export function idToHeading(id: FieldId) {
            return Strings[idToHeadingId(id)];
        }
    }

    export class MarketBoards extends ChangeSubscribableComparableList<MarketBoard> {
        private _feedInitialising = false;

        get feedInitialising(): boolean { return this._feedInitialising; }

        destroy() {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const board = this.getAt(i);
                board.destroy();
            }
        }

        checkUpdateFeedInitialising(value: boolean): void {
            if (value !== this._feedInitialising) {
                this._feedInitialising = value;
                const count = this.count;
                for (let i = 0; i < count; i++) {
                    const board = this.getAt(i);
                    board.checkSetFeedInitialising(value);
                }
            }
        }

        getZenithCodesAsCommaText() {
            const count = this.count;
            const zenithCodes = new Array<string>(count);
            for (let i = 0; i < count; i++) {
                const board = this.getAt(i);
                zenithCodes[i] = board.zenithCode;
            }
            return CommaText.fromStringArray(zenithCodes);
        }

        findZenithCode(value: string): MarketBoard | undefined {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const board = this.getAt(i);
                if (board.zenithCode === value) {
                    return board;
                }
            }
            return undefined;
        }
    }

    export function arrayToFlatMarketBoardArray(dataMarkets: readonly DataMarket[]): MarketBoard[] {
        const marketBoardArrays = dataMarkets.map(dataMarket => dataMarket.marketBoards.toArray());
        return marketBoardArrays.flat();
    }

    export function createUnknown(adiService: AdiService, exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): DataMarket {
        const msgMarket: MarketsDataMessage.Market = {
            zenithCode,
            zenithMarketBoards: [],
            feedStatusId: FeedStatusId.Inactive,
            tradingDate: undefined,
            marketTime: undefined,
            status: undefined,
        };
        const zenithDataMarket = new ZenithDataMarket(msgMarket);

        const result = new DataMarket(adiService, zenithCode, zenithCode, zenithCode, exchange, exchangeEnvironment, [], false, undefined, true, zenithDataMarket, CorrectnessId.Error);
        result.setListCorrectness(CorrectnessId.Error);
        result.setExchangeEnvironmentIsDefault(false);
        result.setSymbologyExchangeSuffixCode('!');
        result.setSymbologySupportedExchanges([]);
        result.setBestTradingMarkets(undefined, []);

        return result;
    }

    // export class Key implements KeyedRecord.Key {
    //     static readonly jsonTag_MarketId = 'marketId';
    //     static readonly nullMarketIdJson = '';

    //     constructor(public readonly mapKey: string) { }

    //     static createNull() {
    //         // will not match any valid holding
    //         return new Key('');
    //     }

    //     // assign(other: Key) {
    //     //     this.marketId = other.marketId;
    //     // }
    // }

    // export namespace Key {
    //     export function isEqual(left: Key, right: Key) {
    //         return left.mapKey === right.mapKey;
    //     }

    //     export function generateMapKey(zenithCode: string) {
    //         return zenithCode;
    //     }

    //     // export function tryCreateFromJson(element: JsonElement) {
    //     //     const jsonId = element.tryGetString(Key.jsonTag_MarketId);
    //     //     if (jsonId === undefined) {
    //     //         return 'Undefined Id';
    //     //     } else {
    //     //         if (jsonId === Key.nullMarketIdJson) {
    //     //             return Key.createNull();
    //     //         } else {
    //     //             const marketId = MarketInfo.tryJsonValueToId(jsonId);
    //     //             if (marketId === undefined) {
    //     //                 return `Unknown MarketId: ${jsonId}`;
    //     //             } else {
    //     //                 return new Key(marketId);
    //     //             }
    //     //         }
    //     //     }
    //     // }
    // }
}
