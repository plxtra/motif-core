import { JsonElement, Ok, Result } from '@xilytix/sysutils';
import { DataIvemId, DataMarket, Market, MarketIvemId, MarketsService } from '../../adi/internal-api';
import { ErrorCode, JsonElementErr } from "../../sys/internal-api";
import { RankedDataIvemIdListDefinition } from './ranked-data-ivem-id-list-definition';

export class DataIvemIdArrayRankedDataIvemIdListDefinition extends RankedDataIvemIdListDefinition {
    constructor(
        readonly name: string,
        readonly description: string,
        readonly category: string,
        readonly dataIvemIds: readonly DataIvemId[]
    ) {
        super(RankedDataIvemIdListDefinition.TypeId.DataIvemIdArray);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const elementArray = MarketIvemId.createJsonElementArray(this.dataIvemIds);
        element.setElementArray(DataIvemIdArrayRankedDataIvemIdListDefinition.dataIvemIdsJsonName, elementArray);
    }
}

export namespace DataIvemIdArrayRankedDataIvemIdListDefinition {
    export const nameJsonName = 'name';
    export const descriptionJsonName = 'description';
    export const categoryJsonName = 'category';
    export const dataIvemIdsJsonName = 'dataIvemIds';

    export function tryCreateFromJson(markets: MarketsService.Markets<DataMarket>, element: JsonElement): Result<DataIvemIdArrayRankedDataIvemIdListDefinition> {
        const dataIvemIdsResult = tryCreateMarketIvemIdsFromJson(markets, element, DataIvemId);
        if (dataIvemIdsResult.isErr()) {
            const error = dataIvemIdsResult.error as ErrorCode;
            if (error === ErrorCode.DataIvemIdArrayRankedDataIvemIdListDefinition_JsonArrayNotSpecified) {
                return dataIvemIdsResult.createOuter(ErrorCode.DataIvemIdArrayRankedDataIvemIdListDefinition_JsonNotSpecified);
            } else {
                return dataIvemIdsResult.createOuter(ErrorCode.DataIvemIdArrayRankedDataIvemIdListDefinition_JsonIsInvalid);
            }
        } else {
            const name = element.getString(nameJsonName, '');
            const description = element.getString(descriptionJsonName, '');
            const category = element.getString(categoryJsonName, '');
            const definition = new DataIvemIdArrayRankedDataIvemIdListDefinition(name, description, category, dataIvemIdsResult.value);
            return new Ok(definition);
        }
    }

    export function tryCreateMarketIvemIdsFromJson<T extends Market>(markets: MarketsService.Markets<T>, element: JsonElement, constructor: MarketIvemId.Constructor<T>): Result<MarketIvemId<T>[]> {
        const elementArrayResult = element.tryGetElementArray(dataIvemIdsJsonName);
        if (elementArrayResult.isErr()) {
            const errorId = elementArrayResult.error;
            if (errorId === JsonElement.ErrorId.JsonValueIsNotDefined) {
                return JsonElementErr.createOuter(elementArrayResult.error, ErrorCode.DataIvemIdArrayRankedDataIvemIdListDefinition_JsonArrayNotSpecified);
            } else {
                return JsonElementErr.createOuter(elementArrayResult.error, ErrorCode.DataIvemIdArrayRankedDataIvemIdListDefinition_JsonArrayIsInvalid);
            }
        } else {
            const marketIvemIdsResult = MarketIvemId.tryCreateArrayFromJsonElementArray(markets, elementArrayResult.value, constructor, false);
            if (marketIvemIdsResult.isErr()) {
                return marketIvemIdsResult.createOuter(ErrorCode.MarketIvemIdArrayRankedDataIvemIdListDefinition_JsonDataIvemIdArrayIsInvalid);
            } else {
                return new Ok(marketIvemIdsResult.value);
            }
        }
    }
}
