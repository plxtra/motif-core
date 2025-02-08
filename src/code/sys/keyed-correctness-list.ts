import { KeyedCorrectnessListItem } from './keyed-correctness-list-item';
import { KeyedCorrectnessSettableList } from './keyed-correctness-settable-list';

export interface KeyedCorrectnessList<Record extends KeyedCorrectnessListItem> extends KeyedCorrectnessSettableList<Record> {
}
