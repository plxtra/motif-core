import {
    CommaText, compareString, compareUndefinableNumber, ComparisonResult, EnumInfoOutOfOrderError,
    Integer,
    MultiEvent
} from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/internal-api';
import {
    FieldDataTypeId
} from "../../sys/internal-api";
import { SymbolFieldId, unknownZenithCode, ZenithEnvironmentedValueParts } from '../common/internal-api';
// eslint-disable-next-line import-x/no-cycle
import { DataMarket } from './data-market';
// eslint-disable-next-line import-x/no-cycle
import { ExchangeEnvironment } from './exchange-environment';
// eslint-disable-next-line import-x/no-cycle
import { Market } from './market';
import { MarketsConfig } from './markets-config';
// eslint-disable-next-line import-x/no-cycle
import { TradingMarket } from './trading-market';

export class Exchange {
    readonly zenithCode: string;
    readonly mapKey: string;
    readonly abbreviatedDisplay: string;
    readonly fullDisplay: string;
    readonly displayPriority: number | undefined;
    readonly allowedSymbolNameFieldIds: readonly SymbolFieldId[];
    readonly defaultSymbolNameFieldId: SymbolFieldId;
    readonly allowedSymbolSearchFieldIds: readonly SymbolFieldId[];
    readonly defaultSymbolSearchFieldIds: readonly SymbolFieldId[];

    settings: Exchange.Settings | undefined;

    private readonly _dataMarkets: DataMarket[] = [];
    private readonly _tradingMarkets: TradingMarket[] = [];

    private _destroyed = false;

    private _isDefaultDefault: boolean;
    private _exchangeEnvironmentIsDefault: boolean;
    private _symbologyCode: string;
    private _defaultLitMarket: DataMarket | undefined;
    private _defaultTradingMarket: TradingMarket | undefined;

    private _beginChangeCount = 0;
    private _changedValueFieldIds = new Array<Exchange.FieldId>();

    private readonly _fieldValuesChangedMultiEvent = new MultiEvent<Exchange.FieldValuesChangedHandler>();

    constructor(
        readonly unenvironmentedZenithCode: string,
        readonly exchangeEnvironment: ExchangeEnvironment,
        exchangeConfig: MarketsConfig.Exchange | undefined,
        readonly unknown: boolean,
    ) {
        const environmentZenithCode = exchangeEnvironment.zenithCode;
        const zenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedZenithCode, environmentZenithCode);
        this.zenithCode = zenithCode;
        this.mapKey = zenithCode;

        if (exchangeConfig === undefined) {
            this.allowedSymbolNameFieldIds = MarketsConfig.Exchange.defaultAllowedSymbolNameFieldIds;
            this.defaultSymbolNameFieldId = this.allowedSymbolNameFieldIds[0];
            this.allowedSymbolSearchFieldIds = MarketsConfig.Exchange.defaultAllowedSymbolSearchFieldIds;
            this.defaultSymbolSearchFieldIds = this.allowedSymbolSearchFieldIds;
            this.abbreviatedDisplay = zenithCode;
            this.fullDisplay = zenithCode;
            // this.displayPriority = undefined;
        } else {
            this.allowedSymbolNameFieldIds = exchangeConfig.allowedSymbolNameFields;
            this.defaultSymbolNameFieldId = exchangeConfig.defaultSymbolNameField
            this.allowedSymbolSearchFieldIds = exchangeConfig.allowedSymbolSearchFields;
            this.defaultSymbolSearchFieldIds = exchangeConfig.defaultSymbolSearchFields;
            const configAbbreviatedDisplay = exchangeConfig.abbreviatedDisplay;
            if (configAbbreviatedDisplay === undefined) {
                this.abbreviatedDisplay = zenithCode;
            } else {
                this.abbreviatedDisplay = configAbbreviatedDisplay;
            }
            const configFullDisplay = exchangeConfig.fullDisplay;
            if (configFullDisplay === undefined) {
                this.fullDisplay = zenithCode;
            } else {
                this.fullDisplay = configFullDisplay;
            }
            this.displayPriority = exchangeConfig.displayPriority;
        }

