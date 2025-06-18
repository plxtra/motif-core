import { AdiService } from '../adi';
import { SecurityPriceStepper } from './security-price-stepper';
import { SymbolDetailCacheService } from './symbol-detail-cache-service';

export class PriceStepperIncubator {
    constructor(private _adi: AdiService) {

    }

    // may need information from server.  If so, return a promise
    incubate(detail: SymbolDetailCacheService.DataIvemIdDetail): SecurityPriceStepper | Promise<SecurityPriceStepper | undefined> {
        return new SecurityPriceStepper(detail);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initialise() {

    }

    finalise() {
        // cancel subscription if used in future
    }
}

export namespace PriceStepperIncubator {
    export function isStepper(stepperOrPromise:
        SecurityPriceStepper | Promise<SecurityPriceStepper | undefined>
    ): stepperOrPromise is SecurityPriceStepper {
        return stepperOrPromise instanceof SecurityPriceStepper;
    }
}
