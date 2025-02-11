import { MultiEvent } from '@xilytix/sysutils';
import { SelectItemsUiAction } from '@xilytix/ui-action';
import { Exchange, MarketsService } from '../adi/internal-api';

/** @public */
export class ExchangeListSelectItemsUiAction extends SelectItemsUiAction<Exchange> {
    private _exchangesListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _marketsService: MarketsService, valueRequired: boolean | undefined = true) {
        super(valueRequired);

        this._exchangesListChangeSubscriptionId = this._marketsService.exchanges.subscribeListChangeEvent(
            () => this.handleAllowedExchangeIdsChanged()
        );
    }

    override finalise() {
        this._marketsService.exchanges.unsubscribeListChangeEvent(this._exchangesListChangeSubscriptionId);
        this._exchangesListChangeSubscriptionId = undefined;
    }

    getItemProperties(item: Exchange) {
        return this.createItemProperties(item);
    }

    getItemPropertiesArray() {
        const exchanges = this._marketsService.exchanges;
        const count = exchanges.count;
        const result = new Array<SelectItemsUiAction.ItemProperties<Exchange>>(count);
        for (let i = 0; i < count; i++) {
            const exchange = exchanges.getAt(i);
            result[i] = this.createItemProperties(exchange);
        }
        return result;
    }

    private handleAllowedExchangeIdsChanged() {
        this.notifyListPush(undefined);
    }

    private createItemProperties(exchange: Exchange) {
        const result: SelectItemsUiAction.ItemProperties<Exchange> = {
            item: exchange,
            caption: exchange.abbreviatedDisplay,
            title: exchange.fullDisplay,
        };
        return result;
    }
}

/** @public */
export namespace ExchangeListSelectItemsUiAction {
    export type ItemProperties = SelectItemsUiAction.ItemProperties<Exchange>;
}
