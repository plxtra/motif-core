import {
    Err,
    Logger,
    MultiEvent,
    Ok,
    Result,
    getErrorMessage
} from '@xilytix/sysutils';
import { StringId, Strings } from '../res/internal-api';

export class MotifServicesService {
    private _baseUrl: string;
    private _getAuthorizationHeaderValue: MotifServicesService.GetAuthorizationHeaderValueCallback;

    private _applicationFlavour = MotifServicesService.defaultApplicationFlavour;
    // private _applicationUserEnvironment = MotifServicesService.defaultApplicationUserEnvironment;

    private _logEvent = new MultiEvent<MotifServicesService.LogEvent>();

    // eslint-disable-next-line max-len
    initialise(
        endpointBaseUrl: string,
        getAuthorizationHeaderValueCallback: MotifServicesService.GetAuthorizationHeaderValueCallback
    ) {
        this._baseUrl = endpointBaseUrl;
        this._getAuthorizationHeaderValue = getAuthorizationHeaderValueCallback;
    }

    // setApplicationUserEnvironment(applicationUserEnvironmentId: MotifServicesService.ApplicationUserEnvironment.Id) {
    //     this._applicationUserEnvironment = MotifServicesService.ApplicationUserEnvironment.idToValue(applicationUserEnvironmentId);
    // }

    subscribeLogEvent(handler: MotifServicesService.LogEvent) {
        return this._logEvent.subscribe(handler);
    }

    unsubscribeLogEvent(subscriptionId: MultiEvent.DefinedSubscriptionId) {
        this._logEvent.unsubscribe(subscriptionId);
    }

