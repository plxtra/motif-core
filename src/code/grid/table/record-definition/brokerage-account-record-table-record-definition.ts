import { BrokerageAccountRecord } from '../../../adi/internal-api';
import { KeyedCorrectnessTableRecordDefinition } from './keyed-correctness-table-record-definition';

export interface BrokerageAccountRecordTableRecordDefinition<Record extends BrokerageAccountRecord>
    extends KeyedCorrectnessTableRecordDefinition<Record> {
}
