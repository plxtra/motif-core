import { AssertInternalError, Err, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ExchangeEnvironmentZenithCode,
    QueryTradingMarketsDataDefinition,
    RequestErrorDataMessages,
    TradingMarketsDataMessage,
    ZenithEnvironmentedValueParts,
    ZenithMarketParts,
    ZenithProtocolCommon
} from '../../../common/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace TradingMarketsMessageConvert {
    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryTradingMarketsDataDefinition) {
            return createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('TMMCCRM36881', definition.description);
        }
    }

    function createPublishMessage(request: AdiPublisherRequest, definition: QueryTradingMarketsDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const result: ZenithProtocol.TradingController.TradingMarkets.PublishMessageContainer = {
        //     Controller: ZenithProtocol.MessageContainer.Controller.Trading,
        //     Topic: ZenithProtocol.TradingController.TopicName.QueryTradingMarkets,
        //     Action: ZenithProtocol.MessageContainer.Action.Publish,
        //     TransactionID: AdiPublisherRequest.getNextTransactionId(),
        //     Data: {
        //         Provider: definition.tradingFeedZenithCode,
        //     }
        // };

        // return new Ok(result);

        const tradingMarketsDataMessage = new TradingMarketsDataMessage();
        const subscription = request.subscription;
        tradingMarketsDataMessage.dataItemId = subscription.dataItemId;
        tradingMarketsDataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
        tradingMarketsDataMessage.markets= [];

        const { value: unenvironmentFeedZenithCode, environmentZenithCode } = ZenithEnvironmentedValueParts.fromString(definition.tradingFeedZenithCode);

        switch (unenvironmentFeedZenithCode) {
            case 'Motif': {
                const ptxMarket = createMockPtxMarket(environmentZenithCode);
                const fnsxMarket = createMockFnsxMarket(environmentZenithCode);
                const daxMarket = createMockDaxMarket(environmentZenithCode);
                tradingMarketsDataMessage.markets= [ptxMarket, fnsxMarket, daxMarket];
                break;
            }
            case 'CFMarkets': {
                const cfxMarket = createMockCfxMarket(environmentZenithCode);
                tradingMarketsDataMessage.markets= [cfxMarket];
                break;
            }
            case 'Finplex': {
                const fpsxMarket = createMockFpsxMarket(environmentZenithCode);
                tradingMarketsDataMessage.markets= [fpsxMarket];
                break;
            }
        }
        return new Err({ dataMessages: [tradingMarketsDataMessage], subscribed: true })
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        _actionId: ZenithConvert.MessageContainer.Action.Id,
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_TradingMarkets_Controller, message.Controller);
        } else {
            const dataMessage = new TradingMarketsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.QueryTradingMarkets) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_TradingMarkets_Topic, message.Topic);
            } else {
                const publishMsg = message as ZenithProtocol.TradingController.TradingMarkets.PublishPayloadMessageContainer;
                dataMessage.markets = parseData(publishMsg.Data);
            }

            return dataMessage;
        }
    }

    function parseData(data: ZenithProtocol.TradingController.TradingMarkets.Market[]) {
        const result = new Array<TradingMarketsDataMessage.Market>(data.length);
        let count = 0;
        for (let index = 0; index < data.length; index++) {
            const market = ZenithConvert.TradingMarket.toAdi(data[index]);
            result[count++] = market;
        }
        result.length = count;
        return result;
    }

    function createMockPtxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
        const exchangeCode = ZenithProtocolCommon.KnownExchange.Ptx;
        const zenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', 'PTX', environmentZenithCode);
        const exchangeZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(exchangeCode, environmentZenithCode);
        const bestSourceDataMarketZenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', '', environmentZenithCode);

        return {
            zenithCode,
            exchangeZenithCode,
            isLit: true,
            bestSourceDataMarketZenithCode,
            attributes: undefined,
        }
    }

    function createMockFnsxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
        const exchangeCode = ZenithProtocolCommon.KnownExchange.Fnsx;
        const zenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', 'FNSX', environmentZenithCode);
        const exchangeZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(exchangeCode, environmentZenithCode);
        const bestSourceDataMarketZenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', '', environmentZenithCode);

        return {
            zenithCode,
            exchangeZenithCode,
            isLit: true,
            bestSourceDataMarketZenithCode,
            attributes: undefined,
        }
    }

    function createMockFpsxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
        const exchangeCode = ZenithProtocolCommon.KnownExchange.Fpsx;
        const zenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', 'FPSX', environmentZenithCode);
        const exchangeZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(exchangeCode, environmentZenithCode);
        const bestSourceDataMarketZenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', '', environmentZenithCode);

        return {
            zenithCode,
            exchangeZenithCode,
            isLit: true,
            bestSourceDataMarketZenithCode,
            attributes: undefined,
        }
    }

    function createMockCfxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
        const exchangeCode = ZenithProtocolCommon.KnownExchange.Cfx;
        const zenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', 'CFMX', environmentZenithCode);
        const exchangeZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(exchangeCode, environmentZenithCode);
        const bestSourceDataMarketZenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', '', environmentZenithCode);

        return {
            zenithCode,
            exchangeZenithCode,
            isLit: true,
            bestSourceDataMarketZenithCode,
            attributes: undefined,
        }
    }

    function createMockDaxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
        const exchangeCode = ZenithProtocolCommon.KnownExchange.Dax;
        const zenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', 'DAXM', environmentZenithCode);
        const exchangeZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(exchangeCode, environmentZenithCode);
        const bestSourceDataMarketZenithCode = ZenithMarketParts.createSymbolFromDestructured(exchangeCode, '', '', environmentZenithCode);

        return {
            zenithCode,
            exchangeZenithCode,
            isLit: true,
            bestSourceDataMarketZenithCode,
            attributes: undefined,
        }
    }
}
