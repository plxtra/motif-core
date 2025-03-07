import { RevHorizontalAlignId, RevStandardTextPainter, RevTextTruncateTypeId } from 'revgrid';


/** @public */
export interface AdaptedRevgridOnlyGridSettings extends RevStandardTextPainter.OnlyColumnSettings {
    /** Vertical offset from top of cell of content of each cell. */
    verticalOffset: number;
    textTruncateTypeId: RevTextTruncateTypeId | undefined;
    /** Display cell font with strike-through line drawn over it. */
    textStrikeThrough: boolean;
    font: string;
    columnHeaderFont: string;
    horizontalAlignId: RevHorizontalAlignId;
    columnHeaderHorizontalAlignId: RevHorizontalAlignId;
    focusedCellSelectColored: boolean;
}
