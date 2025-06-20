import { MultiEvent } from '@pbkware/js-utils';
import { UiAction } from '@pbkware/ui-action';
import { AllBrokerageAccountGroup, BrokerageAccountGroup } from '../adi';

export class BrokerageAccountGroupUiAction extends UiAction {
    private _value: BrokerageAccountGroup | undefined;
    private _definedValue: BrokerageAccountGroup = BrokerageAccountGroupUiAction.undefinedBrokergeAccountGroup;
    private _options = BrokerageAccountGroupUiAction.defaultOptions;

    private _brokerageAccountIdPushMultiEvent = new MultiEvent<BrokerageAccountGroupUiAction.PushEventHandlersInterface>();

    get valueUndefined() { return this._value === undefined; }

    get value() { return this._value; }
    get definedValue() { return this._definedValue; }
    get options() { return this._options; }

    commitValue(value: BrokerageAccountGroup | undefined, typeId: UiAction.CommitTypeId) {
        this._value = value;
        this.setDefinedValue();
        this.commit(typeId);
    }

    pushValue(value: BrokerageAccountGroup | undefined) {
        this.pushValueWithoutAutoAcceptance(value, this.edited);
        this.pushAutoAcceptance();
    }

    pushOptions(options: BrokerageAccountGroupUiAction.Options) {
        this._options = options;
        this.notifyOptionsPush();
    }

    override createPushEventHandlersInterface(): UiAction.PushEventHandlersInterface {
        const result: BrokerageAccountGroupUiAction.PushEventHandlersInterface = {};
        return result;
    }

    override subscribePushEvents(handlersInterface: BrokerageAccountGroupUiAction.PushEventHandlersInterface) {
        const subscriptionId = super.subscribePushEvents(handlersInterface);
        return this._brokerageAccountIdPushMultiEvent.subscribeWithId(handlersInterface, subscriptionId);
    }

    override unsubscribePushEvents(subscriptionId: MultiEvent.SubscriptionId) {
        this._brokerageAccountIdPushMultiEvent.unsubscribe(subscriptionId);
        super.unsubscribePushEvents(subscriptionId);
    }

    protected override repushValue(newEdited: boolean) {
        this.pushValueWithoutAutoAcceptance(this._value, newEdited);
    }

    private notifyValuePush(edited: boolean) {
        const handlersInterfaces = this._brokerageAccountIdPushMultiEvent.copyHandlers();
        for (let i = 0; i < handlersInterfaces.length; i++) {
            const handlersInterface = handlersInterfaces[i];
            if (handlersInterface.value !== undefined) {
                handlersInterface.value(this.value, edited);
            }
        }
    }

    private notifyOptionsPush() {
        const handlersInterfaces = this._brokerageAccountIdPushMultiEvent.copyHandlers();
        for (let i = 0; i < handlersInterfaces.length; i++) {
            const handlersInterface = handlersInterfaces[i];
            if (handlersInterface.options !== undefined) {
                handlersInterface.options(this.options);
            }
        }
    }

    private setDefinedValue() {
        if (this._value !== undefined) {
            this._definedValue = this._value;
        } else {
            this._definedValue = BrokerageAccountGroupUiAction.undefinedBrokergeAccountGroup;
        }
    }

    private pushValueWithoutAutoAcceptance(value: BrokerageAccountGroup | undefined, edited: boolean) {
        this._value = value;
        this.setDefinedValue();
        this.notifyValuePush(edited);
    }
}

export namespace BrokerageAccountGroupUiAction {
    export interface Options {
        allAllowed: boolean;
    }

    export const undefinedBrokergeAccountGroup: AllBrokerageAccountGroup = BrokerageAccountGroup.createAll();

    export type ValuePushEventHander = (this: void, value: BrokerageAccountGroup | undefined, edited: boolean) => void;
    export type OptionsPushEventHandler = (this: void, options: Options) => void;

    export interface PushEventHandlersInterface extends UiAction.PushEventHandlersInterface {
        value?: ValuePushEventHander;
        options?: OptionsPushEventHandler;
    }

    export const defaultOptions: Options = {
        allAllowed: false,
    };
}
