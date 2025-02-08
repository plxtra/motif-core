declare global {
    interface Window {
        motifLogger: Logger;
    }
}

import { Integer, Logger, SysDecimal } from '@xilytix/sysutils';

// export {
//     BooleanOrUndefined,
//     ComparisonResult,
//     DateOrDateTime,
//     DayOfWeek,
//     Guid,
//     IndexSignatureHack,
//     IndexedRecord,
//     Integer,
//     Json,
//     JsonValue,
//     JsonValueArray,
//     Line,
//     ListChangeTypeId,
//     MapKey,
//     Mappable,
//     PickEnum,
//     PickExcludedEnum,
//     RGB,
//     Rect,
//     TimeSpan
// } from './xiltyix-sysutils';

/** @public */
export type PriceOrRemainder = SysDecimal | null;

/** @public */
export interface BidAskPair<T> {
    bid: T;
    ask: T;
}

/** @public */
export type Handle = Integer;
/** @public */
export const invalidHandle = 0;
/** @public */
export type ExtensionHandle = Handle;

