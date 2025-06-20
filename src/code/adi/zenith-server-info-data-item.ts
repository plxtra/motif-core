import { AssertInternalError, MultiEvent } from '@pbkware/js-utils';
import { DataMessage, DataMessageTypeId, ZenithServerInfoDataMessage } from './common/internal-api';
import { PublisherSubscriptionDataItem } from './publish-subscribe/internal-api';

export class ZenithServerInfoDataItem extends PublisherSubscriptionDataItem {
    private _serverName: string | undefined;
    private _serverClass: string | undefined;
    private _softwareVersion: string | undefined;
    private _protocolVersion: string | undefined;

    private _fieldValuesChangedMultiEvent = new MultiEvent<ZenithServerInfoDataItem.FieldValuesChangedEvent>();

    get serverName() { return this._serverName; }
    get serverClass() { return this._serverClass; }
    get softwareVersion() { return this._softwareVersion; }
    get protocolVersion() { return this._protocolVersion; }

    override processMessage(msg: DataMessage) { // virtual;
        if (msg.typeId !== DataMessageTypeId.ZenithServerInfo) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
                if (msg instanceof ZenithServerInfoDataMessage) {
                    this.processServerInfoMessage(msg);
                } else {
                    throw new AssertInternalError('ZSIDIPM877742004');
                }
            } finally {
                this.endUpdate();
            }
        }
    }

    subscribeFieldValuesChangedEvent(handler: ZenithServerInfoDataItem.FieldValuesChangedEvent) {
        return this._fieldValuesChangedMultiEvent.subscribe(handler);
    }

    unsubscribeFieldValuesChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._fieldValuesChangedMultiEvent.unsubscribe(subscriptionId);
    }

    protected override processSubscriptionPreOnline() { // virtual
        if (this._serverName !== undefined ||
            this._serverClass !== undefined ||
            this._softwareVersion !== undefined ||
            this._protocolVersion !== undefined
        ) {
            this.beginUpdate();
            try {
                this.notifyUpdateChange();
                this._serverName = undefined;
                this._serverClass = undefined;
                this._softwareVersion = undefined;
                this._protocolVersion = undefined;
            } finally {
                this.endUpdate();
            }
        }
    }

    private notifyFieldValuesChanged() {
        const handlers = this._fieldValuesChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private processServerInfoMessage(msg: ZenithServerInfoDataMessage) {
        if (this._serverName !== msg.serverName ||
            this._serverClass !== msg.serverClass ||
            this._softwareVersion !== msg.softwareVersion ||
            this._protocolVersion !== msg.protocolVersion
        ) {
            this.beginUpdate();
            try {
                this.notifyUpdateChange();
                this._serverName = msg.serverName;
                this._serverClass = msg.serverClass;
                this._softwareVersion = msg.softwareVersion;
                this._protocolVersion = msg.protocolVersion;

                this.notifyFieldValuesChanged();
            } finally {
                this.endUpdate();
            }
        }
    }
}

export namespace ZenithServerInfoDataItem {
    // export type ListChangeEventHandler = (ListChangeType: ListChangeTypeId, Index: Integer) => void;
    // export type RecChangeEventHandler = (this: void, Index: Integer) => void;

    export type FieldValuesChangedEvent = (this: void) => void;
}
