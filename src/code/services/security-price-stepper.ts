import { Decimal } from 'decimal.js-light';
import { SymbolDetailCacheService } from './symbol-detail-cache-service';

export class SecurityPriceStepper {
    // needs more work
    constructor(private _detail: SymbolDetailCacheService.DataIvemIdDetail) { }

    isOnStep(price: Decimal) {
        return true;
    }
}
