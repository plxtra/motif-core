import {
    EnumInfoOutOfOrderError,
    Integer,
    Mappable,
    MultiEvent,
} from '@pbkware/js-utils';
import { RevRecordValueRecentChangeTypeId } from 'revgrid';
import { StringId, Strings } from '../../res/i18n-strings';
import {
    CorrectnessId,
    CorrectnessRecord,
    FieldDataTypeId,
} from "../../sys/internal-api";
import { DataIvemId } from '../symbol-id/internal-api';

export class RankedDataIvemId implements CorrectnessRecord, Mappable {
    private _correctnessId: CorrectnessId;
    private _rank: Integer;
    private _rankScore: number;

    private _changedMultiEvent = new MultiEvent<RankedDataIvemId.ChangedEventHandler>();
    private _correctnessChangedMultiEvent = new MultiEvent<CorrectnessRecord.CorrectnessChangedEventHandler>();

    constructor(readonly dataIvemId: DataIvemId, correctnessId: CorrectnessId, rank: Integer, rankScore: number) {
        this._correctnessId = correctnessId;
        this._rank = rank;
        this._rankScore = rankScore;
    }

    get correctnessId() { return this._correctnessId; }
    get rank() { return this._rank; }
    get rankScore() { return this._rankScore; }
    get mapKey() { return this.dataIvemId.mapKey; }

    createCopy(): RankedDataIvemId {
        return new RankedDataIvemId(
            this.dataIvemId.createCopy(),
            this._correctnessId,
            this._rank,
            this._rankScore,
        )
    }

    setCorrectnessId(value: CorrectnessId) {
        if (value !== this._correctnessId) {
            this._correctnessId = value;
            this.notifyCorrectnessChanged();
        }
    }

    setRank(rank: Integer) {
        if (rank !== this._rank) {
            const recentChangeTypeId = rank > this._rank
                ? RevRecordValueRecentChangeTypeId.Increase
                : RevRecordValueRecentChangeTypeId.Decrease;
            this._rank = rank;
            const valueChanges: RankedDataIvemId.ValueChange[] = [
                { fieldId: RankedDataIvemId.FieldId.Rank, recentChangeTypeId }
            ];
            this.notifyChanged(valueChanges);
        }
    }

    setRankAndRankScore(rank: Integer, rankScore: number) {
        const valueChanges = new Array<RankedDataIvemId.ValueChange>(RankedDataIvemId.Field.idCount);
        let changedIdx = 0;

        if (rank !== this._rank) {
            const recentChangeTypeId = rank > this._rank
                ? RevRecordValueRecentChangeTypeId.Increase
                : RevRecordValueRecentChangeTypeId.Decrease;
            this._rank = rank;
            valueChanges[changedIdx++] = { fieldId: RankedDataIvemId.FieldId.Rank, recentChangeTypeId };
        }

        if (rankScore !== this._rankScore) {
            const recentChangeTypeId = rankScore > this._rankScore
                ? RevRecordValueRecentChangeTypeId.Increase
                : RevRecordValueRecentChangeTypeId.Decrease;
            this._rankScore = rankScore;
            valueChanges[changedIdx++] = { fieldId: RankedDataIvemId.FieldId.RankScore, recentChangeTypeId };
        }
        if (changedIdx >= 0) {
            valueChanges.length = changedIdx;
            this.notifyChanged(valueChanges);
        }
    }

    setInvalidRank() {
        this._rank = RankedDataIvemId.invalidRank;
    }

    isRankInvalid() {
        return this._rank === RankedDataIvemId.invalidRank;
    }

    subscribeChangedEvent(handler: RankedDataIvemId.ChangedEventHandler) {
        return this._changedMultiEvent.subscribe(handler);
    }

    unsubscribeChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._changedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: CorrectnessRecord.CorrectnessChangedEventHandler): number {
        return this._correctnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        this._correctnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyChanged(valueChanges: RankedDataIvemId.ValueChange[]) {
        const handlers = this._changedMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            handlers[index](valueChanges);
        }
    }

    private notifyCorrectnessChanged() {
        const handlers = this._correctnessChangedMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            handlers[index]();
        }
    }
}

export namespace RankedDataIvemId {
    export const invalidRank = -1;
    export type ChangedEventHandler = (this: void, valueChanges: ValueChange[]) => void;

    export const enum FieldId {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        DataIvemId,
        Rank,
        RankScore,
    }

    export interface ValueChange {
        fieldId: FieldId;
        recentChangeTypeId: RevRecordValueRecentChangeTypeId;
    }

    export namespace Field {
        export type Id = FieldId;

        interface Info {
            readonly id: FieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };
        const infosObject: InfosObject = {
            DataIvemId: {
                id: FieldId.DataIvemId,
                name: 'DataIvemId',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.RankedDataIvemIdFieldDisplay_DataIvemId,
                headingId: StringId.RankedDataIvemIdFieldHeading_DataIvemId,
            },
            Rank: {
                id: FieldId.Rank,
                name: 'Rank',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.RankedDataIvemIdFieldDisplay_Rank,
                headingId: StringId.RankedDataIvemIdFieldHeading_Rank,
            },
            RankScore: {
                id: FieldId.RankScore,
                name: 'rankScore',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.RankedDataIvemIdFieldDisplay_rankScore,
                headingId: StringId.RankedDataIvemIdFieldHeading_rankScore,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                const info = infos[id];
                if (info.id !== id as FieldId) {
                    throw new EnumInfoOutOfOrderError('RankedDataIvemId.FieldId', id, idToName(id));
                }
            }
        }

        export function idToName(id: Id) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }
    }
}

/** @internal */
export namespace RankedDataIvemIdModule {
    export function initialiseStatic() {
        RankedDataIvemId.Field.initialise();
    }
}
