import { StringId, Strings } from '../../res/internal-api';
import {
    AssertInternalError,
    Badness,
    CommaText,
    ComparisonResult,
    CorrectnessId,
    EnumInfoOutOfOrderError,
    Integer,
    SysDecimal,
    assert,
    compareInteger,
    compareNumber,
    getUniqueElementArraysOverlapElements,
    mSecsPerDay,
    mSecsPerHour,
    mSecsPerMin,
    mSecsPerSec,
    newDecimal,
    secsPerHour,
    secsPerMin
} from '../../sys/internal-api';
import { ZenithProtocolCommon } from './zenith-protocol/internal-api';

// No Enum value should have an external dependency or be persisted. Use exports or imports instead.

export const enum IncDecAction {
    idaInc,
    idaDec,
}

export const enum CurrencyId {
    Aud, // Australian Dollar
    Usd, // US Dollar
    Myr, // Malaysian Ringgit
    Gbp, // British pound
}

// export const enum MarketBoardId {
//     AsxBookBuild,                         // ASX BookBuild
//     AsxTradeMatchCentrePoint,             // ASX CentrePoint
//     AsxTradeMatch,                        // ASX TradeMatch
//     AsxTradeMatchAgric,                   // ASX TradeMatch ??
//     AsxTradeMatchAus,                     // ASX TradeMatch ??
//     AsxTradeMatchDerivatives,             // ASX TradeMatch Derivatives Market
//     AsxTradeMatchEquity1,                 // ASX TradeMatch Equity Market 1 (A-B)
//     AsxTradeMatchEquity2,                 // ASX TradeMatch Equity Market 2 (C-F)
//     AsxTradeMatchEquity3,                 // ASX TradeMatch Equity Market 3 (G-M)
//     AsxTradeMatchEquity4,                 // ASX TradeMatch Equity Market 4 (N-R)
//     AsxTradeMatchEquity5,                 // ASX TradeMatch Equity Market 5 (S-Z)
//     AsxTradeMatchIndex,                   // ASX TradeMatch Index Market
//     AsxTradeMatchIndexDerivatives,        // ASX TradeMatch Index Derivatives Market
//     AsxTradeMatchInterestRate,            // ASX TradeMatch Interest Rate Market
//     AsxTradeMatchPrivate,                 // ASX TradeMatch Private Market
//     AsxTradeMatchQuoteDisplayBoard,       // ASX TradeMatch Quote Display Board
//     AsxTradeMatchPractice,                // ASX TradeMatch Practice Market
//     AsxTradeMatchWarrants,                // ASX TradeMatch Warrants Market
//     AsxTradeMatchAD,                      // ASX TradeMatch AD
//     AsxTradeMatchED,                      // ASX TradeMatch ED
//     AsxPureMatch,                         // ASX PureMatch
//     AsxPureMatchEquity1,                  // ASX PureMatch Equity Market 1 (A-B)
//     AsxPureMatchEquity2,                  // ASX PureMatch Equity Market 2 (C-F)
//     AsxPureMatchEquity3,                  // ASX PureMatch Equity Market 3 (G-M)
//     AsxPureMatchEquity4,                  // ASX PureMatch Equity Market 4 (N-R)
//     AsxPureMatchEquity5,                  // ASX PureMatch Equity Market 5 (S-Z)
//     AsxVolumeMatch,                       // ASX VolumeMatch
//     ChixAustFarPoint,                     // Chi-X Australia Far-Point Market
//     ChixAustLimit,                        // Chi-X Australia Limit Market
//     ChixAustMarketOnClose,                // Chi-X Australia Market-on-Close Market
//     ChixAustMidPoint,                     // Chi-X Australia Mid-Point Market
//     ChixAustNearPoint,                    // Chi-X Australia Near-Point Market
//     NsxMain,                              // Australian National Stock Exchange Main
//     NsxCommunityBanks,                    // Australian National Stock Exchange Community Banks
//     NsxIndustrial,                        // Australian National Stock Exchange Industrial
//     NsxDebt,                              // Australian National Stock Exchange Debt
//     NsxMiningAndEnergy,                   // Australian National Stock Exchange Mining & Energy
//     NsxCertifiedProperty,                 // Australian National Stock Exchange Certified Property
//     NsxProperty,                          // Australian National Stock Exchange Property
//     NsxRestricted,                        // Australian National Stock Exchange Restricted
//     SimVenture,                           // SIM-VSE
//     SouthPacificStockExchangeEquities,    // South Pacific Stock Exchange Equities
//     SouthPacificStockExchangeRestricted,  // South Pacific Stock Exchange Restricted
//     NzxMainBoard,                         // NZX Main Board
//     NzxSpec,                              // NZX Spec
//     NzxFonterraShareholders,              // NZX Fonterra Shareholders Market
//     NzxIndex,                             // NZX Index Market
//     NzxDebtMarket,                        // NZX Debt Market
//     NzxComm,
//     NzxDerivativeFutures,                 // NZX Derivative Futures
//     NzxDerivativeOptions,                 // NZX Derivative Options
//     NzxIndexFutures,                      // NZX Index Futures
//     NzxEOpt,
//     NzxMFut,
//     NzxMOpt,
//     NzxDStgy,
//     NzxMStgy,
//     MyxNormalMarket,
//     MyxDirectBusinessTransactionMarket,
//     MyxIndexMarket,
//     MyxBuyInMarket,
//     MyxOddLotMarket,
//     PtxMain,
//     FnsxMain,
//     FpsxMain,
//     CfxMain,
//     DaxMain,
// }

export const enum TMarketMoversSymbolSortTypeId {
    msstHighestTurnover,
    msstHighestVolume,
    msstHighestPercentageGain,
    msstHighestPercentageLoss,
}

export const enum TMarketSegmentId {
    mksgAll,
    // ASX Market Segments
    mksgSmallCap,
    mksgMidCap,
    mksgLargeCap,
    mksgEnergy,
    mksgMaterials,
    mksgIndustrials,
    mksgConsumerDiscretionary,
    mksgConsumerStaples,
    mksgHealthCare,
    mksgFinancials,
    mksgInformationTechnology,
    mksgTelecommunicationServices,
    mksgUtilities,
    // MYX Market Segments
    mksgMyxMain,
    mksgMyxStrw, // (Warrants market)
    mksgMyxAce,  // (Technologies, used to be a  separate market)
    mksgMyxBond, // (Interest based securities)
    mksgMyxEft,  // (Exchange Traded Funds)
    mksgMyxLeap, // (New Ventures)
}

export const enum BuyOrSellId {
    Buy,
    Sell,
}

export const enum ExerciseTypeId {
    American,
    Asian,
    European,
}

export const enum DepthDirectionId {
    BidBelowAsk,
    AskBelowBid,
}

export const enum TDeliveryTypeId {
    dyCashSettlement,
    dyPhysicalDeliveryScripSettlement,
    dyFuturesContractSettlement,
    dyPhysicalDeliveryCommoditySettlement,
}

export const enum CallOrPutId {
    Call,
    Put,
}

export const enum TSufficientPermissionsStatusId {
    spsUnavailable,
    spsInsufficient,
    spsSufficient,
}

export const enum TBrokerageAccountServerSearchFieldId {
    bafCode,
    bafName,
    bafAccountSearchKey1,
    bafAccountSearchKey2,
    bafAccountHIN,
}

export const enum TBrokerageAccountServerSearchModeId {
    basStartsWith,
    basContains,
}

export const enum TBrokerageAccountAggregationTypeId {
    baatAccount,
    baatAdviser,
    baatGroup,
    baatBroker,
    baatAll,
}

export const enum TBrokerageAccountAggregationCommandTypeId {
    aactAccount,
    aactAdviser,
    aactGroup,
    aactBroker,
}

export const enum TBrokerageAccOrAggFieldId {
    baafCode,
    baafName,
}


export const enum OrderTradeTypeId {
    Buy,
    Sell,
    IntraDayShortSell,
    RegulatedShortSell,
    ProprietaryShortSell,
    ProprietaryDayTrade,
}

export const enum SymbolFieldId {
    Code,
    Name,
    Short,
    Long,
    Ticker,
    Gics,
    Isin,
    Base,
    Ric,
}

export const enum OrderSideId {
    Bid,
    Ask,
}

export const enum OrderInstructionId {
    PSS,
    IDSS,
    PDT,
    RSS,
    OnOpen,
    OnClose,
    Session,
    Best,
    Sweep,
    Block,
    Mid,
    MidHalf,
    Dark,
    DarkHalf,
    Any,
    AnyHalf,
    Single,
}

export const enum TimeInForceId {
    Day,
    GoodTillCancel,
    AtTheOpening,
    FillAndKill,  // Is identical to "Fill AND Kill". Ie: Partial orders are allowed.
    FillOrKill,         // Fill or kill doesn't allow partial files.
    AllOrNone,
    GoodTillCrossing,
    GoodTillDate,
    AtTheClose,
}

export const enum OrderTriggerTypeId {
    Immediate,
    Price,
    TrailingPrice,
    PercentageTrailingPrice,
    Overnight,
}

export const enum FeedId {
    Null,
    Authority_Trading, // Authority
    Authority_Watchlist, // Authority
    // MYX[Demo], // Market //
    // MYX:OD[Demo], // Market // oddlot
    // MYX:BI[Demo], // Market // buyin
    Trading_Oms,
    Trading_Motif,
    Trading_Malacca,
    Trading_Finplex,
    Trading_CFMarkets,
    Market_AsxBookBuild,
    Market_AsxPureMatch,
    Market_AsxTradeMatch,
    Market_AsxCentrePoint,
    Market_AsxVolumeMatch,
    Market_ChixAustLimit,
    Market_ChixAustFarPoint,
    Market_ChixAustMarketOnClose,
    Market_ChixAustNearPoint,
    Market_ChixAustMidPoint,
    Market_SimVenture,
    Market_Nsx,
    Market_SouthPacific,
    Market_Nzfox,
    Market_Nzx,
    Market_MyxNormal,
    Market_MyxDirectBusiness,
    Market_MyxIndex,
    Market_MyxOddLot,
    Market_MyxBuyIn,
    Market_Calastone,
    Market_AsxCxa,
    Market_PtxMain,
    Market_FnsxMain,
    Market_FpsxMain,
    Market_CfxMain,
    Market_DaxMain,
    News_Asx,
    News_Nsx,
    News_Nzx,
    News_Myx,
    News_Ptx,
    News_Fnsx,
    Watchlist,
    Scanner,
    Channel,
}

export const enum KnownFeedId {
    Authority,
    Watchlist,
    Scanner,
    Channel,
}

export const enum FeedClassId {
    Authority,
    Market,
    News,
    Trading,
    Watchlist,
    Scanner,
    Channel,
}

// export const enum MarketId {
//     AsxBookBuild,
//     AsxPureMatch,
//     AsxTradeMatch,
//     AsxTradeMatchCentrePoint,
//     AsxVolumeMatch,
//     ChixAustLimit,
//     ChixAustFarPoint,
//     ChixAustMarketOnClose,
//     ChixAustNearPoint,
//     ChixAustMidPoint,
//     SimVenture,
//     Nsx,
//     SouthPacific,
//     Nzx,
//     MyxNormal,
//     MyxDirectBusiness,
//     MyxIndex,
//     MyxOddLot,
//     MyxBuyIn,
//     Calastone,
//     AsxCxa,
//     PtxMain,
//     FnsxMain,
//     FpsxMain,
//     CfxMain,
//     DaxMain,
// }

// export const enum ExchangeId {
//     Asx,
//     Cxa,
//     Nsx,
//     Nzx,
//     Myx,
//     Calastone,
//     Ptx,
//     Fnsx,
//     Fpsx,
//     Cfx,
//     Dax,
//     AsxCxa,
// }

// export const enum DataEnvironmentId {
//     Production,
//     DelayedProduction,
//     Demo,
//     Sample,
// }

// export const enum TradingEnvironmentId {
//     Production,
//     Demo,
// }

export const enum NewsEnvironmentId {
    Production,
    Demo,
}

export const enum AuthStatusId {
    NotAuthorised,        // 0 - Credentials not sent.
    CredentialsAccepted,  // 1
    CredentialsRejected,  // 2
    AuthenticationError, // Error in code or infrastructure is preventing the user from logging in.
}

export const enum AdiPublisherTypeId {
    Zenith, // 0
}

export const enum DataMessageTypeId {
    PublisherSubscription_Onlined,
    PublisherSubscription_Offlining,
    PublisherSubscription_Warning,
    PublisherSubscription_Error,
    SuccessFail,
    Feeds,
    Markets,
    TradingStates,
    TradingMarkets,
    Depth,
    DepthLevels,
    Security,
    Trades,
    Symbols,
    Holdings,
    Balances,
    TopShareholders,
    BrokerageAccounts,
    Orders,
    Transactions,
    OrderStatuses,
    ZenithServerInfo,
    Synchronised,
    ChartHistory,
    ZenithPublisherStateChange,
    ZenithReconnect,
    ZenithPublisherOnlineChange,
    ZenithEndpointSelected,
    ZenithCounter,
    ZenithLog,
    ZenithSessionTerminated,
    ZenithQueryConfigure,
    PlaceOrderResponse,
    AmendOrderResponse,
    CancelOrderResponse,
    MoveOrderResponse,
    CreateScan,
    UpdateScan,
    DeleteScan,
    QueryScanDetail,
    ExecuteScan,
    ScanDescriptors,
    DataIvemIdMatches,
    CreateNotificationChannel,
    DeleteNotificationChannel,
    UpdateNotificationChannel,
    UpdateNotificationChannelEnabled,
    QueryNotificationChannel,
    QueryNotificationChannels,
    QueryNotificationDistributionMethod,
    QueryNotificationDistributionMethods,
    WatchmakerListRequestAcknowledge,
    CreateOrCopyWatchmakerList,
    WatchmakerListDescriptors,
    WatchmakerListDataIvemIds,
}

export const enum DataChannelId {
    ZenithExtConnection,
    ZenithQueryConfigure, // needs to move out of DataTypes in future
    Feeds,
    ClassFeeds,
    TradingStates,
    Markets,
    Depth,
    DepthLevels,
    Trades,
    LatestTradingDayTrades,
    Security,
    Symbols,
    BrokerageAccounts,
    BrokerageAccountHoldings,
    AllHoldings,
    BrokerageAccountBalances,
    AllBalances,
    LowLevelTopShareholders,
    TopShareholders,
    BrokerageAccountOrders,
    AllOrders,
    BrokerageAccountTransactions,
    AllTransactions,
    OrderRequests,
    OrderAudit,
    TradingMarkets,
    OrderStatuses,
    ZenithServerInfo,
    ChartHistory,
    DayTrades,
    PlaceOrderRequest,
    AmendOrderRequest,
    CancelOrderRequest,
    MoveOrderRequest,
    CreateScan,
    QueryScanDetail,
    DeleteScan,
    UpdateScan,
    ScanDescriptors,
    DataIvemIdMatches,
    DataIvemIdCreateWatchmakerList,
    CreateNotificationChannel,
    DeleteNotificationChannel,
    UpdateNotificationChannel,
    UpdateNotificationChannelEnabled,
    QueryNotificationChannel,
    QueryNotificationChannels,
    QueryNotificationDistributionMethod,
    QueryNotificationDistributionMethods,
    UpdateWatchmakerList,
    CopyWatchmakerList,
    DeleteWatchmakerList,
    WatchmakerListDescriptors,
    DataIvemIdWatchmakerListMembers,
    DataIvemIdAddToWatchmakerList,
    DataIvemIdInsertIntoWatchmakerList,
    MoveInWatchmakerList,
}

export const enum OrderTypeId {
    Unknown,
    Market,
    Limit,
    MarketOnClose,
    WithOrWithout,
    LimitOrBetter,
    LimitWithOrWithout,
    OnBasis,
    OnClose,
    LimitOnClose,
    ForexMarket,
    PreviouslyQuoted,
    PreviouslyIndicated,
    ForexLimit,
    ForexSwap,
    ForexPreviouslyQuoted,
    Funari,
    MarketIfTouched,
    MarketToLimit,
    PreviousFundValuationPoint,
    NextFundValuationPoint,
    Best,
    MarketAtBest,
}

export const enum TOrderAlgoId {
    oqhtVisible,
    oqhtHidden,
    oqhtIceberg,
    oqhtWork,
    oqhtAllOrNone,
    oqhtMinimumQuantity,
}

export const enum TradeFlagId {
    OffMarket,
    Placeholder,
    Cancel,
}

export const enum TradeAffectsId {
    Price,
    Volume,
    Vwap,
}

export const enum MovementId {
    None,
    Up,
    Down,
}

export const enum HigherLowerId {
    Same,
    Higher,
    Lower,
    Invalid,
}

export const enum TSecurityGicsSectorId {
    scgscEnergy,
    scgscMaterials,
    scgscIndustrials,
    scgscConsumerDiscretionary,
    scgscConsumerStaple,
    scgscHealthCare,
    scgscFinancials,
    scgscInformationTechnology,
    scgscTelecommunicationServices,
    scgscUtilities,
    scgscAsxInternal,
}

export const enum TSecurityGicsIndustryGroupId {
    scgigEnergy,
    scgigMaterials,
    scgigCapitalGoods,
    scgigCommercialServicesAndSupply,
    scgigTransportation,
    scgigAutomobileAndComponents,
    scgigConsumerDurablesAndApparel,
    scgigHotelsAndRestaurantsAndLeisure,
    scgigMedia,
    scgigRetailing,
    scgigFoodAndStaplesRetailing,
    scgigFoodAndBeverageAndTobacco,
    scgigHouseholdAndPersonalProducts,
    scgigHealthCareEquipmentAndServices,
    scgigPharmaceuticalsAndBiotechnology,
    scgigBanks,
    scgigDiversifiedFinancials,
    scgigInsurance,
    scgigRealEstate,
    scgigSofwareAndServices,
    scgigTechnologyHardwareAndEquipment,
    scgigSemiconductorsAndSemiconductorEquipment,
    scgigTelecommunicationServices,
    scgigUtilities,
    scgigClassificationPending,
    scgigGicsSectorCodeNotApplicable,
}

export const enum TNewsFieldId {
    nfiId,
    nfiSource,
    nfiReleaseGmtDateTime,
    nfiReleaseLocalDateTime,
    nfiReleaseSourceDateTime,
    nfiReleaseDefaultDateTime,
    nfiAllAnnouncers,
    nfiHeadline,
    nfiDocMediaType,
    nfiNewsReportTypeIds,
    nfiRef,
    nfiSensitivity,
    nfiNumberPages,
    nfiURI,
}

export const enum TNewsItemDocMediaTypeId {
    sdmHtml,
    sdmPdf,
    sdmText,
} // order is used for sorting
// type TNewsItemDocMediaTypeIdSet = EnumSet;

export const enum TNewsItemSensitivityId {
    nisNotSpecified,
    nisNotSensitive,
    nisSensitive,
} // order is used for sorting
// type TNewsItemSensitivityIdSet = EnumSet;

export const enum TNewsReportTypeId {
    nrtiTakeoverAnnouncement,
    nrtiIntentionToMakeTakeoverBid,
    nrtiBiddersStatement_OffMarketBid,
    nrtiTargetsStatement_OffMarketBid,
    nrtiBiddersStatement_MarketBid,
    nrtiTargetsStatement_MarketBid,
    nrtiOffMarketBidOfferDocumentToBidClassHolders,
    nrtiDirectorsStatementReTakeover,
    nrtiVariationOfTakeoverBid,
    nrtiTakeover_Other,
    nrtiSupplementaryBiddersStatement,
    nrtiSupplementaryTargetsStatement,
    nrtiSchemeOfArrangement,
    nrtiIndicativeNonBindingProposal,
    nrtiWithdrawalOfOffer,

    nrtiSecurityHolderDetails,
    nrtiBecomingASubstantialHolder,
    nrtiChangeInSubstantialHolding,
    nrtiCeasingToBeASubstantialHolder,
    nrtiBeneficialOwnershipPart6C_2,
    nrtiTakeoverUpdateSection689Notice,
    nrtiSecurityHolderDetails_Other,
    nrtiSection205GNotice_DirectorsInterests,
    nrtiInitialDirectorsInterestNotice,
    nrtiChangeOfDirectorsInterestNotice,
    nrtiFinalDirectorsInterestNotice,

    nrtiPeriodicReports,
    nrtiAnnualReport,
    nrtiTop20Shareholders,
    nrtiPreliminaryFinalReport,
    nrtiHalfYearlyReport,
    nrtiConfirmationThatAnnualReportWasSentToSecurityHolders,
    nrtiTrust6MonthAccounts,
    nrtiTrust12MonthAccounts,
    nrtiLoanSecuritiesOnIssue,
    nrtiHalfYearAuditReview,
    nrtiHalfYearDirectorsStatement,
    nrtiFullYearAccounts,
    nrtiFullYearAuditReview,
    nrtiFullYearDirectorsStatement,
    nrtiPeriodicReports_Other,
    nrtiHalfYearAccounts,
    nrtiMonthlyNetTangibleAssetBacking,
    nrtiConciseFinancialReport,
    nrtiDailyFundUpdate,
    nrtiHalfYearDirectorsReport,
    nrtiFullYearDirectorsReport,
    nrtiProfitGuidance,
    nrtiDebtFacility,
    nrtiCreditRating,
    nrtiCorporateGovernance,
    nrtiAppendix4G,

    nrtiQuarterlyActivitiesReport,
    nrtiFirstQuarterActivitiesReport,
    nrtiSecondQuarterActivitiesReport,
    nrtiThirdQuarterActivitiesReport,
    nrtiFourthQuarterActivitiesReport,
    nrtiQuarterlyActivitiesReport_Other,

    nrtiQuarterlyCashFlowReport,
    nrtiFirstQuarterCashFlowReport,
    nrtiSecondQuarterCashFlowReport,
    nrtiThirdQuarterCashFlowReport,
    nrtiFourthQuarterCashFlowReport,
    nrtiQuarterlyCashFlowReport_Other,

    nrtiIssuedCapital,
    nrtiRenounceableIssue,
    nrtiBonusIssue,
    nrtiPlacement,
    nrtiIssuesToThePublic,
    nrtiCapitalReconstruction,
    nrtiNewIssueLetterOfOfferAndAccForm,
    nrtiAlterationToIssuedCapital,
    nrtiNonRenounceableIssue,
    nrtiIssuedCapital_Other,
    nrtiDisclosureDocument,
    nrtiOnMarketBuyBack,
    nrtiDailyShareBuyBackNotice,
    nrtiAppendix3B,
    nrtiASXBookBuildUpcomingCommenced,
    nrtiASXBookBuildChangeInPublicParameter,
    nrtiASXBookBuildCloseCancel,
    nrtiSecurityPurchasePlan,
    nrtiCleansingNotice,
    nrtiOffMarketBuyBack,

    nrtiAssetAcquisitionAndDisposal,
    nrtiAssetAcquisition,
    nrtiAssetDisposal,
    nrtiAssetAcquisitionAndDisposal_Other,

    nrtiNoticeOfMeeting,
    nrtiNoticeOfAnnualGeneralMeeting,
    nrtiNoticeOfExtraordinaryGeneralMeeting,
    nrtiResultsOfMeeting,
    nrtiProxyForm,
    nrtiAlterationToNoticeOfMeeting,
    nrtiNoticeOfMeeting_Other,
    nrtiNoticeOfGeneralMeeting,

    nrtiAsxAnnouncement,
    nrtiSuspensionFromOfficialQuotation,
    nrtiReinstatementToOfficialQuotation,
    nrtiRemovalFromOfficialList,
    nrtiAsxAnnouncementQuery,
    nrtiNoticePending,
    nrtiChangeInBasisOfQuotation,
    nrtiTradingHalt,
    nrtiAdmissionToOfficialList,
    nrtiCommencementOfOfficialQuotation,
    nrtiAsxAnnouncement_Other,
    nrtiMapCancellation,
    nrtiMapCorrection,
    nrtiEndOfDay,
    nrtiTradingHaltLifted,
    nrtiASXCirculars,

    nrtiDividendAnnouncement,
    nrtiDividendBooksClosing,
    nrtiDividendPayDate,
    nrtiDividendRate,
    nrtiDividendAlteration,
    nrtiDividend_Other,
    nrtiDividendReinvestmentPlan,
    nrtiInterestRecordDate,
    nrtiInterestPayDate,
    nrtiInterestRate,

    nrtiProgressReportPrimary,
    nrtiProgressReport,
    nrtiProgressReport_Other,

    nrtiCompanyAdministration,
    nrtiDirectorAppointmentResignation,
    nrtiDetailsOfCompanyAddress,
    nrtiDetailsOfRegisteredOfficeAddress,
    nrtiDetailsOfShareRegistryAddress,
    nrtiTrusteeAppointmentResignation,
    nrtiTrustManagerAppointmentResignation,
    nrtiCompanySecretaryAppointmentResignation,
    nrtiCompanyAdministration_Other,
    nrtiChangeOfBalanceDate,
    nrtiTrustDeed,
    nrtiArticlesOfAssociation,
    nrtiConstitution,
    nrtiResponsibleEntityAppointmentResignation,
    nrtiChangeOfCompanyName,
    nrtiAdministratorReceiverAppointedRemoved,

    nrtiNoticeOfCallContributingShares,
    nrtiAnnouncementOfCall,
    nrtiNoticeOfCallToShareholders,
    nrtiNoticeOfCall_Other,

    nrtiOtherPrimary,
    nrtiOther,
    nrtiInternal,
    nrtiLegalProceedings,
    nrtiAppendix16A,
    nrtiYear2000Advice,
    nrtiOpenBriefing,
    nrtiOverseasListing,
    nrtiStandardAndPoorsAnnouncement013TradingPolicy,
    nrtiTradingPolicy,
    nrtiMapTest,

    nrtiChairmansAddress,
    nrtiChairmansAddress_Other,
    nrtiChairmansAddressToShareholders,

    nrtiLetterToShareHoldersPrimary,
    nrtiLetterToShareholders_Other,
    nrtiLetterToShareholders,

    nrtiAsxQueryPrimary,
    nrtiAsxQuery_Other,
    nrtiAsxQuery,
    nrtiResponseToAsxQuery,

    nrtiStructuredProducts,
    nrtiStructuredProducts_Other,
    nrtiStructuredProducts_IssuerReport,
    nrtiStructuredProducts_DisclosureDocument,
    nrtiStructuredProducts_Acceptance,
    nrtiStructuredProducts_TrustDeed,
    nrtiStructuredProducts_Distribution,
    nrtiStructuredProducts_Adjustment,
    nrtiStructuredProducts_SupplementaryDisclosureDocument,

    nrtiCommitmentsTestEntityQuarterlyReports,
    nrtiCommitmentsTestEntity_FirstQuarterReport,
    nrtiCommitmentsTestEntity_SecondQuarterReport,
    nrtiCommitmentsTestEntity_ThirdQuarterReport,
    nrtiCommitmentsTestEntity_FourthQuarterReport,
    nrtiCommitmentsTestEntity_Other,

    nrtiMFund,
    nrtiMFund_DisclosureDocument,
    nrtiMFund_FundProfile,
    nrtiMFund_AlterationToIssuedCapital,
    nrtiMFund_DailyUpdate,
    nrtiMFund_DividendRecordDate,
    nrtiMFund_DividendPayment,
    nrtiMFund_DividendRate,
    nrtiMFund_NetTangibleAssetBacking,
    nrtiMFund_Other,
}

// MYX Sectors are defined in Appendix F of "BTS2 Fix Specificiation":
//   Version: 1.14
//   Date: 05 February 2018
//   File: BTS2-FIX-Specification-Market-Data-v1-14.pdf
export const enum TTMyxSectorId {
    msConsumer,
    msIndProd,
    msConstructn,
    msTradServ,
    msTechnology,
    msIpc,
    msSpac,
    msFinance,
    msHotels,
    msProperties,
    msPlantation,
    msMining,
    msLeap,
    msReits,
    msEtfCommodity,
    msClosedFund,
    msEtfEquity,
    msEtfBond,
    msStrcWarroth,
    msBondConvtnl,
    msBondIslamic,
}

export const enum OrderRequestTypeId {
    Place,
    Amend,
    Cancel,
    Move,
}

export const enum FeedStatusId {
    Initialising,
    Active,
    Closed,
    Inactive,
    Impaired,
    Expired,
}

export const enum SubscribabilityExtentId {
    None = 0,
    Some = 1,
    All = 2,
}

