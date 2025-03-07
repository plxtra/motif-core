import { DecimalFactory, IndexedRecord, Integer } from '@pbkware/js-utils';
import { MarketsService } from '../../../adi/internal-api';
import { IntegerTextFormattableValue, TextFormattableValue } from '../../../services/internal-api';

/** @public */
export abstract class DepthRecord implements IndexedRecord {
    inAuction: boolean;
    partialAuctionQuantity: Integer | undefined;

    constructor(
        protected readonly _decimalFactory: DecimalFactory,
        protected readonly _marketsService: MarketsService,
        private _typeId: DepthRecord.TypeId,
        public index: Integer,
        private _volumeAhead: Integer | undefined,
        auctionQuantity: Integer | undefined,
    ) {
        if (this._volumeAhead === undefined || auctionQuantity === undefined) {
            this.inAuction = false;
        } else {
            this.inAuction = auctionQuantity > this._volumeAhead;
        }
    }

    get typeId() { return this._typeId; }
    get volumeAhead() { return this._volumeAhead; }
    // set volumeAhead(value: Integer | undefined) { this._volumeAhead = value; }
    get cumulativeQuantity() { return this.volumeAhead === undefined ? undefined : this.volumeAhead + this.getVolume(); }

    processAuctionAndVolumeAhead(
        volumeAhead: Integer | undefined, auctionVolume: Integer | undefined
    ): DepthRecord.ProcessVolumeAheadResult {
        let inAuction: boolean;
        let cumulativeVolume: Integer | undefined;
        let partialAuctionVolumeChanged = false;
        if (volumeAhead === undefined) {
            inAuction = false;
            cumulativeVolume = undefined;
        } else {
            // either less than quantity ahead records limit or in auction quantity range
            cumulativeVolume = volumeAhead + this.getVolume();
            if (auctionVolume === undefined) {
                inAuction = false;
            } else {
                if (auctionVolume <= volumeAhead) {
                    inAuction = false;
                } else {
                    inAuction = true;
                    let partialAuctionVolume: Integer | undefined;
                    if (auctionVolume < cumulativeVolume) {
                        partialAuctionVolume = auctionVolume - volumeAhead;
                    } else {
                        partialAuctionVolume = undefined;
                    }
                    if (partialAuctionVolume !== this.partialAuctionQuantity) {
                        this.partialAuctionQuantity = partialAuctionVolume;
                        partialAuctionVolumeChanged = true;
                    }
                }
            }
        }

        const inAuctionChanged = inAuction !== this.inAuction;
        if (inAuctionChanged) {
            this.inAuction = inAuction;
        }
        const volumeAheadChanged = volumeAhead !== this.volumeAhead;
        if (volumeAheadChanged) {
            this._volumeAhead = volumeAhead;
        }
        return {
            cumulativeVolume,
            inAuctionOrVolumeAheadOrPartialChanged: inAuctionChanged || volumeAheadChanged || partialAuctionVolumeChanged,
        };
    }

    protected createVolumeTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new IntegerTextFormattableValue(this.getVolume());
        let extraAttribute: TextFormattableValue.DepthRecordInAuctionAttribute | undefined;
        if (!this.inAuction) {
            extraAttribute = undefined;
        } else {
            let partialAuctionProportion: number | undefined;
            if (this.partialAuctionQuantity === undefined) {
                partialAuctionProportion = undefined;
            } else {
                partialAuctionProportion = this.partialAuctionQuantity / this.getVolume();
            }
            extraAttribute = {
                typeId: TextFormattableValue.Attribute.TypeId.DepthRecordInAuction,
                partialAuctionProportion,
            };
        }
        return { textFormattableValue, extraAttribute };
    }

    protected createVolumeAheadTextFormattableValue(): DepthRecord.CreateTextFormattableValueResult {
        const textFormattableValue = new IntegerTextFormattableValue(this.volumeAhead);
        return { textFormattableValue };
    }

    abstract getVolume(): Integer;
    abstract getRenderVolume(): Integer | undefined;
    abstract acceptedByFilter(filterXrefs: string[]): boolean;
}

/** @public */
export namespace DepthRecord {
    export const enum TypeId {
        Order,
        PriceLevel,
    }

    export interface ProcessVolumeAheadResult {
        cumulativeVolume: Integer | undefined;
        inAuctionOrVolumeAheadOrPartialChanged: boolean;
    }

    export interface CreateTextFormattableValueResult {
        textFormattableValue: TextFormattableValue;
        extraAttribute?: TextFormattableValue.Attribute;
    }
}
