import { BrokerageAccount } from '../../../adi';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { KeyedCorrectnessTableRecordDefinition } from './keyed-correctness-table-record-definition';
import { TableRecordDefinition } from './table-record-definition';

export interface BrokerageAccountTableRecordDefinition extends KeyedCorrectnessTableRecordDefinition<BrokerageAccount> {
    readonly typeId: TableFieldSourceDefinition.TypeId.BrokerageAccount;
}

export namespace BrokerageAccountTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is BrokerageAccountTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.BrokerageAccount;
    }
}
