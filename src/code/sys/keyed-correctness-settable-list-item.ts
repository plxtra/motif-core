import { CorrectnessSettableListItem } from './correctness-settable-list-item';
import { DestroyableRecord } from './destroyable-record';
import { KeyedRecord } from './keyed-record';

export interface KeyedCorrectnessSettableListItem extends DestroyableRecord, KeyedRecord, CorrectnessSettableListItem {
}
