import { RevRecordSourcedFieldGrid } from 'revgrid';
import { TextFormattableValue } from '../../../services';
import { GridField } from '../../field/internal-api';
import { AdaptedRevgridBehavioredColumnSettings, AdaptedRevgridBehavioredGridSettings } from '../settings/internal-api';

export class RecordSourcedFieldGrid extends RevRecordSourcedFieldGrid<
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId,
    AdaptedRevgridBehavioredGridSettings,
    AdaptedRevgridBehavioredColumnSettings,
    GridField
> {

}
