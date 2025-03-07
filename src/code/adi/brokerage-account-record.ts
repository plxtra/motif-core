import { MapKey } from '@pbkware/js-utils';
import { KeyedCorrectnessListItem } from '../sys/internal-api';

export interface BrokerageAccountRecord extends KeyedCorrectnessListItem {
    readonly accountMapKey: MapKey;
}
