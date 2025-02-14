import { DecimalConstructor, DecimalFactory } from '@xilytix/sysutils';
import { Config, Decimal } from 'decimal.js-light';

export class FactoryisedDecimal {
    constructor(readonly decimalFactory: DecimalFactory, readonly value: Decimal) {
    }

    createCopy(): FactoryisedDecimal {
        return new FactoryisedDecimal(this.decimalFactory, this.decimalFactory.newDecimal(this.value));
    }

    createCloneConstructor(config: Config): DecimalConstructor {
        return this.decimalFactory.cloneDecimal(config);
    }
}
