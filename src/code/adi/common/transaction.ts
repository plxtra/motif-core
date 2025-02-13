import { Integer, SourceTzOffsetDateTime } from '@xilytix/sysutils';
import { Decimal } from 'decimal.js-light';
import { CurrencyId, IvemClassId } from './data-types';

export interface Transaction {
    id: string;
    zenithExchangeCode: string;
    // environmentId: DataEnvironmentId;
    code: string;
    zenithTradingMarketCode: string;
    accountZenithCode: string;
    orderStyleId: IvemClassId;
    tradeDate: SourceTzOffsetDateTime;
    settlementDate: SourceTzOffsetDateTime;
    grossAmount: Decimal;
    netAmount: Decimal;
    settlementAmount: Decimal;
    currencyId: CurrencyId | undefined;
    orderId: string;
}

export namespace Transaction {
    export function isMarket(transaction: Transaction): transaction is MarketTransaction {
        return transaction.orderStyleId === IvemClassId.Market;
    }

    export function isManagedFund(transaction: Transaction): transaction is ManagedFundTransaction {
        return transaction.orderStyleId === IvemClassId.ManagedFund;
    }
}

export interface MarketTransaction extends Transaction {
    orderStyleId: IvemClassId.Market;
    totalQuantity: Integer;
    averagePrice: Decimal;
}

export interface ManagedFundTransaction extends Transaction {
    orderStyleId: IvemClassId.ManagedFund;
    totalUnits: Decimal;
    unitValue: Decimal;
}
