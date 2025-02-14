import { NotImplementedError, Result } from '@xilytix/sysutils';
import { AdiPublisherRequest, AdiPublisherSubscription, DataMessage, RequestErrorDataMessages } from '../../../common/internal-api';
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class OrderRequestsMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        throw new NotImplementedError('ORMCCRM11111009');
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        throw new NotImplementedError('ORMCPM5920000201');
    }
}
