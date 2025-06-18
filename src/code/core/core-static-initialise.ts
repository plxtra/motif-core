import { AdiStaticInitialise } from '../adi';
import { CommandStaticInitialise } from '../command';
import { GridStaticInitialise } from '../grid';
import { NotificationChannelStaticInitialise } from '../notification-channel';
import { PublisherStaticInitialise } from '../publisher';
import { RankedDataIvemIdListStaticInitialise } from '../ranked-lit-ivem-id-list';
import { ResStaticInitialise } from '../res';
import { ScanStaticInitialise } from '../scan';
import { SequenceHistoryStaticInitialise } from '../sequence-history';
import { ServicesStaticInitialise, SettingsStaticInitialise } from '../services';
import { SysStaticInitialise } from '../sys';

export namespace CoreStaticInitialise {
    export function initialise() {
        ResStaticInitialise.initialise();
        SysStaticInitialise.initialise();
        PublisherStaticInitialise.initialise();
        AdiStaticInitialise.initialise();
        SettingsStaticInitialise.initialise();
        CommandStaticInitialise.initialise();
        ServicesStaticInitialise.initialise();
        SequenceHistoryStaticInitialise.initialise();
        NotificationChannelStaticInitialise.initialise();
        ScanStaticInitialise.initialise();
        RankedDataIvemIdListStaticInitialise.initialise();
        GridStaticInitialise.initialise();
    }
}

CoreStaticInitialise.initialise();
