import { AssertInternalError, JsonElement, UnexpectedCaseError, UnreachableCaseError } from '@pbkware/js-utils';
import { AdiService } from '../adi';
import { ScansService } from '../scan';
import { AppStorageService, IdleService, KeyValueStore } from '../services';
import { LockOpenList } from '../sys';
import { WatchmakerService } from '../watchmaker';
import { RankedDataIvemIdListDefinition } from './definition/internal-api';
import { RankedDataIvemIdListReferential } from './ranked-data-ivem-id-list-referential';

export class RankedDataIvemIdListReferentialsService extends LockOpenList<RankedDataIvemIdListReferential> {
    private _saveDisabled = false;
    private _saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Unregistered;
    private _delayedSaveTimeoutHandle: ReturnType<typeof setTimeout> | undefined;

    constructor(
        private readonly _storageService: AppStorageService,
        private readonly _idleService: IdleService,
        private readonly _adiService: AdiService,
        private readonly _scansService: ScansService,
        private readonly _watchmakerService: WatchmakerService,
    ) {
        super();
    }

    override finalise() {
        if (this._delayedSaveTimeoutHandle !== undefined) {
            clearTimeout(this._delayedSaveTimeoutHandle);
            this._delayedSaveTimeoutHandle = undefined;
        }
        super.finalise();
    }

    new(definition: RankedDataIvemIdListDefinition): RankedDataIvemIdListReferential {
        const index = this.count;
        const implementation = new RankedDataIvemIdListReferential(
            this._adiService,
            this._scansService,
            this._watchmakerService,
            definition,
            '',
            index,
            () => { this.registerSaveCallback() }
        );
        this.add(implementation);
        this.registerSaveCallback();
        return implementation;
    }

    private registerSaveCallback() {
        if (!this._saveDisabled) {
            switch (this._saveIdleCallbackState) {
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Unregistered: {
                    this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Registered;
                    const promise = this._idleService.addRequest(() => this.saveCallback(), 200);
                    AssertInternalError.throwErrorIfPromiseRejected(promise, 'RLIILRSRSC43434');
                    break;
                }
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Registered:
                    break;
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Saving: {
                    this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.SavingRegistrationPending;
                    break;
                }
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.SavingRegistrationPending:
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.SaveDelay:
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.ErrorDelayed:
                    break;
                default:
                    throw new UnreachableCaseError('NJRLIILSRSR54072', this._saveIdleCallbackState);
            }
        }
    }

    private async saveCallback(): Promise<void> {
        this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Saving;
        const saveResult = await this.save();
        let delay: number | undefined;
        if (saveResult.isErr()) {
            this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.ErrorDelayed;
            delay = RankedDataIvemIdListReferentialsService.saveErrorRetryDelayTimeSpan;
        } else {
            switch (this._saveIdleCallbackState as RankedDataIvemIdListReferentialsService.SaveIdleCallbackState) {
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Saving: {
                    this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Unregistered;
                    delay = undefined;
                    break;
                }
                case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.SavingRegistrationPending: {
                    this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.SaveDelay;
                    delay = RankedDataIvemIdListReferentialsService.saveMinimumIntervalTimeSpan;
                    break;
                }
                default: {
                    throw new UnexpectedCaseError('NJRLIILSSCSU13008', `${this._saveIdleCallbackState}`);
                }
            }
        }

        if (delay !== undefined) {
            this._delayedSaveTimeoutHandle = setTimeout(() => { this.retryDelayedSave() }, delay);
        }
    }

    private retryDelayedSave() {
        switch (this._saveIdleCallbackState) {
            case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.SaveDelay:
            case RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.ErrorDelayed:
                break;
            default:
                throw new UnexpectedCaseError('NJRLIILSRDS54072', `${this._saveIdleCallbackState}`);
        }

        this._delayedSaveTimeoutHandle = undefined;
        this._saveIdleCallbackState = RankedDataIvemIdListReferentialsService.SaveIdleCallbackState.Unregistered;
        this.registerSaveCallback();
    }

    private async load() {
        //
    }

    private async save() {
        const element = new JsonElement();
        this.saveToJson(element);
        const jsonString = element.stringify();
        return this._storageService.setItem(KeyValueStore.Key.Settings, jsonString, false);
    }

    private tryLoadFromJson(element: JsonElement) {
        //
    }

    private saveToJson(element: JsonElement) {
        element.setString(RankedDataIvemIdListReferentialsService.JsonName.schemaVersion, RankedDataIvemIdListReferentialsService.jsonSchemaVersion);

        const referentials = this.toArray();
        const count = referentials.length;
        const listElements = new Array<JsonElement>(count);

        for (let i = 0; i < count; i++) {
            const referential = referentials[i];
            const definition = referential.createDefinition();
            const listElement = new JsonElement();
            definition.saveToJson(listElement);
            listElements[i] = listElement;
        }

        element.setElementArray(RankedDataIvemIdListReferentialsService.JsonName.lists, listElements);
    }
}

export namespace RankedDataIvemIdListReferentialsService {
    export namespace JsonName {
        export const schemaVersion = 'schemaVersion';
        export const lists = 'lists';
    }

    export const jsonSchemaVersion = '1';

    export const enum SaveIdleCallbackState {
        Unregistered,
        Registered,
        Saving,
        SavingRegistrationPending,
        SaveDelay,
        ErrorDelayed,
    }

    export const saveMinimumIntervalTimeSpan = 20000; // milliseconds
    export const saveErrorRetryDelayTimeSpan = 180000; // milliseconds
}
