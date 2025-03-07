import {
    CommaText,
    dateToUtcYyyyMmDd,
    DecimalFactory,
    Guid,
    Integer,
    JsonElement,
    MapKey,
    newUndefinableDate,
    NotImplementedError,
    Ok,
    Result,
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import { AdiPublisherSubscriptionDelayRetryAlgorithmId } from './adi-publisher-subscription-delay-retry-algorithm';
import {
    ChartIntervalId,
    DataChannel,
    DataChannelId,
    FeedClass,
    FeedClassId,
    IvemClass,
    IvemClassId,
    NotificationDistributionMethodId,
    OrderId,
    OrderRequestFlagId,
    ScanTargetTypeId,
    SymbolFieldId,
    ZenithIvemId,
} from "./data-types";
import { OrderDetails } from './order-details';
import { OrderRoute } from './order-route';
import { OrderTrigger } from './order-trigger';
import { ScanAttachedNotificationChannel } from './scan-attached-notification-channel';
import { ExchangeEnvironmentZenithCode, ZenithEncodedScanFormula, ZenithEnvironmentedValueParts, ZenithProtocolCommon, ZenithSymbol } from './zenith-protocol/internal-api';

export abstract class DataDefinition {
    private static _lastConstructedId = 0;

    private _id: Integer;
    private _referencableKey: MapKey | undefined;

    constructor(readonly channelId: DataChannelId) {
        this._id = ++DataDefinition._lastConstructedId;
    }

    get description(): string { return this.getDescription(); }

    get referencableKey() {
        if (this._referencableKey === undefined) {
            this._referencableKey = DataChannel.idToMapKey(this.channelId) + '|' + this.calculateChannelReferencableKey();
        }
        return this._referencableKey;
    }

    abstract get referencable(): boolean;

    /** Create key specific to a channel which can be referenced.
     * By default, creates key unique across all channels but this normally cannot be referenced
     */
    protected calculateChannelReferencableKey() {
        return this._id.toString(10);
    }

    protected getDescription(): string {
        return 'Channel: ' + DataChannel.idToName(this.channelId);
    }
}

export abstract class PublisherSubscriptionDataDefinition extends DataDefinition {
    delayRetryAlgorithmId = AdiPublisherSubscriptionDelayRetryAlgorithmId.Default;
    subscribabilityIncreaseRetryAllowed = true;
    publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.Normal;

    protected assign(other: PublisherSubscriptionDataDefinition) {
        this.delayRetryAlgorithmId = other.delayRetryAlgorithmId;
        this.subscribabilityIncreaseRetryAllowed = other.subscribabilityIncreaseRetryAllowed;
        this.publisherRequestSendPriorityId = other.publisherRequestSendPriorityId;
    }
}

export namespace PublisherSubscriptionDataDefinition {
    export const enum RequestSendPriorityId {
        High,
        Normal,
    }
}

export abstract class MarketSubscriptionDataDefinition extends PublisherSubscriptionDataDefinition {
}

export abstract class FeedSubscriptionDataDefinition extends PublisherSubscriptionDataDefinition {
}

export abstract class BrokerageAccountSubscriptionDataDefinition extends PublisherSubscriptionDataDefinition {
    readonly accountCode: string;
    readonly environmentZenithCode: ExchangeEnvironmentZenithCode;

    constructor(channelId: DataChannelId, readonly accountZenithCode: string) {
        super(channelId);

        const parts = ZenithEnvironmentedValueParts.fromString(accountZenithCode);
        this.accountCode = parts.value;
        this.environmentZenithCode = parts.environmentZenithCode;
    }
    // accountId: BrokerageAccountId;
    // environmentId: TradingEnvironmentId;
}

export abstract class BrokerageAccountRecordsSubscriptionDataDefinition extends BrokerageAccountSubscriptionDataDefinition {
}

export class FeedsDataDefinition extends PublisherSubscriptionDataDefinition {
    override publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    constructor() {
        super(DataChannelId.Feeds);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return ''; // only is one (for now)
    }
}

export class ClassFeedsDataDefinition extends DataDefinition {
    classId: FeedClassId;

    constructor() {
        super(DataChannelId.ClassFeeds);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return FeedClass.idToName(this.classId);
    }
}

export class TradingStatesDataDefinition extends MarketSubscriptionDataDefinition {
    override publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    // marketId: MarketId;
    feedClassId: FeedClassId;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.TradingStates);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription() + ' Query: Market: ' + this.marketZenithCode;
    }
}

export class MarketsDataDefinition extends PublisherSubscriptionDataDefinition {
    override publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    constructor() {
        super(DataChannelId.Markets);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return ''; // only is one (for now)
    }
}

export class QueryMarketsDataDefinition extends PublisherSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.Markets);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription() + ' Query';
    }
}

export class SymbolsDataDefinition extends MarketSubscriptionDataDefinition {
    zenithMarketCode: string;
    classId: IvemClassId;

    constructor() {
        super(DataChannelId.Symbols);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return this.zenithMarketCode + '|' + IvemClass.idToName(this.classId);
    }
}

