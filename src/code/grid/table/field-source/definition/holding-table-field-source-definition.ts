import { RevHorizontalAlignId } from '@xilytix/revgrid';
import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@xilytix/sysutils';
import { Holding } from '../../../../adi/internal-api';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys/internal-api";
import {
    CorrectnessTableField,
    DecimalCorrectnessTableField,
    EnumCorrectnessTableField,
    IntegerCorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CorrectnessTableValue,
    CurrencyIdCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    IvemClassIdCorrectnessTableValue,
    PriceCorrectnessTableValue,
    StringCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class HoldingTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(HoldingTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: Holding.FieldId) {
        return HoldingTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: Holding.FieldId) {
        const sourcelessFieldName = HoldingTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: Holding.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('HTFSDGSFNBI30399', Holding.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(HoldingTableFieldSourceDefinition.Field.count);

        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < HoldingTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = HoldingTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = HoldingTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = HoldingTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = HoldingTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                HoldingTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace HoldingTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.Holding;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: Holding.FieldId[] = [];
        export const count = Holding.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: Holding.FieldId;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(Holding.Field.idCount);

        function idToTableGridConstructors(id: Holding.FieldId):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case Holding.FieldId.Exchange:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Holding.FieldId.Code:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Holding.FieldId.AccountId:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Holding.FieldId.StyleId:
                    return [EnumCorrectnessTableField, IvemClassIdCorrectnessTableValue];
                case Holding.FieldId.Cost:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Holding.FieldId.Currency:
                    return [EnumCorrectnessTableField, CurrencyIdCorrectnessTableValue];
                case Holding.FieldId.TotalQuantity:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case Holding.FieldId.TotalAvailableQuantity:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case Holding.FieldId.AveragePrice:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                default:
                    throw new UnreachableCaseError('HTFDSFITTGC5948883', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return Holding.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: Holding.FieldId) {
            return Holding.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return Holding.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return Holding.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: Holding.FieldId) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: Holding.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < Holding.Field.idCount; id++) {
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
        sourceTypeId: HoldingTableFieldSourceDefinition.TypeId;
        id: Holding.FieldId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): HoldingTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as HoldingTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
