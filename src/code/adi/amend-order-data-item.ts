import { SysDecimal } from '@xilytix/sysutils';
import { AmendOrderResponseDataMessage, DataDefinition, DataMessage, DataMessageTypeId, OrderRequestTypeId } from './common/internal-api';
import { OrderRequestDataItem } from './order-request-data-item';

export class AmendOrderDataItem extends OrderRequestDataItem {
    private _estimatedBrokerage: SysDecimal | undefined;
    private _estimatedTax: SysDecimal | undefined;
    private _estimatedValue: SysDecimal | undefined;

    constructor(MyDataDefinition: DataDefinition) {
        super(MyDataDefinition, OrderRequestTypeId.Amend);
    }

    get estimatedBrokerage(): SysDecimal | undefined { return this._estimatedBrokerage; }
    get estimatedTax(): SysDecimal | undefined { return this._estimatedTax; }
    get estimatedValue(): SysDecimal | undefined { return this._estimatedValue; }

    override processMessage(msg: DataMessage) { // virtual;
        if (msg.typeId !== DataMessageTypeId.AmendOrderResponse) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
                this.processMessage_AmendOrderResponse(msg as AmendOrderResponseDataMessage);
            } finally {
                this.endUpdate();
            }
        }
    }

    private processMessage_AmendOrderResponse(msg: AmendOrderResponseDataMessage) {
        super.processMessage_OrderResponse(msg);

        this._estimatedBrokerage = msg.estimatedBrokerage;
        this._estimatedTax = msg.estimatedTax;
        this._estimatedValue = msg.estimatedValue;
    }
}
