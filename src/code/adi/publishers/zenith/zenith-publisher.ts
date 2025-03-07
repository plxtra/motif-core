import {
    AssertInternalError,
    DecimalFactory,
    Integer,
    Logger,
    mSecsPerHour,
    mSecsPerMin,
    mSecsPerSec,
    newNowDate,
    SysTick,
    UnreachableCaseError
} from '@pbkware/js-utils';
import { WebsocketCloseCode } from '../../../sys/internal-api';
import { AdiPublisher } from '../../common/adi-publisher';
import {
    AdiPublisherSubscription,
    AdiPublisherTypeId,
    DataDefinition,
    DataItemId,
    DataMessages,
    invalidDataItemId,
    invalidDataItemRequestNr,
    PublisherSessionTerminatedReasonId,
    PublisherSubscriptionDataDefinition,
    SynchronisedPublisherSubscriptionDataMessage,
    ZenithCounterDataMessage,
    ZenithEndpointSelectedDataMessage,
    ZenithExtConnectionDataDefinition,
    ZenithLogDataMessage,
    ZenithPublisherOnlineChangeDataMessage,
    ZenithPublisherReconnectReasonId,
    ZenithPublisherStateChangeDataMessage,
    ZenithPublisherStateId,
    ZenithReconnectDataMessage,
    ZenithSessionTerminatedDataMessage
} from "../../common/internal-api";
import { AuthTokenMessageConvert } from './physical-message/auth-token-message-convert';
import { ZenithProtocol, ZenithWebSocketCloseCode } from './physical-message/protocol/zenith-protocol';
import { ZenithConnectionStateEngine } from './zenith-connection-state-engine';
import { ZenithPublisherSubscriptionManager } from './zenith-publisher-subscription-manager';
import { ZenithWebsocket } from './zenith-websocket';

export class ZenithPublisher extends AdiPublisher {
    private readonly _requestEngine: ZenithPublisherSubscriptionManager;
    private readonly _stateEngine = new ZenithConnectionStateEngine();
    private readonly _websocket = new ZenithWebsocket();
    private readonly _authTokenMessageConvert = new AuthTokenMessageConvert();

    private _connectionDataItemId: DataItemId;
    private _connectionDataItemRequestNr: Integer;

    private _counterIntervalHandle: ReturnType<typeof setTimeout> | undefined;
    private _dataMessages = new DataMessages();
    // private _isUnloading = false;

    private _reconnectDelayTimeoutHandle: ReturnType<typeof setTimeout> | undefined;

    private _receivePacketCount = 0;
    private _sendPacketCount = 0;
    private _internalSubscriptionErrorCount = 0;
    private _invalidRequestSubscriptionErrorCount = 0;
    private _requestTimeoutSubscriptionErrorCount = 0;
    private _offlinedSubscriptionErrorCount = 0;
    private _publishRequestErrorSubscriptionErrorCount = 0;
    private _subscriptionErrorCount = 0;
    private _subscriptionWarningCount = 0;
    private _dataErrorSubscriptionErrorCount = 0;
    private _userNotAuthorisedSubscriptionErrorCount = 0;
    private _serverWarningSubscriptionErrorCount = 0;

