import { RevBehavioredGridSettings } from 'revgrid';
import { AdaptedRevgridGridSettings } from './adapted-revgrid-grid-settings';

/** @public */
export interface AdaptedRevgridBehavioredGridSettings extends AdaptedRevgridGridSettings, RevBehavioredGridSettings {
    merge(settings: Partial<AdaptedRevgridGridSettings>): boolean;
    clone(): AdaptedRevgridBehavioredGridSettings;
}
