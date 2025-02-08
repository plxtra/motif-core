import { SysDecimal } from '../sys/internal-api';
import { SymbolDetailCacheService } from './symbol-detail-cache-service';

export class SecurityPriceStepper {
    // needs more work
    constructor(private _detail: SymbolDetailCacheService.DataIvemIdDetail) { }

    isOnStep(price: SysDecimal) {
        return true;
    }
}