    constructor(decimalFactory: DecimalFactory) {
        super();

        this._stateEngine.actionEvent = (actionId, waitId) => { this.handleStateEngineActionEvent(actionId, waitId); };
        this._stateEngine.cameOnlineEvent = () => { this.handleStateEngineCameOnlineEvent(); };
        this._stateEngine.wentOfflineEvent = (socketCloseCode, socketCloseReason, socketCloseWasClean) => {
            this.handleStateEngineWentOfflineEvent(socketCloseCode, socketCloseReason, socketCloseWasClean);
        };
        this._stateEngine.stateChangeEvent = (stateId, waitId) => { this.handleStateEngineStateChangeEvent(stateId, waitId); };
        this._stateEngine.reconnectEvent = (reasonId) => { this.handleStateEngineReconnectEvent(reasonId); };
        this._stateEngine.logEvent = (logLevelId, text) => { this.log(logLevelId, text); };
        this._requestEngine = new ZenithPublisherSubscriptionManager(decimalFactory);
        this._requestEngine.subscriptionErrorEvent = (typeId) => { this.handleRequestEngineSubscriptionErrorEvent(typeId); };
        this._requestEngine.serverWarningEvent = () => { this.handleRequestEngineServerWarningEvent(); };
        this._requestEngine.sendPhysicalMessageEvent = (message) => this.handleRequestEngineSendPhysicalMessageEvent(message);
        this._requestEngine.authMessageReceivedEvent = (message) => { this.handleRequestEngineAuthMessageReceivedEvent(message); };
        this._websocket.openEvent = () => { this.handleWebsocketOpenEvent(); };
        this._websocket.messageEvent = (message) => { this.handleWebsocketMessageEvent(message); };
        this._websocket.closeEvent = (code, reason, wasClean) => { this.handleWebsocketCloseEvent(code, reason, wasClean); };
        this._websocket.errorEvent = (errorType) => { this.handleWebsocketErrorEvent(errorType); };
    }

    override finalise(): boolean { // virtual
        if (this._counterIntervalHandle !== undefined) {
            clearInterval(this._counterIntervalHandle);
            this._counterIntervalHandle = undefined;
        }
        this._requestEngine.finalise();
        this._stateEngine.finalise(false);
        this.checkClearReconnectDelayTimeout();
        return super.finalise();
    }

    connect(
        dataItemId: DataItemId,
        dataItemRequestNr: Integer,
        dataDefinition: DataDefinition
    ) {
        if (!(dataDefinition instanceof ZenithExtConnectionDataDefinition)) {
            throw new AssertInternalError('ZFC121222228852', dataDefinition.description);
        } else {
            const subscriptionCount = this._requestEngine.subscriptionCount;
            if (subscriptionCount > 0) {
                // This should be zero as this means that Publisher is created twice as part of authentication
                // The first instance is lost when restarted but this increases startup time
                this.logWarning(`Subscriptions before connect: ${subscriptionCount}`);
            }
            this._connectionDataItemId = dataItemId;
            this._connectionDataItemRequestNr = dataItemRequestNr;
            this._receivePacketCount = 0;
            this._sendPacketCount = 0;
            this._dataMessages.clear();

            this._stateEngine.updateAccessToken(dataDefinition.initialAuthAccessToken);
            this._stateEngine.updateEndpoints(dataDefinition.zenithWebsocketEndpoints); // starts state machine

            const stateChangeDataMessage = this.createStateChangeDataMessage(this._stateEngine.stateId, this._stateEngine.activeWaitId);
            this._dataMessages.add(stateChangeDataMessage);
            const counterDataMessage = this.createCounterDataMessage();
            this._dataMessages.add(counterDataMessage);
            const synchronisedDataMessage = this.createSynchronisedDataMessage();
            this._dataMessages.add(synchronisedDataMessage);

            this._counterIntervalHandle = setInterval(() => { this.handleCounterInterval(); }, ZenithPublisher.counterDataMessageInterval);
        }
    }

    disconnect(dataItemId: DataItemId) {
        if (dataItemId === this._connectionDataItemId) {
            this._stateEngine.finalise(false);
            this._connectionDataItemId = invalidDataItemId;
            this._connectionDataItemRequestNr = invalidDataItemRequestNr;
            this._receivePacketCount = 0;
            this._sendPacketCount = 0;
            this._dataMessages.clear();
        }
    }

    subscribeDataItemId(dataItemId: DataItemId, dataDefinition: PublisherSubscriptionDataDefinition) {
        return this._requestEngine.subscribeDataItemId(dataItemId, dataDefinition);
    }

