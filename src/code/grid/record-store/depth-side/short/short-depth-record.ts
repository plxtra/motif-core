import {
    DecimalFactory,
    Integer,
    UnreachableCaseError,
    compareBoolean,
    compareInteger,
} from '@pbkware/js-utils';
import { RevRecordInvalidatedValue, RevRecordValueRecentChangeTypeId } from 'revgrid';
import { DepthLevelsDataItem, MarketsService, OrderSideId } from '../../../../adi';
import {
    IntegerTextFormattableValue,
    PriceOrRemainderAndHasUndisclosedTextFormattableValue,
    PriceOrRemainderTextFormattableValue,
    PriceTextFormattableValue,
    StringTextFormattableValue,
    TextFormattableValue
} from '../../../../services';
import {
    PriceOrRemainder,
    comparePriceOrRemainder
} from '../../../../sys';
import { DepthRecord } from '../depth-record';
import { DepthRecordTextFormattableValue } from '../depth-record-text-formattable-value';
import { ShortDepthSideField, ShortDepthSideFieldId } from './short-depth-side-field';

export class ShortDepthRecord extends DepthRecord {

    // protected renderRecord = new Array<TextFormattableValue | undefined>(ShortDepthSideField.idCount);

    constructor(
        decimalFactory: DecimalFactory,
        marketsService: MarketsService,
        index: Integer,
        private _level: DepthLevelsDataItem.Level,
        volumeAhead: Integer | undefined,
        auctionQuantity: Integer | undefined,
    ) {
        super(decimalFactory, marketsService, DepthRecord.TypeId.PriceLevel, index, volumeAhead, auctionQuantity);
    }

    get level() { return this._level; }
    get price(): PriceOrRemainder { return this._level.price; }
    get orderCount() { return this._level.orderCount; }
    get hasUndisclosed() { return this._level.hasUndisclosed; }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    getVolume() { return this._level.volume === undefined ? 0 : this._level.volume; } // virtual override
    getRenderVolume() { return this._level.volume; } // virtual override
    acceptedByFilter(filterXrefs: string[]) { // virtual override
        return true; // not supported in short depth so accept everything
    }

    processValueChanges(valueChanges: DepthLevelsDataItem.Level.ValueChange[]): RevRecordInvalidatedValue[] {
        const valueChangeCount = valueChanges.length;
        const result = new Array<RevRecordInvalidatedValue>(valueChangeCount * 2); // guess capacity
        let priceAndHasUndisclosedRecentChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;
        let count = 0;
        for (let i = 0; i < valueChangeCount; i++) {
            const valueChange = valueChanges[i];
            const { fieldId: valueChangeFieldId, recentChangeTypeId} = valueChange;
            let fieldId = ShortDepthSideField.createIdFromDepthLevelFieldId(valueChangeFieldId);
            if (fieldId !== undefined) {
                if (fieldId === ShortDepthSideFieldId.Price) {
                    priceAndHasUndisclosedRecentChangeTypeId = recentChangeTypeId;
                } else {
                    if (fieldId === ShortDepthSideFieldId.PriceAndHasUndisclosed) {
                        // was just Undisclosed DepthLevelFieldId. Record recentChangeTypeId. Priority goes to Price RecentChangeTypeId
                        if (priceAndHasUndisclosedRecentChangeTypeId !== undefined) {
                            priceAndHasUndisclosedRecentChangeTypeId = recentChangeTypeId;
                        }
                        fieldId = undefined; // will be added later
                    }
                }
            }

            if (fieldId !== undefined) {
                const invalidatedRecordField: RevRecordInvalidatedValue = {
                    fieldIndex: fieldId, // Fields are added in order of their fieldId (ShortDepthSideFieldId) so fieldIndex equals fieldId
                    typeId: recentChangeTypeId,
                };
                if (count === result.length) {
                    result.length *= 2;
                }
                result[count++] = invalidatedRecordField;
            }
        }

        if (priceAndHasUndisclosedRecentChangeTypeId === undefined) {
            result.length = count;
        } else {
            const invalidatedRecordField: RevRecordInvalidatedValue = {
                fieldIndex: ShortDepthSideFieldId.PriceAndHasUndisclosed,
                typeId: priceAndHasUndisclosedRecentChangeTypeId,
            };
            const idx = count;
            result.length = ++count;
            result[idx] = invalidatedRecordField;
        }

        return result;
    }

    getTextFormattableValue(id: ShortDepthSideFieldId, sideId: OrderSideId, dataCorrectnessAttribute: TextFormattableValue.Attribute | undefined) {
        const { textFormattableValue, extraAttribute } = this.createTextFormattableValue(id);

        // Create attributes array.  First figure out how many elements
        let attributeCount = 1;
        if (dataCorrectnessAttribute !== undefined) {
            attributeCount++;
        }
        if (extraAttribute !== undefined) {
            attributeCount++;
        }

        // Create array
        const attributes = new Array<TextFormattableValue.Attribute>(attributeCount);

        // Add required elements - must be in correct order
        let attributeIdx = 0;
        if (dataCorrectnessAttribute !== undefined) {
            attributes[attributeIdx++] = dataCorrectnessAttribute;
        }
        if (extraAttribute !== undefined) {
            attributes[attributeIdx++] = extraAttribute;
        }
        const recordAttribute: DepthRecordTextFormattableValue.Attribute = {
            typeId: TextFormattableValue.Attribute.TypeId.DepthRecord,
            orderSideId: sideId,
            depthRecordTypeId: DepthRecord.TypeId.PriceLevel,
            ownOrder: false,
        };
        attributes[attributeIdx] = recordAttribute;

        textFormattableValue.setAttributes(attributes);
        return textFormattableValue;
    }

    private createPriceAndHasUndisclosedTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult  {
        const decimalConstructor = PriceTextFormattableValue.getDecimalConstructor(this._decimalFactory);
        const data: PriceOrRemainderAndHasUndisclosedTextFormattableValue.DataType = {
            price: this._level.price === null ? null : new decimalConstructor(this._level.price),
            hasUndisclosed: this._level.hasUndisclosed,
        };
        const textFormattableValue = new PriceOrRemainderAndHasUndisclosedTextFormattableValue(data);
        return { textFormattableValue };
    }
    private createMarketDisplayTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const level = this._level;
        let market = level.market;
        let display: string | undefined;
        if (market === undefined) {
            const marketZenithCode = level.marketZenithCode;
            if (marketZenithCode === undefined) {
                market = null;
            } else {
                market = this._marketsService.dataMarkets.findZenithCode(marketZenithCode);
                if (market === undefined) {
                    market = null; // Dont try again
                }
            }
            level.market = market;
        }
        if (market === null) {
            display = level.marketZenithCode;
        } else {
            display = market.display;
        }

        const textFormattableValue = new StringTextFormattableValue(display);
        return { textFormattableValue };
    }
    private createPriceTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new PriceOrRemainderTextFormattableValue(this._decimalFactory, this._level.price);
        return { textFormattableValue };
    }
    private createOrderCountTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new IntegerTextFormattableValue(this._level.orderCount);
        return { textFormattableValue };
    }

    private createTextFormattableValue(id: ShortDepthSideFieldId): DepthRecord.CreateTextFormattableValueResult {
        switch (id) {
            case ShortDepthSideFieldId.PriceAndHasUndisclosed: return this.createPriceAndHasUndisclosedTextFormattableValue();
            case ShortDepthSideFieldId.Volume: return this.createVolumeTextFormattableValue();
            case ShortDepthSideFieldId.OrderCount: return this.createOrderCountTextFormattableValue();
            case ShortDepthSideFieldId.MarketId: return this.createMarketDisplayTextFormattableValue();
            case ShortDepthSideFieldId.VolumeAhead: return this.createVolumeAheadTextFormattableValue();
            case ShortDepthSideFieldId.Price: return this.createPriceTextFormattableValue();
            default: throw new UnreachableCaseError('SDROFDRCRV23232887', id);
        }
    }
}

export namespace ShortDepthRecord {

    function comparePriceAndHasUndisclosedField(left: ShortDepthRecord, right: ShortDepthRecord) {
        let result = comparePriceField(left, right, left.level.sideId);
        if (result === 0) {
            result = compareBoolean(left.hasUndisclosed, right.hasUndisclosed);
        }
        return result;
    }

    function compareQuantityField(left: ShortDepthRecord, right: ShortDepthRecord) {
        return compareInteger(left.getVolume(), right.getVolume());
    }

    function compareVolumeAheadField(left: ShortDepthRecord, right: ShortDepthRecord) {
        if (left.volumeAhead !== undefined) {
            if (right.volumeAhead !== undefined) {
                return compareInteger(left.volumeAhead, right.volumeAhead);
            } else {
                return -1;
            }
        } else {
            if (right.volumeAhead !== undefined) {
                return 1;
            } else {
                return comparePriceField(left, right, left.level.sideId);
            }
        }
    }

    function comparePriceField(left: ShortDepthRecord, right: ShortDepthRecord, sideId: OrderSideId) {
        const remainderAtMax = sideId === OrderSideId.Ask;
        return comparePriceOrRemainder(left.price, right.price, remainderAtMax);
    }

    function compareOrderCount(left: ShortDepthRecord, right: ShortDepthRecord) {
        const leftOrderCount = left.orderCount;
        const rightOrderCount = right.orderCount;
        if (leftOrderCount === undefined) {
            return rightOrderCount === undefined ? 0 : 1;
        } else {
            if (rightOrderCount === undefined) {
                return -1;
            } else {
                return compareInteger(leftOrderCount, rightOrderCount);
            }
        }
    }

    export function compareField(id: ShortDepthSideFieldId, left: ShortDepthRecord, right: ShortDepthRecord): number {
        switch (id) {
            case ShortDepthSideFieldId.PriceAndHasUndisclosed: return comparePriceAndHasUndisclosedField(left, right);
            case ShortDepthSideFieldId.Volume: return compareQuantityField(left, right);
            case ShortDepthSideFieldId.OrderCount: return compareOrderCount(left, right);
            case ShortDepthSideFieldId.MarketId: return 0;
            case ShortDepthSideFieldId.VolumeAhead: return compareVolumeAheadField(left, right);
            case ShortDepthSideFieldId.Price: return comparePriceField(left, right, left.level.sideId);
            default: throw new UnreachableCaseError('SDRCF22285', id);
        }
    }

    export function compareFieldDesc(id: ShortDepthSideFieldId, left: ShortDepthRecord, right: ShortDepthRecord): number {
        switch (id) {
            case ShortDepthSideFieldId.PriceAndHasUndisclosed: return comparePriceAndHasUndisclosedField(left, right) * -1;
            case ShortDepthSideFieldId.Volume: return compareQuantityField(left, right) * -1;
            case ShortDepthSideFieldId.OrderCount: return compareOrderCount(left, right) * -1;
            case ShortDepthSideFieldId.MarketId: return 0;
            case ShortDepthSideFieldId.VolumeAhead: return compareVolumeAheadField(left, right) * -1;
            case ShortDepthSideFieldId.Price: return comparePriceField(left, right, left.level.sideId) * -1;
            default: throw new UnreachableCaseError('SDRCFD22285', id);
        }
    }
}
