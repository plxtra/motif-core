import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { JsonElement } from '@xilytix/sysutils';
import { AllBrokerageAccountGroup, BrokerageAccountGroup, MarketsService } from '../../../../adi/internal-api';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from "../../field-source/internal-api";
import { TableRecordSourceDefinition } from './table-record-source-definition';

export abstract class BrokerageAccountGroupTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        typeId: TableRecordSourceDefinition.TypeId,
        allowedFieldSourceDefinitionTypeIds: TableFieldSourceDefinition.TypeId[],
        public readonly brokerageAccountGroup: BrokerageAccountGroup
    ) {
        super(customHeadings, tableFieldSourceDefinitionCachingFactory, typeId, allowedFieldSourceDefinitionTypeIds);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const groupElement = element.newElement(
            BrokerageAccountGroupTableRecordSourceDefinition.JsonTag.brokerageAccountGroup
        );
        this.brokerageAccountGroup.saveToJson(groupElement);
    }
}

export namespace BrokerageAccountGroupTableRecordSourceDefinition {
    export namespace JsonTag {
        export const brokerageAccountGroup = 'brokerageAccountGroup';
    }

    export const defaultAccountGroup: AllBrokerageAccountGroup = BrokerageAccountGroup.createAll();

    export function getBrokerageAccountGroupFromJson(marketsService: MarketsService, element: JsonElement) {
        const groupElementResult = element.tryGetElement(JsonTag.brokerageAccountGroup);
        if (groupElementResult.isErr()) {
            return defaultAccountGroup;
        } else {
            const groupResult = BrokerageAccountGroup.tryCreateFromJson(marketsService, groupElementResult.value);
            if (groupResult.isErr()) {
                return defaultAccountGroup;
            } else {
                return groupResult.value;
            }
        }
    }
}
