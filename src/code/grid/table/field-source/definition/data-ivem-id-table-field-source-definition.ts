import { RevHorizontalAlignId } from '@xilytix/revgrid';
import {
    AssertInternalError,
    Integer
} from '@xilytix/sysutils';
import { MarketIvemId } from '../../../../adi/internal-api';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys/internal-api";
import {
    DataIvemIdTableField,
    StringTableField,
    TableField
} from "../../field/internal-api";
import {
    DataIvemIdTableValue,
    StringTableValue,
    TableValue
} from "../../value/internal-api";
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

/** @public */
export class DataIvemIdTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(DataIvemIdTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: MarketIvemId.FieldId) {
        return DataIvemIdTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: MarketIvemId.FieldId) {
        const sourcelessFieldName = MarketIvemId.Field.idToName(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: MarketIvemId.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('LIITFSDGSFNBI59321', MarketIvemId.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const count = DataIvemIdTableFieldSourceDefinition.Field.count;
        const result = new Array<TableField.Definition>(count);

        for (let fieldIdx = 0; fieldIdx < count; fieldIdx++) {
            const sourcelessFieldName = DataIvemIdTableFieldSourceDefinition.Field.getName(fieldIdx);
            const heading = DataIvemIdTableFieldSourceDefinition.Field.getHeading(fieldIdx);
            const dataTypeId = DataIvemIdTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const [fieldConstructor, valueConstructor] =
            DataIvemIdTableFieldSourceDefinition.Field.getTableFieldValueConstructors(fieldIdx);

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
export namespace DataIvemIdTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.DataIvemId;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: MarketIvemId.FieldId[] = [];
        export const count = MarketIvemId.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: MarketIvemId.FieldId;
            readonly tableFieldValueConstructors: [field: TableField.Constructor, value: TableValue.Constructor];
        }

        const infos: Info[] = [
            {
                id: MarketIvemId.FieldId.DataIvemId,
                tableFieldValueConstructors: [DataIvemIdTableField, DataIvemIdTableValue],
            },
            {
                id: MarketIvemId.FieldId.Code,
                tableFieldValueConstructors: [StringTableField, StringTableValue],
            },
            {
                id: MarketIvemId.FieldId.Market,
                tableFieldValueConstructors: [StringTableField, StringTableValue],
            },
            {
                id: MarketIvemId.FieldId.Environment,
                tableFieldValueConstructors: [StringTableField, StringTableValue],
            },
        ];

        const idFieldIndices = new Array<Integer>(MarketIvemId.Field.idCount);

        export function initialise() {
            for (let id = 0; id < MarketIvemId.Field.idCount; id++) {
                idFieldIndices[id] = -1;
            }

            for (let fieldIndex = 0; fieldIndex < count; fieldIndex++) {
                const id = infos[fieldIndex].id;
                if (unsupportedIds.includes(id)) {
                    throw new AssertInternalError('LIITFSDFII42422', fieldIndex.toString());
                } else {
                    if (idFieldIndices[id] !== -1) {
                        throw new AssertInternalError('LIITFSDFID42422', fieldIndex.toString()); // duplicate
                    } else {
                        idFieldIndices[id] = fieldIndex;
                    }
                }
            }
        }

        export function isIdSupported(id: MarketIvemId.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function indexOfId(id: MarketIvemId.FieldId) {
            return idFieldIndices[id];
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return MarketIvemId.Field.idToName(infos[fieldIdx].id);
        }

        export function getHeading(fieldIdx: Integer) {
            return MarketIvemId.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return MarketIvemId.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldValueConstructors(fieldIndex: Integer) {
            return infos[fieldIndex].tableFieldValueConstructors;
        }

        export function getTableValueConstructor(fieldIndex: Integer): TableValue.Constructor {
            const constructors = getTableFieldValueConstructors(fieldIndex);
            return constructors[1];
        }
    }

    export interface FieldId extends TableFieldSourceDefinition.FieldId {
        sourceTypeId: DataIvemIdTableFieldSourceDefinition.TypeId;
        id: MarketIvemId.FieldId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): DataIvemIdTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as DataIvemIdTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialise();
    }
}
