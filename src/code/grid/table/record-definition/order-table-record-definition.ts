import { Order } from '../../../adi';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { BrokerageAccountRecordTableRecordDefinition } from './brokerage-account-record-table-record-definition';
import { TableRecordDefinition } from './table-record-definition';

export interface OrderTableRecordDefinition extends BrokerageAccountRecordTableRecordDefinition<Order> {
    readonly typeId: TableFieldSourceDefinition.TypeId.Order;
}

export namespace OrderTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is OrderTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.Order;
    }
}
