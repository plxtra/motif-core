import { UiAction } from '@xilytix/ui-action';
import { Market, MarketIvemId, MarketsService } from '../adi/internal-api';
import { SymbolsService } from '../services/internal-api';
import { MultiEvent } from '../sys/internal-api';

export class MarketIvemIdUiAction<T extends Market> extends UiAction {
    private _value: MarketIvemId<T> | undefined;
    private _definedValue: MarketIvemId<T>;
    private _parseDetails: SymbolsService.MarketIvemIdParseDetails<T>;

    private _marketIvemIdPushMultiEvent = new MultiEvent<MarketIvemIdUiAction.PushEventHandlersInterface<T>>();

    constructor(
        private readonly _markets: MarketsService.Markets<T>,
        private readonly _constructor: MarketIvemId.Constructor<T>,
        valueRequired?: boolean
    ) {
        super(valueRequired)
        this._definedValue = this.createUndefinedMarketIvemId();
    }

    get valueUndefined() { return this._value === undefined; }

    get value() { return this._value; }
    get definedValue() { return this._definedValue; }
    get parseDetails() { return this._parseDetails; }

    commitValue(parseDetails: SymbolsService.MarketIvemIdParseDetails<T>, typeId: UiAction.CommitTypeId) {
        this._parseDetails = parseDetails;
        this._value = parseDetails.marketIvemId; // owns value
        this.setDefinedValue();
        this.commit(typeId);
    }

    pushValue(value: MarketIvemId<T> | undefined, selectAll = true) {
        this.pushValueWithoutAutoAcceptance(value, this.edited, selectAll);
        this.pushAutoAcceptance();
    }

    override createPushEventHandlersInterface(): UiAction.PushEventHandlersInterface {
        const result: MarketIvemIdUiAction.PushEventHandlersInterface<T> = {};
        return result;
    }

    override subscribePushEvents(handlersInterface: MarketIvemIdUiAction.PushEventHandlersInterface<T>) {
        const subscriptionId = super.subscribePushEvents(handlersInterface);
        return this._marketIvemIdPushMultiEvent.subscribeWithId(handlersInterface, subscriptionId);
    }

    override unsubscribePushEvents(subscriptionId: MultiEvent.SubscriptionId) {
        this._marketIvemIdPushMultiEvent.unsubscribe(subscriptionId);
        super.unsubscribePushEvents(subscriptionId);
    }

    protected override repushValue(newEdited: boolean) {
        this.pushValueWithoutAutoAcceptance(this._value, newEdited, true);
    }

    private notifyValuePush(edited: boolean, selectAll: boolean) {
        const handlersInterfaces = this._marketIvemIdPushMultiEvent.copyHandlers();
        for (let i = 0; i < handlersInterfaces.length; i++) {
            const handlersInterface = handlersInterfaces[i];
            if (handlersInterface.value !== undefined) {
                handlersInterface.value(this.value, edited, selectAll);
            }
        }
    }

    private setDefinedValue() {
        if (this._value !== undefined) {
            this._definedValue = this._value;
        } else {
            this._definedValue = this.createUndefinedMarketIvemId();
        }
    }

    private pushValueWithoutAutoAcceptance(value: MarketIvemId<T> | undefined, edited: boolean, selectAll: boolean) {
        this._value = value === undefined ? undefined : value.createCopy();
        this.setDefinedValue();
        this.notifyValuePush(edited, selectAll);
    }

    private createUndefinedMarketIvemId() {
        return MarketIvemId.createUnknown(this._markets.genericUnknownMarket, this._constructor);
    }
}

export namespace MarketIvemIdUiAction {
    export type ValuePushEventHander<T extends Market> = (this: void, value: MarketIvemId<T> | undefined, edited: boolean, selectAll: boolean) => void;

    export interface PushEventHandlersInterface<T extends Market> extends UiAction.PushEventHandlersInterface {
        value?: ValuePushEventHander<T>;
    }
}
