import { AssertInternalError, BinaryFind, ChangeSubscribableComparableList, CompareFtn, EnumInfoOutOfOrderError, Integer, MultiEvent, UnreachableCaseError, UsableListChangeTypeId } from '@xilytix/sysutils';
import { StringId, Strings } from '../../res/internal-api';
import { Badness, BadnessComparableList, ConfigError, ErrorCode, WarningsService, ZenithDataError } from '../../sys/internal-api';
import { FeedsDataDefinition, MarketsDataDefinition } from '../common/data-definition';
import { ExchangeEnvironmentZenithCode, unknownZenithCode, ZenithEnvironmentedValueParts, ZenithMarketParts } from '../common/internal-api';
import { AdiService } from '../data-item/internal-api';
import { FeedsDataItem, TradingFeed } from '../feed/internal-api';
import { DataMarket } from './data-market';
import { Exchange } from './exchange';
import { ExchangeEnvironment } from './exchange-environment';
import { Market } from './market';
import { MarketBoard } from './market-board';
import { MarketsConfig } from './markets-config';
import { MarketsDataItem } from './markets-data-item';
import { TradingMarket } from './trading-market';
import { ZenithCodedEnvironment } from './zenith-coded-environment';
import { ZenithDataMarket } from './zenith-market';

export class MarketsService {
    readonly exchangeEnvironments: MarketsService.ExchangeEnvironments;
    readonly exchanges: MarketsService.Exchanges;
    readonly dataMarkets: MarketsService.AllKnownDataMarkets;
    readonly tradingMarkets: MarketsService.AllKnownTradingMarkets;
    readonly marketBoards: MarketsService.MarketBoards;

    readonly defaultExchangeEnvironmentExchanges: MarketsService.Exchanges;
    readonly defaultExchangeEnvironmentDataMarkets: MarketsService.DefaultExchangeEnvironmentKnownDataMarkets;
    readonly defaultExchangeEnvironmentTradingMarkets: MarketsService.DefaultExchangeEnvironmentKnownTradingMarkets;
    readonly defaultExchangeEnvironmentMarketBoards: MarketsService.MarketBoards;

    readonly unknownExchangeEnvironments: MarketsService.ExchangeEnvironments;
    readonly unknownExchanges: MarketsService.Exchanges;
    readonly unknownDataMarkets: MarketsService.UnknownDataMarkets;
    readonly unknownTradingMarkets: MarketsService.UnknownTradingMarkets;
    readonly unknownMarketBoards: MarketsService.MarketBoards;

    readonly genericUnknownExchangeEnvironment: ExchangeEnvironment;
    readonly genericUnknownExchange: Exchange;
    readonly genericUnknownDataMarket: DataMarket;
    readonly genericUnknownTradingMarket: TradingMarket;
    readonly genericUnknownMarketBoard: MarketBoard;

    private _startedPromiseResolveFtn: MarketsService.StartedPromiseResolveFtn | undefined;
    private _started = false;

    private _config: MarketsConfig;

    private _marketsDataItem: MarketsDataItem | undefined;
    private _zenithDataMarkets: BadnessComparableList<ZenithDataMarket>;
    private _tradingFeedMarkets: readonly TradingFeed.Market[] | undefined;

    private _defaultDefaultExchange: Exchange;

    private _zenithMarketsBadnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;
    private _zenithDataMarketsListChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _dataMarketsCorrectnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    private _beginChangeCount = 0;
    private _changeBegunMultiEvent = new MultiEvent<MarketsService.ChangeBegunEventHandler>();
    private _changeEndedMultiEvent = new MultiEvent<MarketsService.ChangeEndedEventHandler>();

    constructor(
        private readonly _warningsService: WarningsService,
        private readonly _adiService: AdiService,
    ) {
        const genericUnknownExchangeEnvironment = ExchangeEnvironment.createUnknown(unknownZenithCode);
        this.genericUnknownExchangeEnvironment = genericUnknownExchangeEnvironment;
        const genericUnknownExchange = Exchange.createUnknown(genericUnknownExchangeEnvironment, unknownZenithCode, undefined, undefined);
        this.genericUnknownExchange = genericUnknownExchange;
        const environmentedUnknownZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unknownZenithCode, genericUnknownExchangeEnvironment.zenithCode);
        const genericUnknownDataMarket = DataMarket.createUnknown(this._adiService, genericUnknownExchangeEnvironment, genericUnknownExchange, environmentedUnknownZenithCode);
        this.genericUnknownDataMarket = genericUnknownDataMarket;
        const genericUnknownTradingMarket = TradingMarket.createUnknown(genericUnknownExchangeEnvironment, genericUnknownExchange, environmentedUnknownZenithCode);
        this.genericUnknownTradingMarket = genericUnknownTradingMarket;
        const genericUnknownMarketBoard = MarketBoard.createUnknown(genericUnknownDataMarket, environmentedUnknownZenithCode);
        this.genericUnknownMarketBoard = genericUnknownMarketBoard;

        this.genericUnknownExchange.setDefaultMarkets(this.genericUnknownDataMarket, this.genericUnknownTradingMarket);

        this.unknownExchangeEnvironments = new MarketsService.ExchangeEnvironments();
        const unknownExchanges = new MarketsService.Exchanges(genericUnknownExchange, Exchange.compareByZenithCode, Exchange.compareToZenithCode);
        this.unknownExchanges = unknownExchanges;
        this.unknownDataMarkets = new MarketsService.UnknownDataMarkets(
            this._adiService,
            Market.compareByZenithCode, Market.compareToZenithCode,
            unknownExchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownDataMarket,
            () => this.beginChange(),
            () => this.endChange(),
            (zenithCode) => this.getExchangeEnvironmentOrUnknown(zenithCode),
            (zenithCode) => this.getExchangeOrUnknown(zenithCode),
        );
        this.unknownDataMarkets.setBadness(Badness.notBad);
        this.unknownTradingMarkets = new MarketsService.UnknownTradingMarkets(
            Market.compareByZenithCode, Market.compareToZenithCode,
            unknownExchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownTradingMarket,
            () => this.beginChange(),
            () => this.endChange(),
            (zenithCode) => this.getExchangeEnvironmentOrUnknown(zenithCode),
            (zenithCode) => this.getExchangeOrUnknown(zenithCode),
            this.genericUnknownDataMarket,
        );
        this.unknownMarketBoards = new MarketsService.MarketBoards(MarketBoard.compareByZenithCode, MarketBoard.compareToZenithCode);

        this.unknownExchangeEnvironments.add(genericUnknownExchangeEnvironment);
        this.unknownExchanges.add(genericUnknownExchange);
        this.unknownDataMarkets.add(genericUnknownDataMarket);
        this.unknownTradingMarkets.add(genericUnknownTradingMarket);
        this.unknownMarketBoards.add(genericUnknownMarketBoard);

        const defaultExchangeEnvironmentExchanges = new MarketsService.Exchanges(genericUnknownExchange, Exchange.compareByUnenvironmentedZenithCode, Exchange.compareToUnenvironmentedZenithCode);
        this.defaultExchangeEnvironmentExchanges = defaultExchangeEnvironmentExchanges;
        this.defaultExchangeEnvironmentDataMarkets = new MarketsService.DefaultExchangeEnvironmentKnownDataMarkets(
            this._adiService,
            Market.compareByUnenvironmentedZenithCode, Market.compareToUnenvironmentedZenithCode,
            defaultExchangeEnvironmentExchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownDataMarket,
            () => this.beginChange(),
            () => this.endChange(),
            (zenithCode) => this.getExchangeEnvironmentOrUnknown(zenithCode),
            (zenithCode) => this.getDefaultEnvironmentExchangeOrUnknown(zenithCode),
            this.unknownDataMarkets,
        );
        this.defaultExchangeEnvironmentTradingMarkets = new MarketsService.DefaultExchangeEnvironmentKnownTradingMarkets(
            Market.compareByUnenvironmentedZenithCode, Market.compareToUnenvironmentedZenithCode,
            defaultExchangeEnvironmentExchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownTradingMarket,
            () => this.beginChange(),
            () => this.endChange(),
            (zenithCode) => this.getExchangeEnvironmentOrUnknown(zenithCode),
            (zenithCode) => this.getDefaultEnvironmentExchangeOrUnknown(zenithCode),
            this.unknownTradingMarkets,
            this.genericUnknownDataMarket, // Needs fixing
        );

        this.exchangeEnvironments = new MarketsService.ExchangeEnvironments();
        const exchanges = new MarketsService.Exchanges(genericUnknownExchange, Exchange.compareByZenithCode, Exchange.compareToZenithCode);
        this.exchanges = exchanges;

        this.dataMarkets = new MarketsService.AllKnownDataMarkets(
            this._adiService,
            Market.compareByZenithCode, Market.compareToZenithCode,
            exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownDataMarket,
            () => this.beginChange(),
            () => this.endChange(),
            (zenithCode) => this.getExchangeEnvironmentOrUnknown(zenithCode),
            (zenithCode) => this.getExchangeOrUnknown(zenithCode),
            this.unknownDataMarkets,
            this.defaultExchangeEnvironmentDataMarkets,
        );
        this.tradingMarkets = new MarketsService.AllKnownTradingMarkets(
            Market.compareByZenithCode, Market.compareToZenithCode,
            exchanges,
            genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownTradingMarket,
            () => this.beginChange(),
            () => this.endChange(),
            (zenithCode) => this.getExchangeEnvironmentOrUnknown(zenithCode),
            (zenithCode) => this.getExchangeOrUnknown(zenithCode),
            this.unknownTradingMarkets,
            this.defaultExchangeEnvironmentTradingMarkets,
            this.genericUnknownDataMarket, // Needs fixing
        );
        this.marketBoards = new MarketsService.MarketBoards(MarketBoard.compareByZenithCode, MarketBoard.compareToZenithCode);

