import { KeyedCorrectnessSettableList, KeyedCorrectnessSettableListItem } from "../../../sys";
import { SubscribeBadnessListTableRecordSource } from './subscribe-badness-list-table-record-source';

export abstract class KeyedCorrectnessSettableRecordTableRecordSource<
        Record extends KeyedCorrectnessSettableListItem,
        RecordList extends KeyedCorrectnessSettableList<Record>,
    > extends SubscribeBadnessListTableRecordSource<Record, RecordList> {
}
