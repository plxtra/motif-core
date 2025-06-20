import {
    AssertInternalError,
    compareDecimal,
    compareInteger,
    DecimalFactory,
    Integer,
    isArrayEqual,
    isArrayEqualUniquely,
    uniqueElementArraysOverlap,
    UnreachableCaseError
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import { RevRecordInvalidatedValue, RevRecordValueRecentChangeTypeId } from 'revgrid';
import { DataMarket, DepthDataItem, MarketsService, OrderSideId } from '../../../../adi';
import {
    CountAndXrefsTextFormattableValue,
    FactoryisedDecimal,
    IntegerTextFormattableValue,
    PriceAndHasUndisclosedTextFormattableValue,
    PriceTextFormattableValue,
    StringArrayTextFormattableValue,
    StringTextFormattableValue,
    TextFormattableValue
} from '../../../../services';
import { DepthRecord } from '../depth-record';
import { DepthRecordTextFormattableValue } from '../depth-record-text-formattable-value';
import { FullDepthSideField, FullDepthSideFieldId } from './full-depth-side-field';

export abstract class FullDepthRecord extends DepthRecord {
    // protected renderRecord = new Array<TextFormattableValue | undefined>(FullDepthSideField.idCount);

    getTextFormattableValue(id: FullDepthSideFieldId, sideId: OrderSideId, dataCorrectnessAttribute: TextFormattableValue.Attribute | undefined) {
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
            depthRecordTypeId: this.typeId,
            ownOrder: this.isOwnOrder(),
        };
        attributes[attributeIdx] = recordAttribute;

        textFormattableValue.setAttributes(attributes);
        return textFormattableValue;
    }

    abstract getCount(): Integer;
    abstract getPrice(): Decimal;
    abstract getUndisclosedCount(): Integer;

    protected abstract createTextFormattableValue(id: FullDepthSideFieldId): DepthRecord.CreateTextFormattableValueResult;
    protected abstract isOwnOrder(): boolean;
}

export namespace FullDepthRecord {
    export function isPriceLevel(record: FullDepthRecord): record is PriceLevelFullDepthRecord {
        return record.typeId === DepthRecord.TypeId.PriceLevel;
    }

    export function isOrder(record: FullDepthRecord): record is OrderFullDepthRecord {
        return record.typeId === DepthRecord.TypeId.Order;
    }

    function comparePriceAndHasUndisclosedField(left: FullDepthRecord, right: FullDepthRecord) {
        let result = comparePriceField(left, right);
        if (result === 0) {
            result = compareInteger(left.getUndisclosedCount(), right.getUndisclosedCount());
        }
        return result;
    }

    function compareQuantityField(left: FullDepthRecord, right: FullDepthRecord) {
        return compareInteger(left.getVolume(), right.getVolume());
    }

