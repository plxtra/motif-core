import { RevTableRecord } from 'revgrid';
import { TextFormattableValue } from '../../../services';

export class TableRecord extends RevTableRecord<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {
}

export namespace TableRecord {
    // export type ValueChange = RevTableValueSource.ValueChange<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId>;

    // export type ValuesChangedEventHandler = (this: void, recordIdx: Integer, invalidatedValues: GridRecordInvalidatedValue[]) => void;
    // export type SequentialFieldValuesChangedEventHandler = (this: void, recordIdx: Integer, fieldIdx: Integer, fieldCount: Integer) => void;
    // export type RecordChangedEventHandler = (this: void, recordIdx: Integer) => void;

    export type EventHandlers = RevTableRecord.EventHandlers;
}
