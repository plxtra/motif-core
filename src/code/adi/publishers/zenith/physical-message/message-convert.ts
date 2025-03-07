import { Result } from '@pbkware/js-utils';
import { AdiPublisherRequest, AdiPublisherSubscription, DataMessage, RequestErrorDataMessages } from '../../../common/internal-api';
import { ZenithProtocol } from './protocol/internal-api';
import { ZenithConvert } from './zenith-convert';

export abstract class MessageConvert {
    abstract createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages>;
    abstract parseMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer, actionId: ZenithConvert.MessageContainer.Action.Id): DataMessage;
}