    unsubscribeDataItemId(dataItemId: DataItemId) {
        if (dataItemId === this._connectionDataItemId) {
            this._stateEngine.finalise(false);
            this._connectionDataItemId = invalidDataItemId;
            this._connectionDataItemRequestNr = invalidDataItemRequestNr;
            this._receivePacketCount = 0;
            this._sendPacketCount = 0;
            this._dataMessages.clear();
        } else {
            this._requestEngine.unsubscribeDataItemId(dataItemId);
        }
    }

    activateDataItemId(dataItemId: DataItemId, dataItemRequestNr: Integer) {
        this._requestEngine.activateDataItem(dataItemId, dataItemRequestNr);
    }

    getMessages(nowTickTime: SysTick.Time): DataMessages | undefined {
        let outgoingDataMessages = this._requestEngine.exercise(nowTickTime);

        if (this._dataMessages.count > 0) {
            if (outgoingDataMessages === undefined) {
                outgoingDataMessages = new DataMessages();
            }

            outgoingDataMessages.take(this._dataMessages);
        }

        return outgoingDataMessages;
    }

    updateAccessToken(value: string) {
        this._stateEngine.updateAccessToken(value);
    }

    diagnosticCloseSocket() {
        this._websocket.close(ZenithProtocol.WebSocket.CloseCode.MotifDiagnosticClose, 'Motif Diagnostic Close');
    }

    protected getPublisherTypeId(): AdiPublisherTypeId {
        return AdiPublisherTypeId.Zenith;
    }

    private handleStateEngineActionEvent(actionId: ZenithConnectionStateEngine.ActionId, waitId: Integer) {
        switch (actionId) {
            case ZenithConnectionStateEngine.ActionId.OpenSocket:
                this.openSocket(waitId);
                break;
            case ZenithConnectionStateEngine.ActionId.FetchAuth:
            case ZenithConnectionStateEngine.ActionId.UpdateAuth:
                this.fetchOrUpdateAuth(waitId);
                break;
            case ZenithConnectionStateEngine.ActionId.CloseSocket:
                this.closeSocket();
                break;
            case ZenithConnectionStateEngine.ActionId.ReconnectDelay:
                this.delayReconnect(waitId);
                break;
            default:
                throw new UnreachableCaseError('ZFSHSEAE13133', actionId);
        }
    }

    private handleStateEngineCameOnlineEvent() {
        const dataMessage = this.createOnlineChangeDataMessage(true, WebsocketCloseCode.nullCode, '', true);
        this._dataMessages.add(dataMessage);
        this._requestEngine.comeOnline();
    }

    private handleStateEngineWentOfflineEvent(socketCloseCode: number, socketCloseReason: string, socketCloseWasClean: boolean) {
        const dataMessage = this.createOnlineChangeDataMessage(false, socketCloseCode, socketCloseReason, socketCloseWasClean);
        this._dataMessages.add(dataMessage);
        const offlinedErrorText = this.generateOfflinedErrorText(socketCloseCode, socketCloseReason);
        let logText = offlinedErrorText;
        if (!socketCloseWasClean) {
            logText += ' (not clean)';
        }
        this.logError(logText);
        this._requestEngine.goOffline(offlinedErrorText);
    }

    private handleStateEngineStateChangeEvent(stateId: ZenithPublisherStateId, waitId: Integer) {
        const dataMessage = this.createStateChangeDataMessage(stateId, waitId);
        this._dataMessages.add(dataMessage);
    }

    private handleStateEngineReconnectEvent(reconnectReasonId: ZenithPublisherReconnectReasonId) {
        const dataMessage = this.createReconnectDataMessage(reconnectReasonId);
        this._dataMessages.add(dataMessage);
    }

    private handleWebsocketOpenEvent() {
        if (this._websocket.openWaitId === this._stateEngine.activeWaitId) {
            this._stateEngine.adviseSocketOpenSuccess();
        }
    }

