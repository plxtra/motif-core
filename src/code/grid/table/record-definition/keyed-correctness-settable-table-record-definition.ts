import { KeyedCorrectnessSettableListItem } from '../../../sys';
import { PayloadTableRecordDefinition } from './payload-table-record-definition';

export interface KeyedCorrectnessSettableTableRecordDefinition<Record extends KeyedCorrectnessSettableListItem>
    extends PayloadTableRecordDefinition<Record> {

}

// export namespace KeyedCorrectnessTableRecordDefinition {
//     export function createKey<Record extends KeyedCorrectnessListItem>(record: Record): KeyedRecord.Key {
//         return record.createKey();
//     }
// }
