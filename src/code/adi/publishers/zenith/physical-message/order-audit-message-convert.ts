import { NotImplementedError, Result } from '@pbkware/js-utils';
import { AdiPublisherRequest, AdiPublisherSubscription, DataMessage, RequestErrorDataMessages } from '../../../common/internal-api';
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class OrderAuditMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        throw new NotImplementedError('OAMCCRM588388534434');
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        throw new NotImplementedError('OAMCPM668488633434');
    }
}