export class SearchSymbolsDataDefinition extends MarketSubscriptionDataDefinition {
    cfi?: string;
    combinationLeg?: string;
    conditions?: SearchSymbolsDataDefinition.Condition[];
    count?: Integer;
    exchangeZenithCode?: string;
    expiryDateMin?: Date;
    expiryDateMax?: Date;
    index?: boolean;
    ivemClassId?: IvemClassId;
    fullSymbol: boolean;
    marketZenithCodes?: readonly string[];
    preferExact?: boolean;
    startIndex?: Integer;
    strikePriceMin?: Decimal;
    strikePriceMax?: Decimal;

    constructor(private readonly _decimalFactory: DecimalFactory) {
        super(DataChannelId.Symbols);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    createCopy() {
        const result = new SearchSymbolsDataDefinition(this._decimalFactory);
        result.assign(this);
        return result;
    }

    saveToJson(_element: JsonElement) {
        throw new NotImplementedError('SSDDSTJ97918');
    }

    protected override assign(other: SearchSymbolsDataDefinition) {
        super.assign(other);

        this.cfi = other.cfi;
        this.combinationLeg = other.combinationLeg;
        this.conditions = SearchSymbolsDataDefinition.copyConditions(other.conditions);
        this.count = other.count;
        this.exchangeZenithCode = other.exchangeZenithCode;
        this.expiryDateMin = newUndefinableDate(other.expiryDateMin);
        this.expiryDateMax = newUndefinableDate(other.expiryDateMax);
        this.index = other.index;
        this.ivemClassId = other.ivemClassId;
        this.fullSymbol = other.fullSymbol;
        this.marketZenithCodes = other.marketZenithCodes === undefined ? undefined : other.marketZenithCodes.slice();
        this.preferExact = other.preferExact;
        this.startIndex = other.startIndex;
        this.strikePriceMin = this._decimalFactory.newUndefinableDecimal(other.strikePriceMin);
        this.strikePriceMax = this._decimalFactory.newUndefinableDecimal(other.strikePriceMax);
    }
}

export namespace SearchSymbolsDataDefinition {
    export const enum AttributeId {

    }

    export interface Condition {
        fieldIds?: readonly SymbolFieldId[];
        attributeIds?: readonly SearchSymbolsDataDefinition.AttributeId[];
        group?: string;
        isCaseSensitive?: boolean;
        matchIds?: Condition.MatchId[];
        text: string;
    }

    export namespace Condition {
        export const enum MatchId {
            fromStart,
            fromEnd,
            exact,
        }

        export function createCopy(condition: Condition) {
            const copiedCondition: Condition = {
                fieldIds: condition.fieldIds === undefined ? undefined : condition.fieldIds.slice(),
                attributeIds: condition.attributeIds === undefined ? undefined : condition.attributeIds.slice(),
                group: condition.group,
                isCaseSensitive: condition.isCaseSensitive,
                matchIds: condition.matchIds === undefined ? undefined : condition.matchIds.slice(),
                text: condition.text,
            };
            return copiedCondition;
        }
    }

    export function copyConditions(conditions: Condition[] | undefined) {
        if (conditions === undefined) {
            return undefined;
        } else {
            const count = conditions.length;
            const result = new Array<Condition>(count);
            for (let i = 0; i < count; i++) {
                const condition = conditions[i];
                result[i] = Condition.createCopy(condition);
            }
            return result;
        }
    }

