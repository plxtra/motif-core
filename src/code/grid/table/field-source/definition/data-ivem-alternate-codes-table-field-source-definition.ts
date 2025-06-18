import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@pbkware/js-utils';
import { RevHorizontalAlignId } from 'revgrid';
import { DataIvemAlternateCodes } from '../../../../adi';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys";
import { CorrectnessTableField, StringCorrectnessTableField, TableField } from '../../field/internal-api';
import { CorrectnessTableValue, StringCorrectnessTableValue } from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class DataIvemAlternateCodesTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(DataIvemAlternateCodesTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: DataIvemAlternateCodes.Field.Id) {
        return DataIvemAlternateCodesTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: DataIvemAlternateCodes.Field.Id) {
        const sourcelessFieldName = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: DataIvemAlternateCodes.Field.Id) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('LIACTFSDGSFNBI30299', DataIvemAlternateCodes.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(DataIvemAlternateCodesTableFieldSourceDefinition.Field.count);

        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < DataIvemAlternateCodesTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = DataIvemAlternateCodesTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                DataIvemAlternateCodesTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace DataIvemAlternateCodesTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.DataIvemAlternateCodes;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: DataIvemAlternateCodes.Field.Id[] = [];
        export const count = DataIvemAlternateCodes.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: DataIvemAlternateCodes.Field.Id;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(DataIvemAlternateCodes.Field.idCount);

        function idToTableGridConstructors(id: DataIvemAlternateCodes.Field.Id):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case DataIvemAlternateCodes.Field.Id.Ticker:
                case DataIvemAlternateCodes.Field.Id.Gics:
                case DataIvemAlternateCodes.Field.Id.Isin:
                case DataIvemAlternateCodes.Field.Id.Ric:
                case DataIvemAlternateCodes.Field.Id.Base:
                case DataIvemAlternateCodes.Field.Id.Short:
                case DataIvemAlternateCodes.Field.Id.Long:
                case DataIvemAlternateCodes.Field.Id.Uid:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                default:
                    throw new UnreachableCaseError('LIACTFDSFITTGC5699945', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return DataIvemAlternateCodes.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: DataIvemAlternateCodes.Field.Id) {
            return DataIvemAlternateCodes.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return DataIvemAlternateCodes.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return DataIvemAlternateCodes.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: DataIvemAlternateCodes.Field.Id) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: DataIvemAlternateCodes.Field.Id) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < DataIvemAlternateCodes.Field.idCount; id++) {
                if (unsupportedIds.includes(id)) {
                    idFieldIndices[id] = -1;
                } else {
                    idFieldIndices[id] = fieldIdx;

                    const [fieldConstructor, valueConstructor] = idToTableGridConstructors(id);
                    infos[fieldIdx++] = {
                        id,
                        fieldConstructor,
                        valueConstructor,
                    } as const;
                }
            }
        }
    }

    export interface FieldId extends TableFieldSourceDefinition.FieldId {
        sourceTypeId: DataIvemAlternateCodesTableFieldSourceDefinition.TypeId;
        id: DataIvemAlternateCodes.Field.Id;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): DataIvemAlternateCodesTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as DataIvemAlternateCodesTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
