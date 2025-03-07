import { DecimalFactory } from '@pbkware/js-utils';
import {
    RevSourcedFieldCustomHeadings,
    RevStandardSourcedFieldCustomHeadingsService
} from 'revgrid';
import { AdiPublisherFactory, AdiService, DataItemFactory, MarketsService } from './adi/internal-api';
import { CommandRegisterService } from "./command/internal-api";
import {
    CellPainterFactoryService,
    ReferenceableColumnLayoutsService,
    ReferenceableDataSourceDefinitionsStoreService,
    ReferenceableDataSourcesService,
    StandardTableFieldSourceDefinitionCachingFactoryService,
    TableFieldSourceDefinitionFactory,
    TableRecordSourceFactory
} from "./grid/internal-api";
import { KeyboardService } from "./keyboard/internal-api";
import { NotificationChannelsService } from './notification-channel/internal-api';
import {
    RankedDataIvemIdListDefinitionFactoryService,
    RankedDataIvemIdListFactoryService,
} from "./ranked-lit-ivem-id-list/internal-api";
import { ScanFormulaZenithEncodingService, ScansService } from './scan/internal-api';
import {
    AppStorageService,
    CapabilitiesService,
    IdleService,
    MotifServicesService,
    SettingsService,
    SymbolDetailCacheService,
    SymbolsService
} from "./services/internal-api";
import { WarningsService } from './sys/internal-api';
import { TextFormatterService } from "./text-format/internal-api";
import { WatchmakerService } from './watchmaker/internal-api';

/** @public */
export class CoreService {
    readonly warningsService: WarningsService;
    readonly idleService: IdleService;
    readonly motifServicesService: MotifServicesService;
    readonly appStorageService: AppStorageService;
    readonly settingsService: SettingsService;
    readonly adiService: AdiService;
    readonly marketsService: MarketsService;
    readonly capabilitiesService: CapabilitiesService;
    readonly symbolsService: SymbolsService;
    readonly symbolDetailCacheService: SymbolDetailCacheService;
    readonly watchmakerService: WatchmakerService;
    readonly notificationChannelsService: NotificationChannelsService;
    readonly scanFormulaZenithEncodingService: ScanFormulaZenithEncodingService;
    readonly scansService: ScansService;
    readonly rankedDataIvemIdListDefinitionFactoryService: RankedDataIvemIdListDefinitionFactoryService;
    readonly rankedDataIvemIdListFactoryService: RankedDataIvemIdListFactoryService;
    readonly textFormatterService: TextFormatterService;
    readonly customHeadingsService: RevSourcedFieldCustomHeadings;
    readonly referenceableColumnLayoutsService: ReferenceableColumnLayoutsService;
    readonly referenceableDataSourceDefinitionsStoreService: ReferenceableDataSourceDefinitionsStoreService;
    readonly cellPainterFactoryService: CellPainterFactoryService;
    readonly commandRegisterService: CommandRegisterService;
    readonly keyboardService: KeyboardService;

    private _finalised = false;

    private _tableFieldSourceDefinitionCachingFactoryService: StandardTableFieldSourceDefinitionCachingFactoryService;
    private _referenceableDataSourcesService: ReferenceableDataSourcesService;
    private _activeColorSchemeName: string;

    constructor(readonly decimalFactory: DecimalFactory) {
        this.warningsService = new WarningsService();
        this.idleService = new IdleService();
        const dataItemFactory = new DataItemFactory();
        const adiPublisherFactory = new AdiPublisherFactory(decimalFactory);
        this.adiService = new AdiService(dataItemFactory, adiPublisherFactory);
        this.marketsService = new MarketsService(this.warningsService, this.adiService);
        this.motifServicesService = new MotifServicesService();
        this.appStorageService = new AppStorageService(this.marketsService);
        this.settingsService = new SettingsService(this.marketsService, this.idleService, this.motifServicesService, this.appStorageService);
        dataItemFactory.setServices(decimalFactory, this.marketsService);
        this.capabilitiesService = new CapabilitiesService();
        this.symbolsService = new SymbolsService(this.marketsService, this.settingsService);
        this.symbolDetailCacheService = new SymbolDetailCacheService(decimalFactory, this.marketsService, this.adiService.dataMgr, this.symbolsService);
        this.watchmakerService = new WatchmakerService(this.adiService);
        this.notificationChannelsService = new NotificationChannelsService(this.adiService);
        this.scanFormulaZenithEncodingService = new ScanFormulaZenithEncodingService(this.marketsService);
        this.scansService = new ScansService(this.adiService, this.symbolsService, this.notificationChannelsService, this.scanFormulaZenithEncodingService);
        this.rankedDataIvemIdListDefinitionFactoryService = new RankedDataIvemIdListDefinitionFactoryService(this.marketsService);
        this.rankedDataIvemIdListFactoryService = new RankedDataIvemIdListFactoryService(
            this.adiService,
            this.scansService,
            this.watchmakerService,
        );
        this.textFormatterService = new TextFormatterService(this.symbolsService, this.settingsService);
        this.customHeadingsService = new RevStandardSourcedFieldCustomHeadingsService();
        this.referenceableColumnLayoutsService = new ReferenceableColumnLayoutsService();
        this.referenceableDataSourceDefinitionsStoreService = new ReferenceableDataSourceDefinitionsStoreService(
        );
        this.cellPainterFactoryService = new CellPainterFactoryService(
            this.settingsService,
            this.textFormatterService,
        );
        this.commandRegisterService = new CommandRegisterService();
        this.keyboardService = new KeyboardService();
    }

    get tableFieldSourceDefinitionCachingFactoryService() { return this._tableFieldSourceDefinitionCachingFactoryService; }
    get referenceableDataSourcesService() { return this._referenceableDataSourcesService; }

    setTableFieldSourceDefinitionFactory(tableFieldSourceDefinitionFactory: TableFieldSourceDefinitionFactory) {
        this._tableFieldSourceDefinitionCachingFactoryService = StandardTableFieldSourceDefinitionCachingFactoryService.create(tableFieldSourceDefinitionFactory);
    }

    setTableRecordSourceFactory(tableRecordSourceFactory: TableRecordSourceFactory, tableFieldSourceDefinitionFactory: TableFieldSourceDefinitionFactory) {
        this._referenceableDataSourcesService = new ReferenceableDataSourcesService(
            this.referenceableColumnLayoutsService,
            tableFieldSourceDefinitionFactory,
            tableRecordSourceFactory,
        );
    }

    finalise() {
        if (!this._finalised) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (this._referenceableDataSourcesService !== undefined) {
                this._referenceableDataSourcesService.finalise();
            }
            this.referenceableColumnLayoutsService.finalise();

            this.scansService.finalise();
            this.notificationChannelsService.finalise();
            this.watchmakerService.finalise();
            this.symbolsService.finalise();
            this.textFormatterService.finalise();

            this.settingsService.finalise();
            this.marketsService.stop();
            this.idleService.finalise();

            this._finalised = true;
        }
    }
}
