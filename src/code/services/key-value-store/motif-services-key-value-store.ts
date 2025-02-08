import { Result } from '../../sys/internal-api';
import { MotifServicesService } from '../motif-services-service';
import { KeyValueStore } from './key-value-store';

export class MotifServicesKeyValueStore implements KeyValueStore {

    private readonly _motifServicesService: MotifServicesService;
    private _prefix: string;

    constructor() {
        this._motifServicesService = new MotifServicesService();
    }

    initialise(
        endpointBaseUrl: string,
        getAuthorizationHeaderValueCallback: MotifServicesService.GetAuthorizationHeaderValueCallback,
    ) {
        this._motifServicesService.initialise(endpointBaseUrl, getAuthorizationHeaderValueCallback);
    }

    public getItem(key: string, keyFolder: string): Promise<Result<string | undefined>> {
        return this._motifServicesService.getUserSetting(key, keyFolder);
    }

    public setItem(key: string, value: string, keyFolder: string): Promise<Result<void>> {
        return this._motifServicesService.setUserSetting(key, value, keyFolder);
    }

    public removeItem(key: string, keyFolder: string): Promise<Result<void>> {
        return this._motifServicesService.deleteUserSetting(key, keyFolder);
    }
}
