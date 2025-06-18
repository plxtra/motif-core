import { CallOrPutId } from '../../../../adi';
import { CallPutSecurityDataItemTableFieldSourceDefinition } from './call-put-security-data-item-table-field-source-definition';
import { PrefixableSecurityDataItemTableFieldSourceDefinition } from './prefixable-security-data-item-table-field-source-definition';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class PutSecurityDataItemTableFieldSourceDefinition extends CallPutSecurityDataItemTableFieldSourceDefinition {
    constructor() {
        super(CallOrPutId.Put);
    }
}

export namespace PutSecurityDataItemTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.PutSecurityDataItem;
    export type TypeId = typeof typeId;

    export interface FieldId extends PrefixableSecurityDataItemTableFieldSourceDefinition.FieldId {
        sourceTypeId: PutSecurityDataItemTableFieldSourceDefinition.TypeId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): PutSecurityDataItemTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as PutSecurityDataItemTableFieldSourceDefinition;
    }
}