    export function tryCreateFromJson(decimalFactory: DecimalFactory, _element: JsonElement): Result<SearchSymbolsDataDefinition> {
        // not yet implemented - just create default
        const definition = new SearchSymbolsDataDefinition(decimalFactory);
        return new Ok(definition);
    }
}

// export class QuerySymbolsDataDefinition extends MarketSubscriptionDataDefinition {
//     // Required:
//     searchText: string;

//     // Optional:
//     exchangeId: ExchangeId | undefined;
//     marketIds: readonly MarketId[] | undefined;
//     fieldIds: readonly SearchSymbolsDataDefinition.FieldId[];
//     isPartial: boolean | undefined;
//     isCaseSensitive: boolean | undefined;
//     preferExact: boolean | undefined;
//     startIndex: Integer | undefined;
//     count: Integer | undefined;
//     targetDate: Date | undefined;
//     showFull: boolean | undefined;
//     accountId: string | undefined;
//     cfi: string | undefined;
//     // TODO add support for underlyingIvemId
//     underlyingIvemId: IvemId | undefined;

//     get referencable() { return false; }

//     constructor() {
//         super(DataChannelId.Symbols);
//     }
// }

// export namespace QuerySymbolsDataDefinition {
//     export const enum FieldId {
//         Code,
//         Name,
//         Short,
//         Long,
//         Ticker,
//         Gics,
//         Isin,
//         Base,
//         Ric,
//     }

//     export const defaultFieldIds = [FieldId.Code];

//     export namespace Field {
//         export type Id = FieldId;

//         interface Info {
//             id: Id;
//             jsonValue: string;
//             displayId: StringId;
//             descriptionId: StringId;
//         }

//         type InfoObject = { [id in keyof typeof FieldId]: Info };

//         const infoObject: InfoObject = {
//             Code: {
//                 id: FieldId.Code,
//                 jsonValue: 'Code',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Code,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Code,
//             },
//             Name: {
//                 id: FieldId.Name,
//                 jsonValue: 'Name',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Name,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Name,
//             },
//             Short: {
//                 id: FieldId.Short,
//                 jsonValue: 'Short',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Short,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Short,
//             },
//             Long: {
//                 id: FieldId.Long,
//                 jsonValue: 'Long',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Long,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Long,
//             },
//             Ticker: {
//                 id: FieldId.Ticker,
//                 jsonValue: 'Ticker',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Ticker,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Ticker,
//             },
//             Gics: {
//                 id: FieldId.Gics,
//                 jsonValue: 'Gics',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Gics,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Gics,
//             },
//             Isin: {
//                 id: FieldId.Isin,
//                 jsonValue: 'Isin',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Isin,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Isin,
//             },
//             Base: {
//                 id: FieldId.Base,
//                 jsonValue: 'Base',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Base,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Base,
//             },
//             Ric: {
//                 id: FieldId.Ric,
//                 jsonValue: 'Ric',
//                 displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Ric,
//                 descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Ric,
//             },
//         } as const;

//         export const idCount = Object.keys(infoObject).length;
//         const infos = Object.values(infoObject);

//         export function idToDisplayId(id: Id) {
//             return infos[id].displayId;
//         }

//         export function idToJsonValue(id: Id) {
//             return infos[id].jsonValue;
//         }

//         export function tryJsonValueToId(jsonValue: string) {
//             for (let id = 0; id < idCount; id++) {
//                 if (infos[id].jsonValue === jsonValue) {
//                     return id;
//                 }
//             }
//             return undefined;
//         }

//         export function idToDisplay(id: Id) {
//             return Strings[idToDisplayId(id)];
//         }

//         export function idToDescriptionId(id: Id) {
//             return infos[id].descriptionId;
//         }

//         export function idToDescription(id: Id) {
//             return Strings[idToDescriptionId(id)];
//         }

//         export function idArrayToJsonValue(idArray: Id[]) {
//             const count = idArray.length;
//             const stringArray = new Array<string>(count);
//             for (let i = 0; i < count; i++) {
//                 const id = idArray[i];
//                 stringArray[i] = idToJsonValue(id);
//             }
//             return CommaText.fromStringArray(stringArray);
//         }

//         export function tryJsonValueToIdArray(value: string) {
//             const toStringArrayResult = CommaText.toStringArrayWithResult(value);
//             if (!toStringArrayResult.success) {
//                 return undefined;
//             } else {
//                 const stringArray = toStringArrayResult.array;
//                 const count = stringArray.length;
//                 const result = new Array<Id>(count);
//                 for (let i = 0; i < count; i++) {
//                     const jsonValue = stringArray[i];
//                     const id = tryJsonValueToId(jsonValue);
//                     if (id === undefined) {
//                         return undefined;
//                     } else {
//                         result[i] = id;
//                     }
//                 }

//                 return result;
//             }
//         }

//         export function initialise() {
//             const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index);
//             if (outOfOrderIdx >= 0) {
//                 throw new EnumInfoOutOfOrderError('QuerySymbolsDataDefinition.FieldId', outOfOrderIdx, idToDisplay(outOfOrderIdx));
//             }
//         }
//     }
// }

export class SecurityDataDefinition extends MarketSubscriptionDataDefinition {
    constructor(readonly code: string, readonly marketZenithCode: string) {
        super(DataChannelId.Security);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription();
    }

    protected override calculateChannelReferencableKey() {
        return ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
    }
}

export class QuerySecurityDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.Security);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription();
    }
}

export class DepthDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.Depth);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription() + ` Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
    }

    protected override calculateChannelReferencableKey() {
        return ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
    }
}

export class QueryDepthDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.Depth);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription() + ` Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
    }
}

export class DepthLevelsDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.DepthLevels);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription() + ` Query: Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
    }

    protected override calculateChannelReferencableKey() {
        return ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
    }
}

export class QueryDepthLevelsDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.DepthLevels);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription() + ` Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
    }
}

export class QueryTradesDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;
    count?: Integer;
    firstTradeId?: Integer;
    lastTradeId?: Integer;
    tradingDate?: Date; // #TestingRequired: I think this needs to be UTC time. But this should be checked.

    constructor() {
        super(DataChannelId.Trades);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        let result = `${super.getDescription()} Query: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
        if (this.count !== undefined) {
            result += ` Count: ${this.count}`;
        }
        if (this.firstTradeId !== undefined) {
            result += ` FirstTradedId: ${this.firstTradeId}`;
        }
        if (this.lastTradeId !== undefined) {
            result += ` LastTradedId: ${this.lastTradeId}`;
        }
        if (this.tradingDate !== undefined) {
            result += ` TradingDate: ${dateToUtcYyyyMmDd(this.tradingDate)}`;
        }
        return result;
    }
}

export class TradesDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.Trades);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return `${super.getDescription()} Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
    }

    protected override calculateChannelReferencableKey() {
        return ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
    }
}

export class LatestTradingDayTradesDataDefinition extends DataDefinition {
    code: string;
    marketZenithCode: string;

    constructor() {
        super(DataChannelId.LatestTradingDayTrades);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription() + ` Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)}`;
    }

