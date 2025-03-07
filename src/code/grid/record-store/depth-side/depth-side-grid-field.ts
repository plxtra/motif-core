import { RevRecordField, RevRecordSourcedFieldSourceDefinition } from 'revgrid';
import { TextFormattableValue } from '../../../services/internal-api';
import { CorrectnessId } from '../../../sys/internal-api';
import { GridField } from '../../field/internal-api';
import { DepthRecord } from './depth-record';

/** @public */
export abstract class DepthSideGridField extends GridField implements RevRecordField {
    abstract override getViewValue(record: DepthRecord): TextFormattableValue;
}

/** @public */
export namespace DepthSideGridField {
    export type GetDataItemCorrectnessIdEventHandler = (this: void) => CorrectnessId;
    // export interface AllFieldsAndDefaults {
    //     fields: DepthSideGridField[];
    //     defaultStates: GridRecordFieldState[];
    //     defaultVisibles: boolean[];
    // }

    export const sourceDefinition = new RevRecordSourcedFieldSourceDefinition('DepthSide');
}
