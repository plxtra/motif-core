import { DataItem } from '../../../adi/internal-api';
import { TableRecordSource } from './table-record-source';

export abstract class SingleDataItemTableRecordSource extends TableRecordSource {
    private _singleDataItem: DataItem;

    get singleDataItem() { return this._singleDataItem; }

    protected setSingleDataItem(value: DataItem) {
        this._singleDataItem = value;
    }
}
