import { TradingMarket } from '../adi/internal-api';
import { MarketUiAction } from './market-ui-action';

export class TradingMarketUiAction extends MarketUiAction<TradingMarket> {
}

export namespace TradingMarketUiAction {
    export type PushEventHandlersInterface = MarketUiAction.PushEventHandlersInterface<TradingMarket>;
}