    async getUserSetting(
        key: string,
        keyFolderPath: string,
        // serviceOperator: string | undefined,
        // overrideApplicationEnvironment?: string
    ): Promise<Result<string | undefined>> {
        const endpointPath = MotifServicesService.EndpointPath.getUserSetting;
        const credentials = 'include';
        const method = 'POST';
        const headers = new Headers({
            Authorization: this._getAuthorizationHeaderValue(),
            'Content-Type': 'application/json'
        });

        const request: MotifServicesService.GetRequestPayload = {
            applicationFlavour: this._applicationFlavour,
            // applicationEnvironment: this.generateApplicationEnvironment(serviceOperator, overrideApplicationEnvironment),
            applicationEnvironment: keyFolderPath,
            key,
        };
        const body = JSON.stringify(request);

        const url = new URL(endpointPath, this._baseUrl);
        let response: Response;
        try {
            response = await fetch(url.href, { credentials, headers, method, body });
        } catch (reason) {
            const errorText = getErrorMessage(reason);
            return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesFetchError]}: ${errorText}`);
        }

        switch (response.status) {
            case 200:
                try {
                    const payloadText = await response.text();
                    return new Ok(payloadText);
                } catch (reason) {
                    const errorText = getErrorMessage(reason);
                    return new Err(`${Strings[StringId.MotifServicesFetchTextError]}: ${errorText}`);
                }
            case 404:
                return new Ok(undefined);
            default:
                return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesResponseStatusError]}: ${response.status}: ${response.statusText}`);
        }
    }

    async setUserSetting(
        key: string,
        value: string,
        keyFolderPath: string,
        // serviceOperator: string | undefined,
        // overrideApplicationEnvironment?: string
    ): Promise<Result<void>> {
        const endpointPath = MotifServicesService.EndpointPath.setUserSetting;
        const credentials = 'include';
        const method = 'POST';
        const headers = new Headers([
            ['Authorization', this._getAuthorizationHeaderValue()],
            ['Content-Type', 'application/json'],
        ]);

        const request: MotifServicesService.SetRequestPayload = {
            applicationFlavour: this._applicationFlavour,
            // applicationEnvironment: this.generateApplicationEnvironment(serviceOperator, overrideApplicationEnvironment),
            applicationEnvironment: keyFolderPath,
            key,
            value,
        };
        const body = JSON.stringify(request);

        const url = new URL(endpointPath, this._baseUrl);
        try {
            const response = await fetch(url.href, { credentials, headers, method, body });
            if (response.status === 204) {
                return new Ok(undefined);
            } else {
                return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesResponseStatusError]}: ${response.status}: ${response.statusText}`);
            }
        } catch (reason) {
            const errorText = getErrorMessage(reason);
            return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesFetchError]}: ${errorText}`);
        }
    }

    async deleteUserSetting(key: string, /*serviceOperator: string | undefined,*/ keyFolderPath: string): Promise<Result<void>> {
        const endpointPath = MotifServicesService.EndpointPath.deleteUserSetting;
        const credentials = 'include';
        const method = 'POST';
        const headers = new Headers([
            ['Authorization', this._getAuthorizationHeaderValue()],
            ['Content-Type', 'application/json'],
        ]);

        const requestJson: MotifServicesService.DeleteRequestPayload = {
            applicationFlavour: this._applicationFlavour,
            // applicationEnvironment: this.generateApplicationEnvironment(serviceOperator, undefined),
            applicationEnvironment: keyFolderPath,
            key,
        };
        const body = JSON.stringify(requestJson);

        const url = new URL(endpointPath, this._baseUrl);
        try {
            const response = await fetch(url.href, { credentials, headers, method, body });
            if (response.status === 204) {
                return new Ok(undefined);
            } else {
                return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesResponseStatusError]}: ${response.status}: ${response.statusText}`);
            }
        } catch (reason) {
            const errorText = getErrorMessage(reason);
            const result = new Err(`${endpointPath}: ${Strings[StringId.MotifServicesFetchError]}: ${errorText}`);
            return Promise.resolve(result);
        }
    }

    async getKeysBeginningWith(
        searchKey: string,
        keyFolderPath: string,
        // serviceOperator: string | undefined,
        // overrideApplicationEnvironment?: string
    ): Promise<Result<string | undefined>> {
        const endpointPath = MotifServicesService.EndpointPath.getKeysBeginningWith;
        const credentials = 'include';
        const method = 'POST';
        const headers = new Headers({
            Authorization: this._getAuthorizationHeaderValue(),
            'Content-Type': 'application/json'
        });

        const request: MotifServicesService.SearchKeyRequestPayload = {
            ApplicationFlavour: this._applicationFlavour,
            // ApplicationEnvironment: this.generateApplicationEnvironment(serviceOperator, overrideApplicationEnvironment),
            ApplicationEnvironment: keyFolderPath,
            SearchKey: searchKey,
        };
        const body = JSON.stringify(request);

        const url = new URL(endpointPath, this._baseUrl);
        let response: Response;
        try {
            response = await fetch(url.href, { credentials, headers, method, body });
        } catch (reason) {
            const errorText = getErrorMessage(reason);
            return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesFetchError]}: ${errorText}`);
        }

        switch (response.status) {
            case 200:
                try {
                    const payloadText = await response.text();
                    return new Ok(payloadText);
                } catch (reason) {
                    const errorText = getErrorMessage(reason);
                    return new Err(`${Strings[StringId.MotifServicesFetchTextError]}: ${errorText}`);
                }
            case 404:
                return new Ok(undefined);
            default:
                return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesResponseStatusError]}: ${response.status}: ${response.statusText}`);
        }
    }

    async getKeysEndingWith(
        searchKey: string,
        keyFolderPath: string,
        // serviceOperator: string | undefined,
        // overrideApplicationEnvironment?: string
    ): Promise<Result<string | undefined>> {
        const endpointPath = MotifServicesService.EndpointPath.getKeysEndingWith;
        const credentials = 'include';
        const method = 'POST';
        const headers = new Headers({
            Authorization: this._getAuthorizationHeaderValue(),
            'Content-Type': 'application/json'
        });

        const request: MotifServicesService.SearchKeyRequestPayload = {
            ApplicationFlavour: this._applicationFlavour,
            // ApplicationEnvironment: this.generateApplicationEnvironment(serviceOperator, overrideApplicationEnvironment),
            ApplicationEnvironment: keyFolderPath,
            SearchKey: searchKey,
        };
        const body = JSON.stringify(request);

        const url = new URL(endpointPath, this._baseUrl);
        let response: Response;
        try {
            response = await fetch(url.href, { credentials, headers, method, body });
        } catch (reason) {
            const errorText = getErrorMessage(reason);
            return new Err(`${Strings[StringId.MotifServicesFetchError]}: ${errorText}`);
        }

        switch (response.status) {
            case 200:
                try {
                    const payloadText = await response.text();
                    return new Ok(payloadText);
                } catch (reason) {
                    const errorText = getErrorMessage(reason);
                    return new Err(`${Strings[StringId.MotifServicesFetchTextError]}: ${errorText}`);
                }
            case 404:
                return new Ok(undefined);
            default:
                return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesResponseStatusError]}: ${response.status}: ${response.statusText}`);
        }
    }

    async getKeysContaining(
        searchKey: string,
        keyFolderPath: string,
        // serviceOperator: string | undefined,
        // overrideApplicationEnvironment?: string
    ): Promise<Result<string | undefined>> {
        const endpointPath = MotifServicesService.EndpointPath.getKeysContaining;
        const credentials = 'include';
        const method = 'POST';
        const headers = new Headers({
            Authorization: this._getAuthorizationHeaderValue(),
            'Content-Type': 'application/json'
        });

        const request: MotifServicesService.SearchKeyRequestPayload = {
            ApplicationFlavour: this._applicationFlavour,
            // ApplicationEnvironment: this.generateApplicationEnvironment(serviceOperator, overrideApplicationEnvironment),
            ApplicationEnvironment: keyFolderPath,
            SearchKey: searchKey,
        };
        const body = JSON.stringify(request);

        const url = new URL(endpointPath, this._baseUrl);
        let response: Response;
        try {
            response = await fetch(url.href, { credentials, headers, method, body });
        } catch (reason) {
            const errorText = getErrorMessage(reason);
            return new Err(`${Strings[StringId.MotifServicesFetchError]}: ${errorText}`);
        }

        switch (response.status) {
            case 200:
                try {
                    const payloadText = await response.text();
                    return new Ok(payloadText);
                } catch (reason) {
                    const errorText = getErrorMessage(reason);
                    return new Err(`${Strings[StringId.MotifServicesFetchTextError]}: ${errorText}`);
                }
            case 404:
                return new Ok(undefined);
            default:
                return new Err(`${endpointPath}: ${Strings[StringId.MotifServicesResponseStatusError]}: ${response.status}: ${response.statusText}`);
        }
    }

    private notifyLog(time: Date, logLevelId: Logger.LevelId, text: string) {
        const handlers = this._logEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](time, logLevelId, text);
        }
    }

    private log(logLevelId: Logger.LevelId, text: string) {
        this.notifyLog(new Date(), logLevelId, text);
    }

    private logInfo(text: string) {
        this.log(Logger.LevelId.Info, text);
    }

    private logWarning(text: string) {
        this.log(Logger.LevelId.Warning, text);
    }

    private logError(text: string) {
        this.log(Logger.LevelId.Error, text);
    }

    // private generateApplicationEnvironment(serviceOperator: string | undefined, overrideApplicationEnvironment: string | undefined) {
    //     if (overrideApplicationEnvironment !== undefined) {
    //         return overrideApplicationEnvironment;
    //     } else {
    //         if (serviceOperator === undefined) {
    //             return this._applicationUserEnvironment;
    //         } else {
    //             return this._applicationUserEnvironment + '^' + serviceOperator;
    //         }
    //     }
    // }
}