export const enum PublisherSubscriptionDataTypeId {
    Asset,
    Trades,
    Depth,
    DepthFull,
    DepthShort,
}

export const enum IvemClassId {
    Unknown,
    Market,
    ManagedFund,
}

export const enum OrderRequestFlagId {
    Pds, // Signifies that the user has accepted the Product Disclosure Statement. Valid for PlaceOrder only.
}

export const enum OrderRequestAlgorithmId {
    Market,
    BestMarket,
}

export const enum OrderShortSellTypeId {
    ShortSell,
    ShortSellExempt,
}

export const enum TrailingStopLossOrderConditionTypeId {
    Price,
    Percent,
}

export const enum OrderPriceUnitTypeId {
    Currency,
    Units,
}

export const enum OrderRouteAlgorithmId {
    Market,
    BestMarket,
    Fix,
}

export const enum OrderRequestErrorCodeId {
    Unknown,
    Account,
    Account_DailyNet,
    Account_DailyGross,
    Authority,
    Connection,
    Details,
    Error,
    Exchange,
    Internal,
    Internal_NotFound,
    Order,
    Operation,
    Retry,
    Route,
    Route_Algorithm,
    Route_Market,
    Route_Symbol,
    Status,
    Style,
    Submitted,
    Symbol,
    Symbol_Authority,
    Symbol_Status,
    TotalValue_Balance,
    TotalValue_Maximum,
    ExpiryDate,
    HiddenQuantity,
    HiddenQuantity_Symbol,
    LimitPrice,
    LimitPrice_Distance,
    LimitPrice_Given,
    LimitPrice_Maximum,
    LimitPrice_Missing,
    MinimumQuantity,
    MinimumQuantity_Symbol,
    OrderType,
    OrderType_Market,
    OrderType_Status,
    OrderType_Symbol,
    Side,
    Side_Maximum,
    TotalQuantity,
    TotalQuantity_Minimum,
    TotalQuantity_Holdings,
    Validity,
    Validity_Symbol,
    VisibleQuantity,
    TotalQuantity_Maximum,
    UnitType,
    UnitAmount,
    Currency,
    Flags_PDS,
}

export const enum AuiChangeTypeId {
    Add,
    Update,
    Initialise,
}

export const enum AurcChangeTypeId {
    Add,
    Update,
    Remove,
    Clear,
}

export const enum OrderPadStatusId {
    AllFieldsOk,    // All fields are ok.
    InvalidFields,  // One or more fields contain invalid data.
    MissingFields,  // One or more required fields are missing.
    DataPending,    // Data required by one or more fields is not yet available.
}

export const enum OrderRequestResultId {
    Success,
    Error,
    Incomplete,
    Invalid,
    Rejected,
}

export const enum DepthStyleId {
    Full,  // All orders.
    Short, // Only price levels.
}

export const enum ChartIntervalId {
    OneMinute,
    FiveMinutes,
    FifteenMinutes,
    ThirtyMinutes,
    OneDay,
}

export const enum ZenithPublisherStateId {
    Initialise,
    ReconnectDelay,
    AccessTokenWaiting,
    SocketOpen,
    AuthFetch,
    AuthActive,
    AuthUpdate,
    SocketClose,
    Finalised,
}

export const enum ZenithPublisherReconnectReasonId {
    NewEndpoints,
    PassportTokenFailure,
    SocketConnectingError,
    AuthRejected,
    AuthExpired,
    UnexpectedSocketClose,
    SocketClose,
    Timeout,
}

export const enum PublisherSessionTerminatedReasonId {
    KickedOff,
    Other,
}

export const enum ActiveFaultedStatusId {
    Active, // Enabled and not faulty
    Inactive, // Disabled
    Faulted, // Enabled and ok
}

export const enum ScanTargetTypeId {
    Markets,
    Symbols,
}

export const enum NotificationDistributionMethodId {
    Debug,
    Email,
    Sms,
    WebPush,
    ApplePush,
    GooglePush,
}

export type DataItemId = Integer;
export type DataItemRequestNr = Integer;
// export type BrokerageAccountId = string;
export type OrderId = string;

export const invalidDataItemId: DataItemId = 0;
export const firstDataItemId: DataItemId = 1;
export const invalidDataItemRequestNr: DataItemRequestNr = 0;
export const firstDataItemRequestNr: DataItemRequestNr = 1;
export const broadcastDataItemRequestNr: DataItemRequestNr = -1;

export const unknownZenithCode = '|Unknown|';

export interface ZenithIvemId {
    readonly code: string;
    readonly zenithExchangeCode: string;
}

export namespace ZenithIvemId {
    export function toString(symbol: ZenithIvemId) {
        return `${symbol.code}.${symbol.zenithExchangeCode}`;
    }

    export function toMapKey(symbol: ZenithIvemId) {
        return `${symbol.zenithExchangeCode}:${symbol.code}`;
    }

    export function isUndefinableEqual(left: ZenithIvemId | undefined, right: ZenithIvemId | undefined): boolean {
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

    export function isEqual(left: ZenithIvemId, right: ZenithIvemId): boolean {
        return (left.code === right.code) && (left.zenithExchangeCode === right.zenithExchangeCode);
    }

}

export interface ZenithMarketBoard {
    // id: MarketBoardId;
    // environmentId: DataEnvironmentId;
    zenithCode: string;
    status: string;
}

export namespace ZenithMarketBoard {
    export function isEqual(left: ZenithMarketBoard, right: ZenithMarketBoard): boolean {
        return left.zenithCode === right.zenithCode && left.status === right.status;
    }
}

export type ZenithMarketBoards = readonly ZenithMarketBoard[];

export namespace ZenithMarketBoards {
    export function isUndefinableEqual(left: ZenithMarketBoards | undefined, right: ZenithMarketBoards | undefined): boolean {
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

    // for speed, order of boards also has to be the same.
    export function isEqual(left: ZenithMarketBoards, right: ZenithMarketBoards): boolean {
        const leftCount = left.length;
        const rightCount = right.length;
        if (leftCount !== rightCount) {
            return false;
        } else {
            for (let i = 0; i < leftCount; i++) {
                if (!ZenithMarketBoard.isEqual(left[i], right[i])) {
                    return false;
                }
            }
            return true;
        }
    }

    export function indexOf(boards: ZenithMarketBoards, zenithCode: string): Integer {
        const count = boards.length;
        for (let i = 0; i < count; i++) {
            const board = boards[i];
            if (board.zenithCode === zenithCode) {
                return i;
            }
        }

        return -1;
    }
}



// export namespace BrokerageAccountId {
//     export const nullId = '';

//     export function isUndefinableEqual(left: BrokerageAccountId | undefined, right: BrokerageAccountId | undefined) {
//         if (left === undefined) {
//             return right === undefined;
//         } else {
//             if (right === undefined) {
//                 return false;
//             } else {
//                 return isEqual(left, right);
//             }
//         }
//     }

//     export function isEqual(left: BrokerageAccountId, right: BrokerageAccountId) {
//         return left.toUpperCase() === right.toUpperCase();
//     }

//     export function compare(left: BrokerageAccountId, right: BrokerageAccountId) {
//         return compareString(left, right);
//     }
// }

// NOTE: Market order ID is not unique per market. For a unique identifer combine the
// exchange, side (bid or ask), symbol and market order ID identifiers.
export type MarketOrderId = Integer; // This is probably wrong

/*export class BrokerageAccountAggregation {

    static isEqual(left: BrokerageAccountAggregation, right: BrokerageAccountAggregation): boolean {
        if (left.id !== right.id) {
            return false;
        } else {
            if (left.id === BrokerageAccountId.Null) {
                return true;
            } else {
                return left.typeId === right.typeId;
            }
        }
    }

    constructor(public typeId: TBrokerageAccountAggregationTypeId, public id: string) { }

    isNull(): boolean {
        return this.id === BrokerageAccountId.Null;
    }

    nullify() {
        this.id = BrokerageAccountId.Null;
    }
}*/

/* eslint-disable no-bitwise */

// Enum Namespaces

export namespace Currency {
    export type Id = CurrencyId;
    export const nullCurrencyId = CurrencyId.Aud; // Aud is not really null - just used as placeholder

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly jsonValue: string;
        readonly codeId: StringId;
        readonly symbol: StringId;
    }

    type InfosObject = { [id in keyof typeof CurrencyId]: Info };

    const infosObject: InfosObject = {
        Aud: {
            id: CurrencyId.Aud,
            name: 'Aud',
            jsonValue: 'Aud',
            codeId: StringId.CurrencyCode_Aud,
            symbol: StringId.CurrencySymbol_Aud,
        },
        Usd: {
            id: CurrencyId.Usd,
            name: 'Usd',
            jsonValue: 'Usd',
            codeId: StringId.CurrencyCode_Usd,
            symbol: StringId.CurrencySymbol_Usd,
        },
        Myr: {
            id: CurrencyId.Myr,
            name: 'Myr',
            jsonValue: 'Myr',
            codeId: StringId.CurrencyCode_Myr,
            symbol: StringId.CurrencySymbol_Myr,
        },
        Gbp: {
            id: CurrencyId.Gbp,
            name: 'Gbp',
            jsonValue: 'Gbp',
            codeId: StringId.CurrencyCode_Gbp,
            symbol: StringId.CurrencySymbol_Gbp,
        },
    } as const;

    const infos = Object.values(infosObject);
    export const idCount = infos.length;
    export const allIds: readonly CurrencyId[] = generateAllIds();

    function generateAllIds(): readonly CurrencyId[] {
        const result = new Array<CurrencyId>(idCount);
        for (let i = 0; i < idCount; i++) {
            const info = infos[i];
            const id = info.id;
            if (id !== i as CurrencyId) {
                throw new EnumInfoOutOfOrderError('CurrencyId', i, Strings[info.codeId]);
            } else {
                result[i] = id;
            }
        }
        return result;
    }

    export function idToCodeId(id: Id) {
        return infos[id].codeId;
    }

    export function idToCode(id: Id) {
        return Strings[idToCodeId(id)];
    }

    export function tryCodeToId(code: string) {
        for (let i = 0; i < idCount; i++) {
            const info = infos[i];
            if (Strings[info.codeId] === code) {
                return info.id;
            }
        }
        return undefined;
    }

    export function idToDisplayId(id: Id) {
        return infos[id].codeId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function tryDisplayToId(display: string) {
        for (let i = 0; i < idCount; i++) {
            const info = infos[i];
            if (Strings[info.codeId] === display) {
                return info.id;
            }
        }
        return undefined;
    }

    export function compareId(Left: Id, Right: Id): ComparisonResult {
        return compareNumber(Left, Right);
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function tryNameToId(name: string) {
        for (let i = 0; i < idCount; i++) {
            const info = infos[i];
            if (info.name === name) {
                return info.id;
            }
        }
        return undefined;
    }

    export function idToJsonValue(id: Id) {
        return infos[id].jsonValue;
    }

    export function tryJsonValueToId(value: string) {
        const index = infos.findIndex(info => info.jsonValue === value);
        return index >= 0 ? infos[index].id : undefined;
    }
}

/*export namespace OrderDestination {

    type Id = OrderDestinationId;
    type IdSet = OrderDestinationIdSet;
    type IdArray = OrderDestinationIdArray;

    class Info {
        constructor(
            public id: Id,
            public name: string,
            public jsonValue: string,
            public exchangeId: ExchangeId,
            public defaultLitId: MarketId,
            public abbrDisplay: string,
            public display: string,
            public listingRootSources: TSymbolSourceIdArray,
            public allowedOrderTypes: TOrderTypeIdArray,
            public defaultOrderType: OrderTypeId,
            public allowedTimeInForces: TimeInForceIdArray,
            public defaultTimeInForce: TimeInForceId,
            public directMarketLink: MarketId | undefined,
            public hasPriceStepRestrictions: boolean, // Should orders to this destination be limited to valid price steps?
            public allowedSides: SideIdArray
        ) { }
    }

    export const invalidId = OrderDestinationId.SouthPacific; // not really invalid - used as dummy

    const AsxTradeMatchAllowedOrderTypes = [OrderTypeId.Limit, OrderTypeId.MarketToLimit];
    const AsxCentrepointAllowedOrderTypes = [OrderTypeId.Limit, OrderTypeId.Market];
    const AsxVolumeMatchAllowedOrderTypes = [OrderTypeId.Market];

    const ChiXAustraliaAllowedOrderTypes = [OrderTypeId.MarketOnClose, OrderTypeId.Limit]; // allow MarketOnClose orders for Chi-X

    const NsxAllowedOrderTypes = [OrderTypeId.Limit, OrderTypeId.Market];
//    const NzxAllowedOrderTypes = [];

    const MyxAllowedOrderTypes = [OrderTypeId.Limit, OrderTypeId.Market, OrderTypeId.MarketAtBest];
    const MyxAllowedTimeInForces =
        [
            TimeInForceId.Day,
            TimeInForceId.GoodTillCancel,
            TimeInForceId.FillOrKill,
            TimeInForceId.FillAndKill,
            TimeInForceId.GoodTillDate
        ];
    const StandardAllowedSideTypes = [SideId.Buy, SideId.Sell, SideId.SellShort];
    const MyxAllowedSideTypes = [SideId.Buy, SideId.Sell, SideId.SellShort, SideId.SellShortExempt];

    const infos: Info[] =
        [
            {
                id: OrderDestinationId.BestPrice,
                name: 'BestPrice',
                jsonValue: 'BestPrice',
                exchangeId: ExchangeId.AsxCxa,
                defaultLitId: MarketId.AsxCxa,
                abbrDisplay: 'BEST',
                display: 'Best Price',
                listingRootSources: [SymbolSourceId.Asx, SymbolSourceId.Cxa],
                allowedOrderTypes: [OrderTypeId.Limit, OrderTypeId.MarketToLimit], // Limit or market-to-limit.
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.AsxCxa,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.MyxNormal,
                name: 'MyxNormal',
                jsonValue: 'MyxNormal',
                exchangeId: ExchangeId.Myx,
                defaultLitId: MarketId.MyxNormal,
                abbrDisplay: 'MYNM',
                display: 'MYX Normal',
                listingRootSources: [SymbolSourceId.Myx],
                allowedOrderTypes: MyxAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: MyxAllowedTimeInForces,    // See GetAllowedTimeInForceIdSet() for more.
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.MyxNormal,
                hasPriceStepRestrictions: true,
                allowedSides: MyxAllowedSideTypes,
            },
            {
                id: OrderDestinationId.MyxOddLot,
                name: 'MyxOddLot',
                jsonValue: 'MyxOddLot',
                exchangeId: ExchangeId.Myx,
                defaultLitId: MarketId.MyxOddLot,
                abbrDisplay: 'MYOD',
                display: 'MYX Odd Lot',
                listingRootSources: [SymbolSourceId.Myx],
                allowedOrderTypes: MyxAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: MyxAllowedTimeInForces,   // See GetAllowedTimeInForceIdSet() for more.
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.MyxOddLot,
                hasPriceStepRestrictions: true,
                allowedSides: MyxAllowedSideTypes
            },
            {
                id: OrderDestinationId.MyxBuyIn,
                name: 'MyxBuyIn',
                jsonValue: 'MyxBuyIn',
                exchangeId: ExchangeId.Myx,
                defaultLitId: MarketId.MyxBuyIn,
                abbrDisplay: 'MYBI',
                display: 'MYX Buy In',
                listingRootSources: [SymbolSourceId.Myx],
                allowedOrderTypes: [OrderTypeId.Market],
                defaultOrderType: OrderTypeId.Market,
                allowedTimeInForces: [TimeInForceId.FillAndKill],
                defaultTimeInForce: TimeInForceId.FillAndKill,
                directMarketLink: MarketId.MyxBuyIn,
                hasPriceStepRestrictions: true,
                allowedSides: MyxAllowedSideTypes
            },
            {
                id: OrderDestinationId.AsxTradeMatch,
                name: 'AsxTradeMatch',
                jsonValue: 'AsxTradeMatch',
                exchangeId: ExchangeId.Asx,
                defaultLitId: MarketId.AsxTradeMatch,
                abbrDisplay: 'ASXT',
                display: 'ASX TradeMatch',
                listingRootSources: [SymbolSourceId.Asx],
                allowedOrderTypes: AsxTradeMatchAllowedOrderTypes,
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.AsxTradeMatch,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.AsxCentrepoint,
                name: 'AsxCentrepoint',
                jsonValue: 'AsxCentrepoint',
                exchangeId: ExchangeId.Asx,
                defaultLitId: MarketId.AsxTradeMatch,
                abbrDisplay: 'ASXC',
                display: 'ASX Centrepoint',
                listingRootSources: [SymbolSourceId.Asx],
                allowedOrderTypes: AsxCentrepointAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.AsxCentrePoint,
                hasPriceStepRestrictions: false,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.AsxPurematch,
                name: 'AsxPurematch',
                jsonValue: 'AsxPurematch',
                exchangeId: ExchangeId.Asx,
                defaultLitId: MarketId.AsxPureMatch,
                abbrDisplay: 'ASXP',
                display: 'ASX VolumeMatch',
                listingRootSources: [SymbolSourceId.Asx],
                allowedOrderTypes: AsxVolumeMatchAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Market,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.AsxPureMatch,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.ChixAustLimit,
                name: 'ChixAustLimit',
                jsonValue: 'ChixAustLimit',
                exchangeId: ExchangeId.Cxa,
                defaultLitId: MarketId.ChixAustLimit,
                abbrDisplay: 'CXAC',
                display: 'ChiX Aust Limit',
                listingRootSources: [SymbolSourceId.Cxa, SymbolSourceId.Asx],
                allowedOrderTypes: ChiXAustraliaAllowedOrderTypes,
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day],
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.ChixAustLimit,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.ChixAustNearPoint,
                name: 'ChixAustNearPoint',
                jsonValue: 'ChixAustNearPoint',
                exchangeId: ExchangeId.Cxa,
                defaultLitId: MarketId.ChixAustLimit,
                abbrDisplay: 'CXAN',
                display: 'ChiX Aust Near Point',
                listingRootSources: [SymbolSourceId.Cxa, SymbolSourceId.Asx],
                allowedOrderTypes: ChiXAustraliaAllowedOrderTypes,
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day],
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.ChixAustNearPoint,
                hasPriceStepRestrictions: false,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.ChixAustFarPoint,
                name: 'ChixAustFarPoint',
                jsonValue: 'ChixAustFarPoint',
                exchangeId: ExchangeId.Cxa,
                defaultLitId: MarketId.ChixAustLimit,
                abbrDisplay: 'CXAF',
                display: 'ChiX Aust Far Point',
                listingRootSources: [SymbolSourceId.Cxa, SymbolSourceId.Asx],
                allowedOrderTypes: ChiXAustraliaAllowedOrderTypes,
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day],
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.ChixAustFarPoint,
                hasPriceStepRestrictions: false,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.ChixAustMidPoint,
                name: 'ChixAustMidPoint',
                jsonValue: 'ChixAustMidPoint',
                exchangeId: ExchangeId.Cxa,
                defaultLitId: MarketId.ChixAustLimit,
                abbrDisplay: 'CXAP',
                display: 'ChiX Aust Mid Point',
                listingRootSources: [SymbolSourceId.Cxa, SymbolSourceId.Asx],
                allowedOrderTypes: ChiXAustraliaAllowedOrderTypes,
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day],
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.ChixAustMidPoint,
                hasPriceStepRestrictions: false,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.ChixAustMarketOnClose,
                name: 'ChixAustMarketOnClose',
                jsonValue: 'ChixAustMarketOnClose',
                exchangeId: ExchangeId.Cxa,
                defaultLitId: MarketId.ChixAustLimit,
                abbrDisplay: 'CXAM',
                display: 'ChiX Aust MoC',
                listingRootSources: [SymbolSourceId.Cxa, SymbolSourceId.Asx],
                allowedOrderTypes: ChiXAustraliaAllowedOrderTypes,
                defaultOrderType: OrderTypeId.MarketToLimit,
                allowedTimeInForces: [TimeInForceId.Day],
                defaultTimeInForce: TimeInForceId.Day,
                directMarketLink: MarketId.ChixAustMarketOnClose,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.Nsx,
                name: 'Nsx',
                jsonValue: 'Nsx',
                exchangeId: ExchangeId.Nsx,
                defaultLitId: MarketId.Nsx,
                abbrDisplay: 'XNEC',
                display: 'NSX',
                listingRootSources: [SymbolSourceId.Nsx],
                allowedOrderTypes: NsxAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.Nsx,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.SimVenture,
                name: 'SimVenture',
                jsonValue: 'SimVenture',
                exchangeId: ExchangeId.Nsx,
                defaultLitId: MarketId.SimVenture,
                abbrDisplay: 'SIMV',
                display: 'SIM Venture',
                listingRootSources: [SymbolSourceId.Nsx],
                allowedOrderTypes: NsxAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.SimVenture,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                id: OrderDestinationId.SouthPacific,
                name: 'SouthPacific',
                jsonValue: 'SouthPacific',
                exchangeId: ExchangeId.Nsx,
                defaultLitId: MarketId.SouthPacific,
                abbrDisplay: 'XSPS',
                display: 'South Pacific',
                listingRootSources: [SymbolSourceId.Nsx],
                allowedOrderTypes: NsxAllowedOrderTypes,
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.SouthPacific,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
            {
                // Todo:Med fix up the entries below
                id: OrderDestinationId.Ptx,
                name: 'Ptx',
                jsonValue: 'ptx',
                exchangeId: ExchangeId.Ptx,
                defaultLitId: MarketId.Ptx,
                abbrDisplay: 'PTX',
                display: 'PTX',
                listingRootSources: [SymbolSourceId.Ptx],
                allowedOrderTypes: [OrderTypeId.Limit],
                defaultOrderType: OrderTypeId.Limit,
                allowedTimeInForces: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
                defaultTimeInForce: TimeInForceId.GoodTillCancel,
                directMarketLink: MarketId.Ptx,
                hasPriceStepRestrictions: true,
                allowedSides: StandardAllowedSideTypes
            },
        ];

    export const idCount = infos.length;

    class ConstructInfo {
        Id: Id;
        SetMask: number;
        ListingRootSourceIdSet: TSymbolSourceIdSet;
        UpperJsonValue: string;
        UpperDisplay: string;
        UpperAbbrDisplay: string;

        constructor(
            info: Info
        ) {
            this.Id = info.id;
            this.SetMask = 1 << this.Id;
            this.ListingRootSourceIdSet = SymbolSource.createSet(info.listingRootSources);
            this.UpperJsonValue = info.jsonValue.toUpperCase();
            this.UpperDisplay = info.display.toUpperCase();
            this.UpperAbbrDisplay = info.abbrDisplay.toUpperCase();
        }
    }

    const ConstructInfos = new Array<ConstructInfo>(idCount);

    export function StaticConstructor() {
        for (let id = 0; id < OrderDestination.idCount; id++) {
            if (id !== infos[id].id) {
                throw new EnumInfoOutOfOrderError('OrderDestinationId', id, `${infos[id].name}`);
            }
        }

        for (let idx = 0; idx < infos.length; idx++) {
            ConstructInfos[idx] = new ConstructInfo(infos[idx]);
        }
    }

    export function CreateSet(idArray: IdArray): IdSet {
        let result = 0;
        for (const id of idArray) {
            result |= ConstructInfos[id].SetMask;
        }
        return result;
    }

    export function IsInSet(id: Id, set: IdSet): boolean {
        const mask = ConstructInfos[id].SetMask;
        return ((mask & set) === mask);
    }

    export function GetSetMask(id: Id) {
        return ConstructInfos[id].SetMask;
    }

    export function CompareId(Left: Id, Right: Id): number {
        return CompareNumber(Left, Right);
    }
    export function IdToName(id: Id): string {
        return infos[id].name;
    }
    export function TryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
    export function IdToJsonValue(id: Id): string {
        return infos[id].jsonValue;
    }
    export function IdToInvariantStr(id: Id): string {
        return infos[id].name;
    }
    export function TryJsonValueToId(value: string): Id | undefined {
        const upperValue = value.toUpperCase();
        const idx = ConstructInfos.findIndex((info: ConstructInfo) => info.UpperJsonValue === upperValue);
        return idx >= 0 ? ConstructInfos[idx].Id : undefined;
    }
    export function IdToExchangeId(id: Id): ExchangeId {
        return infos[id].exchangeId;
    }
    export function IdToAbbrDisplay(id: Id): string {
        return infos[id].abbrDisplay;
    }
    export function TryAbbrDisplayToId(value: string): Id | undefined {
        const upperValue = value.toUpperCase();
        const idx = ConstructInfos.findIndex((info: ConstructInfo) => info.UpperAbbrDisplay === upperValue);
        return idx >= 0 ? ConstructInfos[idx].Id : undefined;
    }
    export function IdToDisplay(id: Id): string {
        return infos[id].display;
    }
    export function TryDisplayToId(value: string): Id | undefined {
        const upperValue = value.toUpperCase();
        const idx = ConstructInfos.findIndex((info: ConstructInfo) => info.UpperDisplay === upperValue);
        return idx >= 0 ? ConstructInfos[idx].Id : undefined;
    }
    export function IdToPriceStepLitId(id: Id): MarketId {
        return infos[id].defaultLitId;
    }
    export function IdToDefaultLitId(id: Id): MarketId {
        return infos[id].defaultLitId;
    }
    export function IdToListingRootSourceArray(id: Id): TSymbolSourceIdArray {
        return infos[id].listingRootSources;
    }
    export function IdToTmcCalcPricesLitId(id: Id): MarketId {
        return infos[id].defaultLitId;
    }
    export function TryIdSetToFirstId(value: IdSet): Id | undefined {
        const idx = infos.findIndex((info: Info) => IsInSet(info.id, value));
        return idx >= 0 ? infos[idx].id : undefined;
    }
    export function IdSetToDisplay(value: IdSet): string {
        let result = '';
        for (const info of infos) {
            const id = info.id;
            if (IsInSet(id, value)) {
                if (result !== '') {
                    result += ',';
                }
                result += IdToDisplay(id);
            }
        }
        return result;
    }
    export function IdSetToAbbrDisplay(value: IdSet): string {
        let result = '';
        for (const info of infos) {
            const id = info.id;
            if (IsInSet(id, value)) {
                if (result !== '') {
                    result += ',';
                }
                result += IdToAbbrDisplay(id);
            }
        }
        return result;
    }
    export function CompareIdSet(Left: IdSet, Right: IdSet): number {
        return CompareNumber(Left, Right);
    }
    export function GetAllowedOrderTypeArray(id: Id): TOrderTypeIdArray {
        return infos[id].allowedOrderTypes;
    }

    export function GetDefaultOrderType(id: Id): OrderTypeId {
        return infos[id].defaultOrderType;
    }

    export function IsOrderTypeAllowed(id: Id, orderTypeId: OrderTypeId): boolean {
        for (const elem of GetAllowedOrderTypeArray(id)) {
            if (elem === orderTypeId) {
                return true;
            }
        }
        return false;
    }

    export function getAllowedTimeInForceIdArray(id: Id): TimeInForceIdArray {
        return infos[id].allowedTimeInForces;
    }

    export function getAllowedTimeInForceIdArrayForOrderType(id: Id, orderTypeId: OrderTypeId): TimeInForceIdArray {
        if (orderTypeId !== OrderTypeId.Market) {
            return infos[id].allowedTimeInForces;
        } else {
            switch (id) {
                case (OrderDestinationId.MyxBuyIn): {
                    return [TimeInForceId.FillAndKill];
                }
                case (OrderDestinationId.MyxNormal):
                case (OrderDestinationId.MyxOddLot): {
                    return [TimeInForceId.Day, TimeInForceId.FillAndKill];
                }
                default: {
                    return [TimeInForceId.FillOrKill];
                }
            }
        }
    }

    export function GetAllowedSideIdArray(id: Id): SideIdArray {
        return infos[id].allowedSides;
    }

    export interface GetDirectMarketLinkResult {
        Success: boolean;
        DirectMarketLink: MarketId | undefined;
    }

    export function GetDirectMarketLink(id: Id): GetDirectMarketLinkResult {
        if (defined(infos[id].directMarketLink)) {
            return {
                Success: true,
                DirectMarketLink: infos[id].directMarketLink,
            };
        } else {
            return {
                Success: false,
                DirectMarketLink: undefined,
            };
        }
    }

    // AppOptions.Trading_DefaultOrderExpiry should override GetDefaultTimeInForce if possible.
    export function GetDefaultTimeInForce(id: Id): TimeInForceId {
        return infos[id].defaultTimeInForce;
    }

    export function GetHasPriceStepRestrictions(id: Id): boolean {
        return infos[id].hasPriceStepRestrictions;
    }
}*/

// export namespace MarketBoard {
//     export type Id = MarketBoardId;

//     interface Info {
//         readonly id: Id;
//         readonly name: string;
//         readonly exchangeId: ExchangeId;
//         readonly displayId: StringId;
//         readonly orderDestination: MarketId | undefined;
//     }

//     type InfosObject = { [id in keyof typeof MarketBoardId]: Info };

//     const infosObject: InfosObject = {
//         AsxBookBuild: {
//             id: MarketBoardId.AsxBookBuild,
//             name: 'AsxBookBuild',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxBookBuild,
//             orderDestination: undefined,
//         },
//         AsxTradeMatchCentrePoint: {
//             id: MarketBoardId.AsxTradeMatchCentrePoint,
//             name: 'AsxCentrePoint',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxCentrePoint,
//             orderDestination: MarketId.AsxTradeMatchCentrePoint,
//         },
//         AsxTradeMatch: {
//             id: MarketBoardId.AsxTradeMatch,
//             name: 'AsxTradeMatch',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatch,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchAgric: {
//             id: MarketBoardId.AsxTradeMatchAgric,
//             name: 'AsxTradeMatchAgric',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchAgric,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchAus: {
//             id: MarketBoardId.AsxTradeMatchAus,
//             name: 'AsxTradeMatchAus',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchAus,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchDerivatives: {
//             id: MarketBoardId.AsxTradeMatchDerivatives,
//             name: 'AsxTradeMatchDerivatives',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchDerivatives,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchEquity1: {
//             id: MarketBoardId.AsxTradeMatchEquity1,
//             name: 'AsxTradeMatchEquity1',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity1,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchEquity2: {
//             id: MarketBoardId.AsxTradeMatchEquity2,
//             name: 'AsxTradeMatchEquity2',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity2,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchEquity3: {
//             id: MarketBoardId.AsxTradeMatchEquity3,
//             name: 'AsxTradeMatchEquity3',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity3,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchEquity4: {
//             id: MarketBoardId.AsxTradeMatchEquity4,
//             name: 'AsxTradeMatchEquity4',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity4,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchEquity5: {
//             id: MarketBoardId.AsxTradeMatchEquity5,
//             name: 'AsxTradeMatchEquity5',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity5,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchIndex: {
//             id: MarketBoardId.AsxTradeMatchIndex,
//             name: 'AsxTradeMatchIndex',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchIndex,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchIndexDerivatives: {
//             id: MarketBoardId.AsxTradeMatchIndexDerivatives,
//             name: 'AsxTradeMatchIndexDerivatives',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchIndexDerivatives,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchInterestRate: {
//             id: MarketBoardId.AsxTradeMatchInterestRate,
//             name: 'AsxTradeMatchInterestRate',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchInterestRate,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchPrivate: {
//             id: MarketBoardId.AsxTradeMatchPrivate,
//             name: 'AsxTradeMatchPrivate',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchPrivate,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchQuoteDisplayBoard: {
//             id: MarketBoardId.AsxTradeMatchQuoteDisplayBoard,
//             name: 'AsxTradeMatchQuoteDisplayBoard',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchQuoteDisplayBoard,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchPractice: {
//             id: MarketBoardId.AsxTradeMatchPractice,
//             name: 'AsxTradeMatchPractice',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchPractice,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchWarrants: {
//             id: MarketBoardId.AsxTradeMatchWarrants,
//             name: 'AsxTradeMatchWarrants',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxTradeMatchWarrants,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchAD: {
//             id: MarketBoardId.AsxTradeMatchAD,
//             name: 'AsxTradeMatchAD',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.ZenithDataExternalError,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxTradeMatchED: {
//             id: MarketBoardId.AsxTradeMatchED,
//             name: 'AsxTradeMatchED',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.ZenithDataExternalError,
//             orderDestination: MarketId.AsxTradeMatch,
//         },
//         AsxPureMatch: {
//             id: MarketBoardId.AsxPureMatch,
//             name: 'AsxPureMatch',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxPureMatch,
//             orderDestination: MarketId.AsxPureMatch,
//         },
//         AsxPureMatchEquity1: {
//             id: MarketBoardId.AsxPureMatchEquity1,
//             name: 'AsxPureMatchEquity1',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxPureMatchEquity1,
//             orderDestination: MarketId.AsxPureMatch,
//         },
//         AsxPureMatchEquity2: {
//             id: MarketBoardId.AsxPureMatchEquity2,
//             name: 'AsxPureMatchEquity2',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxPureMatchEquity2,
//             orderDestination: MarketId.AsxPureMatch,
//         },
//         AsxPureMatchEquity3: {
//             id: MarketBoardId.AsxPureMatchEquity3,
//             name: 'AsxPureMatchEquity3',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxPureMatchEquity3,
//             orderDestination: MarketId.AsxPureMatch,
//         },
//         AsxPureMatchEquity4: {
//             id: MarketBoardId.AsxPureMatchEquity4,
//             name: 'AsxPureMatchEquity4',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxPureMatchEquity4,
//             orderDestination: MarketId.AsxPureMatch,
//         },
//         AsxPureMatchEquity5: {
//             id: MarketBoardId.AsxPureMatchEquity5,
//             name: 'AsxPureMatchEquity5',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxPureMatchEquity5,
//             orderDestination: MarketId.AsxPureMatch,
//         },
//         AsxVolumeMatch: {
//             id: MarketBoardId.AsxVolumeMatch,
//             name: 'AsxVolumeMatch',
//             exchangeId: ExchangeId.Asx,
//             displayId: StringId.MarketBoardIdDisplay_AsxVolumeMatch,
//             orderDestination: undefined,
//         },
//         ChixAustFarPoint: {
//             id: MarketBoardId.ChixAustFarPoint,
//             name: 'ChixAustFarPoint',
//             exchangeId: ExchangeId.Cxa,
//             displayId: StringId.MarketBoardIdDisplay_ChixAustFarPoint,
//             orderDestination: MarketId.ChixAustFarPoint,
//         },
//         ChixAustLimit: {
//             id: MarketBoardId.ChixAustLimit,
//             name: 'ChixAustLimit',
//             exchangeId: ExchangeId.Cxa,
//             displayId: StringId.MarketBoardIdDisplay_ChixAustLimit,
//             orderDestination: MarketId.ChixAustLimit,
//         },
//         ChixAustMarketOnClose: {
//             id: MarketBoardId.ChixAustMarketOnClose,
//             name: 'ChixAustMarketOnClose',
//             exchangeId: ExchangeId.Cxa,
//             displayId: StringId.MarketBoardIdDisplay_ChixAustMarketOnClose,
//             orderDestination: MarketId.ChixAustMarketOnClose,
//         },
//         ChixAustMidPoint: {
//             id: MarketBoardId.ChixAustMidPoint,
//             name: 'ChixAustMidPoint',
//             exchangeId: ExchangeId.Cxa,
//             displayId: StringId.MarketBoardIdDisplay_ChixAustMidPoint,
//             orderDestination: MarketId.ChixAustMidPoint,
//         },
//         ChixAustNearPoint: {
//             id: MarketBoardId.ChixAustNearPoint,
//             name: 'ChixAustNearPoint',
//             exchangeId: ExchangeId.Cxa,
//             displayId: StringId.MarketBoardIdDisplay_ChixAustNearPoint,
//             orderDestination: MarketId.ChixAustNearPoint,
//         },
//         NsxMain: {
//             id: MarketBoardId.NsxMain,
//             name: 'NsxMain',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxMain,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxCommunityBanks: {
//             id: MarketBoardId.NsxCommunityBanks,
//             name: 'NsxCommunityBanks',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxCommunityBanks,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxIndustrial: {
//             id: MarketBoardId.NsxIndustrial,
//             name: 'NsxIndustrial',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxIndustrial,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxDebt: {
//             id: MarketBoardId.NsxDebt,
//             name: 'NsxDebt',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxDebt,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxMiningAndEnergy: {
//             id: MarketBoardId.NsxMiningAndEnergy,
//             name: 'NsxMiningAndEnergy',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxMiningAndEnergy,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxCertifiedProperty: {
//             id: MarketBoardId.NsxCertifiedProperty,
//             name: 'NsxCertifiedProperty',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxCertifiedProperty,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxProperty: {
//             id: MarketBoardId.NsxProperty,
//             name: 'NsxProperty',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxProperty,
//             orderDestination: MarketId.Nsx,
//         },
//         NsxRestricted: {
//             id: MarketBoardId.NsxRestricted,
//             name: 'NsxRestricted',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_NsxRestricted,
//             orderDestination: MarketId.Nsx,
//         },
//         SimVenture: {
//             id: MarketBoardId.SimVenture,
//             name: 'SimVenture',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_SimVenture,
//             orderDestination: MarketId.SimVenture,
//         },
//         SouthPacificStockExchangeEquities: {
//             id: MarketBoardId.SouthPacificStockExchangeEquities,
//             name: 'SouthPacificStockExchangeEquities',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_SouthPacificStockExchangeEquities,
//             orderDestination: MarketId.SouthPacific,
//         },
//         SouthPacificStockExchangeRestricted: {
//             id: MarketBoardId.SouthPacificStockExchangeRestricted,
//             name: 'SouthPacificStockExchangeRestricted',
//             exchangeId: ExchangeId.Nsx,
//             displayId: StringId.MarketBoardIdDisplay_SouthPacificStockExchangeRestricted,
//             orderDestination: MarketId.SouthPacific,
//         },
//         NzxMainBoard: {
//             id: MarketBoardId.NzxMainBoard,
//             name: 'NzxMainBoard',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxMainBoard,
//             orderDestination: undefined,
//         },
//         NzxSpec: {
//             id: MarketBoardId.NzxSpec,
//             name: 'NzxSpec',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxSpec,
//             orderDestination: undefined,
//         },
//         NzxFonterraShareholders: {
//             id: MarketBoardId.NzxFonterraShareholders,
//             name: 'NzxFonterraShareholders',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxFonterraShareholders,
//             orderDestination: undefined,
//         },
//         NzxIndex: {
//             id: MarketBoardId.NzxIndex,
//             name: 'NzxIndex',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxIndex,
//             orderDestination: undefined,
//         },
//         NzxDebtMarket: {
//             id: MarketBoardId.NzxDebtMarket,
//             name: 'NzxDebtMarket',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxDebt,
//             orderDestination: undefined,
//         },
//         NzxComm: {
//             id: MarketBoardId.NzxComm,
//             name: 'NzxComm',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxComm,
//             orderDestination: undefined,
//         },
//         NzxDerivativeFutures: {
//             id: MarketBoardId.NzxDerivativeFutures,
//             name: 'NzxDerivativeFutures',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxDerivativeFutures,
//             orderDestination: undefined,
//         },
//         NzxDerivativeOptions: {
//             id: MarketBoardId.NzxDerivativeOptions,
//             name: 'NzxDerivativeOptions',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxDerivativeOptions,
//             orderDestination: undefined,
//         },
//         NzxIndexFutures: {
//             id: MarketBoardId.NzxIndexFutures,
//             name: 'NzxIndexFutures',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxIndexFutures,
//             orderDestination: undefined,
//         },
//         NzxEOpt: {
//             id: MarketBoardId.NzxEOpt,
//             name: 'NzxEOpt',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxEOpt,
//             orderDestination: undefined,
//         },
//         NzxMFut: {
//             id: MarketBoardId.NzxMFut,
//             name: 'NzxMFut',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxMFut,
//             orderDestination: undefined,
//         },
//         NzxMOpt: {
//             id: MarketBoardId.NzxMOpt,
//             name: 'NzxMOpt',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxMOpt,
//             orderDestination: undefined,
//         },
//         NzxDStgy: {
//             id: MarketBoardId.NzxDStgy,
//             name: 'NzxDStgy',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxDStgy,
//             orderDestination: undefined,
//         },
//         NzxMStgy: {
//             id: MarketBoardId.NzxMStgy,
//             name: 'NzxMStgy',
//             exchangeId: ExchangeId.Nzx,
//             displayId: StringId.MarketBoardIdDisplay_NzxMStgy,
//             orderDestination: undefined,
//         },
//         MyxNormalMarket: {
//             id: MarketBoardId.MyxNormalMarket,
//             name: 'MyxNormal',
//             exchangeId: ExchangeId.Myx,
//             displayId: StringId.MarketBoardIdDisplay_MyxNormal,
//             orderDestination: undefined,
//         },
//         MyxDirectBusinessTransactionMarket: {
//             id: MarketBoardId.MyxDirectBusinessTransactionMarket,
//             name: 'MyxDirectBusinessTransaction',
//             exchangeId: ExchangeId.Myx,
//             displayId: StringId.MarketBoardIdDisplay_MyxDirectBusinessTransaction,
//             orderDestination: undefined,
//         },
//         MyxIndexMarket: {
//             id: MarketBoardId.MyxIndexMarket,
//             name: 'MyxIndex',
//             exchangeId: ExchangeId.Myx,
//             displayId: StringId.MarketBoardIdDisplay_MyxIndex,
//             orderDestination: undefined,
//         },
//         MyxBuyInMarket: {
//             id: MarketBoardId.MyxBuyInMarket,
//             name: 'MyxBuyIn',
//             exchangeId: ExchangeId.Myx,
//             displayId: StringId.MarketBoardIdDisplay_MyxBuyIn,
//             orderDestination: undefined,
//         },
//         MyxOddLotMarket: {
//             id: MarketBoardId.MyxOddLotMarket,
//             name: 'MyxOddLot',
//             exchangeId: ExchangeId.Myx,
//             displayId: StringId.MarketBoardIdDisplay_MyxOddLot,
//             orderDestination: undefined,
//         },
//         PtxMain: {
//             id: MarketBoardId.PtxMain,
//             name: 'PtxMain',
//             exchangeId: ExchangeId.Ptx,
//             displayId: StringId.MarketBoardIdDisplay_PtxMain,
//             orderDestination: undefined,
//         },
//         FnsxMain: {
//             id: MarketBoardId.FnsxMain,
//             name: 'FnsxMain',
//             exchangeId: ExchangeId.Fnsx,
//             displayId: StringId.MarketBoardIdDisplay_FnsxMain,
//             orderDestination: undefined,
//         },
//         FpsxMain: {
//             id: MarketBoardId.FpsxMain,
//             name: 'FpsxMain',
//             exchangeId: ExchangeId.Fpsx,
//             displayId: StringId.MarketBoardIdDisplay_FpsxMain,
//             orderDestination: undefined,
//         },
//         CfxMain: {
//             id: MarketBoardId.CfxMain,
//             name: 'CfxMain',
//             exchangeId: ExchangeId.Cfx,
//             displayId: StringId.MarketBoardIdDisplay_CfxMain,
//             orderDestination: undefined,
//         },
//         DaxMain: {
//             id: MarketBoardId.DaxMain,
//             name: 'DaxMain',
//             exchangeId: ExchangeId.Dax,
//             displayId: StringId.MarketBoardIdDisplay_DaxMain,
//             orderDestination: undefined,
//         },
//     };

//     const infos = Object.values(infosObject);
//     export const idCount = infos.length;
//     export let allIds: readonly MarketBoardId[];

//     export function initialise() {
//         const initAllIds = new Array<MarketBoardId>(idCount);
//         for (let i = 0; i < idCount; i++) {
//             const info = infos[i];
//             if (info.id !== i as MarketBoardId) {
//                 throw new EnumInfoOutOfOrderError('MarketBoardId', i, Strings[infos[i].displayId]);
//             } else {
//                 initAllIds[i] = info.id;
//             }
//         }
//         allIds = initAllIds;
//     }

//     export function idToDisplayId(id: Id) {
//         return infos[id].displayId;
//     }

//     export function idToDisplay(id: Id) {
//         return Strings[idToDisplayId(id)];
//     }

//     export function idToName(id: Id) {
//         return infos[id].name;
//     }

//     export function tryNameToId(name: string) {
//         const index = infos.findIndex(info => info.name === name);
//         return index >= 0 ? infos[index].id : undefined;
//     }

//     export function idToExchangeId(id: Id) {
//         return infos[id].exchangeId;
//     }

//     export function idToOrderDestination(id: Id) {
//         return infos[id].orderDestination;
//     }

//     export function compareId(left: Id, right: Id) {
//         return compareNumber(left, right);
//     }
// }

export namespace TMarketMoversSymbolSortType {
}

export namespace TMarketSegment {
}

export namespace TBuyOrSell {
}

export namespace TBuyOrSellOrNone {
}

export namespace ExerciseType {
    export type Id = ExerciseTypeId;

    interface Info {
        readonly id: Id;
        readonly json: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof ExerciseTypeId]: Info };

    const infosObject: InfosObject = {
        American: {
            id: ExerciseTypeId.American,
            json: 'American',
            displayId: StringId.ExerciseTypeDisplay_American,
        },
        Asian: {
            id: ExerciseTypeId.Asian,
            json: 'Asian',
            displayId: StringId.ExerciseTypeDisplay_Asian,
        },
        European: {
            id: ExerciseTypeId.European,
            json: 'American',
            displayId: StringId.ExerciseTypeDisplay_European,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ExerciseTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('DTETSC85598', outOfOrderIdx, infos[outOfOrderIdx].json);
        }
    }

    export function idToJsonValue(id: Id): string {
        return infos[id].json;
    }

    export function tryJsonValueToId(value: string): Id | undefined {
        const upperValue = value.toUpperCase();
        const idx = infos.findIndex((info: Info) => info.json.toUpperCase() === upperValue);
        return idx >= 0 ? infos[idx].id : undefined;
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }
}

export namespace DepthDirection {
    export type Id = DepthDirectionId;

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof DepthDirectionId]: Info };

