import { AssertInternalError, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
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
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class TradingMarketsMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryTradingMarketsDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('TMMCCRM36881', definition.description);
        }
    }

    parseMessage(
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
                dataMessage.markets = this.parseData(publishMsg.Data);
            }

            return dataMessage;
        }
    }

    private createPublishMessage(definition: QueryTradingMarketsDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.TradingController.TradingMarkets.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.QueryTradingMarkets,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Provider: definition.tradingFeedZenithCode,
            }
        };

        return new Ok(result);

        // const tradingMarketsDataMessage = new TradingMarketsDataMessage();
        // const subscription = request.subscription;
        // tradingMarketsDataMessage.dataItemId = subscription.dataItemId;
        // tradingMarketsDataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
        // tradingMarketsDataMessage.markets= [];

        // const { value: unenvironmentFeedZenithCode, environmentZenithCode } = ZenithEnvironmentedValueParts.fromString(definition.tradingFeedZenithCode);

        // switch (unenvironmentFeedZenithCode) {
        //     case 'Motif': {
        //         const ptxMarket = this.createMockPtxMarket(environmentZenithCode);
        //         const fnsxMarket = this.createMockFnsxMarket(environmentZenithCode);
        //         const daxMarket = this.createMockDaxMarket(environmentZenithCode);
        //         tradingMarketsDataMessage.markets= [ptxMarket, fnsxMarket, daxMarket];
        //         break;
        //     }
        //     case 'CFMarkets': {
        //         const cfxMarket = this.createMockCfxMarket(environmentZenithCode);
        //         tradingMarketsDataMessage.markets= [cfxMarket];
        //         break;
        //     }
        //     case 'Finplex': {
        //         const fpsxMarket = this.createMockFpsxMarket(environmentZenithCode);
        //         tradingMarketsDataMessage.markets= [fpsxMarket];
        //         break;
        //     }
        // }
        // return new Err({ dataMessages: [tradingMarketsDataMessage], subscribed: true })
    }

    private parseData(data: ZenithProtocol.TradingController.TradingMarkets.Market[]) {
        const result = new Array<TradingMarketsDataMessage.Market>(data.length);
        let count = 0;
        for (let index = 0; index < data.length; index++) {
            const market = ZenithConvert.TradingMarket.toAdi(data[index]);
            result[count++] = market;
        }
        result.length = count;
        return result;
    }

    private createMockPtxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
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

    private createMockFnsxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
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

    private createMockFpsxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
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

    private createMockCfxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
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

    private createMockDaxMarket(environmentZenithCode: ExchangeEnvironmentZenithCode): TradingMarketsDataMessage.Market {
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
