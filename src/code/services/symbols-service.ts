import {
    EnumInfoOutOfOrderError,
    Err,
    Integer,
    MultiEvent,
    Ok,
    PickEnum,
    Result,
    UnreachableCaseError,
    isDigitCharCode
} from '@pbkware/js-utils';
import {
    DataIvemAlternateCodes,
    DataIvemId,
    DataMarket,
    Exchange,
    IvemId,
    Market,
    MarketsService,
    SearchSymbolsDataIvemBaseDetail,
    SymbolField, SymbolFieldId,
    TradingIvemId,
    TradingMarket,
    ZenithProtocolCommon
} from '../adi';
import { MarketIvemId } from '../adi/symbol-id/market-ivem-id';
import { StringId, Strings } from '../res';
import {
    ErrorCode,
    JsonLoadError
} from '../sys';
import { ExchangesSettings, ScalarSettings, SettingsService, TypedKeyValueScalarSettingsGroup, TypedKeyValueSettings } from './settings/internal-api';

export class SymbolsService {
    private readonly _scalarSettings: ScalarSettings;
    private readonly _exchangesSettings: ExchangesSettings;
    private readonly _exchanges: MarketsService.Exchanges;
    private readonly _defaultExchangeEnvironmentExchanges: MarketsService.Exchanges;
    private readonly _dataMarkets: MarketsService.AllKnownDataMarkets;
    private readonly _defaultExchangeEnvironmentDataMarkets: MarketsService.DefaultExchangeEnvironmentKnownDataMarkets;
    private readonly _tradingMarkets: MarketsService.AllKnownTradingMarkets;
    private readonly _defaultExchangeEnvironmentTradingMarkets: MarketsService.DefaultExchangeEnvironmentKnownTradingMarkets;

    private _finalised = false;

    private _settingsServiceLinked = false;

    // private _marketsDataItem: MarketsDataItem | undefined;

    // private readonly _allowedMarkets = new Array<Market>();
    // private readonly _allowedExchanges = new Array<Exchange>();
    // private _allowedExchangesAndMarketsUsable = false;
    // private _usableAllowedExchangeIdsResolves = new Array<SymbolsService.AllowedExchangeIdsUsableResolve>();
    // private _usableAllowedMarketIdsResolves = new Array<SymbolsService.AllowedMarketIdsUsableResolve>();

    private _defaultParseModeAuto = SymbolsService.defaultDefaultParseModeAuto;
    private _explicitDefaultParseModeId = SymbolsService.defaultExplicitParseModeId;
    private _zenithSymbologySupportLevelId = SymbolsService.defaultZenithSymbologySupportLevelId;
    private _promptDefaultExchangeIfRicParseModeId = SymbolsService.defaultPromptDefaultExchangeIfRicParseModeId;
    private _defaultExchange: Exchange;
    private _ricAnnouncerChar = SymbolsService.defaultRicAnnouncerChar;
    private _pscAnnouncerChar = SymbolsService.defaultPscAnnouncerChar;
    private _pscMarketAnnouncerChar = SymbolsService.defaultPscMarketAnnouncerChar;
    private _pscExchangeAnnouncerChar = SymbolsService.defaultPscExchangeAnnouncerChar;
    private _pscExchangeHideModeId = SymbolsService.defaultPscExchangeHideModeId;
    private _pscDefaultMarketHidden = SymbolsService.defaultPscDefaultMarketHidden;
    private _pscMarketCodeAsLocalWheneverPossible = SymbolsService.defaultPscMarketCodeAsLocalWheneverPossible;
    private _autoSelectDefaultMarketDest = SymbolsService.defaultAutoSelectDefaultMarketDest;
    private _explicitSearchFieldsEnabled = SymbolsService.defaultExplicitSearchFieldsEnabled;
    private _explicitSearchFieldIds: readonly SymbolFieldId[] = SymbolsService.defaultExplicitSearchFieldIds;

    private _defaultParseModeId: SymbolsService.ParseModeId;

    // private _pscExchangeDisplayCodeMap: SymbolsService.PscExchangeDisplayCodeMap;
    // private _pscMarketMap: SymbolsService.PscMarketMap;

    private _getFormattedSettingValuesEventSubscriptionId: MultiEvent.SubscriptionId;
    private _pushFormattedSettingValuesEventSubscriptionId: MultiEvent.SubscriptionId;
    // private _marketListChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    // private _allowedMarketIdsChangedMultiEvent = new MultiEvent<SymbolsService.AllowedMarketIdsChangedEventHandler>();
    // private _allowedExchangeIdsChangedMultiEvent = new MultiEvent<SymbolsService.AllowedExchangeIdsChangedEventHandler>();

    constructor(private readonly _marketsService: MarketsService, private readonly _settingsService: SettingsService) {
        this._scalarSettings = this._settingsService.scalar;
        this._exchangesSettings = this._settingsService.exchanges;
        this._exchanges = this._marketsService.exchanges;
        this._defaultExchangeEnvironmentExchanges = this._marketsService.defaultExchangeEnvironmentExchanges;
        this._dataMarkets = this._marketsService.dataMarkets;
        this._defaultExchangeEnvironmentDataMarkets = this._marketsService.defaultExchangeEnvironmentDataMarkets;
        this._tradingMarkets = this._marketsService.tradingMarkets;
        this._defaultExchangeEnvironmentTradingMarkets = this._marketsService.defaultExchangeEnvironmentTradingMarkets;
    }

    get settingsServiceLinked() {
        return this._settingsServiceLinked;
    }
    set settingsServiceLinked(value: boolean) {
        if (value !== this._settingsServiceLinked) {
            this._settingsServiceLinked = value;
            if (value) {
                this._getFormattedSettingValuesEventSubscriptionId = this._scalarSettings.subscribeGetFormattedSettingValuesEvent(
                    () => this.handleGetFormattedSettingValuesEvent()
                );
                this._pushFormattedSettingValuesEventSubscriptionId = this._scalarSettings.subscribePushFormattedSettingValuesEvent(
                    (formattedSettingValues) => this.handlePushFormattedSettingValuesEvent(formattedSettingValues)
                );
            } else {
                this._scalarSettings.unsubscribeGetFormattedSettingValuesEvent(this._getFormattedSettingValuesEventSubscriptionId);
                this._getFormattedSettingValuesEventSubscriptionId = undefined;
                this._scalarSettings.unsubscribePushFormattedSettingValuesEvent(this._pushFormattedSettingValuesEventSubscriptionId);
                this._pushFormattedSettingValuesEventSubscriptionId = undefined;
            }
        }
    }

    // get allowedExchangeIds() { return this._allowedExchanges; }
    // /**
    //  * Promise returns allowedMarketIds when they are usable (Markets DataItem becomes usable).
    //  * Returns undefined if motif-core is finalised before allowedMarketIds becomes usable.
    //  */
    // get usableAllowedExchangeIds(): Promise<ExchangeId[] | undefined> {
    //     if (this._allowedExchangesAndMarketsUsable) {
    //         return Promise.resolve(this._allowedExchanges);
    //     } else {
    //         return new Promise<ExchangeId[] | undefined>(
    //             (resolve) => {
    //                 if (this._allowedExchangesAndMarketsUsable) {
    //                     resolve(this._allowedExchanges);
    //                 } else {
    //                     this._usableAllowedExchangeIdsResolves.push(resolve);
    //                 }
    //             }
    //         );
    //     }
    // }
    // get allowedMarketIds() { return this._allowedMarkets; }
    // /**
    //  * Promise returns allowedMarketIds when they are usable (Markets DataItem becomes usable).
    //  * Returns undefined if motif-core is finalised before allowedMarketIds becomes usable.
    //  */
    // get usableAllowedMarketIds(): Promise<MarketId[] | undefined> {
    //     if (this._allowedExchangesAndMarketsUsable) {
    //         return Promise.resolve(this._allowedMarkets);
    //     } else {
    //         return new Promise<MarketId[] | undefined>(
    //             (resolve) => {
    //                 if (this._allowedExchangesAndMarketsUsable) {
    //                     resolve(this._allowedMarkets);
    //                 } else {
    //                     this._usableAllowedMarketIdsResolves.push(resolve);
    //                 }
    //             }
    //         );
    //     }
    // }

