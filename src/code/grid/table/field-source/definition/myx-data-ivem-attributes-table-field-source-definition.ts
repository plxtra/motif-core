import { RevHorizontalAlignId } from '@xilytix/revgrid';
import { MyxDataIvemAttributes } from '../../../../adi/internal-api';
import {
    AssertInternalError,
    FieldDataType,
    FieldDataTypeId,
    Integer,
    UnreachableCaseError
} from "../../../../sys/internal-api";
import {
    CorrectnessTableField,
    EnumCorrectnessTableField,
    IntegerArrayCorrectnessTableField,
    IntegerCorrectnessTableField,
    NumberCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CorrectnessTableValue,
    DeliveryBasisIdMyxDataIvemAttributeCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    MarketClassificationIdMyxDataIvemAttributeCorrectnessTableValue,
    PercentageCorrectnessTableValue,
    ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class MyxDataIvemAttributesTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(MyxDataIvemAttributesTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: MyxDataIvemAttributes.Field.Id) {
        return MyxDataIvemAttributesTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: MyxDataIvemAttributes.Field.Id) {
        const sourcelessFieldName = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: MyxDataIvemAttributes.Field.Id) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('MLIATFSDGSFNBI30699', MyxDataIvemAttributes.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(MyxDataIvemAttributesTableFieldSourceDefinition.Field.count);
        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < MyxDataIvemAttributesTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                MyxDataIvemAttributesTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace MyxDataIvemAttributesTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.MyxDataIvemAttributes;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: MyxDataIvemAttributes.Field.Id[] = [];
        export const count = MyxDataIvemAttributes.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: MyxDataIvemAttributes.Field.Id;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(MyxDataIvemAttributes.Field.idCount);

        function idToTableGridConstructors(id: MyxDataIvemAttributes.Field.Id):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case MyxDataIvemAttributes.Field.Id.Category:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.MarketClassification:
                    return [EnumCorrectnessTableField, MarketClassificationIdMyxDataIvemAttributeCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.DeliveryBasis:
                    return [EnumCorrectnessTableField, DeliveryBasisIdMyxDataIvemAttributeCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.MaxRSS:
                    return [NumberCorrectnessTableField, PercentageCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.Sector:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.Short:
                    return [IntegerArrayCorrectnessTableField, ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.ShortSuspended:
                    return [IntegerArrayCorrectnessTableField, ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue];
                case MyxDataIvemAttributes.Field.Id.SubSector:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                default:
                    throw new UnreachableCaseError('MLIATFDSFITTGC200012', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return MyxDataIvemAttributes.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: MyxDataIvemAttributes.Field.Id) {
            return MyxDataIvemAttributes.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return MyxDataIvemAttributes.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return MyxDataIvemAttributes.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: MyxDataIvemAttributes.Field.Id) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: MyxDataIvemAttributes.Field.Id) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < MyxDataIvemAttributes.Field.idCount; id++) {
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
        sourceTypeId: MyxDataIvemAttributesTableFieldSourceDefinition.TypeId;
        id: MyxDataIvemAttributes.Field.Id;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): MyxDataIvemAttributesTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as MyxDataIvemAttributesTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
