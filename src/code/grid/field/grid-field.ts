import { UnreachableCaseError } from '@pbkware/js-utils';
import { RevRecordSourcedField, RevSourcedField } from 'revgrid';
import { StringId, Strings } from '../../res';
import { TextFormattableValue } from '../../services';

export abstract class GridField extends RevRecordSourcedField<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {

}

export namespace GridField {
    export function idToHeading(id: RevSourcedField.FieldId) {
        const stringId = idToHeadingStringId(id);
        return Strings[stringId];
    }

    function idToHeadingStringId(id: RevSourcedField.FieldId) {
        switch (id) {
            case RevSourcedField.FieldId.Name: return StringId.GridFieldFieldHeading_Name;
            case RevSourcedField.FieldId.Heading: return StringId.GridFieldFieldHeading_Heading;
            case RevSourcedField.FieldId.SourceName: return StringId.GridFieldFieldHeading_SourceName;
            case RevSourcedField.FieldId.DefaultHeading: return StringId.GridFieldFieldHeading_DefaultHeading;
            case RevSourcedField.FieldId.DefaultTextAlign: return StringId.GridFieldFieldHeading_DefaultTextAlign;
            case RevSourcedField.FieldId.DefaultWidth: return StringId.GridFieldFieldHeading_DefaultWidth;
            default:
                throw new UnreachableCaseError('GFITHSI50912', id);
        }
    }

}
