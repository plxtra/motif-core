import { Integer, SysTick } from '@pbkware/js-utils';
import { DataItemId, DataMessage, DataMessageTypeId } from '../../common/internal-api';

export class ZenithQueryConfigureDataMessage extends DataMessage {
    static readonly typeId = DataMessageTypeId.ZenithQueryConfigure;

    constructor(dataItemId: DataItemId, dataItemRequestNr: Integer,
        private _actionTimeout: SysTick.Span, private _subscriptionTimeout: SysTick.Span
    ) {
        super (ZenithQueryConfigureDataMessage.typeId);
        this.dataItemId = dataItemId;
        this.dataItemRequestNr = dataItemRequestNr;
    }

    get actionTimeout() { return this._actionTimeout; }
    get subscriptionTimeout() { return this._subscriptionTimeout; }
}
