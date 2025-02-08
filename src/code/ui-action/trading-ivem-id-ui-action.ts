import { MarketsService, TradingIvemId, TradingMarket } from '../adi/internal-api';
import { MarketIvemIdUiAction } from './market-ivem-id-ui-action';

export class TradingIvemIdUiAction extends MarketIvemIdUiAction<TradingMarket> {
    constructor(markets: MarketsService.Markets<TradingMarket>, valueRequired?: boolean) {
        super(markets, TradingIvemId, valueRequired)
    }
}
