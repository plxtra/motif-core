import { EnumInfoOutOfOrderError, Integer } from '@pbkware/js-utils';
import { StringId } from '../res/i18n-strings';

/** @public */
export class UserAlertService {
    enabled = true;

    alertQueueChangedEvent: UserAlertService.AlertQueueChangedEvent | undefined;

    private _queuedAlerts: UserAlertService.Alert[] = [];

    getVisibleAlerts() {
        const visibleAlerts = this._queuedAlerts.slice().filter((alert) => alert.visible);
        return visibleAlerts;
    }

    queueAlert(typeId: UserAlertService.Alert.Type.Id, text: string) {
        if (this.enabled) {
            const alert = new UserAlertService.Alert(typeId, text);
            this._queuedAlerts.push(alert);
            this.notifyAlertQueueChanged();
            return alert;
        } else {
            return undefined;
        }
    }

    clearAlert(alert: UserAlertService.Alert) {
        const id = alert.id;
        const index = this._queuedAlerts.findIndex((queuedAlert) => queuedAlert.id === id);
        if (index >= 0) {
            this._queuedAlerts.splice(index, 1);
            this.notifyAlertQueueChanged();
        }
    }

    private notifyAlertQueueChanged() {
        if (this.alertQueueChangedEvent !== undefined) {
            this.alertQueueChangedEvent();
        }
    }
}

/** @public */
export namespace UserAlertService {
    export type AlertQueueChangedEvent = (this: void) => void;

    export class Alert {
        readonly id: Integer;
        readonly time: Date;
        private _visible = true;

        constructor(public readonly typeId: UserAlertService.Alert.Type.Id, public readonly text: string) {
            this.id = Alert.nextId++;
            this.time = new Date(Date.now());
        }

        get visible() { return this._visible; }

        hide() {
            this._visible = false;
        }
    }

    export namespace Alert {
        // eslint-disable-next-line prefer-const
        export let nextId = 1;

        export namespace Type {
            export const enum Id {
                Exception,
                UnhandledError,
                NewSessionRequired,
                AttemptingSessionRenewal,
                SettingChanged,
                ResetLayout,
                DataSavingBeforeLeave,
                CanLeave,
            }

            interface Info {
                readonly id: Id;
                readonly name: string;
                readonly error: boolean;
                readonly cancellable: boolean;
                readonly restartable: boolean;
                readonly restartReasonStringId: StringId | undefined;
            }

            type InfosObject = { [id in keyof typeof Id]: Info };

            const infosObject: InfosObject = {
                Exception: {
                    id: Id.Exception,
                    name: 'Exception',
                    error: true,
                    cancellable: false,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_RestartReason_Unstable,
                },
                UnhandledError: {
                    id: Id.UnhandledError,
                    name: 'UnhandledError',
                    error: true,
                    cancellable: false,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_RestartReason_Unstable,
                },
                NewSessionRequired: {
                    id: Id.NewSessionRequired,
                    name: 'NewSessionRequired',
                    error: true,
                    cancellable: false,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_RestartReason_NewSessionRequired,
                },
                AttemptingSessionRenewal: {
                    id: Id.AttemptingSessionRenewal,
                    name: 'AttemptingSessionRenewal',
                    error: true,
                    cancellable: true,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_RestartReason_AttemptingSessionRenewal,
                },
                SettingChanged: {
                    id: Id.SettingChanged,
                    name: 'SettingChanged',
                    error: false,
                    cancellable: true,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_RestartReason_UserAction,
                },
                ResetLayout: {
                    id: Id.ResetLayout,
                    name: 'ResetLayout',
                    error: false,
                    cancellable: true,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_RestartReason_UserAction,
                },
                DataSavingBeforeLeave: {
                    id: Id.DataSavingBeforeLeave,
                    name: 'DataSavingBeforeLeave',
                    error: false,
                    cancellable: false,
                    restartable: false,
                    restartReasonStringId: StringId.UserAlert_PleaseWaitSavingChanges,
                },
                CanLeave: {
                    id: Id.CanLeave,
                    name: 'CanLeave',
                    error: false,
                    cancellable: false,
                    restartable: true,
                    restartReasonStringId: StringId.UserAlert_ChangesSavedOkToLeaveOrRestorePage,
                },
            } as const;

            const idCount = Object.keys(infosObject).length;
            const infos = Object.values(infosObject);

            export function initialise() {
                for (let id = 0; id < idCount; id++) {
                    if (infos[id].id !== id as Id) {
                        throw new EnumInfoOutOfOrderError('UserAlertService.Alert.Type.Id', id, infos[id].name);
                    }
                }
            }

            export function idIsCancellable(id: Id) {
                return infos[id].cancellable;
            }

            export function idIsRestartable(id: Id) {
                return infos[id].restartable;
            }

            export function idIsError(id: Id) {
                return infos[id].error;
            }

            export function idToRestartReasonStringId(id: Id) {
                return infos[id].restartReasonStringId;
            }
        }
    }
}

/** @internal */
export namespace UserAlertServiceModule {
    export function initialiseStatic() {
        UserAlertService.Alert.Type.initialise();
    }
}
