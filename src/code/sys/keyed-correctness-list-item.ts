import { CorrectnessRecord } from './correctness-record';
import { KeyedCorrectnessSettableListItem } from './keyed-correctness-settable-list-item';

export interface KeyedCorrectnessListItem extends KeyedCorrectnessSettableListItem, CorrectnessRecord {
}
