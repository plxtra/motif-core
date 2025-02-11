import { NotImplementedError, Result } from '@xilytix/sysutils';
import { AdiPublisherRequest, AdiPublisherSubscription, DataMessage, RequestErrorDataMessages } from '../../../common/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace OrderAuditMessageConvert {
    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        throw new NotImplementedError('OAMCCRM588388534434');
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        throw new NotImplementedError('OAMCPM668488633434');
    }
}
