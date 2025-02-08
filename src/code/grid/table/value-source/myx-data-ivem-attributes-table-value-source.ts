import { MyxDataIvemAttributes, SearchSymbolsDataIvemFullDetail, SymbolsDataItem } from '../../../adi/internal-api';
import { Integer, MultiEvent, UnreachableCaseError } from '../../../sys/internal-api';
import { MyxDataIvemAttributesTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import {
    CorrectnessTableValue,
    DeliveryBasisIdMyxDataIvemAttributeCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    MarketClassificationIdMyxDataIvemAttributeCorrectnessTableValue,
    PercentageCorrectnessTableValue,
    ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue,
    TableValue
} from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class MyxDataIvemAttributesTableValueSource extends TableValueSource {
    private _dataIvemDetailExtendedChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(firstFieldIndexOffset: Integer, private _dataIvemFullDetail: SearchSymbolsDataIvemFullDetail, private _dataItem: SymbolsDataItem) {
        super(firstFieldIndexOffset);
    }

    activate(): TableValue[] {
        this._dataIvemDetailExtendedChangedEventSubscriptionId = this._dataIvemFullDetail.subscribeExtendedChangeEvent(
            (changedFieldIds) => this.handleDetailChangedEvent(changedFieldIds)
        );

        return this.getAllValues();
    }

    deactivate() {
        if (this._dataIvemDetailExtendedChangedEventSubscriptionId !== undefined) {
            this._dataIvemFullDetail.unsubscribeExtendedChangeEvent(this._dataIvemDetailExtendedChangedEventSubscriptionId);
            this._dataIvemDetailExtendedChangedEventSubscriptionId = undefined;
        }
    }

    getAllValues(): TableValue[] {
        const fieldCount = MyxDataIvemAttributesTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getfieldCount(): Integer {
        return MyxDataIvemAttributesTableFieldSourceDefinition.Field.count;
    }

    private handleDetailChangedEvent(changedFieldIds: SearchSymbolsDataIvemFullDetail.ExtendedField.Id[]) {
        if (changedFieldIds.includes(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Attributes)) {
            const allValues = this.getAllValues();
            this.notifyAllValuesChangeEvent(allValues);
        }
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = MyxDataIvemAttributesTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: MyxDataIvemAttributes.Field.Id, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._dataItem.correctnessId;

        const attributes = this._dataIvemFullDetail.attributes as MyxDataIvemAttributes | undefined;

        switch (id) {
            case MyxDataIvemAttributes.Field.Id.Category: {
                const categoryValue = value as IntegerCorrectnessTableValue;
                categoryValue.data = attributes?.category;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.MarketClassification: {
                const marketClassificationIdValue = value as MarketClassificationIdMyxDataIvemAttributeCorrectnessTableValue;
                marketClassificationIdValue.data = attributes?.marketClassificationId;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.DeliveryBasis: {
                const deliveryBasisIdValue = value as DeliveryBasisIdMyxDataIvemAttributeCorrectnessTableValue;
                deliveryBasisIdValue.data = attributes?.deliveryBasisId;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.MaxRSS: {
                const maxRssValue = value as PercentageCorrectnessTableValue;
                maxRssValue.data = attributes?.maxRss;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.Sector: {
                const sectorValue = value as IntegerCorrectnessTableValue;
                sectorValue.data = attributes?.sector;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.Short: {
                const shortValue = value as ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue;
                shortValue.data = attributes?.short;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.ShortSuspended: {
                const shortSuspendedValue = value as ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue;
                shortSuspendedValue.data = attributes?.shortSuspended;
                break;
            }
            case MyxDataIvemAttributes.Field.Id.SubSector: {
                const subSectorValue = value as IntegerCorrectnessTableValue;
                subSectorValue.data = attributes?.subSector;
                break;
            }
            default:
                throw new UnreachableCaseError('MLIATVSLV38228338', id);
        }
    }
}
