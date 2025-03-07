import { PickEnum } from '@pbkware/js-utils';
import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from 'revgrid';
import { BrokerageAccount, Feed } from '../../../../adi/internal-api';
import { BrokerageAccountTableFieldSourceDefinition, FeedTableFieldSourceDefinition, TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export class BrokerageAccountTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.BrokerageAccount,
            BrokerageAccountTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds
        );
    }

    // no override for saveToJson()

    override createDefaultLayoutDefinition() {
        const brokerageAccountFieldSourceDefinition = BrokerageAccountTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);
        const feedFieldSourceDefinition = FeedTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(brokerageAccountFieldSourceDefinition.getSupportedFieldNameById(BrokerageAccount.FieldId.IdDisplay));
        fieldNames.push(brokerageAccountFieldSourceDefinition.getSupportedFieldNameById(BrokerageAccount.FieldId.Name));
        fieldNames.push(feedFieldSourceDefinition.getSupportedFieldNameById(Feed.FieldId.StatusId));
        fieldNames.push(brokerageAccountFieldSourceDefinition.getSupportedFieldNameById(BrokerageAccount.FieldId.BrokerCode));
        fieldNames.push(brokerageAccountFieldSourceDefinition.getSupportedFieldNameById(BrokerageAccount.FieldId.BranchCode));
        fieldNames.push(brokerageAccountFieldSourceDefinition.getSupportedFieldNameById(BrokerageAccount.FieldId.AdvisorCode));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace BrokerageAccountTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.BrokerageAccount |
        TableFieldSourceDefinition.TypeId.Feed
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.BrokerageAccount,
        TableFieldSourceDefinition.TypeId.Feed,
    ];

    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.BrokerageAccount,
        TableFieldSourceDefinition.TypeId.Feed,
    ];
}
