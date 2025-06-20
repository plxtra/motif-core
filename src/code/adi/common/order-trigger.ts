import {
    DecimalFactory,
    EnumInfoOutOfOrderError,
    UnreachableCaseError,
    isDecimalEqual,
    isUndefinableDecimalEqual,
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import { StringId, Strings } from '../../res';
import { Movement, MovementId, OrderTriggerTypeId } from './data-types';

export abstract class OrderTrigger {
    constructor(private _typeId: OrderTriggerTypeId) { }

    get typeId() { return this._typeId; }

    abstract get value(): Decimal | undefined;
    abstract get extraParamsText(): string | undefined;

    static isEqual(left: OrderTrigger, right: OrderTrigger) {
        if (left.typeId !== right.typeId) {
            return false;
        } else {
            switch (left.typeId) {
                case OrderTriggerTypeId.Immediate:
                    return ImmediateOrderTrigger.isEqual(left as ImmediateOrderTrigger, right as ImmediateOrderTrigger);
                case OrderTriggerTypeId.Price:
                    return PriceOrderTrigger.isEqual(left as PriceOrderTrigger, right as PriceOrderTrigger);
                case OrderTriggerTypeId.TrailingPrice:
                    return TrailingPriceOrderTrigger.isEqual(left as TrailingPriceOrderTrigger, right as TrailingPriceOrderTrigger);
                case OrderTriggerTypeId.PercentageTrailingPrice:
                    return PercentageTrailingPriceOrderTrigger.isEqual(
                        left as PercentageTrailingPriceOrderTrigger,
                        right as PercentageTrailingPriceOrderTrigger
                    );
                case OrderTriggerTypeId.Overnight:
                    return OvernightOrderTrigger.isEqual(left as OvernightOrderTrigger, right as OvernightOrderTrigger);
                default:
                    throw new UnreachableCaseError('OTIE3884343', left.typeId);
            }
        }
    }

    abstract createCopy(): OrderTrigger;
}

export class ImmediateOrderTrigger extends OrderTrigger {
    constructor() {
        super(OrderTriggerTypeId.Immediate);
    }

    get value() {
        return undefined;
    }
    get extraParamsText() {
        return undefined;
    }

    static override isEqual(left: ImmediateOrderTrigger, right: ImmediateOrderTrigger) {
        return true;
    }

    createCopy() {
        return new ImmediateOrderTrigger();
    }
}

export class PriceOrderTrigger extends OrderTrigger {
    private readonly _extraParamsText: string;

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        private readonly _value: Decimal | undefined,
        private readonly _fieldId: PriceOrderTrigger.FieldId | undefined,
        private readonly _movementId: MovementId | undefined,
    ) {
        super(OrderTriggerTypeId.Price);
        this._extraParamsText = this.generateExtraParamsText();
    }

    get value(): Decimal | undefined { return this._value; }
    get fieldId() { return this._fieldId; }
    get movementId() { return this._movementId; }

    get extraParamsText() { return this._extraParamsText; }

    createCopy() {
        return new PriceOrderTrigger(
            this._decimalFactory,
            this._decimalFactory.newUndefinableDecimal(this._value),
            this._fieldId,
            this._movementId
        );
    }


    private generateExtraParamsText() {
        const fieldId = this.fieldId;
        const movementId = this.movementId;
        if (fieldId === undefined) {
            return movementId === undefined ? '' : Movement.idToDisplay(movementId);
        } else {
            const fieldDisplay = PriceOrderTrigger.Field.idToDisplay(fieldId);
            return movementId === undefined ? fieldDisplay : fieldDisplay + ' ' + Movement.idToDisplay(movementId);
        }
    }
}

export namespace PriceOrderTrigger {
    export const enum FieldId {
        Last,
        BestBid,
        BestAsk,
    }

    export namespace Field {
        export const all = [
            FieldId.Last,
            FieldId.BestBid,
            FieldId.BestAsk,
        ];

        interface Info {
            readonly id: FieldId;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };

        const infosObject: InfosObject = {
            Last: {
                id: FieldId.Last,
                displayId: StringId.SecurityFieldDisplay_Last,
            },
            BestBid: {
                id: FieldId.BestBid,
                displayId: StringId.SecurityFieldDisplay_BestBid,
            },
            BestAsk: {
                id: FieldId.BestAsk,
                displayId: StringId.SecurityFieldDisplay_BestAsk,
            },
        } as const;

        const infos = Object.values(infosObject);
        const idCount = infos.length;

        export function initialise() {
            for (let i = 0; i < idCount; i++) {
                const info = infos[i];
                if (info.id !== i as FieldId) {
                    throw new EnumInfoOutOfOrderError('PriceOrderTrigger.FieldId', i, Strings[info.displayId]);
                }
            }
        }

        export function idToDisplay(id: FieldId) {
            return Strings[infos[id].displayId];
        }
    }

    export function isEqual(left: PriceOrderTrigger, right: PriceOrderTrigger) {
        return isUndefinableDecimalEqual(left.value, right.value) &&
            left.fieldId === right.fieldId &&
            left.movementId === right.movementId;
    }
}

export class TrailingPriceOrderTrigger extends OrderTrigger {
    value: Decimal;
    limit: Decimal;
    stop: Decimal | undefined;

    constructor() {
        super(OrderTriggerTypeId.TrailingPrice);
    }

    get extraParamsText() { return undefined; }

    static override isEqual(left: TrailingPriceOrderTrigger, right: TrailingPriceOrderTrigger) {
        return isDecimalEqual(left.value, right.value)
            && isDecimalEqual(left.limit, right.limit)
            && isUndefinableDecimalEqual(left.stop, right.stop);
    }

    createCopy() {
        const result = new TrailingPriceOrderTrigger();
        result.value = this.value;
        result.limit = this.limit;
        result.stop = this.stop;
        return result;
    }
}

export class PercentageTrailingPriceOrderTrigger extends OrderTrigger {
    value: Decimal;
    limit: Decimal;
    stop: Decimal | undefined;

    constructor() {
        super(OrderTriggerTypeId.PercentageTrailingPrice);
    }

    get extraParamsText() { return undefined; }

    static override isEqual(left: PercentageTrailingPriceOrderTrigger, right: PercentageTrailingPriceOrderTrigger) {
        return isDecimalEqual(left.value, right.value)
            && isDecimalEqual(left.limit, right.limit)
            && isUndefinableDecimalEqual(left.stop, right.stop);
    }

    createCopy() {
        const result = new TrailingPriceOrderTrigger();
        result.value = this.value;
        result.limit = this.limit;
        result.stop = this.stop;
        return result;
    }
}

export class OvernightOrderTrigger extends OrderTrigger {
    constructor() {
        super(OrderTriggerTypeId.Immediate);
    }

    get extraParamsText() { return undefined; }

    get value() {
        return undefined;
    }
    get limit() {
        return undefined;
    }
    get stop() {
        return undefined;
    }

    static override isEqual(left: OvernightOrderTrigger, right: OvernightOrderTrigger) {
        return true;
    }

    createCopy() {
        return new ImmediateOrderTrigger();
    }
}

export namespace OrderTriggerModule {
    export function initialiseStatic() {
        PriceOrderTrigger.Field.initialise();
    }
}
