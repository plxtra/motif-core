import { SelectItemUiAction } from '@xilytix/ui-action';
import { MarketBoard, MarketsService } from '../adi/internal-api';
import { MultiEvent, UsableListChangeTypeId } from '../sys/internal-api';

/** @public */
export class MarketBoardListSelectItemUiAction extends SelectItemUiAction<MarketBoard> {
    private _marketBoardListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _marketsService: MarketsService, valueRequired: boolean | undefined = true) {
        super(_marketsService.genericUnknownMarketBoard, valueRequired);

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
        const result = new Array<SelectItemUiAction.ItemProperties<MarketBoard>>(count);
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
        const result: SelectItemUiAction.ItemProperties<MarketBoard> = {
            item: board,
            caption: board.display,
            title: board.zenithCode,
        };
        return result;
    }
}

/** @public */
export namespace MarketBoardListSelectItemUiAction {
    export type ItemProperties = SelectItemUiAction.ItemProperties<MarketBoard>;
}
