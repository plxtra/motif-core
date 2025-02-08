import { MapKey } from '@xilytix/sysutils';

export interface KeyedRecord {
    readonly mapKey: MapKey;

    // createKey(): KeyedRecord.Key;

    // dispose(): void;
}

// export namespace KeyedRecord {
//     export interface Key {
//         readonly mapKey: MapKey;
//     }
// }
