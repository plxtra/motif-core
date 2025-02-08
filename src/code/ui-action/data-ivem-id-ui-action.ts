import { DataIvemId, DataMarket, MarketsService } from '../adi/internal-api';
import { MarketIvemIdUiAction } from './market-ivem-id-ui-action';

export class DataIvemIdUiAction extends MarketIvemIdUiAction<DataMarket> {
    constructor(markets: MarketsService.Markets<DataMarket>, valueRequired?: boolean) {
        super(markets, DataIvemId, valueRequired)
    }
}
