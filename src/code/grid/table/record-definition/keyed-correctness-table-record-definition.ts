import { KeyedCorrectnessListItem } from '../../../sys/internal-api';
import { KeyedCorrectnessSettableTableRecordDefinition } from './keyed-correctness-settable-table-record-definition';

export interface KeyedCorrectnessTableRecordDefinition<Record extends KeyedCorrectnessListItem> extends KeyedCorrectnessSettableTableRecordDefinition<Record> {

}

// export namespace KeyedCorrectnessTableRecordDefinition {
//     export function createKey<Record extends KeyedCorrectnessListItem>(record: Record): KeyedRecord.Key {
//         return record.createKey();
//     }
// }
