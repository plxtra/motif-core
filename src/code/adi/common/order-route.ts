import { UnreachableCaseError } from '@xilytix/sysutils';
import { OrderRouteAlgorithmId } from './data-types';

export interface OrderRoute {
    algorithmId: OrderRouteAlgorithmId;
}

export namespace OrderRoute {
    export function isMarket(orderRoute: OrderRoute): orderRoute is MarketOrderRoute {
        return orderRoute.algorithmId === OrderRouteAlgorithmId.Market;
    }

    export function isUndefinableEqual(left: OrderRoute | undefined, right: OrderRoute | undefined): boolean {
        if (left === undefined) {
            return right === undefined;
        } else {
            if (right === undefined) {
                return false;
            } else {
                return isEqual(left, right);
            }
        }
    }

    export function isEqual(left: OrderRoute, right: OrderRoute): boolean {
        if (left.algorithmId !== right.algorithmId) {
            return false;
        } else {
            switch (left.algorithmId) {
                case OrderRouteAlgorithmId.Market:
                    return MarketOrderRoute.isEqual(left as MarketOrderRoute, right as MarketOrderRoute);
                case OrderRouteAlgorithmId.BestMarket:
                    return BestMarketOrderRoute.isEqual(left as BestMarketOrderRoute, right as BestMarketOrderRoute);
                case OrderRouteAlgorithmId.Fix:
                    return FixOrderRoute.isEqual(left as FixOrderRoute, right as FixOrderRoute);
                default:
                    throw new UnreachableCaseError('ZORIE10087', left.algorithmId);
            }
        }
    }
}

export interface MarketOrderRoute extends OrderRoute {
    algorithmId: OrderRouteAlgorithmId.Market;
    marketZenithCode: string;
}

export namespace MarketOrderRoute {
    export function isEqual(left: MarketOrderRoute, right: MarketOrderRoute): boolean {
        return left.marketZenithCode === right.marketZenithCode;
    }
}

export interface BestMarketOrderRoute extends OrderRoute {
    algorithmId: OrderRouteAlgorithmId.BestMarket;
}

export namespace BestMarketOrderRoute {
    export function isEqual(left: BestMarketOrderRoute, right: BestMarketOrderRoute): boolean {
        return true; // update when implemented on server
    }
}

export interface FixOrderRoute extends OrderRoute {
    algorithmId: OrderRouteAlgorithmId.Fix;
}

export namespace FixOrderRoute {
    export function isEqual(left: FixOrderRoute, right: FixOrderRoute): boolean {
        return true; // update when implemented on server
    }
}
