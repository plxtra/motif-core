import { BrokerageAccountRecord } from '../../../adi';
import { KeyedCorrectnessTableRecordDefinition } from './keyed-correctness-table-record-definition';

export interface BrokerageAccountRecordTableRecordDefinition<Record extends BrokerageAccountRecord>
    extends KeyedCorrectnessTableRecordDefinition<Record> {
}
