import { Integer, MultiEvent, newNowDate, SysTick } from '@xilytix/sysutils';
import { assert, Badness } from '../sys/internal-api';
import { AdiPublisher } from './common/adi-publisher';
import {
    AuthStatusId,
    DataChannelId,
    DataDefinition,
    DataMessage,
    DataMessageTypeId,
    PublisherSessionTerminatedReasonId,
    ZenithCounterDataMessage,
    ZenithEndpointSelectedDataMessage,
    ZenithLogDataMessage,
    ZenithPublisherOnlineChangeDataMessage,
    ZenithPublisherReconnectReasonId,
    ZenithPublisherStateChangeDataMessage,
    ZenithPublisherStateId,
    ZenithReconnectDataMessage,
    ZenithSessionTerminatedDataMessage
} from "./common/internal-api";
import { ExtConnectionDataItem } from './data-item/internal-api';
import { ZenithPublisher } from './publishers/internal-api';

export class ZenithExtConnectionDataItem extends ExtConnectionDataItem {
    private _publisher: AdiPublisher;

    private _publisherOnline = false;
    private _publisherOnlineChangeHistory: ZenithExtConnectionDataItem.PublisherOnlineChange[] = [];
    private _publisherStateId = ZenithPublisherStateId.Initialise;
    private _waitId = 0;
    private _lastReconnectReasonId: ZenithPublisherReconnectReasonId | undefined;
    private _sessionTerminated = false;
    private _selectedEndpoint = '';
    private _authExpiryTime = 0;
    private _authFetchSuccessiveFailureCount = 0;
    private _socketConnectingSuccessiveErrorCount = 0;
    private _zenithTokenFetchSuccessiveFailureCount = 0;
    private _zenithTokenRefreshSuccessiveFailureCount = 0;
    private _socketClosingSuccessiveErrorCount = 0;
    private _socketShortLivedClosedSuccessiveErrorCount = 0;
    private _unexpectedSocketCloseCount = 0;
    private _timeoutCount = 0;
    private _lastTimeoutStateId: ZenithPublisherStateId | undefined;

    private _receivePacketCount = 0;
    private _sendPacketCount = 0;

    private _internalSubscriptionErrorCount = 0;
    private _invalidRequestSubscriptionErrorCount = 0;
    private _requestTimeoutSubscriptionErrorCount = 0;
    private _offlinedSubscriptionErrorCount = 0;
    private _publishRequestErrorSubscriptionErrorCount = 0;
    private _subRequestErrorSubscriptionErrorCount = 0;
    private _dataErrorSubscriptionErrorCount = 0;
    private _userNotAuthorisedSubscriptionErrorCount = 0;
    private _serverWarningSubscriptionErrorCount = 0;

    private _authStatusId: AuthStatusId = AuthStatusId.NotAuthorised;

    private _publisherStateChangeMultiEvent = new MultiEvent<ZenithExtConnectionDataItem.PublisherStateChangeEventHandler>();
    private _publisherOnlineChangeMultiEvent = new MultiEvent<ZenithExtConnectionDataItem.PublisherOnlineChangeEventHandler>();
    private _reconnectMultiEvent = new MultiEvent<ZenithExtConnectionDataItem.ReconnectEventHandler>();
    private _selectedEndpointChangedMultiEvent = new MultiEvent<ZenithExtConnectionDataItem.SelectedEndpointChangedEventHandler>();
    private _counterMultiEvent = new MultiEvent<ZenithExtConnectionDataItem.CounterEventHandler>();
    private _sessionTerminatedMultiEvent = new MultiEvent<ZenithExtConnectionDataItem.SessionTerminatedEventHandler>();

    constructor(MyDataDefinition: DataDefinition) {
        super(MyDataDefinition);
        assert(MyDataDefinition.channelId === DataChannelId.ZenithExtConnection);
    }

    public get AuthStatusId(): AuthStatusId { return this._authStatusId; }

    get publisherOnline() { return this._publisherOnline; }
    get publisherOnlineChangeHistory() { return this._publisherOnlineChangeHistory; }
    get publisherStateId() { return this._publisherStateId; }
    get waitId() { return this._waitId; }
    get lastReconnectReasonId() { return this._lastReconnectReasonId; }
    get sessionTerminated() { return this._sessionTerminated; }