        exchangeEnvironment.addExchange(this);
    }

    get destroyed(): boolean { return this._destroyed; }

    get isDefaultDefault(): boolean { return this._isDefaultDefault; }
    get exchangeEnvironmentIsDefault(): boolean { return this._exchangeEnvironmentIsDefault; }
    get symbologyCode(): string { return this._symbologyCode; }
    get dataMarkets(): readonly DataMarket[] { return this._dataMarkets; }
    get tradingMarkets(): readonly TradingMarket[] { return this._tradingMarkets; }
    get defaultLitMarket(): DataMarket | undefined { return this._defaultLitMarket; }
    get defaultTradingMarket(): TradingMarket | undefined { return this._defaultTradingMarket; }

    destroy() {
        this._destroyed = true;
    }

    setIsDefaultDefault(value: boolean) {
        if (value !== this._isDefaultDefault) {
            this._isDefaultDefault = value;
        }
    }

    setIsExchangeEnvironmentDefault(value: boolean) {
        this._exchangeEnvironmentIsDefault = value;
    }

    setSymbologyCode(value: string) {
        this._symbologyCode = value;

        const dataMarkets = this._dataMarkets;
        const dataMarketCount = dataMarkets.length;
        for (let i = 0; i < dataMarketCount; i++) {
            const market = dataMarkets[i];
            market.processExchangeSymbologyCodeSet();
        }

        const tradingMarkets = this._tradingMarkets;
        const tradingMarketCount = tradingMarkets.length;
        for (let i = 0; i < tradingMarketCount; i++) {
            const market = tradingMarkets[i];
            market.processExchangeSymbologyCodeSet();
        }
    }

    setDefaultMarkets(defaultLitMarket: DataMarket | undefined, defaultTradingMarket: TradingMarket | undefined) {
        this._defaultLitMarket = defaultLitMarket;
        this._defaultTradingMarket = defaultTradingMarket;
    }

    beginChange() {
        if (this._beginChangeCount++ === 0) {
            this._changedValueFieldIds.length = 0;
        }
    }

    endChange() {
        if (--this._beginChangeCount === 0) {
            if (this._changedValueFieldIds.length > 0) {
                const changedValueFieldIds = this._changedValueFieldIds;
                this._changedValueFieldIds.length = 0;
                this.notifyFieldValuesChanged(changedValueFieldIds);
            }
        }
    }

    addDataMarket(market: DataMarket) {
        this.beginChange();
        this._dataMarkets.push(market);
        this.addFieldValueChange(Exchange.FieldId.DataMarkets);
        this.endChange();
    }

    addTradingMarket(value: TradingMarket) {
        this.beginChange();
        this._tradingMarkets.push(value);
        this.addFieldValueChange(Exchange.FieldId.TradingMarkets);
        this.endChange();
    }

    getMarkets<T extends Market>(marketTypeId: Market.TypeId): T[] {
        return marketTypeId === Market.TypeId.Data ? this._dataMarkets as unknown as T[] : this._tradingMarkets as unknown as T[];
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    getDefaultMarket<T extends Market>(marketTypeId: Market.TypeId): T | undefined {
        return marketTypeId === Market.TypeId.Data ? this._defaultLitMarket as unknown as (T | undefined) : this._defaultTradingMarket as unknown as (T | undefined);
    }

    subscribeFieldValuesChangedEvent(handler: Exchange.FieldValuesChangedHandler) {
        return this._fieldValuesChangedMultiEvent.subscribe(handler);
    }

    unsubscribeFieldValuesChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._fieldValuesChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyFieldValuesChanged(changedValueFieldIds: readonly Exchange.FieldId[]) {
        const handlers = this._fieldValuesChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler(changedValueFieldIds);
        }
    }

    private addFieldValueChange(fieldId: Exchange.FieldId) {
        if (!this._changedValueFieldIds.includes(fieldId)) {
            this._changedValueFieldIds.push(fieldId);
        }
    }
}

export namespace Exchange {
    export type BecameDefaultEventer = (this: void, exchange: Exchange) => void;
    export type CorrectnessChangedEventHandler = (this: void) => void;
    export type FieldValuesChangedHandler = (this: void, changedValueFieldIds: readonly FieldId[]) => void;

    export type ComparePropertyToStringFtn = (this: void, exchange: Exchange, value: string) => ComparisonResult;

    // Partial interface for ExchangeSettings object.  Allows ExchangeSettings object to be assigned to Exchange
    export interface Settings {
        exchangeZenithCode: string;
        symbolNameFieldId: SymbolFieldId;
        symbolSearchFieldIds: readonly SymbolFieldId[];
    }

