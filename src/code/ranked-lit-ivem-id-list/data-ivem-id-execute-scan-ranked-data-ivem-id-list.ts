import { AdiService, DataIvemIdExecuteScanDataDefinition, DataIvemIdScanMatchesDataItem, RankScoredDataIvemIdList } from '../adi/internal-api';
import { AssertInternalError } from "../sys/internal-api";
import { BaseRankedDataIvemIdList } from './base-ranked-data-ivem-id-list';
import { DataIvemIdExecuteScanRankedDataIvemIdListDefinition } from './definition/internal-api';

export class DataIvemIdExecuteScanRankedDataIvemIdList extends BaseRankedDataIvemIdList {
    readonly name: string;
    readonly description: string;
    readonly category: string;

    private readonly _dataDefinition: DataIvemIdExecuteScanDataDefinition;
    private _dataItem: DataIvemIdScanMatchesDataItem | undefined;

    constructor(
        private readonly _adiService: AdiService,
        definition: DataIvemIdExecuteScanRankedDataIvemIdListDefinition,
    ) {
        super(definition.typeId, false, false, false, false);
        this.name = definition.name;
        this.description = definition.description;
        this.category = definition.category;
        this._dataDefinition = definition.dataIvemIdExecuteScanDataDefinition;
    }

    createDefinition(): DataIvemIdExecuteScanRankedDataIvemIdListDefinition {
        const copyOfDataDefinition = new DataIvemIdExecuteScanDataDefinition();
        copyOfDataDefinition.zenithCriteria = this._dataDefinition.zenithCriteria;
        copyOfDataDefinition.zenithRank = this._dataDefinition.zenithRank;
        copyOfDataDefinition.targetTypeId = this._dataDefinition.targetTypeId;
        copyOfDataDefinition.targets = this._dataDefinition.targets;
        copyOfDataDefinition.maxMatchCount = this._dataDefinition.maxMatchCount;
        return new DataIvemIdExecuteScanRankedDataIvemIdListDefinition(this.name, this.description, this.category, copyOfDataDefinition);
    }

    override subscribeRankScoredDataIvemIdList(): RankScoredDataIvemIdList {
        this._dataItem = this._adiService.subscribe(this._dataDefinition) as DataIvemIdScanMatchesDataItem;
        return this._dataItem;
    }

    override unsubscribeRankScoredDataIvemIdList(): void {
        if (this._dataItem === undefined) {
            throw new AssertInternalError('LIIESRLIILURSLIISL31313');
        } else {
            this._adiService.unsubscribe(this._dataItem);
            this._dataItem = undefined;
        }
    }
}
