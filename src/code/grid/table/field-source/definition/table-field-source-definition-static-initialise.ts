import { BalancesTableFieldSourceDefinition } from './balances-table-field-source-definition';
import { BrokerageAccountTableFieldSourceDefinition } from './brokerage-account-table-field-source-definition';
import { CallPutTableFieldSourceDefinition } from './call-put-table-field-source-definition';
import { DataIvemAlternateCodesTableFieldSourceDefinition } from './data-ivem-alternate-codes-table-field-source-definition';
import { DataIvemBaseDetailTableFieldSourceDefinition } from './data-ivem-base-detail-table-field-source-definition';
import { DataIvemExtendedDetailTableFieldSourceDefinition } from './data-ivem-extended-detail-table-field-source-definition';
import { DataIvemIdTableFieldSourceDefinition } from './data-ivem-id-table-field-source-definition';
import { FeedTableFieldSourceDefinition } from './feed-table-field-source-definition';
import { GridFieldTableFieldSourceDefinition } from './grid-field-table-field-source-definition';
import { HoldingTableFieldSourceDefinition } from './holding-table-field-source-definition';
import { MyxDataIvemAttributesTableFieldSourceDefinition } from './myx-data-ivem-attributes-table-field-source-definition';
import { OrderTableFieldSourceDefinition } from './order-table-field-source-definition';
import { PrefixableSecurityDataItemTableFieldSourceDefinition } from './prefixable-security-data-item-table-field-source-definition';
import { RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition } from './ranked-data-ivem-id-list-directory-item-table-field-source-definition';
import { RankedDataIvemIdTableFieldSourceDefinition } from './ranked-data-ivem-id-table-field-source-definition';
import { ScanTableFieldSourceDefinition } from './scan-table-field-source-definition';
import { TopShareholderTableFieldSourceDefinition } from './top-shareholder-table-field-source-definition';

/** @internal */
export namespace TableFieldSourceDefinitionStaticInitialise {
    export function initialise() {
        FeedTableFieldSourceDefinition.initialiseStatic();
        DataIvemBaseDetailTableFieldSourceDefinition.initialiseStatic();
        DataIvemExtendedDetailTableFieldSourceDefinition.initialiseStatic();
        MyxDataIvemAttributesTableFieldSourceDefinition.initialiseStatic();
        DataIvemAlternateCodesTableFieldSourceDefinition.initialiseStatic();
        PrefixableSecurityDataItemTableFieldSourceDefinition.initialiseStatic();
        BrokerageAccountTableFieldSourceDefinition.initialiseStatic();
        OrderTableFieldSourceDefinition.initialiseStatic();
        HoldingTableFieldSourceDefinition.initialiseStatic();
        BalancesTableFieldSourceDefinition.initialiseStatic();
        TopShareholderTableFieldSourceDefinition.initialiseStatic();
        CallPutTableFieldSourceDefinition.initialiseStatic();
        ScanTableFieldSourceDefinition.initialiseStatic();
        DataIvemIdTableFieldSourceDefinition.initialiseStatic();
        RankedDataIvemIdTableFieldSourceDefinition.initialiseStatic();
        RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.initialiseStatic();
        GridFieldTableFieldSourceDefinition.initialiseStatic();
    }
}
