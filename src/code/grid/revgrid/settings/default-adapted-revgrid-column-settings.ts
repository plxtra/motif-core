import { revDefaultColumnSettings } from 'revgrid';
import { AdaptedRevgridColumnSettings } from './adapted-revgrid-column-settings';
import { defaultAdaptedRevgridOnlyColumnSettings } from './default-adapted-revgrid-only-column-settings';

/** @public */
export const defaultAdaptedRevgridColumnSettings: AdaptedRevgridColumnSettings = {
    ...revDefaultColumnSettings,
    ...defaultAdaptedRevgridOnlyColumnSettings,
} as const;