    function compareVolumeAheadField(left: FullDepthRecord, right: FullDepthRecord) {
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
                return comparePriceField(left, right);
            }
        }
    }

    function comparePriceField(left: FullDepthRecord, right: FullDepthRecord) {
        return compareDecimal(left.getPrice(), right.getPrice());
    }

    function compareCount(left: FullDepthRecord, right: FullDepthRecord) {
        return compareInteger(left.getCount(), right.getCount());
    }

    export function compareField(id: FullDepthSideFieldId, left: FullDepthRecord, right: FullDepthRecord): number {
        switch (id) {
            case FullDepthSideFieldId.PriceAndHasUndisclosed: return comparePriceAndHasUndisclosedField(left, right);
            case FullDepthSideFieldId.Volume: return compareQuantityField(left, right);
            case FullDepthSideFieldId.CountXref: return 0;
            case FullDepthSideFieldId.BrokerId: return 0;
            case FullDepthSideFieldId.MarketId: return 0;
            case FullDepthSideFieldId.VolumeAhead: return compareVolumeAheadField(left, right);
            case FullDepthSideFieldId.Attributes: return 0;
            case FullDepthSideFieldId.Price: return comparePriceField(left, right);
            case FullDepthSideFieldId.Xref: return 0;
            case FullDepthSideFieldId.Count: return compareCount(left, right);
            case FullDepthSideFieldId.OrderId: return 0;
            default: throw new UnreachableCaseError('FDRCF22285', id);
        }
    }

    export function compareFieldDesc(id: FullDepthSideFieldId, left: FullDepthRecord, right: FullDepthRecord): number {
        switch (id) {
            case FullDepthSideFieldId.PriceAndHasUndisclosed: return comparePriceAndHasUndisclosedField(left, right) * -1;
            case FullDepthSideFieldId.Volume: return compareQuantityField(left, right) * -1;
            case FullDepthSideFieldId.CountXref: return 0;
            case FullDepthSideFieldId.BrokerId: return 0;
            case FullDepthSideFieldId.MarketId: return 0;
            case FullDepthSideFieldId.VolumeAhead: return compareVolumeAheadField(left, right) * -1;
            case FullDepthSideFieldId.Attributes: return 0;
            case FullDepthSideFieldId.Price: return comparePriceField(left, right) * -1;
            case FullDepthSideFieldId.Xref: return 0;
            case FullDepthSideFieldId.Count: return compareCount(left, right) * -1;
            case FullDepthSideFieldId.OrderId: return 0;
            default: throw new UnreachableCaseError('FDRCFD22285', id);
        }
    }
}

export class OrderFullDepthRecord extends FullDepthRecord {
    constructor(
        decimalFactory: DecimalFactory,
        marketsService: MarketsService,
        index: Integer,
        private _order: DepthDataItem.Order,
        volumeAhead: Integer | undefined,
        auctionQuantity: Integer | undefined
    ) {
        super(decimalFactory, marketsService, DepthRecord.TypeId.Order, index, volumeAhead, auctionQuantity);
    }

    get order() { return this._order; }
    getVolume() { return this._order.quantity; } // virtual override
    getRenderVolume() { return this._order.quantity; } // virtual override
    getCount() { return 1; } // virtual override
    getPrice(): Decimal { return this._order.price; } // virtual override
    getUndisclosedCount() { return this._order.hasUndisclosed ? 1 : 0; } // virtual override

    acceptedByFilter(filterXrefs: string[]): boolean {
        const xref = this.order.crossRef;
        if (xref === undefined) {
            return false;
        } else {
            if (filterXrefs.length === 0) {
                return true;
            } else {
                return filterXrefs.includes(xref);
            }
        }
    }

    processOrderValueChanges(valueChanges: DepthDataItem.Order.ValueChange[]): RevRecordInvalidatedValue[] {
        const valueChangeCount = valueChanges.length;
        const result = new Array<RevRecordInvalidatedValue>(valueChangeCount * 2); // guess capacity
        let priceAndHasUndisclosedRecentChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;
        let countXrefRecentChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;
        let count = 0;
        for (let i = 0; i < valueChangeCount; i++) {
            const valueChange = valueChanges[i];
            const { fieldId: valueChangeFieldId, recentChangeTypeId} = valueChange;
            let fieldId = FullDepthSideField.createIdFromDepthOrderFieldId(valueChangeFieldId);
            if (fieldId !== undefined) {
                if (fieldId === FullDepthSideFieldId.Price) {
                    priceAndHasUndisclosedRecentChangeTypeId = recentChangeTypeId;
                } else {
                    if (fieldId === FullDepthSideFieldId.PriceAndHasUndisclosed) {
                        // was just Undisclosed DepthLevelFieldId. Record recentChangeTypeId. Priority goes to Price RecentChangeTypeId
                        if (priceAndHasUndisclosedRecentChangeTypeId !== undefined) {
                            priceAndHasUndisclosedRecentChangeTypeId = recentChangeTypeId;
                        }
                        fieldId = undefined; // will be added later
                    } else {
                        if (fieldId === FullDepthSideFieldId.Xref) {
                            countXrefRecentChangeTypeId = recentChangeTypeId;
                        }
                    }
                }
            }

            if (fieldId !== undefined) {
                const invalidatedRecordField: RevRecordInvalidatedValue = {
                    fieldIndex: fieldId, // Fields are added in order of their fieldId (FullDepthSideFieldId) so fieldIndex equals fieldId
                    typeId: recentChangeTypeId,
                };
                if (count === result.length) {
                    result.length *= 2;
                }
                result[count++] = invalidatedRecordField;
            }
        }

        if (countXrefRecentChangeTypeId !== undefined) {
            const invalidatedRecordField: RevRecordInvalidatedValue = {
                fieldIndex: FullDepthSideFieldId.CountXref,
                typeId: countXrefRecentChangeTypeId,
            };
            if (count === result.length) {
                result.length += 2; // PriceAndHasUndisclosed may also be added
            }
            result[count++] = invalidatedRecordField;
        }

        if (priceAndHasUndisclosedRecentChangeTypeId === undefined) {
            result.length = count;
        } else {
            const invalidatedRecordField: RevRecordInvalidatedValue = {
                fieldIndex: FullDepthSideFieldId.PriceAndHasUndisclosed,
                typeId: priceAndHasUndisclosedRecentChangeTypeId,
            };
            const idx = count;
            result.length = ++count;
            result[idx] = invalidatedRecordField;
        }

        return result;
    }

