import {
    EnumInfoOutOfOrderError,
    Integer,
    MultiEvent
} from '@xilytix/sysutils';
import { StringId, Strings } from '../../res/internal-api';
import {
    FieldDataTypeId
} from "../../sys/internal-api";
import { ExchangeEnvironmentZenithCode } from '../common/internal-api';
// eslint-disable-next-line import/no-cycle
import { Exchange } from './exchange';
// eslint-disable-next-line import/no-cycle
import { DataMarket } from './data-market';
import { MarketsConfig } from './markets-config';
// eslint-disable-next-line import/no-cycle
import { TradingMarket } from './trading-market';
import { ZenithCodedEnvironment } from './zenith-coded-environment';
// eslint-disable-next-line import/no-cycle

export class ExchangeEnvironment implements ZenithCodedEnvironment {
    readonly mapKey: string;
    readonly display: string;
    readonly production: boolean;

    private readonly _exchanges: Exchange[] = [];
    private readonly _dataMarkets: DataMarket[] = [];
    private readonly _tradingMarkets: TradingMarket[] = [];

    private _destroyed = false;

    private _beginChangeCount = 0;
    private _changedValueFieldIds = new Array<ExchangeEnvironment.FieldId>();

    private readonly _fieldValuesChangedMultiEvent = new MultiEvent<ExchangeEnvironment.FieldValuesChangedHandler>();

    constructor(
        readonly zenithCode: ExchangeEnvironmentZenithCode,
        readonly unknown: boolean,
        exchangeEnvironmentConfig: MarketsConfig.ExchangeEnvironment | undefined,
        productionExchangeEnvironmentListZenithCodes: readonly ExchangeEnvironmentZenithCode[],
    ) {
        this.mapKey = ExchangeEnvironmentZenithCode.createMapKey(zenithCode);

        this.production = productionExchangeEnvironmentListZenithCodes.includes(zenithCode);

        if (exchangeEnvironmentConfig === undefined) {
            this.display = ExchangeEnvironmentZenithCode.createDisplay(zenithCode);
        } else {
            const display = exchangeEnvironmentConfig.display;
            if (display === undefined) {
                this.display = ExchangeEnvironmentZenithCode.createDisplay(zenithCode);
            } else {
                this.display = display;
            }
        }
    }

    get destroyed(): boolean { return this._destroyed; }

    get exchangeCount(): number { return this._exchanges.length; }
    get exchanges(): readonly Exchange[] { return this._exchanges; }

    get dataMarketCount(): number { return this._dataMarkets.length; }
    get dataMarkets(): readonly DataMarket[] { return this._dataMarkets; }

    get tradingMarketCount(): number { return this._tradingMarkets.length; }
    get tradingMarkets(): readonly TradingMarket[] { return this._tradingMarkets; }

    destroy() {
        this._destroyed = true;
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

    addExchange(exchange: Exchange) {
        this.beginChange();
        this._exchanges.push(exchange);
        this.addFieldValueChange(ExchangeEnvironment.FieldId.Exchanges);
        this.endChange();
    }

    addDataMarket(market: DataMarket) {
        this.beginChange();
        this._dataMarkets.push(market);
        this.addFieldValueChange(ExchangeEnvironment.FieldId.DataMarkets);
        this.endChange();
    }

    addTradingMarket(market: TradingMarket) {
        this.beginChange();
        this._tradingMarkets.push(market);
        this.addFieldValueChange(ExchangeEnvironment.FieldId.TradingMarkets);
        this.endChange();
    }

    subscribeFieldValuesChangedEvent(handler: ExchangeEnvironment.FieldValuesChangedHandler) {
        return this._fieldValuesChangedMultiEvent.subscribe(handler);
    }

    unsubscribeFieldValuesChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._fieldValuesChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyFieldValuesChanged(changedValueFieldIds: readonly ExchangeEnvironment.FieldId[]) {
        const handlers = this._fieldValuesChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler(changedValueFieldIds);
        }
    }

    private addFieldValueChange(fieldId: ExchangeEnvironment.FieldId) {
        if (!this._changedValueFieldIds.includes(fieldId)) {
            this._changedValueFieldIds.push(fieldId);
        }
    }
}

export namespace ExchangeEnvironment {
    export type CorrectnessChangedEventHandler = (this: void) => void;
    export type FieldValuesChangedHandler = (this: void, changedValueFieldIds: readonly FieldId[]) => void;

    export const enum FieldId {
        ZenithCode,
        Display,
        Production,
        Unknown,
        Exchanges,
        DataMarkets,
        TradingMarkets,
    }

    export namespace Field {
        export type Id = FieldId;

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
                displayId: StringId.ExchangeEnvironmentFieldDisplay_ZenithCode,
                headingId: StringId.ExchangeEnvironmentFieldHeading_ZenithCode,
            },
            Display: {
                id: FieldId.Display,
                name: 'Display',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeEnvironmentFieldDisplay_Display,
                headingId: StringId.ExchangeEnvironmentFieldHeading_Display,
            },
            Production: {
                id: FieldId.Production,
                name: 'Production',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.ExchangeEnvironmentFieldDisplay_Production,
                headingId: StringId.ExchangeEnvironmentFieldHeading_Production,
            },
            Unknown: {
                id: FieldId.Unknown,
                name: 'Unknown',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.ExchangeEnvironmentFieldDisplay_Unknown,
                headingId: StringId.ExchangeEnvironmentFieldHeading_Unknown,
            },
            Exchanges: {
                id: FieldId.Exchanges,
                name: 'Exchanges',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeEnvironmentFieldDisplay_Exchanges,
                headingId: StringId.ExchangeEnvironmentFieldHeading_Exchanges,
            },
            DataMarkets: {
                id: FieldId.DataMarkets,
                name: 'DataMarkets',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeEnvironmentFieldDisplay_DataMarkets,
                headingId: StringId.ExchangeEnvironmentFieldHeading_DataMarkets,
            },
            TradingMarkets: {
                id: FieldId.TradingMarkets,
                name: 'TradingMarkets',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExchangeEnvironmentFieldDisplay_TradingMarkets,
                headingId: StringId.ExchangeEnvironmentFieldHeading_TradingMarkets,
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

    export function createUnknown(zenithCode: ExchangeEnvironmentZenithCode) {
        const result = new ExchangeEnvironment(zenithCode, true, undefined, []);
        return result;
    }

    export function compareByZenithCode(left: ExchangeEnvironment, right: ExchangeEnvironment) {
        return ExchangeEnvironmentZenithCode.compare(left.zenithCode, right.zenithCode);
    }
}
