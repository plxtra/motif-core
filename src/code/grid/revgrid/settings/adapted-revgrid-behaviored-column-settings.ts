import { RevBehavioredColumnSettings } from '@xilytix/revgrid';
import { AdaptedRevgridColumnSettings } from './adapted-revgrid-column-settings';

/** @public */
export interface AdaptedRevgridBehavioredColumnSettings extends AdaptedRevgridColumnSettings, RevBehavioredColumnSettings {
    merge(settings: Partial<AdaptedRevgridColumnSettings>): boolean;
    clone(): AdaptedRevgridBehavioredColumnSettings;
}