    protected createTextFormattableValue(id: FullDepthSideFieldId): DepthRecord.CreateTextFormattableValueResult {  // virtual override
        switch (id) {
            case FullDepthSideFieldId.PriceAndHasUndisclosed: return this.createPriceAndHasUndisclosedTextFormattableValue();
            case FullDepthSideFieldId.Volume: return this.createVolumeTextFormattableValue();
            case FullDepthSideFieldId.CountXref: return this.createCountXrefTextFormattableValue();
            case FullDepthSideFieldId.BrokerId: return this.createBrokerIdTextFormattableValue();
            case FullDepthSideFieldId.MarketId: return this.createMarketDisplayTextFormattableValue();
            case FullDepthSideFieldId.VolumeAhead: return this.createVolumeAheadTextFormattableValue();
            case FullDepthSideFieldId.Attributes: return this.createAttributesTextFormattableValue();
            case FullDepthSideFieldId.Price: return this.createPriceTextFormattableValue();
            case FullDepthSideFieldId.Xref: return this.createXRefTextFormattableValue();
            case FullDepthSideFieldId.Count: return this.createCountTextFormattableValue();
            case FullDepthSideFieldId.OrderId: return this.createOrderIdTextFormattableValue();
            default: throw new UnreachableCaseError('FDROFDRCRV88736', id);
        }
    }

    protected isOwnOrder() { // virtual override
        return this._order.crossRef !== undefined;
    }

    private createPriceAndHasUndisclosedTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult  {
        const decimalConstructor = PriceTextFormattableValue.getDecimalConstructor(this._decimalFactory)
        const data: PriceAndHasUndisclosedTextFormattableValue.DataType = {
            price: new decimalConstructor(this.order.price),
            hasUndisclosed: this.order.hasUndisclosed
        };
        const textFormattableValue = new PriceAndHasUndisclosedTextFormattableValue(data);
        return { textFormattableValue };
    }
    private createCountXrefTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringTextFormattableValue(this.order.crossRef);
        const extraAttribute: TextFormattableValue.DepthCountXRefFieldAttribute = {
            typeId: TextFormattableValue.Attribute.TypeId.DepthCountXRefField,
            isCountAndXrefs: false,
        };
        return { textFormattableValue, extraAttribute };
    }
    private createBrokerIdTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringTextFormattableValue(this.order.broker);
        return { textFormattableValue };
    }
    private createMarketDisplayTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const order = this.order;
        let market = order.market;
        let display: string;
        if (market === undefined) {
            market = this._marketsService.dataMarkets.findZenithCode(order.marketZenithCode);
            if (market === undefined) {
                market = null; // Dont try again
            }
            order.market = market;
        }
        if (market === null) {
            display = order.marketZenithCode;
        } else {
            display = market.display;
        }
        const textFormattableValue = new StringTextFormattableValue(display);
        return { textFormattableValue };
    }
    private createAttributesTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringArrayTextFormattableValue(this.order.attributes);
        return { textFormattableValue };
    }
    private createPriceTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const price = this.order.price;
        const factoryisedPrice = new FactoryisedDecimal(this._decimalFactory, price);
        const textFormattableValue = new PriceTextFormattableValue(factoryisedPrice);
        return { textFormattableValue };
    }
    private createXRefTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringTextFormattableValue(this.order.crossRef);
        return { textFormattableValue };
    }
    private createCountTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new IntegerTextFormattableValue(1);
        return { textFormattableValue };
    }
    private createOrderIdTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringTextFormattableValue(this.order.orderId);
        return { textFormattableValue };
    }
}

