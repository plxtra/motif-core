import { MultiEvent } from '@pbkware/js-utils';
import { UiAction } from '@pbkware/ui-action';
import { IvemId, MarketsService } from '../adi';
import { SymbolsService } from '../services';

/** @public */
export class IvemIdUiAction extends UiAction {
    private _value: IvemId | undefined;
    private _definedValue: IvemId;
    private _parseDetails: SymbolsService.IvemIdParseDetails | undefined;

    private readonly _ivemIdPushMultiEvent = new MultiEvent<IvemIdUiAction.PushEventHandlersInterface>();

    constructor(private readonly _marketsService: MarketsService, valueRequired?: boolean) {
        super(valueRequired)
        this._definedValue = this.createUndefinedIvemId();
    }

    get valueUndefined() { return this._value === undefined; }

    get value() { return this._value; }
    get definedValue() { return this._definedValue; }
    get parseDetails() { return this._parseDetails; }

    commitValue(parseDetails: SymbolsService.IvemIdParseDetails | undefined, typeId: UiAction.CommitTypeId) {
        this._parseDetails = parseDetails;
        this._value = parseDetails === undefined ? undefined : parseDetails.ivemId; // owns value
        this.setDefinedValue();
        this.commit(typeId);
    }

    pushValue(value: IvemId | undefined, selectAll = true) {
        this.pushValueWithoutAutoAcceptance(value, this.edited, selectAll);
        this.pushAutoAcceptance();
    }

    override createPushEventHandlersInterface(): UiAction.PushEventHandlersInterface {
        const result: IvemIdUiAction.PushEventHandlersInterface = {};
        return result;
    }

    override subscribePushEvents(handlersInterface: IvemIdUiAction.PushEventHandlersInterface) {
        const subscriptionId = super.subscribePushEvents(handlersInterface);
        return this._ivemIdPushMultiEvent.subscribeWithId(handlersInterface, subscriptionId);
    }

    override unsubscribePushEvents(subscriptionId: MultiEvent.SubscriptionId) {
        this._ivemIdPushMultiEvent.unsubscribe(subscriptionId);
        super.unsubscribePushEvents(subscriptionId);
    }

    protected override repushValue(newEdited: boolean) {
        this.pushValueWithoutAutoAcceptance(this._value, newEdited, true);
    }

    private notifyValuePush(edited: boolean, selectAll: boolean) {
        const handlersInterfaces = this._ivemIdPushMultiEvent.copyHandlers();
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
            this._definedValue = this.createUndefinedIvemId();
        }
    }

    private pushValueWithoutAutoAcceptance(value: IvemId | undefined, edited: boolean, selectAll: boolean) {
        this._value = value === undefined ? undefined : value.createCopy();
        this.setDefinedValue();
        this.notifyValuePush(edited, selectAll);
    }

    private createUndefinedIvemId() {
        return IvemId.createUnknown(this._marketsService.genericUnknownExchange);
    }
}

/** @public */
export namespace IvemIdUiAction {
    export type ValuePushEventHander = (this: void, value: IvemId | undefined, edited: boolean, selectAll: boolean) => void;

    export interface PushEventHandlersInterface extends UiAction.PushEventHandlersInterface {
        value?: ValuePushEventHander;
    }
}
