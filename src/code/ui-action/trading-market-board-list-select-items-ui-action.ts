import { MultiEvent, UsableListChangeTypeId } from '@pbkware/js-utils';
import { SelectItemsUiAction } from '@pbkware/ui-action';
import { MarketBoard, MarketsService } from '../adi/internal-api';

export class MarketBoardListSelectItemsUiAction extends SelectItemsUiAction<MarketBoard> {
    private _marketBoardListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _marketsService: MarketsService, valueRequired: boolean | undefined = true) {
        super(valueRequired);

        this._marketBoardListChangeSubscriptionId = this._marketsService.marketBoards.subscribeListChangeEvent(
            (listChangeTypeId) => this.handleMarketBoardListChange(listChangeTypeId)
        );
    }

    override finalise() {
        this._marketsService.marketBoards.unsubscribeListChangeEvent(this._marketBoardListChangeSubscriptionId);
        this._marketBoardListChangeSubscriptionId = undefined;
    }

    getItemProperties(item: MarketBoard) {
        return this.createItemProperties(item);
    }

    getItemPropertiesArray() {
        const boards = this._marketsService.marketBoards;
        const count = boards.count;
        const result = new Array<SelectItemsUiAction.ItemProperties<MarketBoard>>(count);
        for (let i = 0; i < count; i++) {
            const board = boards.getAt(i);
            result[i] = this.createItemProperties(board);
        }
        return result;
    }

    private handleMarketBoardListChange(listChangeTypeId: UsableListChangeTypeId) {
        if (listChangeTypeId === UsableListChangeTypeId.PreUsableAdd || listChangeTypeId === UsableListChangeTypeId.Insert) {
            this.notifyListPush(undefined);
        }
    }

    private createItemProperties(board: MarketBoard) {
        const result: SelectItemsUiAction.ItemProperties<MarketBoard> = {
            item: board,
            caption: board.display,
            title: board.zenithCode,
        };
        return result;
    }
}

/** @public */
export namespace MarketBoardListSelectItemsUiAction {
    export type ItemProperties = SelectItemsUiAction.ItemProperties<MarketBoard>;
}
