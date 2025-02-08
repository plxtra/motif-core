import { KeyedCorrectnessListItem } from '../../sys/internal-api';
import { DataIvemId } from './data-ivem-id';

export interface DataIvemIdKeyedCorrectnessListItem extends KeyedCorrectnessListItem {
    readonly dataIvemId: DataIvemId;
}