export class PriceLevelFullDepthRecord extends FullDepthRecord {
    private _price: Decimal;
    private _count: Integer; // Number of orders at this price level.
    private _volume: Integer; // Total number of shares at this price level.
    private _marketZenithCodes: string[]; // Array of markets in orders
    private _undisclosedOrderCount: number; // 0 = no undisclosed amounts, >0 = undisclosed amounts in price level.
    private _xrefs: string[]; // Array of Xrefs in orders
    private _brokerIds: string[]; // Array of brokers in orders
    private _attributes: string[]; // Array of all attributes in all orders
    private _orders: DepthDataItem.Order[]; // all orders at this price level (not necessarily in correct order)
    private _markets: (DataMarket | undefined)[] | undefined; // Array of markets corresponding to _marketZenithCodes (null means corresponding Market not found)
    private _marketDisplays: string[] | undefined; // Array of market display or zenith code corresponding to marketZenithCodes

    constructor(
        decimalFactory: DecimalFactory,
        marketsService: MarketsService,
        index: Integer,
        firstOrder: DepthDataItem.Order,
        volumeAhead: Integer | undefined,
        auctionQuantity: Integer | undefined
    ) {
        super(decimalFactory, marketsService, DepthRecord.TypeId.PriceLevel, index, volumeAhead, auctionQuantity);

        this._price = this._decimalFactory.newDecimal(firstOrder.price);
        this._count = 1;
        this._volume = firstOrder.quantity;
        this._marketZenithCodes = [firstOrder.marketZenithCode];
        this._undisclosedOrderCount = firstOrder.hasUndisclosed ? 1 : 0;
        if (firstOrder.crossRef !== undefined) {
            this._xrefs = [firstOrder.crossRef];
        } else {
            this._xrefs = [];
        }
        if (firstOrder.broker !== undefined) {
            this._brokerIds = [firstOrder.broker];
        } else {
            this._brokerIds = [];
        }
        this._attributes = firstOrder.attributes;
        this._orders = new Array<DepthDataItem.Order>(1);
        this._orders[0] = firstOrder;
    }

    get price(): Decimal { return this._price; }
    get count() { return this._count; }
    get quantity() { return this._volume; }
    get marketIds() { return this._marketZenithCodes; }
    get undisclosedOrderCount() { return this._undisclosedOrderCount; }
    get xrefs() { return this._xrefs; }
    get brokerIds() { return this._brokerIds; }
    get attributes() { return this._attributes; }
    get orders() { return this._orders; }

    get hasUndisclosed() { return this._undisclosedOrderCount > 0; }

    getVolume() { return this._volume; } // virtual override
    getRenderVolume() { return this._volume; } // virtual override
    getCount() { return this._count; } // virtual override
    getPrice(): Decimal { return this.price; } // virtual override
    getUndisclosedCount() { return this._undisclosedOrderCount; } // virtual override

    acceptedByFilter(filterXrefs: string[]): boolean {
        const xrefs = this._xrefs;
        if (xrefs.length === 0) {
            return false;
        } else {
            if (filterXrefs.length === 0) {
                return true;
            } else {
                return uniqueElementArraysOverlap(xrefs, filterXrefs);
            }
        }
    }

