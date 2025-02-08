import { SysDecimal } from '../sys/internal-api';
import { DataDefinition, DataMessage, DataMessageTypeId, OrderRequestTypeId, PlaceOrderResponseDataMessage } from './common/internal-api';
import { OrderRequestDataItem } from './order-request-data-item';

export class PlaceOrderDataItem extends OrderRequestDataItem {
    private _estimatedBrokerage: SysDecimal | undefined;
    private _estimatedTax: SysDecimal | undefined;
    private _estimatedValue: SysDecimal | undefined;

    constructor(MyDataDefinition: DataDefinition) {
        super(MyDataDefinition, OrderRequestTypeId.Place);
    }

    get estimatedBrokerage(): SysDecimal | undefined { return this._estimatedBrokerage; }
    get estimatedTax(): SysDecimal | undefined { return this._estimatedTax; }
    get estimatedValue(): SysDecimal | undefined { return this._estimatedValue; }

    override processMessage(msg: DataMessage) { // virtual;
        if (msg.typeId !== DataMessageTypeId.PlaceOrderResponse) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
                this.processMessage_PlaceOrderResponse(msg as PlaceOrderResponseDataMessage);
            } finally {
                this.endUpdate();
            }
        }
    }

    private processMessage_PlaceOrderResponse(msg: PlaceOrderResponseDataMessage) {
        super.processMessage_OrderResponse(msg);

        this._estimatedBrokerage = msg.estimatedBrokerage;
        this._estimatedTax = msg.estimatedTax;
        this._estimatedValue = msg.estimatedValue;
    }
}
