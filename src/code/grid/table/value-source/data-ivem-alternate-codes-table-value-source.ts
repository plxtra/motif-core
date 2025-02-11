import { Integer, MultiEvent, UnreachableCaseError } from '@xilytix/sysutils';
import { DataIvemAlternateCodes, SearchSymbolsDataIvemFullDetail } from '../../../adi/internal-api';
import { CorrectnessRecord } from '../../../sys/internal-api';
import { DataIvemAlternateCodesTableFieldSourceDefinition } from '../field-source/internal-api';
import { CorrectnessTableValue, StringCorrectnessTableValue, TableValue } from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class DataIvemAlternateCodesTableValueSource extends TableValueSource {
    private _dataIvemDetailExtendedChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(firstFieldIndexOffset: Integer, private _dataIvemFullDetail: SearchSymbolsDataIvemFullDetail, private _list: CorrectnessRecord) {
        super(firstFieldIndexOffset);
    }

    activate(): TableValue[] {
        this._dataIvemDetailExtendedChangedEventSubscriptionId = this._dataIvemFullDetail.subscribeExtendedChangeEvent(
            (changedFieldIds) => { this.handleDetailChangedEvent(changedFieldIds); }
        );

        return this.getAllValues();
    }

    deactivate() {
        if (this._dataIvemDetailExtendedChangedEventSubscriptionId !== undefined) {
            this._dataIvemFullDetail.unsubscribeExtendedChangeEvent(this._dataIvemDetailExtendedChangedEventSubscriptionId);
            this._dataIvemDetailExtendedChangedEventSubscriptionId = undefined;
        }
    }

    getAllValues(): TableValue[] {
        const fieldCount = DataIvemAlternateCodesTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getfieldCount(): Integer {
        return DataIvemAlternateCodesTableFieldSourceDefinition.Field.count;
    }

    private handleDetailChangedEvent(changedFieldIds: SearchSymbolsDataIvemFullDetail.ExtendedField.Id[]) {
        if (changedFieldIds.includes(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.AlternateCodes)) {
            const allValues = this.getAllValues();
            this.notifyAllValuesChangeEvent(allValues);
        }
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: DataIvemAlternateCodes.Field.Id, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._list.correctnessId;

        const alternateCodes = this._dataIvemFullDetail.alternateCodes;

        switch (id) {
            case DataIvemAlternateCodes.Field.Id.Ticker: {
                const tickerValue = value as StringCorrectnessTableValue;
                tickerValue.data = alternateCodes.ticker;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Gics: {
                const gicsValue = value as StringCorrectnessTableValue;
                gicsValue.data = alternateCodes.gics;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Isin: {
                const isinValue = value as StringCorrectnessTableValue;
                isinValue.data = alternateCodes.isin;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Ric: {
                const ricValue = value as StringCorrectnessTableValue;
                ricValue.data = alternateCodes.ric;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Base: {
                const baseValue = value as StringCorrectnessTableValue;
                baseValue.data = alternateCodes.base;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Short: {
                const shortValue = value as StringCorrectnessTableValue;
                shortValue.data = alternateCodes.short;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Long: {
                const longValue = value as StringCorrectnessTableValue;
                longValue.data = alternateCodes.long;
                break;
            }
            case DataIvemAlternateCodes.Field.Id.Uid: {
                const uidValue = value as StringCorrectnessTableValue;
                uidValue.data = alternateCodes.uid;
                break;
            }
            default:
                throw new UnreachableCaseError('LIACTVSLV100194588', id);
        }
    }
}
