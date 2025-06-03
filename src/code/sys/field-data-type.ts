import { EnumInfoOutOfOrderError } from '@pbkware/js-utils';

export const enum FieldDataTypeId {
    String,
    StringArray,
    Integer,
    Number,
    Decimal,
    DecimalOrDouble,
    Date,
    DateTime,
    Boolean,
    Enumeration,
    EnumerationArray,
    Object,
    ObjectArray,
}

export namespace FieldDataType {
    export type Id = FieldDataTypeId;
    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly isNumber: boolean;
        readonly isFloat: boolean;
    }

    type InfosObject = { [id in keyof typeof FieldDataTypeId]: Info };

    const infosObject: InfosObject = {
        String: {
            id: FieldDataTypeId.String,
            name: 'String',
            isNumber: false,
            isFloat: false,
        },
        StringArray: {
            id: FieldDataTypeId.StringArray,
            name: 'StringArray',
            isNumber: false,
            isFloat: false,
        },
        Integer: {
            id: FieldDataTypeId.Integer,
            name: 'Integer',
            isNumber: true,
            isFloat: false,
        },
        Number: {
            id: FieldDataTypeId.Number,
            name: 'Double',
            isNumber: true,
            isFloat: true,
        },
        Decimal: {
            id: FieldDataTypeId.Decimal,
            name: 'Decimal',
            isNumber: true,
            isFloat: true,
        },
        DecimalOrDouble: {
            id: FieldDataTypeId.DecimalOrDouble,
            name: 'DecimalOrDouble',
            isNumber: true,
            isFloat: true,
        },
        Date: {
            id: FieldDataTypeId.Date,
            name: 'Date',
            isNumber: false,
            isFloat: false,
        },
        DateTime: {
            id: FieldDataTypeId.DateTime,
            name: 'DateTime',
            isNumber: false,
            isFloat: false,
        },
        Boolean: {
            id: FieldDataTypeId.Boolean,
            name: 'Boolean',
            isNumber: false,
            isFloat: false,
        },
        Enumeration: {
            id: FieldDataTypeId.Enumeration,
            name: 'Enumeration',
            isNumber: false,
            isFloat: false,
        },
        EnumerationArray: {
            id: FieldDataTypeId.EnumerationArray,
            name: 'EnumerationArray',
            isNumber: false,
            isFloat: false,
        },
        Object: {
            id: FieldDataTypeId.Object,
            name: 'Object',
            isNumber: false,
            isFloat: false,
        },
        ObjectArray: {
            id: FieldDataTypeId.ObjectArray,
            name: 'ObjectArray',
            isNumber: false,
            isFloat: false,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        for (let id = 0; id < FieldDataType.idCount; id++) {
            if (id as FieldDataType.Id !== infos[id].id) {
                throw new EnumInfoOutOfOrderError('FieldDataTypeId', id, infos[id].name);
            }
        }
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }
    export function idIsNumber(id: Id): boolean {
        return infos[id].isNumber;
    }
    export function idIsFloat(id: Id): boolean {
        return infos[id].isFloat;
    }
}

export namespace FieldDataTypeModule {
    export function initialiseStatic(): void {
        FieldDataType.initialise();
    }
}