    get selectedEndpoint() { return this._selectedEndpoint; }

    get authExpiryTime() { return this._authExpiryTime; }
    get authFetchSuccessiveFailureCount() { return this._authFetchSuccessiveFailureCount; }
    get socketConnectingSuccessiveErrorCount() { return this._socketConnectingSuccessiveErrorCount; }
    get zenithTokenFetchSuccessiveFailureCount() { return this._zenithTokenFetchSuccessiveFailureCount; }
    get zenithTokenRefreshSuccessiveFailureCount() { return this._zenithTokenRefreshSuccessiveFailureCount; }
    get socketClosingSuccessiveErrorCount() { return this._socketClosingSuccessiveErrorCount; }
    get socketShortLivedClosedSuccessiveErrorCount() { return this._socketShortLivedClosedSuccessiveErrorCount; }
    get unexpectedSocketCloseCount() { return this._unexpectedSocketCloseCount; }
    get timeoutCount() { return this._timeoutCount; }
    get lastTimeoutStateId() { return this._lastTimeoutStateId; }
    get receivePacketCount() { return this._receivePacketCount; }
    get sendPacketCount() { return this._sendPacketCount; }

    get internalSubscriptionErrorCount() { return this._internalSubscriptionErrorCount; }
    get invalidRequestSubscriptionErrorCount() { return this._invalidRequestSubscriptionErrorCount; }
    get requestTimeoutSubscriptionErrorCount() { return this._requestTimeoutSubscriptionErrorCount; }
    get offlinedSubscriptionErrorCount() { return this._offlinedSubscriptionErrorCount; }
    get publishRequestErrorSubscriptionErrorCount() { return this._publishRequestErrorSubscriptionErrorCount; }
    get subRequestErrorSubscriptionErrorCount() { return this._subRequestErrorSubscriptionErrorCount; }
    get dataErrorSubscriptionErrorCount() { return this._dataErrorSubscriptionErrorCount; }
    get userNotAuthorisedSubscriptionErrorCount() { return this._userNotAuthorisedSubscriptionErrorCount; }
    get serverWarningSubscriptionErrorCount() { return this._serverWarningSubscriptionErrorCount; }

    updateAccessToken(value: string) {
        (this._publisher as ZenithPublisher).updateAccessToken(value);
    }

    diagnosticCloseSocket() {
        (this._publisher as ZenithPublisher).diagnosticCloseSocket();
    }

    override processMessage(msg: DataMessage): void {
        switch (msg.typeId) {
            case DataMessageTypeId.ZenithPublisherOnlineChange:
                this.processPublisherOnlineChange(msg as ZenithPublisherOnlineChangeDataMessage);
                break;
            case DataMessageTypeId.ZenithPublisherStateChange:
                this.processPublisherStateChange(msg as ZenithPublisherStateChangeDataMessage);
                break;
            case DataMessageTypeId.ZenithReconnect:
                this.processReconnect(msg as ZenithReconnectDataMessage);
                break;
            case DataMessageTypeId.ZenithEndpointSelected:
                this.processEndpointSelected(msg as ZenithEndpointSelectedDataMessage);
                break;
            case DataMessageTypeId.ZenithCounter:
                this.processCounter(msg as ZenithCounterDataMessage);
                break;
            case DataMessageTypeId.ZenithLog:
                this.processLog(msg as ZenithLogDataMessage);
                break;
            case DataMessageTypeId.ZenithSessionTerminated:
                this.processSessionTerminated(msg as ZenithSessionTerminatedDataMessage);
                break;

            default:
                super.processMessage(msg);
        }
    }

    processPublisherOnlineChange(msg: ZenithPublisherOnlineChangeDataMessage) {
        const online = msg.online;
        this.beginUpdate();
        try {
            this.notifyUpdateChange();
            this._publisherOnline = online;
            const change: ZenithExtConnectionDataItem.PublisherOnlineChange = {
                time: newNowDate(),
                tickTime: SysTick.now(),
                socketCloseCode: msg.socketCloseCode,
                socketCloseReason: msg.socketCloseReason,
                socketCloseWasClean: msg.socketCloseWasClean,
            };
            this._publisherOnlineChangeHistory.push(change);
            this.notifyPublisherOnlineChange(this._publisherOnline);
        } finally {
            this.endUpdate();
        }
    }

