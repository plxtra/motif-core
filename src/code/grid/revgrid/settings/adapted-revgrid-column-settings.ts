import { RevColumnSettings, RevStandardTextPainter } from 'revgrid';
import { AdaptedRevgridOnlyColumnSettings } from './adapted-revgrid-only-column-settings';

/** @public */
export interface AdaptedRevgridColumnSettings extends AdaptedRevgridOnlyColumnSettings, RevColumnSettings, RevStandardTextPainter.ColumnSettings {

}