    addOrder(order: DepthDataItem.Order): RevRecordInvalidatedValue[] {
        const changes = new Array<RevRecordInvalidatedValue>(8); // Set to maximum possible number of elements
        let changeCount = 0;

        this._count++;
        changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Count, typeId: RevRecordValueRecentChangeTypeId.Increase };
        changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.CountXref, typeId: RevRecordValueRecentChangeTypeId.Increase };

        this._volume += order.quantity;
        changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Volume, typeId: RevRecordValueRecentChangeTypeId.Increase };

        const marketId = order.marketZenithCode;
        if (this._marketZenithCodes.includes(marketId)) {
            this._marketZenithCodes.push(marketId);
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.MarketId, typeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (order.hasUndisclosed) {
            if (this._undisclosedOrderCount++ === 0) {
                changes[changeCount++] = {
                    fieldIndex: FullDepthSideFieldId.PriceAndHasUndisclosed, typeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        const xref = order.crossRef;
        if (xref !== undefined && !this._xrefs.includes(xref)) {
            this._xrefs.push(xref);
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Xref, typeId: RevRecordValueRecentChangeTypeId.Update };
        }

        const brokerId = order.broker;
        if (brokerId !== undefined && !this._brokerIds.includes(brokerId)) {
            this._brokerIds.push(brokerId);
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.BrokerId, typeId: RevRecordValueRecentChangeTypeId.Update };
        }

        let attributeAdded = false;
        for (const attribute of order.attributes) {
            if (!this._attributes.includes(attribute)) {
                this._attributes.push(attribute);
                attributeAdded = true;
            }
        }
        if (attributeAdded) {
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Attributes, typeId: RevRecordValueRecentChangeTypeId.Update };
        }

        this._orders.push(order);

        changes.length = changeCount;
        return changes;
    }

    addOrders(depthOrders: DepthDataItem.Order[], index: Integer, count: Integer): RevRecordInvalidatedValue[] {
        if (count === 0) {
            return [];
        } else {
            const changes = new Array<RevRecordInvalidatedValue>(8); // Set to maximum possible number of elements
            let changeCount = 0;

            this._count += count;
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Count, typeId: RevRecordValueRecentChangeTypeId.Increase };
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.CountXref, typeId: RevRecordValueRecentChangeTypeId.Increase };

            const oldHasUndisclosed = this.hasUndisclosed;

            for (let i = 0; i < count; i++) {
                const order = depthOrders[index + i];
                this._volume += order.quantity;
                if (order.hasUndisclosed) {
                    this._undisclosedOrderCount++;
                }
            }
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Volume, typeId: RevRecordValueRecentChangeTypeId.Increase };

            // check if hasUndisclosed has changed
            if (this.hasUndisclosed !== oldHasUndisclosed) {
                changes[changeCount++] = {
                    fieldIndex: FullDepthSideFieldId.PriceAndHasUndisclosed, typeId: RevRecordValueRecentChangeTypeId.Update
                };
            }

            this._orders.splice(this._orders.length, 0, ...depthOrders.slice(index, index + count));

            const newMarketZenithCodes = this.calculateMarketZenithCodes();
            if (newMarketZenithCodes.length !== this._marketZenithCodes.length) {
                this._marketZenithCodes = newMarketZenithCodes;
                this._markets = undefined;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.MarketId, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            const newXrefs = this.calculateXrefs();
            if (newXrefs.length !== this._xrefs.length) {
                this._xrefs = newXrefs;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Xref, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            const newBrokerIds = this.calculateBrokerIds();
            if (newBrokerIds.length !== this._brokerIds.length) {
                this._brokerIds = newBrokerIds;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.BrokerId, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            const newAttributes = this.calculateAttributes();
            if (newAttributes.length !== this._attributes.length) {
                this._attributes = newAttributes;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Attributes, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            changes.length = changeCount;
            return changes;
        }
    }

    removeOrder(
        order: DepthDataItem.Order,
        oldVolume: Integer,
        oldHasUndisclosed: boolean
    ): RevRecordInvalidatedValue[] {
        // in some cases, order, has been changed so we need to pass in oldQuantity and oldHasUndisclosed separately
        const orderIdx = this._orders.indexOf(order);
        if (orderIdx < 0) {
            window.motifLogger.logError(`FDRPLFDRRMR38867: ${order.orderId}`);
            return [];
        } else {
            const changes = new Array<RevRecordInvalidatedValue>(8); // Set to maximum possible number of elements
            let changeCount = 0;

            const oldMarketZenithCodeCount = this._marketZenithCodes.length;
            const oldXrefCount = this._xrefs.length;
            const oldBrokerIdCount = this._brokerIds.length;
            const oldAttributesCount = this._attributes.length;

            this._orders.splice(orderIdx, 1);
            this._count--;
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Count, typeId: RevRecordValueRecentChangeTypeId.Decrease };
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.CountXref, typeId: RevRecordValueRecentChangeTypeId.Decrease };

            this._volume -= oldVolume;
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Volume, typeId: RevRecordValueRecentChangeTypeId.Decrease };

            if (oldHasUndisclosed) {
                if (--this._undisclosedOrderCount === 0) {
                    changes[changeCount++] = {
                        fieldIndex: FullDepthSideFieldId.PriceAndHasUndisclosed, typeId: RevRecordValueRecentChangeTypeId.Update
                    };
                }
            }

            const marketZenithCodes = this.calculateMarketZenithCodes();
            if (marketZenithCodes.length !== oldMarketZenithCodeCount) {
                this._marketZenithCodes = marketZenithCodes;
                this._markets = undefined;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.MarketId, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            const xrefs = this.calculateXrefs();
            if (xrefs.length !== oldXrefCount) {
                this._xrefs = xrefs;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Xref, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            const brokerIds = this.calculateBrokerIds();
            if (brokerIds.length !== oldBrokerIdCount) {
                this._brokerIds = brokerIds;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.BrokerId, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            const attributes = this.calculateAttributes();
            if (attributes.length !== oldAttributesCount) {
                this._attributes = attributes;
                changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Attributes, typeId: RevRecordValueRecentChangeTypeId.Update };
            }

            changes.length = changeCount;
            return changes;
        }
    }

    processOrderChange(
        newOrder: DepthDataItem.Order,
        oldOrderQuantity: Integer,
        oldHasUndisclosed: boolean,
        valueChanges: DepthDataItem.Order.ValueChange[]
    ): RevRecordInvalidatedValue[] {
        const changes = new Array<RevRecordInvalidatedValue>(6); // Set to maximum possible number of elements
        let changeCount = 0;

        const quantityChange = newOrder.quantity - oldOrderQuantity;
        if (quantityChange !== 0) {
            this._volume += quantityChange;
            const changeTypeId = quantityChange > 0 ? RevRecordValueRecentChangeTypeId.Increase : RevRecordValueRecentChangeTypeId.Decrease;
            changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Volume, typeId: changeTypeId };
        }

        let priceAndHasUndisclosedChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;

        if (oldHasUndisclosed !== newOrder.hasUndisclosed) {
            let hasPriceUndisclosedChanged: boolean;
            if (oldHasUndisclosed) {
                hasPriceUndisclosedChanged = --this._undisclosedOrderCount === 0;
            } else {
                hasPriceUndisclosedChanged = this._undisclosedOrderCount++ === 0;
            }
            if (hasPriceUndisclosedChanged) {
                priceAndHasUndisclosedChangeTypeId = RevRecordValueRecentChangeTypeId.Update;
            }
        }

        for (const valueChange of valueChanges) {
            switch (valueChange.fieldId) {
                case DepthDataItem.Order.Field.Id.Price: {
                    if (this._count === 1) {
                        this._price = this._decimalFactory.newDecimal(newOrder.price);
                        changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Price, typeId: valueChange.recentChangeTypeId };
                        priceAndHasUndisclosedChangeTypeId = valueChange.recentChangeTypeId;
                    } else {
                        throw new AssertInternalError('FDRPOC66719', newOrder.price.toString());
                    }
                    break;
                }
                case DepthDataItem.Order.Field.Id.Market: {
                    const newMarketZenithCodes = this.calculateMarketZenithCodes();
                    if (!isArrayEqual(newMarketZenithCodes, this._marketZenithCodes)) {
                        this._marketZenithCodes = newMarketZenithCodes;
                        this._markets = undefined;
                        changes[changeCount++] = {
                            fieldIndex: FullDepthSideFieldId.MarketId,
                            typeId: RevRecordValueRecentChangeTypeId.Update
                        };
                    }
                    break;
                }
                case DepthDataItem.Order.Field.Id.Xref: {
                    const newXrefs = this.calculateXrefs();
                    if (!isArrayEqualUniquely<string>(newXrefs, this._xrefs)) {
                        this._xrefs = newXrefs;
                        changes[changeCount++] = { fieldIndex: FullDepthSideFieldId.Xref, typeId: RevRecordValueRecentChangeTypeId.Update };
                    }
                    break;
                }
                case DepthDataItem.Order.Field.Id.Broker: {
                    const newBrokerIds = this.calculateBrokerIds();
                    if (!isArrayEqualUniquely<string>(newBrokerIds, this._brokerIds)) {
                        this._brokerIds = newBrokerIds;
                        changes[changeCount++] = {
                            fieldIndex: FullDepthSideFieldId.BrokerId,
                            typeId: RevRecordValueRecentChangeTypeId.Update
                        };
                    }
                    break;
                }
                case DepthDataItem.Order.Field.Id.Attributes: {
                    const newAttributes = this.calculateAttributes();
                    if (!isArrayEqualUniquely<string>(newAttributes, this._attributes)) {
                        this._attributes = newAttributes;
                        changes[changeCount++] = {
                            fieldIndex: FullDepthSideFieldId.Attributes,
                            typeId: RevRecordValueRecentChangeTypeId.Update
                        };
                    }
                    break;
                }
            }
        }

        if (priceAndHasUndisclosedChangeTypeId !== undefined) {
            changes[changeCount++] = {
                fieldIndex: FullDepthSideFieldId.PriceAndHasUndisclosed,
                typeId: priceAndHasUndisclosedChangeTypeId,
            };
        }

        changes.length = changeCount;
        return changes;
    }

    protected isOwnOrder() { // virtual override
        return this._xrefs.length > 0;
    }

    protected createTextFormattableValue(id: FullDepthSideFieldId): DepthRecord.CreateTextFormattableValueResult {  // virtual override
        switch (id) {
            case FullDepthSideFieldId.PriceAndHasUndisclosed: return this.createPriceAndHasUndisclosedTextFormattableValue();
            case FullDepthSideFieldId.Volume: return this.createVolumeTextFormattableValue();
            case FullDepthSideFieldId.CountXref: return this.createCountXrefTextFormattableValue();
            case FullDepthSideFieldId.BrokerId: return this.createBrokerIdTextFormattableValue();
            case FullDepthSideFieldId.MarketId: return this.createMarketIdTextFormattableValue();
            case FullDepthSideFieldId.VolumeAhead: return this.createVolumeAheadTextFormattableValue();
            case FullDepthSideFieldId.Attributes: return this.createAttributesTextFormattableValue();
            case FullDepthSideFieldId.Price: return this.createPriceTextFormattableValue();
            case FullDepthSideFieldId.Xref: return this.createXRefTextFormattableValue();
            case FullDepthSideFieldId.Count: return this.createCountTextFormattableValue();
            case FullDepthSideFieldId.OrderId: return this.createOrderIdTextFormattableValue();
            default: throw new UnreachableCaseError('FDRPLFDRCRV29958', id);
        }
    }

    private createPriceAndHasUndisclosedTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const decimalConstructor = PriceTextFormattableValue.getDecimalConstructor(this._decimalFactory);
        const data: PriceAndHasUndisclosedTextFormattableValue.DataType = {
            price: new decimalConstructor(this._price),
            hasUndisclosed: this._undisclosedOrderCount > 0
        };
        const textFormattableValue = new PriceAndHasUndisclosedTextFormattableValue(data);
        return { textFormattableValue };
    }
    private createCountXrefTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new CountAndXrefsTextFormattableValue( { count: this._count, xrefs: this._xrefs });
        const extraAttribute: TextFormattableValue.DepthCountXRefFieldAttribute = {
            typeId: TextFormattableValue.Attribute.TypeId.DepthCountXRefField,
            isCountAndXrefs: true,
        };
        return { textFormattableValue, extraAttribute };
    }
    private createBrokerIdTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringArrayTextFormattableValue(this._brokerIds);
        return { textFormattableValue };
    }
    private createMarketIdTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        if (this._markets === undefined) {
            const zenithCodes = this._marketZenithCodes;
            const count = zenithCodes.length;
            const markets = new Array<DataMarket | undefined>(count);
            const marketDisplays = new Array<string>(count);
            for (let i = 0; i < count; i++) {
                const zenithCode = zenithCodes[i];
                const market = this._marketsService.dataMarkets.findZenithCode(zenithCode)
                markets[i] = market;
                const marketDisplay = market === undefined ? zenithCode : market.display;
                marketDisplays[i] = marketDisplay;
            }
            this._markets = markets;
            this._marketDisplays = marketDisplays;
        }
        const textFormattableValue = new StringArrayTextFormattableValue(this._marketDisplays);
        return { textFormattableValue };
    }
    private createAttributesTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringArrayTextFormattableValue(this._attributes);
        return { textFormattableValue };
    }
    private createPriceTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const factoryisedPrice = new FactoryisedDecimal(this._decimalFactory, this._price);
        const textFormattableValue = new PriceTextFormattableValue(factoryisedPrice);
        return { textFormattableValue };
    }
    private createXRefTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringArrayTextFormattableValue(this._xrefs);
        return { textFormattableValue };
    }
    private createCountTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new IntegerTextFormattableValue(this._count);
        return { textFormattableValue };
    }
    private createOrderIdTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new StringTextFormattableValue(undefined);
        return { textFormattableValue };
    }

    private calculateMarketZenithCodes() {
        const count = this._orders.length;
        const marketZenithCodes = new Array<string>(count);
        let marketZenithCodeCount = 0;
        for (let i = 0; i < count; i++) {
            const order = this._orders[i];
            const marketZenithCode = order.marketZenithCode;
            if (!marketZenithCodes.includes(marketZenithCode)) {
                marketZenithCodes[marketZenithCodeCount++] = marketZenithCode;
            }
        }

        marketZenithCodes.length = marketZenithCodeCount;
        return marketZenithCodes;
    }

    private calculateBrokerIds() {
        const count = this._orders.length;
        const brokerIds = new Array<string>(count);
        let brokerIdCount = 0;
        for (let i = 0; i < count; i++) {
            const order = this._orders[i];
            const brokerId = order.broker;
            if (brokerId !== undefined && !brokerIds.includes(brokerId)) {
                brokerIds[brokerIdCount++] = brokerId;
            }
        }

        brokerIds.length = brokerIdCount;
        return brokerIds;
    }

    private calculateXrefs() {
        const count = this._orders.length;
        const xrefs = new Array<string>(count);
        let xrefCount = 0;
        for (let i = 0; i < count; i++) {
            const order = this._orders[i];
            const xref = order.crossRef;
            if (xref !== undefined && !xrefs.includes(xref)) {
                xrefs[xrefCount++] = xref;
            }
        }

        xrefs.length = xrefCount;
        return xrefs;
    }

    private calculateAttributes() {
        const count = this._orders.length;
        const attributes = new Array<string>(count * 3); // initial guess at maximum length
        let attributeCount = 0;
        for (let i = 0; i < count; i++) {
            const order = this._orders[i];

            for (const attribute of order.attributes) {
                if (!attributes.includes(attribute)) {
                    if (attributeCount >= attributes.length) {
                        attributes.length = attributeCount * 2;
                    }
                    attributes[attributeCount++] = attribute;
                }
            }
        }

        attributes.length = attributeCount;
        return attributes;
    }
}
