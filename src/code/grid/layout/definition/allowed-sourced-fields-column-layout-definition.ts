import { RevAllowedRecordSourcedFieldsColumnLayoutDefinition } from 'revgrid';
import { TextFormattableValue } from '../../../services';
import { BidAskPair } from '../../../sys';

export class AllowedSourcedFieldsColumnLayoutDefinition extends RevAllowedRecordSourcedFieldsColumnLayoutDefinition<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {
    // Uses AllowedGridField instead of RevFieldDefinition as heading can be changed at runtime
}

export type BidAskAllowedSourcedFieldsColumnLayoutDefinitions = BidAskPair<AllowedSourcedFieldsColumnLayoutDefinition>;
