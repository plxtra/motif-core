import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@pbkware/js-utils';
import { RevHorizontalAlignId } from 'revgrid';
import { DataIvemBaseDetail } from '../../../../adi';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys";
import {
    CorrectnessTableField,
    DataIvemIdCorrectnessTableField,
    EnumCorrectnessTableField,
    IntegerArrayCorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CorrectnessTableValue,
    DataIvemIdCorrectnessTableValue,
    IvemClassIdCorrectnessTableValue,
    PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue,
    StringCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class DataIvemBaseDetailTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(DataIvemBaseDetailTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: DataIvemBaseDetail.Field.Id) {
        return DataIvemBaseDetailTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: DataIvemBaseDetail.Field.Id) {
        const sourcelessFieldName = DataIvemBaseDetailTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: DataIvemBaseDetail.Field.Id) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('LIBDTFSDGSFNBI30499', DataIvemBaseDetail.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(DataIvemBaseDetailTableFieldSourceDefinition.Field.count);
        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < DataIvemBaseDetailTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = DataIvemBaseDetailTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = DataIvemBaseDetailTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = DataIvemBaseDetailTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = DataIvemBaseDetailTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                DataIvemBaseDetailTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace DataIvemBaseDetailTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.DataIvemBaseDetail;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: DataIvemBaseDetail.Field.Id[] = [];
        export const count = DataIvemBaseDetail.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: DataIvemBaseDetail.Field.Id;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(DataIvemBaseDetail.Field.idCount);

        function idToTableGridConstructors(id: DataIvemBaseDetail.Field.Id):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case DataIvemBaseDetail.Field.Id.Id:
                    return [DataIvemIdCorrectnessTableField, DataIvemIdCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.Code:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.Market:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.IvemClassId:
                    return [EnumCorrectnessTableField, IvemClassIdCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.SubscriptionDataTypeIds:
                    return [IntegerArrayCorrectnessTableField, PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.TradingMarkets:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.Name:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case DataIvemBaseDetail.Field.Id.Exchange:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                default:
                    throw new UnreachableCaseError('LIBDTFDSFITTGC2039994', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return DataIvemBaseDetail.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: DataIvemBaseDetail.Field.Id) {
            return DataIvemBaseDetail.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return DataIvemBaseDetail.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return DataIvemBaseDetail.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: DataIvemBaseDetail.Field.Id) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: DataIvemBaseDetail.Field.Id) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < DataIvemBaseDetail.Field.idCount; id++) {
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
        sourceTypeId: DataIvemBaseDetailTableFieldSourceDefinition.TypeId;
        id: DataIvemBaseDetail.Field.Id;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): DataIvemBaseDetailTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as DataIvemBaseDetailTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
