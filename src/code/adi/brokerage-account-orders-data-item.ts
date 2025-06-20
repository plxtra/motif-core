import { AssertInternalError, Integer, UnreachableCaseError, UsableListChangeTypeId } from '@pbkware/js-utils';
import { assert, ErrorCodeLogger } from '../sys';
import { BrokerageAccountGroupOrderList } from './brokerage-account-group-order-list';
import { AurcChangeTypeId, DataMessage, DataMessageTypeId, OrdersDataMessage } from './common/internal-api';
import { Order } from './order';
import { RecordsBrokerageAccountSubscriptionDataItem } from './records-brokerage-account-subscription-data-item';

export class BrokerageAccountOrdersDataItem extends RecordsBrokerageAccountSubscriptionDataItem<Order>
    implements BrokerageAccountGroupOrderList {

    override processMessage(msg: DataMessage) { // virtual;
        if (msg.typeId !== DataMessageTypeId.Orders) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                if (!(msg instanceof OrdersDataMessage)) {
                    throw new AssertInternalError('ODIPM126674499', msg.constructor.name);
                } else {
                    this.advisePublisherResponseUpdateReceived();
                    this.notifyUpdateChange();
                    this.processOrdersMessage(msg);
                }

            } finally {
                this.endUpdate();
            }
        }
    }

    private checkApplyAdd(orderChangeRecords: readonly OrdersDataMessage.ChangeRecord[], addStartMsgIdx: Integer, endPlus1MsgIdx: Integer) {
        if (addStartMsgIdx >= 0) {
            const account = this.account;
            if (account === undefined) {
                throw new AssertInternalError('BAODICAAA1888234235');
            } else {
                const addCount = endPlus1MsgIdx - addStartMsgIdx;
                const addStartIdx = this.extendRecordCount(addCount);
                let addIdx = addStartIdx;
                for (let i = addStartMsgIdx; i < endPlus1MsgIdx; i++) {
                    const rec = orderChangeRecords[i];
                    const change = rec.change;
                    if (!OrdersDataMessage.isAddChangeRecord(change, rec.typeId)) {
                        throw new AssertInternalError('ODICAA12009855');
                    } else {
                        // add to all
                        const order = new Order(this._marketsService, account, change, this.correctnessId);
                        this.setRecord(addIdx++, order);
                    }
                }
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, addStartIdx, addCount);
            }
        }

        return -1;
    }

    private processOrdersMessage(msg: OrdersDataMessage) {
        assert(msg instanceof OrdersDataMessage, 'ID:12415105024');
        let addStartMsgIdx = -1;

        const msgRecordLength = msg.changeRecords.length;
        for (let msgOrderIdx = 0; msgOrderIdx < msgRecordLength; msgOrderIdx++) {
            const cr = msg.changeRecords[msgOrderIdx];
            switch (cr.typeId) {
                case AurcChangeTypeId.Add: {
                    const addChange = cr.change as OrdersDataMessage.AddChange;
                    const addMapKey = Order.generateMapKey(addChange.id, addChange.accountZenithCode);
                    if (this.hasRecord(addMapKey)) {
                        addStartMsgIdx = this.checkApplyAdd(msg.changeRecords, addStartMsgIdx, msgOrderIdx);
                        ErrorCodeLogger.logDataError('ODIPOMA38877', `${addChange.id}, ${addChange.sideId}, ${addChange.exchangeZenithCode}`);
                    } else {
                        if (addStartMsgIdx < 0) {
                            addStartMsgIdx = msgOrderIdx;
                        }
                    }
                    break;
                }

                case AurcChangeTypeId.Update: {
                    addStartMsgIdx = this.checkApplyAdd(msg.changeRecords, addStartMsgIdx, msgOrderIdx);
                    const updateChange = cr.change as OrdersDataMessage.UpdateChange;
                    const updateMapKey = Order.generateMapKey(updateChange.id, updateChange.accountZenithCode);
                    const updateOrder = this.getRecordByMapKey(updateMapKey);

                    if (updateOrder === undefined) {
                        ErrorCodeLogger.logDataError('ODIPOMU3389', updateChange.accountZenithCode);
                    } else {
                        updateOrder.update(updateChange);
                    }
                    break;
                }

                case AurcChangeTypeId.Remove: {
                    addStartMsgIdx = this.checkApplyAdd(msg.changeRecords, addStartMsgIdx, msgOrderIdx);
                    const removeChange = cr.change as OrdersDataMessage.RemoveChange;
                    const removeMapKey = Order.generateMapKey(removeChange.id, removeChange.accountZenithCode);
                    const orderIdx = this.indexOfRecordByMapKey(removeMapKey);
                    if (orderIdx < 0) {
                        ErrorCodeLogger.logDataError('ODIPOMR11156', `order not found: ${JSON.stringify(removeChange)}`);
                    } else {
                        this.checkUsableNotifyListChange(UsableListChangeTypeId.Remove, orderIdx, 1);
                        this.removeRecord(orderIdx);
                    }
                    break;
                }

                case AurcChangeTypeId.Clear: { // this represents clear orders for one Account (not clear all)
                    addStartMsgIdx = this.checkApplyAdd(msg.changeRecords, addStartMsgIdx, msgOrderIdx);
                    this.clearRecords();
                    break;
                }

                default:
                    throw new UnreachableCaseError('ODIPMOD44691', cr.typeId);
            }
        }
        this.checkApplyAdd(msg.changeRecords, addStartMsgIdx, msg.changeRecords.length);
    }
}
