import { MultiEvent, isArrayEqualUniquely, isUndefinableArrayEqualUniquely } from '@xilytix/sysutils';
import {
    DataIvemAlternateCodes,
    IvemClassId,
    PublisherSubscriptionDataTypeId,
    SymbolsDataMessage
} from './common/internal-api';
import { DataIvemBaseDetail } from './data-ivem-base-detail';
import { DataMarket, Exchange, ExchangeEnvironment, MarketsService, TradingMarket } from './markets/internal-api';
import { DataIvemId, MarketIvemId } from './symbol-id/internal-api';

export class SearchSymbolsDataIvemBaseDetail implements DataIvemBaseDetail {
    readonly dataIvemId: DataIvemId;

    private _ivemClassId: IvemClassId;
    private _subscriptionDataTypeIds: readonly PublisherSubscriptionDataTypeId[];
    private _tradingMarketZenithCodes: readonly string[];
    private _tradingMarkets: readonly TradingMarket[];
    private _name: string;
    private _exchange: Exchange;

    private _baseChangeEvent = new MultiEvent<DataIvemBaseDetail.ChangeEventHandler>();

    constructor(private readonly _marketsService: MarketsService, change: SymbolsDataMessage.AddUpdateChange, readonly full = false) {
        const dataIvemId = MarketIvemId.createFromZenithSymbol(this._marketsService.dataMarkets, change.symbol, DataIvemId);
        let name: string;
        if (change.name !== undefined) {
            name = change.name;
        } else {
            // generate a name - need to improve this to better support TMCs and ETOs
            name = dataIvemId.code;
        }

        this.dataIvemId = dataIvemId;
        this._ivemClassId = change.ivemClassId;
        this._subscriptionDataTypeIds = change.subscriptionDataTypeIds;
        this._tradingMarketZenithCodes = change.tradingMarketZenithCodes;
        this._tradingMarkets = this._marketsService.getTradingMarkets(change.tradingMarketZenithCodes, false);
        this._name = name;
        this._exchange = this._marketsService.getExchangeOrUnknown(change.exchangeZenithCode);
    }

    get key() { return this.dataIvemId; }
    get code(): string { return this.dataIvemId.code; }
    get market(): DataMarket { return this.dataIvemId.market; }
    get exchangeEnvironment(): ExchangeEnvironment { return this.dataIvemId.market.exchangeEnvironment; }
    // get explicitEnvironmentId(): DataEnvironmentId | undefined { return this.dataIvemId.explicitEnvironmentId; }

    get ivemClassId() { return this._ivemClassId; }
    get subscriptionDataTypeIds() { return this._subscriptionDataTypeIds; }
    get tradingMarkets() { return this._tradingMarkets; }
    get name() { return this._name; }
    get exchange() { return this._exchange; }
    get alternateCodes(): DataIvemAlternateCodes | undefined { return undefined; } // Currently in Full.  Will be moved to Base in future

    update(change: SymbolsDataMessage.AddUpdateChange) {
        const changeableFieldCount = DataIvemBaseDetail.Field.idCount - SearchSymbolsDataIvemBaseDetail.Key.fieldCount;
        const changedFieldIds = new Array<DataIvemBaseDetail.Field.Id>(changeableFieldCount); // won't include fields in key
        let changedCount = 0;

        let name: string;
        if (change.name !== undefined) {
            name = change.name;
        } else {
            // generate a name - need to improve this to better support TMCs and ETOs
            // name = change.dataIvemId.code;
            name = this.dataIvemId.code;
        }

        if (change.ivemClassId !== this._ivemClassId) {
            this._ivemClassId = change.ivemClassId;
            changedFieldIds[changedCount++] = DataIvemBaseDetail.Field.Id.IvemClassId;
        }
        if (!isUndefinableArrayEqualUniquely(change.subscriptionDataTypeIds, this._subscriptionDataTypeIds)) {
            this._subscriptionDataTypeIds = change.subscriptionDataTypeIds;
            changedFieldIds[changedCount++] = DataIvemBaseDetail.Field.Id.SubscriptionDataTypeIds;
        }
        const newTradingMarketZenithCodes = change.tradingMarketZenithCodes;
        if (!isArrayEqualUniquely(newTradingMarketZenithCodes, this._tradingMarketZenithCodes)) {
            this._tradingMarketZenithCodes = newTradingMarketZenithCodes;
            this._tradingMarkets = this._marketsService.getTradingMarkets(change.tradingMarketZenithCodes, false);
            changedFieldIds[changedCount++] = DataIvemBaseDetail.Field.Id.TradingMarkets;
        }
        if (name !== this._name) {
            this._name = name;
            changedFieldIds[changedCount++] = DataIvemBaseDetail.Field.Id.Name;
        }
        if (change.exchangeZenithCode !== this._exchange.zenithCode) {
            this._exchange = this._marketsService.getExchangeOrUnknown(change.exchangeZenithCode);
            changedFieldIds[changedCount++] = DataIvemBaseDetail.Field.Id.Exchange;
        }

        if (changedCount >= 0) {
            changedFieldIds.length = changedCount;
            this.notifyBaseChange(changedFieldIds);
        }
    }

    subscribeBaseChangeEvent(handler: DataIvemBaseDetail.ChangeEventHandler) {
        return this._baseChangeEvent.subscribe(handler);
    }

    unsubscribeBaseChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._baseChangeEvent.unsubscribe(subscriptionId);
    }

    private notifyBaseChange(changedFieldIds: DataIvemBaseDetail.Field.Id[]) {
        const handlers = this._baseChangeEvent.copyHandlers();
        for (const handler of handlers) {
            handler(changedFieldIds);
        }
    }
}

export namespace SearchSymbolsDataIvemBaseDetail {
    export type Key = DataIvemId;

    export namespace Key {
        export const fieldCount = 3;
    }


}
