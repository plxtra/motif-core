import {
    CommaText,
    EnumInfoOutOfOrderError,
    Integer
} from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/i18n-strings';
import {
    FieldDataTypeId,
} from "../../sys";
import {
    MarketOrderRoute,
    OrderRouteAlgorithmId,
    OrderTradeTypeId,
    OrderTriggerTypeId,
    OrderTypeId,
    TimeInForceId
} from '../common/internal-api';
import { TradingFeed } from '../feed/internal-api';
// eslint-disable-next-line import-x/no-cycle
import { DataMarket } from './data-market';
// eslint-disable-next-line import-x/no-cycle
import { Exchange } from './exchange';
// eslint-disable-next-line import-x/no-cycle
import { ExchangeEnvironment } from './exchange-environment';
import { Market } from './market';
import { MarketsConfig } from './markets-config';

export class TradingMarket extends Market /* implements KeyedCorrectnessListItem */ {
    readonly orderRouteAlgorithmId = OrderRouteAlgorithmId.Market; // Currently only algorithm supported

    readonly allowedOrderTypeIds: readonly OrderTypeId[]; // EquityOrderType[],
    readonly defaultOrderTypeId: OrderTypeId; // EquityOrderType, // Recommended order type to be initially shown in an order pad
    readonly allowedOrderTimeInForceIds: readonly TimeInForceId[]; // EquityOrderValidity[],
    readonly defaultOrderTimeInForceId: TimeInForceId; // EquityOrderValidity, // Recommended order validity to be initially shown in an order pad
    readonly marketOrderTypeAllowedTimeInForceIds: readonly TimeInForceId[]; // EquityOrderValidity[], // Order validities for Market Order Type.  If undefined, use AllowedOrderValidities
    readonly allowedOrderTriggerTypeIds: readonly OrderTriggerTypeId[]; // OrderCondition.Name[], // If missing, then no conditional orders (immediate only)
    readonly allowedOrderTradeTypeIds: readonly OrderTradeTypeId[]; // OrderTradeType[],

    private _symbologicalCorrespondingDataMarket: DataMarket | undefined;

    constructor(
        zenithCode: string,
        name: string,
        display: string,
        exchange: Exchange,
        exchangeEnvironment: ExchangeEnvironment,
        lit: boolean,
        displayPriority: number | undefined,
        unknown: boolean,
        readonly feed: TradingFeed,
        readonly attributes: Record<string, string> | undefined,
        readonly bestLitDataMarket: DataMarket | undefined,
        marketConfig: MarketsConfig.Exchange.TradingMarket | undefined,
    ) {
        super(Market.TypeId.Trading, zenithCode, name, display, exchange, exchangeEnvironment, lit, displayPriority, unknown);

        if (marketConfig === undefined) {
            this.allowedOrderTypeIds = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTypeIds;
            this.defaultOrderTypeId = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTypeIds[0];
            this.allowedOrderTimeInForceIds = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTimeInForceIds;
            this.defaultOrderTimeInForceId = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTimeInForceIds[0];
            this.marketOrderTypeAllowedTimeInForceIds = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTimeInForceIds;
            this.allowedOrderTriggerTypeIds = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTriggerTypeIds;
            this.allowedOrderTradeTypeIds = MarketsConfig.Exchange.TradingMarket.defaultAllowedOrderTradeTypeIds;
        } else {
            this.allowedOrderTypeIds = marketConfig.allowedOrderTypes;
            this.defaultOrderTypeId = marketConfig.defaultOrderType;
            this.allowedOrderTimeInForceIds = marketConfig.allowedOrderTimeInForces;
            this.defaultOrderTimeInForceId = marketConfig.defaultOrderTimeInForce;
            this.marketOrderTypeAllowedTimeInForceIds = marketConfig.marketOrderTypeAllowedOrderTimeInForces;
            this.allowedOrderTriggerTypeIds = marketConfig.allowedOrderTriggerTypes;
            this.allowedOrderTradeTypeIds = marketConfig.allowedOrderTradeTypes;
        }

        exchangeEnvironment.addTradingMarket(this);
        exchange.addTradingMarket(this);
    }

    get symbologicalCorrespondingDataMarket(): DataMarket | undefined { return this._symbologicalCorrespondingDataMarket; }

    setSymbologicalCorrespondingDataMarket(dataMarket: DataMarket) {
        this._symbologicalCorrespondingDataMarket = dataMarket;
    }

    isOrderTypeAllowed(orderTypeId: OrderTypeId): boolean {
        return this.allowedOrderTypeIds.includes(orderTypeId);
    }

    isOrderTradeTypeAllowed(orderTradeTypeId: OrderTradeTypeId) {
        return this.allowedOrderTradeTypeIds.includes(orderTradeTypeId);
    }

    getAllowedTimeInForcesForOrderType(orderTypeId: OrderTypeId): readonly TimeInForceId[] {
        if (orderTypeId === OrderTypeId.Market) {
            return this.marketOrderTypeAllowedTimeInForceIds;
        } else {
            return this.allowedOrderTimeInForceIds;
        }
    }

    createOrderRoute(): MarketOrderRoute {
        const route: MarketOrderRoute = {
            algorithmId: OrderRouteAlgorithmId.Market,
            marketZenithCode: this.zenithCode,
        };
        return route;
    }
}

