import { RevTableValueSource } from 'revgrid';
import { TextFormattableValue } from '../../../services';

export abstract class TableValueSource extends RevTableValueSource<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {
}

export namespace TableValueSource {
    export type ValueChange = RevTableValueSource.ValueChange<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId>;
}