    protected override calculateChannelReferencableKey() {
        return ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
    }
}

export class DayTradesDataDefinition extends DataDefinition {
    code: string;
    marketZenithCode: string;

    private _date: Date | undefined;

    constructor() {
        super(DataChannelId.DayTrades);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    get date() { return this._date; }
    set date(value: Date | undefined) {
        if (value === undefined) {
            this._date = undefined;
        } else {
            value.setUTCHours(0, 0, 0, 0);
            this._date = value;
        }
    }

    protected override getDescription(): string {
        const dateDescription = this._date === undefined ? '' : ' ' + dateToUtcYyyyMmDd(this._date);
        return super.getDescription() + ` Symbol: ${ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode)} Date: ${dateDescription}`;
    }

    protected override calculateChannelReferencableKey() {
        const dateStr = this._date === undefined ? '' : dateToUtcYyyyMmDd(this._date);
        return dateStr + '|' + ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
    }
}

export class LowLevelTopShareholdersDataDefinition extends PublisherSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;
    tradingDate: Date | undefined;

    constructor() {
        super(DataChannelId.LowLevelTopShareholders);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription();
    }

    protected override calculateChannelReferencableKey() {
        let key = ZenithSymbol.createMapKeyFromDestructured(this.code, this.marketZenithCode);
        if (this.tradingDate !== undefined) {
            key += '|' + this.tradingDate.toString();
        }
        return key;
    }
}

export class TopShareholdersDataDefinition extends DataDefinition {
    code: string;
    marketZenithCode: string;
    tradingDate: Date | undefined;
    compareToTradingDate: Date | undefined;

    constructor() {
        super(DataChannelId.TopShareholders);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription();
    }

    protected override calculateChannelReferencableKey() {
        let key = ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode);
        if (this.tradingDate !== undefined) {
            key += '|' + this.tradingDate.toString();
        }
        if (this.compareToTradingDate !== undefined) {
            key += '|' + this.compareToTradingDate.toString();
        }
        return key;
    }
}

export class BrokerageAccountsDataDefinition extends FeedSubscriptionDataDefinition {
    override publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    constructor() {
        super(DataChannelId.BrokerageAccounts);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription();
    }

    protected override calculateChannelReferencableKey() {
        return '';
    }
}

export class QueryBrokerageAccountsDataDefinition extends FeedSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.BrokerageAccounts);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription() + ' Query';
    }
}

export abstract class OrdersBrokerageAccountSubscriptionDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
}

export class BrokerageAccountOrdersDataDefinition extends OrdersBrokerageAccountSubscriptionDataDefinition {
    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountOrders, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription() {
        return `${super.getDescription()} Account: ${this.accountZenithCode}`;
    }

    protected override calculateChannelReferencableKey() {
        return this.accountZenithCode;
    }
}

export class QueryBrokerageAccountOrdersDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
    orderId: OrderId | undefined = undefined;

    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountOrders, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription() {
        let result = `${super.getDescription()} Query: Account: ${this.accountZenithCode}`;
        if (this.orderId !== undefined) {
            result += ` OrderId: ${this.orderId}`;
        }
        return result;
    }
}

export class AllOrdersDataDefinition extends DataDefinition {
    constructor() {
        super(DataChannelId.AllOrders);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return '';
    }
}

export abstract class HoldingsBrokerageAccountSubscriptionDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
}

export class BrokerageAccountHoldingsDataDefinition extends HoldingsBrokerageAccountSubscriptionDataDefinition {
    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountHoldings, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription() {
        return `${super.getDescription()} Account: ${this.accountZenithCode}`;
    }

    protected override calculateChannelReferencableKey() {
        return this.accountZenithCode;
    }
}

export class QueryBrokerageAccountHoldingsDataDefinition extends HoldingsBrokerageAccountSubscriptionDataDefinition {
    zenithIvemId: ZenithIvemId | undefined = undefined;

    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountHoldings, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription() {
        let result = `${super.getDescription()} Query: Account: ${this.accountZenithCode}`;
        if (this.zenithIvemId !== undefined) {
            result += ` IvemId: ${ZenithIvemId.toString(this.zenithIvemId)}`;
        }
        return result;
    }
}

export class AllHoldingsDataDefinition extends DataDefinition {
    constructor() {
        super(DataChannelId.AllHoldings);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return '';
    }
}

export abstract class BalancesBrokerageAccountSubscriptionDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
}

export class BrokerageAccountBalancesDataDefinition extends BalancesBrokerageAccountSubscriptionDataDefinition {
    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountBalances, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return `${super.getDescription()} Account: ${this.accountZenithCode}`;
    }

    protected override calculateChannelReferencableKey() {
        return this.accountZenithCode;
    }
}

export class QueryBrokerageAccountBalancesDataDefinition extends BalancesBrokerageAccountSubscriptionDataDefinition {
    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountBalances, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription() {
        return `${super.getDescription()} Query: Account: ${this.accountZenithCode}`;
    }
}

export class AllBalancesDataDefinition extends DataDefinition {
    constructor() {
        super(DataChannelId.AllBalances);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return '';
    }
}

