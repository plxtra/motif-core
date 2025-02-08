import { DataMarket } from '../markets/internal-api';
import { MarketIvemId } from './market-ivem-id';

export class DataIvemId extends MarketIvemId<DataMarket> {
    override get bestLitDataIvemId(): MarketIvemId<DataMarket> | undefined { // make sure matches signature of base
        return this;
    }

    createCopy(): DataIvemId {
        return new DataIvemId(this.code, this.market); // ok to use destroyed market
    }
}

export namespace DataIvemId {
    export type Constructor = new(code: string, market: DataMarket) => DataIvemId;
}
