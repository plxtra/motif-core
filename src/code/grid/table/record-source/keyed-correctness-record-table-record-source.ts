import { KeyedCorrectnessList, KeyedCorrectnessListItem } from "../../../sys";
import { KeyedCorrectnessSettableRecordTableRecordSource } from './keyed-correctness-settable-record-table-record-source';

export abstract class KeyedCorrectnessRecordTableRecordSource<
        Record extends KeyedCorrectnessListItem,
        RecordList extends KeyedCorrectnessList<Record>,
    > extends KeyedCorrectnessSettableRecordTableRecordSource<Record, RecordList> {
}