    get defaultParseModeId() { return this._defaultParseModeId; }
    get zenithSymbologySupportLevelId() { return this._zenithSymbologySupportLevelId; }
    set zenithSymbologySupportLevelId(value: SymbolsService.ZenithSymbologySupportLevel.Id) {
        this._zenithSymbologySupportLevelId = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_ZenithSymbologySupportLevelId);
    }
    get promptDefaultExchangeIfRicParseModeId(): boolean { return this._promptDefaultExchangeIfRicParseModeId; }
    set promptDefaultExchangeIfRicParseModeId(value: boolean) {
        this._promptDefaultExchangeIfRicParseModeId = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PromptDefaultExchangeIfRicParseModeId);
    }
    get defaultExchange() { return this._defaultExchange; }
    set defaultExchange(value: Exchange) {
        this._defaultExchange = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_DefaultExchangeZenithCode);
    }
    get ricAnnouncerChar() { return this._ricAnnouncerChar; }
    set ricAnnouncerChar(value: string) {
        this._ricAnnouncerChar = this.checkFixRicAnnouncerChar(value);
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_RicAnnouncerChar);
    }
    get pscAnnouncerChar() { return this._pscAnnouncerChar; }
    set pscAnnouncerChar(value: string) {
        this._pscAnnouncerChar = this.checkFixPscAnnouncerChar(value);
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PscAnnouncerChar);
    }
    get pscExchangeAnnouncerChar() { return this._pscExchangeAnnouncerChar; }
    set pscExchangeAnnouncerChar(value: string) {
        this._pscExchangeAnnouncerChar = this.checkFixExchangeAnnouncerChar(value);
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PscExchangeAnnouncerChar);
    }
    get pscMarketAnnouncerChar() { return this._pscMarketAnnouncerChar; }
    set pscMarketAnnouncerChar(value: string) {
        this._pscMarketAnnouncerChar = this.checkFixMarketAnnouncerChar(value);
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PscMarketAnnouncerChar);
    }
    get pscExchangeHideModeId() { return this._pscExchangeHideModeId; }
    set pscExchangeHideModeId(value: SymbolsService.ExchangeHideMode.Id) {
        this._pscExchangeHideModeId = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PscExchangeHideModeId);
    }
    get pscDefaultMarketHidden() { return this._pscDefaultMarketHidden; }
    set pscDefaultMarketHidden(value: boolean) {
        this._pscDefaultMarketHidden = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PscDefaultMarketHidden);
    }
    get pscMarketCodeAsLocalWheneverPossible() { return this._pscMarketCodeAsLocalWheneverPossible; }
    set pscMarketCodeAsLocalWheneverPossible(value: boolean) {
        this._pscMarketCodeAsLocalWheneverPossible = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_PscMarketCodeAsLocalWheneverPossible);
    }
    get autoSelectDefaultMarketDest() { return this._autoSelectDefaultMarketDest; }
    set autoSelectDefaultMarketDest(value: boolean) {
        this._autoSelectDefaultMarketDest = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_AutoSelectDefaultMarketDest);
    }
    get explicitSearchFieldsEnabled() { return this._explicitSearchFieldsEnabled; }
    set explicitSearchFieldsEnabled(value: boolean) {
        this._explicitSearchFieldsEnabled = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_ExplicitSearchFieldsEnabled);
    }
    get explicitSearchFieldIds() { return this._explicitSearchFieldIds; }
    set explicitSearchFieldIds(value: readonly SymbolFieldId[]) {
        this._explicitSearchFieldIds = value;
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_ExplicitSearchFieldIds);
    }
    get defaultParseModeAuto() { return this._defaultParseModeAuto; }
    set defaultParseModeAuto(value: boolean) {
        this._defaultParseModeAuto = value;
        this.updateDefaultParseModeId();
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_DefaultParseModeAuto);
    }
    get explicitDefaultParseModeId() { return this._explicitDefaultParseModeId; }
    set explicitDefaultParseModeId(value: SymbolsService.ParseModeId) {
        this._explicitDefaultParseModeId = value;
        this.updateDefaultParseModeId();
        this.notifyFormattedSettingChanged(ScalarSettings.Id.Symbol_ExplicitDefaultParseModeId);
    }

    initialise() {
        this._defaultExchange = this._marketsService.defaultDefaultExchange;
    }

    finalise() {
        if (!this._finalised) {
            // this._marketsService.markets.unsubscribeListChangeEvent(this._marketListChangeEventSubscriptionId);

            this.settingsServiceLinked = false; // use setter to unsubscribe events

            // this.resolveUsableAllowedExchangeAndMarketIdPromises(true);

            this._finalised = true;
        }
    }

    parseDataIvemId(value: string): SymbolsService.MarketIvemIdParseDetails<DataMarket> {
        const calculatedParseMode = this.calculateParseMode(value);
        if (!calculatedParseMode.valid) {
            return SymbolsService.MarketIvemIdParseDetails.createFail(this._marketsService.genericUnknownDataMarket, DataIvemId, value, calculatedParseMode.errorText);
        } else {
            // move to extension
            switch (calculatedParseMode.id) {
                // case SymbolsManager.ParseModeId.Ric: return this.parseRicDataIvemId(calculatedParseMode.parseText);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                case SymbolsService.ParseModeId.BuiltInSymbology: return this.builtinSymbologyParseMarketIvemId(
                    this._dataMarkets,
                    this._defaultExchangeEnvironmentDataMarkets,
                    calculatedParseMode.parseText,
                    this._zenithSymbologySupportLevelId,
                    DataIvemId,
                );
                default: throw new UnreachableCaseError('', calculatedParseMode.id);
            }
        }
    }

    parseTradingIvemId(value: string): SymbolsService.MarketIvemIdParseDetails<TradingMarket> {
        const calculatedParseMode = this.calculateParseMode(value);
        if (!calculatedParseMode.valid) {
            return SymbolsService.MarketIvemIdParseDetails.createFail(this._marketsService.genericUnknownTradingMarket, TradingIvemId, value, calculatedParseMode.errorText);
        } else {
            // move to extension
            switch (calculatedParseMode.id) {
                // case SymbolsManager.ParseModeId.Ric: return this.parseRicDataIvemId(calculatedParseMode.parseText);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                case SymbolsService.ParseModeId.BuiltInSymbology: return this.builtinSymbologyParseMarketIvemId(
                    this._tradingMarkets,
                    this._defaultExchangeEnvironmentTradingMarkets,
                    calculatedParseMode.parseText,
                    this._zenithSymbologySupportLevelId,
                    TradingIvemId,
                );
                default: throw new UnreachableCaseError('', calculatedParseMode.id);
            }
        }
    }

    parseMarketIvemId<T extends Market>(
        allMarkets: MarketsService.AllKnownMarkets<T>,
        defaultEnvironmentMarkets: MarketsService.DefaultExchangeEnvironmentKnownMarkets<T>,
        marketIvemIdConstructor: MarketIvemId.Constructor<T>,
        value: string
    ): SymbolsService.MarketIvemIdParseDetails<T> {
        const calculatedParseMode = this.calculateParseMode(value);
        if (!calculatedParseMode.valid) {
            return SymbolsService.MarketIvemIdParseDetails.createFail<T>(allMarkets.genericUnknownMarket, marketIvemIdConstructor, value, calculatedParseMode.errorText);
        } else {
            // move to extension
            switch (calculatedParseMode.id) {
                // case SymbolsManager.ParseModeId.Ric: return this.parseRicDataIvemId(calculatedParseMode.parseText);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                case SymbolsService.ParseModeId.BuiltInSymbology: return this.builtinSymbologyParseMarketIvemId(
                    allMarkets,
                    defaultEnvironmentMarkets,
                    calculatedParseMode.parseText,
                    this._zenithSymbologySupportLevelId,
                    marketIvemIdConstructor,
                );
                default: throw new UnreachableCaseError('', calculatedParseMode.id);
            }
        }
    }

    parseIvemId(value: string): SymbolsService.IvemIdParseDetails {
        const calcululatedParseMode = this.calculateParseMode(value);
        // move to extension
        if (!calcululatedParseMode.valid) {
            return SymbolsService.IvemIdParseDetails.createFail(this._marketsService, value, calcululatedParseMode.errorText);
        } else {
            switch (calcululatedParseMode.id) {
                // case SymbolsManager.ParseModeId.Ric: return this.parseRicIvemId(calcululatedParseMode.parseText);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                case SymbolsService.ParseModeId.BuiltInSymbology: return this.parsePscIvemId(calcululatedParseMode.parseText, this._zenithSymbologySupportLevelId);
                default: throw new UnreachableCaseError('', calcululatedParseMode.id);
            }
        }
    }

    dataIvemIdToDisplay(dataIvemId: DataIvemId | undefined): string {
        if (dataIvemId === undefined) {
            return '';
        // move to extension
        // } else if (EikonUtils.isEikonEnvironment()) {
        //     return this.ricNotNullDataIvemIdToDisplay(dataIvemId);
        } else {
            return this.definedMarketIvemIdToDisplay(dataIvemId, false, this._zenithSymbologySupportLevelId);
        }
    }

    tradingIvemIdToDisplay(tradingIvemId: TradingIvemId | undefined): string {
        if (tradingIvemId === undefined) {
            return '';
        // move to extension
        // } else if (EikonUtils.isEikonEnvironment()) {
        //     return this.ricNotNullDataIvemIdToDisplay(dataIvemId);
        } else {
            return this.definedMarketIvemIdToDisplay(tradingIvemId, false, this._zenithSymbologySupportLevelId);
        }
    }

    marketIvemIdToDisplay<T extends Market>(marketIvemId: MarketIvemId<T> | undefined): string {
        if (marketIvemId === undefined) {
            return '';
        // move to extension
        // } else if (EikonUtils.isEikonEnvironment()) {
        //     return this.ricNotNullDataIvemIdToDisplay(dataIvemId);
        } else {
            return this.definedMarketIvemIdToDisplay(marketIvemId, false, this._zenithSymbologySupportLevelId);
        }
    }

    tradingIvemIdToNothingHiddenDisplay(tradingIvemId: TradingIvemId) {
        return this.definedMarketIvemIdToDisplay(tradingIvemId, true, this._zenithSymbologySupportLevelId);
    }

    ivemIdToDisplay(ivemId: IvemId | undefined): string {
        if (ivemId === undefined) {
            return '';
        } else {
            if (this._zenithSymbologySupportLevelId === SymbolsService.ZenithSymbologySupportLevelId.ParseAndDisplay) {
                return `${ivemId.code}${ZenithProtocolCommon.codeMarketSeparator}${ivemId.exchange.zenithCode}`;
            } else {
                const exchangeHidden = this._pscExchangeHideModeId !== SymbolsService.ExchangeHideModeId.Never &&
                    ivemId.exchange === this.defaultExchange;
                if (exchangeHidden) {
                    return ivemId.code;
                } else {
                    return `${ivemId.code}${this.pscExchangeAnnouncerChar}${ivemId.exchange.symbologyCode}`;
                }
            }
        }
    }

    // tryCreateValidDataIvemId(code: string, exchange: Exchange | undefined, market: DataMarket | undefined) {
    //     return this.tryCreateValidMarketIvemId(Market.TypeId.Data, code, exchange, market, DataIvemId);
    // }

    // tryCreateValidTradingIvemId(code: string, exchange: Exchange | undefined, market: TradingMarket | undefined) {
    //     return this.tryCreateValidMarketIvemId(Market.TypeId.Data, code, exchange, market, TradingIvemId);
    // }

    // tryCreateValidMarketIvemId<T extends Market>(
    //     marketTypeId: Market.TypeId,
    //     code: string,
    //     exchange: Exchange | undefined,
    //     market: T | undefined,
    //     constructor: MarketIvemId.Constructor<T>
    // ) {
    //     code = code.toUpperCase();
    //     if (market !== undefined) {
    //         const marketExchange = market.exchange;
    //         if (exchange === undefined) {
    //             exchange = marketExchange;
    //         } else {
    //             if (exchange !== marketExchange) {
    //                 return undefined;
    //             }
    //         }
    //     } else {
    //         if (exchange === undefined) {
    //             exchange = this.defaultExchange;
    //         }
    //         market = exchange.getDefaultMarket<T>(marketTypeId);
    //     }

    //     if (this.getCodeError(code, exchange)) {
    //         return new constructor(code, market);
    //     } else {
    //         return undefined;
    //     }
    // }

    // forceCreateMarketIvemId<T extends Market>(
    //     marketTypeId: Market.TypeId,
    //     code: string,
    //     exchange: Exchange | undefined,
    //     market: T | undefined,
    //     constructor: MarketIvemId.Constructor<T>
    // ): SymbolsService.ForceCreateMarketIvemIdResult<T> {
    //     let errorId: SymbolsService.ForceCreateMarketIvemIdResult.ErrorId | undefined;
    //     code = code.toUpperCase();
    //     if (market !== undefined) {
    //         const marketExchange = market.exchange;
    //         if (exchange === undefined) {
    //             exchange = marketExchange;
    //         } else {
    //             if (exchange !== marketExchange) {
    //                 market = this._marketsService.getGenericUnknownMarket<T>(marketTypeId);
    //                 errorId = SymbolsService.ForceCreateMarketIvemIdResult.ErrorId.ExchangeDoesNotSupportMarket;
    //             }
    //         }
    //     } else {
    //         if (exchange === undefined) {
    //             exchange = this.defaultExchange;
    //         }
    //         market = exchange.getDefaultMarket<T>(marketTypeId);
    //     }

    //     if (this.isValidCode(code, exchange)) {
    //         return new constructor(code, market);
    //     } else {
    //         return undefined;
    //     }
    // }
    tryGetDefaultDataIvemIdFromIvemId(ivemId: IvemId) {
        const market = ivemId.exchange.defaultLitMarket;
        if (market === undefined) {
            return undefined;
        } else {
            return new DataIvemId(ivemId.code, market);
        }
    }

    tryGetDefaultTradingIvemIdFromIvemId(ivemId: IvemId) {
        const market = ivemId.exchange.defaultTradingMarket;
        if (market === undefined) {
            return undefined;
        } else {
            return new TradingIvemId(ivemId.code, market);
        }
    }

    tryGetBestDataIvemIdFromMarketIvemId<T extends Market>(marketIvemId: MarketIvemId<T>): DataIvemId | undefined {
        if (marketIvemId.market.typeId === Market.TypeId.Data) {
            return marketIvemId as unknown as DataIvemId;
        } else {
            const tradingIvemId = marketIvemId as unknown as TradingIvemId;
            return this.tryGetBestDataIvemIdFromTradingIvemId(tradingIvemId);
        }
    }

    tryGetBestDataIvemIdFromTradingIvemId(tradingIvemId: TradingIvemId): DataIvemId | undefined {
        const tradingMarket = tradingIvemId.market;
        const bestDataMarket = tradingMarket.bestLitDataMarket;
        if (bestDataMarket === undefined) {
            return undefined;
        } else {
            return new DataIvemId(tradingIvemId.code, bestDataMarket);
        }
    }

    tryGetBestTradingIvemIdFromDataIvemId(dataIvemId: DataIvemId) {
        const dataMarket = dataIvemId.market;
        const bestTradingMarket = dataMarket.bestTradingMarket;
        if (bestTradingMarket === undefined) {
            return undefined;
        } else {
            return new TradingIvemId(dataIvemId.code, bestTradingMarket);
        }
    }

    calculateSymbolNameFromDataIvemDetail(detail: SearchSymbolsDataIvemBaseDetail) {
        return this.calculateSymbolName(detail.exchange, detail.name, detail.dataIvemId.code, detail.alternateCodes);
    }

    calculateSymbolName(exchange: Exchange, detailName: string, detailCode: string, detailAlternateCodes: DataIvemAlternateCodes | undefined) {
        const fieldId = this._exchangesSettings.getSymbolNameFieldId(exchange);
        if (fieldId === SymbolFieldId.Name || detailAlternateCodes === undefined) {
            return detailName;
        } else {
            if (fieldId === SymbolFieldId.Ticker) {
                const ticker = detailAlternateCodes.ticker;
                if (ticker === undefined) {
                    return detailName;
                } else {
                    return ticker;
                }
            } else {
                let result: string | undefined;
                switch (fieldId) {
                    case SymbolFieldId.Code: {
                        result = detailCode;
                        break;
                    }
                    case SymbolFieldId.Isin: {
                        result = detailAlternateCodes.isin;
                        break;
                    }
                    case SymbolFieldId.Ric: {
                        result = detailAlternateCodes.ric;
                        break;
                    }
                    case SymbolFieldId.Base: {
                        result = detailAlternateCodes.base;
                        break;
                    }
                    case SymbolFieldId.Gics: {
                        result = detailAlternateCodes.gics;
                        break;
                    }
                    case SymbolFieldId.Long: {
                        result = detailAlternateCodes.long;
                        break;
                    }
                    case SymbolFieldId.Short: {
                        result = detailAlternateCodes.short;
                        break;
                    }
                    default:
                        result = detailName;
                }
                result ??= detailName;
                return result;
            }
        }
    }

    calculateSymbolSearchFieldIds(exchange: Exchange | undefined) {
        if (exchange === undefined) {
            if (this._explicitSearchFieldsEnabled) {
                return this._explicitSearchFieldIds;
            } else {
                return this._exchangesSettings.getSymbolSearchFieldIds(this.defaultExchange);
            }
        } else {
            return this._exchangesSettings.getSymbolSearchFieldIds(exchange);
        }
    }

    // subscribeAllowedMarketIdsChangedEvent(handler: SymbolsService.AllowedMarketIdsChangedEventHandler) {
    //     return this._allowedMarketIdsChangedMultiEvent.subscribe(handler);
    // }

    // unsubscribeAllowedMarketIdsChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
    //     this._allowedMarketIdsChangedMultiEvent.unsubscribe(subscriptionId);
    // }

    // subscribeAllowedExchangeIdsChangedEvent(handler: SymbolsService.AllowedExchangeIdsChangedEventHandler) {
    //     return this._allowedExchangeIdsChangedMultiEvent.subscribe(handler);
    // }

    // unsubscribeAllowedExchangeIdsChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
    //     this._allowedExchangeIdsChangedMultiEvent.unsubscribe(subscriptionId);
    // }

    private handleGetFormattedSettingValuesEvent(): TypedKeyValueScalarSettingsGroup.FormattedSettingValue[] {
        const settingIds = SymbolsService.settingIds;
        const count = settingIds.length;
        const result = new Array<TypedKeyValueScalarSettingsGroup.FormattedSettingValue>(count);

        for (let i = 0; i < count; i++) {
            const id = settingIds[i];
            const formattedValue = this.getSettingFormattedValue(id);
            const formattedSettingValue: TypedKeyValueScalarSettingsGroup.FormattedSettingValue = {
                id,
                formattedValue,
            };
            result[i] = formattedSettingValue;
        }

        return result;
    }

    private handlePushFormattedSettingValuesEvent(formattedSettingValues: TypedKeyValueScalarSettingsGroup.FormattedSettingValue[]) {
        const count = formattedSettingValues.length;
        const doneIds = new Array<SymbolsService.SettingId>(count);
        let doneIdCount = 0;
        for (let i = 0; i < count; i++) {
            const { id, formattedValue } = formattedSettingValues[i];
            this.pushSettingFormattedValue(id, formattedValue);
            doneIds[doneIdCount++] = id;
        }

        const settingIds = SymbolsService.settingIds;
        for (const id of settingIds) {
            if (!doneIds.includes(id)) {
                this.pushSettingFormattedValue(id, undefined);
            }
        }

        this.updateDefaultParseModeId();

        return settingIds;
    }

    // private handleMarketListChangeEvent(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
    //     switch (listChangeTypeId) {
    //         case UsableListChangeTypeId.Unusable:
    //             this.loadAllowedExchangeAndMarketIds();
    //             this._allowedExchangesAndMarketsUsable = false;
    //             break;
    //         case UsableListChangeTypeId.PreUsableClear:
    //             // no action
    //             break;
    //         case UsableListChangeTypeId.PreUsableAdd:
    //             break;
    //         case UsableListChangeTypeId.Usable:
    //             this.loadAllowedExchangeAndMarketIds();
    //             this._allowedExchangesAndMarketsUsable = true;
    //             this.resolveUsableAllowedExchangeAndMarketIdPromises(false);
    //             break;
    //         case UsableListChangeTypeId.Insert:
    //             this.loadAllowedExchangeAndMarketIds();
    //             break;
    //         case UsableListChangeTypeId.BeforeReplace:
    //             throw new AssertInternalError('SSHMLCEBR19662');
    //         case UsableListChangeTypeId.AfterReplace:
    //             throw new AssertInternalError('SSHMLCEAR19662');
    //         case UsableListChangeTypeId.BeforeMove:
    //             throw new AssertInternalError('SSHMLCEBM19662');
    //         case UsableListChangeTypeId.AfterMove:
    //             throw new AssertInternalError('SSHMLCEAM19662');
    //         case UsableListChangeTypeId.Remove:
    //             this.loadAllowedExchangeAndMarketIds();
    //             break;
    //         case UsableListChangeTypeId.Clear:
    //             this.loadAllowedExchangeAndMarketIds();
    //             break;
    //         default:
    //             throw new UnreachableCaseError('SSHMLCEARD19662', listChangeTypeId);
    //     }
    // }

    // private notifyAllowedMarketIdsChanged() {
    //     const handlers = this._allowedMarketIdsChangedMultiEvent.copyHandlers();
    //     for (const handler of handlers) {
    //         handler();
    //     }
    // }

    // private notifyAllowedExchangeIdsChanged() {
    //     const handlers = this._allowedExchangeIdsChangedMultiEvent.copyHandlers();
    //     for (const handler of handlers) {
    //         handler();
    //     }
    // }

    // private getDefaultMarketId(exchangeId: ExchangeId): MarketId | undefined {
    //     return ExchangeInfo.idToDefaultMarketId(exchangeId);
    // }

    // private loadAllowedExchangeAndMarketIds() {
    //     const oldAllowedMarketIds = this._allowedMarkets.slice();
    //     const oldAllowedExchangeIds = this._allowedExchanges.slice();

    //     if (this._marketsDataItem === undefined) {
    //         throw new AssertInternalError('SSLAEAMI34493');
    //     } else {
    //         const allowedMarketIdCount = this._marketsDataItem.count;
    //         this._allowedMarkets.length = allowedMarketIdCount;
    //         this._allowedExchanges.length = allowedMarketIdCount;

    //         let allowedExchangeIdCount = 0;

    //         for (let i = 0; i < allowedMarketIdCount; i++) {
    //             const market = this._marketsDataItem.records[i];
    //             const marketId = market.marketId;
    //             this._allowedMarkets[i] = marketId;

    //             const exchangeId = MarketInfo.idToExchangeId(marketId);
    //             let exchangeIdNotIncluded: boolean;
    //             if (allowedExchangeIdCount === 0) {
    //                 exchangeIdNotIncluded = true;
    //             } else {
    //                 exchangeIdNotIncluded = this._allowedExchanges.lastIndexOf(exchangeId, allowedExchangeIdCount - 1) === -1;
    //             }
    //             if (exchangeIdNotIncluded) {
    //                 this._allowedExchanges[allowedExchangeIdCount++] = exchangeId;
    //             }
    //         }

    //         this._allowedExchanges.length = allowedExchangeIdCount;

    //         const allowedMarketIdsChanged = !isArrayEqualUniquely(this._allowedMarkets, oldAllowedMarketIds);
    //         if (allowedMarketIdsChanged) {
    //             this.notifyAllowedMarketIdsChanged();
    //         }

    //         const allowedExchangeIdsChanged = !isArrayEqualUniquely(this._allowedExchanges, oldAllowedExchangeIds);
    //         if (allowedExchangeIdsChanged) {
    //             this.notifyAllowedExchangeIdsChanged();
    //         }
    //     }
    // }

    private getSettingFormattedValue(id: SymbolsService.SettingId) {
        switch (id) {
            case ScalarSettings.Id.Symbol_DefaultParseModeAuto:
                return TypedKeyValueSettings.formatBoolean(this._defaultParseModeAuto);
            case ScalarSettings.Id.Symbol_ExplicitDefaultParseModeId:
                return SymbolsService.ParseMode.idToJsonValue(this._explicitDefaultParseModeId);
            case ScalarSettings.Id.Symbol_ZenithSymbologySupportLevelId:
                return SymbolsService.ZenithSymbologySupportLevel.idToJsonValue(this._zenithSymbologySupportLevelId);
            case ScalarSettings.Id.Symbol_PromptDefaultExchangeIfRicParseModeId:
                return TypedKeyValueSettings.formatBoolean(this._promptDefaultExchangeIfRicParseModeId);
            case ScalarSettings.Id.Symbol_DefaultExchangeZenithCode:
                return TypedKeyValueSettings.formatString(this._defaultExchange.zenithCode);
            case ScalarSettings.Id.Symbol_RicAnnouncerChar:
                return TypedKeyValueSettings.formatString(this._ricAnnouncerChar);
            case ScalarSettings.Id.Symbol_PscAnnouncerChar:
                return TypedKeyValueSettings.formatString(this._pscAnnouncerChar);
            case ScalarSettings.Id.Symbol_PscExchangeAnnouncerChar:
                return TypedKeyValueSettings.formatString(this._pscExchangeAnnouncerChar);
            case ScalarSettings.Id.Symbol_PscMarketAnnouncerChar:
                return TypedKeyValueSettings.formatString(this._pscMarketAnnouncerChar);
            case ScalarSettings.Id.Symbol_PscExchangeHideModeId:
                return SymbolsService.ExchangeHideMode.idToJsonValue(this._pscExchangeHideModeId);
            case ScalarSettings.Id.Symbol_PscDefaultMarketHidden:
                return TypedKeyValueSettings.formatBoolean(this._pscDefaultMarketHidden);
            case ScalarSettings.Id.Symbol_PscMarketCodeAsLocalWheneverPossible:
                return TypedKeyValueSettings.formatBoolean(this._pscMarketCodeAsLocalWheneverPossible);
            case ScalarSettings.Id.Symbol_AutoSelectDefaultMarketDest:
                return TypedKeyValueSettings.formatBoolean(this._autoSelectDefaultMarketDest);
            case ScalarSettings.Id.Symbol_ExplicitSearchFieldsEnabled:
                return TypedKeyValueSettings.formatBoolean(this._explicitSearchFieldsEnabled);
            case ScalarSettings.Id.Symbol_ExplicitSearchFieldIds:
                return SymbolField.idArrayToJsonValue(this._explicitSearchFieldIds);
            default:
                throw new UnreachableCaseError('SSGSFV68334', id);
        }
    }

    private notifyFormattedSettingChanged(settingId: Integer) {
        if (this._settingsServiceLinked) {
            this._scalarSettings.notifyFormattedSettingChanged(settingId);
        }
    }

    private pushSettingFormattedValue(id: SymbolsService.SettingId, formattedValue: string | undefined) {
        switch (id) {
            case ScalarSettings.Id.Symbol_DefaultParseModeAuto: {
                if (formattedValue === undefined) {
                    this._defaultParseModeAuto = SymbolsService.defaultDefaultParseModeAuto;
                } else {
                    const value = TypedKeyValueSettings.tryParseBooleanText(formattedValue);
                    this._defaultParseModeAuto = value ?? SymbolsService.defaultDefaultParseModeAuto;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_ExplicitDefaultParseModeId: {
                if (formattedValue === undefined) {
                    this._explicitDefaultParseModeId = SymbolsService.defaultExplicitParseModeId;
                } else {
                    const value = SymbolsService.ParseMode.tryJsonValueToId(formattedValue);
                    this._explicitDefaultParseModeId = value ?? SymbolsService.defaultExplicitParseModeId;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_ZenithSymbologySupportLevelId: {
                if (formattedValue === undefined) {
                    this._zenithSymbologySupportLevelId = SymbolsService.defaultZenithSymbologySupportLevelId;
                } else {
                    const value = SymbolsService.ZenithSymbologySupportLevel.tryJsonValueToId(formattedValue);
                    this._zenithSymbologySupportLevelId = value ?? SymbolsService.defaultZenithSymbologySupportLevelId;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_PromptDefaultExchangeIfRicParseModeId: {
                if (formattedValue === undefined) {
                    this._promptDefaultExchangeIfRicParseModeId = SymbolsService.defaultPromptDefaultExchangeIfRicParseModeId;
                } else {
                    const value = TypedKeyValueSettings.tryParseBooleanText(formattedValue);
                    this._promptDefaultExchangeIfRicParseModeId = value ?? SymbolsService.defaultPromptDefaultExchangeIfRicParseModeId;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_DefaultExchangeZenithCode: {
                if (formattedValue === undefined) {
                    this._defaultExchange = this._marketsService.defaultDefaultExchange;
                } else {
                    const value = this._marketsService.exchanges.findZenithCode(formattedValue);
                    if (value === undefined) {
                        this._defaultExchange = this._marketsService.defaultDefaultExchange;
                    } else {
                        this._defaultExchange = value;
                    }
                }
                break;
            }
            case ScalarSettings.Id.Symbol_RicAnnouncerChar: {
                if (formattedValue === undefined) {
                    this._ricAnnouncerChar = SymbolsService.defaultRicAnnouncerChar;
                } else {
                    const value = TypedKeyValueSettings.tryParseCharText(formattedValue);
                    if (value === undefined) {
                        this._ricAnnouncerChar = SymbolsService.defaultRicAnnouncerChar;
                    } else {
                        this._ricAnnouncerChar = this.checkFixRicAnnouncerChar(value);
                    }
                }
                break;
            }
            case ScalarSettings.Id.Symbol_PscAnnouncerChar: {
                if (formattedValue === undefined) {
                    this._pscAnnouncerChar = SymbolsService.defaultPscAnnouncerChar;
                } else {
                    const value = TypedKeyValueSettings.tryParseCharText(formattedValue);
                    if (value === undefined) {
                        this._pscAnnouncerChar = SymbolsService.defaultPscAnnouncerChar;
                    } else {
                        this._pscAnnouncerChar = this.checkFixPscAnnouncerChar(value);
                    }

                }
                break;
            }
            case ScalarSettings.Id.Symbol_PscExchangeAnnouncerChar: {
                if (formattedValue === undefined) {
                    this._pscExchangeAnnouncerChar = SymbolsService.defaultPscExchangeAnnouncerChar;
                } else {
                    const value = TypedKeyValueSettings.tryParseCharText(formattedValue);
                    if (value === undefined) {
                        this._pscExchangeAnnouncerChar = SymbolsService.defaultPscExchangeAnnouncerChar;
                    } else {
                        this._pscExchangeAnnouncerChar = this.checkFixExchangeAnnouncerChar(value);
                    }
                }
                break;
            }
            case ScalarSettings.Id.Symbol_PscMarketAnnouncerChar: {
                if (formattedValue === undefined) {
                    this._pscMarketAnnouncerChar = SymbolsService.defaultPscMarketAnnouncerChar;
                } else {
                    const value = TypedKeyValueSettings.tryParseCharText(formattedValue);
                    if (value === undefined) {
                        this._pscMarketAnnouncerChar = SymbolsService.defaultPscMarketAnnouncerChar;
                    } else {
                        this._pscMarketAnnouncerChar = this.checkFixMarketAnnouncerChar(value);
                    }
                }
                break;
            }
            case ScalarSettings.Id.Symbol_PscExchangeHideModeId: {
                if (formattedValue === undefined) {
                    this._pscExchangeHideModeId = SymbolsService.defaultPscExchangeHideModeId;
                } else {
                    const value = SymbolsService.ExchangeHideMode.tryJsonValueToId(formattedValue);
                    this._pscExchangeHideModeId = value ?? SymbolsService.defaultPscExchangeHideModeId;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_PscDefaultMarketHidden: {
                if (formattedValue === undefined) {
                    this._pscDefaultMarketHidden = SymbolsService.defaultPscDefaultMarketHidden;
                } else {
                    const value = TypedKeyValueSettings.tryParseBooleanText(formattedValue);
                    this._pscDefaultMarketHidden = value ?? SymbolsService.defaultPscDefaultMarketHidden;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_PscMarketCodeAsLocalWheneverPossible: {
                if (formattedValue === undefined) {
                    this._pscMarketCodeAsLocalWheneverPossible = SymbolsService.defaultPscMarketCodeAsLocalWheneverPossible;
                } else {
                    const value = TypedKeyValueSettings.tryParseBooleanText(formattedValue);
                    this._pscMarketCodeAsLocalWheneverPossible = value ?? SymbolsService.defaultPscMarketCodeAsLocalWheneverPossible;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_AutoSelectDefaultMarketDest: {
                if (formattedValue === undefined) {
                    this._autoSelectDefaultMarketDest = SymbolsService.defaultAutoSelectDefaultMarketDest;
                } else {
                    const value = TypedKeyValueSettings.tryParseBooleanText(formattedValue);
                    this._autoSelectDefaultMarketDest = value ?? SymbolsService.defaultAutoSelectDefaultMarketDest;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_ExplicitSearchFieldsEnabled: {
                if (formattedValue === undefined) {
                    this._explicitSearchFieldsEnabled = SymbolsService.defaultExplicitSearchFieldsEnabled;
                } else {
                    const value = TypedKeyValueSettings.tryParseBooleanText(formattedValue);
                    this._explicitSearchFieldsEnabled = value ?? SymbolsService.defaultExplicitSearchFieldsEnabled;
                }
                break;
            }
            case ScalarSettings.Id.Symbol_ExplicitSearchFieldIds: {
                if (formattedValue === undefined) {
                    this._explicitSearchFieldIds = SymbolsService.defaultExplicitSearchFieldIds;
                } else {
                    const value = SymbolField.tryJsonValueToIdArray(formattedValue);
                    this._explicitSearchFieldIds = value ?? SymbolsService.defaultExplicitSearchFieldIds;
                }
                break;
            }
            default: {
                const ignoredId: never = id; // only used for compilation purposes
            }
        }
    }

    // private resolveUsableAllowedExchangeAndMarketIdPromises(finalised: boolean) {
    //     if (finalised) {
    //         this.resolveUsableAllowedExchangeIdPromises(undefined);
    //         this.resolveUsableAllowedMarketIdPromises(undefined);
    //     } else {
    //         this.resolveUsableAllowedExchangeIdPromises(this._allowedExchanges);
    //         this.resolveUsableAllowedMarketIdPromises(this._allowedMarkets);
    //     }
    // }

    // private resolveUsableAllowedExchangeIdPromises(value: ExchangeId[] | undefined) {
    //     const resolveCount = this._usableAllowedExchangeIdsResolves.length;
    //     if (resolveCount > 0) {
    //         for (const resolve of this._usableAllowedExchangeIdsResolves) {
    //             resolve(value);
    //         }
    //         this._usableAllowedExchangeIdsResolves.length = 0;
    //     }
    // }

    // private resolveUsableAllowedMarketIdPromises(value: MarketId[] | undefined) {
    //     const resolveCount = this._usableAllowedMarketIdsResolves.length;
    //     if (resolveCount > 0) {
    //         for (const resolve of this._usableAllowedMarketIdsResolves) {
    //             resolve(value);
    //         }
    //         this._usableAllowedMarketIdsResolves.length = 0;
    //     }
    // }

    // move to extension
    // private parseRicDataIvemId(ricValue: string): SymbolsManager.DataIvemIdParseDetails {
    //     const parseResult = EikonUtils.parseRic(ricValue);

    //     const result = new SymbolsManager.DataIvemIdParseDetails();
    //     result.success = parseResult.success;
    //     if (!parseResult.success) {
    //         result.dataIvemId = undefined;
    //     } else {
    //         result.dataIvemId = parseResult.createDataIvemId();
    //     }
    //     result.isRic = true;
    //     result.sourceIdExplicit = false;
    //     result.marketIdExplicit = parseResult.success;
    //     result.errorText = parseResult.errorText;
    //     result.value = ricValue;

    //     return result;
    // }

    // private parseRicIvemId(ricValue: string) {
    //     const parseResult = EikonUtils.parseRic(ricValue);

    //     const result = new SymbolsManager.IvemIdParseDetails();

    //     if (!parseResult.success) {
    //         result.ivemId = undefined;
    //         result.success = false;
    //     } else {
    //         const sourceId = Market.idToSymbolSourceId(parseResult.marketId);
    //         result.ivemId = IvemId.createFromCodeSource(parseResult.code, sourceId);
    //         result.success = true;
    //     }
    //     result.isRic = true;
    //     result.sourceIdExplicit = parseResult.success;
    //     result.errorText = parseResult.errorText;
    //     result.value = ricValue;

    //     return result;
    // }

    private builtinSymbologyParseMarketIvemId<T extends Market>(
        allMarkets: MarketsService.AllKnownMarkets<T>,
        defaultEnvironmentMarkets: MarketsService.DefaultExchangeEnvironmentKnownMarkets<T>,
        value: string,
        zenithSymbologySupportLevelId: SymbolsService.ZenithSymbologySupportLevelId,
        constructor: MarketIvemId.Constructor<T>,
    ): SymbolsService.MarketIvemIdParseDetails<T> {
        const marketTypeId = allMarkets.marketTypeId;
        const upperValue = value.trim().toUpperCase();
        let errorText: string | undefined;
        let marketIvemId: MarketIvemId<T> | undefined;
        let code = upperValue;
        let marketAnnouncerPos = -1; // prevent compiler warning
        let marketSymbologyCode: string | undefined;
        let marketValidAndExplicit: boolean;
        let exchangeSymbologyCode: string | undefined;
        let exchangeValidAndExplicit: boolean;
        let isZenith: boolean;

        for (let i = upperValue.length - 1; i >= 0; i--) {
            if (marketSymbologyCode === undefined && (upperValue[i] === this._pscMarketAnnouncerChar)) {
                marketSymbologyCode = upperValue.substring(i + 1);
                marketAnnouncerPos = i;
                code = upperValue.substring(0, i);
            } else {
                if (upperValue[i] === this._pscExchangeAnnouncerChar) {
                    if (marketSymbologyCode !== undefined) {
                        exchangeSymbologyCode = upperValue.substring(i + 1, marketAnnouncerPos);
                    } else {
                        exchangeSymbologyCode = upperValue.substring(i + 1);
                    }

                    code = upperValue.substring(0, i);
                    break;
                }
            }
        }

        if (exchangeSymbologyCode !== undefined) {
            const explicitExchange = this._defaultExchangeEnvironmentExchanges.findFirstSymbologyCode(exchangeSymbologyCode);

            if (explicitExchange === undefined) {
                exchangeValidAndExplicit = false;
                const canTryParseZenithSymbol =
                    zenithSymbologySupportLevelId !== SymbolsService.ZenithSymbologySupportLevelId.None &&
                    this._pscExchangeAnnouncerChar === ZenithProtocolCommon.codeMarketSeparator &&
                    marketSymbologyCode === undefined;
                if (canTryParseZenithSymbol) {
                    isZenith = true;
                    const market = allMarkets.findZenithCode(exchangeSymbologyCode); // treat exchangeSymbologyCode as a market Zenith code
                    if (market === undefined) {
                        errorText = `${Strings[StringId.InvalidExchangeOrZenithMarket]}: "${exchangeSymbologyCode}"`;
                        marketValidAndExplicit = false;
                        marketIvemId = new constructor(code, this._marketsService.getGenericUnknownMarket(marketTypeId));
                    } else {
                        marketValidAndExplicit = true;
                        marketIvemId = new constructor(code, market);
                    }
                } else {
                    isZenith = false;
                    errorText = `${Strings[StringId.InvalidExchange]}: "${exchangeSymbologyCode}"`;
                    let market: T;
                    if (marketSymbologyCode === undefined) {
                        market = this._marketsService.getGenericUnknownMarket(marketTypeId);
                        marketValidAndExplicit = false;
                    } else {
                        const foundMarket = allMarkets.findZenithCode(marketSymbologyCode);
                        if (foundMarket === undefined) {
                            marketValidAndExplicit = false;
                            market = this._marketsService.getGenericUnknownMarket(marketTypeId);
                        } else {
                            marketValidAndExplicit = true;
                            market = foundMarket;
                        }
                    }
                    marketIvemId = new constructor(code, market);
                }
            } else {
                isZenith = false;
                if (marketSymbologyCode !== undefined) {
                    const parseResult = this.parseMarketIvemIdMarket(defaultEnvironmentMarkets, code, explicitExchange, marketSymbologyCode, constructor);
                    if (parseResult.isErr()) {
                        errorText = parseResult.error;
                        marketIvemId = new constructor(code, this._marketsService.getGenericUnknownMarket(marketTypeId));
                        marketValidAndExplicit = false;
                    } else {
                        marketIvemId = parseResult.value;
                        marketValidAndExplicit = true;
                    }
                } else {
                    marketValidAndExplicit = false;
                    let market = explicitExchange.getDefaultMarket<T>(allMarkets.marketTypeId);
                    if (market === undefined) {
                        market = this._marketsService.getGenericUnknownMarket(marketTypeId) as unknown as T;
                        const stringId = marketTypeId === Market.TypeId.Data ? StringId.ExchangeDoesNotHaveDefaultLitMarket : StringId.ExchangeDoesNotHaveDefaultTradingMarket;
                        const errorName = Strings[stringId];
                        errorText = `${errorName}: ${explicitExchange.abbreviatedDisplay}`;
                    } else {
                        if (market.unknown) {
                            const errorName = Strings[StringId.ExchangeDoesNotHaveDefaultLitMarket];
                            errorText = `${errorName}: ${explicitExchange.abbreviatedDisplay}`;
                        }
                    }
                    marketIvemId = new constructor(code, market);
                }
                exchangeValidAndExplicit = marketValidAndExplicit;
            }
        } else {
            exchangeValidAndExplicit = false;
            isZenith = false;
            if (marketSymbologyCode !== undefined) {
                const parseResult = this.parseMarketIvemIdMarket(defaultEnvironmentMarkets, code, undefined, marketSymbologyCode, constructor);
                if (parseResult.isErr()) {
                    errorText = parseResult.error;
                    marketIvemId = new constructor(code, this._marketsService.getGenericUnknownMarket(marketTypeId));
                    marketValidAndExplicit = false;
                } else {
                    marketIvemId = parseResult.value;
                    marketValidAndExplicit = true;
                }
            } else {
                marketValidAndExplicit = false;
                const defaultExchange = this.defaultExchange;
                let market = defaultExchange.getDefaultMarket<T>(marketTypeId);
                if (market === undefined) {
                    market = this._marketsService.getGenericUnknownMarket(marketTypeId) as unknown as T;
                    const stringId = marketTypeId === Market.TypeId.Data ? StringId.ExchangeDoesNotHaveDefaultLitMarket : StringId.ExchangeDoesNotHaveDefaultTradingMarket;
                    const errorName = Strings[stringId];
                    errorText = `${errorName}: ${defaultExchange.abbreviatedDisplay}`;
                } else {
                    if (market.unknown) {
                        const errorName = Strings[StringId.ExchangeDoesNotHaveDefaultLitMarket];
                        errorText = `${errorName}: ${defaultExchange.abbreviatedDisplay}`;
                    }
                }
                marketIvemId = new constructor(code, market);
            }
        }

        if (errorText === undefined) {
            const codeError = this.getCodeError(code, marketIvemId.market.exchange);
            if (codeError !== undefined) {
                errorText = codeError;
            }
        }

        const result: SymbolsService.MarketIvemIdParseDetails<T> = {
            errorText,
            marketIvemId,
            isZenith,
            exchangeValidAndExplicit,
            marketValidAndExplicit,
            value,
        };

        return result;
    }

    private parseMarketIvemIdMarket<T extends Market>(
        defaultEnvironmentMarkets: MarketsService.DefaultExchangeEnvironmentKnownMarkets<T>,
        code: string,
        explicitExchange: Exchange | undefined,
        marketSymbologyCode: string,
        constructor: MarketIvemId.Constructor<T>,
    ): Result<MarketIvemId<T>> {
        let exchange: Exchange;
        let exchangeExplicit: boolean;
        if (explicitExchange === undefined) {
            exchange = this.defaultExchange;
            exchangeExplicit = false;
        } else {
            exchange = explicitExchange;
            exchangeExplicit = true;
        }

        let marketSpecifiedWithExchangeSuffix = false;
        // let litId = this._pscMarketMap.findId(marketSymbologyCode);
        let market = defaultEnvironmentMarkets.findFirstSymbologyCode(marketSymbologyCode);
        if (market === undefined) {
            // const localMarkets = ExchangeInfo.idToLocalMarkets(exchange);
            // for (const marketId of localMarkets) {
            //     const upperLocal = this._pscMarketMap.getUpperLocalCode(marketId);
            //     if (upperLocal === marketSymbologyCode) {
            //         market = marketId;
            //         break;
            //     }
            // }
            market = this.findExchangeMarketWithExchangeSuffixCode(defaultEnvironmentMarkets.marketTypeId, exchange, marketSymbologyCode);
            if (market !== undefined) {
                marketSpecifiedWithExchangeSuffix = true;
            }
        }

        if (market === undefined) {
            return new Err(`${Strings[StringId.InvalidMarket]}: "${marketSymbologyCode}"`);
        } else {
            if (!marketSpecifiedWithExchangeSuffix && exchangeExplicit && !market.areExchangeSymbolsSupported(exchange)) {
                const notSupportExchangeText = Strings[StringId.MarketDoesNotSupportSymbolsFromExchange];
                return new Err(`${notSupportExchangeText}: ${exchange.abbreviatedDisplay}, ${market.display}`);
            } else {
                const marketIvemId = new constructor(code, market);
                return new Ok(marketIvemId);
            }
        }
    }

    private parsePscIvemId(value: string, zenithSymbologySupportLevelId: SymbolsService.ZenithSymbologySupportLevelId) {
        const upperValue = value.trim().toUpperCase();
        let errorText: string | undefined;
        let exchange: Exchange | undefined;
        let code = upperValue;
        let exchangeSymbologyCode: string | undefined;
        let exchangeValidAndExplicit: boolean;
        let isZenith = false;

        for (let i = upperValue.length - 1; i >= 0; i--) {
            if (upperValue[i] === this._pscExchangeAnnouncerChar) {
                exchangeSymbologyCode = upperValue.substring(i + 1);
                code = upperValue.substring(0, i);
                break;
            }
        }

        if (exchangeSymbologyCode === undefined) {
            exchange = this.defaultExchange;
            exchangeValidAndExplicit = false;
        } else {
            exchange = this._defaultExchangeEnvironmentExchanges.findFirstSymbologyCode(exchangeSymbologyCode);

            if (exchange !== undefined) {
                exchangeValidAndExplicit = true;
            } else {
                const canTryParseZenithSymbol =
                    zenithSymbologySupportLevelId !== SymbolsService.ZenithSymbologySupportLevelId.None &&
                    this._pscExchangeAnnouncerChar === ZenithProtocolCommon.codeMarketSeparator
                if (!canTryParseZenithSymbol) {
                    exchange = this._marketsService.genericUnknownExchange;
                    errorText = `${Strings[StringId.InvalidExchange]}: "${exchangeSymbologyCode}"`;
                    exchangeValidAndExplicit = false;
                } else {
                    isZenith = true;
                    exchange = this._exchanges.findZenithCode(exchangeSymbologyCode);
                    if (exchange !== undefined) {
                        exchangeValidAndExplicit = true;
                    } else {
                        exchange = this._marketsService.genericUnknownExchange;
                        errorText = `${Strings[StringId.InvalidExchangeOrZenithExchange]}: "${exchangeSymbologyCode}"`;
                        exchangeValidAndExplicit = false;
                    }
                }
            }
        }

        const ivemId = new IvemId(code, exchange);

        if (errorText === undefined) {
            const codeError = this.getCodeError(code, exchange);
            if (codeError !== undefined) {
                errorText = codeError;
            }
        }

        const result: SymbolsService.IvemIdParseDetails = {
            errorText,
            ivemId,
            isZenith,
            exchangeValidAndExplicit,
            value,
        };

        return result;
    }

    private checkFixRicAnnouncerChar(value: string): string {
        switch (value.length) {
            case 0: return SymbolsService.defaultRicAnnouncerChar;
            case 1: return value;
            default: return value.substring(0, 1);
        }
    }

    private checkFixPscAnnouncerChar(value: string): string {
        switch (value.length) {
            case 0: return SymbolsService.defaultPscAnnouncerChar;
            case 1: return value;
            default: return value.substring(0, 1);
        }
    }

    private checkFixExchangeAnnouncerChar(value: string): string {
        switch (value.length) {
            case 0: return SymbolsService.defaultPscExchangeAnnouncerChar;
            case 1: return value;
            default: return value.substring(0, 1);
        }
    }

    private checkFixMarketAnnouncerChar(value: string): string {
        switch (value.length) {
            case 0: return SymbolsService.defaultPscMarketAnnouncerChar;
            case 1: return value;
            default: return value.substring(0, 1);
        }
    }

    private updateDefaultParseModeId() {
        if (!this._defaultParseModeAuto) {
            this._defaultParseModeId = this._explicitDefaultParseModeId;
        } else {
            // move to extension
            // if (EikonUtils.isEikonEnvironment()) {
            //     this._defaultParseModeId = SymbolsManager.ParseModeId.Ric;
            // } else {
                this._defaultParseModeId = SymbolsService.ParseModeId.BuiltInSymbology;
            // }
        }
    }

    private calculateParseMode(value: string): SymbolsService.CalculatedParseModeId {
        if (value.length === 0) {
            return SymbolsService.CalculatedParseModeId.createInvalid(Strings[StringId.Blank]);
        } else {
            switch (value[0]) {
                // case this._ricAnnouncerChar:
                //     if (value.length < 2) {
                //         return SymbolsManager.CalculatedParseModeId.createInvalid(Strings[StringId.InsufficientCharacters]);
                //     } else {
                //         return SymbolsManager.CalculatedParseModeId.createValid(SymbolsManager.ParseModeId.Ric, value.substring(1));
                //     }

                case this._pscAnnouncerChar:
                    if (value.length < 2) {
                        return SymbolsService.CalculatedParseModeId.createInvalid(Strings[StringId.InsufficientCharacters]);
                    } else {
                        return SymbolsService.CalculatedParseModeId.createValid(SymbolsService.ParseModeId.BuiltInSymbology, value.substring(1));
                    }

                default:
                    // move to extension
                    switch (this._defaultParseModeId) {
                        // case SymbolsManager.ParseModeId.Ric:
                        //     return SymbolsManager.CalculatedParseModeId.createValid(SymbolsManager.ParseModeId.Ric, value);
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        case SymbolsService.ParseModeId.BuiltInSymbology:
                            return SymbolsService.CalculatedParseModeId.createValid(SymbolsService.ParseModeId.BuiltInSymbology, value);
                        default:
                            throw new UnreachableCaseError('SMCPMDDD399467', this._defaultParseModeId);
                    }
            }
        }
    }

    // move to extension
    // private ricNotNullDataIvemIdToDisplay(dataIvemId: DataIvemId) {
    //     if (dataIvemId.ric !== undefined) {
    //         return dataIvemId.ric;
    //     } else {
    //         const possibleRic = EikonUtils.notNullDataIvemIdToRic(dataIvemId);
    //         if (possibleRic === undefined) {
    //             return '';
    //         } else {
    //             return possibleRic;
    //         }
    //     }
    // }

    private definedMarketIvemIdToDisplay<T extends Market>(marketIvemId: MarketIvemId<T>, nothingHidden: boolean, zenithSymbologySupportLevelId: SymbolsService.ZenithSymbologySupportLevelId) {
        const code = marketIvemId.code;
        const market = marketIvemId.market;

        if (zenithSymbologySupportLevelId === SymbolsService.ZenithSymbologySupportLevelId.ParseAndDisplay) {
            return `${code}${ZenithProtocolCommon.codeMarketSeparator}${market.zenithCode}`;
        } else {
            const exchange = market.exchange;

            let exchangeHideModeId: SymbolsService.ExchangeHideMode.Id;
            let resolvedDefaultMarketHidden: boolean;
            if (nothingHidden) {
                exchangeHideModeId = SymbolsService.ExchangeHideModeId.Never;
                resolvedDefaultMarketHidden = false;
            } else {
                exchangeHideModeId = this._pscExchangeHideModeId;
                resolvedDefaultMarketHidden = this._pscDefaultMarketHidden;
            }

            let displayMarketAsLocal: boolean;
            let marketHidden: boolean;
            if (resolvedDefaultMarketHidden && market === exchange.getDefaultMarket<T>(market.typeId)) {
                marketHidden = true;
                displayMarketAsLocal = false; // actually may be local but since market is hidden we dont care
            } else {
                marketHidden = false;
                displayMarketAsLocal = this._pscMarketCodeAsLocalWheneverPossible && market.exchange === exchange;
            }

            switch (exchangeHideModeId) {
                case SymbolsService.ExchangeHideModeId.Never: {
                    if (marketHidden) {
                        return `${code}${this.pscExchangeAnnouncerChar}${exchange.symbologyCode}`;
                    } else {
                        const marketDisplay = displayMarketAsLocal ? market.symbologyExchangeSuffixCode : market.symbologyCode;
                        return `${code}${this.pscExchangeAnnouncerChar}${exchange.symbologyCode}${this.pscMarketAnnouncerChar}${marketDisplay}`;
                    }
                }

                case SymbolsService.ExchangeHideModeId.Default: {
                    let result: string;
                    if (exchange === this.defaultExchange) {
                        result = code;
                    } else {
                        result = `${code}${this.pscExchangeAnnouncerChar}${exchange.symbologyCode}`;
                    }

                    if (!marketHidden) {
                        const marketDisplay = displayMarketAsLocal ? market.symbologyExchangeSuffixCode : market.symbologyCode;
                        result += `${this.pscMarketAnnouncerChar}${marketDisplay}`;
                    }

                    return result;
                }

                case SymbolsService.ExchangeHideModeId.WheneverPossible: {
                    let result: string;
                    const isDefaultExchange = exchange === this.defaultExchange;
                    const exchangeHidden = !marketHidden || isDefaultExchange;
                    if (exchangeHidden) {
                        result = code;
                    } else {
                        result = `${code}${this.pscExchangeAnnouncerChar}${exchange.symbologyCode}`;
                    }

                    if (!marketHidden) {
                        const marketDisplay = displayMarketAsLocal && isDefaultExchange ? market.symbologyExchangeSuffixCode : market.symbologyCode;
                        result += `${this.pscMarketAnnouncerChar}${marketDisplay}`;
                    }
                    return result;
                }

                default:
                    throw new UnreachableCaseError('SMPNNCSIMITD38846', exchangeHideModeId);
            }
        }
    }

    private getCodeError(code: string, exchange: Exchange): string | undefined {
        if (code.length === 0) {
            return Strings[StringId.SymbolCodeError_Missing];
        } else {
            // This should be moved into markets config
            switch (exchange.unenvironmentedZenithCode as ZenithProtocolCommon.KnownExchange) {
                case ZenithProtocolCommon.KnownExchange.Myx: {
                    const codeCharCount = code.length;
                    if (codeCharCount < 4) {
                        return `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_MustContainAtLeast4Characters]}`;
                    } else {
                        for (let i = 0; i < 4; i++) {
                            const charCode = code.charCodeAt(i);
                            if (!isDigitCharCode(charCode)) {
                                return `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_CanOnlyContainDigits]}`;
                            }
                        }
                        return undefined;
                    }
                }
                case ZenithProtocolCommon.KnownExchange.Asx: {
                    return code.length >= 3 ? undefined : `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_MustContainAtLeast3Characters]}`;
                }
                case ZenithProtocolCommon.KnownExchange.Nzx: {
                    return code.length >= 3 ? undefined : `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_MustContainAtLeast3Characters]}`;
                }
                case ZenithProtocolCommon.KnownExchange.Ptx: {
                    return code.length >= 3 ? undefined : `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_MustContainAtLeast3Characters]}`;
                }
                case ZenithProtocolCommon.KnownExchange.Fnsx: {
                    return code.length >= 3 ? undefined : `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_MustContainAtLeast3Characters]}`;
                }
                case ZenithProtocolCommon.KnownExchange.Fpsx: {
                    return code.length >= 3 ? undefined : `${exchange.abbreviatedDisplay} ${Strings[StringId.SymbolCodeError_MustContainAtLeast3Characters]}`;
                }
                default:
                    return undefined;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    private findExchangeMarketWithExchangeSuffixCode<T extends Market>(marketTypeId: Market.TypeId, exchange: Exchange, suffixCode: string): T | undefined {
        const exchangeMarkets = exchange.getMarkets<T>(marketTypeId);
        const exchangeMarketCount = exchangeMarkets.length;
        for (let i = 0; i < exchangeMarketCount; i++) {
            const exchangeMarket = exchangeMarkets[i];
            if (exchangeMarket.upperSymbologyExchangeSuffixCode === suffixCode) {
                return exchangeMarket;
            }
        }
        return undefined;
    }
}

export namespace SymbolsService {
    // move to extension
    export const enum ParseModeId {
        // Ric,
        BuiltInSymbology,
    }

    export const enum ZenithSymbologySupportLevelId {
        None,
        Parse,
        ParseAndDisplay
    }

    export const enum ExchangeHideModeId {
        Never,
        Default,
        WheneverPossible
    }

    export type SettingId = PickEnum<ScalarSettings.Id,
        ScalarSettings.Id.Symbol_DefaultParseModeAuto |
        ScalarSettings.Id.Symbol_ExplicitDefaultParseModeId |
        ScalarSettings.Id.Symbol_ZenithSymbologySupportLevelId |
        ScalarSettings.Id.Symbol_PromptDefaultExchangeIfRicParseModeId |
        ScalarSettings.Id.Symbol_DefaultExchangeZenithCode |
        ScalarSettings.Id.Symbol_RicAnnouncerChar |
        ScalarSettings.Id.Symbol_PscAnnouncerChar |
        ScalarSettings.Id.Symbol_PscExchangeAnnouncerChar |
        ScalarSettings.Id.Symbol_PscMarketAnnouncerChar |
        ScalarSettings.Id.Symbol_PscExchangeHideModeId |
        ScalarSettings.Id.Symbol_PscDefaultMarketHidden |
        ScalarSettings.Id.Symbol_PscMarketCodeAsLocalWheneverPossible |
        ScalarSettings.Id.Symbol_AutoSelectDefaultMarketDest |
        ScalarSettings.Id.Symbol_ExplicitSearchFieldsEnabled |
        ScalarSettings.Id.Symbol_ExplicitSearchFieldIds
    >;

    export const settingIds: SettingId[] = [
        ScalarSettings.Id.Symbol_DefaultParseModeAuto,
        ScalarSettings.Id.Symbol_ExplicitDefaultParseModeId,
        ScalarSettings.Id.Symbol_ZenithSymbologySupportLevelId,
        ScalarSettings.Id.Symbol_PromptDefaultExchangeIfRicParseModeId,
        ScalarSettings.Id.Symbol_DefaultExchangeZenithCode,
        ScalarSettings.Id.Symbol_RicAnnouncerChar,
        ScalarSettings.Id.Symbol_PscAnnouncerChar,
        ScalarSettings.Id.Symbol_PscExchangeAnnouncerChar,
        ScalarSettings.Id.Symbol_PscMarketAnnouncerChar,
        ScalarSettings.Id.Symbol_PscExchangeHideModeId,
        ScalarSettings.Id.Symbol_PscDefaultMarketHidden,
        ScalarSettings.Id.Symbol_PscMarketCodeAsLocalWheneverPossible,
        ScalarSettings.Id.Symbol_AutoSelectDefaultMarketDest,
        ScalarSettings.Id.Symbol_ExplicitSearchFieldsEnabled,
        ScalarSettings.Id.Symbol_ExplicitSearchFieldIds,
    ];

    export const defaultDefaultParseModeAuto = true;
    export const defaultExplicitParseModeId = ParseModeId.BuiltInSymbology;
    export const defaultZenithSymbologySupportLevelId = ZenithSymbologySupportLevelId.None;
    export const defaultPromptDefaultExchangeIfRicParseModeId = false;
    // export const defaultDefaultExchangeId = ExchangeId.Asx;
    export const defaultRicAnnouncerChar = ']';
    export const defaultPscAnnouncerChar = '{';
    export const defaultPscExchangeAnnouncerChar = '.';
    export const defaultPscMarketAnnouncerChar = '@';
    export const defaultPscExchangeHideModeId = ExchangeHideModeId.WheneverPossible;
    export const defaultPscDefaultMarketHidden = true;
    export const defaultPscMarketCodeAsLocalWheneverPossible = true;
    export const defaultAutoSelectDefaultMarketDest = true;
    export const defaultExplicitSearchFieldsEnabled = false;
    export const defaultExplicitSearchFieldIds = [SymbolFieldId.Code, SymbolFieldId.Name];

    // export interface ForceCreateMarketIvemIdResult<T extends Market> {
    //     marketIvemId: MarketIvemId<T>;
    //     errorId: ForceCreateMarketIvemIdResult.ErrorId | undefined;
    // }

    export namespace ForceCreateMarketIvemIdResult {
        export const enum ErrorId {
            CodeMissing,
            InvalidExchange,
            InvalidMarket,
            ExchangeDoesNotSupportMarket,
            ExchangeDoesNotHaveDefaultLitMarket,
        }
    }

    export interface MarketIvemIdParseDetails<T extends Market> {
        errorText: string | undefined;
        marketIvemId: MarketIvemId<T>;
        isZenith: boolean;
        exchangeValidAndExplicit: boolean;
        marketValidAndExplicit: boolean;
        value: string;
    }

    export namespace MarketIvemIdParseDetails {
        export function createFail<T extends Market>(unknownMarket: T, marketIvemIdConstructor: MarketIvemId.Constructor<T>, value: string, errorText: string) {
            const result: MarketIvemIdParseDetails<T> = {
                errorText,
                marketIvemId: MarketIvemId.createUnknown(unknownMarket, marketIvemIdConstructor),
                isZenith: false,
                exchangeValidAndExplicit: false,
                marketValidAndExplicit: false,
                value
            };
            return result;
        }
        // export function createUndefinedSuccess<T extends Market>(value: string) {
        //     const result: MarketIvemIdParseDetails<T> = {
        //         success: true,
        //         marketIvemId: undefined,
        //         isZenith: false,
        //         exchangeExplicit: false,
        //         marketExplicit: false,
        //         errorText: '',
        //         value,
        //     };
        //     return result;
        // }
    }

    export interface IvemIdParseDetails {
        errorText: string | undefined;
        ivemId: IvemId;
        isZenith: boolean;
        exchangeValidAndExplicit: boolean;
        value: string;
    }

    export namespace IvemIdParseDetails {
        export function createFail(marketsService: MarketsService, value: string, errorText: string) {
            const result: IvemIdParseDetails = {
                errorText,
                ivemId: IvemId.createUnknown(marketsService.genericUnknownExchange),
                isZenith: false,
                exchangeValidAndExplicit: false,
                value
            };
            return result;
        }
        // export function createUndefinedSuccess() {
        //     const result: IvemIdParseDetails = {
        //         success: true,
        //         ivemId: undefined,
        //         isZenith: false,
        //         exchangeExplicit: false,
        //         errorText: '',
        //         value: ''
        //     };
        //     return result;
        // }
    }

    export class CalculatedParseModeId {
        valid: boolean;
        id: ParseModeId;
        parseText: string;
        errorText: string;
    }

    export namespace CalculatedParseModeId {
        export function createInvalid(errorText: string) {
            const result = new CalculatedParseModeId();
            result.valid = false;
            result.errorText = errorText;
            return result;
        }

        export function createValid(id: ParseModeId, text: string) {
            const result = new CalculatedParseModeId();
            result.valid = true;
            result.id = id;
            result.parseText = text;
            return result;
        }
    }

    export namespace ParseMode {
        export type Id = ParseModeId;

        interface Info {
            readonly id: Id;
            readonly jsonValue: string;
            readonly display: string;
        }

        type InfosObject = { [id in keyof typeof ParseModeId]: Info };

        // move to extension
        const infosObject: InfosObject = {
            // Ric: { id: ParseModeId.Ric,
            //     jsonValue: 'ric',
            //     display: 'ric',
            // },
            BuiltInSymbology: { id: ParseModeId.BuiltInSymbology,
                jsonValue: 'builtinSymbology',
                display: 'Built In Symbology',
            }
        };

        export const idCount = Object.keys(infosObject).length;

        const infos = Object.values(infosObject);

        export function initialise() {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ParseModeId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('SymbolsService.ParseModeId', outOfOrderIdx, infos[outOfOrderIdx].jsonValue);
            }
        }

        export function getAll(): Id[] {
            return infos.map(info => info.id);
        }

        export function idToDisplay(id: Id): string {
            return infos[id].display;
        }

        export function idToJsonValue(id: Id): string {
            return infos[id].jsonValue;
        }

        export function jsonValueToId(value: string): Id {
            const index = infos.findIndex(info => info.jsonValue === value);
            if (index >= 0) {
                return infos[index].id;
            } else {
                throw new JsonLoadError(ErrorCode.SymbolsServiceParseModeJsonValueToId, value);
            }
        }

        export function tryJsonValueToId(value: string): Id | undefined {
            const index = infos.findIndex(info => info.jsonValue === value);
            return index >= 0 ? infos[index].id : undefined;
        }
    }

    export namespace ZenithSymbologySupportLevel {
        export type Id = ZenithSymbologySupportLevelId;

        interface Info {
            readonly id: Id;
            readonly jsonValue: string;
            readonly displayId: StringId;
            readonly descriptionId: StringId;
        }

        type InfosObject = { [id in keyof typeof ZenithSymbologySupportLevelId]: Info };

        const infosObject: InfosObject = {
            None: { id: ZenithSymbologySupportLevelId.None,
                jsonValue: 'none',
                displayId: StringId.ZenithSymbologySupportLevelDisplay_None,
                descriptionId: StringId.ZenithSymbologySupportLevelDescription_None,
            },
            Parse: { id: ZenithSymbologySupportLevelId.Parse,
                jsonValue: 'parse',
                displayId: StringId.ZenithSymbologySupportLevelDisplay_Parse,
                descriptionId: StringId.ZenithSymbologySupportLevelDescription_Parse,
            },
            ParseAndDisplay: { id: ZenithSymbologySupportLevelId.ParseAndDisplay,
                jsonValue: 'parseAndDisplay',
                displayId: StringId.ZenithSymbologySupportLevelDisplay_ParseAndDisplay,
                descriptionId: StringId.ZenithSymbologySupportLevelDescription_ParseAndDisplay,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ZenithSymbologySupportLevelId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('SymbolsService.ZenithSymbologySupportLevel', outOfOrderIdx, infos[outOfOrderIdx].jsonValue);
            }
        }

        export function getAll() {
            return infos.map(info => info.id);
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

        export function idToDescription(id: Id) {
            return Strings[idToDescriptionId(id)];
        }

        export function idToJsonValue(id: Id): string {
            return infos[id].jsonValue;
        }

        export function jsonValueToId(value: string): Id {
            const index = infos.findIndex(info => info.jsonValue === value);
            if (index >= 0) {
                return infos[index].id;
            } else {
                throw new JsonLoadError(ErrorCode.SymbolsServiceZenithSymbologySupportLevelJsonValueToId, value);
            }
        }

        export function tryJsonValueToId(value: string): Id | undefined {
            const index = infos.findIndex(info => info.jsonValue === value);
            return index >= 0 ? infos[index].id : undefined;
        }
    }

    export namespace ExchangeHideMode {
        export type Id = ExchangeHideModeId;

        interface Info {
            readonly id: Id;
            readonly jsonValue: string;
            readonly displayId: StringId;
            readonly descriptionId: StringId;
        }

        type InfosObject = { [id in keyof typeof ExchangeHideModeId]: Info };

        const infosObject: InfosObject = {
            Never: { id: ExchangeHideModeId.Never,
                jsonValue: 'never',
                displayId: StringId.SymbolExchangeHideModeDisplay_Never,
                descriptionId: StringId.SymbolExchangeHideModeDescription_Never,
            },
            Default: { id: ExchangeHideModeId.Default,
                jsonValue: 'default',
                displayId: StringId.SymbolExchangeHideModeDisplay_Default,
                descriptionId: StringId.SymbolExchangeHideModeDescription_Default,
            },
            WheneverPossible: { id: ExchangeHideModeId.WheneverPossible,
                jsonValue: 'wheneverPossible',
                displayId: StringId.SymbolExchangeHideModeDisplay_WheneverPossible,
                descriptionId: StringId.SymbolExchangeHideModeDescription_WheneverPossible,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ExchangeHideModeId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('SymbolsService.ExchangeHideMode', outOfOrderIdx, infos[outOfOrderIdx].jsonValue);
            }
        }

        export function getAll() {
            return infos.map(info => info.id);
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

        export function idToDescription(id: Id) {
            return Strings[idToDescriptionId(id)];
        }

        export function idToJsonValue(id: Id): string {
            return infos[id].jsonValue;
        }

        export function jsonValueToId(value: string): Id {
            const index = infos.findIndex(info => info.jsonValue === value);
            if (index >= 0) {
                return infos[index].id;
            } else {
                throw new JsonLoadError(ErrorCode.SymbolsServiceExchangeHideModeJsonValueToId, value);
            }
        }

        export function tryJsonValueToId(value: string): Id | undefined {
            const index = infos.findIndex(info => info.jsonValue === value);
            return index >= 0 ? infos[index].id : undefined;
        }

    }

    // interface PscExchangeRec {
    //     id: ExchangeId;
    //     code: string;
    //     upper: string;
    // }

    // export class PscExchangeDisplayCodeMap {
    //     private mapArray = new Array<PscExchangeRec>(ExchangeInfo.idCount);

    //     constructor() {
    //         // in future, get from Settings using below as default
    //         for (let id = 0; id < ExchangeInfo.idCount; id++) {
    //             const code = ExchangeInfo.idToDefaultPscCode(id);

    //             this.mapArray[id] = {
    //                 id,
    //                 code,
    //                 upper: code.toUpperCase(),
    //             };
    //         }
    //     }

    //     get(id: ExchangeId) {
    //         return this.mapArray[id].code;
    //     }

    //     findId(upperCode: string): ExchangeId | undefined {
    //         const idx = this.mapArray.findIndex((rec) => rec.upper === upperCode);
    //         return idx >= 0 ? idx : undefined;
    //     }
    // }

    // interface PscMarketRec {
    //     id: MarketId;
    //     globalCode: string;
    //     upperGlobalCode: string;
    //     localCode: string;
    //     upperLocalCode: string;
    //     supportedExchanges: ExchangeId[];
    // }

    // export class PscMarketMap {
    //     private _mapArray = new Array<PscMarketRec>(MarketInfo.idCount);

    //     constructor() {
    //         // in future, get from Settings using below as default
    //         for (let id = 0; id < MarketInfo.idCount; id++) {
    //             const globalCode = MarketInfo.idToDefaultPscGlobalCode(id);
    //             const localCode = MarketInfo.idToDefaultExchangeLocalCode(id);
    //             this._mapArray[id] = {
    //                 id,
    //                 globalCode,
    //                 upperGlobalCode: globalCode.toUpperCase(),
    //                 localCode,
    //                 upperLocalCode: localCode.toUpperCase(),
    //                 supportedExchanges: concatenateArrayUniquely([MarketInfo.idToExchangeId(id)], MarketInfo.idToSupportedExchanges(id))
    //             };
    //         }
    //     }

    //     getGlobalCode(id: MarketId) {
    //         return this._mapArray[id].globalCode;
    //     }

    //     getUpperLocalCode(id: MarketId) {
    //         return this._mapArray[id].upperLocalCode;
    //     }

    //     getCode(id: MarketId, local: boolean) {
    //         const rec = this._mapArray[id];
    //         return local ? rec.localCode : rec.globalCode;
    //     }

    //     findId(upperGlobalCode: string) {
    //         const count = this._mapArray.length;
    //         for (let i = 0; i < count; i++) {
    //             const rec = this._mapArray[i];
    //             if (rec.upperGlobalCode === upperGlobalCode) {
    //                 return rec.id;
    //             }
    //         }
    //         return undefined;
    //     }

    //     getSupportedExchanges(id: MarketId) {
    //         return this._mapArray[id].supportedExchanges;
    //     }
    // }

    export function initialiseStatic() {
        ParseMode.initialise();
        ExchangeHideMode.initialise();
    }
}

export namespace SymbolsServiceModule {
    export function initialiseStatic() {
        SymbolsService.initialiseStatic();
    }
}