export namespace MotifServicesService {
    export type GetAuthorizationHeaderValueCallback = (this: void) => string;
    export interface RequestPayload {
    }

    export interface KeyRequestPayload extends RequestPayload {
        applicationFlavour: string;
        applicationEnvironment: string;
        key: string;
    }

    export interface GetRequestPayload extends KeyRequestPayload {
    }

    export interface SetRequestPayload extends KeyRequestPayload {
        value: string;
    }

    export interface DeleteRequestPayload extends KeyRequestPayload {
    }

    export interface SearchKeyRequestPayload extends RequestPayload {
        ApplicationFlavour: string;
        ApplicationEnvironment: string;
        SearchKey: string;
    }

    export namespace EndpointPath {
        export const getUserSetting = '/api/configuration/GetUserSetting';
        export const setUserSetting = '/api/configuration/SetUserSetting';
        export const deleteUserSetting = '/api/configuration/DeleteUserSetting';
        export const getKeysBeginningWith = '/api/configuration/SearchForKey/BeginsWith';
        export const getKeysEndingWith = '/api/configuration/SearchForKey/EndsWith';
        export const getKeysContaining = '/api/configuration/SearchForKey/Contains';
    }

    export const defaultApplicationFlavour = 'motif';
    export const defaultApplicationUserEnvironment = 'default';
    export const masterApplicationEnvironment = 'master';