export namespace TradingMarket {
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
        HasSymbologicalCorrespondingDataMarket,
        Feed,
        Attributes,
        BestLitDataMarket,
        AllowedOrderTypeIds,
        DefaultOrderTypeId,
        AllowedOrderTimeInForceIds,
        DefaultOrderTimeInForceId,
        MarketOrderTypeAllowedTimeInForceIds,
        AllowedOrderTriggerTypeIds,
        AllowedOrderTradeTypeIds,
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
                name: 'ExchangeEnvironmentDisplay',
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
            HasSymbologicalCorrespondingDataMarket: {
                id: FieldId.HasSymbologicalCorrespondingDataMarket,
                name: 'HasSymbologicalCorrespondingDataMarket',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.TradingMarketFieldDisplay_HasSymbologicalCorrespondingDataMarket,
                headingId: StringId.TradingMarketFieldHeading_HasSymbologicalCorrespondingDataMarket,
            },
            Feed: {
                id: FieldId.Feed,
                name: 'Feed',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.TradingMarketFieldDisplay_Feed,
                headingId: StringId.TradingMarketFieldHeading_Feed,
            },
            Attributes: {
                id: FieldId.Attributes,
                name: 'Attributes',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.TradingMarketFieldDisplay_Attributes,
                headingId: StringId.TradingMarketFieldHeading_Attributes,
            },
            BestLitDataMarket: {
                id: FieldId.BestLitDataMarket,
                name: 'BestLitDataMarket',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.TradingMarketFieldDisplay_BestLitDataMarket,
                headingId: StringId.TradingMarketFieldHeading_BestLitDataMarket,
            },
            AllowedOrderTypeIds: {
                id: FieldId.AllowedOrderTypeIds,
                name: 'AllowedOrderTypeIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.TradingMarketFieldDisplay_AllowedOrderTypeIds,
                headingId: StringId.TradingMarketFieldHeading_AllowedOrderTypeIds,
            },
            DefaultOrderTypeId: {
                id: FieldId.DefaultOrderTypeId,
                name: 'DefaultOrderTypeId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.TradingMarketFieldDisplay_DefaultOrderTypeId,
                headingId: StringId.TradingMarketFieldHeading_DefaultOrderTypeId,
            },
            AllowedOrderTimeInForceIds: {
                id: FieldId.AllowedOrderTimeInForceIds,
                name: 'AllowedOrderTimeInForceIds',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.TradingMarketFieldDisplay_AllowedOrderTimeInForceIds,
                headingId: StringId.TradingMarketFieldHeading_AllowedOrderTimeInForceIds,
            },
            DefaultOrderTimeInForceId: {
                id: FieldId.DefaultOrderTimeInForceId,
                name: 'DefaultOrderTimeInForceId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.TradingMarketFieldDisplay_DefaultOrderTimeInForceId,
                headingId: StringId.TradingMarketFieldHeading_DefaultOrderTimeInForceId,
            },
            MarketOrderTypeAllowedTimeInForceIds: {
                id: FieldId.MarketOrderTypeAllowedTimeInForceIds,
                name: 'MarketOrderTypeAllowedTimeInForceIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.TradingMarketFieldDisplay_MarketOrderTypeAllowedTimeInForceIds,
                headingId: StringId.TradingMarketFieldHeading_MarketOrderTypeAllowedTimeInForceIds,
            },
            AllowedOrderTriggerTypeIds: {
                id: FieldId.AllowedOrderTriggerTypeIds,
                name: 'AllowedOrderTriggerTypeIds',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.TradingMarketFieldDisplay_AllowedOrderTriggerTypeIds,
                headingId: StringId.TradingMarketFieldHeading_AllowedOrderTriggerTypeIds,
            },
            AllowedOrderTradeTypeIds: {
                id: FieldId.AllowedOrderTradeTypeIds,
                name: 'AllowedOrderTradeTypeIds',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.TradingMarketFieldDisplay_AllowedOrderTradeTypeIds,
                headingId: StringId.TradingMarketFieldHeading_AllowedOrderTradeTypeIds,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        (function initialiseField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('TradingMarket.FieldId', outOfOrderIdx, infos[outOfOrderIdx].name);
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

    export function attributesToCommaText(attributes: Record<string, string>): string {
        const attributeDisplays = new Array<string>(0);
        for (const key in attributes) {
            const attributeDisplay = `${key}=${attributes[key]}`;
            attributeDisplays.push(attributeDisplay);
        }
        return CommaText.fromStringArray(attributeDisplays);
    }

    export function createUnknown(exchangeEnvironment: ExchangeEnvironment, exchange: Exchange, zenithCode: string): TradingMarket {
        const result = new TradingMarket(
            zenithCode,
            zenithCode,
            zenithCode,
            exchange,
            exchangeEnvironment,
            false,
            undefined,
            true,
            TradingFeed.nullFeed,
            undefined,
            undefined,
            undefined,
        );
        result.setExchangeEnvironmentIsDefault(false);
        result.setSymbologyExchangeSuffixCode('!');
        result.setSymbologySupportedExchanges([]);

        return result;
    }
}
