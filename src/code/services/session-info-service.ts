import { ExchangeEnvironment, MarketIvemId, PublisherSessionTerminatedReasonId } from '../adi/internal-api';
import { IndexSignatureHack, Integer, MultiEvent } from '../sys/internal-api';
import { SessionStateId } from './session-state';

/** @public */
export class SessionInfoService {
    private _stateId: SessionStateId;
    private _publisherSessionTerminated: boolean;

    private _serviceName: string;
    private _serviceDescription: string | undefined;
    private _serviceOperator: string;
    private _userId: string;
    private _username: string;
    private _userFullName: string;
    private _userAccessTokenExpiryTime: number | undefined;
    private _zenithEndpoints: readonly string[];

    private _defaultLayout: SessionInfoService.DefaultLayout;

    private _stateChangedMultiEvent = new MultiEvent<SessionInfoService.StateChangedEventHandler>();
    private _publisherSessionTerminatedChangedMultiEvent = new MultiEvent<SessionInfoService.PublisherSessionTerminatedChangedEventHandler>();
    private _userAccessTokenExpiryTimeChangedMultiEvent = new MultiEvent<SessionInfoService.UserAccessTokenExpiryTimeChangedEventHandler>();

    // _bannerOverrideDataEnvironmentId is a hack used if you want banner to display a different Data EnvironmentId
    private _bannerOverrideExchangeEnvironment: ExchangeEnvironment | undefined;

    private _diagnostics: SessionInfoService.Diagnostics;

    get stateId() { return this._stateId; }
    set stateId(value: SessionStateId) {
        this._stateId = value;
        this.notifyStateChanged();
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get publisherSessionTerminated() { return this._publisherSessionTerminated; }

    get serviceName() { return this._serviceName; }
    set serviceName(value: string) { this._serviceName = value; }
    get serviceDescription() { return this._serviceDescription; }
    set serviceDescription(value: string | undefined) { this._serviceDescription = value; }
    get serviceOperator() { return this._serviceOperator; }
    set serviceOperator(value: string) { this._serviceOperator = value; }
    get userId() { return this._userId; }
    set userId(value: string) { this._userId = value; }
    get username() { return this._username; }
    set username(value: string) { this._username = value; }
    get userFullName() { return this._userFullName; }
    set userFullName(value: string) { this._userFullName = value; }
    get userAccessTokenExpiryTime() { return this._userAccessTokenExpiryTime; }
    set userAccessTokenExpiryTime(value: number | undefined) {
        this._userAccessTokenExpiryTime = value;
        this.notifyUserAccessTokenExpiryTimeChanged();
    }
    get zenithEndpoints() { return this._zenithEndpoints; }
    set zenithEndpoints(value: readonly string[]) { this._zenithEndpoints = value; }

    get bannerOverrideExchangeEnvironment() { return this._bannerOverrideExchangeEnvironment; }
    set bannerOverrideExchangeEnvironment(value: ExchangeEnvironment | undefined) { this._bannerOverrideExchangeEnvironment = value; }

    get defaultLayout() { return this._defaultLayout; }
    set defaultLayout(value: SessionInfoService.DefaultLayout) { this._defaultLayout = value; }

    get diagnostics() { return this._diagnostics; }

    setDiagnostics(
        fullDepthDebugLoggingEnabled: boolean,
        fullDepthConsistencyCheckingEnabled: boolean,
    ) {
        this._diagnostics = {
            fullDepthDebugLoggingEnabled,
            fullDepthConsistencyCheckingEnabled,
        };
    }

    setPublisherSessionTerminated(
        value: boolean,
        reasonId: PublisherSessionTerminatedReasonId,
        reasonCode: Integer,
        defaultReasonText: string
    ) {
        this._publisherSessionTerminated = value;
        this.notifyPublisherSessionTerminatedChanged(reasonId, reasonCode, defaultReasonText);
    }

    subscribeStateChangedEvent(handler: SessionInfoService.StateChangedEventHandler) {
        return this._stateChangedMultiEvent.subscribe(handler);
    }

    unsubscribeStateChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._stateChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribePublisherSessionTerminatedChangedEvent(handler: SessionInfoService.PublisherSessionTerminatedChangedEventHandler) {
        return this._publisherSessionTerminatedChangedMultiEvent.subscribe(handler);
    }

    unsubscribePublisherSessionTerminatedChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._publisherSessionTerminatedChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeUserAccessTokenExpiryTimeChangedEvent(handler: SessionInfoService.UserAccessTokenExpiryTimeChangedEventHandler) {
        return this._userAccessTokenExpiryTimeChangedMultiEvent.subscribe(handler);
    }

    unsubscribeUserAccessTokenExpiryTimeChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._userAccessTokenExpiryTimeChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyStateChanged() {
        const handlers = this._stateChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private notifyPublisherSessionTerminatedChanged(
        reasonId: PublisherSessionTerminatedReasonId,
        reasonCode: Integer,
        defaultReasonText: string
    ) {
        const handlers = this._publisherSessionTerminatedChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler(reasonId, reasonCode, defaultReasonText);
        }
    }

    private notifyUserAccessTokenExpiryTimeChanged() {
        const handlers = this._userAccessTokenExpiryTimeChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }
}

/** @public */
export namespace SessionInfoService {
    export type StateChangedEventHandler = (this: void) => void;
    export type PublisherSessionTerminatedChangedEventHandler = (
        this: void,
        reasonId: PublisherSessionTerminatedReasonId,
        reasonCode: Integer,
        defaultReasonText: string
    ) => void;
    export type UserAccessTokenExpiryTimeChangedEventHandler = (this: void) => void;

    export interface DefaultLayout {
        readonly internalName: string | undefined;
        readonly instanceName: string | undefined;
        readonly linkedSymbolJson: IndexSignatureHack<MarketIvemId.Json> | undefined;
        readonly watchlistJson: IndexSignatureHack<MarketIvemId.Json>[] | undefined;
    }

    export interface Diagnostics {
        readonly fullDepthDebugLoggingEnabled: boolean;
        readonly fullDepthConsistencyCheckingEnabled: boolean;
    }
}
