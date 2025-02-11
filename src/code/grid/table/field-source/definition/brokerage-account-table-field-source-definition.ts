import { RevHorizontalAlignId } from '@xilytix/revgrid';
import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@xilytix/sysutils';
import { BrokerageAccount } from '../../../../adi/internal-api';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys/internal-api";
import {
    CorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CorrectnessTableValue,
    StringCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class BrokerageAccountTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(BrokerageAccountTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: BrokerageAccount.FieldId) {
        return BrokerageAccountTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: BrokerageAccount.FieldId) {
        const sourcelessFieldName = BrokerageAccountTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: BrokerageAccount.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('BATFSDGSFNBI30399', BrokerageAccount.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(BrokerageAccountTableFieldSourceDefinition.Field.count);
        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < BrokerageAccountTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = BrokerageAccountTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = BrokerageAccountTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = BrokerageAccountTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = BrokerageAccountTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                BrokerageAccountTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace BrokerageAccountTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.BrokerageAccount;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds = [BrokerageAccount.FieldId.EnvironmentZenithCode];
        export const count = BrokerageAccount.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: BrokerageAccount.FieldId;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(BrokerageAccount.Field.idCount);

        function idToTableGridConstructors(id: BrokerageAccount.FieldId):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case BrokerageAccount.FieldId.IdDisplay:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case BrokerageAccount.FieldId.Name:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case BrokerageAccount.FieldId.EnvironmentZenithCode:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case BrokerageAccount.FieldId.BrokerCode:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case BrokerageAccount.FieldId.BranchCode:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case BrokerageAccount.FieldId.AdvisorCode:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                default:
                    throw new UnreachableCaseError('BATFDSFITTGC1200049', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return BrokerageAccount.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: BrokerageAccount.FieldId) {
            return BrokerageAccount.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return BrokerageAccount.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return BrokerageAccount.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: BrokerageAccount.FieldId) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: BrokerageAccount.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < BrokerageAccount.Field.idCount; id++) {
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
        sourceTypeId: BrokerageAccountTableFieldSourceDefinition.TypeId;
        id: BrokerageAccount.FieldId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): BrokerageAccountTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as BrokerageAccountTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
