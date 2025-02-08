import { AdaptedRevgridOnlyGridSettings } from './adapted-revgrid-only-grid-settings';

/** @public */
export type AdaptedRevgridOnlyColumnSettings = Pick<AdaptedRevgridOnlyGridSettings,
    'verticalOffset' |
    'textTruncateTypeId' |
    'textStrikeThrough' |
    'font' |
    'columnHeaderFont' |
    'horizontalAlignId' |
    'columnHeaderHorizontalAlignId'
>;

