import { DataIvemAlternateCodesModule } from './data-ivem-alternate-codes';
import { DataTypesModule } from './data-types';
import { OrderStatusModule } from './order-status';
import { OrderTriggerModule } from './order-trigger';
import { TradingStateModule } from './trading-state';

export namespace CommonStaticInitialise {
    export function initialise() {
        DataTypesModule.initialiseStatic();
        TradingStateModule.initialiseStatic();
        OrderStatusModule.initialiseStatic();
        DataIvemAlternateCodesModule.initialiseStatic();
        OrderTriggerModule.initialiseStatic();
    }
}
