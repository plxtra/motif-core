import { DataMarket } from '../adi';
import { MarketUiAction } from './market-ui-action';

export class DataMarketUiAction extends MarketUiAction<DataMarket> {
}

export namespace DataMarketUiAction {
    export type PushEventHandlersInterface = MarketUiAction.PushEventHandlersInterface<DataMarket>;
}
