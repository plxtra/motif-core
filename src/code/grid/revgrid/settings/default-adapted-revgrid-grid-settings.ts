import { revDefaultGridSettings } from 'revgrid';
import { AdaptedRevgridGridSettings } from './adapted-revgrid-grid-settings';
import { defaultAdaptedRevgridOnlyGridSettings } from './default-adapted-revgrid-only-grid-settings';

/** @public */
export const defaultAdaptedRevgridGridSettings: AdaptedRevgridGridSettings = {
    ...revDefaultGridSettings,
    ...defaultAdaptedRevgridOnlyGridSettings,
} as const;
