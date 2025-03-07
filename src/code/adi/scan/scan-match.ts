import { Integer } from '@pbkware/js-utils';

export interface ScanMatch<T> {
    readonly index: Integer;
    readonly value: T;
    rankScore: number;
}

export namespace ScanMatch {
    export const enum FieldId {
        Index,
        Value,
        RankScore,
    }
}
