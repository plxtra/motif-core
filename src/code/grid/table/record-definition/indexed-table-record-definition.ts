import { IndexedRecord } from '@pbkware/js-utils';
import { PayloadTableRecordDefinition } from './payload-table-record-definition';

export interface IndexedTableRecordDefinition<Record extends IndexedRecord> extends PayloadTableRecordDefinition<Record> {

}