        this.defaultExchangeEnvironmentMarketBoards = new MarketsService.MarketBoards(MarketBoard.compareByUnenvironmentedZenithCode, MarketBoard.compareToUnenvironmentedZenithCode);
    }

    get defaultDefaultExchange(): Exchange { return this._defaultDefaultExchange; }
    get defaultExchangeEnvironment(): ExchangeEnvironment { return this._defaultDefaultExchange.exchangeEnvironment; }

    // get starting(): boolean { return this._startedPromiseResolveFtn !== undefined; }
    get started(): boolean { return this._started; }

    start(config: MarketsConfig): Promise<void> {
        this._config = config;

        // Replace with Promise.withResolvers when available in TypeScript (ES2023)
        let resolve: () => void;
        const resultPromise = new Promise<void>((res) => {
            resolve = res;
        });

        const marketsDefinition = new MarketsDataDefinition();
        const marketsDataItem = this._adiService.subscribe(marketsDefinition) as MarketsDataItem;
        this._marketsDataItem = marketsDataItem;
        this._zenithDataMarkets = this._marketsDataItem.markets;

        const feedsDataDefinition = new FeedsDataDefinition();
        const feedsDataItem = this._adiService.subscribe(feedsDataDefinition) as FeedsDataItem;
        const feedTradingMarketsPromise = feedsDataItem.getReadyTradingFeedMarketsForMarketsService(); // Start Promise cannot be fulfilled until we got feedTradingMarkets so may as well wait for this
        feedTradingMarketsPromise.then(
            (tradingFeedMarkets) => {
                this._adiService.unsubscribe(feedsDataItem);

                if (tradingFeedMarkets !== undefined) {
                    window.motifLogger.logInfo(`${Strings[StringId.Trading]} ${Strings[StringId.Feeds]} ${Strings[StringId.Ok]}: ${tradingFeedMarkets.length}`);

                    this._tradingFeedMarkets = tradingFeedMarkets;
                    this._zenithMarketsBadnessChangedEventSubscriptionId = this._zenithDataMarkets.subscribeBadnessChangedEvent(
                        () => { this.handleZenithMarketsBadnessChangedEvent(); }
                    );
                    this._zenithDataMarketsListChangeEventSubscriptionId = this._zenithDataMarkets.subscribeListChangeEvent(
                        (listChangeTypeId, index, count) => { this.handleZenithDataMarketsListChangeEvent(listChangeTypeId, index, count); }
                    );
                    this._dataMarketsCorrectnessChangedEventSubscriptionId = this.dataMarkets.subscribeCorrectnessChangedEvent(
                        () => { this.handleMarketsCorrectnessChangedEvent(); }
                    );

                    if (marketsDataItem.usable) {
                        this.startLoadOrAddZenithDataMarkets(0, this._zenithDataMarkets.count);
                        resolve();
                    } else {
                        this._startedPromiseResolveFtn = resolve;
                    }
                }
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'MSS40114'); }
        );
        return resultPromise;
    }

    stop() {
        if (this._marketsDataItem !== undefined) {
            this._zenithDataMarkets.unsubscribeBadnessChangedEvent(this._zenithMarketsBadnessChangedEventSubscriptionId);
            this._zenithMarketsBadnessChangedEventSubscriptionId = undefined;
            this._zenithDataMarkets.unsubscribeListChangeEvent(this._zenithDataMarketsListChangeEventSubscriptionId);
            this._zenithDataMarketsListChangeEventSubscriptionId = undefined;
            this.dataMarkets.unsubscribeCorrectnessChangedEvent(this._dataMarketsCorrectnessChangedEventSubscriptionId);
            this._dataMarketsCorrectnessChangedEventSubscriptionId = undefined;

            this._adiService.unsubscribe(this._marketsDataItem);
            this._marketsDataItem = undefined;

            this.clearMarkets();
        }
    }

    getAllMarkets<T extends Market>(marketTypeId: Market.TypeId): MarketsService.AllKnownMarkets<T> {
        return marketTypeId === Market.TypeId.Data ? this.dataMarkets as unknown as MarketsService.AllKnownMarkets<T> : this.tradingMarkets as unknown as MarketsService.AllKnownMarkets<T>;
    }

    // getAllMarketsGeneric<T extends Market, K extends Market.TypeId>(marketTypeId: K): MarketsService.AllKnownMarkets<T> {
    //     const lookup: { [P in Market.TypeId]: MarketsService.AllKnownMarketsType<T, P> } = {
    //         [Market.TypeId.Data]: this.dataMarkets,
    //         [Market.TypeId.Trading]: this.tradingMarkets,
    //     };
    //     return lookup[marketTypeId];
    // }

    getGenericUnknownMarket<T extends Market>(marketTypeId: Market.TypeId): T {
        return marketTypeId === Market.TypeId.Data ? this.genericUnknownDataMarket as unknown as T : this.genericUnknownTradingMarket as unknown as T;
    }

    getDefaultExchangeEnvironmentMarkets<T extends Market>(marketTypeId: Market.TypeId): MarketsService.DefaultExchangeEnvironmentKnownMarkets<T> {
        return marketTypeId === Market.TypeId.Data
            ? this.defaultExchangeEnvironmentDataMarkets as unknown as MarketsService.DefaultExchangeEnvironmentKnownMarkets<T>
            : this.defaultExchangeEnvironmentTradingMarkets as unknown as MarketsService.DefaultExchangeEnvironmentKnownMarkets<T>;
    }

    tryGetExchangeEnvironment(zenithCode: ExchangeEnvironmentZenithCode, unknownAllowed: boolean): ExchangeEnvironment | undefined {
        if (unknownAllowed) {
            return this.getExchangeEnvironmentOrUnknown(zenithCode);
        } else {
            return this.exchangeEnvironments.findZenithCode(zenithCode);
        }
    }

    getExchangeEnvironmentOrUnknown(zenithCode: ExchangeEnvironmentZenithCode) {
        const foundExchangeEnvironment = this.exchangeEnvironments.findZenithCode(zenithCode);

        if (foundExchangeEnvironment === undefined) {
            return this.getUnknownExchangeEnvironment(zenithCode);
        } else {
            return foundExchangeEnvironment;
        }
    }

    tryGetExchange(zenithCode: string, unknownAllowed: boolean): Exchange | undefined {
        if (unknownAllowed) {
            return this.getExchangeOrUnknown(zenithCode);
        } else {
            return this.exchanges.findZenithCode(zenithCode);
        }
    }

    getExchangeOrUnknown(zenithCode: string): Exchange {
        const foundExchange = this.exchanges.findZenithCode(zenithCode);

        if (foundExchange === undefined) {
            return this.getUnknownExchange(zenithCode);
        } else {
            return foundExchange;
        }
    }

    tryGetDefaultEnvironmentExchange(unenvironmentedZenithCode: string, unknownAllowed: boolean): Exchange | undefined {
        if (unknownAllowed) {
            return this.getDefaultEnvironmentExchangeOrUnknown(unenvironmentedZenithCode);
        } else {
            return this.defaultExchangeEnvironmentExchanges.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);
        }
    }

    getDefaultEnvironmentExchangeOrUnknown(unenvironmentedZenithCode: string): Exchange {
        const foundExchange = this.defaultExchangeEnvironmentExchanges.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);

        if (foundExchange === undefined) {
            const zenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedZenithCode, this.genericUnknownExchangeEnvironment.zenithCode);
            return this.getUnknownExchange(zenithCode);
        } else {
            return foundExchange;
        }
    }

    tryGetDataMarket(zenithCode: string, unknownAllowed: boolean): DataMarket | undefined {
        return this.dataMarkets.tryGetMarket(zenithCode, unknownAllowed);
    }

    getDataMarketOrUnknown(zenithCode: string): DataMarket {
        return this.dataMarkets.getMarketOrUnknown(zenithCode);
    }

    tryGetDefaultEnvironmentDataMarket(unenvironmentedZenithCode: string, unknownAllowed: boolean): DataMarket | undefined {
        if (unknownAllowed) {
            return this.getDefaultEnvironmentDataMarketOrUnknown(unenvironmentedZenithCode);
        } else {
            return this.defaultExchangeEnvironmentDataMarkets.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);
        }
    }

    getDefaultEnvironmentDataMarketOrUnknown(unenvironmentedZenithCode: string): DataMarket {
        const foundMarket = this.defaultExchangeEnvironmentDataMarkets.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);

        if (foundMarket === undefined) {
            const zenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedZenithCode, this.genericUnknownExchangeEnvironment.zenithCode);
            return this.getUnknownDataMarket(zenithCode);
        } else {
            return foundMarket;
        }
    }

    getDataMarkets(zenithCodes: readonly string[], includeUnknown: boolean, unknownErrorCode?: ErrorCode) {
        return this.dataMarkets.getMarkets(zenithCodes, includeUnknown, unknownErrorCode);
    }

    tryGetTradingMarket(zenithCode: string, unknownAllowed: boolean): TradingMarket | undefined {
        return this.tradingMarkets.tryGetMarket(zenithCode, unknownAllowed);
    }

    getTradingMarketOrUnknown(zenithCode: string): TradingMarket {
        return this.tradingMarkets.getMarketOrUnknown(zenithCode);
    }

    tryGetDefaultEnvironmentTradingMarket(unenvironmentedZenithCode: string, unknownAllowed: boolean): TradingMarket | undefined {
        if (unknownAllowed) {
            return this.getDefaultEnvironmentTradingMarketOrUnknown(unenvironmentedZenithCode);
        } else {
            return this.defaultExchangeEnvironmentTradingMarkets.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);
        }
    }

    getDefaultEnvironmentTradingMarketOrUnknown(unenvironmentedZenithCode: string): TradingMarket {
        const foundTradingMarket = this.defaultExchangeEnvironmentTradingMarkets.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);

        if (foundTradingMarket === undefined) {
            const zenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedZenithCode, this.genericUnknownExchangeEnvironment.zenithCode);
            return this.getUnknownTradingMarket(zenithCode);
        } else {
            return foundTradingMarket;
        }
    }

    getTradingMarkets(zenithCodes: readonly string[], includeUnknown: boolean, unknownErrorCode?: ErrorCode) {
        return this.tradingMarkets.getMarkets(zenithCodes, includeUnknown, unknownErrorCode);
    }

    tryGetMarketBoard(zenithCode: string, unknownAllowed: boolean, market?: DataMarket): MarketBoard | undefined {
        if (unknownAllowed) {
            return this.getMarketBoardOrUnknown(zenithCode, market);
        } else {
            return this.findMarketBoard(zenithCode, market);
        }
    }

    getMarketBoardOrUnknown(zenithCode: string, market?: DataMarket): MarketBoard {
        const foundMarketBoard = this.findMarketBoard(zenithCode, market);
        if (foundMarketBoard === undefined) {
            return this.getUnknownMarketBoard(zenithCode, market);
        } else {
            return foundMarketBoard;
        }
    }

    tryGetDefaultEnvironmentMarketBoard(unenvironmentedZenithCode: string, unknownAllowed: boolean): MarketBoard | undefined {
        if (unknownAllowed) {
            return this.getDefaultEnvironmentMarketBoardOrUnknown(unenvironmentedZenithCode);
        } else {
            return this.defaultExchangeEnvironmentMarketBoards.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);
        }
    }

    getDefaultEnvironmentMarketBoardOrUnknown(unenvironmentedZenithCode: string): MarketBoard {
        const foundBoard = this.defaultExchangeEnvironmentMarketBoards.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);

        if (foundBoard === undefined) {
            const zenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedZenithCode, this.genericUnknownExchangeEnvironment.zenithCode);
            return this.getUnknownMarketBoard(zenithCode, undefined);
        } else {
            return foundBoard;
        }
    }

    findMarketBoard(zenithCode: string, market: DataMarket | undefined): MarketBoard | undefined {
        if (market === undefined) {
            return this.marketBoards.findZenithCode(zenithCode);
        } else {
            return market.marketBoards.findZenithCode(zenithCode);
        }
    }

    findDefaultEnvironmentMarketBoard(zenithCode: string, market: DataMarket | undefined): MarketBoard | undefined {
        if (market === undefined) {
            return this.defaultExchangeEnvironmentMarketBoards.findZenithCode(zenithCode);
        } else {
            if (market.exchangeEnvironmentIsDefault) {
                return market.marketBoards.findZenithCode(zenithCode);
            } else {
                return undefined;
            }
        }
    }

    getMarketBoards(
        zenithCodes: readonly string[],
        includeUnknown: boolean,
        market: DataMarket | undefined, // Set to undefined if boards can be from different markets
        unknownErrorCode?: ErrorCode
    ) {
        const zenithCodeCount = zenithCodes.length;
        const result = new Array<MarketBoard>(zenithCodeCount);
        let count = 0;
        for (let i = 0; i < zenithCodeCount; i++) {
            const zenithCode = zenithCodes[i];
            const board = this.tryGetMarketBoard(zenithCode, includeUnknown, market);
            if (board === undefined) {
                if (unknownErrorCode !== undefined) {
                    throw new ZenithDataError(unknownErrorCode, zenithCode);
                }
            } else {
                result[count++] = board;
            }
        }

        result.length = count;
        return result;
    }

    subscribeChangeBegunEvent(handler: MarketsService.ChangeBegunEventHandler): MultiEvent.SubscriptionId {
        return this._changeBegunMultiEvent.subscribe(handler);
    }

    unsubscribeChangeBegunEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        this._changeBegunMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeChangeEndedEvent(handler: MarketsService.ChangeEndedEventHandler): MultiEvent.SubscriptionId {
        return this._changeEndedMultiEvent.subscribe(handler);
    }

    unsubscribeChangeEndedEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        this._changeEndedMultiEvent.unsubscribe(subscriptionId);
    }

    private handleZenithMarketsBadnessChangedEvent() {
        const badness = this._zenithDataMarkets.badness;
        this.dataMarkets.setBadness(badness);
    }

    private handleZenithDataMarketsListChangeEvent(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                // handle by badness changed
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.clearMarkets();
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                break;
            case UsableListChangeTypeId.Usable:
                if (this._tradingFeedMarkets !== undefined) {
                    this.startLoadOrAddZenithDataMarkets(0, this._zenithDataMarkets.count);
                }
                break;
            case UsableListChangeTypeId.Insert:
                if (this._tradingFeedMarkets !== undefined) {
                    this.startLoadOrAddZenithDataMarkets(index, count);
                }
                break;
            case UsableListChangeTypeId.BeforeReplace:
                throw new AssertInternalError('MSHZMLCEBR29144');
            case UsableListChangeTypeId.AfterReplace:
                throw new AssertInternalError('MSHZMLCEAR29144');
            case UsableListChangeTypeId.BeforeMove:
                throw new AssertInternalError('MSHZMLCEBM29144');
            case UsableListChangeTypeId.AfterMove:
                throw new AssertInternalError('MSHZMLCEAM29144');
            case UsableListChangeTypeId.Remove:
                throw new AssertInternalError('MSHZMLCER29144');
                break;
            case UsableListChangeTypeId.Clear:
                this.clearMarkets();
                break;
            default:
                throw new UnreachableCaseError('MSHZMLCED29144', listChangeTypeId);
        }
    }

    private handleMarketsCorrectnessChangedEvent() {
        const markets = this.dataMarkets;
        const listCorrectnessId = markets.correctnessId;
        const marketCount = markets.count;
        for (let i = 0; i < marketCount; i++) {
            const market = markets.getAt(i);
            market.setListCorrectness(listCorrectnessId);
        }
    }

    private handleMarketBoardListChange(market: DataMarket, listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
            case UsableListChangeTypeId.PreUsableAdd:
            case UsableListChangeTypeId.PreUsableClear:
            case UsableListChangeTypeId.Usable:
                break;
            case UsableListChangeTypeId.Insert:
                this.beginChange();
                this.marketBoards.insertRangeFromMarket(market, idx, count);
                if (market.exchangeEnvironmentIsDefault) {
                    this.defaultExchangeEnvironmentMarketBoards.insertRangeFromMarket(market, idx, count);
                }
                this.endChange();
                break;
            case UsableListChangeTypeId.BeforeReplace:
            case UsableListChangeTypeId.AfterReplace:
            case UsableListChangeTypeId.BeforeMove:
            case UsableListChangeTypeId.AfterMove:
                break;
            case UsableListChangeTypeId.Remove:
                this.beginChange();
                this.marketBoards.removeRangeFromMarket(market, idx, count);
                if (market.exchangeEnvironmentIsDefault) {
                    this.defaultExchangeEnvironmentMarketBoards.removeRangeFromMarket(market, idx, count);
                }
                this.endChange();
                break;
            case UsableListChangeTypeId.Clear:
                this.beginChange();
                this.marketBoards.clearMarket(market);
                if (market.exchangeEnvironmentIsDefault) {
                    this.defaultExchangeEnvironmentMarketBoards.clearMarket(market);
                }
                this.endChange();
                break;
            default:
                throw new UnreachableCaseError('MSHTMBLC44077', listChangeTypeId);
        }
    }

    private beginChange() {
        if (this._beginChangeCount++ === 1) {
            this.notifyChangeBegun();
        }
    }

    private endChange() {
        if (this._beginChangeCount-- === 0) {
            this.notifyChangeEnded();
        }
    }

    private notifyChangeBegun() {
        const handlers = this._changeBegunMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private notifyChangeEnded() {
        const handlers = this._changeEndedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private getUnknownExchangeEnvironment(zenithCode: ExchangeEnvironmentZenithCode): ExchangeEnvironment {
        let result = this.unknownExchangeEnvironments.findZenithCode(zenithCode);
        if (result === undefined) {
            result = ExchangeEnvironment.createUnknown(zenithCode);
            this.beginChange();
            this.unknownExchangeEnvironments.binaryInsert(result);
            this.endChange();
        }
        return result;
    }

    private getUnknownExchange(zenithCode: string): Exchange {
        let result = this.unknownExchanges.findZenithCode(zenithCode);
        if (result === undefined) {
            const { value: unenvironmentedExchangeZenithCode, environmentZenithCode } = ZenithEnvironmentedValueParts.fromString(zenithCode);
            const exchangeEnvironment = this.getExchangeEnvironmentOrUnknown(environmentZenithCode);
            result = Exchange.createUnknown(exchangeEnvironment, unenvironmentedExchangeZenithCode, this.genericUnknownDataMarket, this.genericUnknownTradingMarket);
            this.beginChange();
            this.unknownExchanges.binaryInsert(result);
            this.endChange();
        }
        return result;
    }

    private getUnknownDataMarket(zenithCode: string): DataMarket {
        return this.dataMarkets.getUnknownMarket(zenithCode);
    }

    private getUnknownTradingMarket(zenithCode: string): TradingMarket {
        return this.tradingMarkets.getUnknownMarket(zenithCode);
    }

    private getUnknownMarketBoard(zenithCode: string, market: DataMarket | undefined) {
        let result = this.unknownMarketBoards.findZenithCode(zenithCode);
        if (result === undefined) {
            if (market === undefined) {
                market = this.genericUnknownDataMarket;
            }
            result = MarketBoard.createUnknown(market, zenithCode);
            this.beginChange();
            this.unknownMarketBoards.binaryInsert(result);
            this.endChange();
        }
        return result;
    }

    private clearMarkets() {
        this.beginChange();

        const markets = this.dataMarkets;
        const marketCount = markets.count;
        for (let i = 0; i < marketCount; i++) {
            const market = markets.getAt(i);
            market.marketBoardListChangeForMarketServiceEventer = undefined;
            market.destroy();
        }
        markets.clear();
        this.defaultExchangeEnvironmentDataMarkets.clear();

        const unknownMarkets = this.unknownDataMarkets;
        const unknownMarketCount = unknownMarkets.count;
        for (let i = 0; i < unknownMarketCount; i++) {
            const market = markets.getAt(i);
            market.marketBoardListChangeForMarketServiceEventer = undefined;
            market.destroy();
        }
        unknownMarkets.clear();

        this.marketBoards.clear();
        this.defaultExchangeEnvironmentMarketBoards.clear();
        this.unknownMarketBoards.clear();

        const tradingMarkets = this.tradingMarkets;
        const tradingMarketCount = tradingMarkets.count;
        for (let i = 0; i < tradingMarketCount; i++) {
            const tradingMarket = tradingMarkets.getAt(i);
            tradingMarket.destroy();
        }
        tradingMarkets.clear();
        this.defaultExchangeEnvironmentTradingMarkets.clear();

        const unknownTradingMarkets = this.unknownTradingMarkets;
        const unknownTradingMarketCount = unknownTradingMarkets.count;
        for (let i = 0; i < unknownTradingMarketCount; i++) {
            const tradingMarket = unknownTradingMarkets.getAt(i);
            tradingMarket.destroy();
        }
        unknownTradingMarkets.clear();

        const exchanges = this.exchanges;
        const exchangeCount = exchanges.count;
        for (let i = 0; i < exchangeCount; i++) {
            const exchange = exchanges.getAt(i);
            exchange.destroy();
        }
        exchanges.clear();
        this.defaultExchangeEnvironmentExchanges.clear();

        const unknownExchanges = this.unknownExchanges;
        const unknownExchangeCount = unknownExchanges.count;
        for (let i = 0; i < unknownExchangeCount; i++) {
            const exchange = unknownExchanges.getAt(i);
            exchange.destroy();
        }
        unknownExchanges.clear();

        const exchangeEnvironments = this.exchangeEnvironments;
        const exchangeEnvironmentCount = exchangeEnvironments.count;
        for (let i = 0; i < exchangeEnvironmentCount; i++) {
            const exchangeEnvironment = exchangeEnvironments.getAt(i);
            exchangeEnvironment.destroy();
        }
        exchangeEnvironments.clear();

        const unknownExchangeEnvironments = this.unknownExchangeEnvironments;
        const unknownExchangeEnvironmentCount = unknownExchangeEnvironments.count;
        for (let i = 0; i < unknownExchangeEnvironmentCount; i++) {
            const exchangeEnvironment = unknownExchangeEnvironments.getAt(i);
            exchangeEnvironment.destroy();
        }
        unknownExchangeEnvironments.clear();

        this.endChange();
    }

    private startLoadOrAddZenithDataMarkets(zenithDataMarketIdx: Integer, zenithDataMarketAddCount: Integer): void {
        const loading = !this._started;

        let addedZenithDataMarkets: ZenithDataMarket[];
        if (loading) {
            addedZenithDataMarkets = this._zenithDataMarkets.rangeToArray(zenithDataMarketIdx, zenithDataMarketAddCount);
        } else {
            addedZenithDataMarkets = this.resolveAddedZenithDataMarkets(zenithDataMarketIdx, zenithDataMarketAddCount);
        }

        const newExchangeEnvironments = new Array<ExchangeEnvironment>();

        const {
            resolvedNewExchanges: { defaultDefaultExchange, newExchanges, newDefaultExchangeEnvironmentExchanges },
            newDataMarkets,
            newDefaultExchangeEnvironmentDataMarkets,
            newTradingMarkets,
            newDefaultExchangeEnvironmentTradingMarkets,
        } = this.createNewExchangesAndMarkets(addedZenithDataMarkets, loading, newExchangeEnvironments);

        let initialMarketBoards: MarketBoard[] | undefined;
        let initialDefaultExchangeEnvironmentMarketBoards: MarketBoard[] | undefined;
        if (loading) {
            initialMarketBoards = DataMarket.arrayToFlatMarketBoardArray(newDataMarkets);
            initialDefaultExchangeEnvironmentMarketBoards = DataMarket.arrayToFlatMarketBoardArray(newDefaultExchangeEnvironmentDataMarkets);
        } else {
            initialMarketBoards = undefined;
            initialDefaultExchangeEnvironmentMarketBoards = undefined;
        }

        this.beginChange();

        if (defaultDefaultExchange !== undefined) {
            this._defaultDefaultExchange = defaultDefaultExchange;
        }

        this.addNewExchangeEnvironments(newExchangeEnvironments);
        this.addNewExchanges(newExchanges);
        this.addNewDefaultExchangeEnvironmentExchanges(newDefaultExchangeEnvironmentExchanges);
        this.addNewDataMarkets(newDataMarkets);
        this.addNewDefaultExchangeEnvironmentDataMarkets(newDefaultExchangeEnvironmentDataMarkets);

        if (newTradingMarkets !== undefined) {
            const tradingMarkets = this.tradingMarkets;
            if (tradingMarkets.count !== 0) {
                throw new AssertInternalError('MSCSLOAZDM88221');
            } else {
                this.tradingMarkets.addRange(newTradingMarkets);
            }
        }
        if (newDefaultExchangeEnvironmentTradingMarkets !== undefined) {
            const defaultExchangeEnvironmentTradingMarkets = this.defaultExchangeEnvironmentTradingMarkets;
            if (defaultExchangeEnvironmentTradingMarkets.count !== 0) {
                throw new AssertInternalError('MSCSLOAZDMD88221');
            } else {
                this.defaultExchangeEnvironmentTradingMarkets.addRange(newDefaultExchangeEnvironmentTradingMarkets);
            }
        }

        if (initialMarketBoards !== undefined) {
            this.addNewMarketBoards(initialMarketBoards);
        }
        if (initialDefaultExchangeEnvironmentMarketBoards !== undefined) {
            this.addNewDefaultExchangeEnvironmentMarketBoards(initialDefaultExchangeEnvironmentMarketBoards);
        }

        if (loading) { // checkStartLoadOrAddMarkets() succeeded if this._tradingMarketsDataItem is undefined
            this._started = true;
            const ftn = this._startedPromiseResolveFtn;
            if (ftn !== undefined) {
                this._startedPromiseResolveFtn = undefined;
                ftn();
            }
        }

        this.endChange();
    }

    private resolveAddedZenithDataMarkets(zenithDataMarketIdx: Integer, zenithDataMarketAddCount: Integer): ZenithDataMarket[] {
        const result = new Array<ZenithDataMarket>(zenithDataMarketAddCount);
        let resultCount = 0;

        const lastIdxPlus1 = zenithDataMarketIdx + zenithDataMarketAddCount;
        for (let i = zenithDataMarketIdx; i < lastIdxPlus1; i++) {
            const zenithDataMarket = this._zenithDataMarkets.getAt(i);
            const zenithCode = zenithDataMarket.zenithCode;
            const dataMarket = this.dataMarkets.findZenithCode(zenithCode);
            if (dataMarket === undefined) {
                result[resultCount++] = zenithDataMarket;
            } else {
                dataMarket.change(zenithDataMarket); // ZenithDataMarket implements change message
            }
        }

        result.length = resultCount;
        return result;
    }

    private createNewExchangesAndMarkets(
        addedZenithDataMarkets: ZenithDataMarket[],
        loading: boolean,
        newExchangeEnvironments: ExchangeEnvironment[],
    ): MarketsService.ResolvedNewExchangesAndMarkets {
        const addedZenithDataMarketCount = addedZenithDataMarkets.length;
        const unresolvedNewExchanges = new Array<MarketsService.UnresolvedNewExchange>();
        const unresolvedNewDataMarkets = new Array<MarketsService.UnresolvedNewDataMarket>(addedZenithDataMarketCount);
        let unresolvedNewTradingMarkets: MarketsService.UnresolvedNewTradingMarket[] | undefined;

        for (let i = 0; i < addedZenithDataMarketCount; i++) {
            const addedZenithDataMarket = addedZenithDataMarkets[i];
            unresolvedNewDataMarkets[i] = this.createUnresolvedNewDataMarket(addedZenithDataMarket, unresolvedNewExchanges, newExchangeEnvironments);
        }

        if (loading) {
            // Create Unresolved Trading Markets after initial Unresolved Data Markets so can link TradingMarket with corresponding DataMaket
            const tradingFeedMarkets = this._tradingFeedMarkets;
            if (tradingFeedMarkets === undefined) {
                throw new AssertInternalError('MSPORU31319');
            } else {
                const tradingFeedMarketCount = tradingFeedMarkets.length;

                unresolvedNewTradingMarkets = new Array<MarketsService.UnresolvedNewTradingMarket>(tradingFeedMarketCount);
                for (let i = 0; i < tradingFeedMarketCount; i++) {
                    const tradingFeedMarket = tradingFeedMarkets[i];
                    unresolvedNewTradingMarkets[i] = this.createUnresolvedNewTradingMarkets(tradingFeedMarket, newExchangeEnvironments, unresolvedNewExchanges, unresolvedNewDataMarkets);
                }
            }
        }

        const newDataMarkets =  this.resolveNewMarkets(this.dataMarkets, unresolvedNewDataMarkets);

        // Resolve TradingMarkets after DataMarkets as will use symbology from corresponding DataMarket if specified
        let newTradingMarkets: TradingMarket[] | undefined;
        if (unresolvedNewTradingMarkets !== undefined) {
            newTradingMarkets = this.resolveNewMarkets(this.tradingMarkets, unresolvedNewTradingMarkets);
        }

        if (unresolvedNewTradingMarkets !== undefined) {
            this.finishResolveTradingMarkets(unresolvedNewTradingMarkets);
        }
        this.finishResolveDataMarkets(unresolvedNewDataMarkets, newTradingMarkets);

        const resolvedNewExchanges = this.resolveNewExchanges(unresolvedNewExchanges, loading);

        let newDefaultExchangeEnvironmentTradingMarkets: TradingMarket[] | undefined;
        if (unresolvedNewTradingMarkets !== undefined) {
            newDefaultExchangeEnvironmentTradingMarkets = this.resolveNewDefaultExchangeEnvironmentMarkets(
                unresolvedNewTradingMarkets,
                resolvedNewExchanges.newDefaultExchangeEnvironmentExchanges
            );
        }

        const newDefaultExchangeEnvironmentDataMarkets =  this.resolveNewDefaultExchangeEnvironmentMarkets(
            unresolvedNewDataMarkets,
            resolvedNewExchanges.newDefaultExchangeEnvironmentExchanges
        );

        return {
            resolvedNewExchanges,
            newDataMarkets,
            newDefaultExchangeEnvironmentDataMarkets,
            newTradingMarkets,
            newDefaultExchangeEnvironmentTradingMarkets,
        };
    }

    private addNewExchangeEnvironments(newExchangeEnvironments: readonly ExchangeEnvironment[]) {
        const newExchangeEnvironmentCount = newExchangeEnvironments.length;
        if (newExchangeEnvironmentCount > 0) {
            if (this.exchangeEnvironments.count === 0) {
                this.exchangeEnvironments.addRangeAndUpdateProductionFlags(newExchangeEnvironments);
                this.exchangeEnvironments.sort();
            } else {
                for (let i = 0; i < newExchangeEnvironmentCount; i++) {
                    const newExchangeEnvironment = newExchangeEnvironments[i];
                    this.exchangeEnvironments.binaryInsertAndUpdateProductionFlags(newExchangeEnvironment);
                }
            }
        }
    }

    private addNewExchanges(newExchanges: Exchange[]) {
        const newExchangeCount = newExchanges.length;
        if (newExchangeCount > 0) {
            if (this.exchanges.count === 0) {
                newExchanges.sort(Exchange.compareByZenithCode);
                this.exchanges.addRange(newExchanges);
            } else {
                for (let i = 0; i < newExchangeCount; i++) {
                    const newExchange = newExchanges[i];
                    this.exchanges.binaryInsert(newExchange);
                }
            }
        }
    }

    private addNewDefaultExchangeEnvironmentExchanges(newExchanges: Exchange[]) {
        const newExchangeCount = newExchanges.length;
        if (newExchangeCount > 0) {
            if (this.defaultExchangeEnvironmentExchanges.count === 0) {
                newExchanges.sort(Exchange.compareByUnenvironmentedZenithCode);
                this.defaultExchangeEnvironmentExchanges.addRange(newExchanges);
            } else {
                for (let i = 0; i < newExchangeCount; i++) {
                    const newExchange = newExchanges[i];
                    this.defaultExchangeEnvironmentExchanges.binaryInsert(newExchange);
                }
            }
        }
    }

    private addNewDataMarkets(newMarkets: DataMarket[]) {
        const newMarketCount = newMarkets.length;
        if (newMarketCount > 0) {
            if (this.dataMarkets.count === 0) {
                newMarkets.sort(Market.compareByZenithCode);
                this.dataMarkets.addRange(newMarkets);
            } else {
                for (let i = 0; i < newMarketCount; i++) {
                    const newMarket = newMarkets[i];
                    this.dataMarkets.binaryInsert(newMarket);
                }
            }
        }
    }

    private addNewDefaultExchangeEnvironmentDataMarkets(newMarkets: DataMarket[]) {
        const newMarketCount = newMarkets.length;
        if (newMarketCount > 0) {
            if (this.defaultExchangeEnvironmentDataMarkets.count === 0) {
                newMarkets.sort(Market.compareByUnenvironmentedZenithCode);
                this.defaultExchangeEnvironmentDataMarkets.addRange(newMarkets);
            } else {
                for (let i = 0; i < newMarketCount; i++) {
                    const newMarket = newMarkets[i];
                    this.defaultExchangeEnvironmentDataMarkets.binaryInsert(newMarket);
                }
            }
        }
    }

    private addNewMarketBoards(newMarketBoards: MarketBoard[]) {
        const newMarketCount = newMarketBoards.length;
        if (newMarketCount > 0) {
            const marketBoards = this.marketBoards;
            if (marketBoards.count === 0) {
                newMarketBoards.sort(MarketBoard.compareByZenithCode);
                marketBoards.addRange(newMarketBoards);
            } else {
                for (let i = 0; i < newMarketCount; i++) {
                    const newMarketBoard = newMarketBoards[i];
                    marketBoards.binaryInsert(newMarketBoard);
                }
            }
        }
    }

    private addNewDefaultExchangeEnvironmentMarketBoards(newMarketBoards: MarketBoard[]) {
        const newMarketCount = newMarketBoards.length;
        if (newMarketCount > 0) {
            const marketBoards = this.defaultExchangeEnvironmentMarketBoards;
            if (marketBoards.count === 0) {
                newMarketBoards.sort(MarketBoard.compareByZenithCode);
                marketBoards.addRange(newMarketBoards);
            } else {
                for (let i = 0; i < newMarketCount; i++) {
                    const newMarketBoard = newMarketBoards[i];
                    marketBoards.binaryInsert(newMarketBoard);
                }
            }
        }
    }

    private createUnresolvedNewDataMarket(
        zenithMarket: ZenithDataMarket,
        unresolvedNewExchanges: MarketsService.UnresolvedNewExchange[],
        newExchangeEnvironments: ExchangeEnvironment[],
    ): MarketsService.UnresolvedNewDataMarket {
        const zenithCode = zenithMarket.zenithCode;
        const partsResult = ZenithMarketParts.tryParse(zenithCode);
        if (partsResult.isErr()) {
            const { code: errorCode, extra } = partsResult.error;
            throw new ZenithDataError(errorCode, `${extra}: New unresolved zenith market`);
        } else {
            const parts = partsResult.value;
            const zenithExchangeCode = parts.exchange;
            const exchangeEnvironment = this.getOrCreateExchangeEnvironment(parts.environment, newExchangeEnvironments);
            const exchange = this.getOrCreateExchange(zenithExchangeCode, exchangeEnvironment, unresolvedNewExchanges);

            const unenvironmentedZenithCode = ZenithMarketParts.createSymbolFromDestructured(zenithExchangeCode, parts.m1, parts.m2, undefined);
            const marketConfig = this.findDataMarketConfig(unenvironmentedZenithCode, zenithExchangeCode);

            let configName: string | undefined;
            let configDisplay: string | undefined;
            let configDisplayPriority: number | undefined;
            let configLit: boolean | undefined;
            let configBoards: readonly MarketsConfig.Exchange.DataMarket.Board[] | undefined;
            let configSymbologyExchangeSuffixCode: string | undefined;
            let configBestTradingMarketZenithCode: string | undefined;
            let configSymbologySupportedExchangeZenithCodes: readonly string[] | undefined;
            if (marketConfig !== undefined) {
                configName = marketConfig.name;
                configDisplay = marketConfig.display;
                configDisplayPriority = marketConfig.displayPriority;
                configLit = marketConfig.lit;
                configBoards = marketConfig.boards;
                configSymbologyExchangeSuffixCode = marketConfig.symbologyExchangeSuffixCode;
                configSymbologySupportedExchangeZenithCodes = marketConfig.symbologySupportedExchanges;
                configBestTradingMarketZenithCode = marketConfig.bestTradingMarketZenithCode;
            }

            const name = configName ?? zenithCode;
            const display = configDisplay ?? name;
            const lit = configLit ?? true;
            const boards = configBoards ?? [];

            // let exchangeDefaultLitMarketZenithCode: string | undefined;
            // if (unresolvedNewExchange === undefined) {
            //     exchangeDefaultLitMarketZenithCode = exchange.defaultLitMarket.zenithCode;
            // } else {
            //     const configDefaultLitMarketZenithCode = unresolvedNewExchange.configDefaultLitMarketZenithCode;
            //     if (configDefaultLitMarketZenithCode !== null) {
            //         exchangeDefaultLitMarketZenithCode = configDefaultLitMarketZenithCode;
            //     }
            // }

            // const exchangeDefault = exchangeDefaultLitMarketZenithCode !== undefined && exchangeDefaultLitMarketZenithCode === zenithCode;

            const market = new DataMarket(
                this._adiService,
                zenithCode,
                name,
                display,
                exchange,
                exchangeEnvironment,
                boards,
                lit,
                configDisplayPriority,
                false,
                zenithMarket,
                this.dataMarkets.correctnessId
            );
            market.marketBoardListChangeForMarketServiceEventer = (listChangeTypeId, index, count) => this.handleMarketBoardListChange(
                market,
                listChangeTypeId,
                index,
                count,
            );
            const newMarket: MarketsService.UnresolvedNewDataMarket = {
                market,
                configName,
                configSymbologyExchangeSuffixCode,
                configSymbologySupportedExchangeZenithCodes,
                specifiedExchange: undefined,
                symbologicalCorrespondingDataMarket: undefined,
                configBestTradingMarketZenithCode,
            };

            return newMarket;
        }
    }

    private getOrCreateExchangeEnvironment(
        zenithCode: ExchangeEnvironmentZenithCode,
        newExchangeEnvironments: ExchangeEnvironment[],
    ) {
        let exchangeEnvironment = this.exchangeEnvironments.find((environment) => environment.zenithCode === zenithCode);
        if (exchangeEnvironment === undefined) {
            exchangeEnvironment = newExchangeEnvironments.find((environment) => environment.zenithCode === zenithCode);
            if (exchangeEnvironment === undefined) {
                const exchangeEnvironmentConfig = this.findExchangeEnvironmentConfig(zenithCode);
                exchangeEnvironment = new ExchangeEnvironment(zenithCode, false, exchangeEnvironmentConfig, this._config.productionExchangeEnvironmentList);
                newExchangeEnvironments.push(exchangeEnvironment);
            }
        }

        return exchangeEnvironment;
    }

    private getOrCreateExchange(
        zenithExchangeCode: string, // unenvironmented zenith code
        exchangeEnvironment: ExchangeEnvironment,
        unresolvedNewExchanges: MarketsService.UnresolvedNewExchange[]
    ): Exchange {
        const marketEnvironmentZenithCode = exchangeEnvironment.zenithCode;

        let exchange = this.exchanges.findZenithExchangeCodeWithEnvironmentZenithCode(zenithExchangeCode, marketEnvironmentZenithCode);
        let unresolvedNewExchange: MarketsService.UnresolvedNewExchange | undefined;
        if (exchange === undefined) {
            unresolvedNewExchange = unresolvedNewExchanges.find((existingUnresolvedNewExchange) => {
                const existingExchange = existingUnresolvedNewExchange.exchange;
                return existingExchange.unenvironmentedZenithCode === zenithExchangeCode && existingExchange.exchangeEnvironment.zenithCode === marketEnvironmentZenithCode;
            })

            if (unresolvedNewExchange !== undefined) {
                exchange = unresolvedNewExchange.exchange;
            } else {
                const exchangeConfig = this.findExchangeConfig(zenithExchangeCode);
                exchange = new Exchange(zenithExchangeCode, exchangeEnvironment, exchangeConfig, false);

                unresolvedNewExchange = {
                    exchange,
                    configDefaultExchangeEnvironmentZenithCode: exchangeConfig?.defaultExchangeEnvironmentZenithCode,
                    configSymbologyCode: exchangeConfig?.symbologyCode,
                    configAbbreviatedDisplay: exchangeConfig?.abbreviatedDisplay,
                    configFullDisplay: exchangeConfig?.fullDisplay,
                    configDefaultLitMarketZenithCode: exchangeConfig?.defaultLitMarketZenithCode,
                    configDefaultTradingMarketZenithCode: exchangeConfig?.defaultTradingMarketZenithCode,
                };

                unresolvedNewExchanges.push(unresolvedNewExchange);
            }
        }
        return exchange;
    }

    private resolveNewExchanges(unresolvedNewExchanges: readonly MarketsService.UnresolvedNewExchange[], loading: boolean) {
        const unresolvedNewExchangeCount = unresolvedNewExchanges.length;
        const newExchanges = new Array<Exchange>(unresolvedNewExchangeCount);
        let newExchangeCount = 0;

        const defaultExchangeEnvironmentExchangesResolver = new MarketsService.DefaultExchangeEnvironmentExchangesResolver(
            this.exchanges,
            this._config.defaultExchangeEnvironmentPriorityList ?? MarketsConfig.defaultDefaultExchangeEnvironmentPriorityList,
        );

        // Resolve in 2 passes.

        // First pass
        // Check for data environment default
        // Set the configSymbologyCode if it is defined and unique
        for (let i = 0; i < unresolvedNewExchangeCount; i++) {
            const unresolvedNewExchange = unresolvedNewExchanges[i];
            const exchange = unresolvedNewExchange.exchange;

            defaultExchangeEnvironmentExchangesResolver.checkForDefault(exchange, unresolvedNewExchange.configDefaultExchangeEnvironmentZenithCode)

            const configSymbologyCode = unresolvedNewExchange.configSymbologyCode;
            if (configSymbologyCode !== undefined && configSymbologyCode.length > 1) {
                const symbologyCode = configSymbologyCode.substring(0, 2);
                if (this.checkExchangeSymbologyCodeUnique(symbologyCode, newExchanges, newExchangeCount, undefined)) { // ToDo add support for match zenithExchangeCode errors
                    exchange.setSymbologyCode(symbologyCode);
                    newExchanges[newExchangeCount++] = exchange;
                }
            }

            const defaultLitMarket = this.calculateExchangeDefaultLitMarket(exchange, unresolvedNewExchange.configDefaultLitMarketZenithCode);
            const defaultTradingMarket = this.calculateExchangeDefaultTradingMarket(exchange, unresolvedNewExchange.configDefaultTradingMarketZenithCode, defaultLitMarket);
            exchange.setDefaultMarkets(defaultLitMarket, defaultTradingMarket);
        }

        defaultExchangeEnvironmentExchangesResolver.addWarnings(this._warningsService);
        const newDefaultExchangeEnvironmentExchanges = defaultExchangeEnvironmentExchangesResolver.getExchanges();

        const defaultDefaultExchange = loading ?  this.calculateDefaultDefaultExchange(newDefaultExchangeEnvironmentExchanges) : undefined;

        // Do second pass
        // Sets symbologyCode for exchanges in which it was not set in first pass.

        for (let i = 0; i < unresolvedNewExchangeCount; i++) {
            const unresolvedNewExchange = unresolvedNewExchanges[i];
            const exchange = unresolvedNewExchange.exchange;
            if (!newExchanges.includes(exchange)) {
                const code = this.generateExchangeSymbologyCode(unresolvedNewExchange, newExchanges, newExchangeCount);
                exchange.setSymbologyCode(code);
                newExchanges[newExchangeCount++] = exchange;
            }
            exchange.setIsDefaultDefault(exchange === defaultDefaultExchange);
        }

        const resolvedNewExchanges: MarketsService.ResolvedNewExchanges = {
            defaultDefaultExchange,
            newExchanges,
            newDefaultExchangeEnvironmentExchanges,
        };

        return resolvedNewExchanges;
    }

    private calculateDefaultDefaultExchange(newDefaultExchangeEnvironmentExchanges: Exchange[]): Exchange {
        let defaultDefaultExchange: Exchange | undefined;
        const configDefaultDefaultZenithExchangeCode = this._config.defaultDefaultZenithExchangeCode;
        if (configDefaultDefaultZenithExchangeCode !== undefined) {
            // Default exchange has been explicity specified. Use this to also select default environment
            defaultDefaultExchange = newDefaultExchangeEnvironmentExchanges.find((exchange) => exchange.unenvironmentedZenithCode === configDefaultDefaultZenithExchangeCode);
            if (defaultDefaultExchange === undefined) {
                // No exchange has code configDefaultDefaultZenithExchangeCode.  Ignore it and report warning
                this._warningsService.add(WarningsService.TypeId.ServerConfig, Strings[StringId.Warning_ConfigDefaultDefaultExchangeNotFound]);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (defaultDefaultExchange === undefined) {
            // Default exchange was not explicity specified or could not be found.
            const defaultExchangeEnvironmentPriorityList = this._config.defaultExchangeEnvironmentPriorityList ?? MarketsConfig.defaultDefaultExchangeEnvironmentPriorityList;
            if (defaultExchangeEnvironmentPriorityList.length > 0) {
                // Use first exchange in newDefaultExchangeEnvironmentExchanges with highest priority Data Environment
                const highestPriorityListIndex = newDefaultExchangeEnvironmentExchanges.reduce<Integer>(
                    (currentHighestPriorityListIndex, exchange) => MarketsService.DefaultExchangeEnvironmentExchangesResolver.getHigherPriorityListIndex(
                            defaultExchangeEnvironmentPriorityList,
                            currentHighestPriorityListIndex,
                            exchange,
                    ),
                    -1,
                );
                if (highestPriorityListIndex >= 0) {
                    const defaultExchangeEnvironmentZenithCode = defaultExchangeEnvironmentPriorityList[highestPriorityListIndex];
                    // find first exchange with this data environment
                    defaultDefaultExchange = newDefaultExchangeEnvironmentExchanges.find((exchange) => exchange.exchangeEnvironment.zenithCode === defaultExchangeEnvironmentZenithCode);
                    if (defaultDefaultExchange === undefined) {
                        // should always be found
                        throw new AssertInternalError('MSCDDEHPLI41096', defaultExchangeEnvironmentZenithCode === null ? '<null>' : defaultExchangeEnvironmentZenithCode);
                    }
                } else {
                    // None of the Data Environments were included in the defaultExchangeEnvironmentPriorityList
                    if (this._config.defaultExchangeEnvironmentPriorityList !== undefined) {
                        // The defaultExchangeEnvironmentPriorityList was explicitly specified so generate a warning
                        this._warningsService.add(WarningsService.TypeId.ServerConfig, Strings[StringId.Warning_ConfigDefaultExchangeEnvironmentPriorityListHadNoMatches]);
                    }
                }
            }
        }

        if (defaultDefaultExchange === undefined) {
            // Config defaultExchangeEnvironmentPriorityList was not specified or none of the exchange's data environments were included in list
            // Use first exchange in newDefaultExchangeEnvironmentExchanges whose data environment has the most (or equal most) number of exchanges

            defaultDefaultExchange = newDefaultExchangeEnvironmentExchanges.reduce(
                (previousHighestNumberExchange, exchange, index) => {
                    if (exchange.exchangeEnvironment.exchangeCount > previousHighestNumberExchange.exchangeEnvironment.exchangeCount) {
                        return exchange;
                    } else {
                        return previousHighestNumberExchange;
                    }
                }
            );

        }

        return defaultDefaultExchange;
    }

    private resolveNewMarkets<T extends Market>(
        existingMarkets: MarketsService.Markets<T>,
        unresolvedNewMarkets: readonly MarketsService.UnresolvedNewMarket<T>[],
    ) {

        const symbologyExchangeSuffixCodeMap = new MarketsService.SymbologyExchangeSuffixCodeMap();
        const existingMarketCount = existingMarkets.count;
        for (let i = 0; i < existingMarketCount; i++) {
            const market = existingMarkets.getAt(i);
            symbologyExchangeSuffixCodeMap.set(market.exchange, market.symbologyExchangeSuffixCode);
        }

        const unresolvedNewMarketCount = unresolvedNewMarkets.length;
        const symbologyExchangeSuffixCodeSetFlags = new Array<boolean>(unresolvedNewMarketCount);
        symbologyExchangeSuffixCodeSetFlags.fill(false);

        // Resolve symbologyExchangeSuffixCode in 3 passes.

        // First pass
        // Resolve SymbologySupportedExchanges and set SymbologyExchangeSuffixCode where specified in config
        for (let i = 0; i < unresolvedNewMarketCount; i++) {
            const unresolvedNewMarket = unresolvedNewMarkets[i];

            this.resolveNewMarketSymbologySupportedExchanges(unresolvedNewMarket);

            const configSymbologyExchangeSuffixCode = unresolvedNewMarket.configSymbologyExchangeSuffixCode;
            if (configSymbologyExchangeSuffixCode !== undefined && configSymbologyExchangeSuffixCode.length > 0) {
                const code = configSymbologyExchangeSuffixCode[0];
                const exchange = unresolvedNewMarket.market.exchange;
                if (!symbologyExchangeSuffixCodeMap.has(exchange, code)) {
                    unresolvedNewMarket.market.setSymbologyExchangeSuffixCode(code);
                    symbologyExchangeSuffixCodeMap.set(exchange, code);
                    symbologyExchangeSuffixCodeSetFlags[i] = true;
                }
            }
        }

        // Second Pass
        // Set SymbologyExchangeSuffixCode where specified in corresponding DataMarket
        for (let i = 0; i < unresolvedNewMarketCount; i++) {
            if (!symbologyExchangeSuffixCodeSetFlags[i]) {
                const unresolvedNewMarket = unresolvedNewMarkets[i];
                const symbologicalCorrespondingDataMarket = unresolvedNewMarket.symbologicalCorrespondingDataMarket;
                if (symbologicalCorrespondingDataMarket !== undefined) {
                    const code = symbologicalCorrespondingDataMarket.symbologyExchangeSuffixCode;
                    const exchange = unresolvedNewMarket.market.exchange;
                    if (symbologyExchangeSuffixCodeMap.has(exchange, code)) {
                        this._warningsService.add(
                            WarningsService.TypeId.ServerConfig,
                            `${Strings[StringId.Warning_CorrespondingSymbologyExchangeSuffixCodeAlreadyInUse]}: ${unresolvedNewMarket.market.zenithCode} "${code}"`);
                    } else {
                        unresolvedNewMarket.market.setSymbologyExchangeSuffixCode(code);
                        symbologyExchangeSuffixCodeMap.set(exchange, code);
                        symbologyExchangeSuffixCodeSetFlags[i] = true;
                    }
                }
            }
        }


        // Third Pass
        // Generate a SymbologyExchangeSuffixCode for remaining markets
        // Populate newMarkets
        const newMarkets = new Array<T>(unresolvedNewMarketCount);

        for (let i = 0; i < unresolvedNewMarketCount; i++) {
            const unresolvedNewMarket = unresolvedNewMarkets[i];
            const newMarket = unresolvedNewMarket.market;
            if (!symbologyExchangeSuffixCodeSetFlags[i]) {
                const exchange = unresolvedNewMarket.market.exchange;
                const codeMap = symbologyExchangeSuffixCodeMap.getCodeMap(exchange);
                const code = this.generateMarketSymbologyExchangeSuffixCode(newMarket, unresolvedNewMarket.configName, codeMap);
                newMarket.setSymbologyExchangeSuffixCode(code);
                codeMap.set(code, undefined);
            }
            newMarkets[i] = newMarket;
        }

        return newMarkets;
    }

    private resolveNewDefaultExchangeEnvironmentMarkets<T extends Market>(
        unresolvedNewMarkets: readonly MarketsService.UnresolvedNewMarket<T>[],
        newDefaultExchangeEnvironmentExchanges: readonly Exchange[],
    ) {
        const unresolvedNewMarketCount = unresolvedNewMarkets.length;
        const newDefaultExchangeEnvironmentMarkets = new Array<T>(unresolvedNewMarketCount);
        let newDefaultExchangeEnvironmentMarketCount = 0;

        for (let i = 0; i < unresolvedNewMarketCount; i++) {
            const unresolvedNewMarket = unresolvedNewMarkets[i];
            const newMarket = unresolvedNewMarket.market;

            const newMarketExchange = newMarket.exchange;
            if (this.defaultExchangeEnvironmentExchanges.contains(newMarketExchange) || newDefaultExchangeEnvironmentExchanges.includes(newMarketExchange)) {
                newMarket.setExchangeEnvironmentIsDefault(true);
                newDefaultExchangeEnvironmentMarkets[newDefaultExchangeEnvironmentMarketCount++] = newMarket;
            }
        }

        newDefaultExchangeEnvironmentMarkets.length = newDefaultExchangeEnvironmentMarketCount;

        return newDefaultExchangeEnvironmentMarkets;
    }

    private finishResolveTradingMarkets(
        unresolvedNewTradingMarkets: readonly MarketsService.UnresolvedNewTradingMarket[],
    ) {
        const unresolvedNewTradingMarketCount = unresolvedNewTradingMarkets.length;
        for (let i = 0; i < unresolvedNewTradingMarketCount; i++) {
            const unresolvedNewTradingMarket = unresolvedNewTradingMarkets[i];
            const symbologicalCorrespondingDataMarket = unresolvedNewTradingMarket.symbologicalCorrespondingDataMarket;
            if (symbologicalCorrespondingDataMarket !== undefined) {
                unresolvedNewTradingMarket.market.setSymbologicalCorrespondingDataMarket(symbologicalCorrespondingDataMarket);
            }

        }
    }

    private finishResolveDataMarkets(
        unresolvedNewDataMarkets: readonly MarketsService.UnresolvedNewDataMarket[],
        newTradingMarkets: readonly TradingMarket[] | undefined,
    ) {
        const existingTradingMarkets = this.tradingMarkets;
        const unresolvedNewDataMarketCount = unresolvedNewDataMarkets.length;
        for (let i = 0; i < unresolvedNewDataMarketCount; i++) {
            const unresolvedNewDataMarket = unresolvedNewDataMarkets[i];
            const newDataMarket = unresolvedNewDataMarket.market;

            const configBestTradingMarketZenithCode = unresolvedNewDataMarket.configBestTradingMarketZenithCode;

            // Try calculating bestTradingMarket with explicitly defined config entry
            let bestTradingMarket: TradingMarket | undefined;
            if (configBestTradingMarketZenithCode !== undefined) {
                if (newTradingMarkets !== undefined) {
                    bestTradingMarket = newTradingMarkets.find((market) => market.zenithCode === configBestTradingMarketZenithCode);
                }
                if (bestTradingMarket === undefined) {
                    if (existingTradingMarkets.count > 0) {
                        bestTradingMarket = existingTradingMarkets.findZenithCode(configBestTradingMarketZenithCode);
                    }
                }
            }

            // Try setting bestTradingMarket to a symbological corresponding trading market
            if (bestTradingMarket === undefined) {
                if (newTradingMarkets !== undefined) {
                    bestTradingMarket = newTradingMarkets.find((market) => market.symbologicalCorrespondingDataMarket === newDataMarket);
                }
                if (bestTradingMarket === undefined) {
                    if (existingTradingMarkets.count > 0) {
                        bestTradingMarket = existingTradingMarkets.find((market) => market.symbologicalCorrespondingDataMarket === newDataMarket);
                    }
                }
            }

            // Get all new trading markets which specify this data market as its bestLitDataMarket.  Use first found as bestTradingMarket if not previously set
            const bestLitFor = new Array<TradingMarket>();
            if (newTradingMarkets !== undefined) {
                const newTradingMarketCount = newTradingMarkets.length;
                for (let tradingMarketIdx = 0; tradingMarketIdx < newTradingMarketCount; tradingMarketIdx++) {
                    const newTradingMarket = newTradingMarkets[tradingMarketIdx];
                    if (newTradingMarket.bestLitDataMarket === newDataMarket) {
                        bestLitFor.push(newTradingMarket);
                        if (bestTradingMarket === undefined) {
                            bestTradingMarket = newTradingMarket;
                        }
                    }
                }
            }

            // Get all existing trading markets which specify this data market as its bestLitDataMarket.  Use first found as bestTradingMarket if not previously set
            if (existingTradingMarkets.count > 0) {
                const tradingMarketCount = existingTradingMarkets.count;
                for (let tradingMarketIdx = 0; tradingMarketIdx < tradingMarketCount; tradingMarketIdx++) {
                    const newTradingMarket = existingTradingMarkets.getAt(tradingMarketIdx);
                    if (newTradingMarket.bestLitDataMarket === newDataMarket) {
                        bestLitFor.push(newTradingMarket);
                        if (bestTradingMarket === undefined) {
                            bestTradingMarket = newTradingMarket;
                        }
                    }
                }
            }

            newDataMarket.setBestTradingMarkets(bestTradingMarket, bestLitFor);
        }
    }

    private resolveNewMarketSymbologySupportedExchanges<T extends Market>(unresolvedNewMarket: MarketsService.UnresolvedNewMarket<T>) {
        let symbologySupportedExchanges: Exchange[];
        const symbologySupportedExchangeZenithCodes = unresolvedNewMarket.configSymbologySupportedExchangeZenithCodes;
        const marketExchange = unresolvedNewMarket.market.exchange;
        const specifiedExchange = unresolvedNewMarket.specifiedExchange;
        if (symbologySupportedExchangeZenithCodes === undefined) {
            const symbologicalCorrespondingDataMarket = unresolvedNewMarket.symbologicalCorrespondingDataMarket;
            symbologySupportedExchanges = symbologicalCorrespondingDataMarket === undefined ? [marketExchange] : symbologicalCorrespondingDataMarket.symbologySupportedExchanges.slice();
            if (specifiedExchange !== undefined && !symbologySupportedExchanges.includes(specifiedExchange)) {
                symbologySupportedExchanges.push(specifiedExchange);
            }
        } else {
            const symbologySupportedExchangeZenithCodeCount = symbologySupportedExchangeZenithCodes.length;
            symbologySupportedExchanges = new Array<Exchange>(symbologySupportedExchangeZenithCodeCount + 2);
            let symbologySupportedExchangeCount = 0;

            symbologySupportedExchanges[symbologySupportedExchangeCount++] = marketExchange;
            if (specifiedExchange !== undefined) {
                symbologySupportedExchanges[symbologySupportedExchangeCount++] = specifiedExchange;
            }

            for (let i = 0; i < symbologySupportedExchangeZenithCodeCount; i++) {
                const zenithCode = symbologySupportedExchangeZenithCodes[i];
                const symbologySupportedExchange = this.exchanges.find((exchange) => exchange.zenithCode === zenithCode);
                if (symbologySupportedExchange !== undefined) {
                    symbologySupportedExchanges[symbologySupportedExchangeCount++] = symbologySupportedExchange;
                }
            }
            symbologySupportedExchanges.length = symbologySupportedExchangeCount;
        }
        unresolvedNewMarket.market.setSymbologySupportedExchanges(symbologySupportedExchanges);
    }

    private calculateExchangeDefaultLitMarket(exchange: Exchange, configDefaultLitMarketZenithCode: string | null | undefined): DataMarket | undefined {
        if (configDefaultLitMarketZenithCode === null) {
            // Config specified no lit markets
            return undefined;
        } else {
            const markets = exchange.dataMarkets;
            const marketCount = markets.length;
            // If default is specified in config, try find matching market
            if (configDefaultLitMarketZenithCode !== undefined) {
                for (let i = 0; i < marketCount; i++) {
                    const market = markets[i];
                    if (market.zenithCode === configDefaultLitMarketZenithCode) {
                        return market;
                    }
                }
                this._warningsService.add(WarningsService.TypeId.ServerConfig, `Config for exchange (${exchange.zenithCode}) has unknown default lit market: ${configDefaultLitMarketZenithCode}`);
            }

            // Either default not specified in config or specified config not matched
            // Return first lit market with same exchangeEnvironment
            for (let i = 0; i < marketCount; i++) {
                const market = markets[i];
                if (market.lit && market.exchangeEnvironment === exchange.exchangeEnvironment) {
                    return market;
                }
            }

            // Return any lit market
            for (let i = 0; i < marketCount; i++) {
                const market = markets[i];
                if (market.lit) {
                    return market;
                }
            }

            // No market was lit - return unknown
            return undefined;
        }
    }

    private calculateExchangeDefaultTradingMarket(
        exchange: Exchange,
        configDefaultTradingMarketZenithCode: string | null | undefined,
        defaultLitMarket: DataMarket | undefined
    ): TradingMarket | undefined {
        if (configDefaultTradingMarketZenithCode === null) {
            // Config specified no trading markets
            return undefined;
        } else {
            const tradingMarkets = exchange.tradingMarkets;
            const tradingMarketCount = tradingMarkets.length;

            if (configDefaultTradingMarketZenithCode === undefined) {
                if (defaultLitMarket !== undefined) {
                    // Default is not specified in config however defaultLitMarket is provided.  See if that has a corresponding trading market
                    const bestCorrespondingTradingMarket = defaultLitMarket.bestTradingMarket;
                    if (bestCorrespondingTradingMarket !== undefined) {
                        return bestCorrespondingTradingMarket;
                    }
                }
            } else {
                // Default is specified in config, try find matching market
                for (let i = 0; i < tradingMarketCount; i++) {
                    const market = tradingMarkets[i];
                    if (market.zenithCode === configDefaultTradingMarketZenithCode) {
                        return market;
                    }
                }
                this._warningsService.add(WarningsService.TypeId.ServerConfig, `Config for exchange (${exchange.zenithCode}) has unknown default market: ${configDefaultTradingMarketZenithCode}`);
            }

            // Default lit not specified and either default not specified in config or specified config not matched
            // Return first market with same exchangeEnvironment
            for (let i = 0; i < tradingMarketCount; i++) {
                const market = tradingMarkets[i];
                if (market.exchangeEnvironment === exchange.exchangeEnvironment) {
                    return market;
                }
            }

            // Return first market
            if (tradingMarkets.length > 0) {
                return tradingMarkets[0];
            }

            // No markets - return unknown
            return undefined;
        }
    }

    private createUnresolvedNewTradingMarkets(
        feedMarket: TradingFeed.Market,
        newExchangeEnvironments: ExchangeEnvironment[],
        unresolvedNewExchanges: MarketsService.UnresolvedNewExchange[],
        unresolvedNewDataMarkets: MarketsService.UnresolvedNewDataMarket[], // will contain all DataMarkets as not yet added to DataMarket lists
    ): MarketsService.UnresolvedNewTradingMarket {
        const zenithCode = feedMarket.zenithCode;

        const partsResult = ZenithMarketParts.tryParse(zenithCode);
        if (partsResult.isErr()) {
            const { code: errorCode, extra } = partsResult.error;
            throw new ZenithDataError(errorCode, `${extra}: New Unresolved Trading Market: ${zenithCode}`);
        } else {
            const zenithCodeParts = partsResult.value;
            const exchangeEnvironmentZenithCode = zenithCodeParts.environment;
            const exchangeEnvironment = this.getOrCreateExchangeEnvironment(exchangeEnvironmentZenithCode, newExchangeEnvironments);

            const exchangeCode = zenithCodeParts.exchange;
            const unenvironmentedZenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, zenithCodeParts.m1, zenithCodeParts.m2, undefined);
            const marketConfig = this.findTradingMarketConfig(unenvironmentedZenithCode, exchangeCode);

            let symbologicalCorrespondingDataMarket: DataMarket | undefined;
            const configSymbologicalCorrespondingDataMarketUnenvironmentedZenithCode = marketConfig?.symbologicalCorrespondingDataMarketZenithCode;
            let symbologicalCorrespondingDataMarketEnvironmentedZenithCode: string | undefined;
            if (configSymbologicalCorrespondingDataMarketUnenvironmentedZenithCode !== undefined) {
                symbologicalCorrespondingDataMarketEnvironmentedZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(
                    configSymbologicalCorrespondingDataMarketUnenvironmentedZenithCode,
                    exchangeEnvironmentZenithCode,
                );
                symbologicalCorrespondingDataMarket = MarketsService.UnresolvedNewMarket.findMarketInArray(
                    symbologicalCorrespondingDataMarketEnvironmentedZenithCode,
                    unresolvedNewDataMarkets
                );
            }

            if (symbologicalCorrespondingDataMarket === undefined && zenithCode !== symbologicalCorrespondingDataMarketEnvironmentedZenithCode) {
                symbologicalCorrespondingDataMarket = MarketsService.UnresolvedNewMarket.findMarketInArray(zenithCode, unresolvedNewDataMarkets);
            }

            let exchange: Exchange | undefined;
            if (symbologicalCorrespondingDataMarket !== undefined) {
                // If got corresponding data market, then it will have the same exchange
                exchange = symbologicalCorrespondingDataMarket.exchange;
            } else {
                exchange = this.getOrCreateExchange(exchangeCode, exchangeEnvironment, unresolvedNewExchanges);
            }

            let specifiedExchange: Exchange | undefined;
            const feedExchangeZenithCode = feedMarket.exchangeZenithCode;
            if (feedExchangeZenithCode !== undefined && feedExchangeZenithCode !== exchange.zenithCode) {
                // Mismatch between ZenithCode and Exchange specified in FeedTradingMarket.  Add Exchange and include in supported symbology exchanges (when resolving)
                const {value: feedExchangeCode, environmentZenithCode: feedExchangeEnvironmentZenithCode} = ZenithEnvironmentedValueParts.fromString(feedExchangeZenithCode);
                const feedExchangeEnvironment = this.getOrCreateExchangeEnvironment(feedExchangeEnvironmentZenithCode, newExchangeEnvironments);
                specifiedExchange = this.getOrCreateExchange(feedExchangeCode, feedExchangeEnvironment, unresolvedNewExchanges);
            }

            let bestLitDataMarket: DataMarket | undefined;
            const bestSourceDataMarketZenithCode = feedMarket.bestSourceDataMarketZenithCode;
            if (bestSourceDataMarketZenithCode === undefined) {
                bestLitDataMarket = undefined;
            } else {
                bestLitDataMarket = MarketsService.UnresolvedNewMarket.findMarketInArray(bestSourceDataMarketZenithCode, unresolvedNewDataMarkets);
            }

            // let exchangeDefaultTradingMarketZenithCode: string | undefined;
            // if (unresolvedNewExchange === undefined) {
            //     exchangeDefaultTradingMarketZenithCode = exchange.defaultTradingMarket.zenithCode;
            // } else {
            //     const configDefaultTradingMarketZenithCode = unresolvedNewExchange.configDefaultTradingMarketZenithCode;
            //     if (configDefaultTradingMarketZenithCode !== null) {
            //         exchangeDefaultTradingMarketZenithCode = configDefaultTradingMarketZenithCode;
            //     }
            // }

            // const exchangeDefault = exchangeDefaultTradingMarketZenithCode !== undefined && exchangeDefaultTradingMarketZenithCode === zenithCode;
            // const correspondingExchange = exchange;

            let configName: string | undefined;
            let configDisplay: string | undefined;
            let configDisplayPriority: number | undefined;
            let configSymbologyExchangeSuffixCode: string | undefined;
            let configSymbologySupportedExchangeZenithCodes: readonly string[] | undefined;
            if (marketConfig !== undefined) {
                configName = marketConfig.name;
                configDisplay = marketConfig.display;
                configDisplayPriority = marketConfig.displayPriority;
                configSymbologyExchangeSuffixCode = marketConfig.symbologyExchangeSuffixCode;
                configSymbologySupportedExchangeZenithCodes = marketConfig.symbologySupportedExchanges;
            }

            const name = configName ?? zenithCode;
            const display = configDisplay ?? name;

            const tradingMarket = new TradingMarket(
                zenithCode,
                name,
                display,
                exchange,
                exchangeEnvironment,
                feedMarket.isLit,
                configDisplayPriority,
                false,
                feedMarket.feed,
                feedMarket.attributes,
                bestLitDataMarket,
                marketConfig,
            );

            const unresolvedNewTradingMarket: MarketsService.UnresolvedNewTradingMarket = {
                market: tradingMarket,
                configName,
                configSymbologyExchangeSuffixCode,
                configSymbologySupportedExchangeZenithCodes,
                symbologicalCorrespondingDataMarket,
                specifiedExchange,
            }
            return unresolvedNewTradingMarket;
        }
    }

    private generateExchangeSymbologyCode(unresolvedNewExchange: MarketsService.UnresolvedNewExchange, resolvedNewExchanges: readonly Exchange[], resolvedNewExchangeCount: Integer): string {
        const exchange = unresolvedNewExchange.exchange;
        const zenithExchangeCode = exchange.unenvironmentedZenithCode;
        const zenithExchangeCodeLength = zenithExchangeCode.length;

        // Try first character and one of the following characters in Exchange ZenithExchangeCode
        if (zenithExchangeCodeLength >= 2) {
            const firstChar = zenithExchangeCode[0];
            for (let i = 1; i < zenithExchangeCodeLength; i++) {
                const code = firstChar + zenithExchangeCode[i];
                if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                    return code;
                }
            }
        }

        // Try first character and one of the following characters in Exchange Abbreviated Display
        const configAbbreviatedDisplay = unresolvedNewExchange.configAbbreviatedDisplay;
        if (configAbbreviatedDisplay !== undefined) {
            const configAbbreviatedDisplayLength = configAbbreviatedDisplay.length;
            if (configAbbreviatedDisplayLength >= 2) {
                const firstChar = configAbbreviatedDisplay[0];
                for (let i = 1; i < configAbbreviatedDisplayLength; i++) {
                    const code = firstChar + configAbbreviatedDisplay[i];
                    if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                        return code;
                    }
                }
            }
        }

        // Try first character and one of the following characters in Exchange Full Display
        const configFullDisplay = unresolvedNewExchange.configFullDisplay;
        if (configFullDisplay !== undefined) {
            const configFullDisplayLength = configFullDisplay.length;
            if (configFullDisplayLength >= 2) {
                const firstChar = configFullDisplay[0];
                for (let i = 1; i < configFullDisplayLength; i++) {
                    const code = firstChar + configFullDisplay[i];
                    if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                        return code;
                    }
                }
            }
        }

        // Try first character of Zenith Exchange Code and 'X'
        if (zenithExchangeCodeLength >= 1) {
            const code = zenithExchangeCode[0] + 'X';
            if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                return code;
            }
        }

        // Try other Zenith Exchange Code substrings
        if (zenithExchangeCodeLength > 2) {
            const lastFirstCharIdx = zenithExchangeCodeLength - 2;
            for (let firstCharIdx = 1; firstCharIdx <= lastFirstCharIdx; firstCharIdx++) {
                const firstChar = zenithExchangeCode[firstCharIdx];
                for (let secondCharIdx = firstCharIdx + 1; secondCharIdx < zenithExchangeCodeLength; secondCharIdx++) {
                    const code = firstChar + zenithExchangeCode[secondCharIdx];
                    if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                        return code;
                    }
                }
            }
        }

        // Try other Abbreviated Display substrings
        if (configAbbreviatedDisplay !== undefined) {
            const configAbbreviatedDisplayLength = configAbbreviatedDisplay.length;
            if (configAbbreviatedDisplayLength > 2) {
                const lastFirstCharIdx = configAbbreviatedDisplayLength - 2;
                for (let firstCharIdx = 1; firstCharIdx <= lastFirstCharIdx; firstCharIdx++) {
                    const firstChar = configAbbreviatedDisplay[firstCharIdx];
                    for (let secondCharIdx = firstCharIdx + 1; secondCharIdx < configAbbreviatedDisplayLength; secondCharIdx++) {
                        const code = firstChar + configAbbreviatedDisplay[secondCharIdx];
                        if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                            return code;
                        }
                    }
                }
            }
        }

        // Try other Full Display substrings
        if (configFullDisplay !== undefined) {
            const configFullDisplayLength = configFullDisplay.length;
            if (configFullDisplayLength > 2) {
                const lastFirstCharIdx = configFullDisplayLength - 2;
                for (let firstCharIdx = 1; firstCharIdx <= lastFirstCharIdx; firstCharIdx++) {
                    const firstChar = configFullDisplay[firstCharIdx];
                    for (let secondCharIdx = firstCharIdx + 1; secondCharIdx < configFullDisplayLength; secondCharIdx++) {
                        const code = firstChar + configFullDisplay[secondCharIdx];
                        if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                            return code;
                        }
                    }
                }
            }
        }

        // Try character in Zenith Exchange Code followed by digit or uppercase ASCII character
        const digitOrUppercaseChars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digitOrUppercaseCharsLength = digitOrUppercaseChars.length;
        for (let firstCharIdx = 0; firstCharIdx < zenithExchangeCodeLength; firstCharIdx++) {
            const firstChar = zenithExchangeCode[firstCharIdx];
            for (let secondCharIdx = 0; secondCharIdx < digitOrUppercaseCharsLength; secondCharIdx++) {
                const code = firstChar + digitOrUppercaseChars[secondCharIdx];
                if (this.checkExchangeSymbologyCodeUnique(code, resolvedNewExchanges, resolvedNewExchangeCount, undefined)) {
                    return code;
                }
            }
        }

        // Too many exchanges specified.
        throw new ConfigError(ErrorCode.MarketsService_ExhaustedExchangeSymbologyCodes, 'MarketsService', zenithExchangeCode);
    }

    private checkExchangeSymbologyCodeUnique(
        code: string,
        resolvedNewExchanges: readonly Exchange[],
        resolvedNewExchangeCount: Integer,
        sameAsZenithExchangeCodeSymbologyCodes: string[] | undefined,
    ): boolean {
        const exchanges = this.exchanges;
        const exchangeCount = exchanges.count;

        for (let i = 0; i < exchangeCount; i++) {
            const exchange = exchanges.getAt(i);
            if (exchange.symbologyCode === code) {
                return false;
            } else {
                if (exchange.unenvironmentedZenithCode === code) {
                    if (sameAsZenithExchangeCodeSymbologyCodes !== undefined) {
                        sameAsZenithExchangeCodeSymbologyCodes.push(code);
                    }
                    return false;
                }
            }
        }

        for (let i = 0; i < resolvedNewExchangeCount; i++) {
            const exchange = resolvedNewExchanges[i];
            if (exchange.symbologyCode === code) {
                return false;
            } else {
                if (exchange.unenvironmentedZenithCode === code) {
                    if (sameAsZenithExchangeCodeSymbologyCodes !== undefined) {
                        sameAsZenithExchangeCodeSymbologyCodes.push(code);
                    }
                    return false;
                }
            }
        }

        return true;
    }

    private generateMarketSymbologyExchangeSuffixCode<T extends Market>(
        market: T,
        configName: string | undefined,
        existingSymbologyExchangeSuffixCodeMap: MarketsService.SymbologyExchangeSuffixCodeMap.CodeMap,
    ): string {
        const zenithCode = market.zenithCode;
        const exchangeCode = market.exchange.unenvironmentedZenithCode;
        const exchangeCodeLength = exchangeCode.length;

        // Try characters at end of Exchange ZenithCode - but not first 2 characters
        if (exchangeCodeLength > 2) {
            for (let i = exchangeCodeLength - 1; i >= 2; i--) {
                const code = exchangeCode[i];
                if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                    return code;
                }
            }
        }

        const zenithMarketPartsResult = ZenithMarketParts.tryParse(zenithCode);
        let m1: string | undefined;
        let m2: string | undefined;

        // try first character of m1
        if (zenithMarketPartsResult.isOk()) {
            const zenithMarketParts = zenithMarketPartsResult.value;
            m1 = zenithMarketParts.m1;
            if (m1 !== undefined && m1.length > 0) {
                const code = m1[0];
                if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                    return code;
                }
            } else {
                m2 = zenithMarketParts.m2;
            }
        }

        // try first character of name
        if (configName !== undefined && configName.length > 0) {
            const code = configName[0];
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // if m1 is undefined try first character of m2
        if (m1 === undefined && m2 !== undefined && m2.length > 0) {
            const code = m2[0];
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // try 'X' and 'N'
        const xCode = 'X'
        if (!existingSymbologyExchangeSuffixCodeMap.has(xCode)) {
            return xCode;
        }

        const nCode = 'N'
        if (!existingSymbologyExchangeSuffixCodeMap.has(nCode)) {
            return nCode;
        }

        // try other character in m1
        if (m1 !== undefined) {
            const m1Length = m1.length;
            for (let i = 0; i < m1Length; i++) {
                const code = m1[i];
                if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                    return code;
                }
            }
        }

        // try other character in name
        if (configName !== undefined) {
            const configNameLength = configName.length;
            for (let i = 0; i < configNameLength; i++) {
                const code = configName[i];
                if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                    return code;
                }
            }
        }

        // try (up to) first 2 characters in exchange zenith code
        const exchangeZenithCodeFirstCount = exchangeCodeLength >= 2 ? 2 : exchangeCodeLength;
        for (let i = 0; i < exchangeZenithCodeFirstCount; i++) {
            const code = exchangeCode[i];
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // use any capital letter
        for (let i = 65; i <= 90; i++) {
            const code = String.fromCharCode(i);
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // use any digit letter
        for (let i = 48; i <= 57; i++) {
            const code = String.fromCharCode(i);
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // use any digit letter
        for (let i = 48; i <= 57; i++) {
            const code = String.fromCharCode(i);
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // use a symbol
        const allowedSymbols = '_!#$%&~()*+=:;?\\<>^{|}';
        const allowedSymbolCount = allowedSymbols.length;
        for (let i = 0; i < allowedSymbolCount; i++) {
            const code = allowedSymbols[i];
            if (!existingSymbologyExchangeSuffixCodeMap.has(code)) {
                return code;
            }
        }

        // Tried most printable ASCII characters (excluding lower case characters). Too many markets in exchange. Give up.
        throw new ConfigError(ErrorCode.MarketsService_ExhaustedMarketSymbologyExchangeSuffixCodesForExchange, 'MarketsService', zenithCode);
    }

    private findExchangeConfig(zenithCode: string) {
        const exchangesConfig = this._config.exchanges;
        const exchangesConfigCount = exchangesConfig.length;
        for (let i = 0; i < exchangesConfigCount; i++) {
            const exchangeConfig = exchangesConfig[i];
            if (exchangeConfig.zenithCode === zenithCode) {
                return exchangeConfig;
            }
        }
        return undefined;
    }

    private findExchangeEnvironmentConfig(zenithCode: ExchangeEnvironmentZenithCode) {
        const exchangeEnvironmentsConfig = this._config.exchangeEnvironments;
        const exchangeEnvironmentsConfigCount = exchangeEnvironmentsConfig.length;
        for (let i = 0; i < exchangeEnvironmentsConfigCount; i++) {
            const exchangeEnvironmentConfig = exchangeEnvironmentsConfig[i];
            if (exchangeEnvironmentConfig.zenithCode === zenithCode) {
                return exchangeEnvironmentConfig;
            }
        }
        return undefined;
    }

    private findDataMarketConfig(zenithMarketCode: string, zenithExchangeCode: string) {
        const exchangeConfig = this.findExchangeConfig(zenithExchangeCode);
        if (exchangeConfig === undefined) {
            return undefined;
        } else {
            const marketsConfig = exchangeConfig.dataMarkets;
            const marketsConfigCount = marketsConfig.length;
            for (let i = 0; i < marketsConfigCount; i++) {
                const marketConfig = marketsConfig[i];
                if (marketConfig.zenithCode === zenithMarketCode) {
                    return marketConfig;
                }
            }
            return undefined;
        }
    }

    private findTradingMarketConfig(zenithMarketCode: string, zenithExchangeCode: string) {
        const exchangeConfig = this.findExchangeConfig(zenithExchangeCode);
        if (exchangeConfig === undefined) {
            return undefined;
        } else {
            const marketsConfig = exchangeConfig.tradingMarkets;
            const marketsConfigCount = marketsConfig.length;
            for (let i = 0; i < marketsConfigCount; i++) {
                const marketConfig = marketsConfig[i];
                if (marketConfig.zenithCode === zenithMarketCode) {
                    return marketConfig;
                }
            }
            return undefined;
        }
    }
}

export namespace MarketsService {
    export type InitialisationCompletedEventer = (this: void) => void;
    export type ChangeBegunEventHandler = (this: void) => void;
    export type ChangeEndedEventHandler = (this: void) => void;

    export type StartedPromiseResolveFtn = (this: void) => void;

    export abstract class Markets<T extends Market> extends BadnessComparableList<T, Market> {
        constructor(
            readonly marketTypeId: Market.TypeId,
            compareItemsFtn: CompareFtn<Market>,
            protected readonly _compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            readonly exchanges: Exchanges,
            readonly genericUnknownExchangeEnvironment: ExchangeEnvironment,
            readonly genericUnknownExchange: Exchange,
            readonly genericUnknownMarket: T,
            protected readonly _beginChangeEventer: Markets.BeginChangeEventer,
            protected readonly _endChangeEventer: Markets.EndChangeEventer,
            protected readonly _getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            protected readonly _getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
        ) {
            super(compareItemsFtn);
        }

        override clone(): Markets<T> {
            const result = this.createEmptyCopy(this._compareItemsFtn);
            result.assign(this);
            return result;
        }

        findZenithCode(value: string) {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const market = this.getAt(i);
                if (market.zenithCode === value) {
                    return market;
                }
            }
            return undefined;
        }

        findFirstUnenvironmentedZenithCode(value: string) {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const market = this.getAt(i);
                if (market.unenvironmentedZenithCode === value) {
                    return market;
                }
            }
            return undefined;
        }

        findFirstSymbologyCode(value: string) {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const market = this.getAt(i);
                if (market.symbologyCode === value) {
                    return market;
                }
            }
            return undefined;
        }

        binaryFind(zenithCode: string) {
            return this.binaryFindAny((market) => this._compareMarketPropertyToStringFtn(market, zenithCode));
        }

        binaryInsert(item: T) {
            const searchResult = this.binarySearchAny(item);
            this.insert(searchResult.index, item)
        }

        tryGetMarket(zenithCode: string, unknownAllowed: boolean): T | undefined {
            if (unknownAllowed) {
                return this.getMarketOrUnknown(zenithCode);
            } else {
                return this.findZenithCode(zenithCode);
            }
        }

        tryGetFirstUnenvironmentedZenithCode(unenvironmentedZenithCode: string, unknownAllowed: boolean): T | undefined {
            let market = this.findFirstUnenvironmentedZenithCode(unenvironmentedZenithCode);
            if (market === undefined && unknownAllowed) {
                const unknownEnvironmentedZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedZenithCode, unknownZenithCode)
                market = this.getMarketOrUnknown(unknownEnvironmentedZenithCode);
            }
            return market;
        }

        getMarketOrUnknown(zenithCode: string): T {
            const foundMarket = this.findZenithCode(zenithCode);

            if (foundMarket === undefined) {
                return this.getUnknownMarket(zenithCode);
            } else {
                return foundMarket;
            }
        }

        getUnknownMarket(zenithCode: string): T {
            let result = this.findUnknownFromZenithCode(zenithCode);
            if (result === undefined) {
                this._beginChangeEventer();
                const marketPartsResult = ZenithMarketParts.tryParse(zenithCode);
                if (marketPartsResult.isErr()) {
                    result = this.createUnknownMarket(this.genericUnknownExchangeEnvironment, this.genericUnknownExchange, zenithCode);
                } else {
                    const marketParts = marketPartsResult.value;
                    const exchangeEnvironment = this._getExchangeEnvironmentOrUnknownEventer(marketParts.environment);
                    const exchangeZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(marketParts.exchange, exchangeEnvironment.zenithCode);
                    const exchange = this._getExchangeOrUnknownEventer(exchangeZenithCode);
                    result = this.createUnknownMarket(exchangeEnvironment, exchange, zenithCode);
                }
                this.addUnknownMarket(result);
                this._endChangeEventer();
            }
            return result;
        }

        getMarkets(zenithCodes: readonly string[], includeUnknown: boolean, unknownErrorCode?: ErrorCode): T[] {
            const zenithCodeCount = zenithCodes.length;
            const result = new Array<T>(zenithCodeCount);
            let count = 0;
            for (let i = 0; i < zenithCodeCount; i++) {
                const zenithCode = zenithCodes[i];
                const market = this.tryGetMarket(zenithCode, includeUnknown);
                if (market === undefined) {
                    if (unknownErrorCode !== undefined) {
                        throw new ZenithDataError(unknownErrorCode, zenithCode);
                    }
                } else {
                    result[count++] = market;
                }
            }

            result.length = count;
            return result;
        }

        abstract createEmptyCopy(compareFtn: CompareFtn<Market>): Markets<T>;
        abstract tryGetDefaultEnvironmentMarket(unenvironmentedZenithCode: string, unknownAllowed: boolean): T | undefined;
        protected abstract findUnknownFromZenithCode(zenithCode: string): T | undefined;
        protected abstract addUnknownMarket(market: T): void;
        protected abstract createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): T;
    }

    export namespace Markets {
        export type BeginChangeEventer = (this: void) => void;
        export type EndChangeEventer = (this: void) => void;
        export type GetExchangeEnvironmentOrUnknownEventer = (this: void, environmentZenithCode: ExchangeEnvironmentZenithCode) => ExchangeEnvironment;
        export type GetExchangeOrUnknownEventer = (this: void, exchangeZenithCode: string) => Exchange;
        export type TryGetDefaultEnvironmentMarketEventer<T> = (this: void, zenithCode: string, unknownAllowed: boolean) => T | undefined;
    }

    export abstract class UnknownMarkets<T extends Market> extends Markets<T> {
        tryGetDefaultEnvironmentMarket(_unenvironmentedZenithCode: string, _unknownAllowed: boolean): T | undefined {
            throw new AssertInternalError('MSUMTGDEM22201');
        }

        protected findUnknownFromZenithCode(zenithCode: string): T | undefined {
            return this.findZenithCode(zenithCode);
        }

        protected addUnknownMarket(market: T): void {
            this.binaryInsert(market);
        }
    }

    export abstract class KnownMarkets<T extends Market, K extends Market.TypeId = Market.TypeId> extends Markets<T> {
        constructor(
            marketTypeId: K,
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: T,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            readonly unknownMarkets: MarketsService.UnknownMarkets<T>,
        ) {
            super(
                marketTypeId,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
            );
        }

        protected findUnknownFromZenithCode(zenithCode: string): T | undefined {
            return this.unknownMarkets.findZenithCode(zenithCode);
        }

        protected addUnknownMarket(market: T): void {
            this.unknownMarkets.binaryInsert(market);
        }

    }

    export abstract class DefaultExchangeEnvironmentKnownMarkets<T extends Market> extends KnownMarkets<T> {
        tryGetDefaultEnvironmentMarket(unenvironmentedZenithCode: string, unknownAllowed: boolean): T | undefined {
            return this.tryGetFirstUnenvironmentedZenithCode(unenvironmentedZenithCode, unknownAllowed);
        }
    }

    export abstract class AllKnownMarkets<T extends Market> extends KnownMarkets<T> {
        constructor(
            marketTypeId: Market.TypeId,
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: T,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            unknownMarkets: MarketsService.UnknownMarkets<T>,
            readonly defaultExchangeEnvironmentMarkets: DefaultExchangeEnvironmentKnownMarkets<T>,
        ) {
            super(
                marketTypeId,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
                unknownMarkets,
            );
        }

        tryGetDefaultEnvironmentMarket(unenvironmentedZenithCode: string, unknownAllowed: boolean): T | undefined {
            return this.defaultExchangeEnvironmentMarkets.tryGetFirstUnenvironmentedZenithCode(unenvironmentedZenithCode, unknownAllowed);
        }
    }

    export class UnknownDataMarkets extends UnknownMarkets<DataMarket> {
        constructor(
            private readonly _adiService: AdiService,
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: DataMarket,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
        ) {
            super(
                Market.TypeId.Data,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
            );
        }

        override createEmptyCopy(): UnknownDataMarkets {
            return new UnknownDataMarkets(
                this._adiService,
                this._compareItemsFtn,
                this._compareMarketPropertyToStringFtn,
                this.exchanges,
                this.genericUnknownExchangeEnvironment,
                this.genericUnknownExchange,
                this.genericUnknownMarket,
                this._beginChangeEventer,
                this._endChangeEventer,
                this._getExchangeEnvironmentOrUnknownEventer,
                this._getExchangeOrUnknownEventer,
            );
        }

        protected createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): DataMarket {
            return DataMarket.createUnknown(this._adiService, exchangeEnvironment, exchange, zenithCode);
        }
    }

    export class DefaultExchangeEnvironmentKnownDataMarkets extends DefaultExchangeEnvironmentKnownMarkets<DataMarket> {
        declare readonly unknownMarkets: MarketsService.UnknownDataMarkets;

        constructor(
            private readonly _adiService: AdiService,
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: DataMarket,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            unknownMarkets: MarketsService.UnknownDataMarkets,
        ) {
            super(
                Market.TypeId.Data,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
                unknownMarkets,
            );
        }

        override createEmptyCopy(): DefaultExchangeEnvironmentKnownDataMarkets {
            return new DefaultExchangeEnvironmentKnownDataMarkets(
                this._adiService,
                this._compareItemsFtn,
                this._compareMarketPropertyToStringFtn,
                this.exchanges,
                this.genericUnknownExchangeEnvironment,
                this.genericUnknownExchange,
                this.genericUnknownMarket,
                this._beginChangeEventer,
                this._endChangeEventer,
                this._getExchangeEnvironmentOrUnknownEventer,
                this._getExchangeOrUnknownEventer,
                this.unknownMarkets,
            );
        }

        protected createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): DataMarket {
            return DataMarket.createUnknown(this._adiService, exchangeEnvironment, exchange, zenithCode);
        }
    }

    export class AllKnownDataMarkets extends AllKnownMarkets<DataMarket> {
        declare readonly unknownMarkets: MarketsService.UnknownDataMarkets;
        declare readonly defaultExchangeEnvironmentMarkets: DefaultExchangeEnvironmentKnownDataMarkets;

        constructor(
            private readonly _adiService: AdiService,
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: DataMarket,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            unknownMarkets: MarketsService.UnknownDataMarkets,
            defaultExchangeEnvironmentMarkets: DefaultExchangeEnvironmentKnownDataMarkets,
        ) {
            super(
                Market.TypeId.Data,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
                unknownMarkets, defaultExchangeEnvironmentMarkets,
            );
        }

        override createEmptyCopy(): AllKnownDataMarkets {
            return new AllKnownDataMarkets(
                this._adiService,
                this._compareItemsFtn,
                this._compareMarketPropertyToStringFtn,
                this.exchanges,
                this.genericUnknownExchangeEnvironment,
                this.genericUnknownExchange,
                this.genericUnknownMarket,
                this._beginChangeEventer,
                this._endChangeEventer,
                this._getExchangeEnvironmentOrUnknownEventer,
                this._getExchangeOrUnknownEventer,
                this.unknownMarkets,
                this.defaultExchangeEnvironmentMarkets,
            );
        }

        protected createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): DataMarket {
            return DataMarket.createUnknown(this._adiService, exchangeEnvironment, exchange, zenithCode);
        }
    }

    export class UnknownTradingMarkets extends UnknownMarkets<TradingMarket> {
        constructor(
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: TradingMarket,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            private readonly _bestLitUnknownDataMarket: DataMarket,
        ) {
            super(
                Market.TypeId.Trading,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
            );
        }

        override createEmptyCopy(): UnknownTradingMarkets {
            return new UnknownTradingMarkets(
                this._compareItemsFtn,
                this._compareMarketPropertyToStringFtn,
                this.exchanges,
                this.genericUnknownExchangeEnvironment,
                this.genericUnknownExchange,
                this.genericUnknownMarket,
                this._beginChangeEventer,
                this._endChangeEventer,
                this._getExchangeEnvironmentOrUnknownEventer,
                this._getExchangeOrUnknownEventer,
                this._bestLitUnknownDataMarket,
            );
        }

        protected createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): TradingMarket {
            return TradingMarket.createUnknown(exchangeEnvironment, exchange, zenithCode);
        }
    }

    export class DefaultExchangeEnvironmentKnownTradingMarkets extends DefaultExchangeEnvironmentKnownMarkets<TradingMarket> {
        declare readonly unknownMarkets: MarketsService.UnknownTradingMarkets;

        constructor(
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: TradingMarket,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            unknownMarkets: UnknownTradingMarkets,
            private readonly _bestLitUnknownDataMarket: DataMarket,
        ) {
            super(
                Market.TypeId.Trading,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
                unknownMarkets,
            );
        }

        override createEmptyCopy(): DefaultExchangeEnvironmentKnownTradingMarkets {
            return new DefaultExchangeEnvironmentKnownTradingMarkets(
                this._compareItemsFtn,
                this._compareMarketPropertyToStringFtn,
                this.exchanges,
                this.genericUnknownExchangeEnvironment,
                this.genericUnknownExchange,
                this.genericUnknownMarket,
                this._beginChangeEventer,
                this._endChangeEventer,
                this._getExchangeEnvironmentOrUnknownEventer,
                this._getExchangeOrUnknownEventer,
                this.unknownMarkets,
                this._bestLitUnknownDataMarket,
            );
        }

        protected createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): TradingMarket {
            return TradingMarket.createUnknown(exchangeEnvironment, exchange, zenithCode);
        }
    }

    export class AllKnownTradingMarkets extends AllKnownMarkets<TradingMarket> {
        declare readonly unknownMarkets: MarketsService.UnknownTradingMarkets;
        declare readonly defaultExchangeEnvironmentMarkets: DefaultExchangeEnvironmentKnownTradingMarkets;

        constructor(
            compareItemsFtn: CompareFtn<Market>,
            compareMarketPropertyToStringFtn: Market.ComparePropertyToStringFtn,
            exchanges: Exchanges,
            genericUnknownExchangeEnvironment: ExchangeEnvironment,
            genericUnknownExchange: Exchange,
            genericUnknownMarket: TradingMarket,
            beginChangeEventer: Markets.BeginChangeEventer,
            endChangeEventer: Markets.EndChangeEventer,
            getExchangeEnvironmentOrUnknownEventer: Markets.GetExchangeEnvironmentOrUnknownEventer,
            getExchangeOrUnknownEventer: Markets.GetExchangeOrUnknownEventer,
            unknownMarkets: UnknownTradingMarkets,
            defaultExchangeEnvironmentMarkets: DefaultExchangeEnvironmentKnownTradingMarkets,
            private readonly _bestLitUnknownDataMarket: DataMarket,
        ) {
            super(
                Market.TypeId.Trading,
                compareItemsFtn, compareMarketPropertyToStringFtn,
                exchanges, genericUnknownExchangeEnvironment, genericUnknownExchange, genericUnknownMarket,
                beginChangeEventer, endChangeEventer, getExchangeEnvironmentOrUnknownEventer, getExchangeOrUnknownEventer,
                unknownMarkets, defaultExchangeEnvironmentMarkets,
            );
        }

        override createEmptyCopy(): AllKnownTradingMarkets {
            return new AllKnownTradingMarkets(
                this._compareItemsFtn,
                this._compareMarketPropertyToStringFtn,
                this.exchanges,
                this.genericUnknownExchangeEnvironment,
                this.genericUnknownExchange,
                this.genericUnknownMarket,
                this._beginChangeEventer,
                this._endChangeEventer,
                this._getExchangeEnvironmentOrUnknownEventer,
                this._getExchangeOrUnknownEventer,
                this.unknownMarkets,
                this.defaultExchangeEnvironmentMarkets,
                this._bestLitUnknownDataMarket,
            );
        }

        protected createUnknownMarket(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): TradingMarket {
            return TradingMarket.createUnknown(exchangeEnvironment, exchange, zenithCode);
        }
    }

    export class MarketBoards extends ChangeSubscribableComparableList<MarketBoard> {
        constructor(compareItemsFtn: CompareFtn<MarketBoard>, private readonly _compareMarketBoardPropertyToStringFtn: MarketBoard.ComparePropertyToStringFtn) {
            super(compareItemsFtn);
        }

        findZenithCode(zenithCode: string): MarketBoard | undefined {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const board = this.getAt(i);
                if (board.zenithCode === zenithCode) {
                    return board;
                }
            }
            return undefined;
        }

        findFirstUnenvironmentedZenithCode(value: string): MarketBoard | undefined {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const board = this.getAt(i);
                if (board.unenvironmentedZenithCode === value) {
                    return board;
                }
            }
            return undefined;
        }

        binaryFind(zenithCode: string): BinaryFind.Result {
            return this.binaryFindAny((board) => this._compareMarketBoardPropertyToStringFtn(board, zenithCode));
        }

        binaryInsert(item: MarketBoard): void {
            const searchResult = this.binarySearchAny(item);
            this.insert(searchResult.index, item)
        }

        insertRangeFromMarket(market: DataMarket, idx: Integer, count: Integer): void {
            if (count === 1) {
                const marketBoard = market.marketBoards.getAt(idx);
                const zenithCode = marketBoard.zenithCode;
                const result = this.binaryFind(zenithCode);
                if (result.found) {
                    throw new AssertInternalError('MSTMBIRFM33309', zenithCode);
                } else {
                    this.insert(result.index, marketBoard);
                }
            } else {
                const range = market.marketBoards.rangeToArray(idx, count);
                this.addRange(range);
                this.sort();
            }
        }

        removeRangeFromMarket(market: DataMarket, idx: Integer, count: Integer): void {
            const marketMarketBoards = market.marketBoards;
            const rangeEndPlus1 = idx + count;
            const removeIndices = new Array<Integer>(count);
            let removeIndexCount = 0;
            for (let i = idx; i < rangeEndPlus1; i++) {
                const marketBoard = marketMarketBoards.getAt(i);
                const thisIndex = this.indexOf(marketBoard);
                if (thisIndex < 0) {
                    throw new AssertInternalError('MSTMBRRFM33911');
                } else {
                    removeIndices[removeIndexCount++] = i;
                }
            }

            this.removeAtIndices(removeIndices);
        }

        clearMarket(market: DataMarket): void {
            const boardCount = market.marketBoards.count;
            this.removeRangeFromMarket(market, 0, boardCount);
        }
    }

    export class Exchanges extends ChangeSubscribableComparableList<Exchange> {
        constructor(readonly genericUnknownExchange: Exchange, compareItemsFtn: CompareFtn<Exchange>, private readonly _compareExchangePropertyToStringFtn: Exchange.ComparePropertyToStringFtn) {
            super(compareItemsFtn);
        }

        findZenithCode(value: string): Exchange | undefined {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const exchange = this.getAt(i);
                if (exchange.zenithCode === value) {
                    return exchange;
                }
            }
            return undefined;
        }

        findFirstUnenvironmentedZenithCode(value: string) {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const exchange = this.getAt(i);
                if (exchange.unenvironmentedZenithCode === value) {
                    return exchange;
                }
            }
            return undefined;
        }

        findFirstSymbologyCode(value: string) {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const exchange = this.getAt(i);
                if (exchange.symbologyCode === value) {
                    return exchange;
                }
            }
            return undefined;
        }

        binaryFind(zenithCode: string): BinaryFind.Result {
            return this.binaryFindAny((exchange) => this._compareExchangePropertyToStringFtn(exchange, zenithCode));
        }

        binaryInsert(item: Exchange): void {
            const searchResult = this.binarySearchAny(item);
            this.insert(searchResult.index, item)
        }

        findZenithExchangeCodeWithEnvironmentZenithCode(zenithExchangeCode: string, environmentZenithCode: ExchangeEnvironmentZenithCode): Exchange | undefined {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const exchange = this.getAt(i);
                if (exchange.unenvironmentedZenithCode === zenithExchangeCode && exchange.exchangeEnvironment.zenithCode === environmentZenithCode) {
                    return exchange;
                }
            }
            return undefined;
        }

        findFirstZenithExchangeCode(zenithExchangeCode: string): Exchange | undefined {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const exchange = this.getAt(i);
                if (exchange.unenvironmentedZenithCode === zenithExchangeCode) {
                    return exchange;
                }
            }
            return undefined;
        }
    }

    export class ZenithCodedEnvironments<Environment extends ZenithCodedEnvironment> extends ChangeSubscribableComparableList<Environment> {
        constructor() {
            super(ZenithCodedEnvironments.sortCompareItems);
        }

        findZenithCode(zenithCode: ExchangeEnvironmentZenithCode) {
            const count = this.count;
            for (let i = 0; i < count; i++) {
                const exchangeEnvironment = this.getAt(i);
                if (exchangeEnvironment.zenithCode === zenithCode) {
                    return exchangeEnvironment;
                }
            }
            return undefined;
        }

        binaryFind(zenithCode: string) {
            return this.binaryFindAny((environment) => ZenithCodedEnvironment.compareZenithCode(environment.zenithCode, zenithCode));
        }

        binaryInsert(item: Environment) {
            const searchResult = this.binarySearchAny(item);
            this.insert(searchResult.index, item)
        }
    }

    export namespace ZenithCodedEnvironments {
        export function sortCompareItems(left: ZenithCodedEnvironment, right: ZenithCodedEnvironment) {
            return ZenithCodedEnvironment.compareZenithCode(left.zenithCode, right.zenithCode);
        }
    }

    export class ExchangeEnvironments extends ZenithCodedEnvironments<ExchangeEnvironment> {
        private _atLeastOneProduction = false;
        private _allProduction = false;

        get atLeastOneProduction() { return this._atLeastOneProduction; }
        get allProduction() { return this._allProduction; }

        addRangeAndUpdateProductionFlags(values: readonly ExchangeEnvironment[]): void {
            const firstAddition = this.count === 0;
            this.addRange(values);
            this.updateProductionFlagsFromAddArray(values, firstAddition);
        }

        binaryInsertAndUpdateProductionFlags(value: ExchangeEnvironment) {
            this.binaryInsert(value);
            if (value.production) {
                this._atLeastOneProduction = true;
            } else {
                this._allProduction = false;
            }
        }

        private updateProductionFlagsFromAddArray(addedExchangeEnvironments: readonly ExchangeEnvironment[], firstAddition: boolean) {
            const addArrayCount = addedExchangeEnvironments.length;
            let atLeastOneNewProduction = false;
            let allNewProduction = true;
            for (let i = 0; i < addArrayCount; i++) {
                const newExchangeEnvironment = addedExchangeEnvironments[i];
                if (newExchangeEnvironment.production) {
                    atLeastOneNewProduction = true;
                } else {
                    allNewProduction = false;
                }

                if (atLeastOneNewProduction && !allNewProduction) {
                    break;
                }
            }

            if (atLeastOneNewProduction) {
                this._atLeastOneProduction = true;
            }

            if (firstAddition) {
                this._allProduction = allNewProduction;
            } else {
                if (!allNewProduction) {
                    this._allProduction = false;
                }
            }
        }
    }

    export interface UnresolvedNewMarket<T extends Market> {
        readonly market: T;
        readonly configName: string | undefined;
        readonly configSymbologyExchangeSuffixCode: string | undefined;
        readonly configSymbologySupportedExchangeZenithCodes: readonly string[] | undefined;
        readonly specifiedExchange: Exchange | undefined; // Set by TradingMarket only when specified exchange does not match exchange in Zenith Code
        readonly symbologicalCorrespondingDataMarket: DataMarket | undefined; // Set by Trading Market only when a data market exists with exactly the same zenith code
    }

    export namespace UnresolvedNewMarket {
        export function findMarketInArray<T extends Market>(zenithCode: string, array: UnresolvedNewMarket<T>[]): T | undefined {
            const count = array.length;
            for (let i = 0; i < count; i++) {
                const unresolvedNewMarket = array[i];
                const market = unresolvedNewMarket.market;
                if (market.zenithCode === zenithCode) {
                    return market;
                }
            }
            return undefined;
        }
    }

    export interface UnresolvedNewDataMarket extends UnresolvedNewMarket<DataMarket> {
        configBestTradingMarketZenithCode: string | undefined;
    }
    export type UnresolvedNewTradingMarket = UnresolvedNewMarket<TradingMarket>;

    export interface UnresolvedNewExchange {
        readonly exchange: Exchange;
        readonly configDefaultExchangeEnvironmentZenithCode: ExchangeEnvironmentZenithCode | undefined;
        readonly configSymbologyCode: string | undefined;
        readonly configAbbreviatedDisplay: string | undefined;
        readonly configFullDisplay: string | undefined;
        readonly configDefaultLitMarketZenithCode: string | null | undefined;
        readonly configDefaultTradingMarketZenithCode: string | null | undefined;
    }

    export interface ResolvedNewExchanges {
        readonly defaultDefaultExchange: Exchange | undefined;
        readonly newExchanges: Exchange[];
        readonly newDefaultExchangeEnvironmentExchanges: Exchange[];
    }

    export interface ResolvedNewExchangesAndMarkets {
        readonly resolvedNewExchanges: ResolvedNewExchanges,
        readonly newDataMarkets: DataMarket[],
        readonly newDefaultExchangeEnvironmentDataMarkets: DataMarket[],
        readonly newTradingMarkets: TradingMarket[] | undefined,
        readonly newDefaultExchangeEnvironmentTradingMarkets: TradingMarket[] | undefined,
    }

    export class SymbologyExchangeSuffixCodeMap {
        private readonly _exchangeMap = new Map<Exchange, SymbologyExchangeSuffixCodeMap.CodeMap>;

        getCodeMap(exchange: Exchange): SymbologyExchangeSuffixCodeMap.CodeMap {
            let codeMap = this._exchangeMap.get(exchange);
            if (codeMap === undefined) {
                codeMap = new Map<string, undefined>;
                this._exchangeMap.set(exchange, codeMap);
            }
            return codeMap;
        }

        set(exchange: Exchange, code: string) {
            const codeMap = this.getCodeMap(exchange);
            codeMap.set(code, undefined);
        }

        has(exchange: Exchange, code: string) {
            const codeMap = this._exchangeMap.get(exchange);
            if (codeMap === undefined) {
                return false;
            } else {
                return codeMap.has(code);
            }
        }
    }

    export namespace SymbologyExchangeSuffixCodeMap {
        export type CodeMap = Map<string, undefined>;
    }

    export class DefaultExchangeEnvironmentExchangesResolver {
        private readonly _defaults = new Array<DefaultExchangeEnvironmentExchangesResolver.Default>();

        constructor(
            private readonly _existingDefaultExchanges: Exchanges,
            private readonly _defaultExchangeEnvironmentPriorityList: readonly ExchangeEnvironmentZenithCode[],
        ) {
        }

        checkForDefault(exchange: Exchange, configExchangeDefaultExchangeEnvironmentZenithCode: ExchangeEnvironmentZenithCode | undefined) {
            const zenithExchangeCode = exchange.unenvironmentedZenithCode;
            const existingDefaultExchange = this._existingDefaultExchanges.findFirstZenithExchangeCode(zenithExchangeCode);
            if (existingDefaultExchange === undefined) {
                let foundDefault = this.findDefault(exchange.unenvironmentedZenithCode);
                if (foundDefault === undefined) {
                    foundDefault = {
                        zenithExchangeCode,
                        exchange,
                        priorityListIndex: -1,
                        defaultExchangeEnvironmentExplicit: configExchangeDefaultExchangeEnvironmentZenithCode !== undefined,
                        explicitlyResolved: false,
                    };
                    this._defaults.push(foundDefault);
                }

                if (!foundDefault.explicitlyResolved) {
                    if (configExchangeDefaultExchangeEnvironmentZenithCode !== undefined) {
                        if (exchange.exchangeEnvironment.zenithCode === configExchangeDefaultExchangeEnvironmentZenithCode) {
                            foundDefault.exchange = exchange;
                            foundDefault.explicitlyResolved = true;
                        }
                    } else {
                        const higherPriorityListIndex = DefaultExchangeEnvironmentExchangesResolver.getHigherPriorityListIndex(
                            this._defaultExchangeEnvironmentPriorityList,
                            foundDefault.priorityListIndex,
                            exchange
                        );
                        if (higherPriorityListIndex >= 0) {
                            foundDefault.exchange = exchange;
                            foundDefault.priorityListIndex = higherPriorityListIndex;
                        }
                    }
                }
            }
        }

        getExchanges() {
            return this._defaults.map((element) => element.exchange);
        }

        addWarnings(warningsService: WarningsService) {
            this._defaults.forEach((exchangeDefault) => {
                if (exchangeDefault.defaultExchangeEnvironmentExplicit && !exchangeDefault.explicitlyResolved) {
                    warningsService.add(WarningsService.TypeId.ServerConfig, `${Strings[StringId.Warning_ConfigExchangeDefaultExchangeEnvironmentNotFound]}: ${exchangeDefault.exchange.zenithCode}`);
                }
            });
        }

        private findDefault(zenithExchangeCode: string) {
            const defaults = this._defaults;
            const count = defaults.length;
            for (let i = 0; i < count; i++) {
                const potentialDefault = defaults[i];
                if (potentialDefault.exchange.unenvironmentedZenithCode === zenithExchangeCode) {
                    return potentialDefault;
                }
            }
            return undefined;
        }
    }

    export namespace DefaultExchangeEnvironmentExchangesResolver {
        export interface Default {
            readonly zenithExchangeCode: string;
            exchange: Exchange; // Exchange with highest ExchangeEnvironment priority
            priorityListIndex: Integer, // Value of highest Data Environment priority (lower value is higher priority but < -1 is lowest priority)
            defaultExchangeEnvironmentExplicit: boolean, // Specifies whether an exchange's config explicitly specified its default data environment
            explicitlyResolved: boolean; // If an exchange's config explicitly specifies its default environment and this environment is found, then this is absolute highest priority
        }

        export function getHigherPriorityListIndex(
            defaultExchangeEnvironmentPriorityList: readonly ExchangeEnvironmentZenithCode[],
            existingPriorityListIndex: Integer,
            exchange: Exchange
        ): Integer {
            const priorityListIndex = defaultExchangeEnvironmentPriorityList.indexOf(exchange.exchangeEnvironment.zenithCode);
            if (priorityListIndex < 0) {
                return -1; // lowest priority so can never be higher
            } else {
                if (existingPriorityListIndex < 0 || priorityListIndex < existingPriorityListIndex) {
                    return priorityListIndex; // is higher priority
                } else {
                    return -1; // is lower priority
                }
            }
        }
    }

    export const enum ListId {
        Known,
        EnvironmentDefault,
        Unknown,
    }

    export namespace List {
        export type Id = ListId;

        interface Info {
            readonly id: ListId;
            readonly displayId: StringId;
            readonly descriptionId: StringId;
        }

        type InfosObject = { [id in keyof typeof ListId]: Info };
        const infosObject: InfosObject = {
            Known: {
                id: ListId.Known,
                displayId: StringId.MarketsService_ListDisplay_Known,
                descriptionId: StringId.MarketsService_ListDescription_Known,
            },
            EnvironmentDefault: {
                id: ListId.EnvironmentDefault,
                displayId: StringId.MarketsService_ListDisplay_DefaultExchangeEnvironment,
                descriptionId: StringId.MarketsService_ListDescription_DefaultExchangeEnvironmentSuffix,
            },
            Unknown: {
                id: ListId.Unknown,
                displayId: StringId.MarketsService_ListDisplay_Unknown,
                descriptionId: StringId.MarketsService_ListDescription_Unknown,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;
        export const allIds = (function() { return infos.map((info) => info.id) })();

        export function initialise() {
            for (let i = 0; i < idCount; i++) {
                const info = infos[i];
                if (info.id !== i as ListId) {
                    throw new EnumInfoOutOfOrderError('MarketsService.ListId', i, Strings[info.displayId]);
                }
            }
        }

        export function getAllIds() {
            return infos.map((info) => info.id);
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }

        export function idToDescriptionId(id: Id) {
            return infos[id].descriptionId;
        }

        export function idToDescription(id: Id, pluralListElementName: string) {
            if (id === ListId.EnvironmentDefault) {
                return `${Strings[idToDescriptionId(ListId.Known)]} ${pluralListElementName} ${Strings[idToDescriptionId(id)]}`;
            } else {
                return `${Strings[idToDescriptionId(id)]} ${pluralListElementName}`;
            }
        }
    }
}

export namespace MarketsServiceModule {
    export function initialiseStatic() {
        MarketsService.List.initialise();
    }
}
