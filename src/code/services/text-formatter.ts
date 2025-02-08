import { RevTextFormatter } from '@xilytix/revgrid';
import { TextFormattableValue } from './text-formattable-value';

export interface TextFormatter extends RevTextFormatter<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {

}
