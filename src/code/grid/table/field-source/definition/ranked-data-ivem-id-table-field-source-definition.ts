import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@pbkware/js-utils';
import { RevHorizontalAlignId } from 'revgrid';
import { RankedDataIvemId } from '../../../../adi/internal-api';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys/internal-api";
import {
    CorrectnessTableField,
    DataIvemIdCorrectnessTableField,
    IntegerCorrectnessTableField,
    NumberCorrectnessTableField,
    TableField
} from "../../field/internal-api";
import {
    CorrectnessTableValue,
    DataIvemIdCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    NumberCorrectnessTableValue
} from "../../value/internal-api";
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

/** @public */
export class RankedDataIvemIdTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(RankedDataIvemIdTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: RankedDataIvemId.FieldId) {
        return RankedDataIvemIdTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: RankedDataIvemId.FieldId) {
        const sourcelessFieldName = RankedDataIvemIdTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: RankedDataIvemId.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('RLIITFSDGSFNBI30899', RankedDataIvemId.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(RankedDataIvemIdTableFieldSourceDefinition.Field.count);

        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < RankedDataIvemIdTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = RankedDataIvemIdTableFieldSourceDefinition.Field.getName(fieldIdx);
            const heading = RankedDataIvemIdTableFieldSourceDefinition.Field.getHeading(fieldIdx);
            const dataTypeId = RankedDataIvemIdTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = RankedDataIvemIdTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = RankedDataIvemIdTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
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
export namespace RankedDataIvemIdTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.RankedDataIvemId;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: RankedDataIvemId.FieldId[] = [];
        export const count = RankedDataIvemId.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: RankedDataIvemId.FieldId;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(RankedDataIvemId.Field.idCount);

        function idToTableGridConstructors(id: RankedDataIvemId.FieldId):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case RankedDataIvemId.FieldId.DataIvemId:
                    return [DataIvemIdCorrectnessTableField, DataIvemIdCorrectnessTableValue];
                case RankedDataIvemId.FieldId.Rank:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case RankedDataIvemId.FieldId.RankScore:
                    return [NumberCorrectnessTableField, NumberCorrectnessTableValue];
                default:
                    throw new UnreachableCaseError('RLIITFSDFITTGC12049', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return RankedDataIvemId.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: RankedDataIvemId.FieldId) {
            return RankedDataIvemId.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return RankedDataIvemId.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return RankedDataIvemId.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: RankedDataIvemId.FieldId) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: RankedDataIvemId.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < RankedDataIvemId.Field.idCount; id++) {
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
        sourceTypeId: RankedDataIvemIdTableFieldSourceDefinition.TypeId;
        id: RankedDataIvemId.FieldId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): RankedDataIvemIdTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as RankedDataIvemIdTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
