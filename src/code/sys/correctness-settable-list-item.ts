import { CorrectnessId } from './correctness';

/** @public */
export interface CorrectnessSettableListItem {
    readonly correctnessId: CorrectnessId;

    setListCorrectness(value: CorrectnessId): void;
}
