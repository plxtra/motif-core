import {
    Integer,
    SourceTzOffsetDate,
    SourceTzOffsetDateTime,
    compareArray,
    compareDate,
    compareDecimal,
    compareString,
    compareValue
} from '@pbkware/js-utils';
import { RevTableField } from 'revgrid';
import { IvemId, MarketIvemId } from '../../../adi/internal-api';
import { TextFormattableValue, TextFormatter } from '../../../services/internal-api';
import {
    BaseSourceTzOffsetDateTimeCorrectnessTableValue,
    CorrectnessTableValue,
    DataIvemIdCorrectnessTableValue,
    DataIvemIdTableValue,
    DateCorrectnessTableValue,
    DateTableValue,
    DecimalCorrectnessTableValue,
    DecimalTableValue,
    GenericCorrectnessTableValue,
    GenericTableValue,
    IntegerArrayCorrectnessTableValue,
    IntegerArrayTableValue,
    IntegerCorrectnessTableValue,
    IntegerTableValue,
    IvemIdCorrectnessTableValue,
    IvemIdTableValue,
    NumberCorrectnessTableValue,
    NumberTableValue,
    SourceTzOffsetDateCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    StringTableValue,
    TableValue
} from '../value/internal-api';

export abstract class TableField extends RevTableField<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {

}

export namespace TableField {
    export type Definition = RevTableField.Definition<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId>;
    export type Constructor = RevTableField.Constructor<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId>;
}

// eslint-disable-next-line max-len
export class GenericTableField<DataType extends number | string, ValueClass extends GenericTableValue<DataType>> extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        return compareValue<DataType>((left as ValueClass).definedData, (right as ValueClass).definedData);
    }
}

export class StringTableField extends GenericTableField<string, StringTableValue> { }
export class IntegerTableField extends GenericTableField<Integer, IntegerTableValue> { }
export class NumberTableField extends GenericTableField<number, NumberTableValue> { }

export class DecimalTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        return compareDecimal((left as DecimalTableValue).definedData.value, (right as DecimalTableValue).definedData.value);
    }
}
export class DateTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        return compareDate((left as DateTableValue).definedData, (right as DateTableValue).definedData);
    }
}
export class IvemIdTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        const leftIvemId = (left as IvemIdTableValue).definedData;
        const rightIvemId = (right as IvemIdTableValue).definedData;
        return IvemId.compare(leftIvemId, rightIvemId);
    }
}
export class DataIvemIdTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        const leftDataIvemId = (left as DataIvemIdTableValue).definedData;
        const rightDataIvemId = (right as DataIvemIdTableValue).definedData;
        return MarketIvemId.compare(leftDataIvemId, rightDataIvemId);
    }
}
export class BooleanTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        const leftTextFormattableValue = left.textFormattableValue;
        const rightTextFormattableValue = right.textFormattableValue;
        const leftFormattedText = this._textFormatter.format(leftTextFormattableValue);
        const rightFormattedText = this._textFormatter.format(rightTextFormattableValue);

        return compareString(leftFormattedText, rightFormattedText);
    }
}
export class EnumTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        const leftTextFormattableValue = left.textFormattableValue;
        const rightTextFormattableValue = right.textFormattableValue;
        const leftFormattedText = this._textFormatter.format(leftTextFormattableValue);
        const rightFormattedText = this._textFormatter.format(rightTextFormattableValue);

        return compareString(leftFormattedText, rightFormattedText);
    }
}

export class IntegerArrayTableField extends TableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        return compareArray<Integer>((left as IntegerArrayTableValue).definedData,
            (right as IntegerArrayTableValue).definedData);
    }
}

export abstract class CorrectnessTableField extends TableField {
}

export namespace CorrectnessTableField {
    export type Constructor = new(
        textFormatter: TextFormatter,
        definition: TableField.Definition,
        heading: string,
    ) => CorrectnessTableField;
}

// eslint-disable-next-line max-len
export class GenericCorrectnessTableField<
    DataType extends number | string,
    ValueClass extends GenericCorrectnessTableValue<DataType>
> extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        return compareValue<DataType>((left as ValueClass).definedData, (right as ValueClass).definedData);
    }
}

export class StringCorrectnessTableField extends GenericCorrectnessTableField<string, StringCorrectnessTableValue> { }
export class IntegerCorrectnessTableField extends GenericCorrectnessTableField<Integer, IntegerCorrectnessTableValue> { }
export class NumberCorrectnessTableField extends GenericCorrectnessTableField<number, NumberCorrectnessTableValue> { }

export class DecimalCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        return compareDecimal((left as DecimalCorrectnessTableValue).definedData.value,
            (right as DecimalCorrectnessTableValue).definedData.value);
    }
}
export class DateCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        return compareDate((left as DateCorrectnessTableValue).definedData,
            (right as DateCorrectnessTableValue).definedData);
    }
}
export class SourceTzOffsetDateTimeCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        return SourceTzOffsetDateTime.compare((left as BaseSourceTzOffsetDateTimeCorrectnessTableValue).definedData,
            (right as BaseSourceTzOffsetDateTimeCorrectnessTableValue).definedData);
    }
}
export class SourceTzOffsetDateCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        return SourceTzOffsetDate.compare((left as SourceTzOffsetDateCorrectnessTableValue).definedData,
            (right as SourceTzOffsetDateCorrectnessTableValue).definedData);
    }
}
export class IvemIdCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        const leftIvemId = (left as IvemIdCorrectnessTableValue).definedData;
        const rightIvemId = (right as IvemIdCorrectnessTableValue).definedData;
        return IvemId.compare(leftIvemId, rightIvemId);
    }
}
export class DataIvemIdCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        const leftDataIvemId = (left as DataIvemIdCorrectnessTableValue).definedData;
        const rightDataIvemId = (right as DataIvemIdCorrectnessTableValue).definedData;
        return MarketIvemId.compare(leftDataIvemId, rightDataIvemId);
    }
}
export class BooleanCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        const leftTextFormattableValue = left.textFormattableValue;
        const rightTextFormattableValue = right.textFormattableValue;
        const leftFormattedText = this._textFormatter.format(leftTextFormattableValue);
        const rightFormattedText = this._textFormatter.format(rightTextFormattableValue);

        return compareString(leftFormattedText, rightFormattedText);
    }
}
export class EnumCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: CorrectnessTableValue, right: CorrectnessTableValue): number {
        const leftTextFormattableValue = left.textFormattableValue;
        const rightTextFormattableValue = right.textFormattableValue;
        const leftFormattedText = this._textFormatter.format(leftTextFormattableValue);
        const rightFormattedText = this._textFormatter.format(rightTextFormattableValue);

        return compareString(leftFormattedText, rightFormattedText);
    }
}

export class StringArrayCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        return compareArray<string>((left as StringArrayCorrectnessTableValue).definedData,
            (right as StringArrayCorrectnessTableValue).definedData);
    }
}

export class IntegerArrayCorrectnessTableField extends CorrectnessTableField {
    protected compareDefined(left: TableValue, right: TableValue): number {
        return compareArray<Integer>((left as IntegerArrayCorrectnessTableValue).definedData,
            (right as IntegerArrayCorrectnessTableValue).definedData);
    }
}
