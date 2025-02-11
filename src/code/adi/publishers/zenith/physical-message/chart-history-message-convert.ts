import { AssertInternalError, Err, Ok, Result } from '@xilytix/sysutils';
import { StringId, Strings } from '../../../../res/internal-api';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    ChartHistoryDataMessage,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    QueryChartHistoryDataDefinition,
    RequestErrorDataMessages,
    unknownZenithCode
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

/** @internal */
export namespace ChartHistoryMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryChartHistoryDataDefinition) {
            return createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('CHOMCCRM55583399', definition.description);
        }
    }

    function createPublishMessage(
        request: AdiPublisherRequest,
        definition: QueryChartHistoryDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const period = ZenithConvert.ChartHistory.Period.fromChartIntervalId(definition.intervalId);
            let fromDate: ZenithProtocol.Iso8601DateTime | undefined;
            if (definition.fromDate === undefined) {
                fromDate = undefined;
            } else {
                fromDate = ZenithConvert.Date.DateTimeIso8601.fromDate(definition.fromDate);
            }
            let toDate: ZenithProtocol.Iso8601DateTime | undefined;
            if (definition.toDate === undefined) {
                toDate = undefined;
            } else {
                toDate = ZenithConvert.Date.DateTimeIso8601.fromDate(definition.toDate);
            }

            const result: ZenithProtocol.MarketController.ChartHistory.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: ZenithProtocol.MarketController.TopicName.QueryChartHistory,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    Code: definition.code,
                    Market: marketZenithCode,
                    Count: definition.count,
                    Period: period,
                    FromDate: fromDate,
                    ToDate: toDate,
                }
            };

            return new Ok(result);
        }
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.CHMCPMC588329999199, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.CHMCPMA2233498, actionId.toString());
            } else {
                if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QueryChartHistory) {
                    throw new ZenithDataError(ErrorCode.CHMCPMT2233498, message.Topic);
                } else {
                    const historyMsg = message as ZenithProtocol.MarketController.ChartHistory.PayloadMessageContainer;

                    const dataMessage = new ChartHistoryDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.records = parseData(historyMsg.Data);
                    return dataMessage;
                }
            }
        }
    }

    function parseData(payloadRecords: ZenithProtocol.MarketController.ChartHistory.Record[]): ChartHistoryDataMessage.Record[] {
        const count = payloadRecords.length;
        const records = new Array<ChartHistoryDataMessage.Record>(count);
        for (let i = 0; i < count; i++) {
            const payloadRecord = payloadRecords[i];
            const dateTime = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(payloadRecord.Date);
            if (dateTime === undefined) {
                throw new ZenithDataError(ErrorCode.CHMCPD87777354332, payloadRecord.Date);
            } else {
                const record: ChartHistoryDataMessage.Record = {
                    dateTime,
                    open: payloadRecord.Open,
                    high: payloadRecord.High,
                    low: payloadRecord.Low,
                    close: payloadRecord.Close,
                    volume: payloadRecord.Volume,
                    trades: payloadRecord.Trades,
                };

                records[i] = record;
            }
        }

        return records;
    }
}
