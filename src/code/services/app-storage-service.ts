import { CommaText, Result, UnreachableCaseError } from '@pbkware/js-utils';
import { ExchangeEnvironmentZenithCode, MarketsService } from '../adi/internal-api';
import { KeyValueStore } from './key-value-store/key-value-store';
import { LocalStorageKeyValueStore } from './key-value-store/local-storage-key-value-store';
import { MotifServicesKeyValueStore } from './key-value-store/motif-services-key-value-store';
import { MotifServicesService } from './motif-services-service';

export class AppStorageService {
    private _keyValueStore: KeyValueStore;
    private _serviceOperator: string;
    private _operatorDefaultExchangeEnvironmentSpecific = false;
    private _test = false;

    constructor(private readonly _marketsService: MarketsService) {

    }

    initialise(
        storageTypeId: AppStorageService.TypeId,
        serviceOperator: string,
        motifServicesEndpointBaseUrl: string,
        motifServicesGetAuthorizationHeaderValueCallback: MotifServicesService.GetAuthorizationHeaderValueCallback
    ) {
        this._serviceOperator = serviceOperator;

        switch (storageTypeId) {
            case AppStorageService.TypeId.Local: {
                this._keyValueStore = new LocalStorageKeyValueStore();
                break;
            }
            case AppStorageService.TypeId.MotifServices: {
                const store = new MotifServicesKeyValueStore();
                store.initialise(motifServicesEndpointBaseUrl, motifServicesGetAuthorizationHeaderValueCallback);
                this._keyValueStore = store;
                break;
            }
            default:
                throw new UnreachableCaseError('ASSI444873', storageTypeId);
        }
    }

    setTargetParameters(operatorDefaultExchangeEnvironmentSpecific: boolean, test: boolean) {
        this._operatorDefaultExchangeEnvironmentSpecific = operatorDefaultExchangeEnvironmentSpecific;
        this._test = test;
    }

    getItem(key: KeyValueStore.Key | string, operatorItem: boolean): Promise<Result<string | undefined>> {
        const keyFolderPath = this.makeKeyFolderPath(operatorItem);
        return this._keyValueStore.getItem(key, keyFolderPath);
    }

    getSubNamedItem(key: KeyValueStore.Key | string, subName: string, operatorItem: boolean): Promise<Result<string | undefined>> {
        const keyFolderPath = this.makeKeyFolderPath(operatorItem);
        const stringKey = AppStorageService.makeSubNamedKey(key, subName);
        return this._keyValueStore.getItem(stringKey, keyFolderPath);
    }

    getMasterSettings() {
        return this._keyValueStore.getItem(KeyValueStore.Key.MasterSettings, AppStorageService.masterKeyFolderPath);
    }

    setItem(key: KeyValueStore.Key | string, value: string, operatorItem: boolean): Promise<Result<void>> {
        const keyFolderPath = this.makeKeyFolderPath(operatorItem);
        return this._keyValueStore.setItem(key, value, keyFolderPath);
    }

    setSubNamedItem(
        key: KeyValueStore.Key | string,
        subName: string,
        value: string,
        operatorItem: boolean
    ): Promise<Result<void>> {
        const keyFolderPath = this.makeKeyFolderPath(operatorItem);
        const stringKey = AppStorageService.makeSubNamedKey(key, subName);
        return this._keyValueStore.setItem(stringKey, value, keyFolderPath);
    }

    setMasterSettings(value: string) {
        return this._keyValueStore.setItem(KeyValueStore.Key.MasterSettings, value, AppStorageService.masterKeyFolderPath);
    }

    removeItem(key: KeyValueStore.Key | string, operatorItem: boolean): Promise<Result<void>> {
        const keyFolderPath = this.makeKeyFolderPath(operatorItem);
        return this._keyValueStore.removeItem(key, keyFolderPath);
    }

    removeSubNamedItem(key: KeyValueStore.Key | string, subName: string, operatorItem: boolean): Promise<Result<void>> {
        const keyFolderPath = this.makeKeyFolderPath(operatorItem);
        const stringKey = AppStorageService.makeSubNamedKey(key, subName);
        return this._keyValueStore.removeItem(stringKey, keyFolderPath);
    }

    private makeKeyFolderPath(operatorItem: boolean): string {
        let result: string;
        if (!operatorItem) {
            result = AppStorageService.userKeyFolderPath;
        } else {
            if (!this._operatorDefaultExchangeEnvironmentSpecific) {
                result = `${AppStorageService.operatorAllExchangeEnvironmentsKeyFolderPathRoot}/${this._serviceOperator}`
            } else {
                const defaultDataEnvironment = this._marketsService.defaultExchangeEnvironment;
                const stringValue = ExchangeEnvironmentZenithCode.toStringJsonValue(defaultDataEnvironment.zenithCode);
                const operatorDefaultEnvironmentSubPath = CommaText.from2Values(this._serviceOperator, stringValue);
                result = `${AppStorageService.operatorDefaultExchangeEnvironmentKeyFolderPathRoot}/${operatorDefaultEnvironmentSubPath}`
            }
        }

        if (this._test) {
            result = `${AppStorageService.alternativeKeyFolderPathRoot}/${AppStorageService.testKeyFolderSubPath}/${result}`;
        }

        return result;
    }
}

export namespace AppStorageService {
    export const enum TypeId {
        Local,
        MotifServices,
    }

    export const masterKeyFolderPath = 'master';
    export const userKeyFolderPath = 'user';
    export const operatorAllExchangeEnvironmentsKeyFolderPathRoot = 'operAllExchEnv';
    export const operatorDefaultExchangeEnvironmentKeyFolderPathRoot = 'operDefExchEnv';
    export const alternativeKeyFolderPathRoot = 'alt';
    export const testKeyFolderSubPath = 'test';

    export function makeSubNamedKey(key: KeyValueStore.Key | string, subName: string) {
        return key + ':#' + subName;
    }
}