    private handleWebsocketMessageEvent(message: unknown) {
        this._requestEngine.addPhysicalMessage(message);
        this._receivePacketCount++;
    }

    private handleWebsocketCloseEvent(code: number, reason: string, wasClean: boolean) {
        this.logInfo(`Websocket closed. Code: ${code} Reason: ${reason}`);
        if (code < (ZenithProtocol.WebSocket.CloseCode.SessionTerminatedRangeStart as Integer)) {
            this._stateEngine.adviseSocketClose(ZenithPublisherReconnectReasonId.UnexpectedSocketClose, code, reason, wasClean);
        } else {
            const dataMessage = this.createSessionTerminatedDataMessage(code, reason);
            this._dataMessages.add(dataMessage);
            this._stateEngine.finalise(true);
        }
    }

    private handleWebsocketErrorEvent(errorType: string) {
        switch (this._websocket.readyState as ZenithWebsocket.ReadyState) {
            case ZenithWebsocket.ReadyState.Connecting:
                this.logError(`Websocket connecting error: ${errorType}`);
                this._stateEngine.adviseSocketConnectingError();
                break;
            case ZenithWebsocket.ReadyState.Open:
                this.logError(`Websocket opened error: ${errorType}`);
                // should we do anything here?
                break;
            case ZenithWebsocket.ReadyState.Closing:
                this.logError(`Websocket closing error: ${errorType}, State: ${this._stateEngine.activeWaitId}`);
                this._stateEngine.adviseSocketClosingError();
                break;
            case ZenithWebsocket.ReadyState.Closed:
                this.logError(`Websocket closed error: ${errorType}`);
                this._stateEngine.adviseSocketClosedError();
                break;
            default:
                this.logError(`Unknown websocket error: ${errorType}`);
                this._stateEngine.adviseSocketClosedError();
        }
    }

    private handleRequestEngineSubscriptionErrorEvent(typeId: AdiPublisherSubscription.ErrorTypeId) {
        switch (typeId) {
            case AdiPublisherSubscription.ErrorTypeId.Internal:
                this._internalSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.InvalidRequest:
                this._invalidRequestSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.RequestTimeout:
                this._requestTimeoutSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.Offlined:
                this._offlinedSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.PublishRequestError:
                this._publishRequestErrorSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.SubscriptionWarning:
                this._subscriptionWarningCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.DataError:
                this._dataErrorSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.UserNotAuthorised:
                this._userNotAuthorisedSubscriptionErrorCount++;
                break;
            case AdiPublisherSubscription.ErrorTypeId.SubscriptionError:
                this._subscriptionErrorCount++;
                break;
            default:
                throw new UnreachableCaseError('ZFSHRESEEU11185492', typeId);
        }
    }

    private handleRequestEngineServerWarningEvent() {
        this._serverWarningSubscriptionErrorCount++;
    }

    private handleRequestEngineSendPhysicalMessageEvent(message: string) {
        this._websocket.send(message);
        this._sendPacketCount++;
        return ZenithPublisher.defaultResponseTimeoutSpan; // Needs improving - use ZenithQueryConfigure
    }

    private handleRequestEngineAuthMessageReceivedEvent(message: ZenithProtocol.MessageContainer) {
        this.processZenithAuthMessageReceived(message);
    }

    private handleCounterInterval() {
        const dataMessage = this.createCounterDataMessage();
        this._dataMessages.add(dataMessage);
    }

    private log(levelId: Logger.LevelId, text: string) {
        // const dataMessage = this.createLogDataMessage(new Date(), levelId, text);
        // this._dataMessages.add(dataMessage);
        const loggerText = `Zenith Publisher: ${text}`;
        window.motifLogger.log(levelId, loggerText);
    }

    private logInfo(text: string) {
        this.log(Logger.LevelId.Info, text);
    }

    private logWarning(text: string, loggerAsWell = true) {
        this.log(Logger.LevelId.Warning, text);
    }

