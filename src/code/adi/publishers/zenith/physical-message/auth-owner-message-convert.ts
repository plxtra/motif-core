import { Integer } from '@pbkware/js-utils';
import { defined, ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';

/** @internal */
export class AuthOwnerMessageConvert {
    // AuthControllers are structured differently from other controllers
    // as they do not generate PariAdi messages

    createMessage(
        transactionId: Integer,
        provider: string,
        username: string,
        password: string,
        clientId: string,
        clientSecret?: string
    ): ZenithProtocol.AuthController.AuthOwner.PublishMessageContainer {

        return {
            Controller: ZenithProtocol.MessageContainer.Controller.Auth,
            Topic: ZenithProtocol.AuthController.TopicName.AuthOwner,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: transactionId,
            Data: {
                Provider: provider, // 'BasicAuth',
                ClientID: clientId,
                // ClientSecret: clientSecret,
                Username: username,
                Password: password,
            },
        };
    }

    parseMessage(message: ZenithProtocol.AuthController.AuthOwner.PublishPayloadMessageContainer): ZenithProtocol.AuthController.Identify {
        // TODO:MED: It would be better to validate the incoming message instead of doing a blind typecast.
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Auth) {
            throw new ZenithDataError(ErrorCode.ACAOPMC298431, message.Controller);
        } else {
            if (message.Topic as ZenithProtocol.AuthController.TopicName !== ZenithProtocol.AuthController.TopicName.AuthOwner) {
                throw new ZenithDataError(ErrorCode.ACAOPMT377521, message.Topic);
            } else {
                if (message.Action === ZenithProtocol.MessageContainer.Action.Error) {
                    throw new ZenithDataError(ErrorCode.ACAOPMA23964, 'Error Response');
                } else {
                    if (!defined(message.Data)) {
                        throw new ZenithDataError(ErrorCode.ACAOPMD29984, 'Message missing Data');
                    } else {
                        return message.Data;
                    }
                }
            }
        }
    }
}
