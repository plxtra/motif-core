import { BalancesModule } from './balances';
import { BrokerageAccountGroupModule } from './brokerage-account-group';
import { AdiPublisherSubscriptionManagerModule } from './common/adi-publisher-subscription-manager';
import { CommonStaticInitialise } from './common/internal-api';
import { MyxDataIvemAttributesModule } from './common/myx-data-ivem-attributes';
import { DataItemModule } from './data-item/internal-api';
import { DataIvemBaseDetailModule } from './data-ivem-base-detail';
import { DayTradesDataItemModule } from './day-trades-data-item';
import { FeedModule } from './feed/internal-api';
import { HoldingModule } from './holding';
import { MarketsServiceModule } from './markets/internal-api';
import { OrderModule } from './order';
import { PublisherSubscriptionDataItemModule } from './publish-subscribe/internal-api';
import { PublishersStaticInitialise } from './publishers/internal-api';
import { ScanDescriptorModule } from './scan/scan-statused-descriptor';
import { FullDataIvemDetailModule } from './search-symbols-data-ivem-full-detail';
import { SecurityDataItemModule } from './security-data-item';
import { WatchmakerListDescriptorModule } from './watchmaker/watchmaker-list-descriptor';

/** @internal */
export namespace AdiStaticInitialise {
    export function initialise() {
        CommonStaticInitialise.initialise();
        PublishersStaticInitialise.initialise();
        AdiPublisherSubscriptionManagerModule.initialiseStatic();
        DataItemModule.initialiseStatic();
        PublisherSubscriptionDataItemModule.initialiseStatic();
        FeedModule.initialiseStatic();
        DataIvemBaseDetailModule.initialiseStatic();
        FullDataIvemDetailModule.initialiseStatic();
        MyxDataIvemAttributesModule.initialiseStatic();
        SecurityDataItemModule.initialiseStatic();
        BrokerageAccountGroupModule.initialiseStatic();
        OrderModule.initialiseStatic();
        HoldingModule.initialiseStatic();
        BalancesModule.initialiseStatic();
        DayTradesDataItemModule.initialiseStatic();
        WatchmakerListDescriptorModule.initialiseStatic();
        ScanDescriptorModule.initialiseStatic();
        MarketsServiceModule.initialiseStatic();
    }
}
