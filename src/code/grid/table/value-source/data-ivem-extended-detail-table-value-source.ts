import { AssertInternalError, Integer, MultiEvent, UnreachableCaseError } from '@xilytix/sysutils';
import { DataIvemAlternateCodes, SearchSymbolsDataIvemFullDetail, SymbolsDataItem } from '../../../adi/internal-api';
import { DataIvemExtendedDetailTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import {
    BooleanCorrectnessTableValue,
    CallOrPutIdCorrectnessTableValue,
    CorrectnessTableValue,
    DecimalCorrectnessTableValue,
    DepthDirectionIdCorrectnessTableValue,
    ExerciseTypeIdCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    PriceCorrectnessTableValue,
    SourceTzOffsetDateCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    TableValue
} from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class DataIvemExtendedDetailTableValueSource extends TableValueSource {
    private _dataIvemDetailExtendedChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(firstFieldIndexOffset: Integer, private _dataIvemFullDetail: SearchSymbolsDataIvemFullDetail, private _dataItem: SymbolsDataItem) {
        super(firstFieldIndexOffset);
    }

    activate(): TableValue[] {
        this._dataIvemDetailExtendedChangedEventSubscriptionId = this._dataIvemFullDetail.subscribeExtendedChangeEvent(
            (changedFieldIds) => this.handleDetailChangedEvent(changedFieldIds)
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
        const fieldCount = DataIvemExtendedDetailTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getfieldCount(): Integer {
        return DataIvemExtendedDetailTableFieldSourceDefinition.Field.count;
    }

    private handleDetailChangedEvent(changedFieldIds: SearchSymbolsDataIvemFullDetail.ExtendedField.Id[]) {
        const changedFieldCount = changedFieldIds.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changedFieldCount);
        let foundCount = 0;
        for (let i = 0; i < changedFieldIds.length; i++) {
            const fieldId = changedFieldIds[i];
            const fieldIndex = DataIvemExtendedDetailTableFieldSourceDefinition.Field.indexOfId(fieldId);
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
        const valueConstructor = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._dataItem.correctnessId;

        switch (id) {
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Cfi:
                (value as StringCorrectnessTableValue).data = this._dataIvemFullDetail.cfi;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.DepthDirectionId:
                (value as DepthDirectionIdCorrectnessTableValue).data = this._dataIvemFullDetail.depthDirectionId;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.IsIndex:
                (value as BooleanCorrectnessTableValue).data = this._dataIvemFullDetail.isIndex;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExpiryDate:
                (value as SourceTzOffsetDateCorrectnessTableValue).data = this._dataIvemFullDetail.expiryDate;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.StrikePrice:
                (value as PriceCorrectnessTableValue).data = this._dataIvemFullDetail.strikePrice;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExerciseTypeId:
                (value as ExerciseTypeIdCorrectnessTableValue).data = this._dataIvemFullDetail.exerciseTypeId;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.CallOrPutId:
                (value as CallOrPutIdCorrectnessTableValue).data = this._dataIvemFullDetail.callOrPutId;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ContractSize:
                (value as DecimalCorrectnessTableValue).data = this._dataIvemFullDetail.contractSize;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.LotSize:
                (value as IntegerCorrectnessTableValue).data = this._dataIvemFullDetail.lotSize;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Categories:
                (value as StringArrayCorrectnessTableValue).data = this._dataIvemFullDetail.categories;
                break;
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Attributes:
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.AlternateCodes: {
                const alternateCodes = this._dataIvemFullDetail.alternateCodes;
                const data = DataIvemAlternateCodes.toDisplay(alternateCodes);
                (value as StringCorrectnessTableValue).data = data;
                break;
            }
            case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.TmcLegs:
                throw new AssertInternalError('LIEDTVSLVA44824483', SearchSymbolsDataIvemFullDetail.ExtendedField.idToName(id));
            default:
                throw new UnreachableCaseError('LIEDTVSLV577555493', id);
        }
    }
}
