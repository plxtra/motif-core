import { UiAction } from '@xilytix/ui-action';
import { Market, MarketsService } from '../adi/internal-api';
import { MultiEvent } from '../sys/internal-api';

export class MarketUiAction<T extends Market> extends UiAction {

    private _value: T | undefined;
    private _definedValue: T;
    private _allowedValues: readonly T[] = [];

    private _orderRoutePushMultiEvent = new MultiEvent<MarketUiAction.PushEventHandlersInterface<T>>();

    constructor(private readonly _markets: MarketsService.Markets<T>, valueRequired?: boolean) {
        super(valueRequired)
        this._definedValue = this._markets.genericUnknownMarket;
    }

    get valueUndefined() { return this._value === undefined; }

    get value() { return this._value; }
    get definedValue() { return this._definedValue; }
    get allowedValues() { return this._allowedValues; }

    commitValue(value: T | undefined, typeId: UiAction.CommitTypeId) {
        this._value = value;
        this.setDefinedValue();
        this.commit(typeId);
    }

    pushAllowedValues(allowedValues: readonly T[]) {
        this._allowedValues = allowedValues;
        this.notifyAllowedValuesPush();
    }

    pushValue(value: T | undefined) {
        this.pushValueWithoutAutoAcceptance(value, this.edited);
        this.pushAutoAcceptance();
    }

    override createPushEventHandlersInterface(): UiAction.PushEventHandlersInterface {
        const result: MarketUiAction.PushEventHandlersInterface<T> = {};
        return result;
    }

    override subscribePushEvents(handlersInterface: MarketUiAction.PushEventHandlersInterface<T>) {
        const subscriptionId = super.subscribePushEvents(handlersInterface);
        return this._orderRoutePushMultiEvent.subscribeWithId(handlersInterface, subscriptionId);
    }

    override unsubscribePushEvents(subscriptionId: MultiEvent.SubscriptionId) {
        this._orderRoutePushMultiEvent.unsubscribe(subscriptionId);
        super.unsubscribePushEvents(subscriptionId);
    }

    protected override repushValue(newEdited: boolean) {
        this.pushValueWithoutAutoAcceptance(this._value, newEdited);
    }

    private notifyValuePush(edited: boolean) {
        const handlersInterfaces = this._orderRoutePushMultiEvent.copyHandlers();
        for (let i = 0; i < handlersInterfaces.length; i++) {
            const handlersInterface = handlersInterfaces[i];
            if (handlersInterface.value !== undefined) {
                handlersInterface.value(this.value, edited);
            }
        }
    }

    private notifyAllowedValuesPush() {
        const handlersInterfaces = this._orderRoutePushMultiEvent.copyHandlers();
        for (let i = 0; i < handlersInterfaces.length; i++) {
            const handlersInterface = handlersInterfaces[i];
            if (handlersInterface.allowedValues !== undefined) {
                handlersInterface.allowedValues(this._allowedValues);
            }
        }
    }

    private setDefinedValue() {
        if (this._value !== undefined) {
            this._definedValue = this._value;
        } else {
            this._definedValue = this._markets.genericUnknownMarket;
        }
    }

    private pushValueWithoutAutoAcceptance(value: T | undefined, edited: boolean) {
        this._value = value;
        this.setDefinedValue();
        this.notifyValuePush(edited);
    }
}

export namespace MarketUiAction {
    export type ValuePushEventHandler<T extends Market> = (this: void, value: T | undefined, edited: boolean) => void;
    export type AllowedValuesPushEventHandler<T extends Market> = (this: void, values: readonly T[]) => void;

    export interface PushEventHandlersInterface<T extends Market> extends UiAction.PushEventHandlersInterface {
        value?: ValuePushEventHandler<T>;
        allowedValues?: AllowedValuesPushEventHandler<T>;
    }
}
