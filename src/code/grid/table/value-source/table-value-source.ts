import { RevTableValueSource } from '@xilytix/revgrid';
import { TextFormattableValue } from '../../../services/internal-api';

export abstract class TableValueSource extends RevTableValueSource<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {
}

export namespace TableValueSource {
    export type ValueChange = RevTableValueSource.ValueChange<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId>;
}