    processPublisherStateChange(msg: ZenithPublisherStateChangeDataMessage) {
        this.beginUpdate();
        try {
            this.notifyUpdateChange();
            this._publisherStateId = msg.stateId;
            this._waitId = msg.waitId;
            this.notifyPublisherStateChange(msg.stateId, msg.waitId);
        } finally {
            this.endUpdate();
        }
    }

    processReconnect(msg: ZenithReconnectDataMessage) {
        this.beginUpdate();
        try {
            this.notifyUpdateChange();
            this._lastReconnectReasonId = msg.reconnectReasonId;
            this.notifyReconnect(msg.reconnectReasonId);
        } finally {
            this.endUpdate();
        }
    }

    processEndpointSelected(msg: ZenithEndpointSelectedDataMessage) {
        const endpoint = msg.endpoint;
        if (endpoint !== this._selectedEndpoint) {
            this._selectedEndpoint = endpoint;
            this.notifySelectedEndpointChanged();
        }
    }

    processCounter(msg: ZenithCounterDataMessage) {
        this._authExpiryTime = msg.authExpiryTime;
        this._authFetchSuccessiveFailureCount = msg.authFetchSuccessiveFailureCount;
        this._socketConnectingSuccessiveErrorCount = msg.socketConnectingSuccessiveErrorCount;
        this._zenithTokenFetchSuccessiveFailureCount = msg.zenithTokenFetchSuccessiveFailureCount;
        this._zenithTokenRefreshSuccessiveFailureCount = msg.zenithTokenRefreshSuccessiveFailureCount;
        this._socketClosingSuccessiveErrorCount = msg.socketClosingSuccessiveErrorCount;
        this._socketShortLivedClosedSuccessiveErrorCount = msg.socketShortLivedClosedSuccessiveErrorCount;
        this._unexpectedSocketCloseCount = msg.unexpectedSocketCloseCount;
        this._timeoutCount = msg.timeoutCount;
        this._lastTimeoutStateId = msg.lastTimeoutStateId;

        this._receivePacketCount = msg.receivePacketCount;
        this._sendPacketCount = msg.sendPacketCount;

        this._internalSubscriptionErrorCount = msg.internalSubscriptionErrorCount;
        this._invalidRequestSubscriptionErrorCount = msg.invalidRequestSubscriptionErrorCount;
        this._requestTimeoutSubscriptionErrorCount = msg.requestTimeoutSubscriptionErrorCount;
        this._offlinedSubscriptionErrorCount = msg.offlinedSubscriptionErrorCount;
        this._publishRequestErrorSubscriptionErrorCount = msg.publishRequestErrorSubscriptionErrorCount;
        this._subRequestErrorSubscriptionErrorCount = msg.subRequestErrorSubscriptionErrorCount;
        this._dataErrorSubscriptionErrorCount = msg.dataErrorSubscriptionErrorCount;
        this._userNotAuthorisedSubscriptionErrorCount = msg.userNotAuthorisedSubscriptionErrorCount;
        this._serverWarningSubscriptionErrorCount = msg.serverWarningSubscriptionErrorCount;

        this.notifyCounter();
    }

    processLog(msg: ZenithLogDataMessage) {
        //  window.motifLogger.log(msg.levelId, msg.text); // Use in future if Publisher is run in different thread
    }

    processSessionTerminated(msg: ZenithSessionTerminatedDataMessage) {
        if (!this._sessionTerminated) {
            this.beginUpdate();
            try {
                this.notifyUpdateChange();
                this._sessionTerminated = true;
                this.notifySessionTerminated(msg.reasonId, msg.reasonCode, msg.defaultReasonText);
            } finally {
                this.endUpdate();
            }
        }
    }

    subscribePublisherOnlineChangeEvent(handler: ZenithExtConnectionDataItem.PublisherOnlineChangeEventHandler) {
        return this._publisherOnlineChangeMultiEvent.subscribe(handler);
    }

    unsubscribePublisherOnlineChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._publisherOnlineChangeMultiEvent.unsubscribe(subscriptionId);
    }

    subscribePublisherStateChangeEvent(handler: ZenithExtConnectionDataItem.PublisherStateChangeEventHandler) {
        return this._publisherStateChangeMultiEvent.subscribe(handler);
    }

    unsubscribePublisherStateChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._publisherStateChangeMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeZenithReconnectEvent(handler: ZenithExtConnectionDataItem.ReconnectEventHandler) {
        return this._reconnectMultiEvent.subscribe(handler);
    }

    unsubscribeZenithReconnectEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._reconnectMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeZenithSelectedEndpointChangedEvent(handler: ZenithExtConnectionDataItem.SelectedEndpointChangedEventHandler) {
        return this._selectedEndpointChangedMultiEvent.subscribe(handler);
    }

    unsubscribeZenithSelectedEndpointChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._selectedEndpointChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeZenithCounterEvent(handler: ZenithExtConnectionDataItem.CounterEventHandler) {
        return this._counterMultiEvent.subscribe(handler);
    }

    unsubscribeZenithCounterEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._counterMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeZenithSessionTerminatedEvent(handler: ZenithExtConnectionDataItem.SessionTerminatedEventHandler) {
        return this._sessionTerminatedMultiEvent.subscribe(handler);
    }

    unsubscribeZenithSessionTerminatedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._sessionTerminatedMultiEvent.unsubscribe(subscriptionId);
    }

    protected override start() {
        this._publisher = this.onRequirePublisher(this.definition);
        this._publisher.connect(this.id, this.nextRequestNr, this.definition);

        super.start();

        this.trySetUsable(); // always usable after connect initiated
    }

    protected override stop() {
        this._publisher.disconnect(this.id);
    }

    protected override calculateUsabilityBadness() {
        return Badness.notBad; // always usable after started
    }

    protected getConnected(): boolean {
        return this._publisherOnline;
    }

    private notifyPublisherOnlineChange(online: boolean) {
        const handlers = this._publisherOnlineChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](online);
        }
    }

    private notifyPublisherStateChange(stateId: ZenithPublisherStateId, waitId: Integer) {
        const handlers = this._publisherStateChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](stateId, waitId);
        }
    }

    private notifyReconnect(reconnectReasonId: ZenithPublisherReconnectReasonId) {
        const handlers = this._reconnectMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](reconnectReasonId);
        }
    }

    private notifySelectedEndpointChanged() {
        const handlers = this._selectedEndpointChangedMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i]();
        }
    }

    private notifyCounter() {
        const handlers = this._counterMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i]();
        }
    }

    private notifySessionTerminated(
        reasonId: PublisherSessionTerminatedReasonId,
        reasonCode: Integer,
        defaultReasonText: string
    ) {
        const handlers = this._sessionTerminatedMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](reasonId, reasonCode, defaultReasonText);
        }
    }
}

export namespace ZenithExtConnectionDataItem {
    export interface PublisherOnlineChange {
        readonly time: Date;
        readonly tickTime: SysTick.Time;
        readonly socketCloseCode: number;
        readonly socketCloseReason: string;
        readonly socketCloseWasClean: boolean;
    }

    export type PublisherOnlineChangeEventHandler = (this: void, online: boolean) => void;
    export type PublisherStateChangeEventHandler = (this: void, stateId: ZenithPublisherStateId, waitId: Integer) => void;
    export type ReconnectEventHandler = (this: void, reconnectReasonId: ZenithPublisherReconnectReasonId) => void;
    export type SelectedEndpointChangedEventHandler = (this: void) => void;
    export type CounterEventHandler = (this: void) => void;
    export type SessionTerminatedEventHandler = (
        this: void,
        reasonId: PublisherSessionTerminatedReasonId,
        reasonCode: Integer,
        defaultReasonText: string
    ) => void;
}

/*interface IStateUpdate {
    ZenithConnectionStatus?: TZenithExtConnectionStatusId;
    ZenithAuthStatusId?: AuthStatusId;
}
*/