export abstract class TransactionsBrokerageAccountSubscriptionDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
}

export class BrokerageAccountTransactionsDataDefinition extends TransactionsBrokerageAccountSubscriptionDataDefinition {
    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountTransactions, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return `${super.getDescription()} Account: ${this.accountZenithCode}`;
    }

    protected override calculateChannelReferencableKey() {
        return this.accountZenithCode;
    }
}

export class QueryTransactionsDataDefinition extends TransactionsBrokerageAccountSubscriptionDataDefinition {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    count: Integer | undefined;
    zenithTradingMarketCode: string | undefined;
    zenithExchangeCode: string | undefined;
    code: string | undefined;
    orderId: OrderId | undefined;

    constructor(accountZenithCode: string) {
        super(DataChannelId.BrokerageAccountTransactions, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription() {
        let result = `${super.getDescription()} Query: Account: ${this.accountZenithCode}`;
        if (this.fromDate !== undefined) {
            result += ` FromDate: ${this.fromDate.toLocaleDateString()}`;
        }
        if (this.toDate !== undefined) {
            result += ` ToDate: ${this.toDate.toLocaleDateString()}`;
        }
        if (this.count !== undefined) {
            result += ` Count: ${this.count}`;
        }
        if (this.zenithTradingMarketCode !== undefined) {
            result += ` TradingMarket: ${this.zenithTradingMarketCode}`;
        }
        if (this.zenithExchangeCode !== undefined) {
            result += ` Exchange: ${this.zenithExchangeCode}`;
        }
        if (this.code !== undefined) {
            result += ` Code: ${this.code}`;
        }
        if (this.orderId !== undefined) {
            result += ` Order: ${this.orderId}`;
        }
        return result;
    }
}

export class AllTransactionsDataDefinition extends DataDefinition {
    constructor() {
        super(DataChannelId.AllTransactions);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override calculateChannelReferencableKey() {
        return '';
    }
}

export class OrderRequestsDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
    // brokerageAccountGroup: BrokerageAccountGroup;

    constructor(accountZenithCode: string) {
        super(DataChannelId.OrderRequests, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    // protected getDescription(): string {
    //     return `${super.getDescription()} GroupId: ${this.brokerageAccountGroup.id}`;
    // }

    // protected calculateChannelReferencableKey() {
    //     return this.brokerageAccountGroup.id;
    // }
}

export class QueryOrderRequestsDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
    orderId: OrderId | undefined;

    constructor(accountZenithCode: string) {
        super(DataChannelId.OrderRequests, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription() {
        let result = `${super.getDescription()} Query: Account: ${this.accountZenithCode}`;
        if (this.orderId !== undefined) {
            result += ` Order: ${this.orderId}`;
        }
        return result;
    }
}

export class OrderAuditDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
    // brokerageAccountGroup: BrokerageAccountGroup;

    constructor(accountZenithCode: string) {
        super(DataChannelId.OrderAudit, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    // protected getDescription(): string {
    //     return `${super.getDescription()} GroupId: ${this.brokerageAccountGroup.id}`;
    // }

    // protected calculateChannelReferencableKey() {
    //     return this.brokerageAccountGroup.id;
    // }
}

export class QueryOrderAuditDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    count: Integer | undefined;
    orderId: OrderId | undefined;

    constructor(accountZenithCode: string) {
        super(DataChannelId.OrderAudit, accountZenithCode);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription() {
        let result = `${super.getDescription()} Query: Account: ${this.accountZenithCode}`;
        if (this.fromDate !== undefined) {
            result += ` FromDate: ${this.fromDate.toLocaleDateString()}`;
        }
        if (this.toDate !== undefined) {
            result += ` ToDate: ${this.toDate.toLocaleDateString()}`;
        }
        if (this.count !== undefined) {
            result += ` Count: ${this.count}`;
        }
        if (this.orderId !== undefined) {
            result += ` Order: ${this.orderId}`;
        }
        return result;
    }
}

export class OrderStatusesDataDefinition extends FeedSubscriptionDataDefinition {
    override publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    // tradingFeedId: FeedId;
    tradingFeedZenithCode: string;

    constructor() {
        super(DataChannelId.OrderStatuses);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return `${super.getDescription()} FeedName: ${this.tradingFeedZenithCode}`;
    }
}

export class QueryTradingMarketsDataDefinition extends FeedSubscriptionDataDefinition {
    override publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    tradingFeedZenithCode: string;

    constructor() {
        super(DataChannelId.TradingMarkets);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }
}

export class QueryChartHistoryDataDefinition extends MarketSubscriptionDataDefinition {
    code: string;
    marketZenithCode: string;
    intervalId: ChartIntervalId;
    count: Integer | undefined;
    fromDate: Date | undefined;
    toDate: Date | undefined;

    constructor() {
        super(DataChannelId.ChartHistory);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    protected override getDescription(): string {
        return super.getDescription();
    }

    // not needed as not referencable
    protected override calculateChannelReferencableKey() {
        let key = ZenithSymbol.createDisplayFromDestructured(this.code, this.marketZenithCode) + '|' + this.intervalId.toString(10);
        if (this.fromDate !== undefined) {
            key += '|' + this.fromDate.toString();
        }
        if (this.toDate !== undefined) {
            key += '|' + this.toDate.toString();
        }
        return key;
    }
}

export abstract class OrderRequestDataDefinition extends BrokerageAccountRecordsSubscriptionDataDefinition {
    // Do not allow any retries
    override readonly delayRetryAlgorithmId = AdiPublisherSubscriptionDelayRetryAlgorithmId.Never;
    override readonly subscribabilityIncreaseRetryAllowed = false;

    // Ensure sent as quickly as possible
    override readonly publisherRequestSendPriorityId = PublisherSubscriptionDataDefinition.RequestSendPriorityId.High;

    flags: readonly OrderRequestFlagId[] | undefined;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }

    // can only reference via DataDefinition Id so do not need to re-implement calculateChannelReferencableKey()
}

export namespace OrderRequestDataDefinition {
    export function isPlace(definition: OrderRequestDataDefinition): definition is PlaceOrderRequestDataDefinition {
        return definition.channelId === DataChannelId.PlaceOrderRequest;
    }

    export function isAmend(definition: OrderRequestDataDefinition): definition is PlaceOrderRequestDataDefinition {
        return definition.channelId === DataChannelId.AmendOrderRequest;
    }

    export function isMove(definition: OrderRequestDataDefinition): definition is PlaceOrderRequestDataDefinition {
        return definition.channelId === DataChannelId.MoveOrderRequest;
    }

    export function isCancel(definition: OrderRequestDataDefinition): definition is PlaceOrderRequestDataDefinition {
        return definition.channelId === DataChannelId.CancelOrderRequest;
    }
}

export class PlaceOrderRequestDataDefinition extends OrderRequestDataDefinition {
    details: OrderDetails;
    route: OrderRoute;
    trigger?: OrderTrigger;

    constructor(accountZenithCode: string) {
        super(DataChannelId.PlaceOrderRequest, accountZenithCode);
    }
}

export class AmendOrderRequestDataDefinition extends OrderRequestDataDefinition {
    details: OrderDetails;
    orderId: OrderId;
    route: OrderRoute | undefined;
    trigger: OrderTrigger | undefined;

    constructor(accountZenithCode: string) {
        super(DataChannelId.AmendOrderRequest, accountZenithCode);
    }
}

export class CancelOrderRequestDataDefinition extends OrderRequestDataDefinition {
    orderId: OrderId;

    constructor(accountZenithCode: string) {
        super(DataChannelId.CancelOrderRequest, accountZenithCode);
    }
}


export class MoveOrderRequestDataDefinition extends OrderRequestDataDefinition {
    orderId: OrderId;
    // destination: BrokerageAccountId;
    destinationAccountZenithCode: string;

    constructor(accountZenithCode: string) {
        super(DataChannelId.MoveOrderRequest, accountZenithCode);
    }
}

export namespace ScanDataDefinition {
    export type Targets = readonly string[] | readonly ZenithSymbol[];
}

export class CreateScanDataDefinition extends FeedSubscriptionDataDefinition {
    enabled: boolean;
    scanName: string;
    scanDescription?: string;
    versionNumber: Integer;
    versionId: Guid;
    versioningInterrupted: boolean;
    lastSavedTime: Date;
    lastEditSessionId: Guid;
    zenithCriteriaSource: string | undefined;
    zenithRankSource: string | undefined;
    symbolListEnabled: boolean;
    targetTypeId: ScanTargetTypeId;
    targets: ScanDataDefinition.Targets;
    maxMatchCount: Integer;
    zenithCriteria: ZenithEncodedScanFormula.BooleanTupleNode;
    zenithRank: ZenithEncodedScanFormula.NumericTupleNode | undefined;
    attachedNotificationChannels: readonly ScanAttachedNotificationChannel[];

    constructor() {
        super(DataChannelId.CreateScan);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }
}

export class QueryScanDetailDataDefinition extends FeedSubscriptionDataDefinition {
    scanId: string;

    constructor() {
        super(DataChannelId.QueryScanDetail);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class DeleteScanDataDefinition extends FeedSubscriptionDataDefinition {
    scanId: string;

    constructor() {
        super(DataChannelId.DeleteScan);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class UpdateScanDataDefinition extends FeedSubscriptionDataDefinition {
    scanId: string;
    enabled: boolean;
    scanName: string;
    scanDescription?: string;
    versionNumber: Integer;
    versionId: Guid;
    versioningInterrupted: boolean;
    lastSavedTime: Date;
    lastEditSessionId: Guid;
    symbolListEnabled: boolean;
    zenithCriteriaSource: string | undefined;
    zenithRankSource: string | undefined;
    zenithCriteria: ZenithEncodedScanFormula.BooleanTupleNode;
    zenithRank: ZenithEncodedScanFormula.NumericTupleNode | undefined;
    targetTypeId: ScanTargetTypeId;
    targets: ScanDataDefinition.Targets;
    maxMatchCount: Integer;
    attachedNotificationChannels: readonly ScanAttachedNotificationChannel[];

    constructor() {
        super(DataChannelId.UpdateScan);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export abstract class ExecuteScanDataDefinition extends FeedSubscriptionDataDefinition {
    zenithCriteria: ZenithEncodedScanFormula.BooleanTupleNode;
    zenithRank: ZenithEncodedScanFormula.NumericTupleNode | undefined;
    targetTypeId: ScanTargetTypeId;
    targets: ScanDataDefinition.Targets;
    maxMatchCount: Integer;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class DataIvemIdExecuteScanDataDefinition extends ExecuteScanDataDefinition {
    constructor() {
        super(DataChannelId.DataIvemIdMatches);
    }
}

export class ScanDescriptorsDataDefinition extends FeedSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.ScanDescriptors);
    }
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return true; }
}

export class QueryScanDescriptorsDataDefinition extends FeedSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.ScanDescriptors);
    }
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export abstract class MatchesDataDefinition extends FeedSubscriptionDataDefinition {
    scanId: string;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return true; }
}

export class DataIvemIdMatchesDataDefinition extends MatchesDataDefinition {
    constructor() {
        super(DataChannelId.DataIvemIdMatches);
    }
}

export abstract class QueryMatchesDataDefinition extends FeedSubscriptionDataDefinition {
    scanId: string;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class DataIvemIdQueryMatchesDataDefinition extends QueryMatchesDataDefinition {
    constructor() {
        super(DataChannelId.DataIvemIdMatches);
    }
}

// export class CreateScanDataDefinition extends FeedSubscriptionDataDefinition {
//     name: string;
//     scanDescription?: string;
//     criteria: BooleanScanCriteriaNode;
//     targetTypeId: ScanTargetTypeId;
//     targetMarketIds: readonly MarketId[] | undefined;
//     targetDataIvemIds: readonly DataIvemId[] | undefined;
//     notifications: readonly ScanNotification[] | undefined;

//     get referencable() { return false; }

//     constructor() {
//         super(DataChannelId.CreateScan);
//     }
// }

// export class QueryScanDataDefinition extends FeedSubscriptionDataDefinition {
//     id: string;

//     get referencable(): boolean { return false; }

//     constructor() {
//         super(DataChannelId.QueryScan);
//     }
// }

// export class DeleteScanDataDefinition extends FeedSubscriptionDataDefinition {
//     id: string;

//     get referencable(): boolean { return false; }

//     constructor() {
//         super(DataChannelId.DeleteScan);
//     }
// }

// export class UpdateScanDataDefinition extends FeedSubscriptionDataDefinition {
//     id: string;
//     name: string;
//     scanDescription?: string;
//     criteria: BooleanScanCriteriaNode;
//     targetTypeId: ScanTargetTypeId;
//     targetMarketIds: readonly MarketId[] | undefined;
//     targetDataIvemIds: readonly DataIvemId[] | undefined;
//     notifications: readonly ScanNotification[] | undefined;

//     get referencable(): boolean { return false; }

//     constructor() {
//         super(DataChannelId.UpdateScan);
//     }
// }

// export class ExecuteScanDataDefinition extends FeedSubscriptionDataDefinition {
//     criteria: BooleanScanCriteriaNode;
//     targetTypeId: ScanTargetTypeId;
//     targetMarketIds: readonly MarketId[] | undefined;
//     targetDataIvemIds: readonly DataIvemId[] | undefined;

//     get referencable(): boolean { return false; }

//     constructor() {
//         super(DataChannelId.ExecuteScan);
//     }
// }

// export class ScansDataDefinition extends FeedSubscriptionDataDefinition {
//     get referencable(): boolean { return true; }

//     constructor() {
//         super(DataChannelId.Scans);
//     }
// }

// export class QueryScansDataDefinition extends FeedSubscriptionDataDefinition {
//     get referencable(): boolean { return false; }

//     constructor() {
//         super(DataChannelId.Scans);
//     }
// }

// export class MatchesDataDefinition extends FeedSubscriptionDataDefinition {
//     scanId: string;

//     get referencable(): boolean { return true; }

//     constructor() {
//         super(DataChannelId.DataIvemIdMatches);
//     }
// }

// export class QueryMatchesDataDefinition extends FeedSubscriptionDataDefinition {
//     scanId: string;

//     get referencable(): boolean { return false; }

//     constructor() {
//         super(DataChannelId.DataIvemIdMatches);
//     }
// }

export class CreateNotificationChannelDataDefinition extends FeedSubscriptionDataDefinition {
    enabled: boolean;
    notificationChannelName: string;
    notificationChannelDescription?: string;
    userMetadata?: ZenithProtocolCommon.UserMetadata;
    favourite?: boolean;
    distributionMethodId: NotificationDistributionMethodId;
    settings?: ZenithProtocolCommon.NotificationChannelSettings;

    constructor() {
        super(DataChannelId.CreateNotificationChannel);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return false; }
}


export class DeleteNotificationChannelDataDefinition extends FeedSubscriptionDataDefinition {
    notificationChannelId: string;

    constructor() {
        super(DataChannelId.DeleteNotificationChannel);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class UpdateNotificationChannelDataDefinition extends FeedSubscriptionDataDefinition {
    notificationChannelId: string;
    enabled: boolean;
    notificationChannelName: string;
    notificationChannelDescription?: string;
    userMetadata?: ZenithProtocolCommon.UserMetadata;
    favourite?: boolean;
    distributionMethodId: NotificationDistributionMethodId;
    settings: ZenithProtocolCommon.NotificationChannelSettings;

    constructor() {
        super(DataChannelId.UpdateNotificationChannel);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class UpdateNotificationChannelEnabledDataDefinition extends FeedSubscriptionDataDefinition {
    notificationChannelId: string;
    enabled: boolean;

    constructor() {
        super(DataChannelId.UpdateNotificationChannelEnabled);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class QueryNotificationChannelDataDefinition extends FeedSubscriptionDataDefinition {
    notificationChannelId: string;

    constructor() {
        super(DataChannelId.QueryNotificationChannel);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class QueryNotificationChannelsDataDefinition extends FeedSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.QueryNotificationChannels);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class QueryNotificationDistributionMethodDataDefinition extends FeedSubscriptionDataDefinition {
    distributionMethodId: NotificationDistributionMethodId;

    constructor() {
        super(DataChannelId.QueryNotificationDistributionMethod);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class QueryNotificationDistributionMethodsDataDefinition extends FeedSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.QueryNotificationDistributionMethods);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export abstract class WatchmakerDataDefinition extends FeedSubscriptionDataDefinition {
}

export abstract class CreateWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    name: string;
    listDescription?: string;
    category?: string;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class DataIvemIdCreateWatchmakerListDataDefinition extends CreateWatchmakerListDataDefinition {
    members: readonly ZenithSymbol[];

    constructor() {
        super(DataChannelId.DataIvemIdCreateWatchmakerList);
    }
}

export class UpdateWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    listId: string;
    name: string;
    listDescription?: string;
    category?: string;

    constructor() {
        super(DataChannelId.UpdateWatchmakerList);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class CopyWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    listId: string;
    name: string;
    listDescription?: string;
    category?: string;

    constructor() {
        super(DataChannelId.CopyWatchmakerList);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class DeleteWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    listId: string;

    constructor() {
        super(DataChannelId.DeleteWatchmakerList);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class WatchmakerListDescriptorsDataDefinition extends WatchmakerDataDefinition {
    constructor() {
        super(DataChannelId.WatchmakerListDescriptors);
    }
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return true; }
}

export class QueryWatchmakerListDescriptorsDataDefinition extends WatchmakerDataDefinition {
    listId?: string; // if undefined, then get all

    constructor() {
        super(DataChannelId.WatchmakerListDescriptors);
    }
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export abstract class WatchmakerListMembersDataDefinition extends WatchmakerDataDefinition {
    listId: string;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return true; }
}

export class DataIvemIdWatchmakerListMembersDataDefinition extends WatchmakerListMembersDataDefinition {
    constructor() {
        super(DataChannelId.DataIvemIdWatchmakerListMembers);
    }
}

export abstract class QueryWatchmakerListMembersDataDefinition extends WatchmakerDataDefinition {
    listId: string;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable(): boolean { return false; }
}

export class DataIvemIdQueryWatchmakerListMembersDataDefinition extends QueryWatchmakerListMembersDataDefinition {
    constructor() {
        super(DataChannelId.DataIvemIdWatchmakerListMembers);
    }
}

export abstract class AddToWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    listId: string;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class DataIvemIdAddToWatchmakerListDataDefinition extends AddToWatchmakerListDataDefinition {
    members: readonly ZenithSymbol[];

    constructor() {
        super(DataChannelId.DataIvemIdAddToWatchmakerList);
    }
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export abstract class InsertIntoWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    listId: string;
    offset: Integer;

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class DataIvemIdInsertIntoWatchmakerListDataDefinition extends InsertIntoWatchmakerListDataDefinition {
    members: readonly ZenithSymbol[];

    constructor() {
        super(DataChannelId.DataIvemIdInsertIntoWatchmakerList);
    }
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class MoveInWatchmakerListDataDefinition extends WatchmakerDataDefinition {
    listId: string;
    offset: Integer;
    count: Integer;
    target: Integer;

    constructor() {
        super(DataChannelId.MoveInWatchmakerList);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    override get referencable(): boolean { return false; }
}

export class ZenithExtConnectionDataDefinition extends DataDefinition {
    initialAuthAccessToken: string;

    private _zenithWebsocketEndpoints: readonly string[];
    private _zenithWebsocketEndpointCommaText: string;

    constructor() {
        super(DataChannelId.ZenithExtConnection);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    get zenithWebsocketEndpoints(): readonly string[] { return this._zenithWebsocketEndpoints; }
    set zenithWebsocketEndpoints(value: readonly string[]) {
        this._zenithWebsocketEndpoints = value;
        this._zenithWebsocketEndpointCommaText = CommaText.fromStringArray(value);
    }

    protected override calculateChannelReferencableKey() {
        return this._zenithWebsocketEndpointCommaText;
    }
}

export class ZenithServerInfoDataDefinition extends PublisherSubscriptionDataDefinition {
    constructor() {
        super(DataChannelId.ZenithServerInfo);
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    get referencable() { return true; }

    protected override getDescription(): string {
        return super.getDescription();
    }

    protected override calculateChannelReferencableKey() {
        return '';
    }
}
