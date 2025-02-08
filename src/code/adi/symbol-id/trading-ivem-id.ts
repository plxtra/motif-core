import { TradingMarket } from '../markets/internal-api';
import { DataIvemId } from './data-ivem-id';
import { MarketIvemId } from './market-ivem-id';

export class TradingIvemId extends MarketIvemId<TradingMarket> {
    override get bestLitDataIvemId(): DataIvemId | undefined {
        const tradingMarket = this.market;
        const dataMarket = tradingMarket.bestLitDataMarket;
        if (dataMarket === undefined) {
            return undefined;
        } else {
            return new DataIvemId(this.code, dataMarket);
        }
    }

    createCopy(): TradingIvemId {
        return new TradingIvemId(this.code, this.market); // ok to use destroyed market
    }
}

export namespace TradingIvemId {
    export type Constructor = new(code: string, market: TradingMarket) => TradingIvemId;
}
