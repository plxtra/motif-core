import { MultiEvent, UsableListChangeTypeId } from '@xilytix/sysutils';
import { SelectItemUiAction } from '@xilytix/ui-action';
import { DataMarket, Market, MarketsService } from '../adi/internal-api';

/** @public */
export class MarketListSelectItemUiAction<T extends Market> extends SelectItemUiAction<T> {
    private _marketListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _markets: MarketsService.Markets<T>, valueRequired: boolean | undefined = true) {
        super(_markets.genericUnknownMarket, valueRequired);

        this._marketListChangeSubscriptionId = this._markets.subscribeListChangeEvent(
            (listChangeTypeId) => this.handleMarketListChange(listChangeTypeId)
        );
    }

    override finalise() {
        this._markets.unsubscribeListChangeEvent(this._marketListChangeSubscriptionId);
        this._marketListChangeSubscriptionId = undefined;
    }

    getItemProperties(item: T) {
        return this.createItemProperties(item);
    }

    getItemPropertiesArray() {
        const markets = this._markets;
        const count = markets.count;
        const result = new Array<SelectItemUiAction.ItemProperties<T>>(count);
        for (let i = 0; i < count; i++) {
            const market = markets.getAt(i);
            result[i] = this.createItemProperties(market);
        }
        return result;
    }

    private handleMarketListChange(listChangeTypeId: UsableListChangeTypeId) {
        if (listChangeTypeId === UsableListChangeTypeId.PreUsableAdd || listChangeTypeId === UsableListChangeTypeId.Insert) {
            this.notifyListPush(undefined);
        }
    }

    private createItemProperties(market: T) {
        const result: SelectItemUiAction.ItemProperties<T> = {
            item: market,
            caption: market.symbologyCode,
            title: market.display,
        };
        return result;
    }
}

/** @public */
export namespace MarketListSelectItemUiAction {
    export type ItemProperties = SelectItemUiAction.ItemProperties<DataMarket>;
}
