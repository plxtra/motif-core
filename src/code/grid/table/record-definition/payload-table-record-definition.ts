import { TableRecordDefinition } from './table-record-definition';

export interface PayloadTableRecordDefinition<Record> extends TableRecordDefinition {
    readonly record: Record;
}

