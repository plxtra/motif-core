import { MapKey } from '@xilytix/sysutils';
import { KeyedCorrectnessListItem } from '../sys/internal-api';

export interface BrokerageAccountRecord extends KeyedCorrectnessListItem {
    readonly accountMapKey: MapKey;
}