    private logError(text: string, loggerAsWell = true) {
        this.log(Logger.LevelId.Error, text);
    }

    private checkClearReconnectDelayTimeout() {
        if (this._reconnectDelayTimeoutHandle !== undefined) {
            clearTimeout(this._reconnectDelayTimeoutHandle);
            // will either be immediately set again or never used again so no need to undefine.
        }
    }

    private processZenithAuthMessageReceived(msg: ZenithProtocol.MessageContainer) {
        const transactionId = msg.TransactionID;
        if (transactionId === this._websocket.lastAuthTransactionId) {
            // only process if there had not been any subsequent auth requests sent.
            const waitId = this._websocket.lastAuthWaitId;
            if (waitId === this._stateEngine.activeWaitId) {
                const stateId = this._stateEngine.stateId;
                if (stateId === ZenithPublisherStateId.AuthFetch || stateId === ZenithPublisherStateId.AuthUpdate) {
                    if (this._stateEngine.accessTokenUpdated) {
                        this.fetchOrUpdateAuth(waitId); // Token updated - need to fetch again
                    } else {
                        this.processAuthFetchMessageReceived(msg);
                    }
                }
            }
        }
    }

    private fetchOrUpdateAuth(waitId: Integer) {
        const accessToken = this._stateEngine.getUpdatedAccessToken();
        if (accessToken === ZenithConnectionStateEngine.invalidAccessToken) {
            throw new AssertInternalError('ZPFZAIA24509');
        } else {
            const transactionId = this._requestEngine.getNextTransactionId();
            const provider = ZenithProtocol.AuthController.Provider.Bearer;
            const msgContainer = this._authTokenMessageConvert.createMessage(transactionId, provider, accessToken);
            const msg = JSON.stringify(msgContainer);
            this.logInfo('Fetching Zenith Auth');
            this._websocket.sendAuth(msg, transactionId, waitId);
        }
    }

    private processAuthFetchMessageReceived(msg: ZenithProtocol.MessageContainer) {
        let identify: ZenithProtocol.AuthController.Identify | undefined;
        switch (msg.Topic as ZenithProtocol.AuthController.TopicName) {
            case ZenithProtocol.AuthController.TopicName.AuthToken:
                identify = this._authTokenMessageConvert.parseMessage(msg as ZenithProtocol.AuthController.AuthToken.PublishPayloadMessageContainer);
                break;
            default:
                this.logError('Unexpected Zenith Auth Fetch response topic: "' + msg.Topic + '". Stopping');
                this._stateEngine.adviseAuthFetchFailure(false);
        }

        if (identify === undefined) {
            this.logError('Zenith Auth Fetch response missing data. Stopping');
            this._stateEngine.adviseAuthFetchFailure(false);
        } else {
            if (identify.Result === ZenithProtocol.AuthController.IdentifyResult.Rejected) {
                this.logError('Zenith Auth Fetch rejected.');
                this._stateEngine.adviseAuthFetchFailure(true);
            } else {
                let infoText = '';
                if (identify.UserID !== undefined) {
                    if (infoText !== '') {
                        infoText += '; ';
                    }
                    infoText += `UserId: ${identify.UserID}`;
                }
                if (identify.DisplayName !== undefined) {
                    if (infoText !== '') {
                        infoText += '; ';
                    }
                    infoText += `Name: ${identify.DisplayName}`;
                }
                if (identify.ExpiresIn !== undefined) {
                    if (infoText !== '') {
                        infoText += '; ';
                    }
                    infoText += `Expires In: ${identify.ExpiresIn}`;
                }
                if (identify.ExpiryDate !== undefined) {
                    if (infoText !== '') {
                        infoText += '; ';
                    }
                    infoText += `Expires In: ${identify.ExpiryDate}`;
                }
                this.logInfo(`Zenith Session Details: ${infoText}`);

                if (identify.Scope === undefined) {
                    this.logWarning('Zenith Session Scope: not supplied');
                } else {
                    this.logInfo(`Zenith Session Scope: ${identify.Scope.join(',')}`);
                }

                if (identify.AccessToken === undefined) {
                    this.logError('Zenith Auth Fetch response missing access token. Stopping');
                    this._stateEngine.adviseAuthFetchFailure(false);
                } else {
                    const expiresInSpan = this.calculateZenithTokenExpiresInSpan(identify.ExpiresIn);
                    const expiryTime = this.calculateZenithTokenExpiryTime(expiresInSpan);
                    this._stateEngine.adviseAuthFetchSuccess(expiryTime);
                }
            }
        }
    }

