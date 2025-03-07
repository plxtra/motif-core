import { Integer } from '@pbkware/js-utils';
import { ScanAttachedNotificationChannel, ScanTargetTypeId, ZenithEncodedScanFormula } from '../common/internal-api';
import { DataMarket } from '../markets/internal-api';
import { DataIvemId } from '../symbol-id/internal-api';

export interface ScanDetail {
    readonly zenithCriteria: ZenithEncodedScanFormula.BooleanTupleNode;
    readonly zenithRank: ZenithEncodedScanFormula.NumericTupleNode | undefined;
    readonly targetTypeId: ScanTargetTypeId;
    readonly targetMarkets: readonly DataMarket[] | undefined;
    readonly targetDataIvemIds: readonly DataIvemId[] | undefined;
    readonly maxMatchCount: Integer | undefined;
    readonly attachedNotificationChannels: readonly ScanAttachedNotificationChannel[];
}
