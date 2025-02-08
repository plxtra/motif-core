import { StringId, Strings } from '../../res/internal-api';
import {
    Correctness,
    CorrectnessId,
    EnumInfoOutOfOrderError,
    FieldDataTypeId,
    Integer,
    KeyedCorrectnessListItem,
    MultiEvent
} from "../../sys/internal-api";
import { ExchangeEnvironmentZenithCode, FeedClass, FeedClassId, FeedStatus, FeedStatusId, ZenithEnvironmentedValueParts } from '../common/internal-api';

export class Feed implements KeyedCorrectnessListItem {
    readonly mapKey: string;
    readonly name: string;
    readonly environmentZenithCode: ExchangeEnvironmentZenithCode | undefined;
    // readonly display: string;
    // readonly classId: FeedClassId;

    private _destroyed = false;

    private _usable = false;
    private _correctnessId: CorrectnessId;

    private _statusChangedEvent = new MultiEvent<Feed.StatusChangedEventHandler>();
    private _correctnessChangedEvent = new MultiEvent<Feed.CorrectnessChangedEventHandler>();
    private _listCorrectnessChangedEvent = new MultiEvent<Feed.CorrectnessChangedEventHandler>();

    constructor(
        public readonly classId: FeedClassId,
        public readonly zenithCode: string, // same as Name in Zenith Protocol
        private _statusId: FeedStatusId,
        private _listCorrectnessId: CorrectnessId,
    ) {
        const className = FeedClass.idToName(classId);
        this.name = `${className}:${zenithCode}`;
        this.mapKey = this.name;
        this.environmentZenithCode = ZenithEnvironmentedValueParts.getEnvironmentFromString(zenithCode);

        // this.name = FeedInfo.idToName(this.zenithFeedName);
        // this.display = FeedInfo.idToDisplay(this.zenithFeedName);
        // this.classId = FeedInfo.idToClassId(this.zenithFeedName);
        this._correctnessId = this._listCorrectnessId;
    }

    get destroyed(): boolean { return this._destroyed; }

    get usable() { return this._usable; }
    get statusId() { return this._statusId; }
    get correctnessId() { return this._correctnessId; }

    // OrderStatuses DataItem is needs to know when base correctness is usable.  (It determines when usable is set)
    get baseUsable() { return Correctness.idIsUsable(this._listCorrectnessId); }
    get listCorrectnessId() { return this._listCorrectnessId; }

    destroy() {
        this._destroyed = true;
    }

    // createKey() {
    //     return new Feed.Key(this.name);
    // }

    setListCorrectness(value: CorrectnessId) {
        if (value !== this._listCorrectnessId) {
            this._listCorrectnessId = value;
            this.notifyListCorrectnessChanged();
            this.updateCorrectness();
        }
    }

    change(feedStatusId: FeedStatusId) {
        this.setStatusId(feedStatusId);
    }

    subscribeStatusChangedEvent(handler: Feed.StatusChangedEventHandler) {
        return this._statusChangedEvent.subscribe(handler);
    }

    unsubscribeStatusChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._statusChangedEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: Feed.CorrectnessChangedEventHandler) {
        return this._correctnessChangedEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedEvent.unsubscribe(subscriptionId);
    }

    subscribeListCorrectnessChangedEvent(handler: Feed.CorrectnessChangedEventHandler) {
        return this._listCorrectnessChangedEvent.subscribe(handler);
    }

    unsubscribeListCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._listCorrectnessChangedEvent.unsubscribe(subscriptionId);
    }

    protected calculateCorrectnessId() {
        return this._listCorrectnessId;
    }

    protected updateCorrectness() {
        const correctnessId = this.calculateCorrectnessId();
        const correctnessChanged = correctnessId !== this._correctnessId;
        if (correctnessChanged) {
            this._correctnessId = correctnessId;
            this._usable = Correctness.idIsUsable(correctnessId);
            this.notifyCorrectnessChanged();
        }
    }

    private notifyStatusChanged() {
        const handlers = this._statusChangedEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private notifyCorrectnessChanged() {
        const handlers = this._correctnessChangedEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private notifyListCorrectnessChanged() {
        const handlers = this._listCorrectnessChangedEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private setStatusId(value: FeedStatusId) {
        const statusChanged = value !== this.statusId;
        if (statusChanged) {
            this._statusId = value;
            window.motifLogger.logInfo(`${Strings[StringId.Feed]} ${Strings[StringId.Status]} ${Strings[StringId.Update]}: ${this.zenithCode} (${FeedStatus.idToDisplay(this.statusId)})`);
            this.notifyStatusChanged();
        }
    }
}

export namespace Feed {
    export type StatusChangedEventHandler = (this: void) => void;
    export type CorrectnessChangedEventHandler = (this: void) => void;

    export const enum FieldId {
        ClassId,
        ZenithCode,
        Environment,
        Name,
        StatusId,
    }

    export namespace Field {
        interface Info {
            readonly id: FieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };
        const infosObject: InfosObject = {
            ClassId: {
                id: FieldId.ClassId,
                name: 'ClassId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.FeedFieldDisplay_ClassId,
                headingId: StringId.FeedFieldHeading_ClassId,
            },
            ZenithCode: {
                id: FieldId.ZenithCode,
                name: 'ZenithCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.FeedFieldDisplay_ZenithCode,
                headingId: StringId.FeedFieldHeading_ZenithCode,
            },
            Environment: {
                id: FieldId.Environment,
                name: 'Environment',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.FeedFieldDisplay_Environment,
                headingId: StringId.FeedFieldHeading_Environment,
            },
            Name: {
                id: FieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.FeedFieldDisplay_Name,
                headingId: StringId.FeedFieldHeading_Name,
            },
            StatusId: {
                id: FieldId.StatusId,
                name: 'StatusId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.FeedFieldDisplay_StatusId,
                headingId: StringId.FeedFieldHeading_StatusId,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('Feed.FieldId', outOfOrderIdx, idToName(outOfOrderIdx));
            }
        }

        export function idToName(id: FieldId) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: FieldId) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: FieldId) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: FieldId) {
            return Strings[idToDisplayId(id)];
        }

        export function idToHeadingId(id: FieldId) {
            return infos[id].headingId;
        }

        export function idToHeading(id: FieldId) {
            return Strings[idToHeadingId(id)];
        }
    }

    export function generateDisplay(feedClassId: FeedClassId, feedZenithCode: string): string {
        return `${FeedClass.idToDisplay(feedClassId)}: ${feedZenithCode}`;
    }

    // export class Key implements KeyedRecord.Key {
    //     private _mapKey: string;

    //     constructor(public name: string) {
    //         this._mapKey = Key.generateMapKey(this.name);
    //     }

    //     get mapKey() {
    //         return this._mapKey;
    //     }

    //     static createNull() {
    //         // will not match any valid holding
    //         return new Key('');
    //     }

    //     // saveToJson(element: JsonElement) {
    //     //     // not used currently
    //     // }
    // }

    // export namespace Key {
    //     export const JsonTag_Name = 'name';

    //     export function generateMapKey(name: string) {
    //         return name;
    //     }

    //     export function isEqual(left: Key, right: Key) {
    //         return left.name === right.name;
    //     }

    //     // export function tryCreateFromJson(element: JsonElement) {
    //     //     const jsonName = element.tryGetString(JsonTag_Name);
    //     //     if (jsonName === undefined) {
    //     //         return 'Undefined name';
    //     //     } else {
    //     //         return new Key(jsonName);
    //     //     }
    //     // }
    // }

    // export function createNotFoundFeed(key: Feed.Key) {
    //     let id = FeedInfo.tryNameToId(key.name);
    //     if (id === undefined) {
    //         id = FeedId.Null;
    //     }
    //     const feed = new Feed(id, FeedStatusId.Impaired, CorrectnessId.Error);
    //     return feed;
    // }
}

export namespace FeedModule {
    export function initialiseStatic() {
        Feed.Field.initialise();
    }
}
