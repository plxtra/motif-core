import { RevHorizontalAlignId } from '@xilytix/revgrid';
import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@xilytix/sysutils';
import { SearchSymbolsDataIvemFullDetail } from '../../../../adi/internal-api';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys/internal-api";
import {
    BooleanCorrectnessTableField,
    CorrectnessTableField,
    DecimalCorrectnessTableField,
    EnumCorrectnessTableField,
    IntegerCorrectnessTableField,
    SourceTzOffsetDateCorrectnessTableField,
    StringArrayCorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CallOrPutIdCorrectnessTableValue,
    CorrectnessTableValue,
    DecimalCorrectnessTableValue,
    DepthDirectionIdCorrectnessTableValue,
    ExerciseTypeIdCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    IsIndexCorrectnessTableValue,
    PriceCorrectnessTableValue,
    SourceTzOffsetDateCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class DataIvemExtendedDetailTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(DataIvemExtendedDetailTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id) {
        return DataIvemExtendedDetailTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id) {
        const sourcelessFieldName = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('LIEDTFSDGSFNBI30999', SearchSymbolsDataIvemFullDetail.ExtendedField.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(DataIvemExtendedDetailTableFieldSourceDefinition.Field.count);
        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < DataIvemExtendedDetailTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = DataIvemExtendedDetailTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                DataIvemExtendedDetailTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace DataIvemExtendedDetailTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.DataIvemExtendedDetail;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: SearchSymbolsDataIvemFullDetail.ExtendedField.Id[] = [
            SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Attributes,
            SearchSymbolsDataIvemFullDetail.ExtendedField.Id.TmcLegs
        ];
        export const count = SearchSymbolsDataIvemFullDetail.ExtendedField.idCount - unsupportedIds.length;

        class Info {
            id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id;
            fieldConstructor: CorrectnessTableField.Constructor;
            valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(SearchSymbolsDataIvemFullDetail.ExtendedField.idCount);

        function idToTableGridConstructors(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Cfi:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.DepthDirectionId:
                    return [EnumCorrectnessTableField, DepthDirectionIdCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.IsIndex:
                    return [BooleanCorrectnessTableField, IsIndexCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExpiryDate:
                    return [SourceTzOffsetDateCorrectnessTableField, SourceTzOffsetDateCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.StrikePrice:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExerciseTypeId:
                    return [EnumCorrectnessTableField, ExerciseTypeIdCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.CallOrPutId:
                    return [EnumCorrectnessTableField, CallOrPutIdCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ContractSize:
                    return [DecimalCorrectnessTableField, DecimalCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.LotSize:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Categories:
                    return [StringArrayCorrectnessTableField, StringArrayCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Attributes:
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.AlternateCodes:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SearchSymbolsDataIvemFullDetail.ExtendedField.Id.TmcLegs:
                    throw new AssertInternalError('LIEDTFDSFITTGCA1200069', SearchSymbolsDataIvemFullDetail.ExtendedField.idToName(id));
                default:
                    throw new UnreachableCaseError('LIEDTFDSFITTGCU1200069', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return SearchSymbolsDataIvemFullDetail.ExtendedField.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id) {
            return SearchSymbolsDataIvemFullDetail.ExtendedField.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return SearchSymbolsDataIvemFullDetail.ExtendedField.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return SearchSymbolsDataIvemFullDetail.ExtendedField.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < SearchSymbolsDataIvemFullDetail.ExtendedField.idCount; id++) {
                if (unsupportedIds.includes(id)) {
                    idFieldIndices[id] = -1;
                } else {
                    idFieldIndices[id] = fieldIdx;

                    const [fieldConstructor, valueConstructor] = idToTableGridConstructors(id);
                    infos[fieldIdx++] = {
                        id,
                        fieldConstructor,
                        valueConstructor,
                    };
                }
            }
        }
    }

    export interface FieldId extends TableFieldSourceDefinition.FieldId {
        sourceTypeId: DataIvemExtendedDetailTableFieldSourceDefinition.TypeId;
        id: SearchSymbolsDataIvemFullDetail.ExtendedField.Id;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): DataIvemExtendedDetailTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as DataIvemExtendedDetailTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
