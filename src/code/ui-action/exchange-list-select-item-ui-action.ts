import { SelectItemUiAction } from '@xilytix/ui-action';
import { Exchange, MarketsService } from '../adi/internal-api';
import { MultiEvent, UsableListChangeTypeId } from '../sys/internal-api';

/** @public */
export class ExchangeListSelectItemUiAction extends SelectItemUiAction<Exchange> {
    private _exchangeListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _marketsService: MarketsService, valueRequired: boolean | undefined = true) {
        super(_marketsService.genericUnknownExchange, valueRequired);

        this._exchangeListChangeSubscriptionId = this._marketsService.exchanges.subscribeListChangeEvent(
            (listChangeTypeId) => this.handleExchangeListChange(listChangeTypeId)
        );
    }

    override finalise() {
        this._marketsService.exchanges.unsubscribeListChangeEvent(this._exchangeListChangeSubscriptionId);
        this._exchangeListChangeSubscriptionId = undefined;
    }

    getItemProperties(item: Exchange) {
        return this.createItemProperties(item);
    }

    getItemPropertiesArray() {
        const exchanges = this._marketsService.exchanges;
        const count = exchanges.count;
        const result = new Array<SelectItemUiAction.ItemProperties<Exchange>>(count);
        for (let i = 0; i < count; i++) {
            const exchange = exchanges.getAt(i);
            result[i] = this.createItemProperties(exchange);
        }
        return result;
    }

    private handleExchangeListChange(listChangeTypeId: UsableListChangeTypeId) {
        if (listChangeTypeId === UsableListChangeTypeId.PreUsableAdd || listChangeTypeId === UsableListChangeTypeId.Insert) {
            this.notifyListPush(undefined);
        }
    }

    private createItemProperties(exchange: Exchange) {
        const result: SelectItemUiAction.ItemProperties<Exchange> = {
            item: exchange,
            caption: exchange.abbreviatedDisplay,
            title: exchange.fullDisplay,
        };
        return result;
    }
}

/** @public */
export namespace ExchangeListSelectItemUiAction {
    export type ItemProperties = SelectItemUiAction.ItemProperties<Exchange>;
}
