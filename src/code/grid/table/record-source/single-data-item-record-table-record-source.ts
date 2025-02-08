import { DataItem } from '../../../adi/internal-api';
import { KeyedCorrectnessList, KeyedCorrectnessListItem } from '../../../sys/internal-api';
import { KeyedCorrectnessRecordTableRecordSource } from './keyed-correctness-record-table-record-source';

export abstract class SingleDataItemRecordTableRecordSource<
        Record extends KeyedCorrectnessListItem,
        RecordList extends KeyedCorrectnessList<Record>
    >
    extends KeyedCorrectnessRecordTableRecordSource<Record, RecordList> {

    private _singleDataItem: DataItem;

    get singleDataItem() { return this._singleDataItem; }

    protected setSingleDataItem(value: DataItem) {
        this._singleDataItem = value;
    }
}