    export type LogEvent = (time: Date, logLevelId: Logger.LevelId, text: string) => void;

    // export namespace ApplicationUserEnvironment {
    //     export const enum Id {
    //         Default,
    //         DataEnvironment_Demo,
    //         DataEnvironment_DelayedProduction,
    //         DataEnvironment_Production,
    //         DataEnvironment_Sample,
    //         Test,
    //     }

    //     export const defaultId = Id.Default;

    //     interface Info {
    //         readonly id: Id;
    //         readonly value: string;
    //         readonly displayId: StringId;
    //         readonly titleId: StringId;
    //     }

    //     type InfosObject = { [id in keyof typeof Id]: Info };

    //     const infosObject: InfosObject = {
    //         Default: {
    //             id: Id.Default,
    //             value: 'default',
    //             displayId: StringId.ApplicationEnvironmentDisplay_Default,
    //             titleId: StringId.ApplicationEnvironmentTitle_Default,
    //         },
    //         DataEnvironment_Demo: {
    //             id: Id.DataEnvironment_Demo,
    //             value: 'exchangeEnvironment_Demo',
    //             displayId: StringId.ApplicationEnvironmentDisplay_DataEnvironment_Demo,
    //             titleId: StringId.ApplicationEnvironmentTitle_DataEnvironment_Demo,
    //         },
    //         DataEnvironment_DelayedProduction: {
    //             id: Id.DataEnvironment_DelayedProduction,
    //             value: 'exchangeEnvironment_Delayed',
    //             displayId: StringId.ApplicationEnvironmentDisplay_DataEnvironment_Delayed,
    //             titleId: StringId.ApplicationEnvironmentTitle_DataEnvironment_Delayed,
    //         },
    //         DataEnvironment_Production: {
    //             id: Id.DataEnvironment_Production,
    //             value: 'exchangeEnvironment_Production',
    //             displayId: StringId.ApplicationEnvironmentDisplay_DataEnvironment_Production,
    //             titleId: StringId.ApplicationEnvironmentTitle_DataEnvironment_Production,
    //         },
    //         DataEnvironment_Sample: {
    //             id: Id.DataEnvironment_Sample,
    //             value: 'exchangeEnvironment_Sample',
    //             displayId: StringId.ApplicationEnvironmentDisplay_DataEnvironment_Sample,
    //             titleId: StringId.ApplicationEnvironmentTitle_DataEnvironment_Sample,
    //         },
    //         Test: {
    //             id: Id.Test,
    //             value: 'test',
    //             displayId: StringId.ApplicationEnvironmentDisplay_Test,
    //             titleId: StringId.ApplicationEnvironmentTitle_Test,
    //         },
    //     } as const;

    //     export const idCount = Object.keys(infosObject).length;
    //     const infos = Object.values(infosObject);

    //     export function initialise() {
    //         const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as Id);
    //         if (outOfOrderIdx >= 0) {
    //             throw new EnumInfoOutOfOrderError('ApplicationEnvironment', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
    //         }
    //     }

    //     export function idToValue(id: Id) {
    //         return infos[id].value;
    //     }

    //     export function tryValueToId(value: string) {
    //         const foundInfo = infos.find((info) => info.value === value);
    //         return foundInfo?.id;
    //     }
    // }
}

// export namespace MotifServicesServiceModule {
//     export function initialiseStatic() {
//         MotifServicesService.ApplicationUserEnvironment.initialise();
//     }
// }
