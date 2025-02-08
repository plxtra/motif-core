import { IndexedRecord } from '../../../sys/internal-api';
import { PayloadTableRecordDefinition } from './payload-table-record-definition';

export interface IndexedTableRecordDefinition<Record extends IndexedRecord> extends PayloadTableRecordDefinition<Record> {

}
