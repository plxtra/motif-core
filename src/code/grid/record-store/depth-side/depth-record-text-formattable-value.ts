import { OrderSideId } from '../../../adi';
import { TextFormattableValue } from '../../../services';
import { GridRecordStoreTextFormattableValue } from '../grid-record-store-text-formattable-value';
import { DepthRecord } from './depth-record';

/** @public */
export namespace DepthRecordTextFormattableValue {
    export interface Attribute extends GridRecordStoreTextFormattableValue.Attribute {
        readonly typeId: TextFormattableValue.Attribute.TypeId.DepthRecord;
        orderSideId: OrderSideId;
        depthRecordTypeId: DepthRecord.TypeId;
        ownOrder: boolean;
    }
}
