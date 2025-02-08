import { StringId, Strings } from '../../../../res/internal-api';
import { AssertInternalError, Err, ErrorCode, Ok, Result, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    LowLevelTopShareholdersDataDefinition,
    RequestErrorDataMessages,
    TLowLevelTopShareholdersDataMessage,
    TopShareholder,
    unknownZenithCode
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace FragmentsMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof LowLevelTopShareholdersDataDefinition) {
            return createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('FCRM5120125583399', definition.description);
        }
    }

    function createPublishMessage(
        request: AdiPublisherRequest,
        definition: LowLevelTopShareholdersDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            let tradingDate: ZenithProtocol.Iso8601DateTime | undefined;
            if (definition.tradingDate === undefined) {
                tradingDate = undefined;
            } else {
                tradingDate = ZenithConvert.Date.DateTimeIso8601.fromDate(definition.tradingDate);
            }

            const result: ZenithProtocol.FragmentsController.QueryFragments.Fundamentals_TopShareholders.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Fragments,
                Topic: ZenithProtocol.FragmentsController.TopicName.QueryFragments,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    Market: marketZenithCode,
                    Code: definition.code,
                    Fragments: [{ Name: ZenithProtocol.FragmentsController.QueryFragments.Fundamentals_TopShareholders.fragmentName }],
                    TradingDate: tradingDate,
                },
            };

            return new Ok(result);
        }
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id,
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Fragments) {
            throw new ZenithDataError(ErrorCode.FragmentsMessageConvert_ControllerNotMatched, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.FragmentsMessageConvert_ActionNotPublish, actionId.toString());
            } else {
                if (message.Topic as ZenithProtocol.FragmentsController.TopicName !== ZenithProtocol.FragmentsController.TopicName.QueryFragments) {
                    throw new ZenithDataError(ErrorCode.FragmentsMessageConvert_TopicNotQueryFragments, message.Topic);
                } else {
                    const respMessage = message as ZenithProtocol.FragmentsController.QueryFragments.Fundamentals_TopShareholders.QueryPayloadMessageContainer;
                    const data = respMessage.Data;
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (data !== undefined) {
                        const dataMessage = new TLowLevelTopShareholdersDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        dataMessage.topShareholdersInfo = parseData(data);
                        return dataMessage;

                    } else {
                        throw new ZenithDataError(ErrorCode.FCFPM399285,
                            message.TransactionID === undefined ? 'undefined tranId' : message.TransactionID.toString(10));
                    }
                }
            }
        }
    }

    function parseData(
        data: ZenithProtocol.FragmentsController.QueryFragments.Fundamentals_TopShareholders.FragmentData): TopShareholder[] {
        const result: TopShareholder[] = [];

        const attrName = ZenithProtocol.FragmentsController.QueryFragments.Fundamentals_TopShareholders.fragmentName;

        if (Array.isArray(data[attrName])) {
            for (let index = 0; index < data[attrName].length; index++) {
                const shareholder = parseShareholderInfo(data[attrName][index]);
                result.push(shareholder);
            }
        }

        return result;
    }

    function parseShareholderInfo(info: ZenithProtocol.FragmentsController.QueryFragments.Fundamentals_TopShareholders.TopShareholder) {
        const result = new TopShareholder();
        result.name = info.Name;
        result.designation = info.Designation;
        result.holderKey = info.HolderKey;
        result.sharesHeld = info.SharesHeld;
        result.totalShareIssue = info.TotalShreIssue;
        return result;
    }
}
