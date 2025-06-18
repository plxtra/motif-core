import { AssertInternalError, Ok, Result, } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    RequestErrorDataMessages,
    ZenithServerInfoDataDefinition,
    ZenithServerInfoDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class ServerInfoMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof ZenithServerInfoDataDefinition) {
            return this.createSubUnsubMessage(request);
        } else {
            throw new AssertInternalError('SIOMCCRM55583399', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Zenith) {
            throw new ZenithDataError(ErrorCode.SICAPMT95883743, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Sub) {
                throw new ZenithDataError(ErrorCode.SISOMCPMA333928660, JSON.stringify(message));
            } else {
                if (message.Topic  as ZenithProtocol.ZenithController.TopicName !== ZenithProtocol.ZenithController.TopicName.ServerInfo) {
                    throw new ZenithDataError(ErrorCode.SISOMCPMT1009199929, message.Topic);
                } else {
                    const payloadMsg = message as ZenithProtocol.ZenithController.ServerInfo.SubPayloadMessageContainer;
                    const payload = payloadMsg.Data;

                    const dataMessage = new ZenithServerInfoDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.serverName = payload.Name;
                    dataMessage.serverClass = payload.Class;
                    dataMessage.softwareVersion = payload.Version;
                    dataMessage.protocolVersion = payload.Protocol;

                    return dataMessage;
                }
            }
        }
    }

    private createSubUnsubMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Zenith,
            Topic: ZenithProtocol.ZenithController.TopicName.ServerInfo,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
        };

        return new Ok(result);
    }
}
