import { RevTableRecordSourceFactory } from 'revgrid';
import { TextFormattableValue } from '../../services';
import { Badness, CorrectnessBadness } from '../../sys';
import { TableFieldSourceDefinition, TableRecordSourceDefinition } from '../table/internal-api';

export interface TableRecordSourceFactory extends RevTableRecordSourceFactory<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {
    createCorrectnessState(): CorrectnessBadness;
}
