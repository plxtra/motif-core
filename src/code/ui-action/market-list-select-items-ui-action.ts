import { MultiEvent, UsableListChangeTypeId } from '@pbkware/js-utils';
import { SelectItemsUiAction } from '@pbkware/ui-action';
import { DataMarket, MarketsService } from '../adi';

/** @public */
export class MarketListSelectItemsUiAction extends SelectItemsUiAction<DataMarket> {
    private _marketListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _marketsService: MarketsService, valueRequired: boolean | undefined = true) {
        super(valueRequired);

        this._marketListChangeSubscriptionId = this._marketsService.dataMarkets.subscribeListChangeEvent(
            (listChangeTypeId) => this.handleMarketListChange(listChangeTypeId)
        );
    }

    override finalise() {
        this._marketsService.dataMarkets.unsubscribeListChangeEvent(this._marketListChangeSubscriptionId);
        this._marketListChangeSubscriptionId = undefined;
    }

    getItemProperties(item: DataMarket) {
        return this.createItemProperties(item);
    }

    getItemPropertiesArray() {
        const markets = this._marketsService.dataMarkets;
        const count = markets.count;
        const result = new Array<SelectItemsUiAction.ItemProperties<DataMarket>>(count);
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

    private createItemProperties(market: DataMarket) {
        const result: SelectItemsUiAction.ItemProperties<DataMarket> = {
            item: market,
            caption: market.symbologyCode,
            title: market.display,
        };
        return result;
    }
}

/** @public */
export namespace MarketListSelectItemsUiAction {
    export type ItemProperties = SelectItemsUiAction.ItemProperties<DataMarket>;
}