    private calculateZenithTokenExpiresInSpan(identifyExpiresIn: string | undefined) {
        let result: SysTick.Span;
        if (identifyExpiresIn === undefined) {
            this.logWarning(`Zenith Auth Fetch response missing ExpiresIn. Setting to minimum ` +
                `${ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval}`);
            result = ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval;
        } else {
            const interval = this.parseZenithTokenExpiresInInterval(identifyExpiresIn);
            if (interval === undefined) {
                this.logWarning(`Setting token expiry interval to minimum ` +
                `${ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval}`);
                result = ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval;
            } else {
                result = interval;
            }
        }

        if (result < ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval) {
            this.logWarning(`Zenith Auth Fetch ExpiresIn (${result}) is less than minimum allowed. Setting to minimum ` +
                `${ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval}`);
            result = ZenithPublisher.minimumAllowedZenithTokenExpiresInInterval;
        }
        return result;
    }

    private calculateZenithTokenExpiryTime(expiresInSpan: SysTick.Span) {
        return SysTick.now() + expiresInSpan;
    }

    private parseZenithTokenExpiresInInterval(expiresIn: string) {
        const durationRegEx = /^-?([0-9]{2}):([0-9]{2}):([0-9]{2})\.[0-9]+$/;
        const elements = durationRegEx.exec(expiresIn);
        if (!elements) {
            this.logWarning(`ExpiresIn string cannot be parsed: "${expiresIn}" . [ID:158021124001]`);
            return undefined;
        } else {
            if (expiresIn.startsWith('-')) {
                // The expires in time is negative.
                return 0;
            }
            const [ ignored, hoursStr, minutesStr, secondsStr ] = elements;
            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);
            const seconds = parseInt(secondsStr, 10);
            const milliseconds = hours * mSecsPerHour + minutes * mSecsPerMin + seconds * mSecsPerSec;
            if (isNaN(milliseconds)) {
                this.logWarning(`ExpiresIn string cannot be parsed: "${expiresIn}" . [ID:158021124002]`);
                return undefined;
            } else {
                return milliseconds;
            }
        }
    }

    private openSocket(waitId: Integer) {
        const zenithEndpoint = this._stateEngine.selectZenithEndpoint();
        const dataMessage = this.createZenithEndpointSelectedDataMessage(zenithEndpoint);
        this._dataMessages.add(dataMessage);
        this.logInfo('Opening WebSocket: ' + zenithEndpoint);
        this._websocket.open(zenithEndpoint, waitId);
    }

    private closeSocket() {
        let reason: string;
        if (this._stateEngine.finalising) {
            reason = 'NoReconnect';
        } else {
            const reconnectReasonId = this._stateEngine.reconnectReasonId;
            if (reconnectReasonId === undefined) {
                reason = 'Unknown'; // should never happen
            } else {
                reason = `Reconnect_${reconnectReasonId}`;
            }
        }
        this._websocket.close(ZenithProtocol.WebSocket.CloseCode.Normal, reason);
    }

    private delayReconnect(waitId: Integer) {
        const span = this.calculateReconnectDelaySpan();
        this.checkClearReconnectDelayTimeout();
        this._reconnectDelayTimeoutHandle = setTimeout(() => { this.processReconnectDelayCompleted(waitId); }, span);
    }

    private calculateReconnectDelaySpan(): SysTick.Span {
        const authFetchSuccessiveFailureCount = this._stateEngine.authFetchSuccessiveFailureCount;
        if (authFetchSuccessiveFailureCount > 0) {
            switch (authFetchSuccessiveFailureCount) {
                case 1: return 500;
                case 2: return 3000;
                case 3: return 6000;
                default: return 20000;
            }
        } else {
            const socketConnectingPlusShortLivedErrorCount = this._stateEngine.socketConnectingSuccessiveErrorCount + this._stateEngine.socketShortLivedClosedSuccessiveErrorCount;
            if (socketConnectingPlusShortLivedErrorCount > 0) {
                switch (socketConnectingPlusShortLivedErrorCount) {
                    case 1: return 50;
                    case 2: return 2000;
                    case 3: return 2000;
                    case 4: return 2000;
                    case 5: return 2000;
                    case 6: return 10000;
                    case 7: return 10000;
                    case 8: return 10000;
                    default: return 15000;
                }
            } else {
                const zenithTokenFetchSuccessiveFailureCount = this._stateEngine.zenithTokenFetchSuccessiveFailureCount;
                if (zenithTokenFetchSuccessiveFailureCount > 0) {
                    switch (zenithTokenFetchSuccessiveFailureCount) {
                        case 1: return 3000;
                        case 2: return 3000;
                        case 3: return 6000;
                        default: return 20000;
                    }
                } else {
                    return 8000;
                }
            }
        }
    }

    private processReconnectDelayCompleted(waitId: Integer) {
        if (waitId === this._stateEngine.activeWaitId) {
            this._stateEngine.adviseReconnectDelayCompleted();
        }
    }

    private generateOfflinedErrorText(socketCloseCode: number, socketCloseReason: string) {
        const codeId = WebsocketCloseCode.tryCodeToId(socketCloseCode);
        let message: string;
        if (codeId !== undefined) {
            message = `${WebsocketCloseCode.idToDisplay(codeId)} (${socketCloseCode.toString()})`;
        } else {
            message = socketCloseCode.toString();
        }

        if (socketCloseReason.length !== 0) {
            message += `, ${socketCloseReason}`;
        }
        return message;
    }

    private createSynchronisedDataMessage() {
        return new SynchronisedPublisherSubscriptionDataMessage(this._connectionDataItemId,
            this._connectionDataItemRequestNr, false);
    }

    private createOnlineChangeDataMessage(online: boolean, socketCloseCode: number, socketCloseReason: string,
        socketCloseWasClean: boolean
    ) {
        const dataMessage = new ZenithPublisherOnlineChangeDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;
        dataMessage.online = online;
        dataMessage.socketCloseCode = socketCloseCode;
        dataMessage.socketCloseReason = socketCloseReason;
        dataMessage.socketCloseWasClean = socketCloseWasClean;
        return dataMessage;
    }

    private createStateChangeDataMessage(stateId: ZenithPublisherStateId, waitId: Integer) {
        const dataMessage = new ZenithPublisherStateChangeDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;
        dataMessage.stateId = stateId;
        dataMessage.waitId = waitId;
        return dataMessage;
    }

    private createReconnectDataMessage(reconnectReasonId: ZenithPublisherReconnectReasonId) {
        const dataMessage = new ZenithReconnectDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;
        dataMessage.reconnectReasonId = reconnectReasonId;
        return dataMessage;
    }

    private createZenithEndpointSelectedDataMessage(endpoint: string) {
        const dataMessage = new ZenithEndpointSelectedDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;
        dataMessage.endpoint = endpoint;
        return dataMessage;
    }

    private createLogDataMessage(time: Date, levelId: Logger.LevelId, text: string) {
        const dataMessage = new ZenithLogDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;
        dataMessage.time = newNowDate();
        dataMessage.levelId = levelId;
        dataMessage.text = text;
        return dataMessage;
    }

    private createCounterDataMessage() {
        const dataMessage = new ZenithCounterDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;

        dataMessage.authExpiryTime = this._stateEngine.authExpiryTime;
        dataMessage.authFetchSuccessiveFailureCount = this._stateEngine.authFetchSuccessiveFailureCount;
        dataMessage.socketConnectingSuccessiveErrorCount = this._stateEngine.socketConnectingSuccessiveErrorCount;
        dataMessage.zenithTokenFetchSuccessiveFailureCount = this._stateEngine.zenithTokenFetchSuccessiveFailureCount;
        dataMessage.zenithTokenRefreshSuccessiveFailureCount = this._stateEngine.zenithTokenRefreshSuccessiveFailureCount;
        dataMessage.socketClosingSuccessiveErrorCount = this._stateEngine.socketClosingSuccessiveErrorCount;
        dataMessage.socketShortLivedClosedSuccessiveErrorCount = this._stateEngine.socketShortLivedClosedSuccessiveErrorCount;
        dataMessage.unexpectedSocketCloseCount = this._stateEngine.unexpectedSocketCloseCount;
        dataMessage.timeoutCount = this._stateEngine.timeoutCount;
        dataMessage.lastTimeoutStateId = this._stateEngine.lastTimeoutStateId;
        dataMessage.receivePacketCount = this._receivePacketCount;
        dataMessage.sendPacketCount = this._sendPacketCount;
        dataMessage.internalSubscriptionErrorCount = this._internalSubscriptionErrorCount;
        dataMessage.invalidRequestSubscriptionErrorCount = this._invalidRequestSubscriptionErrorCount;
        dataMessage.requestTimeoutSubscriptionErrorCount = this._requestTimeoutSubscriptionErrorCount;
        dataMessage.offlinedSubscriptionErrorCount = this._offlinedSubscriptionErrorCount;
        dataMessage.publishRequestErrorSubscriptionErrorCount = this._publishRequestErrorSubscriptionErrorCount;
        dataMessage.subscriptionErrorCount = this._subscriptionErrorCount;
        dataMessage.subscriptionWarningCount = this._subscriptionWarningCount;
        dataMessage.dataErrorSubscriptionErrorCount = this._dataErrorSubscriptionErrorCount;
        dataMessage.userNotAuthorisedSubscriptionErrorCount = this._userNotAuthorisedSubscriptionErrorCount;
        dataMessage.serverWarningSubscriptionErrorCount = this._serverWarningSubscriptionErrorCount;
        return dataMessage;
    }

    private createSessionTerminatedDataMessage(code: number, reason: string) {
        const dataMessage = new ZenithSessionTerminatedDataMessage();
        dataMessage.dataItemId = this._connectionDataItemId;
        dataMessage.dataItemRequestNr = this._connectionDataItemRequestNr;
        dataMessage.reasonCode = code;
        dataMessage.defaultReasonText = reason;
        let reasonId: PublisherSessionTerminatedReasonId;
        switch (code as ZenithWebSocketCloseCode) {
            case ZenithWebSocketCloseCode.KickedOff:
                reasonId = PublisherSessionTerminatedReasonId.KickedOff;
                break;
            default:
                reasonId = PublisherSessionTerminatedReasonId.Other;
        }
        dataMessage.reasonId = reasonId;
        return dataMessage;
    }
}

export namespace ZenithPublisher {
    export const minimumAllowedZenithTokenExpiresInInterval = 3 * mSecsPerMin;
    export const minimumAllowedZenithTokenRefreshInterval = 1 * mSecsPerMin;
    export const counterDataMessageInterval = 1 * mSecsPerSec;

    // Needs improving - use ZenithQueryConfigure
    export const defaultResponseTimeoutSpan = 2 * mSecsPerMin;
}