    export const enum FieldId {
        ZenithCode,
        UnenvironmentedZenithCode,
        AbbreviatedDisplay,
        FullDisplay,
        DisplayPriority,
        Unknown,

        IsDefaultDefault,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        ExchangeEnvironment,
        ExchangeEnvironmentIsDefault,
        SymbologyCode,
        DefaultLitMarket,
        DefaultTradingMarket,

        AllowedSymbolNameFieldIds,
        DefaultSymbolNameFieldId,
        AllowedSymbolSearchFieldIds,
        DefaultSymbolSearchFieldIds,

        DataMarkets,
        TradingMarkets,
    }

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
                displayId: StringId.ExchangeFieldDisplay_ZenithCode,
                headingId: StringId.ExchangeFieldHeading_ZenithCode,
            },
            UnenvironmentedZenithCode: {
                id: FieldId.UnenvironmentedZenithCode,
                name: 'UnenvironmentedZenithCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_UnenvironmentedZenithCode,
                headingId: StringId.ExchangeFieldHeading_UnenvironmentedZenithCode,
            },
            AbbreviatedDisplay: {
                id: FieldId.AbbreviatedDisplay,
                name: 'AbbreviatedDisplay',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_AbbreviatedDisplay,
                headingId: StringId.ExchangeFieldHeading_AbbreviatedDisplay,
            },
            FullDisplay: {
                id: FieldId.FullDisplay,
                name: 'FullDisplay',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_FullDisplay,
                headingId: StringId.ExchangeFieldHeading_FullDisplay,
            },
            DisplayPriority: {
                id: FieldId.DisplayPriority,
                name: 'DisplayPriority',
                dataTypeId: FieldDataTypeId.Number,
                displayId: StringId.ExchangeFieldDisplay_DisplayPriority,
                headingId: StringId.ExchangeFieldHeading_DisplayPriority,
            },
            Unknown: {
                id: FieldId.Unknown,
                name: 'Unknown',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.ExchangeFieldDisplay_Unknown,
                headingId: StringId.ExchangeFieldHeading_Unknown,
            },
            IsDefaultDefault: {
                id: FieldId.IsDefaultDefault,
                name: 'IsDefaultDefault',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.ExchangeFieldDisplay_IsDefaultDefault,
                headingId: StringId.ExchangeFieldHeading_IsDefaultDefault,
            },
            ExchangeEnvironment: {
                id: FieldId.ExchangeEnvironment,
                name: 'ExchangeEnvironment',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_ExchangeEnvironment,
                headingId: StringId.ExchangeFieldHeading_ExchangeEnvironment,
            },
            ExchangeEnvironmentIsDefault: {
                id: FieldId.ExchangeEnvironmentIsDefault,
                name: 'ExchangeEnvironmentIsDefault',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.ExchangeFieldDisplay_ExchangeEnvironmentIsDefault,
                headingId: StringId.ExchangeFieldDisplay_ExchHeadingironmentIsDefault,
            },
            SymbologyCode: {
                id: FieldId.SymbologyCode,
                name: 'SymbologyCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_SymbologyCode,
                headingId: StringId.ExchangeFiHeadinglay_SymbologyCode,
            },
            DefaultLitMarket: {
                id: FieldId.DefaultLitMarket,
                name: 'DefaultLitMarket',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_DefaultLitMarket,
                headingId: StringId.ExchangeFieldHeading_DefaultLitMarket,
            },
            DefaultTradingMarket: {
                id: FieldId.DefaultTradingMarket,
                name: 'DefaultTradingMarket',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_DefaultTradingMarket,
                headingId: StringId.ExchangeFieldHeading_DefaultTradingMarket,
            },
            AllowedSymbolNameFieldIds: {
                id: FieldId.AllowedSymbolNameFieldIds,
                name: 'AllowedSymbolNameFieldIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.ExchangeFieldDisplay_AllowedSymbolNameFieldIds,
                headingId: StringId.ExchangeFieldHeading_AllowedSymbolNameFieldIds,
            },
            DefaultSymbolNameFieldId: {
                id: FieldId.DefaultSymbolNameFieldId,
                name: 'DefaultSymbolNameFieldId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.ExchangeFieldDisplay_DefaultSymbolNameFieldId,
                headingId: StringId.ExchangeFieldDisplay_HeadingSymbolNameFieldId,
            },
            AllowedSymbolSearchFieldIds: {
                id: FieldId.AllowedSymbolSearchFieldIds,
                name: 'AllowedSymbolSearchFieldIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.ExchangeFieldDisplay_AllowedSymbolSearchFieldIds,
                headingId: StringId.ExchangeFieldDisplay_AllHeadingbolSearchFieldIds,
            },
            DefaultSymbolSearchFieldIds: {
                id: FieldId.DefaultSymbolSearchFieldIds,
                name: 'DefaultSymbolSearchFieldIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.ExchangeFieldDisplay_DefaultSymbolSearchFieldIds,
                headingId: StringId.ExchangeFieldDisplay_DefHeadingbolSearchFieldIds,
            },
            DataMarkets: {
                id: FieldId.DataMarkets,
                name: 'DataMarkets',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_DataMarkets,
                headingId: StringId.ExchangeFieldHeading_DataMarkets,
            },
            TradingMarkets: {
                id: FieldId.TradingMarkets,
                name: 'TradingMarkets',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeFieldDisplay_TradingMarkets,
                headingId: StringId.ExchangeFieldHeading_TradingMarkets,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        (function initialiseField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('ExchangeEnvironment.FieldId', outOfOrderIdx, infos[outOfOrderIdx].name);
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

    export function compareByZenithCode(left: Exchange, right: Exchange) {
        return compareString(left.zenithCode, right.zenithCode);
    }

    export function compareToZenithCode(exchange: Exchange, zenithCode: string) {
        return compareString(exchange.zenithCode, zenithCode);
    }

    export function compareByUnenvironmentedZenithCode(left: Exchange, right: Exchange) {
        return compareString(left.unenvironmentedZenithCode, right.unenvironmentedZenithCode);
    }

    export function compareToUnenvironmentedZenithCode(exchange: Exchange, unenvironmentedZenithCode: string) {
        return compareString(exchange.unenvironmentedZenithCode, unenvironmentedZenithCode);
    }

    export function arrayToAbbreviatedDisplaysCommaText(exchanges: readonly Exchange[]) {
        const count = exchanges.length;
        const abbreviatedDisplays = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const exchange = exchanges[i];
            abbreviatedDisplays[i] = exchange.abbreviatedDisplay;
        }
        return CommaText.fromStringArray(abbreviatedDisplays);
    }

    export function createUnknown(
        exchangeEnvironment: ExchangeEnvironment,
        unenvironmentedExchangeZenithCode: string,
        defaultLitMarket: DataMarket | undefined,
        defaultTradingMarket: TradingMarket | undefined
    ) {
        const allowedSymbolNameFields = [SymbolFieldId.Code];
        const config: MarketsConfig.Exchange = {
            zenithCode: ZenithEnvironmentedValueParts.toStringFromDestructured(unenvironmentedExchangeZenithCode, exchangeEnvironment.zenithCode),
            defaultExchangeEnvironmentZenithCode: exchangeEnvironment.zenithCode,
            symbologyCode: '!',
            allowedSymbolNameFields,
            defaultSymbolNameField: allowedSymbolNameFields[0],
            allowedSymbolSearchFields: [],
            defaultSymbolSearchFields: [],
            abbreviatedDisplay: unknownZenithCode,
            fullDisplay: unknownZenithCode,
            displayPriority: undefined,
            dataMarkets: [],
            tradingMarkets: [],
            defaultLitMarketZenithCode: null,
            defaultTradingMarketZenithCode: null,
        }
        const result = new Exchange(unenvironmentedExchangeZenithCode, exchangeEnvironment, config, true);
        result.setIsDefaultDefault(false);
        result.setIsExchangeEnvironmentDefault(false);
        result.setSymbologyCode('');
        if (defaultLitMarket !== undefined && defaultTradingMarket !== undefined) {
            result.setDefaultMarkets(defaultLitMarket, defaultTradingMarket);
        }
        return result;
    }

    export function compareByDisplayPriorityAndHighest(left: Exchange, right: Exchange, highestPriority: Exchange) {
        if (left === highestPriority) {
            return right === highestPriority ? ComparisonResult.LeftEqualsRight : ComparisonResult.LeftLessThanRight;
        } else {
            if (right === highestPriority) {
                return ComparisonResult.LeftGreaterThanRight;
            } else {
                return compareUndefinableNumber(left.displayPriority, right.displayPriority, true);
            }
        }
    }
}
