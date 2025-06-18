import { Integer } from '@pbkware/js-utils';
import { defined, ErrorCode, ZenithDataError } from '../../../../sys';
import { ZenithProtocol } from './protocol/zenith-protocol';

/** @internal */
export class AuthTokenMessageConvert {
    // AuthControllers are structured differently from other controllers
    // as they do not generate PariAdi messages

    createMessage(
        transactionId: Integer,
        provider: string,
        accessToken: string
    ): ZenithProtocol.AuthController.AuthToken.PublishMessageContainer {

        return {
            Controller: ZenithProtocol.MessageContainer.Controller.Auth,
            Topic: ZenithProtocol.AuthController.TopicName.AuthToken,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: transactionId,
            Data: {
                Provider: provider,
                AccessToken: accessToken,
            },
        };
    }

    parseMessage(message: ZenithProtocol.AuthController.AuthToken.PublishPayloadMessageContainer) {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Auth) {
            throw new ZenithDataError(ErrorCode.ACATPMC298431, message.Controller);
        } else {
            if (message.Topic as ZenithProtocol.AuthController.TopicName !== ZenithProtocol.AuthController.TopicName.AuthToken) {
                throw new ZenithDataError(ErrorCode.ACATPMT377521, message.Topic);
            } else {
                if (message.Action === ZenithProtocol.MessageContainer.Action.Error) {
                    let errorMessage: string;
                    const data = message.Data;
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (data === undefined) {
                        errorMessage = 'Unspecified Error';
                    } else {
                        if (typeof data === 'string') {
                            errorMessage = data;
                        } else {
                            if (typeof data === 'object') {
                                errorMessage = JSON.stringify(data);
                            } else {
                                errorMessage = 'Unknown Error';
                            }
                        }
                    }
                    throw new ZenithDataError(ErrorCode.ACATPMA23964, errorMessage);
                } else {
                    if (!defined(message.Data)) {
                        throw new ZenithDataError(ErrorCode.ACATPMD29984, 'Message missing Data');
                    } else {
                        return message.Data;
                    }
                }
            }
        }
    }
}
