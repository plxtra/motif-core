import { DataIvemBaseDetail } from '../../../adi/internal-api';
import { CommaText, CorrectnessRecord, Integer, MultiEvent, UnreachableCaseError } from '../../../sys/internal-api';
import { DataIvemBaseDetailTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import {
    CorrectnessTableValue,
    DataIvemIdCorrectnessTableValue,
    IvemClassIdCorrectnessTableValue,
    PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    TableValue
} from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class DataIvemBaseDetailTableValueSource extends TableValueSource {
    private _dataIvemDetailBaseChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(firstFieldIndexOffset: Integer, private _dataIvemBaseDetail: DataIvemBaseDetail, private list: CorrectnessRecord) {
        super(firstFieldIndexOffset);
    }

    activate(): TableValue[] {
        this._dataIvemDetailBaseChangedEventSubscriptionId = this._dataIvemBaseDetail.subscribeBaseChangeEvent(
            (changedFieldIds) => { this.handleDetailChangedEvent(changedFieldIds); }
        );

        return this.getAllValues();
    }

    deactivate() {
        if (this._dataIvemDetailBaseChangedEventSubscriptionId !== undefined) {
            this._dataIvemBaseDetail.unsubscribeBaseChangeEvent(this._dataIvemDetailBaseChangedEventSubscriptionId);
            this._dataIvemDetailBaseChangedEventSubscriptionId = undefined;
        }
    }

    getAllValues(): TableValue[] {
        const fieldCount = DataIvemBaseDetailTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = DataIvemBaseDetailTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getfieldCount(): Integer {
        return DataIvemBaseDetailTableFieldSourceDefinition.Field.count;
    }

    private handleDetailChangedEvent(changedFieldIds: DataIvemBaseDetail.Field.Id[]) {
        const changedFieldCount = changedFieldIds.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changedFieldCount);
        let foundCount = 0;
        for (let i = 0; i < changedFieldIds.length; i++) {
            const fieldId = changedFieldIds[i];
            const fieldIndex = DataIvemBaseDetailTableFieldSourceDefinition.Field.indexOfId(fieldId);
            if (fieldIndex >= 0) {
                const newValue = this.createTableValue(fieldIndex);
                this.loadValue(fieldId, newValue);
                valueChanges[foundCount++] = { fieldIndex, newValue, recentChangeTypeId: undefined };
            }
        }
        if (foundCount < changedFieldCount) {
            valueChanges.length = foundCount;
        }
        this.notifyValueChangesEvent(valueChanges);
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = DataIvemBaseDetailTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: DataIvemBaseDetail.Field.Id, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this.list.correctnessId;

        switch (id) {
            case DataIvemBaseDetail.Field.Id.Id:
                (value as DataIvemIdCorrectnessTableValue).data = this._dataIvemBaseDetail.dataIvemId;
                break;
            case DataIvemBaseDetail.Field.Id.Code:
                (value as StringCorrectnessTableValue).data = this._dataIvemBaseDetail.code;
                break;
            case DataIvemBaseDetail.Field.Id.Market: {
                const market = this._dataIvemBaseDetail.market;
                const display = market === undefined ? undefined : market.display;
                (value as StringCorrectnessTableValue).data = display;
                break;
            }
            case DataIvemBaseDetail.Field.Id.IvemClassId:
                (value as IvemClassIdCorrectnessTableValue).data = this._dataIvemBaseDetail.ivemClassId;
                break;
            case DataIvemBaseDetail.Field.Id.SubscriptionDataTypeIds:
                (value as PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue).data = this._dataIvemBaseDetail.subscriptionDataTypeIds;
                break;
            case DataIvemBaseDetail.Field.Id.TradingMarkets: {
                const boards = this._dataIvemBaseDetail.tradingMarkets;
                let display: string | undefined;
                if (boards !== undefined) {
                    const count = boards.length;
                    switch (count) {
                        case 0:
                            display = '';
                            break;
                        case 1:
                            display = boards[0].display;
                            break;
                        default: {
                            const displays = new Array<string>(count);
                            for (let i = 0; i < count; i++) {
                                const board = boards[i];
                                displays[i] = board.display;
                            }
                            display = CommaText.fromStringArray(displays);
                        }
                    }
                    (value as StringCorrectnessTableValue).data = display;
                }
                break;
            }
            case DataIvemBaseDetail.Field.Id.Name:
                (value as StringCorrectnessTableValue).data = this._dataIvemBaseDetail.name;
                break;
            case DataIvemBaseDetail.Field.Id.Exchange: {
                const exchange = this._dataIvemBaseDetail.exchange;
                const display = exchange === undefined ? undefined : exchange.abbreviatedDisplay;
                (value as StringCorrectnessTableValue).data = display;
                break;
            }
            default:
                throw new UnreachableCaseError('LIBDTVSLV577555493', id);
        }
    }
}
