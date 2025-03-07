import { AssertInternalError, MultiEvent, isArrayEqualUniquely } from '@pbkware/js-utils';
import { DataIvemAlternateCodes, DataIvemBaseDetail, DataIvemId, DataMarket, Exchange, IvemClassId, PublisherSubscriptionDataTypeId, TradingMarket } from '../../../adi/internal-api';
import { StringId, Strings } from '../../../res/internal-api';
import { SymbolDetailCacheService } from '../../../services/symbol-detail-cache-service';

export class PromisedDataIvemBaseDetail implements DataIvemBaseDetail {
    readonly key: DataIvemId;
    readonly code: string;
    readonly market: DataMarket;

    private _full: boolean;
    private _ivemClassId: IvemClassId | undefined;
    private _subscriptionDataTypeIds: readonly PublisherSubscriptionDataTypeId[] | undefined;
    private _tradingMarkets: readonly TradingMarket[] | undefined;
    private _name: string | undefined;
    private _exchange: Exchange | undefined;

    private _baseChangeEvent = new MultiEvent<DataIvemBaseDetail.ChangeEventHandler>();

    constructor(
        symbolDetailCacheService: SymbolDetailCacheService,
        readonly dataIvemId: DataIvemId,
    ) {
        this.key = dataIvemId;
        this.code = dataIvemId.code;
        this.market = dataIvemId.market;

        const getPromise = symbolDetailCacheService.getDataIvemId(dataIvemId);
        getPromise.then(
            (detail) => {
                if (detail !== undefined) {
                    if (detail.expired) {
                        this.setNameOnly(`<${Strings[StringId.Error]}: ${detail.errorText}>`);
                    } else {
                        if (!detail.exists) {
                            this.setNameOnly(`<${Strings[StringId.SymbolNotFound]}>`);
                        } else {
                            this.loadFromDetail(detail);
                        }
                    }
                }
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'PLIBD10817'); }
        )
    }

    get full(): boolean { return this._full; }
    get ivemClassId() { return this._ivemClassId; }
    get subscriptionDataTypeIds() { return this._subscriptionDataTypeIds; }
    get tradingMarkets() { return this._tradingMarkets; }
    get name() { return this._name; }
    get exchange() { return this._exchange; }
    get alternateCodes(): DataIvemAlternateCodes | undefined { return undefined; } // In future, move alternateCodes from Full to Base

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

    private loadFromDetail(detail: SymbolDetailCacheService.DataIvemIdDetail) {
        const changedFieldIds = new Array<DataIvemBaseDetail.Field.Id>(DataIvemBaseDetail.Field.idCount);
        let changedFieldCount = 0;

        if (detail.ivemClassId !== this._ivemClassId) {
            this._ivemClassId = detail.ivemClassId;
            changedFieldIds[changedFieldCount++] = DataIvemBaseDetail.Field.Id.IvemClassId;
        }

        if (this._subscriptionDataTypeIds === undefined || !isArrayEqualUniquely(detail.subscriptionDataTypeIds, this._subscriptionDataTypeIds)) {
            this._subscriptionDataTypeIds = detail.subscriptionDataTypeIds;
            changedFieldIds[changedFieldCount++] = DataIvemBaseDetail.Field.Id.SubscriptionDataTypeIds;
        }

        if (this._tradingMarkets === undefined || !isArrayEqualUniquely(detail.tradingMarkets, this._tradingMarkets)) {
            this._tradingMarkets = detail.tradingMarkets;
            changedFieldIds[changedFieldCount++] = DataIvemBaseDetail.Field.Id.TradingMarkets;
        }

        if (detail.name !== this._name) {
            this._name = detail.name;
            changedFieldIds[changedFieldCount++] = DataIvemBaseDetail.Field.Id.Name;
        }

        if (detail.exchange !== this._exchange) {
            this._exchange = detail.exchange;
            changedFieldIds[changedFieldCount++] = DataIvemBaseDetail.Field.Id.Exchange;
        }

        // if (!DataIvemAlternateCodes.isEqual(detail.alternateCodes, this._alternateCodes)) {
        //     this._exchange = detail.exchange;
        //     changedFieldIds[changedFieldCount++] = DataIvemBaseDetail.Field.Id.AlternateCodes;
        // }

        if (changedFieldCount > 0) {
            changedFieldIds.length = changedFieldCount;
            this.notifyBaseChange(changedFieldIds);
        }
    }

    private setNameOnly(value: string) {
        if (value !== this._name) {
            this._name = value;
            this.notifyBaseChange([DataIvemBaseDetail.Field.Id.Name]);
        }
    }
}