    const infosObject: InfosObject = {
        BidBelowAsk: {
            id: DepthDirectionId.BidBelowAsk,
            displayId: StringId.DepthDirectionDisplay_BidBelowAsk,
        },
        AskBelowBid: {
            id: DepthDirectionId.AskBelowBid,
            displayId: StringId.DepthDirectionDisplay_AskBelowBid,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        for (let id = 0; id < idCount; id++) {
            if (infos[id].id !== id as DepthDirectionId) {
                throw new EnumInfoOutOfOrderError('DepthDirectionId', id, idToDisplay(id));
            }
        }
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }
}

export namespace DeliveryType {
}

export namespace CallOrPut {
    export type Id = CallOrPutId;

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof CallOrPutId]: Info };

    const infosObject: InfosObject = {
        Call: {
            id: CallOrPutId.Call,
            displayId: StringId.CallOrPutDisplay_Call,
        },
        Put: {
            id: CallOrPutId.Put,
            displayId: StringId.CallOrPutDisplay_Put,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as CallOrPutId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TCallOrPutId', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }
}

export namespace TSufficientPermissionsStatus {
}

export namespace TBasicListChangeType {
}

export namespace TBrokerageAccountServerSearchField {
}

export namespace TBrokerageAccountServerSearchMode {
}

export namespace TBrokerageAccountAggregationType {
    export type TId = TBrokerageAccountAggregationTypeId;

    export function IdToName(Id: TId): string {
        // #MethodNeeded
        assert(false, 'TODO');
        return '';
    }
}

export namespace TBrokerageAccountAggregationCommandType {
}

export namespace TBrokerageAccOrAggField {
    export type TId = TBrokerageAccOrAggFieldId;

    interface Info {
        readonly id: TId;
    }

    const Infos: Info[] =
        [
            { id: TBrokerageAccOrAggFieldId.baafCode },
            { id: TBrokerageAccOrAggFieldId.baafName },
        ];

    export const IdCount = Infos.length;

    export function StaticConstructor() {
        const outOfOrderIdx = Infos.findIndex((info: Info, index: Integer) => info.id !== index as TBrokerageAccOrAggFieldId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('DTBAOAFISC99214', outOfOrderIdx, Infos[outOfOrderIdx].id.toString(10));
        }
    }
}

/*export namespace Side {
    type Id = SideId;

    class Info {
        constructor(
            public id: Id,
            public name: string,
        ) { }
    }

    type InfosObject = { [id in keyof typeof SideId]: Info };

    const infosObject: InfosObject = {
        Buy: {
            id: SideId.Buy,
            name: 'sideBuy',
        },
        Sell: {
            id: SideId.Sell,
            name: 'sideSell',
        },
        BuyMinus: {
            id: SideId.BuyMinus,
            name: 'sideBuyMinus',
        },
        SellPlus: {
            id: SideId.SellPlus,
            name: 'sideSellPlus',
        },
        SellShort: {
            id: SideId.SellShort,
            name: 'sideSellShort',
        },
        SellShortExempt: {
            id: SideId.SellShortExempt,
            name: 'sideSellShortExempt',
        },
        Undisclosed: {
            id: SideId.Undisclosed,
            name: 'sideUndisclosed',
        },
        Cross: {
            id: SideId.Cross,
            name: 'sideCross',
        },
        CrossShort: {
            id: SideId.CrossShort,
            name: 'sideCrossShort',
        },
        CrossShortExempt: {
            id: SideId.CrossShortExempt,
            name: 'sideCrossShortExempt',
        },
        AsDefined: {
            id: SideId.AsDefined,
            name: 'sideAsDefined',
        },
        Opposite: {
            id: SideId.Opposite,
            name: 'sideOpposite',
        },
        Subscribe: {
            id: SideId.Subscribe,
            name: 'sideSubscribe',
        },
        Redeem: {
            id: SideId.Redeem,
            name: 'sideRedeem',
        },
        Lend: {
            id: SideId.Lend,
            name: 'sideLend',
        },
        Borrow: {
            id: SideId.Borrow,
            name: 'sideBorrow',
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TSide', outOfOrderIdx, 'ID:454620115429');
        }
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

}*/

export namespace TimeInForce {
    export type Id = TimeInForceId;
    export const nullId = TimeInForceId.GoodTillCrossing; // not really null - just used as placeholder

    export const all = [
        TimeInForceId.Day,
        TimeInForceId.GoodTillCancel,
        TimeInForceId.AtTheOpening,
        TimeInForceId.FillAndKill,
        TimeInForceId.FillOrKill,
        TimeInForceId.AllOrNone,
        TimeInForceId.GoodTillCrossing,
        TimeInForceId.GoodTillDate,
        TimeInForceId.AtTheClose,
    ];

    interface Info {
        id: Id;
        name: string;
        display: StringId;
    }

    type InfosObject = { [id in keyof typeof TimeInForceId]: Info };

    const infosObject: InfosObject = {
        Day: {
            id: TimeInForceId.Day,
            name: 'Day',
            display: StringId.TimeInForceDisplay_Day,
        },
        GoodTillCancel: {
            id: TimeInForceId.GoodTillCancel,
            name: 'GoodTillCancel',
            display: StringId.TimeInForceDisplay_GoodTillCancel,
        },
        AtTheOpening: {
            id: TimeInForceId.AtTheOpening,
            name: 'AtTheOpening',
            display: StringId.TimeInForceDisplay_AtTheOpening,
        },
        FillAndKill: {
            id: TimeInForceId.FillAndKill,
            name: 'FillAndKill',
            display: StringId.TimeInForceDisplay_FillAndKill,
        },
        FillOrKill: {
            id: TimeInForceId.FillOrKill,
            name: 'FillOrKill',
            display: StringId.TimeInForceDisplay_FillOrKill,
        },
        AllOrNone: {
            id: TimeInForceId.AllOrNone,
            name: 'AllOrNone',
            display: StringId.TimeInForceDisplay_AllOrNone,
        },
        GoodTillCrossing: {
            id: TimeInForceId.GoodTillCrossing,
            name: 'GoodTillCrossing',
            display: StringId.TimeInForceDisplay_GoodTillCrossing,
        },
        GoodTillDate: {
            id: TimeInForceId.GoodTillDate,
            name: 'GoodTillDate',
            display: StringId.TimeInForceDisplay_GoodTillDate,
        },
        AtTheClose: {
            id: TimeInForceId.AtTheClose,
            name: 'AtTheClose',
            display: StringId.TimeInForceDisplay_AtTheClose,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as TimeInForceId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TTimeInForceId', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function compareId(left: Id, right: Id) {
        return compareInteger(left, right);
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function tryNameToId(name: string) {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function idToJsonValue(id: Id) {
        return idToName(id);
    }

    export function tryJsonValueToId(value: string) {
        return tryNameToId(value);
    }

    export function idToDisplayId(id: Id) {
        return infos[id].display;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function idArrayToDisplay(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToDisplay(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function tryJsonValueArrayToIdArray(value: readonly string[], ignoreInvalid: boolean): TimeInForceId[] | undefined {
        const valueCount = value.length;
        const result = new Array<TimeInForceId>(valueCount);
        let resultCount = 0;
        for (let i = 0; i < valueCount; i++) {
            const jsonValue = value[i];
            const id = tryJsonValueToId(jsonValue);
            if (id !== undefined) {
                result[resultCount++] = id;
            } else {
                if (!ignoreInvalid) {
                    return undefined;
                }
            }
        }
        result.length = resultCount;
        return result;
    }
}

export namespace OrderShortSellType {
    export type Id = OrderShortSellTypeId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly display: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderShortSellTypeId]: Info };

    const infosObject: InfosObject = {
        ShortSell: {
            id: OrderShortSellTypeId.ShortSell,
            name: 'ShortSell',
            display: StringId.OrderShortSellTypeDisplay_ShortSell,
        },
        ShortSellExempt: {
            id: OrderShortSellTypeId.ShortSellExempt,
            name: 'ShortSellExempt',
            display: StringId.OrderShortSellTypeDisplay_ShortSellExempt,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderShortSellTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('ShortSellExemptType', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].display;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace OrderTriggerType {
    export type Id = OrderTriggerTypeId;

    export const all = [
        OrderTriggerTypeId.Immediate,
        OrderTriggerTypeId.Price,
        OrderTriggerTypeId.TrailingPrice,
        OrderTriggerTypeId.PercentageTrailingPrice,
        OrderTriggerTypeId.Overnight,
    ];

    interface Info {
        id: Id;
        name: string;
        displayId: StringId;
        abbreviationId: StringId;
        negativeValueExpected: boolean;
    }

    type InfosObject = { [id in keyof typeof OrderTriggerTypeId]: Info };

    const infosObject: InfosObject = {
        Immediate: {
            id: OrderTriggerTypeId.Immediate,
            name: 'Immediate',
            displayId: StringId.OrderTriggerTypeDisplay_Immediate,
            abbreviationId: StringId.OrderTriggerTypeAbbreviation_Immediate,
            negativeValueExpected: false,
        },
        Price: {
            id: OrderTriggerTypeId.Price,
            name: 'Price',
            displayId: StringId.OrderTriggerTypeDisplay_Price,
            abbreviationId: StringId.OrderTriggerTypeAbbreviation_Price,
            negativeValueExpected: false,
        },
        TrailingPrice: {
            id: OrderTriggerTypeId.TrailingPrice,
            name: 'TrailingPrice',
            displayId: StringId.OrderTriggerTypeDisplay_TrailingPrice,
            abbreviationId: StringId.OrderTriggerTypeAbbreviation_TrailingPrice,
            negativeValueExpected: false,
        },
        PercentageTrailingPrice: {
            id: OrderTriggerTypeId.PercentageTrailingPrice,
            name: 'PercentageTrailingPrice',
            displayId: StringId.OrderTriggerTypeDisplay_PercentageTrailingPrice,
            abbreviationId: StringId.OrderTriggerTypeAbbreviation_PercentageTrailingPrice,
            negativeValueExpected: false,
        },
        Overnight: {
            id: OrderTriggerTypeId.Overnight,
            name: 'Overnight',
            displayId: StringId.OrderTriggerTypeDisplay_Overnight,
            abbreviationId: StringId.OrderTriggerTypeAbbreviation_Overnight,
            negativeValueExpected: false,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderTriggerTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderTriggerType', outOfOrderIdx, idToName(outOfOrderIdx));
        }
    }

    export function compareId(left: Id, right: Id) {
        return compareInteger(left, right);
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function tryNameToId(name: string) {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function idToJsonValue(id: Id) {
        return idToName(id);
    }

    export function tryJsonValueToId(value: string) {
        return tryNameToId(value);
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function idArrayToDisplay(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToDisplay(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function idToAbbreviationId(id: Id) {
        return infos[id].abbreviationId;
    }

    export function idToAbbreviation(id: Id) {
        return Strings[idToAbbreviationId(id)];
    }

    export function idArrayToAbbreviation(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToAbbreviation(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function idToGridDisplay(id: Id) {
        if (id === OrderTriggerTypeId.Immediate) {
            return '';
        } else {
            return idToAbbreviation(id);
        }
    }

    export function isStopId(id: Id) {
        switch (id) {
            case OrderTriggerTypeId.Immediate:
                return false;
            default:
                return true;
        }
    }

    export function tryJsonValueArrayToIdArray(value: readonly string[], ignoreInvalid: boolean): OrderTriggerTypeId[] | undefined {
        const valueCount = value.length;
        const result = new Array<OrderTriggerTypeId>(valueCount);
        let resultCount = 0;
        for (let i = 0; i < valueCount; i++) {
            const jsonValue = value[i];
            const id = tryJsonValueToId(jsonValue);
            if (id !== undefined) {
                result[resultCount++] = id;
            } else {
                if (!ignoreInvalid) {
                    return undefined;
                }
            }
        }
        result.length = resultCount;
        return result;
    }
}

// export namespace FeedInfo {
//     export type Id = FeedId;

//     interface Info {
//         readonly id: Id;
//         readonly classId: FeedClassId;
//         readonly name: string;
//         readonly displayId: StringId;
//     }

//     type InfosObject = { [id in keyof typeof FeedId]: Info };

//     const infosObject: InfosObject = {
//         Null: {
//             id: FeedId.Null,
//             classId: FeedClassId.Authority,
//             name: 'Null',
//             displayId: StringId.FeedDisplay_Null,
//         },
//         Authority_Trading: {
//             id: FeedId.Authority_Trading,
//             classId: FeedClassId.Authority,
//             name: 'Authority_TradingAuthority',
//             displayId: StringId.FeedDisplay_Authority_Trading,
//         },
//         Authority_Watchlist: {
//             id: FeedId.Authority_Watchlist,
//             classId: FeedClassId.Authority,
//             name: 'Authority_Watchlist',
//             displayId: StringId.FeedDisplay_Authority_Watchlist,
//         },
//         Trading_Oms: {
//             id: FeedId.Trading_Oms,
//             classId: FeedClassId.Trading,
//             name: 'Trading_Oms',
//             displayId: StringId.FeedDisplay_Trading_Oms,
//         },
//         Trading_Motif: {
//             id: FeedId.Trading_Motif,
//             classId: FeedClassId.Trading,
//             name: 'Trading_Motif',
//             displayId: StringId.FeedDisplay_Trading_Motif,
//         },
//         Trading_Malacca: {
//             id: FeedId.Trading_Malacca,
//             classId: FeedClassId.Trading,
//             name: 'Trading_Malacca',
//             displayId: StringId.FeedDisplay_Trading_Malacca,
//         },
//         Trading_Finplex: {
//             id: FeedId.Trading_Finplex,
//             classId: FeedClassId.Trading,
//             name: 'Trading_Finplex',
//             displayId: StringId.FeedDisplay_Trading_Finplex,
//         },
//         Trading_CFMarkets: {
//             id: FeedId.Trading_CFMarkets,
//             classId: FeedClassId.Trading,
//             name: 'Trading_CFMarkets',
//             displayId: StringId.FeedDisplay_Trading_CFMarkets,
//         },
//         Market_AsxBookBuild: {
//             id: FeedId.Market_AsxBookBuild,
//             classId: FeedClassId.Market,
//             name: 'Market_AsxBookBuild',
//             displayId: StringId.FeedDisplay_Market_AsxBookBuild,
//         },
//         Market_AsxPureMatch: {
//             id: FeedId.Market_AsxPureMatch,
//             classId: FeedClassId.Market,
//             name: 'Market_AsxPureMatch',
//             displayId: StringId.FeedDisplay_Market_AsxPureMatch,
//         },
//         Market_AsxTradeMatch: {
//             id: FeedId.Market_AsxTradeMatch,
//             classId: FeedClassId.Market,
//             name: 'Market_AsxTradeMatch',
//             displayId: StringId.FeedDisplay_Market_AsxTradeMatch,
//         },
//         Market_AsxCentrePoint: {
//             id: FeedId.Market_AsxCentrePoint,
//             classId: FeedClassId.Market,
//             name: 'Market_AsxCentrePoint',
//             displayId: StringId.FeedDisplay_Market_AsxCentrePoint,
//         },
//         Market_AsxVolumeMatch: {
//             id: FeedId.Market_AsxVolumeMatch,
//             classId: FeedClassId.Market,
//             name: 'Market_AsxVolumeMatch',
//             displayId: StringId.FeedDisplay_Market_AsxVolumeMatch,
//         },
//         Market_ChixAustLimit: {
//             id: FeedId.Market_ChixAustLimit,
//             classId: FeedClassId.Market,
//             name: 'Market_ChixAustLimit',
//             displayId: StringId.FeedDisplay_Market_ChixAustLimit,
//         },
//         Market_ChixAustFarPoint: {
//             id: FeedId.Market_ChixAustFarPoint,
//             classId: FeedClassId.Market,
//             name: 'Market_ChixAustFarPoint',
//             displayId: StringId.FeedDisplay_Market_ChixAustFarPoint,
//         },
//         Market_ChixAustMarketOnClose: {
//             id: FeedId.Market_ChixAustMarketOnClose,
//             classId: FeedClassId.Market,
//             name: 'Market_ChixAustMarketOnClose',
//             displayId: StringId.FeedDisplay_Market_ChixAustMarketOnClose,
//         },
//         Market_ChixAustNearPoint: {
//             id: FeedId.Market_ChixAustNearPoint,
//             classId: FeedClassId.Market,
//             name: 'Market_ChixAustNearPoint',
//             displayId: StringId.FeedDisplay_Market_ChixAustNearPoint,
//         },
//         Market_ChixAustMidPoint: {
//             id: FeedId.Market_ChixAustMidPoint,
//             classId: FeedClassId.Market,
//             name: 'Market_ChixAustMidPoint',
//             displayId: StringId.FeedDisplay_Market_ChixAustMidPoint,
//         },
//         Market_SimVenture: {
//             id: FeedId.Market_SimVenture,
//             classId: FeedClassId.Market,
//             name: 'Market_SimVenture',
//             displayId: StringId.FeedDisplay_Market_SimVenture,
//         },
//         Market_Nsx: {
//             id: FeedId.Market_Nsx,
//             classId: FeedClassId.Market,
//             name: 'Market_Nsx',
//             displayId: StringId.FeedDisplay_Market_Nsx,
//         },
//         Market_SouthPacific: {
//             id: FeedId.Market_SouthPacific,
//             classId: FeedClassId.Market,
//             name: 'Market_SouthPacific',
//             displayId: StringId.FeedDisplay_Market_SouthPacific,
//         },
//         Market_Nzfox: {
//             id: FeedId.Market_Nzfox,
//             classId: FeedClassId.Market,
//             name: 'Market_Nzfox',
//             displayId: StringId.FeedDisplay_Market_Nzfox,
//         },
//         Market_Nzx: {
//             id: FeedId.Market_Nzx,
//             classId: FeedClassId.Market,
//             name: 'Market_Nzx',
//             displayId: StringId.FeedDisplay_Market_Nzx,
//         },
//         Market_MyxNormal: {
//             id: FeedId.Market_MyxNormal,
//             classId: FeedClassId.Market,
//             name: 'Market_MyxNormal',
//             displayId: StringId.FeedDisplay_Market_MyxNormal,
//         },
//         Market_MyxDirectBusiness: {
//             id: FeedId.Market_MyxDirectBusiness,
//             classId: FeedClassId.Market,
//             name: 'Market_MyxDirectBusiness',
//             displayId: StringId.FeedDisplay_Market_MyxDirectBusiness,
//         },
//         Market_MyxIndex: {
//             id: FeedId.Market_MyxIndex,
//             classId: FeedClassId.Market,
//             name: 'Market_MyxIndex',
//             displayId: StringId.FeedDisplay_Market_MyxIndex,
//         },
//         Market_MyxOddLot: {
//             id: FeedId.Market_MyxOddLot,
//             classId: FeedClassId.Market,
//             name: 'Market_MyxOddLot',
//             displayId: StringId.FeedDisplay_Market_MyxOddLot,
//         },
//         Market_MyxBuyIn: {
//             id: FeedId.Market_MyxBuyIn,
//             classId: FeedClassId.Market,
//             name: 'Market_MyxBuyIn',
//             displayId: StringId.FeedDisplay_Market_MyxBuyIn,
//         },
//         Market_Calastone: {
//             id: FeedId.Market_Calastone,
//             classId: FeedClassId.Market,
//             name: 'Market_Calastone',
//             displayId: StringId.FeedDisplay_Market_Calastone,
//         },
//         Market_AsxCxa: {
//             id: FeedId.Market_AsxCxa,
//             classId: FeedClassId.Market,
//             name: 'Market_AsxCxa',
//             displayId: StringId.FeedDisplay_Market_AsxCxa,
//         },
//         Market_PtxMain: {
//             id: FeedId.Market_PtxMain,
//             classId: FeedClassId.Market,
//             name: 'Market_PtxMain',
//             displayId: StringId.FeedDisplay_Market_PtxMain,
//         },
//         Market_FnsxMain: {
//             id: FeedId.Market_FnsxMain,
//             classId: FeedClassId.Market,
//             name: 'Market_FnsxMain',
//             displayId: StringId.FeedDisplay_Market_FnsxMain,
//         },
//         Market_FpsxMain: {
//             id: FeedId.Market_FpsxMain,
//             classId: FeedClassId.Market,
//             name: 'Market_FpsxMain',
//             displayId: StringId.FeedDisplay_Market_FpsxMain,
//         },
//         Market_CfxMain: {
//             id: FeedId.Market_CfxMain,
//             classId: FeedClassId.Market,
//             name: 'Market_CfxMain',
//             displayId: StringId.FeedDisplay_Market_CfxMain,
//         },
//         Market_DaxMain: {
//             id: FeedId.Market_DaxMain,
//             classId: FeedClassId.Market,
//             name: 'Market_DaxMain',
//             displayId: StringId.FeedDisplay_Market_DaxMain,
//         },
//         News_Asx: {
//             id: FeedId.News_Asx,
//             classId: FeedClassId.News,
//             name: 'News_Asx',
//             displayId: StringId.FeedDisplay_News_Asx,
//         },
//         News_Nsx: {
//             id: FeedId.News_Nsx,
//             classId: FeedClassId.News,
//             name: 'News_Nsx',
//             displayId: StringId.FeedDisplay_News_Nsx,
//         },
//         News_Nzx: {
//             id: FeedId.News_Nzx,
//             classId: FeedClassId.News,
//             name: 'News_Nzx',
//             displayId: StringId.FeedDisplay_News_Nzx,
//         },
//         News_Myx: {
//             id: FeedId.News_Myx,
//             classId: FeedClassId.News,
//             name: 'News_Myx',
//             displayId: StringId.FeedDisplay_News_Myx,
//         },
//         News_Ptx: {
//             id: FeedId.News_Ptx,
//             classId: FeedClassId.News,
//             name: 'News_Ptx',
//             displayId: StringId.FeedDisplay_News_Ptx,
//         },
//         News_Fnsx: {
//             id: FeedId.News_Fnsx,
//             classId: FeedClassId.News,
//             name: 'News_Fnsx',
//             displayId: StringId.FeedDisplay_News_Fnsx,
//         },
//         Watchlist: {
//             id: FeedId.Watchlist,
//             classId: FeedClassId.Watchlist,
//             name: 'Watchlist',
//             displayId: StringId.FeedDisplay_Watchlist,
//         },
//         Scanner: {
//             id: FeedId.Scanner,
//             classId: FeedClassId.Scanner,
//             name: 'Scanner',
//             displayId: StringId.FeedDisplay_Scanner,
//         },
//         Channel: {
//             id: FeedId.Channel,
//             classId: FeedClassId.Channel,
//             name: 'Channel',
//             displayId: StringId.FeedDisplay_Channel,
//         },
//     } as const;

//     export const idCount = Object.keys(infosObject).length;
//     const infos = Object.values(infosObject);

//     export function initialise() {
//         const outOfOrderIdx = infos.findIndex((info, id) => infos[id].id !== id as FeedId);
//         if (outOfOrderIdx >= 0) {
//             throw new EnumInfoOutOfOrderError('FeedId', outOfOrderIdx, idToName(outOfOrderIdx));
//         }
//     }

//     export function idToName(id: Id) {
//         return infos[id].name;
//     }

//     export function tryNameToId(name: string) {
//         for (const info of infos) {
//             if (info.name === name) {
//                 return info.id;
//             }
//         }
//         return undefined;
//     }

//     export function idToClassId(id: Id) {
//         return infos[id].classId;
//     }

//     export function idToDisplayId(id: Id) {
//         return infos[id].displayId;
//     }

//     export function idToDisplay(id: Id) {
//         return Strings[idToDisplayId(id)];
//     }
// }

export namespace FeedClass {
    export type Id = FeedClassId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly multiple: boolean;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof FeedClassId]: Info };

    const infosObject: InfosObject = {
        Authority: {
            id: FeedClassId.Authority,
            name: 'Authority',
            multiple: false,
            displayId: StringId.FeedClassDisplay_Authority,
        },
        Market: {
            id: FeedClassId.Market,
            name: 'Market',
            multiple: true,
            displayId: StringId.FeedClassDisplay_Market,
        },
        News: {
            id: FeedClassId.News,
            name: 'News',
            multiple: true,
            displayId: StringId.FeedClassDisplay_News,
        },
        Trading: {
            id: FeedClassId.Trading,
            name: 'Trading',
            multiple: true,
            displayId: StringId.FeedClassDisplay_Trading,
        },
        Watchlist: {
            id: FeedClassId.Watchlist,
            name: 'Watchlist',
            multiple: false,
            displayId: StringId.FeedClassDisplay_Watchlist,
        },
        Scanner: {
            id: FeedClassId.Scanner,
            name: 'Scanner',
            multiple: false,
            displayId: StringId.FeedClassDisplay_Scanner,
        },
        Channel: {
            id: FeedClassId.Channel,
            name: 'Channel',
            multiple: false,
            displayId: StringId.FeedClassDisplay_Channel,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info, id) => infos[id].id !== id as FeedClassId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('FeedClassId', outOfOrderIdx, idToName(outOfOrderIdx));
        }
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function idToMultile(id: Id) {
        return infos[id].multiple;
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function generateFeedDisplay(id: Id, feedZenithCode: string) {
        return `${idToDisplay(id)}: ${feedZenithCode}`;
    }
}

// export namespace MarketInfo {
//     export type Id = MarketId;

//     export const nullId = MarketId.AsxBookBuild; // not really null - just used when need to flag null

//     const AsxTradeMatchAllowedOrderTypeIds = [OrderTypeId.Limit, OrderTypeId.MarketToLimit];
//     const AsxCentrepointAllowedOrderTypeIds = [OrderTypeId.Limit, OrderTypeId.Market];
//     const AsxVolumeMatchAllowedOrderTypeIds = [OrderTypeId.Market];

//     const ChiXAustraliaAllowedOrderTypeIds = [OrderTypeId.MarketOnClose, OrderTypeId.Limit]; // allow MarketOnClose orders for Chi-X

//     const NsxAllowedOrderTypeIds = [OrderTypeId.Limit, OrderTypeId.Market];
// //    const NzxAllowedOrderTypes = [];

//     const MyxAllowedOrderTypeIds = [OrderTypeId.Limit, OrderTypeId.Market, OrderTypeId.MarketAtBest];
//     const MyxAllowedTimeInForceIds = [
//         TimeInForceId.Day,
//         TimeInForceId.GoodTillCancel,
//         TimeInForceId.FillOrKill,
//         TimeInForceId.FillAndKill,
//         TimeInForceId.GoodTillDate
//     ];
//     const StandardAllowedOrderExtendedSideIds = [OrderExtendedSideId.Buy, OrderExtendedSideId.Sell];
//     const MyxAllowedOrderExtendedSideIds = [
//         OrderExtendedSideId.Buy,
//         OrderExtendedSideId.Sell,
//         OrderExtendedSideId.IntraDayShortSell,
//         // OrderExtendedSideId.RegulatedShortSell,
//         OrderExtendedSideId.ProprietaryShortSell,
//         // OrderExtendedSideId.ProprietaryDayTrade,
//     ];

//     interface Info {
//         readonly id: Id;
//         readonly feedId: FeedId;
//         readonly defaultExchangeId: ExchangeId;
//         readonly supportedExchanges: readonly ExchangeId[];
//         readonly legacyDefaultPscGlobalCode: string;
//         readonly defaultExchangeLocalCode: string;
//         readonly lit: boolean;
//         readonly bestLitId: Id;
//         readonly isRoutable: boolean;
//         readonly jsonValue: string;
//         readonly displayId: StringId;
//         readonly allowedOrderTypeIds: readonly OrderTypeId[];
//         readonly defaultOrderTypeId: OrderTypeId | undefined;
//         readonly allowedTimeInForceIds: readonly TimeInForceId[];
//         readonly defaultTimeInForceId: TimeInForceId | undefined;
//         readonly hasPriceStepRestrictions: boolean; // Should orders to this destination be limited to valid price steps?
//         readonly allowedOrderExtendedSideIds: readonly OrderExtendedSideId[];
//         readonly allowedOrderTriggerTypeIds: readonly OrderTriggerTypeId[];
//         readonly quantityMultiple: Integer;
//         readonly displayPriority: number; // lower is higher priority - only relevant within exchange
//     }

//     type InfosObject = { [id in keyof typeof MarketId]: Readonly<Info> };

//     const infosObject: InfosObject = {
//         AsxBookBuild: {
//             id: MarketId.AsxBookBuild,
//             feedId: FeedId.Market_AsxBookBuild,
//             defaultExchangeId: ExchangeId.Asx,
//             supportedExchanges: [ExchangeId.Asx],
//             legacyDefaultPscGlobalCode: 'ASXB',
//             defaultExchangeLocalCode: 'B',
//             lit: true,
//             bestLitId: MarketId.AsxBookBuild,
//             isRoutable: false,
//             jsonValue: 'AsxBookBuild',
//             displayId: StringId.MarketDisplay_AsxBookBuild,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: undefined,
//             allowedTimeInForceIds: [],
//             defaultTimeInForceId: undefined,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: [],
//             allowedOrderTriggerTypeIds: [],
//             quantityMultiple: 1,
//             displayPriority: 50,
//         },
//         AsxPureMatch: {
//             id: MarketId.AsxPureMatch,
//             feedId: FeedId.Market_AsxPureMatch,
//             defaultExchangeId: ExchangeId.Asx,
//             supportedExchanges: [ExchangeId.Asx],
//             legacyDefaultPscGlobalCode: 'ASXP',
//             defaultExchangeLocalCode: 'P',
//             lit: true,
//             bestLitId: MarketId.AsxPureMatch,
//             isRoutable: true,
//             jsonValue: 'AsxPureMatch',
//             displayId: StringId.MarketDisplay_AsxPureMatch,
//             allowedOrderTypeIds: AsxVolumeMatchAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Market,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 40,
//         },
//         AsxTradeMatch: {
//             id: MarketId.AsxTradeMatch,
//             feedId: FeedId.Market_AsxTradeMatch,
//             defaultExchangeId: ExchangeId.Asx,
//             supportedExchanges: [ExchangeId.Asx],
//             legacyDefaultPscGlobalCode: 'ASXT',
//             defaultExchangeLocalCode: 'T',
//             lit: true,
//             bestLitId: MarketId.AsxTradeMatch,
//             isRoutable: true,
//             jsonValue: 'AsxTradeMatch',
//             displayId: StringId.MarketDisplay_AsxTradeMatch,
//             allowedOrderTypeIds: AsxTradeMatchAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.MarketToLimit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         AsxTradeMatchCentrePoint: {
//             id: MarketId.AsxTradeMatchCentrePoint,
//             feedId: FeedId.Market_AsxCentrePoint,
//             defaultExchangeId: ExchangeId.Asx,
//             supportedExchanges: [ExchangeId.Asx],
//             legacyDefaultPscGlobalCode: 'ASXC',
//             defaultExchangeLocalCode: 'C',
//             lit: false,
//             bestLitId: MarketId.AsxTradeMatch,
//             isRoutable: true,
//             jsonValue: 'AsxCentrePoint',
//             displayId: StringId.MarketDisplay_AsxCentrePoint,
//             allowedOrderTypeIds: AsxCentrepointAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 20,
//         },
//         AsxVolumeMatch: {
//             id: MarketId.AsxVolumeMatch,
//             feedId: FeedId.Market_AsxVolumeMatch,
//             defaultExchangeId: ExchangeId.Asx,
//             supportedExchanges: [ExchangeId.Asx],
//             legacyDefaultPscGlobalCode: 'ASXV',
//             defaultExchangeLocalCode: 'V',
//             lit: true,
//             bestLitId: MarketId.AsxVolumeMatch,
//             isRoutable: true,
//             jsonValue: 'AsxVolumeMatch',
//             displayId: StringId.MarketDisplay_AsxVolumeMatch,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: undefined,
//             allowedTimeInForceIds: [],
//             defaultTimeInForceId: undefined,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: [],
//             allowedOrderTriggerTypeIds: [],
//             quantityMultiple: 1,
//             displayPriority: 30,
//         },
//         ChixAustLimit: {
//             id: MarketId.ChixAustLimit,
//             feedId: FeedId.Market_ChixAustLimit,
//             defaultExchangeId: ExchangeId.Cxa,
//             supportedExchanges: [ExchangeId.Asx, ExchangeId.Cxa],
//             legacyDefaultPscGlobalCode: 'CXAC',
//             defaultExchangeLocalCode: 'L',
//             lit: true,
//             bestLitId: MarketId.ChixAustLimit,
//             isRoutable: true,
//             jsonValue: 'ChixAustLimit',
//             displayId: StringId.MarketDisplay_ChixAustLimit,
//             allowedOrderTypeIds: ChiXAustraliaAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.MarketToLimit,
//             allowedTimeInForceIds: [TimeInForceId.Day],
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 15,
//         },
//         ChixAustFarPoint: {
//             id: MarketId.ChixAustFarPoint,
//             feedId: FeedId.Market_ChixAustFarPoint,
//             defaultExchangeId: ExchangeId.Cxa,
//             supportedExchanges: [ExchangeId.Asx, ExchangeId.Cxa],
//             legacyDefaultPscGlobalCode: 'CXAF',
//             defaultExchangeLocalCode: 'F',
//             lit: false,
//             bestLitId: MarketId.ChixAustLimit,
//             isRoutable: true,
//             jsonValue: 'ChixAustFarPoint',
//             displayId: StringId.MarketDisplay_ChixAustFarPoint,
//             allowedOrderTypeIds: ChiXAustraliaAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.MarketToLimit,
//             allowedTimeInForceIds: [TimeInForceId.Day],
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 40,
//         },
//         ChixAustMarketOnClose: {
//             id: MarketId.ChixAustMarketOnClose,
//             feedId: FeedId.Market_ChixAustMarketOnClose,
//             defaultExchangeId: ExchangeId.Cxa,
//             supportedExchanges: [ExchangeId.Asx, ExchangeId.Cxa],
//             legacyDefaultPscGlobalCode: 'CXAM',
//             defaultExchangeLocalCode: 'M',
//             lit: false,
//             bestLitId: MarketId.ChixAustLimit,
//             isRoutable: true,
//             jsonValue: 'ChixAustMarketOnClose',
//             displayId: StringId.MarketDisplay_ChixAustMarketOnClose,
//             allowedOrderTypeIds: ChiXAustraliaAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.MarketToLimit,
//             allowedTimeInForceIds: [TimeInForceId.Day],
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 30,
//         },
//         ChixAustNearPoint: {
//             id: MarketId.ChixAustNearPoint,
//             feedId: FeedId.Market_ChixAustNearPoint,
//             defaultExchangeId: ExchangeId.Cxa,
//             supportedExchanges: [ExchangeId.Asx, ExchangeId.Cxa],
//             legacyDefaultPscGlobalCode: 'CXAN',
//             defaultExchangeLocalCode: 'N',
//             lit: false,
//             bestLitId: MarketId.ChixAustLimit,
//             isRoutable: true,
//             jsonValue: 'ChixAustNearPoint',
//             displayId: StringId.MarketDisplay_ChixAustNearPoint,
//             allowedOrderTypeIds: ChiXAustraliaAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.MarketToLimit,
//             allowedTimeInForceIds: [TimeInForceId.Day],
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 50,
//         },
//         ChixAustMidPoint: {
//             id: MarketId.ChixAustMidPoint,
//             feedId: FeedId.Market_ChixAustMidPoint,
//             defaultExchangeId: ExchangeId.Cxa,
//             supportedExchanges: [ExchangeId.Asx, ExchangeId.Cxa],
//             legacyDefaultPscGlobalCode: 'CXAP',
//             defaultExchangeLocalCode: 'P',
//             lit: false,
//             bestLitId: MarketId.ChixAustLimit,
//             isRoutable: true,
//             jsonValue: 'ChixAustMidPoint',
//             displayId: StringId.MarketDisplay_ChixAustMidPoint,
//             allowedOrderTypeIds: ChiXAustraliaAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.MarketToLimit,
//             allowedTimeInForceIds: [TimeInForceId.Day],
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 20,
//         },
//         SimVenture: {
//             id: MarketId.SimVenture,
//             feedId: FeedId.Market_SimVenture,
//             defaultExchangeId: ExchangeId.Nsx,
//             supportedExchanges: [ExchangeId.Nsx],
//             legacyDefaultPscGlobalCode: 'SIMV',
//             defaultExchangeLocalCode: 'V',
//             lit: true,
//             bestLitId: MarketId.SimVenture,
//             isRoutable: true,
//             jsonValue: 'SimVenture',
//             displayId: StringId.MarketDisplay_SimVenture,
//             allowedOrderTypeIds: NsxAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 20,
//         },
//         Nsx: {
//             id: MarketId.Nsx,
//             feedId: FeedId.Market_Nsx,
//             defaultExchangeId: ExchangeId.Nsx,
//             supportedExchanges: [ExchangeId.Nsx],
//             legacyDefaultPscGlobalCode: 'XNEC',
//             defaultExchangeLocalCode: 'X',
//             lit: true,
//             bestLitId: MarketId.Nsx,
//             isRoutable: true,
//             jsonValue: 'Nsx',
//             displayId: StringId.MarketDisplay_Nsx,
//             allowedOrderTypeIds: NsxAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         SouthPacific: {
//             id: MarketId.SouthPacific,
//             feedId: FeedId.Market_SouthPacific,
//             defaultExchangeId: ExchangeId.Nsx,
//             supportedExchanges: [ExchangeId.Nsx],
//             legacyDefaultPscGlobalCode: 'XSPS',
//             defaultExchangeLocalCode: 'X',
//             lit: true,
//             bestLitId: MarketId.SouthPacific,
//             isRoutable: true,
//             jsonValue: 'SouthPacific',
//             displayId: StringId.MarketDisplay_SouthPacific,
//             allowedOrderTypeIds: NsxAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 30,
//         },
//         Nzx: {
//             id: MarketId.Nzx,
//             feedId: FeedId.Market_Nzx,
//             defaultExchangeId: ExchangeId.Nzx,
//             supportedExchanges: [ExchangeId.Nzx],
//             legacyDefaultPscGlobalCode: 'XNZE',
//             defaultExchangeLocalCode: 'E',
//             lit: true,
//             bestLitId: MarketId.Nzx,
//             isRoutable: true,
//             jsonValue: 'Nzx',
//             displayId: StringId.MarketDisplay_Nzx,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: undefined,
//             allowedTimeInForceIds: [],
//             defaultTimeInForceId: undefined,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: [],
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 20,
//         },
//         MyxNormal: {
//             id: MarketId.MyxNormal,
//             feedId: FeedId.Market_MyxNormal,
//             defaultExchangeId: ExchangeId.Myx,
//             supportedExchanges: [ExchangeId.Myx],
//             legacyDefaultPscGlobalCode: 'MYNM',
//             defaultExchangeLocalCode: 'N',
//             lit: true,
//             bestLitId: MarketId.MyxNormal,
//             isRoutable: true,
//             jsonValue: 'MyxNormal',
//             displayId: StringId.MarketDisplay_MyxNormal,
//             allowedOrderTypeIds: MyxAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: MyxAllowedTimeInForceIds,    // See GetAllowedTimeInForceIdSet() for more.
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: MyxAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate, OrderTriggerTypeId.Price],
//             quantityMultiple: 100,
//             displayPriority: 10,
//         },
//         MyxDirectBusiness: {
//             id: MarketId.MyxDirectBusiness,
//             feedId: FeedId.Market_MyxDirectBusiness,
//             defaultExchangeId: ExchangeId.Myx,
//             supportedExchanges: [ExchangeId.Myx],
//             legacyDefaultPscGlobalCode: 'MYDB',
//             defaultExchangeLocalCode: 'D',
//             lit: false,
//             bestLitId: MarketId.MyxNormal,
//             isRoutable: true,
//             jsonValue: 'MyxDirectBusiness',
//             displayId: StringId.MarketDisplay_MyxDirectBusiness,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: MyxAllowedTimeInForceIds,    // See GetAllowedTimeInForceIdSet() for more.
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: MyxAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 100,
//             displayPriority: 50,
//         },
//         MyxIndex: {
//             id: MarketId.MyxIndex,
//             feedId: FeedId.Market_MyxIndex,
//             defaultExchangeId: ExchangeId.Myx,
//             supportedExchanges: [ExchangeId.Myx],
//             legacyDefaultPscGlobalCode: 'MYIN',
//             defaultExchangeLocalCode: 'I',
//             lit: false,
//             bestLitId: MarketId.MyxNormal,
//             isRoutable: false,
//             jsonValue: 'MyxIndex',
//             displayId: StringId.MarketDisplay_MyxIndex,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [],    // See GetAllowedTimeInForceIdSet() for more.
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: [],
//             allowedOrderTriggerTypeIds: [],
//             quantityMultiple: 100,
//             displayPriority: 20,
//         },
//         MyxOddLot: {
//             id: MarketId.MyxOddLot,
//             feedId: FeedId.Market_MyxOddLot,
//             defaultExchangeId: ExchangeId.Myx,
//             supportedExchanges: [ExchangeId.Myx],
//             legacyDefaultPscGlobalCode: 'MYOD',
//             defaultExchangeLocalCode: 'O',
//             lit: true,
//             bestLitId: MarketId.MyxOddLot,
//             isRoutable: true,
//             jsonValue: 'MyxOddLot',
//             displayId: StringId.MarketDisplay_MyxOddLot,
//             allowedOrderTypeIds: MyxAllowedOrderTypeIds,
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: MyxAllowedTimeInForceIds,   // See GetAllowedTimeInForceIdSet() for more.
//             defaultTimeInForceId: TimeInForceId.Day,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: MyxAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 30,
//         },
//         MyxBuyIn: {
//             id: MarketId.MyxBuyIn,
//             feedId: FeedId.Market_MyxBuyIn,
//             defaultExchangeId: ExchangeId.Myx,
//             supportedExchanges: [ExchangeId.Myx],
//             legacyDefaultPscGlobalCode: 'MYBI',
//             defaultExchangeLocalCode: 'B',
//             lit: true,
//             bestLitId: MarketId.MyxBuyIn,
//             isRoutable: true,
//             jsonValue: 'MyxBuyIn',
//             displayId: StringId.MarketDisplay_MyxBuyIn,
//             allowedOrderTypeIds: [OrderTypeId.Market],
//             defaultOrderTypeId: OrderTypeId.Market,
//             allowedTimeInForceIds: [TimeInForceId.FillAndKill],
//             defaultTimeInForceId: TimeInForceId.FillAndKill,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: MyxAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 40,
//         },
//         Calastone: {
//             id: MarketId.Calastone,
//             feedId: FeedId.Market_Calastone,
//             defaultExchangeId: ExchangeId.Calastone,
//             supportedExchanges: [ExchangeId.Calastone],
//             legacyDefaultPscGlobalCode: 'Calastone',
//             defaultExchangeLocalCode: 'X',
//             lit: true,
//             bestLitId: MarketId.Calastone,
//             isRoutable: false,
//             jsonValue: 'Calastone',
//             displayId: StringId.MarketDisplay_Calastone,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: undefined,
//             allowedTimeInForceIds: [],
//             defaultTimeInForceId: undefined,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: [],
//             allowedOrderTriggerTypeIds: [],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         AsxCxa: {
//             id: MarketId.AsxCxa,
//             feedId: FeedId.Market_AsxCxa,
//             defaultExchangeId: ExchangeId.AsxCxa,
//             supportedExchanges: [ExchangeId.AsxCxa],
//             legacyDefaultPscGlobalCode: 'ASXCXA',
//             defaultExchangeLocalCode: 'X',
//             lit: true,
//             bestLitId: MarketId.AsxCxa,
//             isRoutable: false,
//             jsonValue: 'AsxCxa',
//             displayId: StringId.MarketDisplay_AsxCxa,
//             allowedOrderTypeIds: [],
//             defaultOrderTypeId: undefined,
//             allowedTimeInForceIds: [],
//             defaultTimeInForceId: undefined,
//             hasPriceStepRestrictions: false,
//             allowedOrderExtendedSideIds: [],
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         PtxMain: {
//             id: MarketId.PtxMain,
//             feedId: FeedId.Market_PtxMain,
//             defaultExchangeId: ExchangeId.Ptx,
//             supportedExchanges: [ExchangeId.Ptx],
//             legacyDefaultPscGlobalCode: 'PTX',
//             defaultExchangeLocalCode: 'N',
//             lit: true,
//             bestLitId: MarketId.PtxMain,
//             isRoutable: true,
//             jsonValue: 'Ptx',
//             displayId: StringId.MarketDisplay_PtxMain,
//             allowedOrderTypeIds: [OrderTypeId.Limit],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         FnsxMain: {
//             id: MarketId.FnsxMain,
//             feedId: FeedId.Market_FnsxMain,
//             defaultExchangeId: ExchangeId.Fnsx,
//             supportedExchanges: [ExchangeId.Fnsx],
//             legacyDefaultPscGlobalCode: 'FNSX',
//             defaultExchangeLocalCode: 'N',
//             lit: true,
//             bestLitId: MarketId.FnsxMain,
//             isRoutable: true,
//             jsonValue: 'Fnsx',
//             displayId: StringId.MarketDisplay_FnsxMain,
//             allowedOrderTypeIds: [OrderTypeId.Limit],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         FpsxMain: {
//             id: MarketId.FpsxMain,
//             feedId: FeedId.Market_FpsxMain,
//             defaultExchangeId: ExchangeId.Fpsx,
//             supportedExchanges: [ExchangeId.Fpsx],
//             legacyDefaultPscGlobalCode: 'FPSX',
//             defaultExchangeLocalCode: 'N',
//             lit: true,
//             bestLitId: MarketId.FpsxMain,
//             isRoutable: true,
//             jsonValue: 'Fpsx',
//             displayId: StringId.MarketDisplay_FpsxMain,
//             allowedOrderTypeIds: [OrderTypeId.Limit],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         CfxMain: {
//             id: MarketId.CfxMain,
//             feedId: FeedId.Market_CfxMain,
//             defaultExchangeId: ExchangeId.Cfx,
//             supportedExchanges: [ExchangeId.Cfx],
//             legacyDefaultPscGlobalCode: 'CFXT',
//             defaultExchangeLocalCode: 'N',
//             lit: true,
//             bestLitId: MarketId.CfxMain,
//             isRoutable: true,
//             jsonValue: 'Cfxt',
//             displayId: StringId.MarketDisplay_CfxMain,
//             allowedOrderTypeIds: [OrderTypeId.Limit],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//         DaxMain: {
//             id: MarketId.DaxMain,
//             feedId: FeedId.Market_DaxMain,
//             defaultExchangeId: ExchangeId.Dax,
//             supportedExchanges: [ExchangeId.Dax],
//             legacyDefaultPscGlobalCode: 'DAXT',
//             defaultExchangeLocalCode: 'N',
//             lit: true,
//             bestLitId: MarketId.DaxMain,
//             isRoutable: true,
//             jsonValue: 'DaxN',
//             displayId: StringId.MarketDisplay_DaxMain,
//             allowedOrderTypeIds: [OrderTypeId.Limit],
//             defaultOrderTypeId: OrderTypeId.Limit,
//             allowedTimeInForceIds: [TimeInForceId.Day, TimeInForceId.GoodTillCancel, TimeInForceId.GoodTillDate],
//             defaultTimeInForceId: TimeInForceId.GoodTillCancel,
//             hasPriceStepRestrictions: true,
//             allowedOrderExtendedSideIds: StandardAllowedOrderExtendedSideIds,
//             allowedOrderTriggerTypeIds: [OrderTriggerTypeId.Immediate],
//             quantityMultiple: 1,
//             displayPriority: 10,
//         },
//     } as const;

//     const infos = Object.values(infosObject);
//     export const idCount = infos.length;
//     export let allIds: readonly MarketId[];

//     class ConstructInfo {
//         id: Id;
//         defaultPscGlobalCode: string;
//         upperDefaultExchangeLocalCode: string;
//         upperDefaultPscGlobalCode: string;
//         upperJsonValue: string;
//         upperDisplay: string;

//         constructor(
//             info: Info
//         ) {
//             this.id = info.id;
//             this.defaultPscGlobalCode = ExchangeInfo.idToDefaultPscCode(info.defaultExchangeId) + info.defaultExchangeLocalCode;
//             this.upperDefaultExchangeLocalCode = info.defaultExchangeLocalCode.toUpperCase();
//             this.upperDefaultPscGlobalCode = this.defaultPscGlobalCode.toUpperCase();
//             // this.UpperRicCode = info.ricCode === undefined ? undefined : info.ricCode.toUpperCase();
//             this.upperJsonValue = info.jsonValue.toUpperCase();
//             this.upperDisplay = Strings[info.displayId].toUpperCase();
//         }
//     }

//     const constructInfos = new Array<ConstructInfo>(idCount);

//     export function initialise() {
//         const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as MarketId);
//         if (outOfOrderIdx >= 0) {
//             throw new EnumInfoOutOfOrderError('TMarketId', outOfOrderIdx, infos[outOfOrderIdx].jsonValue);
//         } else {
//             const initAllIds = new Array<MarketId>(idCount);
//             for (let i = 0; i < idCount; i++) {
//                 const info = infos[i];
//                 initAllIds[i] = info.id;
//                 constructInfos[i] = new ConstructInfo(info);
//             }
//             allIds = initAllIds;
//         }
//     }

//     export function idToName(id: Id): string {
//         return infos[id].jsonValue;
//     }
//     export function idToFeedId(id: Id): FeedId {
//         return infos[id].feedId;
//     }
//     export function idIsLit(id: Id) {
//         return infos[id].lit;
//     }
//     export function idToBestLitId(id: Id) {
//         return idIsLit(id) ? id : infos[id].bestLitId;
//     }
//     export function idToIsRoutable(id: Id) {
//         return infos[id].isRoutable;
//     }
//     export function idToDisplayId(id: Id) {
//         return infos[id].displayId;
//     }
//     export function idToDisplay(id: Id) {
//         return Strings[idToDisplayId(id)];
//     }
//     export function tryDisplayToId(value: string) {
//         const upperValue = value.toUpperCase();
//         const idx = constructInfos.findIndex((info: ConstructInfo) => info.upperDisplay === upperValue);
//         return idx >= 0 ? constructInfos[idx].id : undefined;
//     }
//     export function idToJsonValue(id: Id) {
//         return infos[id].jsonValue;
//     }
//     export function tryJsonValueToId(value: string) {
//         const upperValue = value.toUpperCase();
//         const idx = constructInfos.findIndex((info: ConstructInfo) => info.upperJsonValue === upperValue);
//         return idx >= 0 ? constructInfos[idx].id : undefined;
//     }
//     export function idToExchangeId(id: Id) {
//         return infos[id].defaultExchangeId;
//     }
//     export function idToSupportedExchanges(id: Id) {
//         return infos[id].supportedExchanges;
//     }
//     export function idToLegacyDefaultPscGlobalCode(id: Id) {
//         return infos[id].legacyDefaultPscGlobalCode;
//     }
//     export function idToDefaultPscGlobalCode(id: Id) {
//         return constructInfos[id].defaultPscGlobalCode;
//     }
//     export function idToDefaultExchangeLocalCode(id: Id) {
//         return infos[id].defaultExchangeLocalCode;
//     }
//     export function compareId(Left: Id, Right: Id): number {
//         return compareNumber(Left, Right);
//     }
//     export function compareDisplayPriority(left: Id, right: Id): number {
//         return compareNumber(infos[left].displayPriority, infos[right].displayPriority);
//     }
//     export function uniqueElementIdArraysAreSame(left: readonly Id[], right: readonly Id[]) {
//         return isArrayEqualUniquely<Id>(left, right);
//     }

//     export function getAllowedOrderTypeArray(id: Id) {
//         return infos[id].allowedOrderTypeIds;
//     }

//     export function getDefaultOrderType(id: Id) {
//         return infos[id].defaultOrderTypeId;
//     }

//     export function isOrderTypeAllowed(id: Id, orderTypeId: OrderTypeId) {
//         const allowed = getAllowedOrderTypeArray(id);
//         return allowed.includes(orderTypeId);
//     }

//     export function isQuantityAllowed(id: Id, quantity: Integer) {
//         return quantity % infos[id].quantityMultiple === 0;
//     }

//     export function getAllowedTimeInForceIdArray(id: Id) {
//         return infos[id].allowedTimeInForceIds;
//     }

//     export function getAllowedTimeInForceIdArrayForOrderType(id: Id, orderTypeId: OrderTypeId) {
//         if (orderTypeId !== OrderTypeId.Market) {
//             return infos[id].allowedTimeInForceIds;
//         } else {
//             switch (id) {
//                 case (MarketId.MyxBuyIn): {
//                     return [TimeInForceId.FillAndKill];
//                 }
//                 case (MarketId.MyxNormal):
//                 case (MarketId.MyxOddLot): {
//                     return [TimeInForceId.Day, TimeInForceId.FillAndKill];
//                 }
//                 default: {
//                     return [TimeInForceId.FillOrKill];
//                 }
//             }
//         }
//     }

//     export function isTimeInForceForOrderTypeAllowed(id: Id, orderTypeId: OrderTypeId, timeInForceId: TimeInForceId) {
//         const allowedArray = getAllowedTimeInForceIdArrayForOrderType(id, orderTypeId);
//         return allowedArray.includes(timeInForceId);
//     }

//     export function GetAllowedSideIdArray(id: Id) {
//         return infos[id].allowedOrderExtendedSideIds;
//     }

//     export function isSideAllowed(id: Id, sideId: OrderExtendedSideId) {
//         const allowed = GetAllowedSideIdArray(id);
//         return allowed.includes(sideId);
//     }

//     // AppOptions.Trading_DefaultOrderExpiry should override GetDefaultTimeInForce if possible.
//     export function GetDefaultTimeInForce(id: Id) {
//         return infos[id].defaultTimeInForceId;
//     }

//     export function GetAllowedOrderTriggerTypeIdArray(id: Id) {
//         return infos[id].allowedOrderTriggerTypeIds;
//     }

//     export function GetHasPriceStepRestrictions(id: Id) {
//         return infos[id].hasPriceStepRestrictions;
//     }
// }

export namespace ExchangeInfo {
//     export type Id = ExchangeId;
//     export const nullId = ExchangeId.Calastone; // not really null - just used as placeholder

//     export const enum Name {
//         Asx = 'Asx',
//         Cxa = 'Cxa',
//         Nsx = 'Nsx',
//         Nzx = 'Nzx',
//         Myx = 'Myx',
//         Calastone = 'Calastone',
//         Ptx = 'Ptx',
//         Fnsx = 'Fnsx',
//         Fpsx = 'Fpsx',
//         Cfx = 'Cfx',
//         Dax = 'Dax',
//         AsxCxa = 'AsxCxa',
//     }

    export namespace Myx {
        export namespace InstructionId {
            export const ProprietaryShortSell = OrderInstructionId.PSS;
            export const IntraDayShortSell = OrderInstructionId.IDSS;
            export const ProprietaryDayTrade = OrderInstructionId.PDT;
            export const RegulatedShortSell = OrderInstructionId.RSS;
        }
    }

//     export function getDefaultDataEnvironmentId(exchangeId: ExchangeId): DataEnvironmentId {
//         const overriddenDefaultDataEnvironmentId = idToOverrideDefaultDataEnvironmentId(exchangeId);
//         if (overriddenDefaultDataEnvironmentId !== undefined) {
//             return overriddenDefaultDataEnvironmentId;
//         } else {
//             return DataEnvironment._defaultId;
//         }
//     }

//     interface Info {
//         id: Id;
//         name: Name;
//         abbreviatedDisplayId: StringId;
//         fullDisplayId: StringId;
//         defaultMarket: MarketId;
//         defaultPscCode: string;
//         defaultSymbolNameFieldId: SymbolFieldId;
//         allowableSymbolNameFieldIds: readonly SymbolFieldId[];
//         defaultSymbolSearchFieldIds: readonly SymbolFieldId[];
//         allowableSymbolSearchFieldIds: readonly SymbolFieldId[];
//     }

//     type InfosObject = { [id in keyof typeof ExchangeId]: Info };

//     const infosObject: InfosObject = {
//         Asx: {
//             id: ExchangeId.Asx,
//             name: Name.Asx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Asx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Asx,
//             defaultMarket: MarketId.AsxTradeMatch,
//             defaultPscCode: 'AX',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name, SymbolFieldId.Short, SymbolFieldId.Long],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name,
//                 SymbolFieldId.Short, SymbolFieldId.Long, SymbolFieldId.Base, SymbolFieldId.Isin],
//         },
//         Cxa: {
//             id: ExchangeId.Cxa,
//             name: Name.Cxa,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Cxa,
//             fullDisplayId: StringId.ExchangeFullDisplay_Cxa,
//             defaultMarket: MarketId.ChixAustLimit,
//             defaultPscCode: 'CA',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Nsx: {
//             id: ExchangeId.Nsx,
//             name: Name.Nsx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Nsx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Nsx,
//             defaultMarket: MarketId.Nsx,
//             defaultPscCode: 'NSX',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Nzx: {
//             id: ExchangeId.Nzx,
//             name: Name.Nzx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Nzx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Nzx,
//             defaultMarket: MarketId.Nzx,
//             defaultPscCode: 'NZ',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Myx: {
//             id: ExchangeId.Myx,
//             name: Name.Myx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Myx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Myx,
//             defaultMarket: MarketId.MyxNormal,
//             defaultPscCode: 'MY',
//             defaultSymbolNameFieldId: SymbolFieldId.Ticker,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name, SymbolFieldId.Ticker],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Ticker],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Ticker,
//                 SymbolFieldId.Name, SymbolFieldId.Base, SymbolFieldId.Isin, SymbolFieldId.Gics],
//         },
//         Calastone: {
//             id: ExchangeId.Calastone,
//             name: Name.Calastone,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Calastone,
//             fullDisplayId: StringId.ExchangeFullDisplay_Calastone,
//             defaultMarket: MarketId.Calastone,
//             defaultPscCode: 'CAL',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Ptx: {
//             id: ExchangeId.Ptx,
//             name: Name.Ptx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Ptx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Ptx,
//             defaultMarket: MarketId.PtxMain,
//             defaultPscCode: 'PX',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Fnsx: {
//             id: ExchangeId.Fnsx,
//             name: Name.Fnsx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Fnsx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Fnsx,
//             defaultMarket: MarketId.FnsxMain,
//             defaultPscCode: 'FN',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Fpsx: {
//             id: ExchangeId.Fpsx,
//             name: Name.Fpsx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Fpsx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Fpsx,
//             defaultMarket: MarketId.FpsxMain,
//             defaultPscCode: 'FP',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Cfx: {
//             id: ExchangeId.Cfx,
//             name: Name.Cfx,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Cfx,
//             fullDisplayId: StringId.ExchangeFullDisplay_Cfx,
//             defaultMarket: MarketId.CfxMain,
//             defaultPscCode: 'CF',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         Dax: {
//             id: ExchangeId.Dax,
//             name: Name.Dax,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_Dax,
//             fullDisplayId: StringId.ExchangeFullDisplay_Dax,
//             defaultMarket: MarketId.DaxMain,
//             defaultPscCode: 'DX',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//         AsxCxa: {
//             id: ExchangeId.AsxCxa,
//             name: Name.AsxCxa,
//             abbreviatedDisplayId: StringId.ExchangeAbbreviatedDisplay_AsxCxa,
//             fullDisplayId: StringId.ExchangeFullDisplay_AsxCxa,
//             defaultMarket: MarketId.AsxCxa,
//             defaultPscCode: 'AX',
//             defaultSymbolNameFieldId: SymbolFieldId.Name,
//             allowableSymbolNameFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             defaultSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//             allowableSymbolSearchFieldIds: [SymbolFieldId.Code, SymbolFieldId.Name],
//         },
//     } as const;

//     const infos: readonly Info[] = Object.values(infosObject);
//     export const idCount = infos.length;
//     export let allIds: readonly ExchangeId[];

//     interface ConstructInfo {
//         localMarkets: MarketId[];
//         overriddenDefaultDataEnvironmentId: DataEnvironmentId | undefined;
//     }

//     const constructInfos = new Array<ConstructInfo>(idCount);

//     export function initialise() {
//         const initAllIds = new Array<ExchangeId>(idCount);

//         for (let id = 0; id < idCount; id++) {
//             if (infos[id].id !== id as ExchangeId) {
//                 throw new EnumInfoOutOfOrderError('ExchangeId', id, Strings[infos[id].abbreviatedDisplayId]);
//             } else {
//                 initAllIds[id] = id;
//                 const localMarkets = calculateLocalMarkets(id);

//                 const constructInfo: ConstructInfo = {
//                     localMarkets,
//                     overriddenDefaultDataEnvironmentId: undefined,
//                 };

//                 constructInfos[id] = constructInfo;
//             }
//         }
//         allIds = initAllIds;
//     }

//     function calculateLocalMarkets(id: ExchangeId) {
//         const localMarkets = new Array<MarketId>(MarketInfo.idCount);
//         let localMarketCount = 0;
//         for (let marketId = 0; marketId < MarketInfo.idCount; marketId++) {
//             const marketExchangeId = MarketInfo.idToExchangeId(marketId);
//             if (marketExchangeId === id) {
//                 localMarkets[localMarketCount++] = marketId;
//             }
//         }
//         localMarkets.length = localMarketCount;
//         return localMarkets;
//     }

//     export function idToAbbreviatedDisplayId(id: Id) {
//         return infos[id].abbreviatedDisplayId;
//     }

//     export function idToAbbreviatedDisplay(id: Id) {
//         return Strings[idToAbbreviatedDisplayId(id)];
//     }

//     export function idToFullDisplayId(id: Id) {
//         return infos[id].fullDisplayId;
//     }

//     export function idToFullDisplay(id: Id) {
//         return Strings[idToFullDisplayId(id)];
//     }

//     export function compareId(left: Id, right: Id) {
//         return compareInteger(left, right);
//     }

//     export function priorityCompareId(left: Id, right: Id, priority: Id) {
//         return priorityCompareInteger(left, right, priority);
//     }

//     export function idToName(id: Id) {
//         return infos[id].name;
//     }

//     export function tryNameToId(name: string) {
//         const index = infos.findIndex(info => info.name === name as Name);
//         return index >= 0 ? infos[index].id : undefined;
//     }

//     export function idToJsonValue(id: Id): string {
//         return idToName(id);
//     }

//     export function idToDefaultMarketId(id: Id) {
//         return infos[id].defaultMarket;
//     }

//     export function idToLocalMarkets(id: Id) {
//         return constructInfos[id].localMarkets;
//     }

//     export function setOverrideDefaultDataEnvironmentId(id: Id, dataEnvironmentId: DataEnvironmentId) {
//         return constructInfos[id].overriddenDefaultDataEnvironmentId = dataEnvironmentId;
//     }

//     export function idToOverrideDefaultDataEnvironmentId(id: Id) {
//         return constructInfos[id].overriddenDefaultDataEnvironmentId;
//     }

//     export function tryJsonValueToId(value: string) {
//         return tryNameToId(value);
//     }

//     export function idToDefaultPscCode(id: Id) {
//         return infos[id].defaultPscCode;
//     }

//     export function idToDefaultSymbolNameFieldId(id: Id) {
//         return infos[id].defaultSymbolNameFieldId;
//     }

//     export function idToAllowableSymbolNameFieldIds(id: Id) {
//         return infos[id].allowableSymbolNameFieldIds;
//     }

//     export function idToDefaultSymbolSearchFieldIds(id: Id) {
//         return infos[id].defaultSymbolSearchFieldIds;
//     }

//     export function idToAllowableSymbolSearchFieldIds(id: Id) {
//         return infos[id].allowableSymbolSearchFieldIds;
//     }
// }

// export namespace DataEnvironment {
//     export type Id = DataEnvironmentId;

//     export const nullId = DataEnvironmentId.Demo; // not really null - just used when need to flag null

//     /**
//      * @internal
//      */
//     export let _defaultId: DataEnvironmentId;
//     export function getDefaultId() {
//         return _defaultId;
//     }
//     export function setDefaultId(value: DataEnvironmentId) {
//         _defaultId = value;
//     }

//     interface Info {
//         readonly id: Id;
//         readonly code: string;
//         readonly name: string;
//         readonly json: string;
//         readonly displayId: StringId;
//         readonly correspondingTradingEnvironmentId: TradingEnvironmentId,
//     }

//     type InfosObject = { [id in keyof typeof DataEnvironmentId]: Info };

//     const infosObject: InfosObject = {
//         Production: {
//             id: DataEnvironmentId.Production,
//             code: 'prd',
//             name: 'Production',
//             json: 'prod',
//             displayId: StringId.DataEnvironmentDisplay_Production,
//             correspondingTradingEnvironmentId: TradingEnvironmentId.Production,
//         },
//         DelayedProduction: {
//             id: DataEnvironmentId.DelayedProduction,
//             code: 'dpd',
//             name: 'DelayedProduction',
//             json: 'delayed',
//             displayId: StringId.DataEnvironmentDisplay_DelayedProduction,
//             correspondingTradingEnvironmentId: TradingEnvironmentId.Production,
//         },
//         Demo: {
//             id: DataEnvironmentId.Demo,
//             code: 'dem',
//             name: 'Demo',
//             json: 'demo',
//             displayId: StringId.DataEnvironmentDisplay_Demo,
//             correspondingTradingEnvironmentId: TradingEnvironmentId.Demo,
//         },
//         Sample: {
//             id: DataEnvironmentId.Sample,
//             code: 'sam',
//             name: 'Sample',
//             json: 'sample',
//             displayId: StringId.DataEnvironmentDisplay_Sample,
//             correspondingTradingEnvironmentId: TradingEnvironmentId.Demo,
//         },
//     } as const;

//     export const idCount = Object.keys(infosObject).length;

//     const infos = Object.values(infosObject);

//     export function initialise() {
//         const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as DataEnvironmentId);
//         if (outOfOrderIdx >= 0) {
//             throw new EnumInfoOutOfOrderError('DataEnvironmentId', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
//         }
//     }

//     export function idToDisplayId(id: Id): StringId {
//         return infos[id].displayId;
//     }

//     export function idToDisplay(id: Id): string {
//         return Strings[idToDisplayId(id)];
//     }

//     export function compareId(left: Id, right: Id): Integer {
//         return compareInteger(left, right);
//     }

//     export function idToCode(id: Id): string {
//         return infos[id].code;
//     }

//     export function idToName(id: Id): string {
//         return infos[id].name;
//     }

//     export function tryNameToId(name: string): Id | undefined {
//         const index = infos.findIndex(info => info.name === name);
//         return index >= 0 ? infos[index].id : undefined;
//     }

//     export function idToJsonValue(id: Id): string {
//         return infos[id].json;
//     }

//     export function tryJsonToId(jsonValue: string): Id | undefined {
//         const index = infos.findIndex(info => info.json === jsonValue);
//         return index >= 0 ? infos[index].id : undefined;
//     }

//     export function idToTag(id: Id) {
//         switch (id) {
//             case DataEnvironmentId.Production: return 'Production';
//             case DataEnvironmentId.DelayedProduction: return 'DelayedProduction';
//             case DataEnvironmentId.Demo: return 'Demo';
//             case DataEnvironmentId.Sample: return 'Sample';
//             default:
//                 throw new UnreachableCaseError('DTITT499914095703', id);
//         }
//     }

//     export function idToCorrespondingTradingEnvironmentId(id: Id) {
//         return infos[id].correspondingTradingEnvironmentId;
//     }
}

// export namespace TradingEnvironment {
//     export type Id = TradingEnvironmentId;

//     export const nullId = TradingEnvironmentId.Demo; // not really null - just used when need to flag null

//     let _defaultId: TradingEnvironmentId;

//     export function getDefaultId() { return _defaultId; }
//     export function setDefaultId(value: TradingEnvironmentId) { _defaultId = value; }

//     interface Info {
//         readonly id: Id;
//         readonly code: string;
//         readonly name: string;
//         readonly json: string;
//         readonly displayId: StringId;
//         readonly correspondingDataEnvironmentId: DataEnvironmentId,
//     }

//     type InfosObject = { [id in keyof typeof TradingEnvironmentId]: Info };

//     const infosObject: InfosObject = {
//         Production: {
//             id: TradingEnvironmentId.Production,
//             code: 'prd',
//             name: 'Production',
//             json: 'prod',
//             displayId: StringId.TradingEnvironmentDisplay_Production,
//             correspondingDataEnvironmentId: DataEnvironmentId.Production,
//         },
//         Demo: {
//             id: TradingEnvironmentId.Demo,
//             code: 'dem',
//             name: 'Demo',
//             json: 'demo',
//             displayId: StringId.TradingEnvironmentDisplay_Demo,
//             correspondingDataEnvironmentId: DataEnvironmentId.Demo,
//         },
//     } as const;

//     export const idCount = Object.keys(infosObject).length;

//     const infos = Object.values(infosObject);

//     export function initialise() {
//         const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as TradingEnvironmentId);
//         if (outOfOrderIdx >= 0) {
//             throw new EnumInfoOutOfOrderError('TradingEnvironmentId', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
//         }
//     }

//     export function idToDisplayId(id: Id): StringId {
//         return infos[id].displayId;
//     }

//     export function idToDisplay(id: Id): string {
//         return Strings[idToDisplayId(id)];
//     }

//     export function compareId(left: Id, right: Id): Integer {
//         return compareInteger(left, right);
//     }

//     export function idToCode(id: Id): string {
//         return infos[id].code;
//     }

//     export function idToName(id: Id): string {
//         return infos[id].name;
//     }

//     export function tryNameToId(name: string): Id | undefined {
//         const index = infos.findIndex(info => info.name === name);
//         return index >= 0 ? infos[index].id : undefined;
//     }

//     export function idToJsonValue(id: Id): string {
//         return infos[id].json;
//     }

//     export function tryJsonToId(jsonValue: string): Id | undefined {
//         const index = infos.findIndex(info => info.json === jsonValue);
//         return index >= 0 ? infos[index].id : undefined;
//     }

//     export function idToTag(id: Id) {
//         switch (id) {
//             case TradingEnvironmentId.Production: return 'Production';
//             case TradingEnvironmentId.Demo: return 'Demo';
//             default:
//                 throw new UnreachableCaseError('DTTE499914095703', id);
//         }
//     }

//     export function idToCorrespondingDataEnvironmentId(id: Id) {
//         return infos[id].correspondingDataEnvironmentId;
//     }
// }

// export namespace DataMessageType {
//     export type Id = DataMessageTypeId;

//     interface Info {
//         id: Id;
//     }

//     type InfosObject = { [id in keyof typeof DataMessageTypeId]: Info };

//     const infosObject: InfosObject = {
//         PublisherSubscription_Onlined: {
//             id: DataMessageTypeId.PublisherSubscription_Onlined,
//         },
//         PublisherSubscription_Offlining: {
//             id: DataMessageTypeId.PublisherSubscription_Offlining,
//         },
//         PublisherSubscription_Warning: {
//             id: DataMessageTypeId.PublisherSubscription_Warning,
//         },
//         PublisherSubscription_Error: {
//             id: DataMessageTypeId.PublisherSubscription_Error,
//         },
//         SuccessFail: {
//             id: DataMessageTypeId.SuccessFail,
//         },
//         Feeds: {
//             id: DataMessageTypeId.Feeds,
//         },
//         Markets: {
//             id: DataMessageTypeId.Markets,
//         },
//         TradingStates: {
//             id: DataMessageTypeId.TradingStates,
//         },
//         Depth: {
//             id: DataMessageTypeId.Depth,
//         },
//         DepthLevels: {
//             id: DataMessageTypeId.DepthLevels,
//         },
//         Security: {
//             id: DataMessageTypeId.Security,
//         },
//         Trades: {
//             id: DataMessageTypeId.Trades,
//         },
//         Symbols: {
//             id: DataMessageTypeId.Symbols,
//         },
//         Holdings: {
//             id: DataMessageTypeId.Holdings,
//         },
//         Balances: {
//             id: DataMessageTypeId.Balances,
//         },
//         TopShareholders: {
//             id: DataMessageTypeId.TopShareholders,
//         },
//         BrokerageAccounts: {
//             id: DataMessageTypeId.BrokerageAccounts,
//         },
//         Orders: {
//             id: DataMessageTypeId.Orders,
//         },
//         Transactions: {
//             id: DataMessageTypeId.Transactions,
//         },
//         OrderStatuses: {
//             id: DataMessageTypeId.OrderStatuses,
//         },
//         ZenithServerInfo: {
//             id: DataMessageTypeId.ZenithServerInfo,
//         },
//         Synchronised: {
//             id: DataMessageTypeId.Synchronised,
//         },
//         ChartHistory: {
//             id: DataMessageTypeId.ChartHistory,
//         },
//         ZenithPublisherStateChange: {
//             id: DataMessageTypeId.ZenithPublisherStateChange,
//         },
//         ZenithReconnect: {
//             id: DataMessageTypeId.ZenithReconnect,
//         },
//         ZenithPublisherOnlineChange: {
//             id: DataMessageTypeId.ZenithPublisherOnlineChange,
//         },
//         ZenithEndpointSelected: {
//             id: DataMessageTypeId.ZenithEndpointSelected,
//         },
//         ZenithCounter: {
//             id: DataMessageTypeId.ZenithCounter,
//         },
//         ZenithLog: {
//             id: DataMessageTypeId.ZenithLog,
//         },
//         ZenithSessionTerminated: {
//             id: DataMessageTypeId.ZenithSessionTerminated,
//         },
//         ZenithQueryConfigure: {
//             id: DataMessageTypeId.ZenithQueryConfigure,
//         },
//         PlaceOrderResponse: {
//             id: DataMessageTypeId.PlaceOrderResponse,
//         },
//         AmendOrderResponse: {
//             id: DataMessageTypeId.AmendOrderResponse,
//         },
//         CancelOrderResponse: {
//             id: DataMessageTypeId.CancelOrderResponse,
//         },
//         MoveOrderResponse: {
//             id: DataMessageTypeId.MoveOrderResponse,
//         },
//         CreateScan: {
//             id: DataMessageTypeId.CreateScan,
//         },
//         UpdateScan: {
//             id: DataMessageTypeId.UpdateScan,
//         },
//         DeleteScan: {
//             id: DataMessageTypeId.DeleteScan,
//         },
//         QueryScanDetail: {
//             id: DataMessageTypeId.QueryScanDetail,
//         },
//         ExecuteScan: {
//             id: DataMessageTypeId.ExecuteScan,
//         },
//         ScanDescriptors: {
//             id: DataMessageTypeId.ScanDescriptors,
//         },
//         DataIvemIdMatches: {
//             id: DataMessageTypeId.DataIvemIdMatches,
//         },
//         WatchmakerListRequestAcknowledge: {
//             id: DataMessageTypeId.WatchmakerListRequestAcknowledge,
//         },
//         CreateOrCopyWatchmakerList: {
//             id: DataMessageTypeId.CreateOrCopyWatchmakerList,
//         },
//         WatchmakerListDescriptors: {
//             id: DataMessageTypeId.WatchmakerListDescriptors,
//         },
//         WatchmakerListDataIvemIds: {
//             id: DataMessageTypeId.WatchmakerListDataIvemIds,
//         },
//     } as const;

//     export const idCount = Object.keys(infosObject).length;
//     const infos = Object.values(infosObject);

//     export function initialise() {
//         for (let id = 0; id < DataMessageType.idCount; id++) {
//             if (id as DataMessageTypeId !== infos[id].id) {
//                 throw new EnumInfoOutOfOrderError('DataMessageTypeId', id, `${id}`);
//             }
//         }
//     }
// }

export namespace DataChannel {
    export type Id = DataChannelId;

    interface Info {
        readonly channel: Id;
        readonly name: string;
        readonly defaultActiveSubscriptionsLimit: number;
        readonly defaultDeactivationDelay: number;
        readonly dependsOn: readonly Id[];
    }

    class CalcInfo {
        public id: Id;
        public dependencyIndex: number;
        public fullDependsOn: readonly Id[];
    }

    class FullDependsOnCalcRec {
        public id: Id;
        public fullDependsOn: Id[];
        public preparing: boolean;
        public prepared: boolean;
        public dependencyIndex: number;
    }
    type FullDependsOnCalcArray = FullDependsOnCalcRec[];

    type InfosObject = { [id in keyof typeof DataChannelId]: Info };

    const infosObject: InfosObject = {
        ZenithExtConnection: {
            channel: DataChannelId.ZenithExtConnection,
            name: 'ZenithExtConnection',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 0,
            dependsOn: [],
        },
        ZenithQueryConfigure: {
            channel: DataChannelId.ZenithQueryConfigure,
            name: 'ZenithQueryConfigure',
            defaultActiveSubscriptionsLimit: 20,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.ZenithExtConnection],
        },
        Feeds: {
            channel: DataChannelId.Feeds,
            name: 'Feeds',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 8 * mSecsPerHour,
            dependsOn: [DataChannelId.ZenithExtConnection],
        },
        ClassFeeds: {
            channel: DataChannelId.ClassFeeds,
            name: 'ClassFeeds',
            defaultActiveSubscriptionsLimit: 8,
            defaultDeactivationDelay: 8 * mSecsPerHour,
            dependsOn: [DataChannelId.Feeds],
        },
        TradingStates: {
            channel: DataChannelId.TradingStates,
            name: 'TradingStates',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Feeds],
        },
        Markets: {
            channel: DataChannelId.Markets,
            name: 'Markets',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 8 * mSecsPerHour,
            dependsOn: [DataChannelId.TradingStates],
        },
        Depth: {
            channel: DataChannelId.Depth,
            name: 'Depth',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 10 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Markets],
        },
        DepthLevels: {
            channel: DataChannelId.DepthLevels,
            name: 'Levels',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 10 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Markets],
        },
        Trades: {
            channel: DataChannelId.Trades,
            name: 'Trades',
            defaultActiveSubscriptionsLimit: 152,
            defaultDeactivationDelay: 10 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Markets],
        },
        LatestTradingDayTrades: {
            channel: DataChannelId.LatestTradingDayTrades,
            name: 'LatestTradingDayTrades',
            defaultActiveSubscriptionsLimit: 152,
            defaultDeactivationDelay: 10 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Trades],
        },
        Security: {
            channel: DataChannelId.Security,
            name: 'Security',
            defaultActiveSubscriptionsLimit: 2600,
            defaultDeactivationDelay: 20 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Markets],
        },
        Symbols: {
            channel: DataChannelId.Symbols,
            name: 'Symbols',
            defaultActiveSubscriptionsLimit: 1000,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Markets],
        },
        BrokerageAccounts: {
            channel: DataChannelId.BrokerageAccounts,
            name: 'BrokerageAccounts',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 8 * secsPerHour * mSecsPerSec,
            dependsOn: [DataChannelId.Feeds],
        },
        BrokerageAccountHoldings: {
            channel: DataChannelId.BrokerageAccountHoldings,
            name: 'BrokerageAccountHoldings',
            defaultActiveSubscriptionsLimit: 20000,
            defaultDeactivationDelay: 20 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        AllHoldings: {
            channel: DataChannelId.AllHoldings,
            name: 'AllHoldings',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 20 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccountHoldings],
        },
        BrokerageAccountBalances: {
            channel: DataChannelId.BrokerageAccountBalances,
            name: 'BrokerageAccountBalances',
            defaultActiveSubscriptionsLimit: 20000,
            defaultDeactivationDelay: 20 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        AllBalances: {
            channel: DataChannelId.AllBalances,
            name: 'AllBalances',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 20 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccountBalances],
        },
        LowLevelTopShareholders: {
            channel: DataChannelId.LowLevelTopShareholders,
            name: 'LowLevelTopShareholders',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Feeds],
        },
        TopShareholders: {
            channel: DataChannelId.TopShareholders,
            name: 'TopShareholders',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.LowLevelTopShareholders],
        },
        BrokerageAccountOrders: {
            channel: DataChannelId.BrokerageAccountOrders,
            name: 'BrokerageAccountOrders',
            defaultActiveSubscriptionsLimit: 20000,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        AllOrders: {
            channel: DataChannelId.AllOrders,
            name: 'AllOrders',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccountOrders],
        },
        BrokerageAccountTransactions: {
            channel: DataChannelId.BrokerageAccountTransactions,
            name: 'BrokerageAccountTransactions',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        AllTransactions: {
            channel: DataChannelId.AllTransactions,
            name: 'AllTransactions',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.BrokerageAccountOrders],
        },
        OrderRequests: {
            channel: DataChannelId.OrderRequests,
            name: 'OrderRequests',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Feeds],
        },
        OrderAudit: {
            channel: DataChannelId.OrderAudit,
            name: 'OrderAudit',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * mSecsPerMin,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        TradingMarkets: {
            channel: DataChannelId.TradingMarkets,
            name: 'TradingMarkets',
            defaultActiveSubscriptionsLimit: 5,
            defaultDeactivationDelay: 30 * mSecsPerMin,
            dependsOn: [DataChannelId.Feeds],
        },
        OrderStatuses: {
            channel: DataChannelId.OrderStatuses,
            name: 'OrderStatuses',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * mSecsPerMin,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        ZenithServerInfo: {
            channel: DataChannelId.ZenithServerInfo,
            name: 'ZenithServerInfo',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 20 * mSecsPerDay, // bug in server. make subscription last forever (should be 20 minutes)
            dependsOn: [DataChannelId.ZenithExtConnection],
        },
        ChartHistory: {
            channel: DataChannelId.ChartHistory,
            name: 'ChartHistory',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Markets],
        },
        DayTrades: {
            channel: DataChannelId.DayTrades,
            name: 'DayTrades',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 30 * secsPerMin * mSecsPerSec,
            dependsOn: [DataChannelId.Trades, DataChannelId.LatestTradingDayTrades],
        },
        PlaceOrderRequest: {
            channel: DataChannelId.PlaceOrderRequest,
            name: 'PlaceOrderRequest',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        AmendOrderRequest: {
            channel: DataChannelId.AmendOrderRequest,
            name: 'AmendOrderRequest',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        CancelOrderRequest: {
            channel: DataChannelId.CancelOrderRequest,
            name: 'CancelOrderRequest',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        MoveOrderRequest: {
            channel: DataChannelId.MoveOrderRequest,
            name: 'MoveOrderRequest',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.BrokerageAccounts],
        },
        CreateScan: {
            channel: DataChannelId.CreateScan,
            name: 'CreateScan',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        QueryScanDetail: {
            channel: DataChannelId.QueryScanDetail,
            name: 'QueryScan',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        DeleteScan: {
            channel: DataChannelId.DeleteScan,
            name: 'DeleteScan',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        UpdateScan: {
            channel: DataChannelId.UpdateScan,
            name: 'UpdateScan',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        ScanDescriptors: {
            channel: DataChannelId.ScanDescriptors,
            name: 'ScanDescriptors',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        DataIvemIdMatches: {
            channel: DataChannelId.DataIvemIdMatches,
            name: 'DataIvemIdMatches',
            defaultActiveSubscriptionsLimit: 5000,
            defaultDeactivationDelay: 30 * mSecsPerSec,
            dependsOn: [DataChannelId.Feeds],
        },
        DataIvemIdCreateWatchmakerList: {
            channel: DataChannelId.DataIvemIdCreateWatchmakerList,
            name: 'DataIvemIdCreateWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        CreateNotificationChannel: {
            channel: DataChannelId.CreateNotificationChannel,
            name: 'CreateNotificationChannel',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        DeleteNotificationChannel: {
            channel: DataChannelId.DeleteNotificationChannel,
            name: 'DeleteNotificationChannel',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        UpdateNotificationChannel: {
            channel: DataChannelId.UpdateNotificationChannel,
            name: 'UpdateNotificationChannel',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        UpdateNotificationChannelEnabled: {
            channel: DataChannelId.UpdateNotificationChannelEnabled,
            name: 'UpdateNotificationChannelEnabled',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        QueryNotificationChannel: {
            channel: DataChannelId.QueryNotificationChannel,
            name: 'QueryNotificationChannel',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        QueryNotificationChannels: {
            channel: DataChannelId.QueryNotificationChannels,
            name: 'QueryNotificationChannels',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        QueryNotificationDistributionMethod: {
            channel: DataChannelId.QueryNotificationDistributionMethod,
            name: 'QueryNotificationDistributionMethod',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        QueryNotificationDistributionMethods: {
            channel: DataChannelId.QueryNotificationDistributionMethods,
            name: 'QueryNotificationDistributionMethods',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        UpdateWatchmakerList: {
            channel: DataChannelId.UpdateWatchmakerList,
            name: 'UpdateWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        CopyWatchmakerList: {
            channel: DataChannelId.CopyWatchmakerList,
            name: 'CopyWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        DeleteWatchmakerList: {
            channel: DataChannelId.DeleteWatchmakerList,
            name: 'DeleteWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        WatchmakerListDescriptors: {
            channel: DataChannelId.WatchmakerListDescriptors,
            name: 'WatchmakerListDescriptors',
            defaultActiveSubscriptionsLimit: 1,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        DataIvemIdWatchmakerListMembers: {
            channel: DataChannelId.DataIvemIdWatchmakerListMembers,
            name: 'DataIvemIdWatchmakerListMembers',
            defaultActiveSubscriptionsLimit: 3000,
            defaultDeactivationDelay: 5 * mSecsPerMin,
            dependsOn: [DataChannelId.Feeds],
        },
        DataIvemIdAddToWatchmakerList: {
            channel: DataChannelId.DataIvemIdAddToWatchmakerList,
            name: 'DataIvemIdAddToWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        DataIvemIdInsertIntoWatchmakerList: {
            channel: DataChannelId.DataIvemIdInsertIntoWatchmakerList,
            name: 'DataIvemIdInsertIntoWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },
        MoveInWatchmakerList: {
            channel: DataChannelId.MoveInWatchmakerList,
            name: 'MoveInWatchmakerList',
            defaultActiveSubscriptionsLimit: 50,
            defaultDeactivationDelay: 0,
            dependsOn: [DataChannelId.Feeds],
        },

    } as const;

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    const calcInfos = new Array<CalcInfo>(idCount);

    function prepareFullDependsOn(id: Id, fullDependsOnArray: FullDependsOnCalcArray) {
        if (!fullDependsOnArray[id].prepared) {
            if (fullDependsOnArray[id].preparing) {
                throw new AssertInternalError('DYDCPFDO244465', idToName(id));
            } else {
                fullDependsOnArray[id].preparing = true;
                for (const DependsOnId of infos[id].dependsOn) {
                    fullDependsOnArray[id].fullDependsOn.push(DependsOnId);
                    if (!fullDependsOnArray[DependsOnId].prepared) {
                        prepareFullDependsOn(DependsOnId, fullDependsOnArray);
                    }
                    fullDependsOnArray[id].fullDependsOn =
                        fullDependsOnArray[id].fullDependsOn.concat(fullDependsOnArray[DependsOnId].fullDependsOn);
                }
                fullDependsOnArray[id].preparing = false;
                fullDependsOnArray[id].prepared = true;
            }
        }
    }

    function prepareDependencyIndex(id: Id, fullDependsOnArray: FullDependsOnCalcArray, dependencyIndex: number): number {
        if (!fullDependsOnArray[id].prepared) {
            if (fullDependsOnArray[id].preparing) {
                throw new AssertInternalError('DTDCPDI072226', idToName(id));
            } else {
                fullDependsOnArray[id].preparing = true;
                for (const DependsOnId of fullDependsOnArray[id].fullDependsOn) {
                    if (!fullDependsOnArray[DependsOnId].prepared) {
                        dependencyIndex = prepareDependencyIndex(DependsOnId, fullDependsOnArray, dependencyIndex);
                    }
                }
                fullDependsOnArray[id].preparing = false;
                fullDependsOnArray[id].prepared = true;
                fullDependsOnArray[id].dependencyIndex = dependencyIndex;
                return dependencyIndex++;
            }
        }

        return dependencyIndex;
    }

    function calculateInfos() {

        const fullDependsOnArray = new Array<FullDependsOnCalcRec>(idCount);

        for (let id: Integer = 0; id < fullDependsOnArray.length; id++) {
            fullDependsOnArray[id] = new FullDependsOnCalcRec();
            fullDependsOnArray[id].id = id;
            fullDependsOnArray[id].fullDependsOn = [];
            fullDependsOnArray[id].preparing = false;
            fullDependsOnArray[id].prepared = false;
        }

        for (let id = 0; id < infos.length; id++) {
            prepareFullDependsOn(id, fullDependsOnArray);
        }

        for (const rec of fullDependsOnArray) {
            rec.preparing = false;
            rec.prepared = false;
            rec.dependencyIndex = -1;
        }

        let dependencyIndex = 0;
        for (let id = 0; id < idCount; id++) {
            dependencyIndex = prepareDependencyIndex(id, fullDependsOnArray, dependencyIndex);
        }

        for (let id = 0; id < fullDependsOnArray.length; id++) {
            calcInfos[id] = new CalcInfo();
            calcInfos[id].id = id;
            calcInfos[id].dependencyIndex = fullDependsOnArray[id].dependencyIndex;
            calcInfos[id].fullDependsOn = fullDependsOnArray[id].fullDependsOn;
        }
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }
    export function idToMapKey(id: Id): string {
        return infos[id].name;
    }
    export function idToDefaultActiveLimit(id: Id): number {
        return infos[id].defaultActiveSubscriptionsLimit;
    }
    export function idToDefaultDeactivationDelay(id: Id): number {
        return infos[id].defaultDeactivationDelay;
    }
    export function idToDependencyIndex(id: Id): number {
        return calcInfos[id].dependencyIndex;
    }
    export function idToFullDependsOnSet(id: Id) {
        return calcInfos[id].fullDependsOn;
    }
    export function compareDependencyIndex(Left: Id, Right: Id): number {
        return compareNumber(idToDependencyIndex(Left), idToDependencyIndex(Right));
    }

    export function initialise() {
        for (let id = 0; id < DataChannel.idCount; id++) {
            if (id as DataChannelId !== infos[id].channel) {
                throw new EnumInfoOutOfOrderError('DataChannel', id, infos[id].name);
            }
        }

        calculateInfos();
    }
}

export namespace OrderRequestType {
    export type Id = OrderRequestTypeId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderRequestTypeId]: Info };

    const infosObject: InfosObject = {
        Place: {
            id: OrderRequestTypeId.Place,
            name: 'new',
            displayId: StringId.OrderRequestTypeDisplay_Place,
        },
        Amend: {
            id: OrderRequestTypeId.Amend,
            name: 'amend',
            displayId: StringId.OrderRequestTypeDisplay_Amend,
        },
        Cancel: {
            id: OrderRequestTypeId.Cancel,
            name: 'cancel',
            displayId: StringId.OrderRequestTypeDisplay_Cancel,
        },
        Move: {
            id: OrderRequestTypeId.Move,
            name: 'move',
            displayId: StringId.OrderRequestTypeDisplay_Move,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderRequestTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderRequestType', outOfOrderIdx, 'ID:665220103248');
        }
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function idToJsonValue(id: Id) {
        return idToName(id);
    }

    export function tryNameToId(name: string) {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function tryJsonValueToId(value: string) {
        return tryNameToId(value);
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }
}

export namespace FeedStatus {
    export type Id = FeedStatusId;

    interface Info {
        readonly id: Id;
        readonly SubscribabilityExtentId: SubscribabilityExtentId;
        readonly badnessReasonId: Badness.ReasonId;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof FeedStatusId]: Info };

    const infosObject: InfosObject = {
        Initialising: {
            id: FeedStatusId.Initialising,
            SubscribabilityExtentId: SubscribabilityExtentId.None,
            badnessReasonId: Badness.ReasonId.FeedStatus_Initialising,
            displayId: StringId.FeedStatusDisplay_Initialising,
        },
        Active: {
            id: FeedStatusId.Active,
            SubscribabilityExtentId: SubscribabilityExtentId.All,
            badnessReasonId: Badness.ReasonId.NotBad,
            displayId: StringId.FeedStatusDisplay_Active,
        },
        Closed: {
            id: FeedStatusId.Closed,
            SubscribabilityExtentId: SubscribabilityExtentId.All,
            badnessReasonId: Badness.ReasonId.NotBad,
            displayId: StringId.FeedStatusDisplay_Closed,
        },
        Inactive: {
            id: FeedStatusId.Inactive,
            SubscribabilityExtentId: SubscribabilityExtentId.Some,
            badnessReasonId: Badness.ReasonId.NotBad,
            displayId: StringId.FeedStatusDisplay_Inactive,
        },
        Impaired: {
            id: FeedStatusId.Impaired,
            SubscribabilityExtentId: SubscribabilityExtentId.None,
            badnessReasonId: Badness.ReasonId.FeedStatus_Impaired,
            displayId: StringId.FeedStatusDisplay_Impaired,
        },
        Expired: {
            id: FeedStatusId.Expired,
            SubscribabilityExtentId: SubscribabilityExtentId.None,
            badnessReasonId: Badness.ReasonId.FeedStatus_Expired,
            displayId: StringId.FeedStatusDisplay_Expired,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FeedStatusId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('FeedStatus', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
        }
    }

    export function idToBadnessReasonId(id: Id) {
        return infos[id].badnessReasonId;
    }

    export function idToCorrectnessId(id: Id): CorrectnessId {
        return Badness.Reason.idToCorrectnessId(idToBadnessReasonId(id));
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function idToSubscribabilityExtentId(id: Id) {
        return infos[id].SubscribabilityExtentId;
    }
}

export namespace SubscribabilityExtent {
    export type Id = SubscribabilityExtentId;

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof SubscribabilityExtentId]: Info };

    const infosObject: InfosObject = {
        None: {
            id: SubscribabilityExtentId.None,
            displayId: StringId.SubscribabilityExtentDisplay_None,
        },
        Some: {
            id: SubscribabilityExtentId.Some,
            displayId: StringId.SubscribabilityExtentDisplay_Some,
        },
        All: {
            id: SubscribabilityExtentId.All,
            displayId: StringId.SubscribabilityExtentDisplay_All,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as SubscribabilityExtentId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('SubscribabilityExtentId', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
        }
    }

    export function isOnline(id: Id) {
        return infos[id].id !== SubscribabilityExtentId.None;
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function compare(left: Id, right: Id) {
        return compareInteger(left, right);
    }
}

export namespace PriceHistoryPeriod {
}

export namespace OrderType {
    export type Id = OrderTypeId;

    export const all = [
        OrderTypeId.Unknown,
        OrderTypeId.Market,
        OrderTypeId.Limit,
        OrderTypeId.MarketOnClose,
        OrderTypeId.WithOrWithout,
        OrderTypeId.LimitOrBetter,
        OrderTypeId.LimitWithOrWithout,
        OrderTypeId.OnBasis,
        OrderTypeId.OnClose,
        OrderTypeId.LimitOnClose,
        OrderTypeId.ForexMarket,
        OrderTypeId.PreviouslyQuoted,
        OrderTypeId.PreviouslyIndicated,
        OrderTypeId.ForexLimit,
        OrderTypeId.ForexSwap,
        OrderTypeId.ForexPreviouslyQuoted,
        OrderTypeId.Funari,
        OrderTypeId.MarketIfTouched,
        OrderTypeId.MarketToLimit,
        OrderTypeId.PreviousFundValuationPoint,
        OrderTypeId.NextFundValuationPoint,
        OrderTypeId.Best,
        OrderTypeId.MarketAtBest,
    ];

    interface Info {
        id: Id;
        name: string;
        display: string; // TODO:MED Needs to be displayId for i18n.
    }

    type InfosObject = { [id in keyof typeof OrderTypeId]: Info };

    const infosObject: InfosObject = {
        Unknown: {
            id: OrderTypeId.Unknown,
            name: 'Unknown',
            display: '?',
        },
        Market: {
            id: OrderTypeId.Market,
            name: 'Market',
            display: 'Market',
        },
        Limit: {
            id: OrderTypeId.Limit,
            name: 'Limit',
            display: 'Limit',
        },
        MarketOnClose: {
            id: OrderTypeId.MarketOnClose,
            name: 'MarketOnClose',
            display: 'Market On Close',
        },
        WithOrWithout: {
            id: OrderTypeId.WithOrWithout,
            name: 'WithOrWithout',
            display: 'With Or Without',
        },
        LimitOrBetter: {
            id: OrderTypeId.LimitOrBetter,
            name: 'LimitOrBetter',
            display: 'Limit Or Better',
        },
        LimitWithOrWithout: {
            id: OrderTypeId.LimitWithOrWithout,
            name: 'LimitWithOrWithout',
            display: 'Limit With Or Without',
        },
        OnBasis: {
            id: OrderTypeId.OnBasis,
            name: 'OnBasis',
            display: 'On Basis',
        },
        OnClose: {
            id: OrderTypeId.OnClose,
            name: 'OnClose',
            display: 'On Close',
        },
        LimitOnClose: {
            id: OrderTypeId.LimitOnClose,
            name: 'LimitOnClose',
            display: 'Limit On Close',
        },
        ForexMarket: {
            id: OrderTypeId.ForexMarket,
            name: 'ForexMarket',
            display: 'Forex Market',
        },
        PreviouslyQuoted: {
            id: OrderTypeId.PreviouslyQuoted,
            name: 'PreviouslyQuoted',
            display: 'Previously Quoted',
        },
        PreviouslyIndicated: {
            id: OrderTypeId.PreviouslyIndicated,
            name: 'PreviouslyIndicated',
            display: 'Previously Indicated',
        },
        ForexLimit: {
            id: OrderTypeId.ForexLimit,
            name: 'ForexLimit',
            display: 'Forex Limit',
        },
        ForexSwap: {
            id: OrderTypeId.ForexSwap,
            name: 'ForexSwap',
            display: 'Forex Swap',
        },
        ForexPreviouslyQuoted: {
            id: OrderTypeId.ForexPreviouslyQuoted,
            name: 'ForexPreviouslyQuoted',
            display: 'Forex Previously Quoted',
        },
        Funari: {
            id: OrderTypeId.Funari,
            name: 'Funari',
            display: 'Funari',
        },
        MarketIfTouched: {
            id: OrderTypeId.MarketIfTouched,
            name: 'MarketIfTouched',
            display: 'Market If Touched',
        },
        MarketToLimit: {
            id: OrderTypeId.MarketToLimit,
            name: 'MarketToLimit',
            display: 'Market To Limit',
        },
        PreviousFundValuationPoint: {
            id: OrderTypeId.PreviousFundValuationPoint,
            name: 'PreviousFundValuationPoint',
            display: 'Previous Fund Valuation Point',
        },
        NextFundValuationPoint: {
            id: OrderTypeId.NextFundValuationPoint,
            name: 'NextFundValuationPoint',
            display: 'Next Fund Valuation Point',
        },
        Best: {
            id: OrderTypeId.Best,
            name: 'Best',
            display: 'Best',
        },
        MarketAtBest: {
            id: OrderTypeId.MarketAtBest,
            name: 'MarketAtBest',
            display: 'Market At Best',
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TOrderTypeId', outOfOrderIdx, 'ID:689520121141');
        }
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function idArrayToName(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToName(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function tryNameToId(name: string) {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function idToJsonValue(id: Id) {
        return idToName(id);
    }

    export function tryJsonValueToId(value: string) {
        return tryNameToId(value);
    }

    export function idToDisplay(id: Id) {
        return infos[id].display;
    }

    export function idArrayToDisplay(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToDisplay(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function isLimit(id: Id) {
        return id === OrderTypeId.Limit;
    }

    export function tryJsonValueArrayToIdArray(value: readonly string[], ignoreInvalid: boolean): OrderTypeId[] | undefined {
        const valueCount = value.length;
        const result = new Array<OrderTypeId>(valueCount);
        let resultCount = 0;
        for (let i = 0; i < valueCount; i++) {
            const jsonValue = value[i];
            const id = tryJsonValueToId(jsonValue);
            if (id !== undefined) {
                result[resultCount++] = id;
            } else {
                if (!ignoreInvalid) {
                    return undefined;
                }
            }
        }
        result.length = resultCount;
        return result;
    }

}

export namespace TOrderAlgo {
}

export namespace TOrderAcception {
}

export namespace IvemClass {
    export type Id = IvemClassId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof IvemClassId]: Info };

    const infosObject: InfosObject = {
        Unknown: {
            id: IvemClassId.Unknown,
            name: 'Equity',
            displayId: StringId.IvemClass_Unknown,
        },
        Market: {
            id: IvemClassId.Market,
            name: 'Option',
            displayId: StringId.IvemClass_Market,
        },
        ManagedFund: {
            id: IvemClassId.ManagedFund,
            name: 'ManagedFund',
            displayId: StringId.IvemClass_ManagedFund,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as IvemClassId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('SecurityClassId', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace TSecurityStatusNote {
}

export namespace TTradeRecordType {
}

export namespace TradeFlag {
    export type Id = TradeFlagId;

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof TradeFlagId]: Info };

    const infosObject: InfosObject = {
        OffMarket: {
            id: TradeFlagId.OffMarket,
            displayId: StringId.TradeAttribute_OffMarketTrade,
        },
        Placeholder: {
            id: TradeFlagId.Placeholder,
            displayId: StringId.TradeAttribute_PlaceholderTrade,
        },
        Cancel: {
            id: TradeFlagId.Cancel,
            displayId: StringId.TradeAttribute_Cancel,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function StaticConstructor() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: number) => info.id !== index as TradeFlagId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TradeFlagId', outOfOrderIdx, idToDisplay(outOfOrderIdx));
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}

export namespace TradeAffects {
    export type Id = TradeAffectsId;
    export const allIds = [
        TradeAffectsId.Price,
        TradeAffectsId.Volume,
        TradeAffectsId.Vwap,
    ];

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof TradeAffectsId]: Info };

    const infosObject: InfosObject = {
        Price: {
            id: TradeAffectsId.Price,
            displayId: StringId.TradeAffects_Price,
        },
        Volume: {
            id: TradeAffectsId.Volume,
            displayId: StringId.TradeAffects_Volume,
        },
        Vwap: {
            id: TradeAffectsId.Vwap,
            displayId: StringId.TradeAffects_Vwap,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function StaticConstructor() {
        for (let id = 0; id < idCount; id++) {
            const info = infos[id];
            if (id as TradeAffectsId !== info.id) {
                throw new EnumInfoOutOfOrderError('TradeAffectsId', id, idToDisplay(id));
            }
            if (id as TradeAffectsId !== allIds[id]) {
                throw new AssertInternalError('AllTradeAffectsId', idToDisplay(id));
            }
        }
        const outOfOrderIdx = infos.findIndex((info: Info, index: number) => info.id !== index as TradeAffectsId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TradeAffectsId', outOfOrderIdx, idToDisplay(outOfOrderIdx));
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function idArrayContainsVolumeOrPrice(ids: readonly TradeAffectsId[]) {
        for (const id of ids) {
            if (id === TradeAffectsId.Price || id === TradeAffectsId.Volume) {
                return true;
            }
        }
        return false;
    }
}

export namespace Movement {
    export type Id = MovementId;

    export const all = [
        MovementId.None,
        MovementId.Up,
        MovementId.Down,
    ];

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof MovementId]: Info };

    const infosObject: InfosObject = {
        None: {
            id: MovementId.None,
            displayId: StringId.Trend_None,
        },
        Up: {
            id: MovementId.Up,
            displayId: StringId.Trend_Up,
        },
        Down: {
            id: MovementId.Down,
            displayId: StringId.Trend_Down,
        },
    };

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: number) => info.id !== index as MovementId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('MovementId', outOfOrderIdx, idToDisplay(outOfOrderIdx));
        }
    }

    export function idToDisplay(id: Id): string {
        return Strings[infos[id].displayId];
    }
}

export namespace TSecurityGicsSector {
}

export namespace TSecurityGicsIndustryGroup {
}

export namespace TNewsField {
}

export namespace TNewsItemDocMediaType {
}

export namespace TNewsItemSensitivity {
}

export namespace TNewsReportType {
}

export namespace TTMyxSector {
}

export namespace OrderRequestAlgorithm {
    export type Id = OrderRequestAlgorithmId;

    interface Info {
        readonly id: Id;
        readonly name: string;
    }

    type InfosObject = { [id in keyof typeof OrderRequestAlgorithmId]: Info };

    const infosObject: InfosObject = {
        Market: {
            id: OrderRequestAlgorithmId.Market,
            name: 'Market',
        },
        BestMarket: {
            id: OrderRequestAlgorithmId.BestMarket,
            name: 'BestMarket',
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderRequestAlgorithmId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderRequestAlgorithmId', outOfOrderIdx, 'ID:749520133509');
        }
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace OrderRequestFlag {
    export type Id = OrderRequestFlagId;

    interface Info {
        readonly id: Id;
        readonly name: string;
    }

    type InfosObject = { [id in keyof typeof OrderRequestFlagId]: Info };

    const infosObject: InfosObject = {
        Pds: {
            id: OrderRequestFlagId.Pds,
            name: 'Pds',
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderRequestFlagId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderRequestFlagId', outOfOrderIdx, 'ID:764120144910');
        }
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function arrayToString(values: Id[]): string {
        return values
            .map(v => idToName(v))
            .join(',');
    }

    export function tryStringToArray(value: string): Id[] {
        const result = value
            .split(',')
            .map(s => tryNameToId(s))
            .filter(v => v !== undefined);

        return result;
    }
}


export namespace PublisherSubscriptionDataType {
    export type Id = PublisherSubscriptionDataTypeId;

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof PublisherSubscriptionDataTypeId]: Info };

    const infosObject: InfosObject = {
        Asset: {
            id: PublisherSubscriptionDataTypeId.Asset,
            displayId: StringId.PublisherSubscriptionDataTypeDisplay_Asset,
        },
        Trades: {
            id: PublisherSubscriptionDataTypeId.Trades,
            displayId: StringId.PublisherSubscriptionDataTypeDisplay_Trades,
        },
        Depth: {
            id: PublisherSubscriptionDataTypeId.Depth,
            displayId: StringId.PublisherSubscriptionDataTypeDisplay_Depth,
        },
        DepthFull: {
            id: PublisherSubscriptionDataTypeId.DepthFull,
            displayId: StringId.PublisherSubscriptionDataTypeDisplay_DepthFull,
        },
        DepthShort: {
            id: PublisherSubscriptionDataTypeId.DepthShort,
            displayId: StringId.PublisherSubscriptionDataTypeDisplay_DepthShort,
        },
    };

    const infos = Object.values(infosObject);
    export const idCount = infos.length;

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as PublisherSubscriptionDataTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('PublisherSubscriptionDataTypeId', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }
}

export namespace OrderPriceUnitType {
    export type Id = OrderPriceUnitTypeId;
    export const nullId = OrderPriceUnitTypeId.Units; // not really null - just used as placeholder

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly display: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderPriceUnitTypeId]: Info };

    const infosObject: InfosObject = {
        Currency: {
            id: OrderPriceUnitTypeId.Currency,
            name: 'Currency',
            display: StringId.OrderPriceUnitTypeDisplay_Currency,
        },
        Units: {
            id: OrderPriceUnitTypeId.Units,
            name: 'Units',
            display: StringId.OrderPriceUnitTypeDisplay_Units,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderPriceUnitTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderPriceUnitType', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].display;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace OrderRouteAlgorithm {
    export type Id = OrderRouteAlgorithmId;

    interface Info {
        id: Id;
        name: string;
        display: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderRouteAlgorithmId]: Info };

    const infosObject: InfosObject = {
        Market: {
            id: OrderRouteAlgorithmId.Market,
            name: 'Market',
            display: StringId.OrderRouteAlgorithmDisplay_Market,
        },
        BestMarket: {
            id: OrderRouteAlgorithmId.BestMarket,
            name: 'BestMarket',
            display: StringId.OrderRouteAlgorithmDisplay_BestMarket,
        },
        Fix: {
            id: OrderRouteAlgorithmId.Fix,
            name: 'Fix',
            display: StringId.OrderRouteAlgorithmDisplay_Fix,
        }
    } as const;

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderRouteAlgorithmId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderRouteAlgorithm', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id) {
        return infos[id].display;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id) {
        return compareInteger(left, right);
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function tryNameToId(name: string) {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function idToJsonValue(id: Id) {
        return idToName(id);
    }

    export function tryJsonValueToId(value: string) {
        return tryNameToId(value);
    }
}

export namespace TrailingStopLossOrderConditionType {
    export type Id = TrailingStopLossOrderConditionTypeId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly display: StringId;
    }

    type InfosObject = { [id in keyof typeof TrailingStopLossOrderConditionTypeId]: Info };

    const infosObject: InfosObject = {
        Price: {
            id: TrailingStopLossOrderConditionTypeId.Price,
            name: 'Price',
            display: StringId.TrailingStopLossOrderConditionTypeDisplay_Price,
        },
        Percent: {
            id: TrailingStopLossOrderConditionTypeId.Percent,
            name: 'Percent',
            display: StringId.TrailingStopLossOrderConditionTypeDisplay_Percent,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as TrailingStopLossOrderConditionTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('TrailingStopLossOrderConditionType', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].display;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace OrderCommandResult {
    export type Id = OrderRequestResultId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderRequestResultId]: Info };

    const infosObject: InfosObject = {
        Success: {
            id: OrderRequestResultId.Success,
            name: 'Success',
            displayId: StringId.OrderRequestResultDisplay_Success,
        },
        Error: {
            id: OrderRequestResultId.Error,
            name: 'Error',
            displayId: StringId.OrderRequestResultDisplay_Error,
        },
        Incomplete: {
            id: OrderRequestResultId.Incomplete,
            name: 'Incomplete',
            displayId: StringId.OrderRequestResultDisplay_Incomplete,
        },
        Invalid: {
            id: OrderRequestResultId.Invalid,
            name: 'Invalid',
            displayId: StringId.OrderRequestResultDisplay_Invalid,
        },
        Rejected: {
            id: OrderRequestResultId.Rejected,
            name: 'Rejected',
            displayId: StringId.OrderRequestResultDisplay_Rejected,
        }
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderRequestResultId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderCommandResultId', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace OrderPadStatus {
    export type Id = OrderPadStatusId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly display: string; // #i18n: TODO:MED Convert to stringId
    }

    type InfosObject = { [id in keyof typeof OrderPadStatusId]: Info };

    const infosObject: InfosObject = {
        AllFieldsOk: {
            id: OrderPadStatusId.AllFieldsOk,
            name: 'AllFieldsOk',
            display: 'All Fields Ok',
        },
        InvalidFields: {
            id: OrderPadStatusId.InvalidFields,
            name: 'InvalidFields',
            display: 'Invalid Fields',
        },
        MissingFields: {
            id: OrderPadStatusId.MissingFields,
            name: 'MissingFields',
            display: 'Missing Fields',
        },
        DataPending: {
            id: OrderPadStatusId.DataPending,
            name: 'DataPending',
            display: 'Data Pending',
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderPadStatusId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderPadStatusId', outOfOrderIdx, infos[outOfOrderIdx].display);
        }
    }

    export function idToDisplay(id: Id): string {
        return infos[id].display;
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}

export namespace OrderTradeType {
    export type Id = OrderTradeTypeId;

    export const all = [
        OrderTradeTypeId.Buy,
        OrderTradeTypeId.Sell,
        OrderTradeTypeId.IntraDayShortSell,
        OrderTradeTypeId.RegulatedShortSell,
        OrderTradeTypeId.ProprietaryShortSell,
        OrderTradeTypeId.ProprietaryDayTrade,
    ];

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly orderSideId: OrderSideId;
        readonly shortSell: boolean;
        readonly displayId: StringId;
        readonly abbreviationId: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderTradeTypeId]: Info };

    const infosObject: InfosObject = {
        Buy: {
            id: OrderTradeTypeId.Buy,
            name: 'Buy',
            orderSideId: OrderSideId.Bid,
            shortSell: false,
            displayId: StringId.SideDisplay_Buy,
            abbreviationId: StringId.SideAbbreviation_Buy,
        },
        Sell: {
            id: OrderTradeTypeId.Sell,
            name: 'Sell',
            orderSideId: OrderSideId.Ask,
            shortSell: false,
            displayId: StringId.SideDisplay_Sell,
            abbreviationId: StringId.SideAbbreviation_Sell,
        },
        IntraDayShortSell: {
            id: OrderTradeTypeId.IntraDayShortSell,
            name: 'IntraDayShortSell',
            orderSideId: OrderSideId.Ask,
            shortSell: true,
            displayId: StringId.SideDisplay_IntraDayShortSell,
            abbreviationId: StringId.SideAbbreviation_IntraDayShortSell,
        },
        RegulatedShortSell: {
            id: OrderTradeTypeId.RegulatedShortSell,
            name: 'RegulatedShortSell',
            orderSideId: OrderSideId.Ask,
            shortSell: true,
            displayId: StringId.SideDisplay_RegulatedShortSell,
            abbreviationId: StringId.SideAbbreviation_RegulatedShortSell,
        },
        ProprietaryShortSell: {
            id: OrderTradeTypeId.ProprietaryShortSell,
            name: 'ProprietaryShortSell',
            orderSideId: OrderSideId.Ask,
            shortSell: true,
            displayId: StringId.SideDisplay_ProprietaryShortSell,
            abbreviationId: StringId.SideAbbreviation_ProprietaryShortSell,
        },
        ProprietaryDayTrade: {
            id: OrderTradeTypeId.ProprietaryDayTrade,
            name: 'ProprietaryDayTrade',
            orderSideId: OrderSideId.Ask,
            shortSell: true,
            displayId: StringId.SideDisplay_ProprietaryDayTrade,
            abbreviationId: StringId.SideAbbreviation_ProprietaryDayTrade,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderTradeTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderTradeType', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function idArrayToDisplay(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToDisplay(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function idToAbbreviationId(id: Id): StringId {
        return infos[id].abbreviationId;
    }

    export function idToAbbreviation(id: Id): string {
        return Strings[idToAbbreviationId(id)];
    }

    export function idArrayToAbbreviation(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToAbbreviation(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function idToJsonValue(id: Id): string {
        return idToName(id);
    }

    export function idToOrderSideId(id: Id) {
        return infos[id].orderSideId;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function tryJsonValueToId(json: string): Id | undefined {
        return tryNameToId(json);
    }

    export function idIsShortSell(id: Id): boolean {
        return infos[id].shortSell;
    }

    export function tryJsonValueArrayToIdArray(value: readonly string[], ignoreInvalid: boolean): OrderTradeTypeId[] | undefined {
        const valueCount = value.length;
        const result = new Array<OrderTradeTypeId>(valueCount);
        let resultCount = 0;
        for (let i = 0; i < valueCount; i++) {
            const jsonValue = value[i];
            const id = tryJsonValueToId(jsonValue);
            if (id !== undefined) {
                result[resultCount++] = id;
            } else {
                if (!ignoreInvalid) {
                    return undefined;
                }
            }
        }
        result.length = resultCount;
        return result;
    }

    // export function calculateFromSideExchangeShortSellTypeInstructions(
    //     orderSideId: OrderSideId,
    //     exchangeId: ExchangeId,
    //     shortSellTypeId: OrderShortSellTypeId | undefined,
    //     instructionIds: OrderInstructionId[],
    // ): OrderExtendedSideId {
    //     const isAsk = orderSideId === OrderSideId.Ask;
    //     if (!isAsk || exchangeId !== ExchangeId.Myx) {
    //         if (shortSellTypeId !== undefined) {
    //             throw new AssertInternalError(
    //                 'DTOESCFOSIAEIASSTI113136',
    //                 `${ExchangeInfo.idToAbbreviatedDisplay(exchangeId)}, ${isAsk ? 'Sell': 'Buy'}`
    //             );
    //         } else {
    //             return isAsk ? OrderExtendedSideId.Sell : OrderExtendedSideId.Buy;
    //         }
    //     } else {
    //         // isAsk is always true
    //         switch (shortSellTypeId) {
    //             case undefined: return OrderExtendedSideId.Sell;
    //             case OrderShortSellTypeId.ShortSellExempt:
    //                 throw new AssertInternalError('DTOESCFOSIAEIASSTI113137', ExchangeInfo.idToAbbreviatedDisplay(exchangeId));
    //             case OrderShortSellTypeId.ShortSell: {
    //                 const shortSellInstructionIds = getUniqueElementArraysOverlapElements(
    //                     instructionIds,
    //                     [
    //                         ExchangeInfo.Myx.InstructionId.IntraDayShortSell,
    //                         ExchangeInfo.Myx.InstructionId.RegulatedShortSell,
    //                         ExchangeInfo.Myx.InstructionId.ProprietaryShortSell,
    //                         ExchangeInfo.Myx.InstructionId.ProprietaryDayTrade,
    //                     ]
    //                 );
    //                 switch (shortSellInstructionIds.length) {
    //                     case 0: return OrderExtendedSideId.Sell;
    //                     case 1: {
    //                         switch (shortSellInstructionIds[0]) {
    //                             case OrderInstructionId.IDSS: return OrderExtendedSideId.IntraDayShortSell;
    //                             case OrderInstructionId.RSS: return OrderExtendedSideId.RegulatedShortSell;
    //                             case OrderInstructionId.PSS: return OrderExtendedSideId.ProprietaryShortSell;
    //                             case OrderInstructionId.PDT: return OrderExtendedSideId.ProprietaryDayTrade;
    //                             default: return OrderExtendedSideId.Sell;
    //                         }
    //                     }
    //                     default:
    //                         throw new AssertInternalError('DTOESCFOSIAEIASSTI113138', ExchangeInfo.idToAbbreviatedDisplay(exchangeId));
    //                 }
    //             }
    //             default: {
    //                 throw new AssertInternalError('DTOESCFOSIAEIASSTI113137', ExchangeInfo.idToAbbreviatedDisplay(exchangeId));
    //             }
    //         }
    //     }
    // }

    export function calculateFromSideExchangeShortSellInstuctions(
        orderSideId: OrderSideId,
        zenithExchangeCode: string,
        shortSellTypeId: OrderShortSellTypeId | undefined,
        instructionIds: OrderInstructionId[],
    ): OrderTradeTypeId {
        const isAsk = orderSideId === OrderSideId.Ask;
        if (!isAsk || zenithExchangeCode !== ZenithProtocolCommon.KnownExchange.Myx as string) {
            if (shortSellTypeId !== undefined) {
                throw new AssertInternalError(
                    'CESIUSSTI40498',
                    `${zenithExchangeCode}, ${isAsk ? 'Sell': 'Buy'}`
                );
            } else {
                return isAsk ? OrderTradeTypeId.Sell : OrderTradeTypeId.Buy;
            }
        } else {
            // isAsk is always true
            switch (shortSellTypeId) {
                case undefined: return OrderTradeTypeId.Sell;
                case OrderShortSellTypeId.ShortSellExempt:
                    throw new AssertInternalError('CESISSTISSE40498', zenithExchangeCode);
                case OrderShortSellTypeId.ShortSell: {
                    const shortSellInstructionIds = getUniqueElementArraysOverlapElements(
                        instructionIds,
                        [
                            OrderInstruction.Myx.IntraDayShortSell,
                            OrderInstruction.Myx.RegulatedShortSell,
                            OrderInstruction.Myx.ProprietaryShortSell,
                            OrderInstruction.Myx.ProprietaryDayTrade,
                        ]
                    );
                    switch (shortSellInstructionIds.length) {
                        case 0: return OrderTradeTypeId.Sell;
                        case 1: {
                            switch (shortSellInstructionIds[0]) {
                                case OrderInstructionId.IDSS: return OrderTradeTypeId.IntraDayShortSell;
                                case OrderInstructionId.RSS: return OrderTradeTypeId.RegulatedShortSell;
                                case OrderInstructionId.PSS: return OrderTradeTypeId.ProprietaryShortSell;
                                case OrderInstructionId.PDT: return OrderTradeTypeId.ProprietaryDayTrade;
                                default: return OrderTradeTypeId.Sell;
                            }
                        }
                        default:
                            throw new AssertInternalError('CESISSTISSD40498', zenithExchangeCode);
                    }
                }
                default: {
                    throw new AssertInternalError('CESISSTID40498', zenithExchangeCode);
                }
            }
        }
    }

    export interface OrderSideAndShortSellTypeAndInstructions {
        readonly orderSideId: OrderSideId;
        readonly shortSellTypeId: OrderShortSellTypeId | undefined;
        readonly instructionIds: OrderInstructionId[];
    }

    export function calculateOrderSideAndShortSellTypeAndInstructions(
        orderTradeTypeId: OrderTradeTypeId,
        zenithExchangeCode: string
    ): OrderSideAndShortSellTypeAndInstructions {
        const orderSideId = OrderTradeType.idToOrderSideId(orderTradeTypeId);
        let shortSellTypeId: OrderShortSellTypeId | undefined;
        let instructionIds: OrderInstructionId[];
        if (!OrderTradeType.idIsShortSell(orderTradeTypeId)) {
            instructionIds = [];
        } else {
            switch (zenithExchangeCode as ZenithProtocolCommon.KnownExchange) {
                case ZenithProtocolCommon.KnownExchange.Myx: {
                    shortSellTypeId = OrderShortSellTypeId.ShortSell;
                    switch (orderTradeTypeId) {
                        case OrderTradeTypeId.IntraDayShortSell: {
                            instructionIds = [OrderInstruction.Myx.IntraDayShortSell];
                            break;
                        }
                        case OrderTradeTypeId.RegulatedShortSell: {
                            instructionIds = [OrderInstruction.Myx.RegulatedShortSell];
                            break;
                        }
                        case OrderTradeTypeId.ProprietaryShortSell: {
                            instructionIds = [OrderInstruction.Myx.ProprietaryShortSell];
                            break;
                        }
                        case OrderTradeTypeId.ProprietaryDayTrade: {
                            instructionIds = [OrderInstruction.Myx.ProprietaryDayTrade];
                            break;
                        }
                        default:
                            throw new AssertInternalError('COSASSTAMYXI22244');
                    }
                    break;
                }
                default:
                    throw new AssertInternalError('COSASSTADEFI22244');
            }
        }

        const result: OrderSideAndShortSellTypeAndInstructions = {
            orderSideId,
            shortSellTypeId,
            instructionIds,
        }

        return result;
    }
}

export namespace OrderSide {
    export type Id = OrderSideId;
    export const nullId = OrderSideId.Ask; // not really null - just used as placeholder

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly display: StringId;
        readonly baseOrderTradeTypeId: OrderTradeTypeId;
    }

    type InfosObject = { [id in keyof typeof OrderSideId]: Info };

    const infosObject: InfosObject = {
        Bid: {
            id: OrderSideId.Bid,
            name: 'Bid',
            display: StringId.OrderSideDisplay_Bid,
            baseOrderTradeTypeId: OrderTradeTypeId.Buy,
        },
        Ask: {
            id: OrderSideId.Ask,
            name: 'Ask',
            display: StringId.OrderSideDisplay_Ask,
            baseOrderTradeTypeId: OrderTradeTypeId.Sell,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderSideId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderSide', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].display;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return compareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function idToJson(id: Id): string {
        return idToName(id);
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }

    export function tryJsonToId(json: string): Id | undefined {
        return tryNameToId(json);
    }

    export function idToBaseOrderTradeTypeId(id: Id) {
        return infos[id].baseOrderTradeTypeId;
    }
}

export namespace OrderInstruction {
    export namespace Myx {
        export const ProprietaryShortSell = OrderInstructionId.PSS;
        export const IntraDayShortSell = OrderInstructionId.IDSS;
        export const ProprietaryDayTrade = OrderInstructionId.PDT;
        export const RegulatedShortSell = OrderInstructionId.RSS;
    }
}

export namespace SymbolField {
    export type Id = SymbolFieldId;

    export const codeJsonValue = 'Code';
    export const nameJsonValue = 'Name';
    export const shortJsonValue = 'Short';
    export const longJsonValue = 'Long';
    export const tickerJsonValue = 'Ticker';
    export const gicsJsonValue = 'Gics';
    export const isinJsonValue = 'Isin';
    export const baseJsonValue = 'Base';
    export const ricJsonValue = 'Ric';

    interface Info {
        id: Id;
        jsonValue: string;
        displayId: StringId;
        descriptionId: StringId;
    }

    type InfoObject = { [id in keyof typeof SymbolFieldId]: Info };

    const infoObject: InfoObject = {
        Code: {
            id: SymbolFieldId.Code,
            jsonValue: codeJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Code,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Code,
        },
        Name: {
            id: SymbolFieldId.Name,
            jsonValue: nameJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Name,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Name,
        },
        Short: {
            id: SymbolFieldId.Short,
            jsonValue: shortJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Short,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Short,
        },
        Long: {
            id: SymbolFieldId.Long,
            jsonValue: longJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Long,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Long,
        },
        Ticker: {
            id: SymbolFieldId.Ticker,
            jsonValue: tickerJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Ticker,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Ticker,
        },
        Gics: {
            id: SymbolFieldId.Gics,
            jsonValue: gicsJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Gics,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Gics,
        },
        Isin: {
            id: SymbolFieldId.Isin,
            jsonValue: isinJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Isin,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Isin,
        },
        Base: {
            id: SymbolFieldId.Base,
            jsonValue: baseJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Base,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Base,
        },
        Ric: {
            id: SymbolFieldId.Ric,
            jsonValue: ricJsonValue,
            displayId: StringId.QuerySymbolsDataDefinitionFieldDisplay_Ric,
            descriptionId: StringId.QuerySymbolsDataDefinitionFieldDescription_Ric,
        },
    } as const;

    export const idCount = Object.keys(infoObject).length;
    const infos = Object.values(infoObject);
    export const allIds: readonly SymbolFieldId[] = infos.map(info => info.id);

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToJsonValue(id: Id) {
        return infos[id].jsonValue;
    }

    export function tryJsonValueToId(jsonValue: string) {
        for (let id = 0; id < idCount; id++) {
            if (infos[id].jsonValue === jsonValue) {
                return infos[id].id;
            }
        }
        return undefined;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function idArrayToDisplay(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToDisplay(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function idToDescriptionId(id: Id) {
        return infos[id].descriptionId;
    }

    export function idToDescription(id: Id) {
        return Strings[idToDescriptionId(id)];
    }

    export function idArrayToJsonValue(idArray: readonly Id[]) {
        const count = idArray.length;
        const stringArray = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = idArray[i];
            stringArray[i] = idToJsonValue(id);
        }
        return CommaText.fromStringArray(stringArray);
    }

    export function tryJsonValueToIdArray(value: string) {
        const toStringArrayResult = CommaText.tryToStringArray(value);
        if (toStringArrayResult.isErr()) {
            return undefined;
        } else {
            const stringArray = toStringArrayResult.value;
            const count = stringArray.length;
            const result = new Array<Id>(count);
            for (let i = 0; i < count; i++) {
                const jsonValue = stringArray[i];
                const id = tryJsonValueToId(jsonValue);
                if (id === undefined) {
                    return undefined;
                } else {
                    result[i] = id;
                }
            }

            return result;
        }
    }

    export function tryJsonValueArrayToIdArray(value: readonly string[], ignoreInvalid: boolean): SymbolFieldId[] | undefined {
        const valueCount = value.length;
        const result = new Array<SymbolFieldId>(valueCount);
        let resultCount = 0;
        for (let i = 0; i < valueCount; i++) {
            const jsonValue = value[i];
            const id = tryJsonValueToId(jsonValue);
            if (id !== undefined) {
                result[resultCount++] = id;
            } else {
                if (!ignoreInvalid) {
                    return undefined;
                }
            }
        }
        result.length = resultCount;
        return result;
    }

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as SymbolFieldId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('SymbolFieldId', outOfOrderIdx, idToDisplay(outOfOrderIdx));
        }
    }

}

/*export namespace EquityOrderType {
    export type Id = EquityOrderTypeId;

    class Info {
        constructor(
            public id: Id,
            public name: string,
            public display: StringId,
        ) { }
    }

    type InfosObject = { [id in keyof typeof EquityOrderTypeId]: Info };

    const infosObject: InfosObject = {
        Limit: {
            id: EquityOrderTypeId.Limit,
            name: 'Limit',
            display: StringId.EquityOrderTypeDisplay_Limit,
        },
        Best: {
            id: EquityOrderTypeId.Best,
            name: 'Best',
            display: StringId.EquityOrderTypeDisplay_Best,
        },
        Market: {
            id: EquityOrderTypeId.Market,
            name: 'Market',
            display: StringId.EquityOrderTypeDisplay_Market,
        },
        MarketToLimit: {
            id: EquityOrderTypeId.MarketToLimit,
            name: 'MarketToLimit',
            display: StringId.EquityOrderTypeDisplay_MarketToLimit,
        },
        Unknown: {
            id: EquityOrderTypeId.Unknown,
            name: 'EquityOrderType',
            display: StringId.EquityOrderTypeDisplay_Unknown,
        }
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('EquityOrderType', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].display;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id): Integer {
        return CompareInteger(left, right);
    }

    export function idToName(id: Id): string {
        return infos[id].name;
    }

    export function tryNameToId(name: string): Id | undefined {
        const index = infos.findIndex(info => info.name === name);
        return index >= 0 ? infos[index].id : undefined;
    }
}*/


/*export namespace EikonMarketCode {
    export type Id = EikonMarketCodeId;

    export function isEikonMarketCode(value: string): value is EikonMarketCodeId {
        switch (value) {
            case EikonMarketCodeId.AsxTradeMatch:
            case EikonMarketCodeId.Nzx:
            case EikonMarketCodeId.ChixAustLimit:
            case EikonMarketCodeId.AsxCxa:
                return true;
            default:
                return false;
        }
    }
}*/

export namespace DepthStyle {
    export type Id = DepthStyleId;

    interface Info {
        readonly id: Id;
    }

    type InfosObject = { [id in keyof typeof DepthStyleId]: Info };

    const infosObject: InfosObject = {
        Full: {
            id: DepthStyleId.Full,
        },
        Short: {
            id: DepthStyleId.Short,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as DepthStyleId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('DepthStyleId', outOfOrderIdx, infos[outOfOrderIdx].id.toString(10));
        }
    }

    export function compareId(left: Id, right: Id) {
        return compareInteger(left, right);
    }
}

export namespace ChartInterval {
    export type Id = ChartIntervalId;

    interface Info {
        readonly id: Id;
        readonly jsonValue: string;
        readonly milliseconds: Integer;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof ChartIntervalId]: Info };

    const infosObject: InfosObject = {
        OneMinute: {
            id: ChartIntervalId.OneMinute,
            jsonValue: 'OneMinute',
            milliseconds: 1 * mSecsPerMin,
            displayId: StringId.ChartIntervalDisplay_OneMinute,
        },
        FiveMinutes: {
            id: ChartIntervalId.FiveMinutes,
            jsonValue: 'FiveMinutes',
            milliseconds: 5 * mSecsPerMin,
            displayId: StringId.ChartIntervalDisplay_FiveMinutes,
        },
        FifteenMinutes: {
            id: ChartIntervalId.FifteenMinutes,
            jsonValue: 'FifteenMinutes',
            milliseconds: 15 * mSecsPerMin,
            displayId: StringId.ChartIntervalDisplay_FifteenMinutes,
        },
        ThirtyMinutes: {
            id: ChartIntervalId.ThirtyMinutes,
            jsonValue: 'ThirtyMinutes',
            milliseconds: 30 * mSecsPerMin,
            displayId: StringId.ChartIntervalDisplay_ThirtyMinutes,
        },
        OneDay: {
            id: ChartIntervalId.OneDay,
            jsonValue: 'OneDay',
            milliseconds: 1 * mSecsPerDay,
            displayId: StringId.ChartIntervalDisplay_OneDay,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ChartIntervalId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('ChartPeriodId', outOfOrderIdx, infos[outOfOrderIdx].jsonValue);
        }
    }

    export function idToMilliseconds(id: Id) {
        return infos[id].milliseconds;
    }

    export function trySecondsToId(value: Integer) {
        for (let id = 0; id < idCount; id++) {
            if (infos[id].milliseconds === value) {
                return id;
            }
        }
        return undefined;
    }

    export function trySecondsModulus0ToHighestId(value: Integer) {
        let result: Id | undefined;
        let resultSeconds = -1;
        for (let id = idCount; id >= 0; id--) {
            const seconds = infos[id].milliseconds;
            const modulus = value % seconds;
            if (modulus === 0) {
                if (seconds > resultSeconds) {
                    result = id;
                    resultSeconds = seconds;
                }
            }
        }
        return result;
    }

    export function idToDisplayId(id: Id) {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id) {
        return Strings[idToDisplayId(id)];
    }

    export function compareId(left: Id, right: Id) {
        return compareInteger(left, right);
    }

    export function idToJsonValue(id: Id) {
        return infos[id].jsonValue;
    }

    export function tryJsonValueToId(value: string) {
        const upperValue = value.toUpperCase();
        const idx = infos.findIndex((info: Info) => info.jsonValue.toUpperCase() === upperValue);
        return idx >= 0 ? infos[idx].id : undefined;
    }
}

export namespace ZenithPublisherState {
    export type Id = ZenithPublisherStateId;

    interface Info {
        readonly id: Id;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof ZenithPublisherStateId]: Info };

    const infosObject: InfosObject = {
        Initialise: {
            id: ZenithPublisherStateId.Initialise,
            displayId: StringId.ZenithPublisherStateDisplay_Initialise,
        },
        ReconnectDelay: {
            id: ZenithPublisherStateId.ReconnectDelay,
            displayId: StringId.ZenithPublisherStateDisplay_ReconnectDelay,
        },
        AccessTokenWaiting: {
            id: ZenithPublisherStateId.AccessTokenWaiting,
            displayId: StringId.ZenithPublisherStateDisplay_AccessTokenWaiting,
        },
        SocketOpen: {
            id: ZenithPublisherStateId.SocketOpen,
            displayId: StringId.ZenithPublisherStateDisplay_SocketOpen,
        },
        AuthFetch: {
            id: ZenithPublisherStateId.AuthFetch,
            displayId: StringId.ZenithPublisherStateDisplay_AuthFetch,
        },
        AuthActive: {
            id: ZenithPublisherStateId.AuthActive,
            displayId: StringId.ZenithPublisherStateDisplay_AuthActive,
        },
        AuthUpdate: {
            id: ZenithPublisherStateId.AuthUpdate,
            displayId: StringId.ZenithPublisherStateDisplay_AuthUpdate,
        },
        SocketClose: {
            id: ZenithPublisherStateId.SocketClose,
            displayId: StringId.ZenithPublisherStateDisplay_SocketClose,
        },
        Finalised: {
            id: ZenithPublisherStateId.Finalised,
            displayId: StringId.ZenithPublisherStateDisplay_Finalised,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ZenithPublisherStateId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('ZenithPublisherState', outOfOrderIdx, idToDisplay(infos[outOfOrderIdx].id));
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}

export namespace ZenithPublisherReconnectReason {
    export type Id = ZenithPublisherReconnectReasonId;

    interface Info {
        id: Id;
        displayId: StringId;
        normal: boolean;
    }

    type InfosObject = { [id in keyof typeof ZenithPublisherReconnectReasonId]: Info };

    const infosObject: InfosObject = {
        NewEndpoints: {
            id: ZenithPublisherReconnectReasonId.NewEndpoints,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_NewEndpoints,
            normal: true,
        },
        PassportTokenFailure: {
            id: ZenithPublisherReconnectReasonId.PassportTokenFailure,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_PassportTokenFailure,
            normal: false,
        },
        SocketConnectingError: {
            id: ZenithPublisherReconnectReasonId.SocketConnectingError,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_SocketConnectingError,
            normal: false,
        },
        AuthRejected: {
            id: ZenithPublisherReconnectReasonId.AuthRejected,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_AuthRejected,
            normal: false,
        },
        AuthExpired: {
            id: ZenithPublisherReconnectReasonId.AuthExpired,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_AuthExpired,
            normal: false,
        },
        UnexpectedSocketClose: {
            id: ZenithPublisherReconnectReasonId.UnexpectedSocketClose,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_UnexpectedSocketClose,
            normal: false,
        },
        SocketClose: {
            id: ZenithPublisherReconnectReasonId.SocketClose,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_SocketClose,
            normal: true,
        },
        Timeout: {
            id: ZenithPublisherReconnectReasonId.Timeout,
            displayId: StringId.ZenithPublisherReconnectReasonDisplay_Timeout,
            normal: false,
        },
    };

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ZenithPublisherReconnectReasonId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('ZenithPublisherReconnectReason', outOfOrderIdx, idToDisplay(infos[outOfOrderIdx].id));
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }

    export function idToNormal(id: Id): boolean {
        return infos[id].normal;
    }
}

export namespace OrderRequestErrorCode {
    export type Id = OrderRequestErrorCodeId;

    interface Info {
        id: Id;
        displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof OrderRequestErrorCodeId]: Info };

    const infosObject: InfosObject = {
        Unknown: {
            id: OrderRequestErrorCodeId.Unknown,
            displayId: StringId.OrderRequestErrorCodeDisplay_Unknown,
        },
        Account: {
            id: OrderRequestErrorCodeId.Account,
            displayId: StringId.OrderRequestErrorCodeDisplay_Account,
        },
        Account_DailyNet: {
            id: OrderRequestErrorCodeId.Account_DailyNet,
            displayId: StringId.OrderRequestErrorCodeDisplay_Account_DailyNet,
        },
        Account_DailyGross: {
            id: OrderRequestErrorCodeId.Account_DailyGross,
            displayId: StringId.OrderRequestErrorCodeDisplay_Account_DailyGross,
        },
        Authority: {
            id: OrderRequestErrorCodeId.Authority,
            displayId: StringId.OrderRequestErrorCodeDisplay_Authority,
        },
        Connection: {
            id: OrderRequestErrorCodeId.Connection,
            displayId: StringId.OrderRequestErrorCodeDisplay_Connection,
        },
        Details: {
            id: OrderRequestErrorCodeId.Details,
            displayId: StringId.OrderRequestErrorCodeDisplay_Details,
        },
        Error: {
            id: OrderRequestErrorCodeId.Error,
            displayId: StringId.OrderRequestErrorCodeDisplay_Error,
        },
        Exchange: {
            id: OrderRequestErrorCodeId.Exchange,
            displayId: StringId.OrderRequestErrorCodeDisplay_Exchange,
        },
        Internal: {
            id: OrderRequestErrorCodeId.Internal,
            displayId: StringId.OrderRequestErrorCodeDisplay_Internal,
        },
        Internal_NotFound: {
            id: OrderRequestErrorCodeId.Internal_NotFound,
            displayId: StringId.OrderRequestErrorCodeDisplay_Internal_NotFound,
        },
        Order: {
            id: OrderRequestErrorCodeId.Order,
            displayId: StringId.OrderRequestErrorCodeDisplay_Order,
        },
        Operation: {
            id: OrderRequestErrorCodeId.Operation,
            displayId: StringId.OrderRequestErrorCodeDisplay_Operation,
        },
        Retry: {
            id: OrderRequestErrorCodeId.Retry,
            displayId: StringId.OrderRequestErrorCodeDisplay_Retry,
        },
        Route: {
            id: OrderRequestErrorCodeId.Route,
            displayId: StringId.OrderRequestErrorCodeDisplay_Route,
        },
        Route_Algorithm: {
            id: OrderRequestErrorCodeId.Route_Algorithm,
            displayId: StringId.OrderRequestErrorCodeDisplay_Route_Algorithm,
        },
        Route_Market: {
            id: OrderRequestErrorCodeId.Route_Market,
            displayId: StringId.OrderRequestErrorCodeDisplay_Route_Market,
        },
        Route_Symbol: {
            id: OrderRequestErrorCodeId.Route_Symbol,
            displayId: StringId.OrderRequestErrorCodeDisplay_Route_Symbol,
        },
        Status: {
            id: OrderRequestErrorCodeId.Status,
            displayId: StringId.OrderRequestErrorCodeDisplay_Status,
        },
        Style: {
            id: OrderRequestErrorCodeId.Style,
            displayId: StringId.OrderRequestErrorCodeDisplay_Style,
        },
        Submitted: {
            id: OrderRequestErrorCodeId.Submitted,
            displayId: StringId.OrderRequestErrorCodeDisplay_Submitted,
        },
        Symbol: {
            id: OrderRequestErrorCodeId.Symbol,
            displayId: StringId.OrderRequestErrorCodeDisplay_Symbol,
        },
        Symbol_Authority: {
            id: OrderRequestErrorCodeId.Symbol_Authority,
            displayId: StringId.OrderRequestErrorCodeDisplay_Symbol_Authority,
        },
        Symbol_Status: {
            id: OrderRequestErrorCodeId.Symbol_Status,
            displayId: StringId.OrderRequestErrorCodeDisplay_Symbol_Status,
        },
        TotalValue_Balance: {
            id: OrderRequestErrorCodeId.TotalValue_Balance,
            displayId: StringId.OrderRequestErrorCodeDisplay_TotalValue_Balance,
        },
        TotalValue_Maximum: {
            id: OrderRequestErrorCodeId.TotalValue_Maximum,
            displayId: StringId.OrderRequestErrorCodeDisplay_TotalValue_Maximum,
        },
        ExpiryDate: {
            id: OrderRequestErrorCodeId.ExpiryDate,
            displayId: StringId.OrderRequestErrorCodeDisplay_ExpiryDate,
        },
        HiddenQuantity: {
            id: OrderRequestErrorCodeId.HiddenQuantity,
            displayId: StringId.OrderRequestErrorCodeDisplay_HiddenQuantity,
        },
        HiddenQuantity_Symbol: {
            id: OrderRequestErrorCodeId.HiddenQuantity_Symbol,
            displayId: StringId.OrderRequestErrorCodeDisplay_HiddenQuantity_Symbol,
        },
        LimitPrice: {
            id: OrderRequestErrorCodeId.LimitPrice,
            displayId: StringId.OrderRequestErrorCodeDisplay_LimitPrice,
        },
        LimitPrice_Distance: {
            id: OrderRequestErrorCodeId.LimitPrice_Distance,
            displayId: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Distance,
        },
        LimitPrice_Given: {
            id: OrderRequestErrorCodeId.LimitPrice_Given,
            displayId: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Given,
        },
        LimitPrice_Maximum: {
            id: OrderRequestErrorCodeId.LimitPrice_Maximum,
            displayId: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Maximum,
        },
        LimitPrice_Missing: {
            id: OrderRequestErrorCodeId.LimitPrice_Missing,
            displayId: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Missing,
        },
        MinimumQuantity: {
            id: OrderRequestErrorCodeId.MinimumQuantity,
            displayId: StringId.OrderRequestErrorCodeDisplay_MinimumQuantity,
        },
        MinimumQuantity_Symbol: {
            id: OrderRequestErrorCodeId.MinimumQuantity_Symbol,
            displayId: StringId.OrderRequestErrorCodeDisplay_MinimumQuantity_Symbol,
        },
        OrderType: {
            id: OrderRequestErrorCodeId.OrderType,
            displayId: StringId.OrderRequestErrorCodeDisplay_OrderType,
        },
        OrderType_Market: {
            id: OrderRequestErrorCodeId.OrderType_Market,
            displayId: StringId.OrderRequestErrorCodeDisplay_OrderType_Market,
        },
        OrderType_Status: {
            id: OrderRequestErrorCodeId.OrderType_Status,
            displayId: StringId.OrderRequestErrorCodeDisplay_OrderType_Status,
        },
        OrderType_Symbol: {
            id: OrderRequestErrorCodeId.OrderType_Symbol,
            displayId: StringId.OrderRequestErrorCodeDisplay_OrderType_Symbol,
        },
        Side: {
            id: OrderRequestErrorCodeId.Side,
            displayId: StringId.OrderRequestErrorCodeDisplay_Side,
        },
        Side_Maximum: {
            id: OrderRequestErrorCodeId.Side_Maximum,
            displayId: StringId.OrderRequestErrorCodeDisplay_Side_Maximum,
        },
        TotalQuantity: {
            id: OrderRequestErrorCodeId.TotalQuantity,
            displayId: StringId.OrderRequestErrorCodeDisplay_TotalQuantity,
        },
        TotalQuantity_Minimum: {
            id: OrderRequestErrorCodeId.TotalQuantity_Minimum,
            displayId: StringId.OrderRequestErrorCodeDisplay_TotalQuantity_Minimum,
        },
        TotalQuantity_Holdings: {
            id: OrderRequestErrorCodeId.TotalQuantity_Holdings,
            displayId: StringId.OrderRequestErrorCodeDisplay_TotalQuantity_Holdings,
        },
        Validity: {
            id: OrderRequestErrorCodeId.Validity,
            displayId: StringId.OrderRequestErrorCodeDisplay_Validity,
        },
        Validity_Symbol: {
            id: OrderRequestErrorCodeId.Validity_Symbol,
            displayId: StringId.OrderRequestErrorCodeDisplay_Validity_Symbol,
        },
        VisibleQuantity: {
            id: OrderRequestErrorCodeId.VisibleQuantity,
            displayId: StringId.OrderRequestErrorCodeDisplay_VisibleQuantity,
        },
        TotalQuantity_Maximum: {
            id: OrderRequestErrorCodeId.TotalQuantity_Maximum,
            displayId: StringId.OrderRequestErrorCodeDisplay_TotalQuantity_Maximum,
        },
        UnitType: {
            id: OrderRequestErrorCodeId.UnitType,
            displayId: StringId.OrderRequestErrorCodeDisplay_UnitType,
        },
        UnitAmount: {
            id: OrderRequestErrorCodeId.UnitAmount,
            displayId: StringId.OrderRequestErrorCodeDisplay_UnitAmount,
        },
        Currency: {
            id: OrderRequestErrorCodeId.Currency,
            displayId: StringId.OrderRequestErrorCodeDisplay_Currency,
        },
        Flags_PDS: {
            id: OrderRequestErrorCodeId.Flags_PDS,
            displayId: StringId.OrderRequestErrorCodeDisplay_Flags_PDS,
        },
    } as const;

    export const idCount = Object.keys(infosObject).length;

    const infos = Object.values(infosObject);

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as OrderRequestErrorCodeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('OrderRequestErrorCode', outOfOrderIdx, idToDisplay(infos[outOfOrderIdx].id));
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}

export namespace ActiveFaultedStatus {
    export type Id = ActiveFaultedStatusId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof ActiveFaultedStatusId]: Info };

    const infosObject: InfosObject = {
        Active: {
            id: ActiveFaultedStatusId.Active,
            name: 'Active',
            displayId: StringId.ScanStatusDisplay_Active,
        },
        Inactive: {
            id: ActiveFaultedStatusId.Inactive,
            name: 'Inactive',
            displayId: StringId.ScanStatusDisplay_Inactive,
        },
        Faulted: {
            id: ActiveFaultedStatusId.Faulted,
            name: 'Faulted',
            displayId: StringId.ScanStatusDisplay_Faulted,
        },
    } as const;

    const infos = Object.values(infosObject);
    export const idCount = infos.length;


    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ActiveFaultedStatusId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('ScanStatusId', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}

export namespace ScanTargetType {
    export type Id = ScanTargetTypeId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof ScanTargetTypeId]: Info };

    const infosObject: InfosObject = {
        Markets: {
            id: ScanTargetTypeId.Markets,
            name: 'Markets',
            displayId: StringId.ScanTargetTypeDisplay_Markets,
        },
        Symbols: {
            id: ScanTargetTypeId.Symbols,
            name: 'Symbols',
            displayId: StringId.ScanTargetTypeDisplay_Symbols,
        },
    } as const;

    const infos = Object.values(infosObject);
    export const idCount = infos.length;


    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ScanTargetTypeId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('Scan.TargetTypeId', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}

export namespace NotificationDistributionMethod {
    export type Id = NotificationDistributionMethodId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof NotificationDistributionMethodId]: Info };

    const infosObject: InfosObject = {
        Debug: {
            id: NotificationDistributionMethodId.Debug,
            name: 'Debug',
            displayId: StringId.NotificationDistributionMethodDisplay_Debug,
        },
        Email: {
            id: NotificationDistributionMethodId.Email,
            name: 'Email',
            displayId: StringId.NotificationDistributionMethodDisplay_Email,
        },
        Sms: {
            id: NotificationDistributionMethodId.Sms,
            name: 'Sms',
            displayId: StringId.NotificationDistributionMethodDisplay_Sms,
        },
        WebPush: {
            id: NotificationDistributionMethodId.WebPush,
            name: 'WebPush',
            displayId: StringId.NotificationDistributionMethodDisplay_WebPush,
        },
        ApplePush: {
            id: NotificationDistributionMethodId.ApplePush,
            name: 'ApplePush',
            displayId: StringId.NotificationDistributionMethodDisplay_ApplePush,
        },
        GooglePush: {
            id: NotificationDistributionMethodId.GooglePush,
            name: 'GooglePush',
            displayId: StringId.NotificationDistributionMethodDisplay_GooglePush,
        },
    } as const;

    const infos = Object.values(infosObject);
    export const idCount = infos.length;


    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as NotificationDistributionMethodId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('NotificationDistributionMethodId', outOfOrderIdx, infos[outOfOrderIdx].name);
        }
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}

// Utility Classes

// export interface EnvironmentedAccountId {
//     readonly accountId: BrokerageAccountId;
//     // readonly environmentId: TradingEnvironmentId;
//     readonly zenithEnvironmentCode: string | null;
// }

// export interface EnvironmentedExchangeId {
//     readonly exchangeId: ExchangeId;
//     readonly environmentId: DataEnvironmentId;
// }

// export interface EnvironmentedTradingFeedId {
//     readonly feedId: FeedId;
//     readonly environmentId: TradingEnvironmentId;
// }

// export interface EnvironmentedDataFeedId {
//     readonly feedId: FeedId;
//     readonly environmentId: DataEnvironmentId;
// }

// export interface EnvironmentedMarketId {
//     readonly marketId: MarketId;
//     readonly environmentId: DataEnvironmentId;
// }

// export interface EnvironmentedMarketBoardId {
//     readonly marketBoardId: MarketBoardId;
//     readonly environmentId: DataEnvironmentId;
// }

export interface OrderRequestError {
    readonly codeId: OrderRequestErrorCodeId;
    readonly code: string;
    readonly value: string | undefined;
}

export namespace AsxIndexPoint {
    const dollarsToPointsFactor: SysDecimal = newDecimal(100.0);

    export function toDollars(Value: SysDecimal): SysDecimal {
        return Value.div(dollarsToPointsFactor);
    }
    export function fromDollars(Value: SysDecimal): SysDecimal {
        return Value.times(dollarsToPointsFactor);
    }
}

export function CreateEnumSet(enumArray: number[]) {
    let result = 0;
    // Create a bitmask
    for (const i of enumArray) {
        result |= 1 << i;
    }
    return result;
}

export namespace DataTypesModule {
    export function initialiseStatic(): void {
        DataChannel.initialise();
        // DataMessageType.initialise();
        // MarketInfo.initialise();
        TBrokerageAccOrAggField.StaticConstructor();
        // DataEnvironment.initialise();
        // TradingEnvironment.initialise();
        // ExchangeInfo.initialise();
        ExerciseType.initialise();
        DepthDirection.initialise();
        // MarketBoard.initialise();
        Movement.initialise();
        IvemClass.initialise();
        FeedStatus.initialise();
        SubscribabilityExtent.initialise();
        OrderRequestType.initialise();
        OrderTradeType.initialise();
        OrderSide.initialise();
        OrderType.initialise();
        TimeInForce.initialise();
        OrderShortSellType.initialise();
        OrderRequestAlgorithm.initialise();
        OrderRequestFlag.initialise();
        OrderPadStatus.initialise();
        PublisherSubscriptionDataType.initialise();
        OrderPriceUnitType.initialise();
        OrderRouteAlgorithm.initialise();
        TrailingStopLossOrderConditionType.initialise();
        OrderCommandResult.initialise();
        DepthStyle.initialise();
        ChartInterval.initialise();
        SymbolField.initialise();
        ZenithPublisherState.initialise();
        ZenithPublisherReconnectReason.initialise();
        ActiveFaultedStatus.initialise();
        ScanTargetType.initialise();
    }
}
