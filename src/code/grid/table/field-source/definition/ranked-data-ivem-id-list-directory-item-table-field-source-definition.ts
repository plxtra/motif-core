import { RevHorizontalAlignId } from '@xilytix/revgrid';
import { RankedDataIvemIdListDirectoryItem } from '../../../../services/internal-api';
import { AssertInternalError, FieldDataType, FieldDataTypeId, Integer } from '../../../../sys/internal-api';
import {
    BooleanCorrectnessTableField,
    CorrectnessTableField,
    EnumCorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from "../../field/internal-api";
import {
    CorrectnessTableValue,
    RankedDataIvemIdListDirectoryItemTypeIdCorrectnessTableValue,
    StringCorrectnessTableValue,
    WritableCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

/** @public */
export class RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: RankedDataIvemIdListDirectoryItem.FieldId) {
        return RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: RankedDataIvemIdListDirectoryItem.FieldId) {
        const sourcelessFieldName = RankedDataIvemIdListDirectoryItem.Field.idToName(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: RankedDataIvemIdListDirectoryItem.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('STFSDGSFNBI30398', RankedDataIvemIdListDirectoryItem.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const count = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.count;
        const result = new Array<TableField.Definition>(count);

        for (let fieldIdx = 0; fieldIdx < count; fieldIdx++) {
            const sourcelessFieldName = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.getName(fieldIdx);
            const heading = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.getHeading(fieldIdx);
            const dataTypeId = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const [fieldConstructor, valueConstructor] =
            RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.getTableFieldValueConstructors(fieldIdx);

            result[fieldIdx] = new TableField.Definition(
                this,
                sourcelessFieldName,
                heading,
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

/** @public */
export namespace RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: RankedDataIvemIdListDirectoryItem.FieldId[] = [];
        export const count = RankedDataIvemIdListDirectoryItem.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: RankedDataIvemIdListDirectoryItem.FieldId;
            readonly tableFieldValueConstructors: [field: CorrectnessTableField.Constructor, value: CorrectnessTableValue.Constructor];
        }

        const infos: Info[] = [
            {
                id: RankedDataIvemIdListDirectoryItem.FieldId.TypeId,
                tableFieldValueConstructors: [EnumCorrectnessTableField, RankedDataIvemIdListDirectoryItemTypeIdCorrectnessTableValue],
            },
            {
                id: RankedDataIvemIdListDirectoryItem.FieldId.Id,
                tableFieldValueConstructors: [StringCorrectnessTableField, StringCorrectnessTableValue],
            },
            {
                id: RankedDataIvemIdListDirectoryItem.FieldId.Readonly,
                tableFieldValueConstructors: [BooleanCorrectnessTableField, WritableCorrectnessTableValue],
            },
            {
                id: RankedDataIvemIdListDirectoryItem.FieldId.Name,
                tableFieldValueConstructors: [StringCorrectnessTableField, StringCorrectnessTableValue],
            },
            {
                id: RankedDataIvemIdListDirectoryItem.FieldId.Description,
                tableFieldValueConstructors: [StringCorrectnessTableField, StringCorrectnessTableValue],
            },
        ];

        const idFieldIndices = new Array<Integer>(count);

        export function initialise() {
            const idFieldIndexCount = idFieldIndices.length;
            for (let i = 0; i < idFieldIndexCount; i++) {
                idFieldIndices[i] = -1;
            }
            for (let fieldIndex = 0; fieldIndex < count; fieldIndex++) {
                const id = infos[fieldIndex].id;
                if (unsupportedIds.includes(id)) {
                    throw new AssertInternalError('STFSDFII42422', fieldIndex.toString());
                } else {
                    if (idFieldIndices[fieldIndex] !== -1) {
                        throw new AssertInternalError('STFSDFID42422', fieldIndex.toString()); // duplicate
                    } else {
                        idFieldIndices[fieldIndex] = fieldIndex;
                    }
                }
            }
        }

        export function isIdSupported(id: RankedDataIvemIdListDirectoryItem.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function indexOfId(id: RankedDataIvemIdListDirectoryItem.FieldId) {
            return idFieldIndices[id];
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return RankedDataIvemIdListDirectoryItem.Field.idToName(infos[fieldIdx].id);
        }

        export function getHeading(fieldIdx: Integer) {
            return RankedDataIvemIdListDirectoryItem.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return RankedDataIvemIdListDirectoryItem.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldValueConstructors(fieldIndex: Integer) {
            return infos[fieldIndex].tableFieldValueConstructors;
        }

        export function getTableValueConstructor(fieldIndex: Integer) {
            const constructors = getTableFieldValueConstructors(fieldIndex);
            return constructors[1];
        }
    }

    export interface FieldId extends TableFieldSourceDefinition.FieldId {
        sourceTypeId: RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.TypeId;
        id: RankedDataIvemIdListDirectoryItem.FieldId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialise();
    }
}
