import { DataIvemId } from '../symbol-id/internal-api';

export interface RankScoredDataIvemId {
    readonly value: DataIvemId;
    readonly rankScore: number;
}
