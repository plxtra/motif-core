/** @public */
export const enum StringId {
    InternalError,
    PersistError,
    AssertInternalError,
    TypeInternalError,
    UnreachableCaseInternalError,
    UnexpectedCaseInternalError,
    NotImplementedInternalError,
    UnexpectedUndefinedInternalError,
    UnexpectedTypeInternalError,
    EnumInfoOutOfOrderInternalError,
    ExternalError,
    PossibleExternalError,
    JsonLoadExternalError,
    ConfigExternalError,
    ColumnLayoutExternalError,
    DataExternalError,
    FeedExternalError,
    ZenithDataExternalError,
    ZenithUnexpectedCaseExternalError,
    ZenithDataStateExternalError,
    ZenithEncodedScanFormulaDecodeError,
    MotifServicesExternalError,
    PublisherExternalError,
    ExtensionExternalError,
    ExtensionOrInternalExternalError,
    ApiExternalError,
    QueryParamExternalError,
    DuplicateExternalError,
    RangeError,
    ArraySizeOverflow,
    ValueNotFound,
    Unknown,
    UnknownMarket,
    UnknownExchange,
    UnknownIvemClass,
    UnknownDisplayString,
    Ok,
    Cancel,
    Cancelled,
    Yes,
    No,
    True,
    False,
    Left,
    Right,
    Show,
    For,
    On,
    From,
    To,
    Not,
    Blank,
    Filter,
    Exclude,
    Open,
    Close,
    Create,
    Add,
    Delete,
    Deleting,
    Deleted,
    Attach,
    Detach,
    Update,
    Edit,
    Apply,
    Revert,
    Overwrite,
    Test,
    Search,
    Details,
    Status,
    Correctness,
    Acknowledge,
    Keywords,
    ContactMe,
    NotInterested,
    Interested,
    Similar,
    Incompatible,
    // eslint-disable-next-line id-blacklist
    Undefined,
    Enabled,
    Readonly,
    Visible,
    Writable,
    Offline,
    Online,
    Available,
    InUse,
    View,
    Expand,
    Restore,
    Collapse,
    ExpandSection,
    RestoreSection,
    CollapseSection,
    SignedOut,
    SignInAgain,
    Version,
    Service,
    Restart,
    ErrorCount,
    Hide,
    CopyToClipboard,
    InsufficientCharacters,
    CircularDependency,
    NotInitialised,
    Missing,
    Disabled,
    Prerequisite,
    Waiting,
    Error,
    NoErrors,
    Editing,
    Modified,
    Valid,
    Invalid,
    Faulted,
    InvalidIntegerString,
    UnsupportedValue,
    NotObject,
    InvalidObject,
    NotString,
    InvalidString,
    NotNumber,
    InvalidNumber,
    NotBoolean,
    InvalidBoolean,
    InvalidDate,
    InvalidJsonObject,
    InvalidJsonText,
    NotArray,
    InvalidObjectArray,
    InvalidStringArray,
    InvalidNumberArray,
    InvalidBooleanArray,
    InvalidJsonObjectArray,
    InvalidAnyJsonValueTypeArray,
    DecimalNotJsonString,
    InvalidDecimal,
    IvemIdNotJsonString,
    InvalidIvemIdJson,
    DataIvemIdNotJsonObject,
    InvalidDataIvemIdJson,
    UiEntryError,
    ErrorGetting,
    ErrorOpening,
    ErrorOpeningSaved,
    ErrorCreating,
    ErrorCreatingNew,
    ErrorUpdating,
    ErrorDeleting,
    ErrorLoadingColumnLayout,
    ValueRequired,
    ExchangeDoesNotHaveDefaultLitMarket,
    ExchangeDoesNotHaveDefaultTradingMarket,
    MarketDoesNotSupportSymbolsFromExchange,
    InvalidExchange,
    InvalidExchangeOrZenithExchange,
    InvalidMarket,
    InvalidExchangeOrZenithMarket,
    MarketCodeNotFoundInRic,
    CodeNotFoundInRic,
    UnsupportedMarketCodeInRic,
    AllBrokerageAccounts,
    BrokerageAccountNotFound,
    BrokerageAccountNotMatched,
    TopShareholdersOnlySupportNzx,
    GroupOrdersByPriceLevel,
    SessionEndedAsLoggedInElsewhere,
    MotifServicesResponseStatusError,
    MotifServicesFetchError,
    MotifServicesFetchTextError,
    NodeType,
    Depth,
    BidDepth,
    AskDepth,
    KickedOff,
    NotReadable,
    PriceRemainder,
    Query,
    Subscribe,
    Subscription,
    Fields,
    Source,
    Feed,
    ExchangeEnvironments,
    Exchange,
    Exchanges,
    Market,
    Markets,
    DataMarkets,
    TradingMarkets,
    MarketBoards,
    ServerInformation,
    Class,
    Cfi,
    Partial,
    Exact,
    IgnoreCase,
    FromStart,
    FromEnd,
    Full,
    Options,
    Page,
    Of,
    Seconds,
    SymbolList,
    Watchlist,
    Trades,
    Orders,
    Holdings,
    Balances,
    Trading,
    NoTable,
    DeleteWatchlist,
    CannotDeleteWatchlist,
    CannotDeletePrivateList,
    CannotDeleteBuiltinList,
    DeleteList,
    CannotDeleteList,
    NewScan,
    Scan,
    TableJsonMissingFieldlist,
    NamedDataSource,
    List,
    None,
    QuestionMark,
    New,
    Private,
    Index,
    Undisclosed,
    Physical,
    Matched,
    General,
    Criteria,
    Rank,
    Targets,
    DistributionMethodIds,
    NotificationChannel,
    NotificationChannels,
    NotificationChannelsGrid,
    ScanEditorAttachedNotificationChannels,
    ScanFieldEditorFramesGrid,
    ScanTestMatches,
    DataIvemIdListEditor,
    SearchSymbols,
    DepthAndSalesWatchlist,
    Feeds,
    FeedInitialising,
    FeedWaitingStatus,
    Notifications,
    AllowedFields,
    ColumnLayoutEditorColumns,
    BrokerageAccounts,
    OrderAuthorise,
    Scans,
    TopShareholders,
    ColumnLayout,
    ExecuteCommandTitle,
    ApplySymbolCaption,
    ApplySymbolTitle,
    SelectColumnsCaption,
    SelectColumnsTitle,
    AutoSizeColumnWidthsCaption,
    AutoSizeColumnWidthsTitle,
    SymbolInputTitle,
    ToggleSearchTermNotExchangedMarketProcessedCaption,
    ToggleSearchTermNotExchangedMarketProcessedTitle,
    SelectAccountTitle,
    ToggleSymbolLinkingCaption,
    ToggleSymbolLinkingTitle,
    ToggleAccountLinkingCaption,
    ToggleAccountLinkingTitle,
    BuyOrderPadCaption,
    BuyOrderPadTitle,
    SellOrderPadCaption,
    SellOrderPadTitle,
    AmendOrderPadCaption,
    AmendOrderPadTitle,
    CancelOrderPadCaption,
    CancelOrderPadTitle,
    MoveOrderPadCaption,
    MoveOrderPadTitle,
    BackgroundColor,
    ForegroundColor,
    OpenColorSchemeTitle,
    SaveColorSchemeCaption,
    SaveColorSchemeToADifferentNameTitle,
    ManageColorSchemesTitle,
    BrokerageAccountIdInputPlaceholderText,
    FeedHeadingPrefix,
    TypingPauseWaiting,
    SearchRequiresAtLeast,
    Characters,
    InvalidSymbol,
    FetchingSymbolDetails,
    SymbolNotFound,
    NoMatchingSymbolsOrNamesFound,
    ScanEditor,
    CreateScan,
    UpdateScan,
    DeleteScan,
    AddField,
    AddAttributeField,
    AddAltCodeField,
    Warning_ConfigDefaultDefaultExchangeNotFound,
    Warning_ConfigExchangeDefaultExchangeEnvironmentNotFound,
    Warning_ConfigDefaultExchangeEnvironmentPriorityListHadNoMatches,
    Warning_CorrespondingSymbologyExchangeSuffixCodeAlreadyInUse,
    Layout_InvalidJson,
    Layout_SerialisationFormatNotDefinedLoadingDefault,
    Layout_SerialisationFormatIncompatibleLoadingDefault,
    Layout_GoldenNotDefinedLoadingDefault,
    Layout_CouldNotSave,
    SecurityFieldDisplay_Symbol,
    SecurityFieldHeading_Symbol,
    SecurityFieldDisplay_Code,
    SecurityFieldHeading_Code,
    SecurityFieldDisplay_Market,
    SecurityFieldHeading_Market,
    SecurityFieldDisplay_Exchange,
    SecurityFieldHeading_Exchange,
    SecurityFieldDisplay_Name,
    SecurityFieldHeading_Name,
    SecurityFieldDisplay_Class,
    SecurityFieldHeading_Class,
    SecurityFieldDisplay_Cfi,
    SecurityFieldHeading_Cfi,
    SecurityFieldDisplay_TradingState,
    SecurityFieldHeading_TradingState,
    SecurityFieldDisplay_TradingStateAllows,
    SecurityFieldHeading_TradingStateAllows,
    SecurityFieldDisplay_TradingStateReason,
    SecurityFieldHeading_TradingStateReason,
    SecurityFieldDisplay_TradingMarkets,
    SecurityFieldHeading_TradingMarkets,
    SecurityFieldDisplay_IsIndex,
    SecurityFieldHeading_IsIndex,
    SecurityFieldDisplay_ExpiryDate,
    SecurityFieldHeading_ExpiryDate,
    SecurityFieldDisplay_StrikePrice,
    SecurityFieldHeading_StrikePrice,
    SecurityFieldDisplay_CallOrPut,
    SecurityFieldHeading_CallOrPut,
    SecurityFieldDisplay_ContractSize,
    SecurityFieldHeading_ContractSize,
    SecurityFieldDisplay_SubscriptionDataTypeIds,
    SecurityFieldHeading_SubscriptionDataTypeIds,
    SecurityFieldDisplay_QuotationBasis,
    SecurityFieldHeading_QuotationBasis,
    SecurityFieldDisplay_Currency,
    SecurityFieldHeading_Currency,
    SecurityFieldDisplay_Open,
    SecurityFieldHeading_Open,
    SecurityFieldDisplay_High,
    SecurityFieldHeading_High,
    SecurityFieldDisplay_Low,
    SecurityFieldHeading_Low,
    SecurityFieldDisplay_Close,
    SecurityFieldHeading_Close,
    SecurityFieldDisplay_Settlement,
    SecurityFieldHeading_Settlement,
    SecurityFieldDisplay_Last,
    SecurityFieldHeading_Last,
    SecurityFieldDisplay_Trend,
    SecurityFieldHeading_Trend,
    SecurityFieldDisplay_BestAsk,
    SecurityFieldHeading_BestAsk,
    SecurityFieldDisplay_AskCount,
    SecurityFieldHeading_AskCount,
    SecurityFieldDisplay_AskQuantity,
    SecurityFieldHeading_AskQuantity,
    SecurityFieldDisplay_AskUndisclosed,
    SecurityFieldHeading_AskUndisclosed,
    SecurityFieldDisplay_BestBid,
    SecurityFieldHeading_BestBid,
    SecurityFieldDisplay_BidCount,
    SecurityFieldHeading_BidCount,
    SecurityFieldDisplay_BidQuantity,
    SecurityFieldHeading_BidQuantity,
    SecurityFieldDisplay_BidUndisclosed,
    SecurityFieldHeading_BidUndisclosed,
    SecurityFieldDisplay_NumberOfTrades,
    SecurityFieldHeading_NumberOfTrades,
    SecurityFieldDisplay_Volume,
    SecurityFieldHeading_Volume,
    SecurityFieldDisplay_AuctionPrice,
    SecurityFieldHeading_AuctionPrice,
    SecurityFieldDisplay_AuctionQuantity,
    SecurityFieldHeading_AuctionQuantity,
    SecurityFieldDisplay_AuctionRemainder,
    SecurityFieldHeading_AuctionRemainder,
    SecurityFieldDisplay_VWAP,
    SecurityFieldHeading_VWAP,
    SecurityFieldDisplay_ValueTraded,
    SecurityFieldHeading_ValueTraded,
    SecurityFieldDisplay_OpenInterest,
    SecurityFieldHeading_OpenInterest,
    SecurityFieldDisplay_ShareIssue,
    SecurityFieldHeading_ShareIssue,
    SecurityFieldDisplay_StatusNote,
    SecurityFieldHeading_StatusNote,
    DataIvemIdFieldDisplay_DataIvemId,
    DataIvemIdFieldHeading_DataIvemId,
    DataIvemIdFieldDisplay_Code,
    DataIvemIdFieldHeading_Code,
    DataIvemIdFieldDisplay_Market,
    DataIvemIdFieldHeading_Market,
    DataIvemIdFieldDisplay_Environment,
    DataIvemIdFieldHeading_Environment,
    RankedDataIvemIdFieldDisplay_DataIvemId,
    RankedDataIvemIdFieldHeading_DataIvemId,
    RankedDataIvemIdFieldDisplay_Rank,
    RankedDataIvemIdFieldHeading_Rank,
    RankedDataIvemIdFieldDisplay_rankScore,
    RankedDataIvemIdFieldHeading_rankScore,
    RankedDataIvemIdListAbbreviation_DataIvemIdArray,
    RankedDataIvemIdListDisplay_DataIvemIdArray,
    RankedDataIvemIdListAbbreviation_WatchmakerListId,
    RankedDataIvemIdListDisplay_WatchmakerListId,
    RankedDataIvemIdListAbbreviation_ScanId,
    RankedDataIvemIdListDisplay_ScanId,
    RankedDataIvemIdListAbbreviation_DataIvemIdExecuteScan,
    RankedDataIvemIdListDisplay_DataIvemIdExecuteScan,
    TableRecordDefinitionList_ListTypeDisplay_Null,
    TableRecordDefinitionList_ListTypeAbbr_Null,
    TableRecordDefinitionList_ListTypeDisplay_DataIvemIdList,
    TableRecordDefinitionList_ListTypeAbbr_DataIvemIdList,
    TableRecordDefinitionList_ListTypeDisplay_DataIvemDetailsFromSearchSymbols,
    TableRecordDefinitionList_ListTypeAbbr_DataIvemDetailsFromSearchSymbols,
    TableRecordDefinitionList_ListTypeDisplay_DataIvemIdArrayRankedDataIvemIdList,
    TableRecordDefinitionList_ListTypeAbbr_DataIvemIdArrayRankedDataIvemIdList,
    TableRecordDefinitionList_ListTypeDisplay_MarketMovers,
    TableRecordDefinitionList_ListTypeAbbr_MarketMovers,
    TableRecordDefinitionList_ListTypeDisplay_Gics,
    TableRecordDefinitionList_ListTypeAbbr_Gics,
    TableRecordDefinitionList_ListTypeDisplay_ProfitIvemHolding,
    TableRecordDefinitionList_ListTypeAbbr_ProfitIvemHolding,
    TableRecordDefinitionList_ListTypeDisplay_CashItemHolding,
    TableRecordDefinitionList_ListTypeAbbr_CashItemHolding,
    TableRecordDefinitionList_ListTypeDisplay_IntradayProfitLossSymbolRec,
    TableRecordDefinitionList_ListTypeAbbr_IntradayProfitLossSymbolRec,
    TableRecordDefinitionList_ListTypeDisplay_TmcDefinitionLegs,
    TableRecordDefinitionList_ListTypeAbbr_TmcDefinitionLegs,
    TableRecordDefinitionList_ListTypeDisplay_TmcLeg,
    TableRecordDefinitionList_ListTypeAbbr_TmcLeg,
    TableRecordDefinitionList_ListTypeDisplay_TmcWithLegMatchingUnderlying,
    TableRecordDefinitionList_ListTypeAbbr_TmcWithLegMatchingUnderlying,
    TableRecordDefinitionList_ListTypeDisplay_EtoMatchingUnderlyingCallPut,
    TableRecordDefinitionList_ListTypeAbbr_EtoMatchingUnderlyingCallPut,
    TableRecordDefinitionList_ListTypeDisplay_HoldingAccountPortfolio,
    TableRecordDefinitionList_ListTypeAbbr_HoldingAccountPortfolio,
    TableRecordDefinitionList_ListTypeDisplay_Feed,
    TableRecordDefinitionList_ListTypeAbbr_Feed,
    TableRecordDefinitionList_ListTypeDisplay_BrokerageAccount,
    TableRecordDefinitionList_ListTypeAbbr_BrokerageAccount,
    TableRecordDefinitionList_ListTypeDisplay_Order,
    TableRecordDefinitionList_ListTypeAbbr_Order,
    TableRecordDefinitionList_ListTypeDisplay_Holding,
    TableRecordDefinitionList_ListTypeAbbr_Holding,
    TableRecordDefinitionList_ListTypeDisplay_Balances,
    TableRecordDefinitionList_ListTypeAbbr_Balances,
    TableRecordDefinitionList_ListTypeDisplay_TopShareholder,
    TableRecordDefinitionList_ListTypeAbbr_TopShareholder,
    TableRecordDefinitionList_ListTypeDisplay_ColumnLayoutDefinitionColumnEditRecord,
    TableRecordDefinitionList_ListTypeAbbr_ColumnLayoutDefinitionColumnEditRecord,
    TableRecordDefinitionList_ListTypeDisplay_Scan,
    TableRecordDefinitionList_ListTypeAbbr_Scan,
    TableRecordDefinitionList_ListTypeDisplay_RankedDataIvemIdListDirectoryItem,
    TableRecordDefinitionList_ListTypeAbbr_RankedDataIvemIdListDirectoryItem,
    TableRecordDefinitionList_ListTypeDisplay_GridField,
    TableRecordDefinitionList_ListTypeAbbr_GridField,
    TableRecordDefinitionList_ListTypeDisplay_ScanFieldEditorFrame,
    TableRecordDefinitionList_ListTypeAbbr_ScanFieldEditorFrame,
    TableRecordDefinitionList_ListTypeDisplay_ScanEditorAttachedNotificationChannel,
    TableRecordDefinitionList_ListTypeAbbr_ScanEditorAttachedNotificationChannel,
    TableRecordDefinitionList_ListTypeDisplay_LockOpenNotificationChannelList,
    TableRecordDefinitionList_ListTypeAbbr_LockOpenNotificationChannelList,
    TableRecordDefinitionList_ListTypeDisplay_ExchangeEnvironmentList,
    TableRecordDefinitionList_ListTypeAbbr_ExchangeEnvironmentList,
    TableRecordDefinitionList_ListTypeDisplay_ExchangeList,
    TableRecordDefinitionList_ListTypeAbbr_ExchangeList,
    TableRecordDefinitionList_ListTypeDisplay_TradingMarketList,
    TableRecordDefinitionList_ListTypeAbbr_TradingMarketList,
    TableRecordDefinitionList_ListTypeDisplay_DataMarketList,
    TableRecordDefinitionList_ListTypeAbbr_DataMarketList,
    TableRecordDefinitionList_ListTypeDisplay_MarketBoardList,
    TableRecordDefinitionList_ListTypeAbbr_MarketBoardList,
    ExchangeAbbreviatedDisplay_Asx,
    ExchangeFullDisplay_Asx,
    ExchangeAbbreviatedDisplay_Cxa,
    ExchangeFullDisplay_Cxa,
    ExchangeAbbreviatedDisplay_Nsx,
    ExchangeFullDisplay_Nsx,
    ExchangeAbbreviatedDisplay_Nzx,
    ExchangeFullDisplay_Nzx,
    ExchangeAbbreviatedDisplay_Calastone,
    ExchangeFullDisplay_Calastone,
    ExchangeAbbreviatedDisplay_Ptx,
    ExchangeFullDisplay_Ptx,
    ExchangeAbbreviatedDisplay_Fnsx,
    ExchangeFullDisplay_Fnsx,
    ExchangeAbbreviatedDisplay_Fpsx,
    ExchangeFullDisplay_Fpsx,
    ExchangeAbbreviatedDisplay_Cfx,
    ExchangeFullDisplay_Cfx,
    ExchangeAbbreviatedDisplay_Dax,
    ExchangeFullDisplay_Dax,
    ExchangeAbbreviatedDisplay_Myx,
    ExchangeFullDisplay_Myx,
    ExchangeAbbreviatedDisplay_AsxCxa,
    ExchangeFullDisplay_AsxCxa,
    DataEnvironmentDisplay_Production,
    DataEnvironmentDisplay_DelayedProduction,
    DataEnvironmentDisplay_Demo,
    DataEnvironmentDisplay_Sample,
    TradingEnvironmentDisplay_Production,
    TradingEnvironmentDisplay_Demo,
    KnownFeedDisplay_Authority,
    KnownFeedDisplay_Watchlist,
    KnownFeedDisplay_Scanner,
    KnownFeedDisplay_Channel,
    MarketDisplay_MixedMarket,
    MarketDisplay_MyxNormal,
    MarketDisplay_MyxOddLot,
    MarketDisplay_MyxBuyIn,
    MarketDisplay_MyxDirectBusiness,
    MarketDisplay_MyxIndex,
    MarketDisplay_AsxBookBuild,
    MarketDisplay_AsxPureMatch,
    MarketDisplay_AsxPureMatchDemo,
    MarketDisplay_AsxTradeMatch,
    MarketDisplay_AsxTradeMatchDelayed,
    MarketDisplay_AsxTradeMatchDemo,
    MarketDisplay_AsxCentrePoint,
    MarketDisplay_AsxVolumeMatch,
    MarketDisplay_ChixAustLimit,
    MarketDisplay_ChixAustLimitDemo,
    MarketDisplay_ChixAustFarPoint,
    MarketDisplay_ChixAustMarketOnClose,
    MarketDisplay_ChixAustNearPoint,
    MarketDisplay_ChixAustMidPoint,
    MarketDisplay_SimVenture,
    MarketDisplay_Nsx,
    MarketDisplay_NsxDemo,
    MarketDisplay_SouthPacific,
    MarketDisplay_Nzfox,
    MarketDisplay_Nzx,
    MarketDisplay_NzxDemo,
    MarketDisplay_Calastone,
    MarketDisplay_PtxDemo,
    MarketDisplay_AsxCxa,
    MarketDisplay_AsxCxaDemo,
    MarketDisplay_PtxMain,
    MarketDisplay_FnsxMain,
    MarketDisplay_FpsxMain,
    MarketDisplay_CfxMain,
    MarketDisplay_DaxMain,
    IvemClass_Unknown,
    IvemClass_Market,
    IvemClass_ManagedFund,
    MarketBoardIdDisplay_MixedMarket,
    MarketBoardIdDisplay_AsxBookBuild,
    MarketBoardIdDisplay_AsxCentrePoint,
    MarketBoardIdDisplay_AsxTradeMatch,
    MarketBoardIdDisplay_AsxTradeMatchAgric,
    MarketBoardIdDisplay_AsxTradeMatchAus,
    MarketBoardIdDisplay_AsxTradeMatchDerivatives,
    MarketBoardIdDisplay_AsxTradeMatchEquity1,
    MarketBoardIdDisplay_AsxTradeMatchEquity2,
    MarketBoardIdDisplay_AsxTradeMatchEquity3,
    MarketBoardIdDisplay_AsxTradeMatchEquity4,
    MarketBoardIdDisplay_AsxTradeMatchEquity5,
    MarketBoardIdDisplay_AsxTradeMatchIndex,
    MarketBoardIdDisplay_AsxTradeMatchIndexDerivatives,
    MarketBoardIdDisplay_AsxTradeMatchInterestRate,
    MarketBoardIdDisplay_AsxTradeMatchPrivate,
    MarketBoardIdDisplay_AsxTradeMatchQuoteDisplayBoard,
    MarketBoardIdDisplay_AsxTradeMatchPractice,
    MarketBoardIdDisplay_AsxTradeMatchWarrants,
    MarketBoardIdDisplay_AsxPureMatch,
    MarketBoardIdDisplay_AsxPureMatchEquity1,
    MarketBoardIdDisplay_AsxPureMatchEquity2,
    MarketBoardIdDisplay_AsxPureMatchEquity3,
    MarketBoardIdDisplay_AsxPureMatchEquity4,
    MarketBoardIdDisplay_AsxPureMatchEquity5,
    MarketBoardIdDisplay_AsxVolumeMatch,
    MarketBoardIdDisplay_ChixAustFarPoint,
    MarketBoardIdDisplay_ChixAustLimit,
    MarketBoardIdDisplay_ChixAustMarketOnClose,
    MarketBoardIdDisplay_ChixAustMidPoint,
    MarketBoardIdDisplay_ChixAustNearPoint,
    MarketBoardIdDisplay_NsxMain,
    MarketBoardIdDisplay_NsxCommunityBanks,
    MarketBoardIdDisplay_NsxIndustrial,
    MarketBoardIdDisplay_NsxDebt,
    MarketBoardIdDisplay_NsxMiningAndEnergy,
    MarketBoardIdDisplay_NsxCertifiedProperty,
    MarketBoardIdDisplay_NsxProperty,
    MarketBoardIdDisplay_NsxRestricted,
    MarketBoardIdDisplay_SimVenture,
    MarketBoardIdDisplay_SouthPacificStockExchangeEquities,
    MarketBoardIdDisplay_SouthPacificStockExchangeRestricted,
    MarketBoardIdDisplay_NzxMainBoard,
    MarketBoardIdDisplay_NzxSpec,
    MarketBoardIdDisplay_NzxFonterraShareholders,
    MarketBoardIdDisplay_NzxIndex,
    MarketBoardIdDisplay_NzxDebt,
    MarketBoardIdDisplay_NzxComm,
    MarketBoardIdDisplay_NzxDerivativeFutures,
    MarketBoardIdDisplay_NzxDerivativeOptions,
    MarketBoardIdDisplay_NzxIndexFutures,
    MarketBoardIdDisplay_NzxDStgy,
    MarketBoardIdDisplay_NzxMStgy,
    MarketBoardIdDisplay_NzxEOpt,
    MarketBoardIdDisplay_NzxMFut,
    MarketBoardIdDisplay_NzxMOpt,
    MarketBoardIdDisplay_MyxNormal,
    MarketBoardIdDisplay_MyxDirectBusinessTransaction,
    MarketBoardIdDisplay_MyxIndex,
    MarketBoardIdDisplay_MyxBuyIn,
    MarketBoardIdDisplay_MyxOddLot,
    MarketBoardIdDisplay_PtxMain,
    MarketBoardIdDisplay_FnsxMain,
    MarketBoardIdDisplay_FpsxMain,
    MarketBoardIdDisplay_CfxMain,
    MarketBoardIdDisplay_DaxMain,
    SymbolCodeError_Missing,
    SymbolCodeError_MustContainAtLeast3Characters,
    SymbolCodeError_MustContainAtLeast4Characters,
    SymbolCodeError_CanOnlyContainDigits,
    SymbolSelect_SearchForCodeOrName,
    SymbolSelect_NoMarkets,
    SymbolSelect_NoDataSymbolAvailable,
    SymbolSelect_NotFoundInMarket,
    CallOrPutDisplay_Call,
    CallOrPutDisplay_Put,
    PublisherSubscriptionDataTypeDisplay_Asset,
    PublisherSubscriptionDataTypeDisplay_Trades,
    PublisherSubscriptionDataTypeDisplay_Depth,
    PublisherSubscriptionDataTypeDisplay_DepthFull,
    PublisherSubscriptionDataTypeDisplay_DepthShort,
    CurrencyCode_Aud,
    CurrencySymbol_Aud,
    CurrencyCode_Usd,
    CurrencySymbol_Usd,
    CurrencyCode_Myr,
    CurrencySymbol_Myr,
    CurrencyCode_Gbp,
    CurrencySymbol_Gbp,
    BrokerageAccountFieldDisplay_IdDisplay,
    BrokerageAccountFieldHeading_IdDisplay,
    BrokerageAccountFieldDisplay_EnvironmentZenithCode,
    BrokerageAccountFieldHeading_EnvironmentZenithCode,
    BrokerageAccountFieldDisplay_Name,
    BrokerageAccountFieldHeading_Name,
    BrokerageAccountFieldDisplay_FeedStatusId,
    BrokerageAccountFieldHeading_FeedStatusId,
    BrokerageAccountFieldDisplay_TradingFeedName,
    BrokerageAccountFieldHeading_TradingFeedName,
    BrokerageAccountFieldDisplay_CurrencyId,
    BrokerageAccountFieldHeading_CurrencyId,
    BrokerageAccountFieldDisplay_BrokerCode,
    BrokerageAccountFieldHeading_BrokerCode,
    BrokerageAccountFieldDisplay_BranchCode,
    BrokerageAccountFieldHeading_BranchCode,
    BrokerageAccountFieldDisplay_AdvisorCode,
    BrokerageAccountFieldHeading_AdvisorCode,
    OrderFieldDisplay_Id,
    OrderFieldHeading_Id,
    OrderFieldDisplay_AccountId,
    OrderFieldHeading_AccountId,
    OrderFieldDisplay_ExternalID,
    OrderFieldHeading_ExternalID,
    OrderFieldDisplay_DepthOrderID,
    OrderFieldHeading_DepthOrderID,
    OrderFieldDisplay_Status,
    OrderFieldHeading_Status,
    OrderFieldDisplay_StatusAllowIds,
    OrderFieldHeading_StatusAllowIds,
    OrderFieldDisplay_StatusReasonIds,
    OrderFieldHeading_StatusReasonIds,
    OrderFieldDisplay_MarketDisplay,
    OrderFieldHeading_MarketDisplay,
    OrderFieldDisplay_TradingMarket,
    OrderFieldHeading_TradingMarket,
    OrderFieldDisplay_Currency,
    OrderFieldHeading_Currency,
    OrderFieldDisplay_EstimatedBrokerage,
    OrderFieldHeading_EstimatedBrokerage,
    OrderFieldDisplay_CurrentBrokerage,
    OrderFieldHeading_CurrentBrokerage,
    OrderFieldDisplay_EstimatedTax,
    OrderFieldHeading_EstimatedTax,
    OrderFieldDisplay_CurrentTax,
    OrderFieldHeading_CurrentTax,
    OrderFieldDisplay_CurrentValue,
    OrderFieldHeading_CurrentValue,
    OrderFieldDisplay_CreatedDate,
    OrderFieldHeading_CreatedDate,
    OrderFieldDisplay_UpdatedDate,
    OrderFieldHeading_UpdatedDate,
    OrderFieldDisplay_Style,
    OrderFieldHeading_Style,
    OrderFieldDisplay_Children,
    OrderFieldHeading_Children,
    OrderFieldDisplay_ExecutedQuantity,
    OrderFieldHeading_ExecutedQuantity,
    OrderFieldDisplay_AveragePrice,
    OrderFieldHeading_AveragePrice,
    OrderFieldDisplay_TriggerType,
    OrderFieldHeading_TriggerType,
    OrderFieldDisplay_TriggerValue,
    OrderFieldHeading_TriggerValue,
    OrderFieldDisplay_TriggerExtraParams,
    OrderFieldHeading_TriggerExtraParams,
    OrderFieldDisplay_TrailingStopLossConditionType,
    OrderFieldHeading_TrailingStopLossConditionType,
    OrderFieldDisplay_Exchange,
    OrderFieldHeading_Exchange,
    OrderFieldDisplay_Environment,
    OrderFieldHeading_Environment,
    OrderFieldDisplay_Code,
    OrderFieldHeading_Code,
    OrderFieldDisplay_Side,
    OrderFieldHeading_Side,
    OrderFieldDisplay_ExtendedSide,
    OrderFieldHeading_ExtendedSide,
    OrderFieldDisplay_DetailsStyle,
    OrderFieldHeading_DetailsStyle,
    OrderFieldDisplay_BrokerageSchedule,
    OrderFieldHeading_BrokerageSchedule,
    OrderFieldDisplay_DetailsType,
    OrderFieldHeading_DetailsType,
    OrderFieldDisplay_LimitPrice,
    OrderFieldHeading_LimitPrice,
    OrderFieldDisplay_Quantity,
    OrderFieldHeading_Quantity,
    OrderFieldDisplay_HiddenQuantity,
    OrderFieldHeading_HiddenQuantity,
    OrderFieldDisplay_MinimumQuantity,
    OrderFieldHeading_MinimumQuantity,
    OrderFieldDisplay_DetailsTimeInForce,
    OrderFieldHeading_DetailsTimeInForce,
    OrderFieldDisplay_DetailsExpiryDate,
    OrderFieldHeading_DetailsExpiryDate,
    OrderFieldDisplay_DetailsShortSellType,
    OrderFieldHeading_DetailsShortSellType,
    OrderFieldDisplay_DetailsUnitType,
    OrderFieldHeading_DetailsUnitType,
    OrderFieldDisplay_DetailsUnitAmount,
    OrderFieldHeading_DetailsUnitAmount,
    OrderFieldDisplay_DetailsCurrency,
    OrderFieldHeading_DetailsCurrency,
    OrderFieldDisplay_DetailsPhysicalDelivery,
    OrderFieldHeading_DetailsPhysicalDelivery,
    OrderFieldDisplay_RouteAlgorithm,
    OrderFieldHeading_RouteAlgorithm,
    OrderFieldDisplay_RouteMarket,
    OrderFieldHeading_RouteMarket,
    FeedStatusDisplay_Unknown,
    FeedStatusDisplay_Initialising,
    FeedStatusDisplay_Active,
    FeedStatusDisplay_Closed,
    FeedStatusDisplay_Inactive,
    FeedStatusDisplay_Impaired,
    FeedStatusDisplay_Expired,
    FeedClassDisplay_Authority,
    FeedClassDisplay_Market,
    FeedClassDisplay_News,
    FeedClassDisplay_Trading,
    FeedClassDisplay_Watchlist,
    FeedClassDisplay_Scanner,
    FeedClassDisplay_Channel,
    SubscribabilityExtentDisplay_None,
    SubscribabilityExtentDisplay_Some,
    SubscribabilityExtentDisplay_All,
    CorrectnessDisplay_Good,
    CorrectnessDisplay_Usable,
    CorrectnessDisplay_Suspect,
    CorrectnessDisplay_Error,
    Trend_None,
    Trend_Up,
    Trend_Down,
    OrderSideDisplay_Bid,
    OrderSideDisplay_Ask,
    SideDisplay_Buy,
    SideAbbreviation_Buy,
    SideDisplay_Sell,
    SideAbbreviation_Sell,
    SideDisplay_IntraDayShortSell,
    SideAbbreviation_IntraDayShortSell,
    SideDisplay_RegulatedShortSell,
    SideAbbreviation_RegulatedShortSell,
    SideDisplay_ProprietaryShortSell,
    SideAbbreviation_ProprietaryShortSell,
    SideDisplay_ProprietaryDayTrade,
    SideAbbreviation_ProprietaryDayTrade,
    EquityOrderTypeDisplay_Limit,
    EquityOrderTypeDisplay_Best,
    EquityOrderTypeDisplay_Market,
    EquityOrderTypeDisplay_MarketToLimit,
    EquityOrderTypeDisplay_Unknown,
    TimeInForceDisplay_Day,
    TimeInForceDisplay_GoodTillCancel,
    TimeInForceDisplay_AtTheOpening,
    TimeInForceDisplay_FillAndKill,
    TimeInForceDisplay_FillOrKill,
    TimeInForceDisplay_AllOrNone,
    TimeInForceDisplay_GoodTillCrossing,
    TimeInForceDisplay_GoodTillDate,
    TimeInForceDisplay_AtTheClose,
    OrderShortSellTypeDisplay_ShortSell,
    OrderShortSellTypeDisplay_ShortSellExempt,
    OrderPriceUnitTypeDisplay_Currency,
    OrderPriceUnitTypeDisplay_Units,
    OrderRouteAlgorithmDisplay_Market,
    OrderRouteAlgorithmDisplay_BestMarket,
    OrderRouteAlgorithmDisplay_Fix,
    OrderConditionTypeDisplay_Immediate,
    OrderConditionTypeDisplay_StopLoss,
    OrderConditionTypeDisplay_TrailingStopLoss,
    TrailingStopLossOrderConditionTypeDisplay_Price,
    TrailingStopLossOrderConditionTypeDisplay_Percent,
    HoldingFieldDisplay_Exchange,
    HoldingFieldHeading_Exchange,
    HoldingFieldDisplay_Code,
    HoldingFieldHeading_Code,
    HoldingFieldDisplay_AccountId,
    HoldingFieldHeading_AccountId,
    HoldingFieldDisplay_Style,
    HoldingFieldHeading_Style,
    HoldingFieldDisplay_Cost,
    HoldingFieldHeading_Cost,
    HoldingFieldDisplay_Currency,
    HoldingFieldHeading_Currency,
    HoldingFieldDisplay_TotalQuantity,
    HoldingFieldHeading_TotalQuantity,
    HoldingFieldDisplay_TotalAvailableQuantity,
    HoldingFieldHeading_TotalAvailableQuantity,
    HoldingFieldDisplay_AveragePrice,
    HoldingFieldHeading_AveragePrice,
    TopShareholderFieldDisplay_Name,
    TopShareholderFieldHeading_Name,
    TopShareholderFieldDisplay_Designation,
    TopShareholderFieldHeading_Designation,
    TopShareholderFieldDisplay_HolderKey,
    TopShareholderFieldHeading_HolderKey,
    TopShareholderFieldDisplay_SharesHeld,
    TopShareholderFieldHeading_SharesHeld,
    TopShareholderFieldDisplay_TotalShareIssue,
    TopShareholderFieldHeading_TotalShareIssue,
    TopShareholderFieldDisplay_SharesChanged,
    TopShareholderFieldHeading_SharesChanged,
    FeedFieldDisplay_InstanceId,
    FeedFieldHeading_InstanceId,
    FeedFieldDisplay_ClassId,
    FeedFieldHeading_ClassId,
    FeedFieldDisplay_ZenithCode,
    FeedFieldHeading_ZenithCode,
    FeedFieldDisplay_Environment,
    FeedFieldHeading_Environment,
    FeedFieldDisplay_StatusId,
    FeedFieldHeading_StatusId,
    FeedFieldDisplay_Name,
    FeedFieldHeading_Name,
    TradingFeedFieldDisplay_MarketCount,
    TradingFeedFieldHeading_MarketCount,
    TradingFeedFieldDisplay_OrderStatusCount,
    TradingFeedFieldHeading_OrderStatusCount,
    ExchangeEnvironmentFieldDisplay_ZenithCode,
    ExchangeEnvironmentFieldHeading_ZenithCode,
    ExchangeEnvironmentFieldDisplay_Display,
    ExchangeEnvironmentFieldHeading_Display,
    ExchangeEnvironmentFieldDisplay_Production,
    ExchangeEnvironmentFieldHeading_Production,
    ExchangeEnvironmentFieldDisplay_Unknown,
    ExchangeEnvironmentFieldHeading_Unknown,
    ExchangeEnvironmentFieldDisplay_Exchanges,
    ExchangeEnvironmentFieldHeading_Exchanges,
    ExchangeEnvironmentFieldDisplay_DataMarkets,
    ExchangeEnvironmentFieldHeading_DataMarkets,
    ExchangeEnvironmentFieldDisplay_TradingMarkets,
    ExchangeEnvironmentFieldHeading_TradingMarkets,
    ExchangeFieldDisplay_ZenithCode,
    ExchangeFieldHeading_ZenithCode,
    ExchangeFieldDisplay_UnenvironmentedZenithCode,
    ExchangeFieldHeading_UnenvironmentedZenithCode,
    ExchangeFieldDisplay_AbbreviatedDisplay,
    ExchangeFieldHeading_AbbreviatedDisplay,
    ExchangeFieldDisplay_FullDisplay,
    ExchangeFieldHeading_FullDisplay,
    ExchangeFieldDisplay_DisplayPriority,
    ExchangeFieldHeading_DisplayPriority,
    ExchangeFieldDisplay_Unknown,
    ExchangeFieldHeading_Unknown,
    ExchangeFieldDisplay_IsDefaultDefault,
    ExchangeFieldHeading_IsDefaultDefault,
    ExchangeFieldDisplay_ExchangeEnvironment,
    ExchangeFieldHeading_ExchangeEnvironment,
    ExchangeFieldDisplay_ExchangeEnvironmentIsDefault,
    ExchangeFieldDisplay_ExchHeadingironmentIsDefault,
    ExchangeFieldDisplay_SymbologyCode,
    ExchangeFiHeadinglay_SymbologyCode,
    ExchangeFieldDisplay_DefaultLitMarket,
    ExchangeFieldHeading_DefaultLitMarket,
    ExchangeFieldDisplay_DefaultTradingMarket,
    ExchangeFieldHeading_DefaultTradingMarket,
    ExchangeFieldDisplay_AllowedSymbolNameFieldIds,
    ExchangeFieldHeading_AllowedSymbolNameFieldIds,
    ExchangeFieldDisplay_DefaultSymbolNameFieldId,
    ExchangeFieldDisplay_HeadingSymbolNameFieldId,
    ExchangeFieldDisplay_AllowedSymbolSearchFieldIds,
    ExchangeFieldDisplay_AllHeadingbolSearchFieldIds,
    ExchangeFieldDisplay_DefaultSymbolSearchFieldIds,
    ExchangeFieldDisplay_DefHeadingbolSearchFieldIds,
    ExchangeFieldDisplay_DataMarkets,
    ExchangeFieldHeading_DataMarkets,
    ExchangeFieldDisplay_TradingMarkets,
    ExchangeFieldHeading_TradingMarkets,
    MarketFieldDisplay_ZenithCode,
    MarketFieldHeading_ZenithCode,
    MarketFieldDisplay_Name,
    MarketFieldHeading_Name,
    MarketFieldDisplay_Display,
    MarketFieldHeading_Display,
    MarketFieldDisplay_Lit,
    MarketFieldHeading_Lit,
    MarketFieldDisplay_DisplayPriority,
    MarketFieldHeading_DisplayPriority,
    MarketFieldDisplay_Unknown,
    MarketFieldHeading_Unknown,
    MarketFieldDisplay_ExchangeEnvironment,
    MarketFieldHeading_ExchangeEnvironment,
    MarketFieldDisplay_ExchangeEnvironmentIsDefault,
    MarketFieldHeading_ExchangeEnvironmentIsDefault,
    MarketFieldDisplay_Exchange,
    MarketFieldHeading_Exchange,
    MarketFieldDisplay_SymbologyCode,
    MarketFieldHeading_SymbologyCode,
    MarketFieldDisplay_SymbologyExchangeSuffixCode,
    MarketFieldHeading_SymbologyExchangeSuffixCode,
    DataMarketFieldDisplay_BestTradingMarket,
    DataMarketFieldHeading_BestTradingMarket,
    DataMarketFieldDisplay_BestLitForTradingMarkets,
    DataMarketFieldHeading_BestLitForTradingMarkets,
    DataMarketFieldDisplay_MarketBoards,
    DataMarketFieldHeading_MarketBoards,
    DataMarketFieldDisplay_FeedStatusId,
    DataMarketFieldHeading_FeedStatusId,
    DataMarketFieldDisplay_TradingDate,
    DataMarketFieldHeading_TradingDate,
    DataMarketFieldDisplay_MarketTime,
    DataMarketFieldHeading_MarketTime,
    DataMarketFieldDisplay_Status,
    DataMarketFieldHeading_Status,
    DataMarketFieldDisplay_AllowIds,
    DataMarketFieldHeading_AllowIds,
    DataMarketFieldDisplay_ReasonId,
    DataMarketFieldHeading_ReasonId,
    TradingMarketFieldDisplay_HasSymbologicalCorrespondingDataMarket,
    TradingMarketFieldHeading_HasSymbologicalCorrespondingDataMarket,
    TradingMarketFieldDisplay_Feed,
    TradingMarketFieldHeading_Feed,
    TradingMarketFieldDisplay_Attributes,
    TradingMarketFieldHeading_Attributes,
    TradingMarketFieldDisplay_BestLitDataMarket,
    TradingMarketFieldHeading_BestLitDataMarket,
    TradingMarketFieldDisplay_AllowedOrderTypeIds,
    TradingMarketFieldHeading_AllowedOrderTypeIds,
    TradingMarketFieldDisplay_DefaultOrderTypeId,
    TradingMarketFieldHeading_DefaultOrderTypeId,
    TradingMarketFieldDisplay_AllowedOrderTimeInForceIds,
    TradingMarketFieldHeading_AllowedOrderTimeInForceIds,
    TradingMarketFieldDisplay_DefaultOrderTimeInForceId,
    TradingMarketFieldHeading_DefaultOrderTimeInForceId,
    TradingMarketFieldDisplay_MarketOrderTypeAllowedTimeInForceIds,
    TradingMarketFieldHeading_MarketOrderTypeAllowedTimeInForceIds,
    TradingMarketFieldDisplay_AllowedOrderTriggerTypeIds,
    TradingMarketFieldHeading_AllowedOrderTriggerTypeIds,
    TradingMarketFieldDisplay_AllowedOrderTradeTypeIds,
    TradingMarketFieldHeading_AllowedOrderTradeTypeIds,
    MarketBoardFieldDisplay_ZenithCode,
    MarketBoardFieldHeading_ZenithCode,
    MarketBoardFieldDisplay_Name,
    MarketBoardFieldHeading_Name,
    MarketBoardFieldDisplay_Display,
    MarketBoardFieldHeading_Display,
    MarketBoardFieldDisplay_Unknown,
    MarketBoardFieldHeading_Unknown,
    MarketBoardFieldDisplay_Market,
    MarketBoardFieldHeading_Market,
    MarketBoardFieldDisplay_FeedInitialising,
    MarketBoardFieldHeading_FeedInitialising,
    MarketBoardFieldDisplay_Status,
    MarketBoardFieldHeading_Status,
    MarketBoardFieldDisplay_AllowIds,
    MarketBoardFieldHeading_AllowIds,
    MarketBoardFieldDisplay_ReasonId,
    MarketBoardFieldHeading_ReasonId,
    MarketsService_ListDisplay_Known,
    MarketsService_ListDescription_Known,
    MarketsService_ListDisplay_DefaultExchangeEnvironment,
    MarketsService_ListDescription_DefaultExchangeEnvironmentSuffix,
    MarketsService_ListDisplay_Unknown,
    MarketsService_ListDescription_Unknown,
    DepthStyleDisplay_Full,
    DepthStyleDisplay_Short,
    TradingStateAllowDisplay_OrderPlace,
    TradingStateAllowDisplay_OrderAmend,
    TradingStateAllowDisplay_OrderCancel,
    TradingStateAllowDisplay_OrderMove,
    TradingStateAllowDisplay_Match,
    TradingStateAllowDisplay_ReportCancel,
    TradingStateReasonDisplay_Unknown,
    TradingStateReasonDisplay_Normal,
    TradingStateReasonDisplay_Suspend,
    TradingStateReasonDisplay_TradingHalt,
    TradingStateReasonDisplay_NewsRelease,
    OrderStatusAllowDisplay_Trade,
    OrderStatusAllowDisplay_Amend,
    OrderStatusAllowDisplay_Cancel,
    OrderStatusAllowDisplay_Move,
    OrderStatusReasonDisplay_Unknown,
    OrderStatusReasonDisplay_Normal,
    OrderStatusReasonDisplay_Manual,
    OrderStatusReasonDisplay_Abnormal,
    OrderStatusReasonDisplay_Waiting,
    OrderStatusReason_Completed,
    TopShareholdersInputModeDisplay_Today,
    TopShareholdersInputModeDescription_Today,
    TopShareholdersInputModeDisplay_Historical,
    TopShareholdersInputModeDescription_Historical,
    TopShareholdersInputModeDisplay_Compare,
    TopShareholdersInputModeDescription_Compare,
    TopShareholdersInputModeDisplay_Details,
    TopShareholdersInputModeDescription_Details,
    TopShareholdersSymbolTitle,
    TopShareholdersTodayModeCaption,
    TopShareholdersTodayModeTitle,
    TopShareholdersHistoricalModeCaption,
    TopShareholdersHistoricalModeTitle,
    TopShareholdersCompareModeCaption,
    TopShareholdersCompareModeTitle,
    TopShareholdersDetailsModeCaption,
    TopShareholdersDetailsModeTitle,
    TopShareholdersHistoricalDate,
    TopShareholdersHistory,
    TopShareholdersInvalidHistory,
    TopShareholdersCompareFromDate,
    TopShareholdersCompareToDate,
    TopShareholdersCompare,
    TopShareholdersInvalidCompare,
    Top100Shareholders,
    ShowSelectedAlertDetailsTitle,
    AcknowledgeSelectedAlertTitle,
    DeleteSelectedAlertTitle,
    Watchlist_SymbolButtonTitle,
    Watchlist_DeleteSymbolCaption,
    Watchlist_DeleteSymbolTitle,
    Watchlist_NewCaption,
    Watchlist_NewTitle,
    Watchlist_OpenCaption,
    Watchlist_OpenTitle,
    Watchlist_SaveCaption,
    Watchlist_SaveTitle,
    Watchlist_OpenDialogCaption,
    Watchlist_SaveDialogCaption,
    Watchlist_ColumnsDialogCaption,
    Depth_InvalidFilterXrefs,
    Depth_RollUpCaption,
    Depth_RollUpToPriceLevelsTitle,
    Depth_ExpandCaption,
    Depth_ExpandToOrdersTitle,
    Depth_FilterCaption,
    Depth_FilterToXrefsTitle,
    Depth_SpecifyFilterXrefsTitle,
    Depth_ColumnsDialogCaption,
    Trades_ColumnsDialogCaption,
    DepthAndSales_ColumnsDialogCaption,
    Orders_ColumnsDialogCaption,
    Holdings_ColumnsDialogCaption,
    Balances_ColumnsDialogCaption,
    OrderAuthorise_ColumnsDialogCaption,
    Scans_ColumnsDialogCaption,
    Grid_SelectAllCaption,
    Grid_SelectAllTitle,
    Grid_SearchInputTitle,
    Grid_SearchNextCaption,
    Grid_SearchNextTitle,
    ColumnLayoutDialog_EditGridColumns,
    ColumnLayoutEditor_MoveUpCaption,
    ColumnLayoutEditor_MoveUpTitle,
    ColumnLayoutEditor_MoveTopCaption,
    ColumnLayoutEditor_MoveTopTitle,
    ColumnLayoutEditor_MoveDownCaption,
    ColumnLayoutEditor_MoveDownTitle,
    ColumnLayoutEditor_MoveBottomCaption,
    ColumnLayoutEditor_MoveBottomTitle,
    ColumnLayoutEditor_InsertCaption,
    ColumnLayoutEditor_InsertTitle,
    ColumnLayoutEditor_RemoveCaption,
    ColumnLayoutEditor_RemoveTitle,
    ColumnLayoutEditor_ShowAllRadioCaption,
    ColumnLayoutEditor_ShowAllRadioTitle,
    ColumnLayoutEditor_ShowVisibleRadioCaption,
    ColumnLayoutEditor_ShowVisibleRadioTitle,
    ColumnLayoutEditor_ShowHiddenRadioCaption,
    ColumnLayoutEditor_ShowHiddenRadioTitle,
    ColumnLayoutEditorColumns_SetWidthCaption,
    ColumnLayoutEditorColumns_SetWidthTitle,
    DataIvemIdListEditor_RemoveSelectedCaption,
    DataIvemIdListEditor_RemoveSelectedTitle,
    DataIvemIdListEditor_PopoutCaption,
    DataIvemIdListEditor_PopoutTitle,
    CallPutFieldDisplay_ExercisePrice,
    CallPutFieldHeading_ExercisePrice,
    CallPutFieldDisplay_ExpiryDate,
    CallPutFieldHeading_ExpiryDate,
    CallPutFieldDisplay_LitId,
    CallPutFieldHeading_LitId,
    CallPutFieldDisplay_CallDataIvemId,
    CallPutFieldHeading_CallDataIvemId,
    CallPutFieldDisplay_PutDataIvemId,
    CallPutFieldHeading_PutDataIvemId,
    CallPutFieldDisplay_ContractMultiplier,
    CallPutFieldHeading_ContractMultiplier,
    CallPutFieldDisplay_ExerciseTypeId,
    CallPutFieldHeading_ExerciseTypeId,
    CallPutFieldDisplay_UnderlyingIvemId,
    CallPutFieldHeading_UnderlyingIvemId,
    CallPutFieldDisplay_UnderlyingIsIndex,
    CallPutFieldHeading_UnderlyingIsIndex,
    ExerciseTypeDisplay_American,
    ExerciseTypeDisplay_Asian,
    ExerciseTypeDisplay_European,
    EtoPriceQuotationSymbolInputTitle,
    EtoPriceQuotationApplySymbolCaption,
    EtoPriceQuotationApplySymbolTitle,
    TradeAffects_None,
    TradeAffects_Price,
    TradeAffects_Volume,
    TradeAffects_Vwap,
    TradeAttribute_OffMarketTrade,
    TradeAttribute_PlaceholderTrade,
    TradeAttribute_Cancel,
    SettingsDitemGroup_GeneralCaption,
    SettingsDitemGroup_GeneralTitle,
    SettingsDitemGroup_GridCaption,
    SettingsDitemGroup_GridTitle,
    SettingsDitemGroup_OrderPadCaption,
    SettingsDitemGroup_OrderPadTitle,
    SettingsDitemGroup_ExchangesCaption,
    SettingsDitemGroup_ExchangesTitle,
    SettingsDitemGroup_ColorsCaption,
    SettingsDitemGroup_ColorsTitle,
    SettingCaption_FontFamily,
    SettingTitle_FontFamily,
    SettingCaption_FontSize,
    SettingTitle_FontSize,
    SettingCaption_ColumnHeaderFontSize,
    SettingTitle_ColumnHeaderFontSize,
    SettingCaption_Symbol_DefaultExchange,
    SettingTitle_Symbol_DefaultExchange,
    SettingCaption_Symbol_ExchangeHideMode,
    SettingTitle_Symbol_ExchangeHideMode,
    SettingCaption_Symbol_DefaultMarketHidden,
    SettingTitle_Symbol_DefaultMarketHidden,
    SettingCaption_Symbol_MarketCodeAsLocalWheneverPossible,
    SettingTitle_Symbol_MarketCodeAsLocalWheneverPossible,
    SettingCaption_Symbol_ZenithSymbologySupportLevel,
    SettingTitle_Symbol_ZenithSymbologySupportLevel,
    SettingCaption_Control_DropDownEditableSearchTerm,
    SettingTitle_Control_DropDownEditableSearchTerm,
    SettingCaption_Format_NumberGroupingActive,
    SettingTitle_Format_NumberGroupingActive,
    SettingCaption_Format_MinimumPriceFractionDigitsCount,
    SettingTitle_Format_MinimumPriceFractionDigitsCount,
    SettingCaption_Format_24Hour,
    SettingTitle_Format_24Hour,
    SettingCaption_Format_DateTimeTimezoneModeId,
    SettingTitle_Format_DateTimeTimezoneModeId,
    SettingCaption_Symbol_ExplicitSearchFieldsEnabled,
    SettingTitle_Symbol_ExplicitSearchFieldsEnabled,
    SettingCaption_Symbol_ExplicitSearchFields,
    SettingTitle_Symbol_ExplicitSearchFields,
    SettingCaption_Master_Test,
    SettingTitle_Master_Test,
    SettingCaption_Master_OperatorDefaultExchangeEnvironmentSpecific,
    SettingTitle_Master_OperatorDefaultExchangeEnvironmentSpecific,
    SettingCaption_Grid_RowHeight,
    SettingTitle_Grid_RowHeight,
    SettingCaption_Grid_HorizontalLinesVisible,
    SettingTitle_Grid_HorizontalLinesVisible,
    SettingCaption_Grid_VerticalLinesVisible,
    SettingTitle_Grid_VerticalLinesVisible,
    SettingCaption_Grid_VerticalLinesVisibleInHeaderOnly,
    SettingTitle_Grid_VerticalLinesVisibleInHeaderOnly,
    SettingCaption_Grid_HorizontalLineWidth,
    SettingTitle_Grid_HorizontalLineWidth,
    SettingCaption_Grid_VerticalLineWidth,
    SettingTitle_Grid_VerticalLineWidth,
    SettingCaption_Grid_CellPadding,
    SettingTitle_Grid_CellPadding,
    SettingCaption_Grid_ChangedAllHighlightDuration,
    SettingTitle_Grid_ChangedAllHighlightDuration,
    SettingCaption_Grid_AddedRowHighlightDuration,
    SettingTitle_Grid_AddedRowHighlightDuration,
    SettingCaption_Grid_ChangedRowRecordHighlightDuration,
    SettingTitle_Grid_ChangedRowRecordHighlightDuration,
    SettingCaption_Grid_ChangedValueHighlightDuration,
    SettingTitle_Grid_ChangedValueHighlightDuration,
    SettingCaption_Grid_FocusedRowColored,
    SettingTitle_Grid_FocusedRowColored,
    SettingCaption_Grid_FocusedRowBordered,
    SettingTitle_Grid_FocusedRowBordered,
    SettingCaption_Grid_FocusedRowBorderWidth,
    SettingTitle_Grid_FocusedRowBorderWidth,
    SettingCaption_Grid_SmoothHorizontalScrolling,
    SettingTitle_Grid_SmoothHorizontalScrolling,
    SettingCaption_Grid_HorizontalScrollbarWidth,
    SettingTitle_Grid_HorizontalScrollbarWidth,
    SettingCaption_Grid_VerticalScrollbarWidth,
    SettingTitle_Grid_VerticalScrollbarWidth,
    SettingCaption_Grid_ScrollbarMargin,
    SettingTitle_Grid_ScrollbarMargin,
    SettingCaption_Grid_ScrollbarThumbInactiveOpacity,
    SettingTitle_Grid_ScrollbarThumbInactiveOpacity,
    SettingCaption_OrderPad_ReviewEnabled,
    SettingTitle_OrderPad_ReviewEnabled,
    SettingCaption_OrderPad_DefaultOrderTypeId,
    SettingTitle_OrderPad_DefaultOrderTypeId,
    SettingCaption_Exchange_SymbolSearchFields,
    SettingTitle_Exchange_SymbolSearchFields,
    SettingCaption_Exchange_SymbolNameField,
    SettingTitle_Exchange_SymbolNameField,
    DefaultOrderTypeIdNotSpecified,
    SettingCaption_OrderPad_DefaultTimeInForceId,
    SettingTitle_OrderPad_DefaultTimeInForceId,
    DefaultTimeInForceIdNotSpecified,
    ColorGridHeading_ItemId,
    ColorGridHeading_Name,
    ColorGridHeading_Display,
    ColorGridHeading_ItemBkgdColorText,
    ColorGridHeading_ResolvedBkgdColorText,
    ColorGridHeading_ItemForeColorText,
    ColorGridHeading_ResolvedForeColorText,
    ColorGridHeading_ItemBkgdColor,
    ColorGridHeading_ResolvedBkgdColor,
    ColorGridHeading_ItemForeColor,
    ColorGridHeading_ResolvedForeColor,
    ColorGridHeading_NotHasBkgd,
    ColorGridHeading_NotHasFore,
    ColorGridHeading_Readability,
    ColorGridHeading_IsReadable,
    LogLevel_Info,
    LogLevel_Warning,
    LogLevel_Error,
    LogLevel_Severe,
    LogLevel_Debug,
    ZenithPublisherStateDisplay_Initialise,
    ZenithPublisherStateDisplay_ReconnectDelay,
    ZenithPublisherStateDisplay_AccessTokenWaiting,
    ZenithPublisherStateDisplay_SocketOpen,
    ZenithPublisherStateDisplay_AuthFetch,
    ZenithPublisherStateDisplay_AuthActive,
    ZenithPublisherStateDisplay_AuthUpdate,
    ZenithPublisherStateDisplay_SocketClose,
    ZenithPublisherStateDisplay_Finalised,
    ZenithPublisherReconnectReasonDisplay_NewEndpoints,
    ZenithPublisherReconnectReasonDisplay_PassportTokenFailure,
    ZenithPublisherReconnectReasonDisplay_SocketConnectingError,
    ZenithPublisherReconnectReasonDisplay_AuthRejected,
    ZenithPublisherReconnectReasonDisplay_AuthExpired,
    ZenithPublisherReconnectReasonDisplay_UnexpectedSocketClose,
    ZenithPublisherReconnectReasonDisplay_SocketClose,
    ZenithPublisherReconnectReasonDisplay_Timeout,
    SessionManagerStateDisplay_NotStarted,
    SessionManagerStateDisplay_Starting,
    SessionManagerStateDisplay_Online,
    SessionManagerStateDisplay_Offline,
    SessionManagerStateDisplay_Finalising,
    SessionManagerStateDisplay_Finalised,
    ColorSettingsItemStateDisplay_Never,
    ColorSettingsItemStateDisplay_Inherit,
    ColorSettingsItemStateDisplay_Value,
    OrderPadFieldDisplay_RequestType,
    OrderPadFieldDisplay_ProductIdentificationType,
    OrderPadFieldDisplay_AccountId,
    OrderPadFieldDisplay_BrokerageAccountsDataItemReady,
    OrderPadFieldDisplay_BrokerageCode,
    OrderPadFieldDisplay_BrokerageScheduleDataItemReady,
    OrderPadFieldDisplay_AccountDefaultBrokerageCode,
    OrderPadFieldDisplay_BrokerageCodeListReady,
    OrderPadFieldDisplay_LinkId,
    OrderPadFieldDisplay_Brokerage,
    OrderPadFieldDisplay_ExpiryDate,
    OrderPadFieldDisplay_InstructionTime,
    OrderPadFieldDisplay_SymbolAndSource,
    OrderPadFieldDisplay_SymbolPriceStepSegmentsDataItemReady,
    OrderPadFieldDisplay_Srn,
    OrderPadFieldDisplay_LocateReqd,
    OrderPadFieldDisplay_Algo,
    OrderPadFieldDisplay_VisibleQuantity,
    OrderPadFieldDisplay_MinimumQuantity,
    OrderPadFieldDisplay_ExecutionInstructions,
    OrderPadFieldDisplay_OrderType,
    OrderPadFieldDisplay_TriggerTypeId,
    OrderPadFieldDisplay_Previewed,
    OrderPadFieldDisplay_TotalQuantity,
    OrderPadFieldDisplay_OrigRequestId,
    OrderPadFieldDisplay_OrderGivenBy,
    OrderPadFieldDisplay_OrderGiversDataItemReady,
    OrderPadFieldDisplay_OrderTakenBy,
    OrderPadFieldDisplay_LimitValue,
    OrderPadFieldDisplay_LimitUnit,
    OrderPadFieldDisplay_TriggerValue,
    OrderPadFieldDisplay_TriggerUnit,
    OrderPadFieldDisplay_TriggerField,
    OrderPadFieldDisplay_TriggerMovement,
    OrderPadFieldDisplay_Side,
    OrderPadFieldDisplay_RoaNoAdvice,
    OrderPadFieldDisplay_RoaNotes,
    OrderPadFieldDisplay_SoaRequired,
    OrderPadFieldDisplay_RoaMethod,
    OrderPadFieldDisplay_RoaJustification,
    OrderPadFieldDisplay_RoaDeclarations,
    OrderPadFieldDisplay_RoaDeclarationDefinitionsDataItemReady,
    OrderPadFieldDisplay_Tax,
    OrderPadFieldDisplay_TimeInForce,
    OrderPadFieldDisplay_TmcLegCount,
    OrderPadFieldDisplay_TmcLeg0SymbolAndSource,
    OrderPadFieldDisplay_TmcLeg0Ratio,
    OrderPadFieldDisplay_TmcLeg0BuyOrSell,
    OrderPadFieldDisplay_TmcLeg1SymbolAndSource,
    OrderPadFieldDisplay_TmcLeg1Ratio,
    OrderPadFieldDisplay_TmcLeg1BuyOrSell,
    OrderPadFieldDisplay_TmcLeg2SymbolAndSource,
    OrderPadFieldDisplay_TmcLeg2Ratio,
    OrderPadFieldDisplay_TmcLeg2BuyOrSell,
    OrderPadFieldDisplay_TmcLeg3SymbolAndSource,
    OrderPadFieldDisplay_TmcLeg3Ratio,
    OrderPadFieldDisplay_TmcLeg3BuyOrSell,
    OrderPadFieldDisplay_TmcMaxLegRatioCommonFactor,
    OrderPadFieldDisplay_OmsServiceOnline,
    OrderPadFieldDisplay_Status,
    OrderPadFieldDisplay_CurrentOmsOrderId,
    OrderPadFieldDisplay_WorkOmsOrderId,
    OrderPadFieldDisplay_LoadedLeavesQuantity,
    OrderPadFieldDisplay_AccountTradePermissions,
    OrderPadFieldDisplay_ExistingOrderId,
    OrderPadFieldDisplay_DestinationAccount,
    OrderPadFieldStatusReasonDescription_Unknown,
    OrderPadFieldStatusReasonDescription_Initial,
    OrderPadFieldStatusReasonDescription_ValueRequired,
    OrderPadFieldStatusReasonDescription_ValueNotRequired,
    OrderPadFieldStatusReasonDescription_OmsServiceNotOnline,
    OrderPadFieldStatusReasonDescription_NegativeValueNotAllowed,
    OrderPadFieldStatusReasonDescription_ZeroOrNegativeValueNotAllowed,
    OrderPadFieldStatusReasonDescription_InvalidQuantityForDestination,
    OrderPadFieldStatusReasonDescription_InvalidAccountId,
    OrderPadFieldStatusReasonDescription_AccountNoLongerAvailable,
    OrderPadFieldStatusReasonDescription_AccountFeedStatus_Initialising,
    OrderPadFieldStatusReasonDescription_AccountFeedStatus_Closed,
    OrderPadFieldStatusReasonDescription_AccountFeedStatus_Inactive,
    OrderPadFieldStatusReasonDescription_AccountFeedStatus_Impaired,
    OrderPadFieldStatusReasonDescription_AccountFeedStatus_Expired,
    OrderPadFieldStatusReasonDescription_SymbolNotFound,
    OrderPadFieldStatusReasonDescription_WorkOrdersNotAllowed,
    OrderPadFieldStatusReasonDescription_ViewWorkOrdersNotAllowed,
    OrderPadFieldStatusReasonDescription_NotBackOfficeScreens,
    OrderPadFieldStatusReasonDescription_NotCanSelectBrokerage,
    OrderPadFieldStatusReasonDescription_Place,
    OrderPadFieldStatusReasonDescription_Amend,
    OrderPadFieldStatusReasonDescription_Cancel,
    OrderPadFieldStatusReasonDescription_Move,
    OrderPadFieldStatusReasonDescription_NotMove,
    OrderPadFieldStatusReasonDescription_Work,
    OrderPadFieldStatusReasonDescription_NotWork,
    OrderPadFieldStatusReasonDescription_Linked,
    OrderPadFieldStatusReasonDescription_NotIceberg,
    OrderPadFieldStatusReasonDescription_AmendLinked,
    OrderPadFieldStatusReasonDescription_AccountNotFound,
    OrderPadFieldStatusReasonDescription_AccountDoesNotHaveDefaultBrokerageCode,
    OrderPadFieldStatusReasonDescription_NotManualBrokerageCode,
    OrderPadFieldStatusReasonDescription_RetrievingAccount,
    OrderPadFieldStatusReasonDescription_BrokerageScheduleDataItemNotReady,
    OrderPadFieldStatusReasonDescription_BrokerageCodeListNotReady,
    OrderPadFieldStatusReasonDescription_BrokerageCodeNotInSchedule,
    OrderPadFieldStatusReasonDescription_ForceWorkOrder,
    OrderPadFieldStatusReasonDescription_NotLimitOrderType,
    OrderPadFieldStatusReasonDescription_MarketAndStopOrderTypeAreAlwaysFillOrKill,
    OrderPadFieldStatusReasonDescription_RoaDeclarationDefinitionsDataItemNotReady,
    OrderPadFieldStatusReasonDescription_PriceNotOnStep,
    OrderPadFieldStatusReasonDescription_NotRoaEnabled,
    OrderPadFieldStatusReasonDescription_RoaNoAdvice,
    OrderPadFieldStatusReasonDescription_IvemId,
    OrderPadFieldStatusReasonDescription_TriggerType,
    OrderPadFieldStatusReasonDescription_TriggerTypeNotDefined,
    OrderPadFieldStatusReasonDescription_ImmediateTriggerType,
    OrderPadFieldStatusReasonDescription_SymbolPriceStepSegmentsDataItemNotReady,
    OrderPadFieldStatusReasonDescription_LeafSymbolSourceNotSupported,
    OrderPadFieldStatusReasonDescription_RootSymbolSourceNotSupported,
    OrderPadFieldStatusReasonDescription_SymbolsNotAvailable,
    OrderPadFieldStatusReasonDescription_RetrievingSymbolDetail,
    OrderPadFieldStatusReasonDescription_RetrieveSymbolDetailError,
    OrderPadFieldStatusReasonDescription_SymbolNotOk,
    OrderPadFieldStatusReasonDescription_RetrievePriceStepperError,
    OrderPadFieldStatusReasonDescription_RetrievingPriceStepper,
    OrderPadFieldStatusReasonDescription_PriceOrSegmentsNotAvailable,
    OrderPadFieldStatusReasonDescription_TradingNotPermissioned,
    OrderPadFieldStatusReasonDescription_AsxOrderAlgosNotPermissioned,
    OrderPadFieldStatusReasonDescription_StopOrderRequestsNotPermissioned,
    OrderPadFieldStatusReasonDescription_ProductIdentificationType,
    OrderPadFieldStatusReasonDescription_NotUsedInTmc,
    OrderPadFieldStatusReasonDescription_TmcOnlySupportNewRequestType,
    OrderPadFieldStatusReasonDescription_OnlyUsedInTmc,
    OrderPadFieldStatusReasonDescription_TmcLegCountNotSpecified,
    OrderPadFieldStatusReasonDescription_BeyondTmcLegCount,
    OrderPadFieldStatusReasonDescription_OrderTypeNotSpecified,
    OrderPadFieldStatusReasonDescription_AlgoNotSpecified,
    OrderPadFieldStatusReasonDescription_ValueMustNotExceedMaxTmcLegRatio,
    OrderPadFieldStatusReasonDescription_NotAllTmcLegRatiosValid,
    OrderPadFieldStatusReasonDescription_TmcMaxLegRatioCommonFactorNotOne,
    OrderPadFieldStatusReasonDescription_OnlySellStopAllowed,
    OrderPadFieldStatusReasonDescription_NotSupportedByOrderType,
    OrderPadFieldStatusReasonDescription_NotSupportedBySymbol,
    OrderPadFieldStatusReasonDescription_TimeInForceNotSpecified,
    OrderPadFieldStatusReasonDescription_TodayOrFutureDateRequired,
    OrderPadFieldStatusReasonDescription_TimeInForceDoesNotRequireDate,
    OrderPadFieldStatusReasonDescription_AsxEtoTmcSymbolMissingUnderlyingIsIndex,
    OrderPadFieldStatusReasonDescription_SymbolHasNoTradingMarkets,
    OrderPadFieldStatusReasonDescription_SymbolDoesNotSupportTradingMarket,
    OrderPadFieldStatusReasonDescription_TmcNotInAsxTmcMarket,
    OrderPadFieldStatusReasonDescription_Snapshot,
    OrderPadFieldStatusReasonDescription_ValueOutOfRange,
    OrderPadFieldStatusReasonDescription_MyxSymbolIsMissingBoardLotSize,
    OrderPadFieldStatusReasonDescription_SideNotValid,
    OrderPadFieldStatusReasonDescription_BuyNotPermissioned,
    OrderPadFieldStatusReasonDescription_SellNotPermissioned,
    OrderPadFieldStatusReasonDescription_QuantityNotAMultiple,
    OrderPadFieldStatusReasonDescription_OrderNotFound,
    OrderPadFieldStatusReasonDescription_OrderCannotBeAmended,
    OrderPadFieldStatusReasonDescription_OrderCannotBeCancelled,
    OrderPadFieldStatusReasonDescription_OrderCannotBeMoved,
    OrderTriggerTypeDisplay_Immediate,
    OrderTriggerTypeDisplay_Price,
    OrderTriggerTypeDisplay_TrailingPrice,
    OrderTriggerTypeDisplay_PercentageTrailingPrice,
    OrderTriggerTypeDisplay_Overnight,
    OrderTriggerTypeAbbreviation_Immediate,
    OrderTriggerTypeAbbreviation_Price,
    OrderTriggerTypeAbbreviation_TrailingPrice,
    OrderTriggerTypeAbbreviation_PercentageTrailingPrice,
    OrderTriggerTypeAbbreviation_Overnight,
    OrderRequestTypeDisplay_Place,
    OrderRequestTypeDisplay_Amend,
    OrderRequestTypeDisplay_Cancel,
    OrderRequestTypeDisplay_Move,
    OrderRequestResultDisplay_Success,
    OrderRequestResultDisplay_Error,
    OrderRequestResultDisplay_Incomplete,
    OrderRequestResultDisplay_Invalid,
    OrderRequestResultDisplay_Rejected,
    OrderRequestErrorCodeDisplay_Unknown,
    OrderRequestErrorCodeDisplay_Account,
    OrderRequestErrorCodeDisplay_Account_DailyNet,
    OrderRequestErrorCodeDisplay_Account_DailyGross,
    OrderRequestErrorCodeDisplay_Authority,
    OrderRequestErrorCodeDisplay_Connection,
    OrderRequestErrorCodeDisplay_Details,
    OrderRequestErrorCodeDisplay_Error,
    OrderRequestErrorCodeDisplay_Exchange,
    OrderRequestErrorCodeDisplay_Internal,
    OrderRequestErrorCodeDisplay_Internal_NotFound,
    OrderRequestErrorCodeDisplay_Order,
    OrderRequestErrorCodeDisplay_Operation,
    OrderRequestErrorCodeDisplay_Retry,
    OrderRequestErrorCodeDisplay_Route,
    OrderRequestErrorCodeDisplay_Route_Algorithm,
    OrderRequestErrorCodeDisplay_Route_Market,
    OrderRequestErrorCodeDisplay_Route_Symbol,
    OrderRequestErrorCodeDisplay_Status,
    OrderRequestErrorCodeDisplay_Style,
    OrderRequestErrorCodeDisplay_Submitted,
    OrderRequestErrorCodeDisplay_Symbol,
    OrderRequestErrorCodeDisplay_Symbol_Authority,
    OrderRequestErrorCodeDisplay_Symbol_Status,
    OrderRequestErrorCodeDisplay_TotalValue_Balance,
    OrderRequestErrorCodeDisplay_TotalValue_Maximum,
    OrderRequestErrorCodeDisplay_ExpiryDate,
    OrderRequestErrorCodeDisplay_HiddenQuantity,
    OrderRequestErrorCodeDisplay_HiddenQuantity_Symbol,
    OrderRequestErrorCodeDisplay_LimitPrice,
    OrderRequestErrorCodeDisplay_LimitPrice_Distance,
    OrderRequestErrorCodeDisplay_LimitPrice_Given,
    OrderRequestErrorCodeDisplay_LimitPrice_Maximum,
    OrderRequestErrorCodeDisplay_LimitPrice_Missing,
    OrderRequestErrorCodeDisplay_MinimumQuantity,
    OrderRequestErrorCodeDisplay_MinimumQuantity_Symbol,
    OrderRequestErrorCodeDisplay_OrderType,
    OrderRequestErrorCodeDisplay_OrderType_Market,
    OrderRequestErrorCodeDisplay_OrderType_Status,
    OrderRequestErrorCodeDisplay_OrderType_Symbol,
    OrderRequestErrorCodeDisplay_Side,
    OrderRequestErrorCodeDisplay_Side_Maximum,
    OrderRequestErrorCodeDisplay_TotalQuantity,
    OrderRequestErrorCodeDisplay_TotalQuantity_Minimum,
    OrderRequestErrorCodeDisplay_TotalQuantity_Holdings,
    OrderRequestErrorCodeDisplay_Validity,
    OrderRequestErrorCodeDisplay_Validity_Symbol,
    OrderRequestErrorCodeDisplay_VisibleQuantity,
    OrderRequestErrorCodeDisplay_TotalQuantity_Maximum,
    OrderRequestErrorCodeDisplay_UnitType,
    OrderRequestErrorCodeDisplay_UnitAmount,
    OrderRequestErrorCodeDisplay_Currency,
    OrderRequestErrorCodeDisplay_Flags_PDS,
    OrderPadAccountCaption,
    OrderPadSideTitle_Buy,
    OrderPadSideTitle_Sell,
    OrderPadSideTitle_IntraDayShortSell,
    OrderPadSideTitle_RegulatedShortSell,
    OrderPadSideTitle_ProprietaryShortSell,
    OrderPadSideTitle_ProprietaryDayTrade,
    OrderPadSideTitle,
    OrderPadSideCaption,
    OrderPadSymbolTitle,
    OrderPadSymbolCaption,
    OrderPadRouteTitle,
    OrderPadTotalQuantityTitle,
    OrderPadTotalQuantityCaption,
    OrderPadOrderTypeTitle_Market,
    OrderPadOrderTypeTitle_MarketToLimit,
    OrderPadOrderTypeTitle_Limit,
    OrderPadOrderTypeTitle_MarketAtBest,
    OrderPadOrderTypeTitle,
    OrderPadOrderTypeCaption,
    OrderPadLimitValueTitle,
    OrderPadLimitValueCaption,
    OrderPadLimitUnitTitle,
    OrderPadTriggerTypeTitle_Immediate,
    OrderPadTriggerTypeTitle_Price,
    OrderPadTriggerTypeTitle_TrailingPrice,
    OrderPadTriggerTypeTitle_PercentageTrailingPrice,
    OrderPadTriggerTypeTitle_Overnight,
    OrderPadTriggerTitle,
    OrderPadTriggerCaption,
    OrderPadTriggerValueTitle,
    OrderPadTriggerValueCaption,
    OrderPadTriggerFieldTitle_Last,
    OrderPadTriggerFieldTitle_BestBid,
    OrderPadTriggerFieldTitle_BestAsk,
    OrderPadTriggerFieldTitle,
    OrderPadTriggerFieldCaption,
    OrderApiTriggerMovementTitle_None,
    OrderApiTriggerMovementTitle_Up,
    OrderApiTriggerMovementTitle_Down,
    OrderPadTriggerMovementTitle,
    OrderPadTriggerMovementCaption,
    OrderPadTimeInForceTitle_Day,
    OrderPadTimeInForceTitle_GoodTillCancel,
    OrderPadTimeInForceTitle_AtTheOpening,
    OrderPadTimeInForceTitle_FillAndKill,
    OrderPadTimeInForceTitle_FillOrKill,
    OrderPadTimeInForceTitle_AllOrNone,
    OrderPadTimeInForceTitle_GoodTillCrossing,
    OrderPadTimeInForceTitle_GoodTillDate,
    OrderPadTimeInForceTitle_AtTheClose,
    OrderPadTimeInForceTitle,
    OrderPadTimeInForceCaption,
    OrderPadExpiryDateTitle,
    OrderPadExpiryDateCaption,
    OrderPadExistingOrderIdTitle,
    OrderPadExistingOrderIdCaption,
    OrderPadDestinationAccountTitle,
    OrderPadDestinationAccountCaption,
    OrderPadErrorsCaption,
    OrderRequest_PrimaryCaption,
    OrderRequest_PrimaryTitle,
    OrderRequest_ReviewZenithMessageActiveCaption,
    OrderRequest_ReviewZenithMessageActiveTitle,
    OrderRequest_NewCaption,
    OrderRequest_NewTitle,
    OrderRequest_NewAmendPossibleFlagChar,
    OrderRequest_BackCaption,
    OrderRequest_BackTitle,
    OrderRequest_ReviewCaption,
    OrderRequest_ReviewTitle,
    OrderRequest_SendCaption,
    OrderRequest_SendTitle,
    SymbolCache_UnresolvedRequestTimedOut,
    OrderRequestResultStatusDisplay_Waiting,
    OrderRequestResultStatusDisplay_CommunicateError,
    OrderRequestResultStatusDisplay_Success,
    OrderRequestResultStatusDisplay_Error,
    OrderRequestResultStatusDisplay_Incomplete,
    OrderRequestResultStatusDisplay_Invalid,
    OrderRequestResultStatusDisplay_Rejected,
    OrderRequestResultTitle_Status,
    OrderRequestResultCaption_Status,
    OrderRequestResultTitle_OrderId,
    OrderRequestResultCaption_OrderId,
    OrderRequestResultTitle_Errors,
    OrderRequestResultCaption_Errors,
    ColorSelector_HideInPickerCaption,
    ColorSelector_HideInPickerTitle,
    ColorSelector_ItemColorTypeCaption,
    ColorSelector_ItemColorTypeTitle,
    ColorSelector_OpaqueCaption,
    ColorSelector_OpaqueTitle,
    ColorSelector_TransparentCaption,
    ColorSelector_TransparentTitle,
    ColorSelector_UseInheritedCaption,
    ColorSelector_UseInheritedTitle,
    ColorSelector_LightenCaption,
    ColorSelector_LightenTitle,
    ColorSelector_DarkenCaption,
    ColorSelector_DarkenTitle,
    ColorSelector_BrightenCaption,
    ColorSelector_BrightenTitle,
    ColorSelector_ComplementCaption,
    ColorSelector_ComplementTitle,
    ColorSelector_SaturateCaption,
    ColorSelector_SaturateTitle,
    ColorSelector_DesaturateCaption,
    ColorSelector_DesaturateTitle,
    ColorSelector_SpinCaption,
    ColorSelector_SpinTitle,
    ColorSelector_CopyCaption,
    ColorSelector_CopyTitle,
    ColorSelector_HexCaption,
    ColorSelector_HexTitle,
    ColorSelector_HueCaption,
    ColorSelector_HueTitle,
    ColorSelector_SaturationCaption,
    ColorSelector_SaturationTitle,
    ColorSelector_ValueCaption,
    ColorSelector_ValueTitle,
    ColorSelector_RedCaption,
    ColorSelector_RedTitle,
    ColorSelector_GreenCaption,
    ColorSelector_GreenTitle,
    ColorSelector_BlueCaption,
    ColorSelector_BlueTitle,
    ColorSchemeItemProperties_ReadabilityTitle,
    ColorSchemeItemProperties_ReadabilityCaption,
    ColorSchemeItemProperties_PickerTypeTitle,
    ColorSchemeItemProperties_PickerTypeCaption,
    ColorSchemeItemProperties_HueSaturationCaption,
    ColorSchemeItemProperties_HueSaturationTitle,
    ColorSchemeItemProperties_ValueSaturationCaption,
    ColorSchemeItemProperties_ValueSaturationTitle,
    ApplicationEnvironmentSelectorDisplay_Default,
    ApplicationEnvironmentSelectorTitle_Default,
    ApplicationEnvironmentSelectorDisplay_DataEnvironment,
    ApplicationEnvironmentSelectorTitle_DataEnvironment,
    ApplicationEnvironmentSelectorDisplay_DataEnvironment_Sample,
    ApplicationEnvironmentSelectorTitle_DataEnvironment_Sample,
    ApplicationEnvironmentSelectorDisplay_DataEnvironment_Demo,
    ApplicationEnvironmentSelectorTitle_DataEnvironment_Demo,
    ApplicationEnvironmentSelectorDisplay_DataEnvironment_Delayed,
    ApplicationEnvironmentSelectorTitle_DataEnvironment_Delayed,
    ApplicationEnvironmentSelectorDisplay_DataEnvironment_Production,
    ApplicationEnvironmentSelectorTitle_DataEnvironment_Production,
    ApplicationEnvironmentSelectorDisplay_Test,
    ApplicationEnvironmentSelectorTitle_Test,
    SymbolExchangeHideModeDisplay_Never,
    SymbolExchangeHideModeDescription_Never,
    SymbolExchangeHideModeDisplay_Default,
    SymbolExchangeHideModeDescription_Default,
    SymbolExchangeHideModeDisplay_WheneverPossible,
    SymbolExchangeHideModeDescription_WheneverPossible,
    ZenithSymbologySupportLevelDisplay_None,
    ZenithSymbologySupportLevelDescription_None,
    ZenithSymbologySupportLevelDisplay_Parse,
    ZenithSymbologySupportLevelDescription_Parse,
    ZenithSymbologySupportLevelDisplay_ParseAndDisplay,
    ZenithSymbologySupportLevelDescription_ParseAndDisplay,
    BalancesFieldDisplay_AccountId,
    BalancesFieldHeading_AccountId,
    BalancesFieldDisplay_CurrencyId,
    BalancesFieldHeading_CurrencyId,
    BalancesFieldDisplay_NetBalance,
    BalancesFieldHeading_NetBalance,
    BalancesFieldDisplay_Trading,
    BalancesFieldHeading_Trading,
    BalancesFieldDisplay_NonTrading,
    BalancesFieldHeading_NonTrading,
    BalancesFieldDisplay_UnfilledBuys,
    BalancesFieldHeading_UnfilledBuys,
    BalancesFieldDisplay_Margin,
    BalancesFieldHeading_Margin,
    BaseDataIvemDetailDisplay_Id,
    BaseDataIvemDetailHeading_Id,
    BaseDataIvemDetailDisplay_Code,
    BaseDataIvemDetailHeading_Code,
    BaseDataIvemDetailDisplay_Market,
    BaseDataIvemDetailHeading_Market,
    BaseDataIvemDetailDisplay_IvemClassId,
    BaseDataIvemDetailHeading_IvemClassId,
    BaseDataIvemDetailDisplay_SubscriptionDataTypeIds,
    BaseDataIvemDetailHeading_SubscriptionDataTypeIds,
    BaseDataIvemDetailDisplay_TradingMarkets,
    BaseDataIvemDetailHeading_TradingMarkets,
    BaseDataIvemDetailDisplay_Name,
    BaseDataIvemDetailHeading_Name,
    BaseDataIvemDetailDisplay_Exchange,
    BaseDataIvemDetailHeading_Exchange,
    ExtendedDataIvemDetailDisplay_Cfi,
    ExtendedDataIvemDetailHeading_Cfi,
    ExtendedDataIvemDetailDisplay_DepthDirectionId,
    ExtendedDataIvemDetailHeading_DepthDirectionId,
    ExtendedDataIvemDetailDisplay_IsIndex,
    ExtendedDataIvemDetailHeading_IsIndex,
    ExtendedDataIvemDetailDisplay_ExpiryDate,
    ExtendedDataIvemDetailHeading_ExpiryDate,
    ExtendedDataIvemDetailDisplay_StrikePrice,
    ExtendedDataIvemDetailHeading_StrikePrice,
    ExtendedDataIvemDetailDisplay_ExerciseTypeId,
    ExtendedDataIvemDetailHeading_ExerciseTypeId,
    ExtendedDataIvemDetailDisplay_CallOrPutId,
    ExtendedDataIvemDetailHeading_CallOrPutId,
    ExtendedDataIvemDetailDisplay_ContractSize,
    ExtendedDataIvemDetailHeading_ContractSize,
    ExtendedDataIvemDetailDisplay_LotSize,
    ExtendedDataIvemDetailHeading_LotSize,
    ExtendedDataIvemDetailDisplay_Attributes,
    ExtendedDataIvemDetailHeading_Attributes,
    ExtendedDataIvemDetailDisplay_TmcLegs,
    ExtendedDataIvemDetailHeading_TmcLegs,
    ExtendedDataIvemDetailDisplay_Categories,
    ExtendedDataIvemDetailHeading_Categories,
    ExtendedDataIvemDetailDisplay_AlternateCodes,
    ExtendedDataIvemDetailHeading_AlternateCodes,
    MyxDataIvemAttributesDisplay_Category,
    MyxDataIvemAttributesHeading_Category,
    MyxDataIvemAttributesDisplay_MarketClassification,
    MyxDataIvemAttributesHeading_MarketClassification,
    MyxDataIvemAttributesDisplay_DeliveryBasis,
    MyxDataIvemAttributesHeading_DeliveryBasis,
    MyxDataIvemAttributesDisplay_MaxRSS,
    MyxDataIvemAttributesHeading_MaxRSS,
    MyxDataIvemAttributesDisplay_Sector,
    MyxDataIvemAttributesHeading_Sector,
    MyxDataIvemAttributesDisplay_Short,
    MyxDataIvemAttributesHeading_Short,
    MyxDataIvemAttributesDisplay_ShortSuspended,
    MyxDataIvemAttributesHeading_ShortSuspended,
    MyxDataIvemAttributesDisplay_SubSector,
    MyxDataIvemAttributesHeading_SubSector,
    DataIvemAlternateCodeDisplay_Ticker,
    DataIvemAlternateCodeHeading_Ticker,
    DataIvemAlternateCodeDisplay_Gics,
    DataIvemAlternateCodeHeading_Gics,
    DataIvemAlternateCodeDisplay_Isin,
    DataIvemAlternateCodeHeading_Isin,
    DataIvemAlternateCodeDisplay_Ric,
    DataIvemAlternateCodeHeading_Ric,
    DataIvemAlternateCodeDisplay_Base,
    DataIvemAlternateCodeHeading_Base,
    DataIvemAlternateCodeDisplay_Short,
    DataIvemAlternateCodeHeading_Short,
    DataIvemAlternateCodeDisplay_Long,
    DataIvemAlternateCodeHeading_Long,
    DataIvemAlternateCodeDisplay_Uid,
    DataIvemAlternateCodeHeading_Uid,
    DepthDirectionDisplay_BidBelowAsk,
    DepthDirectionDisplay_AskBelowBid,
    MyxMarketClassificationDisplay_Main,
    MyxMarketClassificationDisplay_Ace,
    MyxMarketClassificationDisplay_Etf,
    MyxMarketClassificationDisplay_Strw,
    MyxMarketClassificationDisplay_Bond,
    MyxMarketClassificationDisplay_Leap,
    MyxShortSellTypeDisplay_RegulatedShortSelling,
    MyxShortSellTypeDisplay_ProprietaryDayTrading,
    MyxShortSellTypeDisplay_IntraDayShortSelling,
    MyxShortSellTypeDisplay_ProprietaryShortSelling,
    MyxCategoryDisplay_Foreign,
    MyxCategoryDisplay_Sharia,
    MyxDeliveryBasisDisplay_BuyingInT0,
    MyxDeliveryBasisDisplay_DesignatedBasisT1,
    MyxDeliveryBasisDisplay_ReadyBasisT2,
    MyxDeliveryBasisDisplay_ImmediateBasisT1,
    SearchSymbolsIndicesInclusion_ExcludeCaption,
    SearchSymbolsIndicesInclusion_ExcludeTitle,
    SearchSymbolsIndicesInclusion_IncludeCaption,
    SearchSymbolsIndicesInclusion_IncludeTitle,
    SearchSymbolsIndicesInclusion_OnlyCaption,
    SearchSymbolsIndicesInclusion_OnlyTitle,
    QuerySymbolsDataDefinitionFieldDisplay_Code,
    QuerySymbolsDataDefinitionFieldDescription_Code,
    QuerySymbolsDataDefinitionFieldDisplay_Name,
    QuerySymbolsDataDefinitionFieldDescription_Name,
    QuerySymbolsDataDefinitionFieldDisplay_Short,
    QuerySymbolsDataDefinitionFieldDescription_Short,
    QuerySymbolsDataDefinitionFieldDisplay_Long,
    QuerySymbolsDataDefinitionFieldDescription_Long,
    QuerySymbolsDataDefinitionFieldDisplay_Ticker,
    QuerySymbolsDataDefinitionFieldDescription_Ticker,
    QuerySymbolsDataDefinitionFieldDisplay_Gics,
    QuerySymbolsDataDefinitionFieldDescription_Gics,
    QuerySymbolsDataDefinitionFieldDisplay_Isin,
    QuerySymbolsDataDefinitionFieldDescription_Isin,
    QuerySymbolsDataDefinitionFieldDisplay_Base,
    QuerySymbolsDataDefinitionFieldDescription_Base,
    QuerySymbolsDataDefinitionFieldDisplay_Ric,
    QuerySymbolsDataDefinitionFieldDescription_Ric,
    SymbolsDitemControlTitle_QueryOrSubscribe,
    SymbolsDitemControlCaption_QueryOrSubscribe,
    SymbolsDitemControlTitle_Exchange,
    SymbolsDitemControlCaption_Exchange,
    SymbolsDitemControlTitle_Markets,
    SymbolsDitemControlCaption_Markets,
    SymbolsDitemControlTitle_Cfi,
    SymbolsDitemControlCaption_Cfi,
    SymbolsDitemControlTitle_Fields,
    SymbolsDitemControlCaption_Fields,
    SymbolsDitemControlTitle_Indices,
    SymbolsDitemControlCaption_Indices,
    SymbolsDitemControlTitle_Partial,
    SymbolsDitemControlCaption_Partial,
    SymbolsDitemControlTitle_PreferExact,
    SymbolsDitemControlCaption_PreferExact,
    SymbolsDitemControlTitle_ShowFull,
    SymbolsDitemControlCaption_ShowFull,
    SymbolsDitemControlTitle_PageSize,
    SymbolsDitemControlCaption_PageSize,
    SymbolsDitemControlTitle_Search,
    SymbolsDitemControlCaption_Search,
    SymbolsDitemControlTitle_Query,
    SymbolsDitemControlCaption_Query,
    SymbolsDitemControlTitle_SubscribeMarket,
    SymbolsDitemControlCaption_SubscribeMarket,
    SymbolsDitemControlTitle_Class,
    SymbolsDitemControlCaption_Class,
    SymbolsDitemControlTitle_Subscribe,
    SymbolsDitemControlCaption_Subscribe,
    SymbolsDitemControlTitle_QuerySearchDescription,
    SymbolsDitemControlCaption_QuerySearchDescription,
    SymbolsDitemControlTitle_SubscriptionSearchDescription,
    SymbolsDitemControlCaption_SubscriptionSearchDescription,
    SymbolsDitemControlTitle_NextPage,
    SymbolsDitemControlCaption_NextPage,
    SymbolsDitemQueryOrSubscribeDescription_Query,
    SymbolsDitemQueryOrSubscribeDescription_Subscription,
    SymbolsDitemControlCaption_ColumnsDialogCaption,
    DayTradesGridHeading_Id,
    DayTradesGridHeading_Price,
    DayTradesGridHeading_Quantity,
    DayTradesGridHeading_Time,
    DayTradesGridHeading_FlagIds,
    DayTradesGridHeading_TrendId,
    DayTradesGridHeading_OrderSideId,
    DayTradesGridHeading_AffectsIds,
    DayTradesGridHeading_ConditionCodes,
    DayTradesGridHeading_BuyDepthOrderId,
    DayTradesGridHeading_BuyBroker,
    DayTradesGridHeading_BuyCrossRef,
    DayTradesGridHeading_SellDepthOrderId,
    DayTradesGridHeading_SellBroker,
    DayTradesGridHeading_SellCrossRef,
    DayTradesGridHeading_MarketId,
    DayTradesGridHeading_RelatedId,
    DayTradesGridHeading_Attributes,
    DayTradesGridHeading_RecordType,
    SubscribabilityIncreaseRetry_FromExtentNone,
    SubscribabilityIncreaseRetry_FromExtentSome,
    SubscribabilityIncreaseRetry_ReIncrease,
    BadnessReasonId_NotBad,
    BadnessReasonId_Inactive,
    BadnessReasonId_PublisherSubscriptionError_Internal_Error,
    BadnessReasonId_PublisherSubscriptionError_InvalidRequest_Error,
    BadnessReasonId_PublisherSubscriptionError_Offlined_Suspect,
    BadnessReasonId_PublisherSubscriptionError_Offlined_Error,
    BadnessReasonId_PublisherSubscriptionError_Timeout_Suspect,
    BadnessReasonId_PublisherSubscriptionError_Timeout_Error,
    BadnessReasonId_PublisherSubscriptionError_SubscriptionError_Error,
    BadnessReasonId_PublisherSubscriptionError_PublishRequestError_Suspect,
    BadnessReasonId_PublisherSubscriptionError_PublishRequestError_Error,
    BadnessReasonId_PublisherSubscriptionError_SubscriptionWarning_Suspect,
    BadnessReasonId_PublisherSubscriptionError_DataNotAvailable_Error,
    BadnessReasonId_PublisherSubscriptionError_DataError_Suspect,
    BadnessReasonId_PublisherSubscriptionError_DataError_Error,
    BadnessReasonId_PublisherServerWarning,
    BadnessReasonId_PublisherServerError,
    BadnessReasonId_PublisherSubscription_NeverSubscribed,
    BadnessReasonId_PublisherSubscription_PublisherOnlineWaiting,
    BadnessReasonId_PublisherSubscription_PublisherOfflining,
    BadnessReasonId_PublisherSubscription_ResponseWaiting,
    BadnessReasonId_PublisherSubscription_SynchronisationWaiting,
    BadnessReasonId_PublisherSubscription_Synchronised,
    BadnessReasonId_PublisherSubscription_UnsubscribedSynchronised,
    BadnessReasonId_PreGood_Clear,
    BadnessReasonId_PreGood_Add,
    BadnessReasonId_ConnectionOffline,
    BadnessReasonId_FeedsWaiting,
    BadnessReasonId_FeedsError,
    BadnessReasonId_FeedWaiting,
    BadnessReasonId_FeedError,
    BadnessReasonId_FeedNotAvailable,
    BadnessReasonId_NoAuthorityFeed,
    BadnessReasonId_MarketsWaiting,
    BadnessReasonId_MarketsError,
    BadnessReasonId_MarketWaiting,
    BadnessReasonId_MarketError,
    BadnessReasonId_MarketNotAvailable,
    BadnessReasonId_BrokerageAccountsWaiting,
    BadnessReasonId_BrokerageAccountsError,
    BadnessReasonId_BrokerageAccountWaiting,
    BadnessReasonId_BrokerageAccountError,
    BadnessReasonId_BrokerageAccountNotAvailable,
    BadnessReasonId_OrderStatusesError,
    BadnessReasonId_FeedStatus_Unknown,
    BadnessReasonId_FeedStatus_Initialising,
    BadnessReasonId_FeedStatus_Impaired,
    BadnessReasonId_FeedStatus_Expired,
    BadnessReasonId_Opening,
    BadnessReasonId_Reading,
    BadnessReasonId_SymbolMatching_None,
    BadnessReasonId_SymbolMatching_Ambiguous,
    BadnessReasonId_SymbolOkWaitingForData,
    BadnessReasonId_DataRetrieving,
    BadnessReasonId_MarketTradingStatesRetrieving,
    BadnessReasonId_OrderStatusesFetching,
    BadnessReasonId_BrokerageAccountDataListsIncubating,
    BadnessReasonId_OneOrMoreAccountsInError,
    BadnessReasonId_MultipleUsable,
    BadnessReasonId_MultipleSuspect,
    BadnessReasonId_MultipleError,
    BadnessReasonId_StatusWarnings,
    BadnessReasonId_StatusRetrieving,
    BadnessReasonId_StatusErrors,
    BadnessReasonId_LockError,
    SourceTzOffsetDateTimeTimezoneModeDisplay_Utc,
    SourceTzOffsetDateTimeTimezoneModeDescription_Utc,
    SourceTzOffsetDateTimeTimezoneModeDisplay_Local,
    SourceTzOffsetDateTimeTimezoneModeDescription_Local,
    SourceTzOffsetDateTimeTimezoneModeDisplay_Source,
    SourceTzOffsetDateTimeTimezoneModeDescription_Source,
    ChartHistoryIntervalUnitDisplay_Trade,
    ChartHistoryIntervalUnitDisplay_Millisecond,
    ChartHistoryIntervalUnitDisplay_Day,
    ChartHistoryIntervalUnitDisplay_Week,
    ChartHistoryIntervalUnitDisplay_Month,
    ChartHistoryIntervalUnitDisplay_Year,
    ChartHistoryIntervalPresetDisplay_Trade,
    ChartHistoryIntervalPresetDisplay_OneSecond,
    ChartHistoryIntervalPresetDisplay_OneMinute,
    ChartHistoryIntervalPresetDisplay_FiveMinutes,
    ChartHistoryIntervalPresetDisplay_FifteenMinutes,
    ChartHistoryIntervalPresetDisplay_ThirtyMinutes,
    ChartHistoryIntervalPresetDisplay_Hourly,
    ChartHistoryIntervalPresetDisplay_Daily,
    ChartHistoryIntervalPresetDisplay_Weekly,
    ChartHistoryIntervalPresetDisplay_Monthly,
    ChartHistoryIntervalPresetDisplay_Quarterly,
    ChartHistoryIntervalPresetDisplay_Yearly,
    ChartHistoryIntervalPresetDisplay_Custom,
    ChartIntervalDisplay_OneMinute,
    ChartIntervalDisplay_FiveMinutes,
    ChartIntervalDisplay_FifteenMinutes,
    ChartIntervalDisplay_ThirtyMinutes,
    ChartIntervalDisplay_OneDay,
    DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_ChartHistory,
    DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_Trades,
    DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_Security,
    DayTradesDataItemRecordTypeIdDisplay_Trade,
    DayTradesDataItemRecordTypeIdDisplay_Canceller,
    DayTradesDataItemRecordTypeIdDisplay_Cancelled,
    // InternalCommandDisplay_Null,
    InternalCommandDisplay_ChildMenu,
    InternalCommandDisplay_MenuDivider,
    DitemCommandDisplay_ToggleSecurityLinking,
    DitemCommandDisplay_SetSecurityLinking,
    DitemCommandDisplay_ToggleAccountLinking,
    DitemCommandDisplay_SetAccountLinking,
    MenuDisplay_Price,
    MenuAccessKey_Price,
    MenuDisplay_Trading,
    MenuAccessKey_Trading,
    MenuDisplay_Commands,
    MenuAccessKey_Commands,
    MenuDisplay_Tools,
    MenuAccessKey_Tools,
    MenuDisplay_Help,
    MenuAccessKey_Help,
    DitemMenuDisplay_Placeholder,
    DitemMenuDisplay_Extensions,
    DitemMenuDisplay_Symbols,
    DitemMenuDisplay_DepthAndTrades,
    DitemMenuDisplay_Watchlist,
    DitemMenuDisplay_Depth,
    DitemMenuDisplay_NewsHeadlines,
    DitemMenuDisplay_NewsBody,
    DitemMenuDisplay_NotificationChannels,
    DitemMenuDisplay_Scans,
    DitemMenuDisplay_Alerts,
    DitemMenuDisplay_Search,
    DitemMenuDisplay_AdvertWebPage,
    DitemMenuDisplay_TopShareholders,
    DitemMenuDisplay_Status,
    DitemMenuDisplay_Trades,
    DitemMenuDisplay_OrderRequest,
    DitemMenuDisplay_BrokerageAccounts,
    DitemMenuDisplay_Orders,
    DitemMenuDisplay_OrderAuthorise,
    DitemMenuDisplay_Holdings,
    DitemMenuDisplay_Balances,
    DitemMenuDisplay_Settings,
    DitemMenuDisplay_Diagnostics,
    DitemMenuDisplay_EtoPriceQuotation,
    DitemMenuDisplay_GeneralWebPage,
    DitemMenuDisplay_BrandingSplashWebPage,
    DitemMenuDisplay_OrderRequest_Buy,
    DitemMenuDisplay_OrderRequest_Sell,
    Desktop_AboutAdvertisingCaption,
    Desktop_SaveLayoutCaption,
    Desktop_ResetLayoutCaption,
    Desktop_SignOutCaption,
    ZenithWebsocketCloseCodeId_NormalClosure,
    ZenithWebsocketCloseCodeId_GoingAway,
    ZenithWebsocketCloseCodeId_ProtocolError,
    ZenithWebsocketCloseCodeId_UnsupportedData,
    ZenithWebsocketCloseCodeId_NoStatusReceived,
    ZenithWebsocketCloseCodeId_AbnormalClosure,
    ZenithWebsocketCloseCodeId_InvalidFramePayloadData,
    ZenithWebsocketCloseCodeId_PolicyViolation,
    ZenithWebsocketCloseCodeId_MessageTooBig,
    ZenithWebsocketCloseCodeId_MissingExtension,
    ZenithWebsocketCloseCodeId_ServerError,
    ZenithWebsocketCloseCodeId_ServerRestart,
    ZenithWebsocketCloseCodeId_TryAgainLater,
    ZenithWebsocketCloseCodeId_BadGateway,
    ZenithWebsocketCloseCodeId_TlsHandshake,
    ZenithWebsocketCloseCodeId_Session,
    NotCurrentVersion_NotRunningCurrentVersion,
    NotCurrentVersion_CurrentCaption,
    NotCurrentVersion_RunningCaption,
    NotCurrentVersion_ClickButtonToAttemptLoadCurrentText,
    NotCurrentVersion_ReloadAppCaption,
    NotCurrentVersion_MoreInfo,
    Extensions_ExtensionNotInstalledOrEnabled,
    Extensions_LocalDesktopNotLoaded,
    Extensions_ExtensionDidNotCreateComponent,
    Extensions_DownloadTimeout,
    Extensions_ExtensionInstallCaption,
    Extensions_ExtensionUninstallCaption,
    Extensions_ExtensionEnableCaption,
    Extensions_ExtensionDisableCaption,
    Extensions_AvailableExtensionsHeadingCaption,
    Extensions_InstalledExtensionsHeadingCaption,
    PlaceholderDitem_ComponentStateNotSpecified,
    PlaceholderDitem_ComponentStateIsInvalid,
    PlaceholderDitem_ComponentIsNotAvailable,
    PlaceholderDitem_PlaceheldExtensionPublisherCaption,
    PlaceholderDitem_PlaceheldExtensionNameCaption,
    PlaceholderDitem_PlaceheldConstructionMethodCaption,
    PlaceholderDitem_PlaceheldComponentTypeNameCaption,
    PlaceholderDitem_PlaceheldComponentStateCaption,
    PlaceholderDitem_PlaceheldReasonCaption,
    PlaceholderDitem_InvalidCaption,
    PublisherTypeId_Display_Invalid,
    PublisherTypeId_Abbreviation_Invalid,
    PublisherTypeId_Display_Builtin,
    PublisherTypeId_Abbreviation_Builtin,
    PublisherTypeId_Display_User,
    PublisherTypeId_Abbreviation_User,
    PublisherTypeId_Display_Organisation,
    PublisherTypeId_Abbreviation_Organisation,
    CommandContextDisplay_Root,
    DataMarketsNgComponent_withBoardsListCaption,
    DataMarketsNgComponent_withBoardsListTitle,
    StatusDitem_Summary,
    StatusDitem_Feeds,
    StatusDitem_ExchangeEnvironments,
    StatusDitem_Exchanges,
    StatusDitem_DataMarkets,
    StatusDitem_TradingMarkets,
    StatusDitem_MarketBoards,
    StatusDitem_Zenith,
    SearchDitem_CategoryCaption,
    SearchDitem_CategoryTitle,
    SearchDitem_LocationCaption,
    SearchDitem_LocationTitle,
    SearchDitem_PriceRangeCaption,
    SearchDitem_PriceRangeTitle,
    SearchDitem_KeywordsCaption,
    SearchDitem_KeywordsTitle,
    SearchDitem_SearchCaption,
    SearchDitem_SearchTitle,
    SearchDitem_AlertCaption,
    SearchDitem_AlertTitle,
    SearchDitem_SearchDescriptionTitle,
    SearchDitem_Category_HolidayCaption,
    SearchDitem_Category_HolidayTitle,
    SearchDitem_Location_UsArizonaCaption,
    SearchDitem_Location_UsArizonaTitle,
    SearchDitem_PriceRange_10000To20000Caption,
    SearchDitem_PriceRange_10000To20000Title,
    AdvertTicker_InterestedTitle,
    BannerAdvert_ContactMeTitle,
    BannerAdvert_InterestedTitle,
    BannerAdvert_SimilarTitle,
    BannerAdvert_NotInterestedTitle,
    ScanFormulaZenithEncodingError_InvalidJson,
    ScanFormulaZenithEncodingError_BooleanTupleNodeIsNotAnArray,
    ScanFormulaZenithEncodingError_BooleanTupleNodeArrayIsZeroLength,
    ScanFormulaZenithEncodingError_BooleanTupleNodeTypeIsNotString,
    ScanFormulaZenithEncodingError_UnknownField,
    ScanFormulaZenithEncodingError_SingleOperandLogicalBooleanDoesNotHaveOneOperand,
    ScanFormulaZenithEncodingError_LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands,
    ScanFormulaZenithEncodingError_MultiOperandLogicalBooleanMissingOperands,
    ScanFormulaZenithEncodingError_MultipleMatchingTupleNodeMissingParameters,
    ScanFormulaZenithEncodingError_TextMultipleMatchingTupleNodeParameterIsNotString,
    ScanFormulaZenithEncodingError_LogicalBooleanMissingOperand,
    ScanFormulaZenithEncodingError_NumericComparisonDoesNotHave2Operands,
    ScanFormulaZenithEncodingError_NumericParameterIsNotNumberOrComparableFieldOrArray,
    ScanFormulaZenithEncodingError_UnexpectedBooleanParamType,
    ScanFormulaZenithEncodingError_UnknownFieldBooleanParam,
    ScanFormulaZenithEncodingError_FieldBooleanParamCannotBeSubbedField,
    ScanFormulaZenithEncodingError_SubFieldIsNotString,
    ScanFormulaZenithEncodingError_PriceSubFieldHasValueSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_DateSubFieldHasValueSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_AltCodeSubFieldHasValueSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_AttributeSubFieldHasValueSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_TargetIsNotNumber,
    ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotNumber,
    ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotNumber,
    ScanFormulaZenithEncodingError_RangeMinAndMaxAreBothUndefined,
    ScanFormulaZenithEncodingError_DateFieldEqualsTargetIsNotString,
    ScanFormulaZenithEncodingError_TextSubFieldIsMissing,
    ScanFormulaZenithEncodingError_TextFieldContainsValueIsNotString,
    ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotString,
    ScanFormulaZenithEncodingError_TextFieldContainsAsHasInvalidFormat,
    ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotBoolean,
    ScanFormulaZenithEncodingError_SingleFieldMustHaveOneParameter,
    ScanFormulaZenithEncodingError_PriceSubFieldEqualsSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_DateSubFieldEqualsSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_DateSubFieldEqualsTargetIsNotString,
    ScanFormulaZenithEncodingError_AltCodeSubFieldContainsSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_AttributeSubFieldContainsSubFieldIsUnknown,
    ScanFormulaZenithEncodingError_TargetHasInvalidDateFormat,
    ScanFormulaZenithEncodingError_RangeSubFieldIsMissing,
    ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotString,
    ScanFormulaZenithEncodingError_RangeMinHasInvalidDateFormat,
    ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotString,
    ScanFormulaZenithEncodingError_RangeMaxHasInvalidDateFormat,
    ScanFormulaZenithEncodingError_NamedParametersCannotBeNull,
    ScanFormulaZenithEncodingError_RangeFieldBooleanTupleNodeHasTooManyParameters,
    ScanFormulaZenithEncodingError_IsBooleanTupleNodeParameterIsNotBoolean,
    ScanFormulaZenithEncodingError_IsBooleanTupleNodeHasTooManyParameters,
    ScanFormulaZenithEncodingError_NumericTupleNodeIsZeroLength,
    ScanFormulaZenithEncodingError_NumericTupleNodeTypeIsNotString,
    ScanFormulaZenithEncodingError_NumericTupleNodeRequires2Or3Parameters,
    ScanFormulaZenithEncodingError_UnaryArithmeticNumericTupleNodeRequires2Parameters,
    ScanFormulaZenithEncodingError_LeftRightArithmeticNumericTupleNodeRequires3Parameters,
    ScanFormulaZenithEncodingError_UnknownBooleanTupleNodeType,
    ScanFormulaZenithEncodingError_UnknownNumericTupleNodeType,
    ScanFormulaZenithEncodingError_UnknownNumericField,
    ScanFormulaZenithEncodingError_FieldBooleanParamMustBeRangeOrExistsSingle,
    ScanFormulaZenithEncodingError_NumericRangeFirstParameterMustBeNumberOrNamed,
    ScanFormulaZenithEncodingError_DateRangeFirstParameterMustBeStringOrNamed,
    ScanFormulaZenithEncodingError_TextFieldMustHaveAtLeastOneParameter,
    ScanFormulaZenithEncodingError_TextRangeSecondParameterMustBeStringOrNamed,
    ScanFormulaZenithEncodingError_ExistsSingleFieldMustNotHaveMoreThan1Parameter,
    ScanFormulaZenithEncodingError_SingleFieldParameterIsNotString,
    ScanFormulaZenithEncodingError_TextFieldBooleanTupleNodeHasTooManyParameters,
    ScanFormulaZenithEncodingError_UnknownCurrency,
    ScanFormulaZenithEncodingError_IfTupleNodeRequiresAtLeast4Parameters,
    ScanFormulaZenithEncodingError_IfTupleNodeRequiresAnEvenNumberOfParameters,
    ScanFormulaZenithEncodingError_UnknownExchange,
    ScanFormulaZenithEncodingError_UnknownMarket,
    ScanFormulaZenithEncodingError_UnknownMarketBoard,
    ScanSyncStatusDisplay_Saving, // remove when Watchmaker no longer references
    ScanSyncStatusDisplay_Behind, // remove when Watchmaker no longer references
    ScanSyncStatusDisplay_Conflict, // remove when Watchmaker no longer references
    ScanSyncStatusDisplay_InSync, // remove when Watchmaker no longer references
    ScanStatusDisplay_Inactive,
    ScanStatusDisplay_Active,
    ScanStatusDisplay_Faulted,
    ScanTargetTypeDisplay_Markets,
    ScanTargetTypeDisplay_Symbols,
    ScanCriteriaTypeDisplay_Custom,
    ScanCriteriaTypeDisplay_PriceGreaterThanValue,
    ScanCriteriaTypeDisplay_PriceLessThanValue,
    ScanCriteriaTypeDisplay_TodayPriceIncreaseGreaterThanPercentage,
    ScanCriteriaTypeDisplay_TodayPriceDecreaseGreaterThanPercentage,
    ScanCriteriaViewDisplay_FieldSet,
    ScanCriteriaViewDescription_FieldSet,
    ScanCriteriaViewDisplay_ConditionSet,
    ScanCriteriaViewDescription_ConditionSet,
    ScanCriteriaViewDisplay_Zenith,
    ScanCriteriaViewDescription_Zenith,
    ScansGridHeading_Id,
    ScansGridHeading_Index,
    ScansGridHeading_Readonly,
    ScansGridHeading_Name,
    ScansGridHeading_Description,
    ScansGridHeading_StatusId,
    ScansGridHeading_Version,
    ScansGridHeading_LastSavedTime,
    ScanPropertiesCaption_Enabled,
    ScanPropertiesTitle_Enabled,
    ScanPropertiesCaption_Name,
    ScanPropertiesTitle_Name,
    ScanPropertiesCaption_Description,
    ScanPropertiesTitle_Description,
    ScanPropertiesCaption_Type,
    ScanPropertiesTitle_Type,
    ScanPropertiesCaption_SymbolList,
    ScanPropertiesTitle_SymbolList,
    ScanPropertiesCaption_ShowRank,
    ScanPropertiesTitle_ShowRank,
    ScanPropertiesCaption_SymbolListMaxCount,
    ScanPropertiesTitle_SymbolListMaxCount,
    ScanPropertiesCaption_View,
    ScanPropertiesTitle_View,
    ScanEditorAttachedNotificationChannelPropertiesCaption_MinimumStable,
    ScanEditorAttachedNotificationChannelPropertiesDescription_MinimumStable,
    ScanEditorAttachedNotificationChannelPropertiesCaption_MinimumElapsed,
    ScanEditorAttachedNotificationChannelPropertiesDescription_MinimumElapsed,
    ScanEditorAttachedNotificationChannelPropertiesCaption_Ttl,
    ScanEditorAttachedNotificationChannelPropertiesDescription_Ttl,
    ScanEditorAttachedNotificationChannelPropertiesCaption_Urgency,
    ScanEditorAttachedNotificationChannelPropertiesDescription_Urgency,
    ScanTargetsCaption_TargetType,
    ScanTargetsDescription_TargetType,
    ScanTargetsCaption_SingleSymbol,
    ScanTargetsDescription_SingleSymbol,
    ScanTargetsCaption_SingleMarket,
    ScanTargetsDescription_SingleMarket,
    ScanTargetsCaption_MultiMarket,
    ScanTargetsDescription_MultiMarket,
    ScanTargetsCaption_MaxMatchCount,
    ScanTargetsDescription_MaxMatchCount,
    ScanTargetsTargetSubTypeIdDisplay_SingleSymbol,
    ScanTargetsTargetSubTypeIdDescription_SingleSymbol,
    ScanTargetsTargetSubTypeIdDisplay_MultiSymbol,
    ScanTargetsTargetSubTypeIdDescription_MultiSymbol,
    ScanTargetsTargetSubTypeIdDisplay_SingleMarket,
    ScanTargetsTargetSubTypeIdDescription_SingleMarket,
    ScanTargetsTargetSubTypeIdDisplay_MultiMarket,
    ScanTargetsTargetSubTypeIdDescription_MultiMarket,
    ScanCriteriaCaption_DefaultView,
    ScanCriteriaDescription_DefaultView,
    ScanCriteriaCaption_View,
    ScanCriteriaDescription_View,
    ScanEditorComponent_ApplyTitle,
    ScanEditorComponent_RevertTitle,
    ScanEditorComponent_DeleteTitle,
    ScanEditorComponent_TestTitle,
    ScanEditorTargetsComponent_EditMultiSymbolList,
    ScanEditorTargetsComponent_EditMultiSymbolGridColumns,
    ColumnLayoutDefinitionColumnHeading_FieldName,
    ColumnLayoutDefinitionColumnDescription_FieldName,
    ColumnLayoutDefinitionColumnHeading_FieldHeading,
    ColumnLayoutDefinitionColumnDescription_FieldHeading,
    ColumnLayoutDefinitionColumnHeading_FieldSourceName,
    ColumnLayoutDefinitionColumnDescription_FieldSourceName,
    ColumnLayoutDefinitionColumnHeading_Width,
    ColumnLayoutDefinitionColumnDescription_Width,
    ColumnLayoutDefinitionColumnHeading_Visible,
    ColumnLayoutDefinitionColumnDescription_Visible,
    ScanFieldHeading_Id,
    ScanFieldHeading_Readonly,
    ScanFieldHeading_Index,
    ScanFieldHeading_StatusId,
    ScanFieldHeading_Enabled,
    ScanFieldHeading_Name,
    ScanFieldHeading_Description,
    ScanFieldHeading_TargetTypeId,
    ScanFieldHeading_TargetMarkets,
    ScanFieldHeading_TargetDataIvemIds,
    ScanFieldHeading_MaxMatchCount,
    ScanFieldHeading_ZenithCriteria,
    ScanFieldHeading_ZenithRank,
    ScanFieldHeading_AttachedNotificationChannels,
    ScanFieldHeading_SymbolListEnabled,
    ScanFieldHeading_Version,
    ScanFieldHeading_LastSavedTime,
    ScanFieldHeading_LastEditSessionId,
    ScanFieldHeading_ZenithCriteriaSource,
    ScanFieldHeading_ZenithRankSource,
    ZenithScanFormulaView_ErrorCaption,
    ZenithScanFormulaView_ErrorTitle,
    ZenithScanFormulaViewDecodeProgress_Title,
    ZenithScanFormulaViewDecodeProgress_CountCaption,
    ZenithScanFormulaViewDecodeProgress_CountTitle,
    ZenithScanFormulaViewDecodeProgress_DepthCaption,
    ZenithScanFormulaViewDecodeProgress_DepthTitle,
    WatchmakerListHeading_Id,
    WatchmakerListHeading_Readonly,
    WatchmakerListHeading_Index,
    WatchmakerListHeading_Name,
    WatchmakerListHeading_Description,
    WatchmakerListHeading_Category,
    WatchmakerListHeading_SyncStatusId,
    WatchmakerListHeading_ConfigModified,
    WatchmakerListHeading_LastSavedTime,
    GridFieldFieldHeading_Name,
    GridFieldFieldHeading_Heading,
    GridFieldFieldHeading_SourceName,
    GridFieldFieldHeading_DefaultHeading,
    GridFieldFieldHeading_DefaultTextAlign,
    GridFieldFieldHeading_DefaultWidth,
    RankedDataIvemIdListDirectoryItemFieldHeading_TypeId,
    RankedDataIvemIdListDirectoryItemFieldHeading_Id,
    RankedDataIvemIdListDirectoryItemFieldHeading_Readonly,
    RankedDataIvemIdListDirectoryItemFieldHeading_Name,
    RankedDataIvemIdListDirectoryItemFieldHeading_Description,
    RankedDataIvemIdListDirectoryItem_TypeId_WatchmakerList,
    RankedDataIvemIdListDirectoryItem_TypeId_Scan,
    DiagnosticsDitemGroup_DebugCaption,
    DiagnosticsDitemGroup_DebugTitle,
    Diagnostics_CloseSocketConnection,
    UserAlert_RestartReason_Unstable,
    UserAlert_RestartReason_SigninCouldNotBeProcessed,
    UserAlert_RestartReason_NewSessionRequired,
    UserAlert_RestartReason_AttemptingSessionRenewal,
    UserAlert_RestartReason_UserAction,
    UserAlert_SavingChanges,
    UserAlert_PleaseWaitSavingChanges,
    UserAlert_ChangesSaved,
    UserAlert_ChangesSavedOkToLeaveOrRestorePage,
    ScanFormulaIsNodeCategoryCaption_Index,
    ScanFormulaIsNodeCategoryTitle_Index,
    ScanField_BooleanOperationDisplay_All,
    ScanField_BooleanOperationDescription_All,
    ScanField_BooleanOperationDisplay_Any,
    ScanField_BooleanOperationDescription_Any,
    ScanField_BooleanOperationDisplay_Xor,
    ScanField_BooleanOperationDescription_Xor,
    ScanFieldEditor_FieldName,
    ScanFieldEditor_RequiresDisplay,
    ScanFieldEditor_RequiresDescription,
    ScanFieldEditor_DeleteMeDisplay,
    ScanFieldEditor_DeleteMeDescription,
    ScanFieldEditor_Conditions,
    ScanFieldEditor_AddConditionDisplay,
    ScanFieldEditor_AddConditionDescription,
    ScanFieldEditor_OneOrMoreConditionsInvalid,
    ScanFieldEditor_XorRequiresExactly2Conditions,
    ScanFieldSetEditor_AddAField,
    ScanFieldSetEditor_AddAnAttributeBasedField,
    ScanFieldSetEditor_AddAnAltCodeBasedField,
    ScanFieldEditorFrameFieldHeading_Name,
    ScanFieldEditorFrameFieldHeading_Valid,
    ScanFieldEditorFrameFieldHeading_ErrorText,
    ScanFieldEditorFrameFieldHeading_ConditionsOperationId,
    ScanFieldEditorFrameFieldHeading_ConditionCount,
    ScanFieldConditionOperatorDisplay_HasValue,
    ScanFieldConditionOperatorDescription_HasValue,
    ScanFieldConditionOperatorDisplay_NotHasValue,
    ScanFieldConditionOperatorDescription_NotHasValue,
    ScanFieldConditionOperatorDisplay_Equals,
    ScanFieldConditionOperatorDescription_Equals,
    ScanFieldConditionOperatorDisplay_NotEquals,
    ScanFieldConditionOperatorDescription_NotEquals,
    ScanFieldConditionOperatorDisplay_GreaterThan,
    ScanFieldConditionOperatorDescription_GreaterThan,
    ScanFieldConditionOperatorDisplay_GreaterThanOrEqual,
    ScanFieldConditionOperatorDescription_GreaterThanOrEqual,
    ScanFieldConditionOperatorDisplay_LessThan,
    ScanFieldConditionOperatorDescription_LessThan,
    ScanFieldConditionOperatorDisplay_LessThanOrEqual,
    ScanFieldConditionOperatorDescription_LessThanOrEqual,
    ScanFieldConditionOperatorDisplay_InRange,
    ScanFieldConditionOperatorDescription_InRange,
    ScanFieldConditionOperatorDisplay_NotInRange,
    ScanFieldConditionOperatorDescription_NotInRange,
    ScanFieldConditionOperatorDisplay_Contains,
    ScanFieldConditionOperatorDescription_Contains,
    ScanFieldConditionOperatorDisplay_NotContains,
    ScanFieldConditionOperatorDescription_NotContains,
    ScanFieldConditionOperatorDisplay_Overlaps,
    ScanFieldConditionOperatorDescription_Overlaps,
    ScanFieldConditionOperatorDisplay_NotOverlaps,
    ScanFieldConditionOperatorDescription_NotOverlaps,
    ScanFieldConditionOperatorDisplay_Is,
    ScanFieldConditionOperatorDescription_Is,
    ScanFieldConditionOperatorDisplay_NotIs,
    ScanFieldConditionOperatorDescription_NotIs,
    ScanFieldConditionOperatorDisplay_OrEqual,
    ScanFieldConditionOperandsEditorCaption_DeleteMe,
    ScanFieldConditionOperandsEditorTitle_DeleteMe,
    ScanFieldConditionOperandsEditor_NotIsCategory,
    ScanFieldConditionOperandsEditor_NotEqualsValue,
    ScanFieldConditionOperandsEditor_NotInRange,
    ScanFieldConditionOperandsEditor_NotOverlaps,
    ScanFieldConditionOperandsEditor_NotHasValue,
    ScanFieldConditionOperandsEditor_NotContainsValue,
    ConditionSetScanFormulaViewNgComponentCaption_SetOperation,
    ConditionSetScanFormulaViewNgComponentTitle_SetOperation,
    ConditionSetScanFormulaViewNgComponentTitle_Exclude,
    ConditionSetScanFormulaViewNgComponentCaption_NewCondition,
    ConditionSetScanFormulaViewNgComponentTitle_NewCondition,
    ConditionSetScanFormulaViewNgComponent_SetOperationCaption_Any,
    ConditionSetScanFormulaViewNgComponent_SetOperationTitle_Any,
    ConditionSetScanFormulaViewNgComponent_SetOperationCaption_All,
    ConditionSetScanFormulaViewNgComponent_SetOperationTitle_All,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Compare,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Compare,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_InRange,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_InRange,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Equals,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Equals,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Includes,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Includes,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Contains,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Contains,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Has,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Has,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Is,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Is,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_All,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_All,
    ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_None,
    ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_None,
    CategoryValueScanFieldConditionOperandsCaption_Category,
    CategoryValueScanFieldConditionOperandsTitle_Category,
    CurrencyOverlapsScanFieldConditionOperandsCaption_Values,
    CurrencyOverlapsScanFieldConditionOperandsTitle_Values,
    ExchangeOverlapsScanFieldConditionOperandsCaption_Values,
    ExchangeOverlapsScanFieldConditionOperandsTitle_Values,
    MarketOverlapsScanFieldConditionOperandsCaption_Values,
    MarketOverlapsScanFieldConditionOperandsTitle_Values,
    MarketBoardOverlapsScanFieldConditionOperandsCaption_Values,
    MarketBoardOverlapsScanFieldConditionOperandsTitle_Values,
    StringOverlapsScanFieldConditionOperandsCaption_Values,
    StringOverlapsScanFieldConditionOperandsTitle_Values,
    ValueScanFieldConditionOperandsCaption_Value,
    NumericValueScanFieldConditionOperandsTitle_Value,
    DateValueScanFieldConditionOperandsTitle_Value,
    TextValueScanFieldConditionOperandsTitle_Value,
    RangeScanFieldConditionOperandsCaption_Min,
    RangeScanFieldConditionOperandsCaption_Max,
    NumericRangeValueScanFieldConditionOperandsTitle_Min,
    NumericRangeValueScanFieldConditionOperandsTitle_Max,
    DateRangeValueScanFieldConditionOperandsTitle_Min,
    DateRangeValueScanFieldConditionOperandsTitle_Max,
    NumericComparisonValueScanFieldConditionOperandsCaption_Operator,
    NumericComparisonValueScanFieldConditionOperandsTitle_Operator,
    TextContainsScanFieldConditionOperandsTitle_Value,
    TextContainsScanFieldConditionOperandsTitle_FromStart,
    TextContainsScanFieldConditionOperandsTitle_FromEnd,
    TextContainsScanFieldConditionOperandsTitle_Exact,
    TextContainsScanFieldConditionOperandsTitle_IgnoreCase,
    LockerScanAttachedNotificationChannelHeader_ChannelId,
    LockerScanAttachedNotificationChannelHeader_Name,
    LockerScanAttachedNotificationChannelHeader_CultureCode,
    LockerScanAttachedNotificationChannelHeader_MinimumStable,
    LockerScanAttachedNotificationChannelHeader_MinimumElapsed,
    LockerScanAttachedNotificationChannelHeader_Ttl,
    LockerScanAttachedNotificationChannelHeader_Urgency,
    LockerScanAttachedNotificationChannelHeader_Topic,
    NotificationChannel_SourceSettings_Urgency_VeryLow,
    NotificationChannel_SourceSettings_Urgency_Low,
    NotificationChannel_SourceSettings_Urgency_Normal,
    NotificationChannel_SourceSettings_Urgency_High,
    ScanEditorAttachNotificationChannels_AttachDescription,
    ScanEditorAttachNotificationChannels_EditGridColumns,
    ScanEditorAttachNotificationChannels_DetachSelectedChannelsCaption,
    ScanEditorAttachNotificationChannels_DetachSelectedChannelsTitle,
    LockOpenNotificationChannelHeader_Id,
    LockOpenNotificationChannelHeader_Valid,
    LockOpenNotificationChannelHeader_Enabled,
    LockOpenNotificationChannelDescription_Enabled,
    LockOpenNotificationChannelHeader_Name,
    LockOpenNotificationChannelDescription_Name,
    LockOpenNotificationChannelHeader_Description,
    LockOpenNotificationChannelDescription_Description,
    LockOpenNotificationChannelHeader_Favourite,
    LockOpenNotificationChannelHeader_StatusId,
    LockOpenNotificationChannelHeader_DistributionMethodId,
    LockOpenNotificationChannelHeader_Settings,
    LockOpenNotificationChannelHeader_Faulted,
    NotificationDistributionMethodDisplay_Debug,
    NotificationDistributionMethodDisplay_Email,
    NotificationDistributionMethodDisplay_Sms,
    NotificationDistributionMethodDisplay_WebPush,
    NotificationDistributionMethodDisplay_ApplePush,
    NotificationDistributionMethodDisplay_GooglePush,
    NotificationChannels_RefreshAllCaption,
    NotificationChannels_RefreshAllDescription,
    NotificationChannels_AddCaption,
    NotificationChannels_AddDescription,
    NotificationChannels_RemoveSelectedCaption,
    NotificationChannels_RemoveSelectedDescription,
    NotificationChannels_SelectAllCaption,
    NotificationChannels_SelectAllDescription,
    ScanFieldSetLoadErrorTypeDisplay_AndFieldHasOrChild,
    ScanFieldSetLoadErrorTypeDisplay_AndFieldHasXorChild,
    ScanFieldSetLoadErrorTypeDisplay_OrFieldHasAndChild,
    ScanFieldSetLoadErrorTypeDisplay_OrFieldHasXorChild,
    ScanFieldSetLoadErrorTypeDisplay_XorFieldDoesNotHave2Children,
    ScanFieldSetLoadErrorTypeDisplay_XorFieldHasAndChild,
    ScanFieldSetLoadErrorTypeDisplay_XorFieldHasOrChild,
    ScanFieldSetLoadErrorTypeDisplay_XorFieldHasXorChild,
    ScanFieldSetLoadErrorTypeDisplay_AndFieldOperatorCannotBeNegated,
    ScanFieldSetLoadErrorTypeDisplay_OrFieldOperatorCannotBeNegated,
    ScanFieldSetLoadErrorTypeDisplay_XorFieldOperatorCannotBeNegated,
    ScanFieldSetLoadErrorTypeDisplay_AllConditionNotSupported,
    ScanFieldSetLoadErrorTypeDisplay_NoneConditionNotSupported,
    ScanFieldSetLoadErrorTypeDisplay_FieldConditionsOperationIdMismatch,
    ScanFieldSetLoadErrorTypeDisplay_NumericComparisonBooleanNodeDoesNotHaveANumericFieldValueGetOperand,
    ScanFieldSetLoadErrorTypeDisplay_NumericComparisonBooleanNodeDoesNotHaveANumberOperand,
    ScanFieldSetLoadErrorTypeDisplay_FactoryCreateFieldError,
    ScanFieldSetLoadErrorTypeDisplay_FactoryCreateFieldConditionError,
    OpenWatchlistDialog_ListName_Caption,
    OpenWatchlistDialog_ListName_Description,
    ReviewOrderRequest_InvalidPlaceOrderZenithMessage,
    ReviewOrderRequest_InvalidAmendOrderZenithMessage,
    ReviewOrderRequest_InvalidMoveOrderZenithMessage,
    ReviewOrderRequest_InvalidCancelOrderZenithMessage,
}

/** @public */
export namespace I18nStrings {
    // Languages
    const enum LanguageId {
        English
    }

    const DefaultLanguageId = LanguageId.English;

    interface Language {
        readonly id: LanguageId;
        readonly code: string;
    }

    const EnglishCode = 'en';

    const Languages: Language[] = [
        { id: LanguageId.English, code: EnglishCode },
    ];

    interface Translations {
        en: string;
    }

    interface Rec {
        readonly id: StringId;
        readonly translations: Translations;
    }

    type recsObject = { [id in keyof typeof StringId]: Rec };

    /* eslint-disable max-len */
    const recsObject: recsObject = {
        InternalError: {
            id: StringId.InternalError, translations: {
                en: 'Internal error',
            }
        },
        PersistError: {
            id: StringId.PersistError, translations: {
                en: 'Persist error',
            }
        },
        AssertInternalError: {
            id: StringId.AssertInternalError, translations: {
                en: 'Internal assert error',
            }
        },
        TypeInternalError: {
            id: StringId.TypeInternalError, translations: {
                en: 'Internal type Error',
            }
        },
        UnreachableCaseInternalError: {
            id: StringId.UnreachableCaseInternalError, translations: {
                en: 'Internal unreachable case error',
            }
        },
        UnexpectedCaseInternalError: {
            id: StringId.UnexpectedCaseInternalError, translations: {
                en: 'Internal unexpected case error',
            }
        },
        NotImplementedInternalError: {
            id: StringId.NotImplementedInternalError, translations: {
                en: 'Internal not implemented error',
            }
        },
        UnexpectedUndefinedInternalError: {
            id: StringId.UnexpectedUndefinedInternalError, translations: {
                en: 'Internal unexpected undefined error',
            }
        },
        UnexpectedTypeInternalError: {
            id: StringId.UnexpectedTypeInternalError, translations: {
                en: 'Internal unexpected type error',
            }
        },
        EnumInfoOutOfOrderInternalError: {
            id: StringId.EnumInfoOutOfOrderInternalError, translations: {
                en: 'Internal enum info out of order error',
            }
        },
        ExternalError: {
            id: StringId.ExternalError, translations: {
                en: 'External error',
            }
        },
        PossibleExternalError: {
            id: StringId.PossibleExternalError, translations: {
                en: 'Possible External error',
            }
        },
        JsonLoadExternalError: {
            id: StringId.JsonLoadExternalError, translations: {
                en: 'Zenith JSON error',
            }
        },
        ConfigExternalError: {
            id: StringId.ConfigExternalError, translations: {
                en: 'Configuration error',
            }
        },
        ColumnLayoutExternalError: {
            id: StringId.ColumnLayoutExternalError, translations: {
                en: 'Grid layout error',
            }
        },
        DataExternalError: {
            id: StringId.DataExternalError, translations: {
                en: 'Data error',
            }
        },
        FeedExternalError: {
            id: StringId.FeedExternalError, translations: {
                en: 'Feed error',
            }
        },
        ZenithDataExternalError: {
            id: StringId.ZenithDataExternalError, translations: {
                en: 'Zenith data error',
            }
        },
        ZenithUnexpectedCaseExternalError: {
            id: StringId.ZenithUnexpectedCaseExternalError, translations: {
                en: 'Zenith Unexpected case error',
            }
        },
        ZenithDataStateExternalError: {
            id: StringId.ZenithDataStateExternalError, translations: {
                en: 'Zenith data state error',
            }
        },
        ZenithEncodedScanFormulaDecodeError: {
            id: StringId.ZenithEncodedScanFormulaDecodeError, translations: {
                en: 'Zenith encoded scan formula decode error',
            }
        },
        MotifServicesExternalError: {
            id: StringId.MotifServicesExternalError, translations: {
                en: 'Motif services error',
            }
        },
        PublisherExternalError: {
            id: StringId.PublisherExternalError, translations: {
                en: 'Publisher error',
            }
        },
        ExtensionExternalError: {
            id: StringId.ExtensionExternalError, translations: {
                en: 'Extension error',
            }
        },
        ExtensionOrInternalExternalError: {
            id: StringId.ExtensionOrInternalExternalError, translations: {
                en: 'Extension or internal error',
            }
        },
        ApiExternalError: {
            id: StringId.ApiExternalError, translations: {
                en: 'API error',
            }
        },
        QueryParamExternalError: {
            id: StringId.QueryParamExternalError, translations: {
                en: 'Query param error',
            }
        },
        DuplicateExternalError: {
            id: StringId.DuplicateExternalError, translations: {
                en: 'Duplicate error',
            }
        },
        RangeError: {
            id: StringId.RangeError, translations: {
                en: 'Range error: value',
            }
        },
        ArraySizeOverflow: {
            id: StringId.ArraySizeOverflow, translations: {
                en: 'array size overflow: value',
            }
        },
        ValueNotFound: {
            id: StringId.ValueNotFound, translations: {
                en: 'Value not found',
            }
        },
        Unknown: {
            id: StringId.Unknown, translations: {
                en: 'Unknown',
            }
        },
        UnknownMarket: {
            id: StringId.UnknownMarket, translations: {
                en: 'Unknown market',
            }
        },
        UnknownExchange: {
            id: StringId.UnknownExchange, translations: {
                en: 'Unknown exchange',
            }
        },
        UnknownIvemClass: {
            id: StringId.UnknownIvemClass, translations: {
                en: 'Unknown Ivem Class',
            }
        },
        UnknownDisplayString: {
            id: StringId.UnknownDisplayString, translations: {
                en: '???',
            }
        },
        Ok: {
            id: StringId.Ok, translations: {
                en: 'Ok',
            }
        },
        Cancel: {
            id: StringId.Cancel, translations: {
                en: 'Cancel',
            }
        },
        Cancelled: {
            id: StringId.Cancelled, translations: {
                en: 'Cancelled',
            }
        },
        Yes: {
            id: StringId.Yes, translations: {
                en: 'yes',
            }
        },
        No: {
            id: StringId.No, translations: {
                en: 'no',
            }
        },
        True: {
            id: StringId.True, translations: {
                en: 'true',
            }
        },
        False: {
            id: StringId.False, translations: {
                en: 'false',
            }
        },
        Left: {
            id: StringId.Left, translations: {
                en: 'left',
            }
        },
        Right: {
            id: StringId.Right, translations: {
                en: 'right',
            }
        },
        Show: {
            id: StringId.Show, translations: {
                en: 'show',
            }
        },
        For: {
            id: StringId.For, translations: {
                en: 'for',
            }
        },
        On: {
            id: StringId.On, translations: {
                en: 'on',
            }
        },
        From: {
            id: StringId.From, translations: {
                en: 'from',
            }
        },
        To: {
            id: StringId.To, translations: {
                en: 'to',
            }
        },
        Not: {
            id: StringId.Not, translations: {
                en: 'Not',
            }
        },
        Blank: {
            id: StringId.Blank, translations: {
                en: 'Blank',
            }
        },
        Filter: {
            id: StringId.Filter, translations: {
                en: 'Filter',
            }
        },
        Exclude: {
            id: StringId.Exclude, translations: {
                en: 'Exclude',
            }
        },
        Open: {
            id: StringId.Open, translations: {
                en: 'Open',
            }
        },
        Close: {
            id: StringId.Close, translations: {
                en: 'Close',
            }
        },
        Create: {
            id: StringId.Create, translations: {
                en: 'Create',
            }
        },
        Add: {
            id: StringId.Add, translations: {
                en: 'Add',
            }
        },
        Delete: {
            id: StringId.Delete, translations: {
                en: 'Delete',
            }
        },
        Deleting: {
            id: StringId.Deleting, translations: {
                en: 'Deleting',
            }
        },
        Deleted: {
            id: StringId.Deleted, translations: {
                en: 'Deleted',
            }
        },
        Attach: {
            id: StringId.Attach, translations: {
                en: 'Attach',
            }
        },
        Detach: {
            id: StringId.Detach, translations: {
                en: 'Detach',
            }
        },
        Update: {
            id: StringId.Update, translations: {
                en: 'Update',
            }
        },
        Edit: {
            id: StringId.Edit, translations: {
                en: 'Edit',
            }
        },
        Apply: {
            id: StringId.Apply, translations: {
                en: 'Apply',
            }
        },
        Revert: {
            id: StringId.Revert, translations: {
                en: 'Revert',
            }
        },
        Overwrite: {
            id: StringId.Overwrite, translations: {
                en: 'Overwrite',
            }
        },
        Test: {
            id: StringId.Test, translations: {
                en: 'Test',
            }
        },
        Search: {
            id: StringId.Search, translations: {
                en: 'Search',
            }
        },
        Details: {
            id: StringId.Details, translations: {
                en: 'Details',
            }
        },
        Status: {
            id: StringId.Status, translations: {
                en: 'Status',
            }
        },
        Correctness: {
            id: StringId.Correctness, translations: {
                en: 'Correctness',
            }
        },
        Acknowledge: {
            id: StringId.Acknowledge, translations: {
                en: 'Acknowledge',
            }
        },
        Keywords: {
            id: StringId.Keywords, translations: {
                en: 'Keywords',
            }
        },
        ContactMe: {
            id: StringId.ContactMe, translations: {
                en: 'Contact me',
            }
        },
        NotInterested: {
            id: StringId.NotInterested, translations: {
                en: 'Not interested',
            }
        },
        Interested: {
            id: StringId.Interested, translations: {
                en: 'Interested',
            }
        },
        Similar: {
            id: StringId.Similar, translations: {
                en: 'Similar',
            }
        },
        Incompatible: {
            id: StringId.Incompatible, translations: {
                en: 'Incompatible',
            }
        },
        // eslint-disable-next-line id-blacklist
        Undefined: {
            id: StringId.Undefined, translations: {
                en: 'Undefined',
            }
        },
        Enabled: {
            id: StringId.Enabled, translations: {
                en: 'Enabled',
            }
        },
        Readonly: {
            id: StringId.Readonly, translations: {
                en: 'Readonly',
            }
        },
        Visible: {
            id: StringId.Visible, translations: {
                en: 'Visible',
            }
        },
        Writable: {
            id: StringId.Writable, translations: {
                en: 'Writable',
            }
        },
        Offline: {
            id: StringId.Offline, translations: {
                en: 'Offline',
            }
        },
        Online: {
            id: StringId.Online, translations: {
                en: 'Online',
            }
        },
        Available: {
            id: StringId.Available, translations: {
                en: 'Available',
            }
        },
        InUse: {
            id: StringId.InUse, translations: {
                en: 'In use',
            }
        },
        View: {
            id: StringId.View, translations: {
                en: 'View',
            }
        },
        Expand: {
            id: StringId.Expand, translations: {
                en: 'Expand',
            }
        },
        Restore: {
            id: StringId.Restore, translations: {
                en: 'Restore',
            }
        },
        Collapse: {
            id: StringId.Collapse, translations: {
                en: 'Collapse',
            }
        },
        ExpandSection: {
            id: StringId.ExpandSection, translations: {
                en: 'Expand section',
            }
        },
        RestoreSection: {
            id: StringId.RestoreSection, translations: {
                en: 'Restore section',
            }
        },
        CollapseSection: {
            id: StringId.CollapseSection, translations: {
                en: 'Collapse section',
            }
        },
        SignedOut: {
            id: StringId.SignedOut, translations: {
                en: 'Signed out',
            }
        },
        SignInAgain: {
            id: StringId.SignInAgain, translations: {
                en: 'Signed in again',
            }
        },
        Version: {
            id: StringId.Version, translations: {
                en: 'Version',
            }
        },
        Service: {
            id: StringId.Service, translations: {
                en: 'Service',
            }
        },
        Restart: {
            id: StringId.Restart, translations: {
                en: 'Restart',
            }
        },
        ErrorCount: {
            id: StringId.ErrorCount, translations: {
                en: 'Error count',
            }
        },
        Hide: {
            id: StringId.Hide, translations: {
                en: 'Hide',
            }
        },
        CopyToClipboard: {
            id: StringId.CopyToClipboard, translations: {
                en: 'Copy to clipboard',
            }
        },
        InsufficientCharacters: {
            id: StringId.InsufficientCharacters, translations: {
                en: 'Insufficient Characters',
            }
        },
        CircularDependency: {
            id: StringId.CircularDependency, translations: {
                en: 'Circular Dependency',
            }
        },
        NotInitialised: {
            id: StringId.NotInitialised, translations: {
                en: 'Not Initialised',
            }
        },
        Missing: {
            id: StringId.Missing, translations: {
                en: 'Missing',
            }
        },
        Disabled: {
            id: StringId.Disabled, translations: {
                en: 'Disabled',
            }
        },
        Prerequisite: {
            id: StringId.Prerequisite, translations: {
                en: 'Prerequisite',
            }
        },
        Waiting: {
            id: StringId.Waiting, translations: {
                en: 'Waiting',
            }
        },
        Error: {
            id: StringId.Error, translations: {
                en: 'Error',
            }
        },
        NoErrors: {
            id: StringId.NoErrors, translations: {
                en: 'No Errors',
            }
        },
        Editing: {
            id: StringId.Editing, translations: {
                en: 'Editing',
            }
        },
        Modified: {
            id: StringId.Modified, translations: {
                en: 'Modified',
            }
        },
        Valid: {
            id: StringId.Valid, translations: {
                en: 'Valid',
            }
        },
        Invalid: {
            id: StringId.Invalid, translations: {
                en: 'Invalid',
            }
        },
        Faulted: {
            id: StringId.Faulted, translations: {
                en: 'Faulted',
            }
        },
        InvalidIntegerString: {
            id: StringId.InvalidIntegerString, translations: {
                en: 'Invalid integer string',
            }
        },
        UnsupportedValue: {
            id: StringId.UnsupportedValue, translations: {
                en: 'Unsupported Value',
            }
        },
        NotObject: {
            id: StringId.NotObject, translations: {
                en: 'Not Object',
            }
        },
        InvalidObject: {
            id: StringId.InvalidObject, translations: {
                en: 'Invalid Object',
            }
        },
        NotString: {
            id: StringId.NotString, translations: {
                en: 'Not String',
            }
        },
        InvalidString: {
            id: StringId.InvalidString, translations: {
                en: 'Invalid String',
            }
        },
        NotNumber: {
            id: StringId.NotNumber, translations: {
                en: 'Not Number',
            }
        },
        InvalidNumber: {
            id: StringId.InvalidNumber, translations: {
                en: 'Invalid Number',
            }
        },
        NotBoolean: {
            id: StringId.NotBoolean, translations: {
                en: 'Not Boolean',
            }
        },
        InvalidBoolean: {
            id: StringId.InvalidBoolean, translations: {
                en: 'Invalid Boolean',
            }
        },
        InvalidDate: {
            id: StringId.InvalidDate, translations: {
                en: 'Invalid Date',
            }
        },
        InvalidJsonObject: {
            id: StringId.InvalidJsonObject, translations: {
                en: 'Invalid JSON Object',
            }
        },
        InvalidJsonText: {
            id: StringId.InvalidJsonText, translations: {
                en: 'Invalid JSON Text',
            }
        },
        NotArray: {
            id: StringId.NotArray, translations: {
                en: 'Not Array',
            }
        },
        InvalidObjectArray: {
            id: StringId.InvalidObjectArray, translations: {
                en: 'Invalid Object Array',
            }
        },
        InvalidStringArray: {
            id: StringId.InvalidStringArray, translations: {
                en: 'Invalid String Array',
            }
        },
        InvalidNumberArray: {
            id: StringId.InvalidNumberArray, translations: {
                en: 'Invalid Number Array',
            }
        },
        InvalidBooleanArray: {
            id: StringId.InvalidBooleanArray, translations: {
                en: 'Invalid Boolean Array',
            }
        },
        InvalidJsonObjectArray: {
            id: StringId.InvalidJsonObjectArray, translations: {
                en: 'Invalid JSON Object Array',
            }
        },
        InvalidAnyJsonValueTypeArray: {
            id: StringId.InvalidAnyJsonValueTypeArray, translations: {
                en: 'Invalid AnyJsonValueType Array',
            }
        },
        DecimalNotJsonString: {
            id: StringId.DecimalNotJsonString, translations: {
                en: 'Decimal is not JSON string',
            }
        },
        InvalidDecimal: {
            id: StringId.InvalidDecimal, translations: {
                en: 'Invalid Decimal',
            }
        },
        IvemIdNotJsonString: {
            id: StringId.IvemIdNotJsonString, translations: {
                en: 'IvemId is not JSON string',
            }
        },
        InvalidIvemIdJson: {
            id: StringId.InvalidIvemIdJson, translations: {
                en: 'Invalid IvemId JSON',
            }
        },
        DataIvemIdNotJsonObject: {
            id: StringId.DataIvemIdNotJsonObject, translations: {
                en: 'DataIvemId is not JSON object',
            }
        },
        InvalidDataIvemIdJson: {
            id: StringId.InvalidDataIvemIdJson, translations: {
                en: 'Invalid DataIvemId JSON',
            }
        },
        UiEntryError: {
            id: StringId.UiEntryError, translations: {
                en: 'UI entry error',
            }
        },
        ErrorGetting: {
            id: StringId.ErrorGetting, translations: {
                en: 'Error getting',
            }
        },
        ErrorOpening: {
            id: StringId.ErrorOpening, translations: {
                en: 'Error opening',
            }
        },
        ErrorOpeningSaved: {
            id: StringId.ErrorOpeningSaved, translations: {
                en: 'Error opening saved',
            }
        },
        ErrorCreating: {
            id: StringId.ErrorCreating, translations: {
                en: 'Error creating',
            }
        },
        ErrorCreatingNew: {
            id: StringId.ErrorCreatingNew, translations: {
                en: 'Error creating new',
            }
        },
        ErrorUpdating: {
            id: StringId.ErrorUpdating, translations: {
                en: 'Error updating',
            }
        },
        ErrorDeleting: {
            id: StringId.ErrorDeleting, translations: {
                en: 'Error deleting',
            }
        },
        ErrorLoadingColumnLayout: {
            id: StringId.ErrorLoadingColumnLayout, translations: {
                en: 'Error loading grid layout',
            }
        },
        ValueRequired: {
            id: StringId.ValueRequired, translations: {
                en: 'Value required',
            }
        },
        ExchangeDoesNotHaveDefaultLitMarket: {
            id: StringId.ExchangeDoesNotHaveDefaultLitMarket, translations: {
                en: 'Exchange does not have a default lit market',
            }
        },
        ExchangeDoesNotHaveDefaultTradingMarket: {
            id: StringId.ExchangeDoesNotHaveDefaultTradingMarket, translations: {
                en: 'Exchange does not have a default trading market',
            }
        },
        MarketDoesNotSupportSymbolsFromExchange: {
            id: StringId.MarketDoesNotSupportSymbolsFromExchange, translations: {
                en: 'Market does not support symbols from exchange',
            }
        },
        InvalidExchange: {
            id: StringId.InvalidExchange, translations: {
                en: 'Invalid Exchange',
            }
        },
        InvalidExchangeOrZenithExchange: {
            id: StringId.InvalidExchangeOrZenithExchange, translations: {
                en: 'Invalid Exchange (or Zenith Exchange)',
            }
        },
        InvalidMarket: {
            id: StringId.InvalidMarket, translations: {
                en: 'Invalid Market',
            }
        },
        InvalidExchangeOrZenithMarket: {
            id: StringId.InvalidExchangeOrZenithMarket, translations: {
                en: 'Invalid Exchange (or Zenith Market)',
            }
        },
        MarketCodeNotFoundInRic: {
            id: StringId.MarketCodeNotFoundInRic, translations: {
                en: 'Market code not found in RIC',
            }
        },
        CodeNotFoundInRic: {
            id: StringId.CodeNotFoundInRic, translations: {
                en: 'Security code not found in RIC',
            }
        },
        UnsupportedMarketCodeInRic: {
            id: StringId.UnsupportedMarketCodeInRic, translations: {
                en: 'Unsupport market code in RIC',
            }
        },
        AllBrokerageAccounts: {
            id: StringId.AllBrokerageAccounts, translations: {
                en: 'All Accounts',
            }
        },
        BrokerageAccountNotFound: {
            id: StringId.BrokerageAccountNotFound, translations: {
                en: 'Account not found',
            }
        },
        BrokerageAccountNotMatched: {
            id: StringId.BrokerageAccountNotMatched, translations: {
                en: 'Account not matched',
            }
        },
        TopShareholdersOnlySupportNzx: {
            id: StringId.TopShareholdersOnlySupportNzx, translations: {
                en: 'Top Shareholders only supports NZX',
            }
        },
        GroupOrdersByPriceLevel: {
            id: StringId.GroupOrdersByPriceLevel, translations: {
                en: 'Group Orders by Price Level',
            }
        },
        SessionEndedAsLoggedInElsewhere: {
            id: StringId.SessionEndedAsLoggedInElsewhere, translations: {
                en: 'Session ended as logged in elsewhere',
            }
        },
        MotifServicesResponseStatusError: {
            id: StringId.MotifServicesResponseStatusError, translations: {
                en: 'MotifServices Response Status Error',
            }
        },
        MotifServicesFetchError: {
            id: StringId.MotifServicesFetchError, translations: {
                en: 'MotifServices Fetch Error',
            }
        },
        MotifServicesFetchTextError: {
            id: StringId.MotifServicesFetchTextError, translations: {
                en: 'MotifServices Fetch Text Error',
            }
        },
        NodeType: {
            id: StringId.NodeType, translations: {
                en: 'Node Type',
            }
        },
        Depth: {
            id: StringId.Depth, translations: {
                en: 'Depth',
            }
        },
        BidDepth: {
            id: StringId.BidDepth, translations: {
                en: 'Bid Depth',
            }
        },
        AskDepth: {
            id: StringId.AskDepth, translations: {
                en: 'Ask Depth',
            }
        },
        KickedOff: {
            id: StringId.KickedOff, translations: {
                en: 'Kicked Off',
            }
        },
        NotReadable: {
            id: StringId.NotReadable, translations: {
                en: 'Not readable',
            }
        },
        PriceRemainder: {
            id: StringId.PriceRemainder, translations: {
                en: 'rem',
            }
        },
        Query: {
            id: StringId.Query, translations: {
                en: 'Query',
            }
        },
        Subscribe: {
            id: StringId.Subscribe, translations: {
                en: 'Subscribe',
            }
        },
        Subscription: {
            id: StringId.Subscription, translations: {
                en: 'Subscription',
            }
        },
        Fields: {
            id: StringId.Fields, translations: {
                en: 'Fields',
            }
        },
        Source: {
            id: StringId.Source, translations: {
                en: 'Source',
            }
        },
        Feed: {
            id: StringId.Feed, translations: {
                en: 'Feed',
            }
        },
        ExchangeEnvironments: {
            id: StringId.ExchangeEnvironments, translations: {
                en: 'Exchange environments',
            }
        },
        Exchange: {
            id: StringId.Exchange, translations: {
                en: 'Exchange',
            }
        },
        Exchanges: {
            id: StringId.Exchanges, translations: {
                en: 'Exchanges',
            }
        },
        Market: {
            id: StringId.Market, translations: {
                en: 'Market',
            }
        },
        Markets: {
            id: StringId.Markets, translations: {
                en: 'Markets',
            }
        },
        DataMarkets: {
            id: StringId.DataMarkets, translations: {
                en: 'Data Markets',
            }
        },
        TradingMarkets: {
            id: StringId.TradingMarkets, translations: {
                en: 'Trading Markets',
            }
        },
        MarketBoards: {
            id: StringId.MarketBoards, translations: {
                en: 'Market Boards',
            }
        },
        ServerInformation: {
            id: StringId.ServerInformation, translations: {
                en: 'Server Info',
            }
        },
        Class: {
            id: StringId.Class, translations: {
                en: 'Class',
            }
        },
        Cfi: {
            id: StringId.Cfi, translations: {
                en: 'CFI',
            }
        },
        Partial: {
            id: StringId.Partial, translations: {
                en: 'Partial',
            }
        },
        Exact: {
            id: StringId.Exact, translations: {
                en: 'Exact',
            }
        },
        IgnoreCase: {
            id: StringId.IgnoreCase, translations: {
                en: 'Ignore case',
            }
        },
        FromStart: {
            id: StringId.FromStart, translations: {
                en: 'From start',
            }
        },
        FromEnd: {
            id: StringId.FromEnd, translations: {
                en: 'From end',
            }
        },
        Full: {
            id: StringId.Full, translations: {
                en: 'Full',
            }
        },
        Options: {
            id: StringId.Options, translations: {
                en: 'Options',
            }
        },
        Page: {
            id: StringId.Page, translations: {
                en: 'Page',
            }
        },
        Of: {
            id: StringId.Of, translations: {
                en: 'of',
            }
        },
        Seconds: {
            id: StringId.Seconds, translations: {
                en: 'seconds',
            }
        },
        SymbolList: {
            id: StringId.SymbolList, translations: {
                en: 'Symbol list',
            }
        },
        Watchlist: {
            id: StringId.Watchlist, translations: {
                en: 'Watchlist',
            }
        },
        Trades: {
            id: StringId.Trades, translations: {
                en: 'Trades',
            }
        },
        Orders: {
            id: StringId.Orders, translations: {
                en: 'Orders',
            }
        },
        Holdings: {
            id: StringId.Holdings, translations: {
                en: 'Holdings',
            }
        },
        Balances: {
            id: StringId.Balances, translations: {
                en: 'Balances',
            }
        },
        Trading: {
            id: StringId.Trading, translations: {
                en: 'Trading',
            }
        },
        NoTable: {
            id: StringId.NoTable, translations: {
                en: 'No Watchlist',
            }
        },
        DeleteWatchlist: {
            id: StringId.DeleteWatchlist, translations: {
                en: 'Delete Watchlist',
            }
        },
        CannotDeleteWatchlist: {
            id: StringId.CannotDeleteWatchlist, translations: {
                en: 'Cannot delete Watchlist',
            }
        },
        CannotDeletePrivateList: {
            id: StringId.CannotDeletePrivateList, translations: {
                en: 'Cannot delete private list',
            }
        },
        CannotDeleteBuiltinList: {
            id: StringId.CannotDeleteBuiltinList, translations: {
                en: 'Cannot delete builtin list',
            }
        },
        DeleteList: {
            id: StringId.DeleteList, translations: {
                en: 'Delete list',
            }
        },
        CannotDeleteList: {
            id: StringId.CannotDeleteList, translations: {
                en: 'Cannot delete list',
            }
        },
        NewScan: {
            id: StringId.NewScan, translations: {
                en: 'New',
            }
        },
        Scan: {
            id: StringId.Scan, translations: {
                en: 'Scan',
            }
        },
        TableJsonMissingFieldlist: {
            id: StringId.TableJsonMissingFieldlist, translations: {
                en: 'Table JSON Missing Field List',
            }
        },
        NamedDataSource: {
            id: StringId.NamedDataSource, translations: {
                en: 'Named Grid',
            }
        },
        List: {
            id: StringId.List, translations: {
                en: 'List',
            }
        },
        None: {
            id: StringId.None, translations: {
                en: 'None',
            }
        },
        QuestionMark: {
            id: StringId.QuestionMark, translations: {
                en: '?',
            }
        },
        New: {
            id: StringId.New, translations: {
                en: 'New',
            }
        },
        Private: {
            id: StringId.Private, translations: {
                en: 'Private',
            }
        },
        Index: {
            id: StringId.Index, translations: {
                en: 'Index',
            }
        },
        Undisclosed: {
            id: StringId.Undisclosed, translations: {
                en: 'Undisclosed',
            }
        },
        Physical: {
            id: StringId.Physical, translations: {
                en: 'Physical',
            }
        },
        Matched: {
            id: StringId.Matched, translations: {
                en: 'Matched',
            }
        },
        General: {
            id: StringId.General, translations: {
                en: 'General',
            }
        },
        Criteria: {
            id: StringId.Criteria, translations: {
                en: 'Criteria',
            }
        },
        Rank: {
            id: StringId.Rank, translations: {
                en: 'Rank',
            }
        },
        Targets: {
            id: StringId.Targets, translations: {
                en: 'Targets',
            }
        },
        DistributionMethodIds: {
            id: StringId.DistributionMethodIds, translations: {
                en: 'Notification channel types',
            }
        },
        NotificationChannel: {
            id: StringId.NotificationChannel, translations: {
                en: 'Notification channel',
            }
        },
        NotificationChannels: {
            id: StringId.NotificationChannels, translations: {
                en: 'Notification channels',
            }
        },
        NotificationChannelsGrid: {
            id: StringId.NotificationChannelsGrid, translations: {
                en: 'Notification channels grid',
            }
        },
        ScanEditorAttachedNotificationChannels: {
            id: StringId.ScanEditorAttachedNotificationChannels, translations: {
                en: 'Scan editor attached notification channels',
            }
        },
        ScanFieldEditorFramesGrid: {
            id: StringId.ScanFieldEditorFramesGrid, translations: {
                en: 'Scan field editor frames grid',
            }
        },
        ScanTestMatches: {
            id: StringId.ScanTestMatches, translations: {
                en: 'Scan test matches',
            }
        },
        DataIvemIdListEditor: {
            id: StringId.DataIvemIdListEditor, translations: {
                en: 'Symbol list editor',
            }
        },
        SearchSymbols: {
            id: StringId.SearchSymbols, translations: {
                en: 'Search symbols',
            }
        },
        DepthAndSalesWatchlist: {
            id: StringId.DepthAndSalesWatchlist, translations: {
                en: 'Depth and trades watchlist',
            }
        },
        Feeds: {
            id: StringId.Feeds, translations: {
                en: 'Feeds',
            }
        },
        FeedInitialising: {
            id: StringId.FeedInitialising, translations: {
                en: 'Feed initialising',
            }
        },
        FeedWaitingStatus: {
            id: StringId.FeedWaitingStatus, translations: {
                en: 'Waiting Status',
            }
        },
        Notifications: {
            id: StringId.Notifications, translations: {
                en: 'Notifications',
            }
        },
        AllowedFields: {
            id: StringId.AllowedFields, translations: {
                en: 'Allowed Fields',
            }
        },
        ColumnLayoutEditorColumns: {
            id: StringId.ColumnLayoutEditorColumns, translations: {
                en: 'Grid Layout Editor Columns',
            }
        },
        BrokerageAccounts: {
            id: StringId.BrokerageAccounts, translations: {
                en: 'Brokerage accounts',
            }
        },
        OrderAuthorise: {
            id: StringId.OrderAuthorise, translations: {
                en: 'Order authorise',
            }
        },
        Scans: {
            id: StringId.Scans, translations: {
                en: 'Scans',
            }
        },
        TopShareholders: {
            id: StringId.TopShareholders, translations: {
                en: 'Top shareholders',
            }
        },
        ColumnLayout: {
            id: StringId.ColumnLayout, translations: {
                en: 'Grid layout',
            }
        },
        ExecuteCommandTitle: {
            id: StringId.ExecuteCommandTitle, translations: {
                en: 'Execute Command'
            }
        },
        ApplySymbolCaption: {
            id: StringId.ApplySymbolCaption, translations: {
                en: 'Apply symbol',
            }
        },
        ApplySymbolTitle: {
            id: StringId.ApplySymbolTitle, translations: {
                en: 'Apply symbol',
            }
        },
        SelectColumnsCaption: {
            id: StringId.SelectColumnsCaption, translations: {
                en: 'Select Columns',
            }
        },
        SelectColumnsTitle: {
            id: StringId.SelectColumnsTitle, translations: {
                en: 'Select Columns',
            }
        },
        AutoSizeColumnWidthsCaption: {
            id: StringId.AutoSizeColumnWidthsCaption, translations: {
                en: 'Column widths',
            }
        },
        AutoSizeColumnWidthsTitle: {
            id: StringId.AutoSizeColumnWidthsTitle, translations: {
                en: 'Auto size column widths (Hold down shift to widen only)',
            }
        },
        SymbolInputTitle: {
            id: StringId.SymbolInputTitle, translations: {
                en: 'Enter symbol',
            }
        },
        ToggleSearchTermNotExchangedMarketProcessedCaption: {
            id: StringId.ToggleSearchTermNotExchangedMarketProcessedCaption, translations: {
                en: 'No exchange/market processing'
            }
        },
        ToggleSearchTermNotExchangedMarketProcessedTitle: {
            id: StringId.ToggleSearchTermNotExchangedMarketProcessedTitle, translations: {
                en: 'Toggle search term does not include exchange or market'
            }
        },
        SelectAccountTitle: {
            id: StringId.SelectAccountTitle, translations: {
                en: 'Select account',
            }
        },
        ToggleSymbolLinkingCaption: {
            id: StringId.ToggleSymbolLinkingCaption, translations: {
                en: 'Symbol link',
            }
        },
        ToggleSymbolLinkingTitle: {
            id: StringId.ToggleSymbolLinkingTitle, translations: {
                en: 'Toggle symbol linking',
            }
        },
        ToggleAccountLinkingCaption: {
            id: StringId.ToggleAccountLinkingCaption, translations: {
                en: 'Account link',
            }
        },
        ToggleAccountLinkingTitle: {
            id: StringId.ToggleAccountLinkingTitle, translations: {
                en: 'Toggle account linking',
            }
        },
        BuyOrderPadCaption: {
            id: StringId.BuyOrderPadCaption, translations: {
                en: 'Buy ...',
            }
        },
        BuyOrderPadTitle: {
            id: StringId.BuyOrderPadTitle, translations: {
                en: 'Display a buy order pad',
            }
        },
        SellOrderPadCaption: {
            id: StringId.SellOrderPadCaption, translations: {
                en: 'Sell ...',
            }
        },
        SellOrderPadTitle: {
            id: StringId.SellOrderPadTitle, translations: {
                en: 'Display a sell order pad',
            }
        },
        AmendOrderPadCaption: {
            id: StringId.AmendOrderPadCaption, translations: {
                en: 'Amend ...',
            }
        },
        AmendOrderPadTitle: {
            id: StringId.AmendOrderPadTitle, translations: {
                en: 'Display an amend order pad for focused order',
            }
        },
        CancelOrderPadCaption: {
            id: StringId.CancelOrderPadCaption, translations: {
                en: 'Cancel ...',
            }
        },
        CancelOrderPadTitle: {
            id: StringId.CancelOrderPadTitle, translations: {
                en: 'Display a cancel order pad for focused order',
            }
        },
        MoveOrderPadCaption: {
            id: StringId.MoveOrderPadCaption, translations: {
                en: 'Move ...',
            }
        },
        MoveOrderPadTitle: {
            id: StringId.MoveOrderPadTitle, translations: {
                en: 'Display a move order pad for focused order',
            }
        },
        BackgroundColor: {
            id: StringId.BackgroundColor, translations: {
                en: 'Background Color',
            }
        },
        ForegroundColor: {
            id: StringId.ForegroundColor, translations: {
                en: 'Foreground Color',
            }
        },
        OpenColorSchemeTitle: {
            id: StringId.OpenColorSchemeTitle, translations: {
                en: 'Open another color scheme',
            }
        },
        SaveColorSchemeCaption: {
            id: StringId.SaveColorSchemeCaption, translations: {
                en: 'Save color scheme',
            }
        },
        SaveColorSchemeToADifferentNameTitle: {
            id: StringId.SaveColorSchemeToADifferentNameTitle, translations: {
                en: 'Save color scheme to another name.',
            }
        },
        ManageColorSchemesTitle: {
            id: StringId.ManageColorSchemesTitle, translations: {
                en: 'Manage all color schemes',
            }
        },
        BrokerageAccountIdInputPlaceholderText: {
            id: StringId.BrokerageAccountIdInputPlaceholderText, translations: {
                en: 'Account',
            }
        },
        FeedHeadingPrefix: {
            id: StringId.FeedHeadingPrefix, translations: {
                en: 'Feed ',
            }
        },
        TypingPauseWaiting: {
            id: StringId.TypingPauseWaiting, translations: {
                en: 'Waiting for typing pause',
            }
        },
        SearchRequiresAtLeast: {
            id: StringId.SearchRequiresAtLeast, translations: {
                en: 'Search requires at least',
            }
        },
        Characters: {
            id: StringId.Characters, translations: {
                en: 'characters',
            }
        },
        InvalidSymbol: {
            id: StringId.InvalidSymbol, translations: {
                en: 'Invalid symbol',
            }
        },
        FetchingSymbolDetails: {
            id: StringId.FetchingSymbolDetails, translations: {
                en: 'Fetching symbol details',
            }
        },
        SymbolNotFound: {
            id: StringId.SymbolNotFound, translations: {
                en: 'Symbol not found',
            }
        },
        NoMatchingSymbolsOrNamesFound: {
            id: StringId.NoMatchingSymbolsOrNamesFound, translations: {
                en: 'No matching symbols or names found',
            }
        },
        ScanEditor: {
            id: StringId.ScanEditor, translations: {
                en: 'Scan Editor',
            }
        },
        CreateScan: {
            id: StringId.CreateScan, translations: {
                en: 'Create Scan',
            }
        },
        UpdateScan: {
            id: StringId.UpdateScan, translations: {
                en: 'Update Scan',
            }
        },
        DeleteScan: {
            id: StringId.DeleteScan, translations: {
                en: 'Delete Scan',
            }
        },

        AddField: {
            id: StringId.AddField, translations: {
                en: 'Add field',
            }
        },
        AddAttributeField: {
            id: StringId.AddAttributeField, translations: {
                en: 'Add attr field',
            }
        },
        AddAltCodeField: {
            id: StringId.AddAltCodeField, translations: {
                en: 'Add code field',
            }
        },
        Warning_ConfigDefaultDefaultExchangeNotFound: {
            id: StringId.Warning_ConfigDefaultDefaultExchangeNotFound, translations: {
                en: 'Config default default exchange not found',
            }
        },
        Warning_ConfigExchangeDefaultExchangeEnvironmentNotFound: {
            id: StringId.Warning_ConfigExchangeDefaultExchangeEnvironmentNotFound, translations: {
                en: 'Config exchange default exchange environment not found',
            }
        },
        Warning_ConfigDefaultExchangeEnvironmentPriorityListHadNoMatches: {
            id: StringId.Warning_ConfigDefaultExchangeEnvironmentPriorityListHadNoMatches, translations: {
                en: 'Config default exchange environment priority list had no matches',
            }
        },
        Warning_CorrespondingSymbologyExchangeSuffixCodeAlreadyInUse: {
            id: StringId.Warning_CorrespondingSymbologyExchangeSuffixCodeAlreadyInUse, translations: {
                en: 'Corresponding symbology exchange suffix code already in use',
            }
        },
        Layout_InvalidJson: {
            id: StringId.Layout_InvalidJson, translations: {
                en: 'Invalid Json',
            }
        },
        Layout_SerialisationFormatNotDefinedLoadingDefault: {
            id: StringId.Layout_SerialisationFormatNotDefinedLoadingDefault, translations: {
                en: 'Layout serialisation format not defined. Loading default',
            }
        },
        Layout_SerialisationFormatIncompatibleLoadingDefault: {
            id: StringId.Layout_SerialisationFormatIncompatibleLoadingDefault, translations: {
                en: 'Incompatible layout serialisation format. Loading default',
            }
        },
        Layout_GoldenNotDefinedLoadingDefault: {
            id: StringId.Layout_GoldenNotDefinedLoadingDefault, translations: {
                en: 'Layout golden not defined. Loading default',
            }
        },
        Layout_CouldNotSave: {
            id: StringId.Layout_CouldNotSave, translations: {
                en: 'Could not save layout',
            }
        },
        SecurityFieldDisplay_Symbol: {
            id: StringId.SecurityFieldDisplay_Symbol, translations: {
                en: 'Symbol',
            }
        },
        SecurityFieldHeading_Symbol: {
            id: StringId.SecurityFieldHeading_Symbol, translations: {
                en: 'Symbol',
            }
        },
        SecurityFieldDisplay_Code: {
            id: StringId.SecurityFieldDisplay_Code, translations: {
                en: 'Code',
            }
        },
        SecurityFieldHeading_Code: {
            id: StringId.SecurityFieldHeading_Code, translations: {
                en: 'Code',
            }
        },
        SecurityFieldDisplay_Market: {
            id: StringId.SecurityFieldDisplay_Market, translations: {
                en: 'Market',
            }
        },
        SecurityFieldHeading_Market: {
            id: StringId.SecurityFieldHeading_Market, translations: {
                en: 'Market',
            }
        },
        SecurityFieldDisplay_Exchange: {
            id: StringId.SecurityFieldDisplay_Exchange, translations: {
                en: 'Exchange',
            }
        },
        SecurityFieldHeading_Exchange: {
            id: StringId.SecurityFieldHeading_Exchange, translations: {
                en: 'Exchange',
            }
        },
        SecurityFieldDisplay_Name: {
            id: StringId.SecurityFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        SecurityFieldHeading_Name: {
            id: StringId.SecurityFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        SecurityFieldDisplay_Class: {
            id: StringId.SecurityFieldDisplay_Class, translations: {
                en: 'Class',
            }
        },
        SecurityFieldHeading_Class: {
            id: StringId.SecurityFieldHeading_Class, translations: {
                en: 'Class',
            }
        },
        SecurityFieldDisplay_Cfi: {
            id: StringId.SecurityFieldDisplay_Cfi, translations: {
                en: 'CFI',
            }
        },
        SecurityFieldHeading_Cfi: {
            id: StringId.SecurityFieldHeading_Cfi, translations: {
                en: 'CFI',
            }
        },
        SecurityFieldDisplay_TradingState: {
            id: StringId.SecurityFieldDisplay_TradingState, translations: {
                en: 'Trading State',
            }
        },
        SecurityFieldHeading_TradingState: {
            id: StringId.SecurityFieldHeading_TradingState, translations: {
                en: 'State',
            }
        },
        SecurityFieldDisplay_TradingStateAllows: {
            id: StringId.SecurityFieldDisplay_TradingStateAllows, translations: {
                en: 'Trading State Allows',
            }
        },
        SecurityFieldHeading_TradingStateAllows: {
            id: StringId.SecurityFieldHeading_TradingStateAllows, translations: {
                en: 'State Allows',
            }
        },
        SecurityFieldDisplay_TradingStateReason: {
            id: StringId.SecurityFieldDisplay_TradingStateReason, translations: {
                en: 'Trading State Reason',
            }
        },
        SecurityFieldHeading_TradingStateReason: {
            id: StringId.SecurityFieldHeading_TradingStateReason, translations: {
                en: 'State Reason',
            }
        },
        SecurityFieldDisplay_TradingMarkets: {
            id: StringId.SecurityFieldDisplay_TradingMarkets, translations: {
                en: 'Trading Markets',
            }
        },
        SecurityFieldHeading_TradingMarkets: {
            id: StringId.SecurityFieldHeading_TradingMarkets, translations: {
                en: 'TradingMarkets',
            }
        },
        SecurityFieldDisplay_IsIndex: {
            id: StringId.SecurityFieldDisplay_IsIndex, translations: {
                en: 'Is Index',
            }
        },
        SecurityFieldHeading_IsIndex: {
            id: StringId.SecurityFieldHeading_IsIndex, translations: {
                en: 'IsIndex',
            }
        },
        SecurityFieldDisplay_ExpiryDate: {
            id: StringId.SecurityFieldDisplay_ExpiryDate, translations: {
                en: 'Expiry Date',
            }
        },
        SecurityFieldHeading_ExpiryDate: {
            id: StringId.SecurityFieldHeading_ExpiryDate, translations: {
                en: 'Expiry',
            }
        },
        SecurityFieldDisplay_StrikePrice: {
            id: StringId.SecurityFieldDisplay_StrikePrice, translations: {
                en: 'Strike Price',
            }
        },
        SecurityFieldHeading_StrikePrice: {
            id: StringId.SecurityFieldHeading_StrikePrice, translations: {
                en: 'StrikePrice',
            }
        },
        SecurityFieldDisplay_CallOrPut: {
            id: StringId.SecurityFieldDisplay_CallOrPut, translations: {
                en: 'Call/Put',
            }
        },
        SecurityFieldHeading_CallOrPut: {
            id: StringId.SecurityFieldHeading_CallOrPut, translations: {
                en: 'C/P',
            }
        },
        SecurityFieldDisplay_ContractSize: {
            id: StringId.SecurityFieldDisplay_ContractSize, translations: {
                en: 'Contract Size',
            }
        },
        SecurityFieldHeading_ContractSize: {
            id: StringId.SecurityFieldHeading_ContractSize, translations: {
                en: 'Contract Size',
            }
        },
        SecurityFieldDisplay_SubscriptionDataTypeIds: {
            id: StringId.SecurityFieldDisplay_SubscriptionDataTypeIds, translations: {
                en: 'Subscription Data Types',
            }
        },
        SecurityFieldHeading_SubscriptionDataTypeIds: {
            id: StringId.SecurityFieldHeading_SubscriptionDataTypeIds, translations: {
                en: 'Data Types',
            }
        },
        SecurityFieldDisplay_QuotationBasis: {
            id: StringId.SecurityFieldDisplay_QuotationBasis, translations: {
                en: 'Quotation Basis',
            }
        },
        SecurityFieldHeading_QuotationBasis: {
            id: StringId.SecurityFieldHeading_QuotationBasis, translations: {
                en: 'Basis',
            }
        },
        SecurityFieldDisplay_Currency: {
            id: StringId.SecurityFieldDisplay_Currency, translations: {
                en: 'Currency',
            }
        },
        SecurityFieldHeading_Currency: {
            id: StringId.SecurityFieldHeading_Currency, translations: {
                en: 'Currency',
            }
        },
        SecurityFieldDisplay_Open: {
            id: StringId.SecurityFieldDisplay_Open, translations: {
                en: 'Open',
            }
        },
        SecurityFieldHeading_Open: {
            id: StringId.SecurityFieldHeading_Open, translations: {
                en: 'Open',
            }
        },
        SecurityFieldDisplay_High: {
            id: StringId.SecurityFieldDisplay_High, translations: {
                en: 'High',
            }
        },
        SecurityFieldHeading_High: {
            id: StringId.SecurityFieldHeading_High, translations: {
                en: 'High',
            }
        },
        SecurityFieldDisplay_Low: {
            id: StringId.SecurityFieldDisplay_Low, translations: {
                en: 'Low',
            }
        },
        SecurityFieldHeading_Low: {
            id: StringId.SecurityFieldHeading_Low, translations: {
                en: 'Low',
            }
        },
        SecurityFieldDisplay_Close: {
            id: StringId.SecurityFieldDisplay_Close, translations: {
                en: 'Close',
            }
        },
        SecurityFieldHeading_Close: {
            id: StringId.SecurityFieldHeading_Close, translations: {
                en: 'Close',
            }
        },
        SecurityFieldDisplay_Settlement: {
            id: StringId.SecurityFieldDisplay_Settlement, translations: {
                en: 'Settlement',
            }
        },
        SecurityFieldHeading_Settlement: {
            id: StringId.SecurityFieldHeading_Settlement, translations: {
                en: 'Settlement',
            }
        },
        SecurityFieldDisplay_Last: {
            id: StringId.SecurityFieldDisplay_Last, translations: {
                en: 'Last',
            }
        },
        SecurityFieldHeading_Last: {
            id: StringId.SecurityFieldHeading_Last, translations: {
                en: 'Last',
            }
        },
        SecurityFieldDisplay_Trend: {
            id: StringId.SecurityFieldDisplay_Trend, translations: {
                en: 'Trend',
            }
        },
        SecurityFieldHeading_Trend: {
            id: StringId.SecurityFieldHeading_Trend, translations: {
                en: 'Trend',
            }
        },
        SecurityFieldDisplay_BestAsk: {
            id: StringId.SecurityFieldDisplay_BestAsk, translations: {
                en: 'Best Ask',
            }
        },
        SecurityFieldHeading_BestAsk: {
            id: StringId.SecurityFieldHeading_BestAsk, translations: {
                en: 'Ask',
            }
        },
        SecurityFieldDisplay_AskCount: {
            id: StringId.SecurityFieldDisplay_AskCount, translations: {
                en: 'Ask Count',
            }
        },
        SecurityFieldHeading_AskCount: {
            id: StringId.SecurityFieldHeading_AskCount, translations: {
                en: 'Ask Count',
            }
        },
        SecurityFieldDisplay_AskQuantity: {
            id: StringId.SecurityFieldDisplay_AskQuantity, translations: {
                en: 'Ask Quantity',
            }
        },
        SecurityFieldHeading_AskQuantity: {
            id: StringId.SecurityFieldHeading_AskQuantity, translations: {
                en: 'Ask Quantity',
            }
        },
        SecurityFieldDisplay_AskUndisclosed: {
            id: StringId.SecurityFieldDisplay_AskUndisclosed, translations: {
                en: 'Ask Undisclosed',
            }
        },
        SecurityFieldHeading_AskUndisclosed: {
            id: StringId.SecurityFieldHeading_AskUndisclosed, translations: {
                en: 'Ask Undisclosed',
            }
        },
        SecurityFieldDisplay_BestBid: {
            id: StringId.SecurityFieldDisplay_BestBid, translations: {
                en: 'Best Bid',
            }
        },
        SecurityFieldHeading_BestBid: {
            id: StringId.SecurityFieldHeading_BestBid, translations: {
                en: 'Bid',
            }
        },
        SecurityFieldDisplay_BidCount: {
            id: StringId.SecurityFieldDisplay_BidCount, translations: {
                en: 'Bid Count',
            }
        },
        SecurityFieldHeading_BidCount: {
            id: StringId.SecurityFieldHeading_BidCount, translations: {
                en: 'Bid Count',
            }
        },
        SecurityFieldDisplay_BidQuantity: {
            id: StringId.SecurityFieldDisplay_BidQuantity, translations: {
                en: 'Bid Quantity',
            }
        },
        SecurityFieldHeading_BidQuantity: {
            id: StringId.SecurityFieldHeading_BidQuantity, translations: {
                en: 'Bid Quantity',
            }
        },
        SecurityFieldDisplay_BidUndisclosed: {
            id: StringId.SecurityFieldDisplay_BidUndisclosed, translations: {
                en: 'Bid Undisclosed',
            }
        },
        SecurityFieldHeading_BidUndisclosed: {
            id: StringId.SecurityFieldHeading_BidUndisclosed, translations: {
                en: 'Bid Undisclosed',
            }
        },
        SecurityFieldDisplay_NumberOfTrades: {
            id: StringId.SecurityFieldDisplay_NumberOfTrades, translations: {
                en: 'Number of Trades',
            }
        },
        SecurityFieldHeading_NumberOfTrades: {
            id: StringId.SecurityFieldHeading_NumberOfTrades, translations: {
                en: 'Trades',
            }
        },
        SecurityFieldDisplay_Volume: {
            id: StringId.SecurityFieldDisplay_Volume, translations: {
                en: 'Volume',
            }
        },
        SecurityFieldHeading_Volume: {
            id: StringId.SecurityFieldHeading_Volume, translations: {
                en: 'Volume',
            }
        },
        SecurityFieldDisplay_AuctionPrice: {
            id: StringId.SecurityFieldDisplay_AuctionPrice, translations: {
                en: 'Auction Price',
            }
        },
        SecurityFieldHeading_AuctionPrice: {
            id: StringId.SecurityFieldHeading_AuctionPrice, translations: {
                en: 'Auction',
            }
        },
        SecurityFieldDisplay_AuctionQuantity: {
            id: StringId.SecurityFieldDisplay_AuctionQuantity, translations: {
                en: 'Auction Quantity',
            }
        },
        SecurityFieldHeading_AuctionQuantity: {
            id: StringId.SecurityFieldHeading_AuctionQuantity, translations: {
                en: 'Auction Quantity',
            }
        },
        SecurityFieldDisplay_AuctionRemainder: {
            id: StringId.SecurityFieldDisplay_AuctionRemainder, translations: {
                en: 'Auction Remainder',
            }
        },
        SecurityFieldHeading_AuctionRemainder: {
            id: StringId.SecurityFieldHeading_AuctionRemainder, translations: {
                en: 'Auction Remainder',
            }
        },
        SecurityFieldDisplay_VWAP: {
            id: StringId.SecurityFieldDisplay_VWAP, translations: {
                en: 'VWAP',
            }
        },
        SecurityFieldHeading_VWAP: {
            id: StringId.SecurityFieldHeading_VWAP, translations: {
                en: 'VWAP',
            }
        },
        SecurityFieldDisplay_ValueTraded: {
            id: StringId.SecurityFieldDisplay_ValueTraded, translations: {
                en: 'Value Traded',
            }
        },
        SecurityFieldHeading_ValueTraded: {
            id: StringId.SecurityFieldHeading_ValueTraded, translations: {
                en: 'Value Traded',
            }
        },
        SecurityFieldDisplay_OpenInterest: {
            id: StringId.SecurityFieldDisplay_OpenInterest, translations: {
                en: 'Open Interest',
            }
        },
        SecurityFieldHeading_OpenInterest: {
            id: StringId.SecurityFieldHeading_OpenInterest, translations: {
                en: 'OI',
            }
        },
        SecurityFieldDisplay_ShareIssue: {
            id: StringId.SecurityFieldDisplay_ShareIssue, translations: {
                en: 'Share Issue',
            }
        },
        SecurityFieldHeading_ShareIssue: {
            id: StringId.SecurityFieldHeading_ShareIssue, translations: {
                en: 'Share Issue',
            }
        },
        SecurityFieldDisplay_StatusNote: {
            id: StringId.SecurityFieldDisplay_StatusNote, translations: {
                en: 'Status Note',
            }
        },
        SecurityFieldHeading_StatusNote: {
            id: StringId.SecurityFieldHeading_StatusNote, translations: {
                en: 'Status Note',
            }
        },
        DataIvemIdFieldDisplay_DataIvemId: {
            id: StringId.DataIvemIdFieldDisplay_DataIvemId, translations: {
                en: 'Symbol',
            }
        },
        DataIvemIdFieldHeading_DataIvemId: {
            id: StringId.DataIvemIdFieldHeading_DataIvemId, translations: {
                en: 'Symbol',
            }
        },
        DataIvemIdFieldDisplay_Code: {
            id: StringId.DataIvemIdFieldDisplay_Code, translations: {
                en: 'Code',
            }
        },
        DataIvemIdFieldHeading_Code: {
            id: StringId.DataIvemIdFieldHeading_Code, translations: {
                en: 'Code',
            }
        },
        DataIvemIdFieldDisplay_Market: {
            id: StringId.DataIvemIdFieldDisplay_Market, translations: {
                en: 'Market',
            }
        },
        DataIvemIdFieldHeading_Market: {
            id: StringId.DataIvemIdFieldHeading_Market, translations: {
                en: 'Market',
            }
        },
        DataIvemIdFieldDisplay_Environment: {
            id: StringId.DataIvemIdFieldDisplay_Environment, translations: {
                en: 'Environment',
            }
        },
        DataIvemIdFieldHeading_Environment: {
            id: StringId.DataIvemIdFieldHeading_Environment, translations: {
                en: 'Environment',
            }
        },
        RankedDataIvemIdFieldDisplay_DataIvemId: {
            id: StringId.RankedDataIvemIdFieldDisplay_DataIvemId, translations: {
                en: 'Symbol',
            }
        },
        RankedDataIvemIdFieldHeading_DataIvemId: {
            id: StringId.RankedDataIvemIdFieldHeading_DataIvemId, translations: {
                en: 'Symbol',
            }
        },
        RankedDataIvemIdFieldDisplay_Rank: {
            id: StringId.RankedDataIvemIdFieldDisplay_Rank, translations: {
                en: 'Rank',
            }
        },
        RankedDataIvemIdFieldHeading_Rank: {
            id: StringId.RankedDataIvemIdFieldHeading_Rank, translations: {
                en: 'Rank',
            }
        },
        RankedDataIvemIdFieldDisplay_rankScore: {
            id: StringId.RankedDataIvemIdFieldDisplay_rankScore, translations: {
                en: 'Rank Key',
            }
        },
        RankedDataIvemIdFieldHeading_rankScore: {
            id: StringId.RankedDataIvemIdFieldHeading_rankScore, translations: {
                en: 'Rank Key',
            }
        },
        RankedDataIvemIdListAbbreviation_DataIvemIdArray: {
            id: StringId.RankedDataIvemIdListAbbreviation_DataIvemIdArray, translations: {
                en: 'L',
            }
        },
        RankedDataIvemIdListDisplay_DataIvemIdArray: {
            id: StringId.RankedDataIvemIdListDisplay_DataIvemIdArray, translations: {
                en: 'List',
            }
        },
        RankedDataIvemIdListAbbreviation_WatchmakerListId: {
            id: StringId.RankedDataIvemIdListAbbreviation_WatchmakerListId, translations: {
                en: 'Sy',
            }
        },
        RankedDataIvemIdListDisplay_WatchmakerListId: {
            id: StringId.RankedDataIvemIdListDisplay_WatchmakerListId, translations: {
                en: 'Symbol List',
            }
        },
        RankedDataIvemIdListAbbreviation_ScanId: {
            id: StringId.RankedDataIvemIdListAbbreviation_ScanId, translations: {
                en: 'S',
            }
        },
        RankedDataIvemIdListDisplay_ScanId: {
            id: StringId.RankedDataIvemIdListDisplay_ScanId, translations: {
                en: 'Scan',
            }
        },
        RankedDataIvemIdListAbbreviation_DataIvemIdExecuteScan: {
            id: StringId.RankedDataIvemIdListAbbreviation_DataIvemIdExecuteScan, translations: {
                en: 'TSS',
            }
        },
        RankedDataIvemIdListDisplay_DataIvemIdExecuteScan: {
            id: StringId.RankedDataIvemIdListDisplay_DataIvemIdExecuteScan, translations: {
                en: 'Test Symbol Scan',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Null: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Null, translations: {
                en: 'Null',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Null: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Null, translations: {
                en: 'Nul',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_DataIvemIdList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_DataIvemIdList, translations: {
                en: 'Symbols',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_DataIvemIdList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_DataIvemIdList, translations: {
                en: 'Sym',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_DataIvemDetailsFromSearchSymbols: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_DataIvemDetailsFromSearchSymbols, translations: {
                en: 'Symbol Search',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_DataIvemDetailsFromSearchSymbols: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_DataIvemDetailsFromSearchSymbols, translations: {
                en: 'SymS',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_DataIvemIdArrayRankedDataIvemIdList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_DataIvemIdArrayRankedDataIvemIdList, translations: {
                en: 'Watchlist',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_DataIvemIdArrayRankedDataIvemIdList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_DataIvemIdArrayRankedDataIvemIdList, translations: {
                en: 'WL',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_MarketMovers: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_MarketMovers, translations: {
                en: 'Market Movers',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_MarketMovers: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_MarketMovers, translations: {
                en: 'MMv',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Gics: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Gics, translations: {
                en: 'GICS',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Gics: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Gics, translations: {
                en: 'Gic',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_ProfitIvemHolding: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_ProfitIvemHolding, translations: {
                en: 'Symbol Holding',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_ProfitIvemHolding: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_ProfitIvemHolding, translations: {
                en: 'SHd',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_CashItemHolding: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_CashItemHolding, translations: {
                en: 'Cash Holding',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_CashItemHolding: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_CashItemHolding, translations: {
                en: 'CHd',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_IntradayProfitLossSymbolRec: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_IntradayProfitLossSymbolRec, translations: {
                en: 'Profit/Loss',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_IntradayProfitLossSymbolRec: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_IntradayProfitLossSymbolRec, translations: {
                en: 'Ipl',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_TmcDefinitionLegs: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_TmcDefinitionLegs, translations: {
                en: 'TMC Definition Legs',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_TmcDefinitionLegs: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_TmcDefinitionLegs, translations: {
                en: 'TDL',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_TmcLeg: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_TmcLeg, translations: {
                en: 'TMC Legs',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_TmcLeg: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_TmcLeg, translations: {
                en: 'TLg',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_TmcWithLegMatchingUnderlying: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_TmcWithLegMatchingUnderlying, translations: {
                en: 'TMC with Leg matching underlying',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_TmcWithLegMatchingUnderlying: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_TmcWithLegMatchingUnderlying, translations: {
                en: 'TLU',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_EtoMatchingUnderlyingCallPut: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_EtoMatchingUnderlyingCallPut, translations: {
                en: 'ETO matching underlying',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_EtoMatchingUnderlyingCallPut: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_EtoMatchingUnderlyingCallPut, translations: {
                en: 'EMU',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_HoldingAccountPortfolio: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_HoldingAccountPortfolio, translations: {
                en: 'Holding Account Portfolio',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_HoldingAccountPortfolio: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_HoldingAccountPortfolio, translations: {
                en: 'HAP',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Feed: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Feed, translations: {
                en: 'Feed',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Feed: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Feed, translations: {
                en: 'FD',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_BrokerageAccount: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_BrokerageAccount, translations: {
                en: 'Brokerage Account',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_BrokerageAccount: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_BrokerageAccount, translations: {
                en: 'BAC',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Order: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Order, translations: {
                en: 'Order',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Order: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Order, translations: {
                en: 'Odr',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Holding: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Holding, translations: {
                en: 'Holding',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Holding: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Holding, translations: {
                en: 'Hld',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Balances: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Balances, translations: {
                en: 'Account Currency Balances',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Balances: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Balances, translations: {
                en: 'ACB',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_TopShareholder: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_TopShareholder, translations: {
                en: 'TopShareholder',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_TopShareholder: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_TopShareholder, translations: {
                en: 'Tsh',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_ColumnLayoutDefinitionColumnEditRecord: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_ColumnLayoutDefinitionColumnEditRecord, translations: {
                en: 'Grid Layout Definition Column Edit Record',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_ColumnLayoutDefinitionColumnEditRecord: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_ColumnLayoutDefinitionColumnEditRecord, translations: {
                en: 'Gldcer',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_Scan: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_Scan, translations: {
                en: 'Scan',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_Scan: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_Scan, translations: {
                en: 'Scn',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_RankedDataIvemIdListDirectoryItem: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_RankedDataIvemIdListDirectoryItem, translations: {
                en: 'RankedDataIvemIdListDirectoryItem',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_RankedDataIvemIdListDirectoryItem: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_RankedDataIvemIdListDirectoryItem, translations: {
                en: 'RDI',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_GridField: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_GridField, translations: {
                en: 'Grid Field',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_GridField: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_GridField, translations: {
                en: 'GF',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_ScanFieldEditorFrame: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_ScanFieldEditorFrame, translations: {
                en: 'Scan Field Editor Frame',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_ScanFieldEditorFrame: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_ScanFieldEditorFrame, translations: {
                en: 'SFEF',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_ScanEditorAttachedNotificationChannel: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_ScanEditorAttachedNotificationChannel, translations: {
                en: 'Attached notification channel',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_ScanEditorAttachedNotificationChannel: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_ScanEditorAttachedNotificationChannel, translations: {
                en: 'SEANC',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_LockOpenNotificationChannelList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_LockOpenNotificationChannelList, translations: {
                en: 'Notification channel list',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_LockOpenNotificationChannelList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_LockOpenNotificationChannelList, translations: {
                en: 'LONCL',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_ExchangeEnvironmentList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_ExchangeEnvironmentList, translations: {
                en: 'Exchange environment list',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_ExchangeEnvironmentList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_ExchangeEnvironmentList, translations: {
                en: 'EEL',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_ExchangeList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_ExchangeList, translations: {
                en: 'Exchange list',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_ExchangeList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_ExchangeList, translations: {
                en: 'EL',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_TradingMarketList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_TradingMarketList, translations: {
                en: 'Trading market list',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_TradingMarketList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_TradingMarketList, translations: {
                en: 'TML',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_DataMarketList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_DataMarketList, translations: {
                en: 'Data market list',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_DataMarketList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_DataMarketList, translations: {
                en: 'DML',
            }
        },
        TableRecordDefinitionList_ListTypeDisplay_MarketBoardList: {
            id: StringId.TableRecordDefinitionList_ListTypeDisplay_MarketBoardList, translations: {
                en: 'Market board list',
            }
        },
        TableRecordDefinitionList_ListTypeAbbr_MarketBoardList: {
            id: StringId.TableRecordDefinitionList_ListTypeAbbr_MarketBoardList, translations: {
                en: 'MBL',
            }
        },
        ExchangeAbbreviatedDisplay_Asx: {
            id: StringId.ExchangeAbbreviatedDisplay_Asx, translations: {
                en: 'ASX',
            }
        },
        ExchangeFullDisplay_Asx: {
            id: StringId.ExchangeFullDisplay_Asx, translations: {
                en: 'Australian Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Cxa: {
            id: StringId.ExchangeAbbreviatedDisplay_Cxa, translations: {
                en: 'CXA',
            }
        },
        ExchangeFullDisplay_Cxa: {
            id: StringId.ExchangeFullDisplay_Cxa, translations: {
                en: 'Chi-X Australia',
            }
        },
        ExchangeAbbreviatedDisplay_Nsx: {
            id: StringId.ExchangeAbbreviatedDisplay_Nsx, translations: {
                en: 'NSX',
            }
        },
        ExchangeFullDisplay_Nsx: {
            id: StringId.ExchangeFullDisplay_Nsx, translations: {
                en: 'Australian National Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Nzx: {
            id: StringId.ExchangeAbbreviatedDisplay_Nzx, translations: {
                en: 'NZX',
            }
        },
        ExchangeFullDisplay_Nzx: {
            id: StringId.ExchangeFullDisplay_Nzx, translations: {
                en: 'New Zealand Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Calastone: {
            id: StringId.ExchangeAbbreviatedDisplay_Calastone, translations: {
                en: 'Calastone',
            }
        },
        ExchangeFullDisplay_Calastone: {
            id: StringId.ExchangeFullDisplay_Calastone, translations: {
                en: 'Calastone',
            }
        },
        ExchangeAbbreviatedDisplay_Ptx: {
            id: StringId.ExchangeAbbreviatedDisplay_Ptx, translations: {
                en: 'PTX',
            }
        },
        ExchangeFullDisplay_Ptx: {
            id: StringId.ExchangeFullDisplay_Ptx, translations: {
                en: 'PTX',
            }
        },
        ExchangeAbbreviatedDisplay_Fnsx: {
            id: StringId.ExchangeAbbreviatedDisplay_Fnsx, translations: {
                en: 'FNSX',
            }
        },
        ExchangeFullDisplay_Fnsx: {
            id: StringId.ExchangeFullDisplay_Fnsx, translations: {
                en: 'First Nations Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Fpsx: {
            id: StringId.ExchangeAbbreviatedDisplay_Fpsx, translations: {
                en: 'FPSX',
            }
        },
        ExchangeFullDisplay_Fpsx: {
            id: StringId.ExchangeFullDisplay_Fpsx, translations: {
                en: 'Finplex Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Cfx: {
            id: StringId.ExchangeAbbreviatedDisplay_Cfx, translations: {
                en: 'CFX',
            }
        },
        ExchangeFullDisplay_Cfx: {
            id: StringId.ExchangeFullDisplay_Cfx, translations: {
                en: 'CF Markets Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Dax: {
            id: StringId.ExchangeAbbreviatedDisplay_Dax, translations: {
                en: 'DAX',
            }
        },
        ExchangeFullDisplay_Dax: {
            id: StringId.ExchangeFullDisplay_Dax, translations: {
                en: 'Derivatives Access Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_Myx: {
            id: StringId.ExchangeAbbreviatedDisplay_Myx, translations: {
                en: 'MYX',
            }
        },
        ExchangeFullDisplay_Myx: {
            id: StringId.ExchangeFullDisplay_Myx, translations: {
                en: 'Bursa Stock Exchange',
            }
        },
        ExchangeAbbreviatedDisplay_AsxCxa: {
            id: StringId.ExchangeAbbreviatedDisplay_AsxCxa, translations: {
                en: 'ASX+CXA',
            }
        },
        ExchangeFullDisplay_AsxCxa: {
            id: StringId.ExchangeFullDisplay_AsxCxa, translations: {
                en: 'ASX+CXA',
            }
        },
        DataEnvironmentDisplay_Production: {
            id: StringId.DataEnvironmentDisplay_Production, translations: {
                en: 'Production',
            }
        },
        DataEnvironmentDisplay_DelayedProduction: {
            id: StringId.DataEnvironmentDisplay_DelayedProduction, translations: {
                en: 'Delayed',
            }
        },
        DataEnvironmentDisplay_Demo: {
            id: StringId.DataEnvironmentDisplay_Demo, translations: {
                en: 'Demo',
            }
        },
        DataEnvironmentDisplay_Sample: {
            id: StringId.DataEnvironmentDisplay_Sample, translations: {
                en: 'Sample',
            }
        },
        TradingEnvironmentDisplay_Production: {
            id: StringId.TradingEnvironmentDisplay_Production, translations: {
                en: 'Production',
            }
        },
        TradingEnvironmentDisplay_Demo: {
            id: StringId.TradingEnvironmentDisplay_Demo, translations: {
                en: 'Demo',
            }
        },
        KnownFeedDisplay_Authority: {
            id: StringId.KnownFeedDisplay_Authority, translations: {
                en: 'Authority',
            }
        },
        KnownFeedDisplay_Watchlist: {
            id: StringId.KnownFeedDisplay_Watchlist, translations: {
                en: 'Watchlist',
            }
        },
        KnownFeedDisplay_Scanner: {
            id: StringId.KnownFeedDisplay_Scanner, translations: {
                en: 'Scanner',
            }
        },
        KnownFeedDisplay_Channel: {
            id: StringId.KnownFeedDisplay_Channel, translations: {
                en: 'Channel',
            }
        },
        MarketDisplay_MixedMarket: {
            id: StringId.MarketDisplay_MixedMarket, translations: {
                en: 'MixedMarket',
            }
        },
        MarketDisplay_MyxNormal: {
            id: StringId.MarketDisplay_MyxNormal, translations: {
                en: 'MYX Normal',
            }
        },
        MarketDisplay_MyxOddLot: {
            id: StringId.MarketDisplay_MyxOddLot, translations: {
                en: 'MYX Odd Lot',
            }
        },
        MarketDisplay_MyxBuyIn: {
            id: StringId.MarketDisplay_MyxBuyIn, translations: {
                en: 'MYX Buy In',
            }
        },
        MarketDisplay_MyxDirectBusiness: {
            id: StringId.MarketDisplay_MyxDirectBusiness, translations: {
                en: 'MYX Direct Business',
            }
        },
        MarketDisplay_MyxIndex: {
            id: StringId.MarketDisplay_MyxIndex, translations: {
                en: 'MYX Index',
            }
        },
        MarketDisplay_AsxBookBuild: {
            id: StringId.MarketDisplay_AsxBookBuild, translations: {
                en: 'ASX Book Build',
            }
        },
        MarketDisplay_AsxPureMatch: {
            id: StringId.MarketDisplay_AsxPureMatch, translations: {
                en: 'ASX PureMatch',
            }
        },
        MarketDisplay_AsxPureMatchDemo: {
            id: StringId.MarketDisplay_AsxPureMatchDemo, translations: {
                en: 'ASX PureMatch Demo',
            }
        },
        MarketDisplay_AsxTradeMatch: {
            id: StringId.MarketDisplay_AsxTradeMatch, translations: {
                en: 'ASX TradeMatch',
            }
        },
        MarketDisplay_AsxTradeMatchDelayed: {
            id: StringId.MarketDisplay_AsxTradeMatchDelayed, translations: {
                en: 'ASX TradeMatch Delayed',
            }
        },
        MarketDisplay_AsxTradeMatchDemo: {
            id: StringId.MarketDisplay_AsxTradeMatchDemo, translations: {
                en: 'ASX TradeMatch Demo',
            }
        },
        MarketDisplay_AsxCentrePoint: {
            id: StringId.MarketDisplay_AsxCentrePoint, translations: {
                en: 'ASX CentrePoint',
            }
        },
        MarketDisplay_AsxVolumeMatch: {
            id: StringId.MarketDisplay_AsxVolumeMatch, translations: {
                en: 'ASX VolumeMatch',
            }
        },
        MarketDisplay_ChixAustLimit: {
            id: StringId.MarketDisplay_ChixAustLimit, translations: {
                en: 'CHIX Aust Limit',
            }
        },
        MarketDisplay_ChixAustLimitDemo: {
            id: StringId.MarketDisplay_ChixAustLimitDemo, translations: {
                en: 'CHIX Aust Limit Demo',
            }
        },
        MarketDisplay_ChixAustFarPoint: {
            id: StringId.MarketDisplay_ChixAustFarPoint, translations: {
                en: 'CHIX Aust FarPoint',
            }
        },
        MarketDisplay_ChixAustMarketOnClose: {
            id: StringId.MarketDisplay_ChixAustMarketOnClose, translations: {
                en: 'CHIX Aust MarketOnClose',
            }
        },
        MarketDisplay_ChixAustNearPoint: {
            id: StringId.MarketDisplay_ChixAustNearPoint, translations: {
                en: 'CHIX Aust NearPoint',
            }
        },
        MarketDisplay_ChixAustMidPoint: {
            id: StringId.MarketDisplay_ChixAustMidPoint, translations: {
                en: 'CHIX Aust MidPoint',
            }
        },
        MarketDisplay_SimVenture: {
            id: StringId.MarketDisplay_SimVenture, translations: {
                en: 'SimVenture',
            }
        },
        MarketDisplay_Nsx: {
            id: StringId.MarketDisplay_Nsx, translations: {
                en: 'NSX',
            }
        },
        MarketDisplay_NsxDemo: {
            id: StringId.MarketDisplay_NsxDemo, translations: {
                en: 'NSX Demo',
            }
        },
        MarketDisplay_SouthPacific: {
            id: StringId.MarketDisplay_SouthPacific, translations: {
                en: 'SouthPacific',
            }
        },
        MarketDisplay_Nzfox: {
            id: StringId.MarketDisplay_Nzfox, translations: {
                en: 'Nzfox',
            }
        },
        MarketDisplay_Nzx: {
            id: StringId.MarketDisplay_Nzx, translations: {
                en: 'NZX',
            }
        },
        MarketDisplay_NzxDemo: {
            id: StringId.MarketDisplay_NzxDemo, translations: {
                en: 'NZX Demo',
            }
        },
        MarketDisplay_Calastone: {
            id: StringId.MarketDisplay_Calastone, translations: {
                en: 'Calastone',
            }
        },
        MarketDisplay_PtxDemo: {
            id: StringId.MarketDisplay_PtxDemo, translations: {
                en: 'PTX Demo',
            }
        },
        MarketDisplay_AsxCxa: {
            id: StringId.MarketDisplay_AsxCxa, translations: {
                en: 'AsxCxa',
            }
        },
        MarketDisplay_AsxCxaDemo: {
            id: StringId.MarketDisplay_AsxCxaDemo, translations: {
                en: 'AsxCxaDemo',
            }
        },
        MarketDisplay_PtxMain: {
            id: StringId.MarketDisplay_PtxMain, translations: {
                en: 'PTX Main',
            }
        },
        MarketDisplay_FnsxMain: {
            id: StringId.MarketDisplay_FnsxMain, translations: {
                en: 'FNSX Main',
            }
        },
        MarketDisplay_FpsxMain: {
            id: StringId.MarketDisplay_FpsxMain, translations: {
                en: 'FPSX Main',
            }
        },
        MarketDisplay_CfxMain: {
            id: StringId.MarketDisplay_CfxMain, translations: {
                en: 'CFX Main',
            }
        },
        MarketDisplay_DaxMain: {
            id: StringId.MarketDisplay_DaxMain, translations: {
                en: 'DAX Main',
            }
        },
        IvemClass_Unknown: {
            id: StringId.IvemClass_Unknown, translations: {
                en: 'Unknown',
            }
        },
        IvemClass_Market: {
            id: StringId.IvemClass_Market, translations: {
                en: 'Market',
            }
        },
        IvemClass_ManagedFund: {
            id: StringId.IvemClass_ManagedFund, translations: {
                en: 'Managed Fund',
            }
        },
        MarketBoardIdDisplay_MixedMarket: {
            id: StringId.MarketBoardIdDisplay_MixedMarket, translations: {
                en: 'Mixed',
            }
        },
        MarketBoardIdDisplay_AsxBookBuild: {
            id: StringId.MarketBoardIdDisplay_AsxBookBuild, translations: {
                en: 'ASX BookBuild',
            }
        },
        MarketBoardIdDisplay_AsxCentrePoint: {
            id: StringId.MarketBoardIdDisplay_AsxCentrePoint, translations: {
                en: 'ASX CentrePoint',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatch: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatch, translations: {
                en: 'ASX TradeMatch Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchAgric: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchAgric, translations: {
                en: 'ASX TradeMatch AGRIC',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchAus: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchAus, translations: {
                en: 'ASX TradeMatch AUS',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchDerivatives: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchDerivatives, translations: {
                en: 'ASX TradeMatch Derivatives Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchEquity1: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity1, translations: {
                en: 'ASX TradeMatch Equity Market 1 (A-B)',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchEquity2: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity2, translations: {
                en: 'ASX TradeMatch Equity Market 2 (C-F)',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchEquity3: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity3, translations: {
                en: 'ASX TradeMatch Equity Market 3 (G-M)',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchEquity4: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity4, translations: {
                en: 'ASX TradeMatch Equity Market 4 (N-R)',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchEquity5: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchEquity5, translations: {
                en: 'ASX TradeMatch Equity Market 5 (S-Z)',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchIndex: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchIndex, translations: {
                en: 'ASX TradeMatch Index Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchIndexDerivatives: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchIndexDerivatives, translations: {
                en: 'ASX TradeMatch Index Derivatives Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchInterestRate: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchInterestRate, translations: {
                en: 'ASX TradeMatch Interest Rate Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchPrivate: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchPrivate, translations: {
                en: 'ASX TradeMatch Private Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchQuoteDisplayBoard: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchQuoteDisplayBoard, translations: {
                en: 'ASX TradeMatch Quote Display Board',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchPractice: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchPractice, translations: {
                en: 'ASX TradeMatch Practice Market',
            }
        },
        MarketBoardIdDisplay_AsxTradeMatchWarrants: {
            id: StringId.MarketBoardIdDisplay_AsxTradeMatchWarrants, translations: {
                en: 'ASX TradeMatch Warrants Market',
            }
        },
        MarketBoardIdDisplay_AsxPureMatch: {
            id: StringId.MarketBoardIdDisplay_AsxPureMatch, translations: {
                en: 'ASX PureMatch Equity Market',
            }
        },
        MarketBoardIdDisplay_AsxPureMatchEquity1: {
            id: StringId.MarketBoardIdDisplay_AsxPureMatchEquity1, translations: {
                en: 'ASX PureMatch Equity Market 1 (A-B)',
            }
        },
        MarketBoardIdDisplay_AsxPureMatchEquity2: {
            id: StringId.MarketBoardIdDisplay_AsxPureMatchEquity2, translations: {
                en: 'ASX PureMatch Equity Market 2 (C-F)',
            }
        },
        MarketBoardIdDisplay_AsxPureMatchEquity3: {
            id: StringId.MarketBoardIdDisplay_AsxPureMatchEquity3, translations: {
                en: 'ASX PureMatch Equity Market 3 (G-M)',
            }
        },
        MarketBoardIdDisplay_AsxPureMatchEquity4: {
            id: StringId.MarketBoardIdDisplay_AsxPureMatchEquity4, translations: {
                en: 'ASX PureMatch Equity Market 4 (N-R)',
            }
        },
        MarketBoardIdDisplay_AsxPureMatchEquity5: {
            id: StringId.MarketBoardIdDisplay_AsxPureMatchEquity5, translations: {
                en: 'ASX PureMatch Equity Market 5 (S-Z)',
            }
        },
        MarketBoardIdDisplay_AsxVolumeMatch: {
            id: StringId.MarketBoardIdDisplay_AsxVolumeMatch, translations: {
                en: 'ASX VolumeMatch',
            }
        },
        MarketBoardIdDisplay_ChixAustFarPoint: {
            id: StringId.MarketBoardIdDisplay_ChixAustFarPoint, translations: {
                en: 'Chi-X Australia Far-Point Market',
            }
        },
        MarketBoardIdDisplay_ChixAustLimit: {
            id: StringId.MarketBoardIdDisplay_ChixAustLimit, translations: {
                en: 'Chi-X Australia Limit Market',
            }
        },
        MarketBoardIdDisplay_ChixAustMarketOnClose: {
            id: StringId.MarketBoardIdDisplay_ChixAustMarketOnClose, translations: {
                en: 'Chi-X Australia Market-on-Close Market',
            }
        },
        MarketBoardIdDisplay_ChixAustMidPoint: {
            id: StringId.MarketBoardIdDisplay_ChixAustMidPoint, translations: {
                en: 'Chi-X Australia Mid-Point Market',
            }
        },
        MarketBoardIdDisplay_ChixAustNearPoint: {
            id: StringId.MarketBoardIdDisplay_ChixAustNearPoint, translations: {
                en: 'Chi-X Australia Near-Point Market',
            }
        },
        MarketBoardIdDisplay_NsxMain: {
            id: StringId.MarketBoardIdDisplay_NsxMain, translations: {
                en: 'Australian National Stock Exchange Main',
            }
        },
        MarketBoardIdDisplay_NsxCommunityBanks: {
            id: StringId.MarketBoardIdDisplay_NsxCommunityBanks, translations: {
                en: 'Australian National Stock Exchange Community Banks',
            }
        },
        MarketBoardIdDisplay_NsxIndustrial: {
            id: StringId.MarketBoardIdDisplay_NsxIndustrial, translations: {
                en: 'Australian National Stock Exchange Industrial',
            }
        },
        MarketBoardIdDisplay_NsxDebt: {
            id: StringId.MarketBoardIdDisplay_NsxDebt, translations: {
                en: 'Australian National Stock Exchange Debt',
            }
        },
        MarketBoardIdDisplay_NsxMiningAndEnergy: {
            id: StringId.MarketBoardIdDisplay_NsxMiningAndEnergy, translations: {
                en: 'Australian National Stock Exchange Mining & Energy',
            }
        },
        MarketBoardIdDisplay_NsxCertifiedProperty: {
            id: StringId.MarketBoardIdDisplay_NsxCertifiedProperty, translations: {
                en: 'Australian National Stock Exchange Certified Property',
            }
        },
        MarketBoardIdDisplay_NsxProperty: {
            id: StringId.MarketBoardIdDisplay_NsxProperty, translations: {
                en: 'Australian National Stock Exchange Property',
            }
        },
        MarketBoardIdDisplay_NsxRestricted: {
            id: StringId.MarketBoardIdDisplay_NsxRestricted, translations: {
                en: 'Australian National Stock Exchange Restricted',
            }
        },
        MarketBoardIdDisplay_SimVenture: {
            id: StringId.MarketBoardIdDisplay_SimVenture, translations: {
                en: 'SIM-VSE',
            }
        },
        MarketBoardIdDisplay_SouthPacificStockExchangeEquities: {
            id: StringId.MarketBoardIdDisplay_SouthPacificStockExchangeEquities, translations: {
                en: 'South Pacific Stock Exchange Equities',
            }
        },
        MarketBoardIdDisplay_SouthPacificStockExchangeRestricted: {
            id: StringId.MarketBoardIdDisplay_SouthPacificStockExchangeRestricted, translations: {
                en: 'South Pacific Stock Exchange Restricted',
            }
        },
        MarketBoardIdDisplay_NzxMainBoard: {
            id: StringId.MarketBoardIdDisplay_NzxMainBoard, translations: {
                en: 'NZX Main Board',
            }
        },
        MarketBoardIdDisplay_NzxSpec: {
            id: StringId.MarketBoardIdDisplay_NzxSpec, translations: {
                en: 'NZX Spec',
            }
        },
        MarketBoardIdDisplay_NzxFonterraShareholders: {
            id: StringId.MarketBoardIdDisplay_NzxFonterraShareholders, translations: {
                en: 'NZX Fonterra Shareholders Market',
            }
        },
        MarketBoardIdDisplay_NzxIndex: {
            id: StringId.MarketBoardIdDisplay_NzxIndex, translations: {
                en: 'NZX Index Market',
            }
        },
        MarketBoardIdDisplay_NzxDebt: {
            id: StringId.MarketBoardIdDisplay_NzxDebt, translations: {
                en: 'NZX Debt Market',
            }
        },
        MarketBoardIdDisplay_NzxComm: {
            id: StringId.MarketBoardIdDisplay_NzxComm, translations: {
                en: 'NZX Comm',
            }
        },
        MarketBoardIdDisplay_NzxDerivativeFutures: {
            id: StringId.MarketBoardIdDisplay_NzxDerivativeFutures, translations: {
                en: 'NZX Derivative Futures',
            }
        },
        MarketBoardIdDisplay_NzxDerivativeOptions: {
            id: StringId.MarketBoardIdDisplay_NzxDerivativeOptions, translations: {
                en: 'NZX Derivative Options',
            }
        },
        MarketBoardIdDisplay_NzxIndexFutures: {
            id: StringId.MarketBoardIdDisplay_NzxIndexFutures, translations: {
                en: 'NZX Index Futures',
            }
        },
        MarketBoardIdDisplay_NzxDStgy: {
            id: StringId.MarketBoardIdDisplay_NzxDStgy, translations: {
                en: 'NZX DStgy',
            }
        },
        MarketBoardIdDisplay_NzxMStgy: {
            id: StringId.MarketBoardIdDisplay_NzxMStgy, translations: {
                en: 'NZX MStgy',
            }
        },
        MarketBoardIdDisplay_NzxEOpt: {
            id: StringId.MarketBoardIdDisplay_NzxEOpt, translations: {
                en: 'NZX E-Opt',
            }
        },
        MarketBoardIdDisplay_NzxMFut: {
            id: StringId.MarketBoardIdDisplay_NzxMFut, translations: {
                en: 'NZX M-Fut',
            }
        },
        MarketBoardIdDisplay_NzxMOpt: {
            id: StringId.MarketBoardIdDisplay_NzxMOpt, translations: {
                en: 'NZX M-Opt',
            }
        },
        MarketBoardIdDisplay_MyxNormal: {
            id: StringId.MarketBoardIdDisplay_MyxNormal, translations: {
                en: 'MYX Normal',
            }
        },
        MarketBoardIdDisplay_MyxDirectBusinessTransaction: {
            id: StringId.MarketBoardIdDisplay_MyxDirectBusinessTransaction, translations: {
                en: 'MYX Direct Business Transaction',
            }
        },
        MarketBoardIdDisplay_MyxIndex: {
            id: StringId.MarketBoardIdDisplay_MyxIndex, translations: {
                en: 'MYX Index',
            }
        },
        MarketBoardIdDisplay_MyxBuyIn: {
            id: StringId.MarketBoardIdDisplay_MyxBuyIn, translations: {
                en: 'MYX Buy In',
            }
        },
        MarketBoardIdDisplay_MyxOddLot: {
            id: StringId.MarketBoardIdDisplay_MyxOddLot, translations: {
                en: 'MYX Odd Lot',
            }
        },
        MarketBoardIdDisplay_PtxMain: {
            id: StringId.MarketBoardIdDisplay_PtxMain, translations: {
                en: 'PTX Main',
            }
        },
        MarketBoardIdDisplay_FnsxMain: {
            id: StringId.MarketBoardIdDisplay_FnsxMain, translations: {
                en: 'FNSX Main',
            }
        },
        MarketBoardIdDisplay_FpsxMain: {
            id: StringId.MarketBoardIdDisplay_FpsxMain, translations: {
                en: 'FPSX Main',
            }
        },
        MarketBoardIdDisplay_CfxMain: {
            id: StringId.MarketBoardIdDisplay_CfxMain, translations: {
                en: 'CFX Main',
            }
        },
        MarketBoardIdDisplay_DaxMain: {
            id: StringId.MarketBoardIdDisplay_DaxMain, translations: {
                en: 'DAX Main',
            }
        },
        SymbolCodeError_Missing: {
            id: StringId.SymbolCodeError_Missing, translations: {
                en: 'Code missing',
            }
        },
        SymbolCodeError_MustContainAtLeast3Characters: {
            id: StringId.SymbolCodeError_MustContainAtLeast3Characters, translations: {
                en: 'Code must contain at least 3 characters',
            }
        },
        SymbolCodeError_MustContainAtLeast4Characters: {
            id: StringId.SymbolCodeError_MustContainAtLeast4Characters, translations: {
                en: 'Code must contain at least 4 characters',
            }
        },
        SymbolCodeError_CanOnlyContainDigits: {
            id: StringId.SymbolCodeError_CanOnlyContainDigits, translations: {
                en: 'Code only contain digits',
            }
        },
        SymbolSelect_SearchForCodeOrName: {
            id: StringId.SymbolSelect_SearchForCodeOrName, translations: {
                en: 'Search for code or name',
            }
        },
        SymbolSelect_NoMarkets: {
            id: StringId.SymbolSelect_NoMarkets, translations: {
                en: 'No markets',
            }
        },
        SymbolSelect_NoDataSymbolAvailable: {
            id: StringId.SymbolSelect_NoDataSymbolAvailable, translations: {
                en: 'No data symbol available',
            }
        },
        SymbolSelect_NotFoundInMarket: {
            id: StringId.SymbolSelect_NotFoundInMarket, translations: {
                en: 'Not found in market',
            }
        },
        CallOrPutDisplay_Call: {
            id: StringId.CallOrPutDisplay_Call, translations: {
                en: 'Call',
            }
        },
        CallOrPutDisplay_Put: {
            id: StringId.CallOrPutDisplay_Put, translations: {
                en: 'Put',
            }
        },
        PublisherSubscriptionDataTypeDisplay_Asset: {
            id: StringId.PublisherSubscriptionDataTypeDisplay_Asset, translations: {
                en: 'Asset',
            }
        },
        PublisherSubscriptionDataTypeDisplay_Trades: {
            id: StringId.PublisherSubscriptionDataTypeDisplay_Trades, translations: {
                en: 'Trades',
            }
        },
        PublisherSubscriptionDataTypeDisplay_Depth: {
            id: StringId.PublisherSubscriptionDataTypeDisplay_Depth, translations: {
                en: 'Depth',
            }
        },
        PublisherSubscriptionDataTypeDisplay_DepthFull: {
            id: StringId.PublisherSubscriptionDataTypeDisplay_DepthFull, translations: {
                en: 'DepthFull',
            }
        },
        PublisherSubscriptionDataTypeDisplay_DepthShort: {
            id: StringId.PublisherSubscriptionDataTypeDisplay_DepthShort, translations: {
                en: 'DepthShort',
            }
        },
        CurrencyCode_Aud: {
            id: StringId.CurrencyCode_Aud, translations: {
                en: 'AUD',
            }
        },
        CurrencySymbol_Aud: {
            id: StringId.CurrencySymbol_Aud, translations: {
                en: '$',
            }
        },
        CurrencyCode_Usd: {
            id: StringId.CurrencyCode_Usd, translations: {
                en: 'USD',
            }
        },
        CurrencySymbol_Usd: {
            id: StringId.CurrencySymbol_Usd, translations: {
                en: '$',
            }
        },
        CurrencyCode_Myr: {
            id: StringId.CurrencyCode_Myr, translations: {
                en: 'MYR',
            }
        },
        CurrencySymbol_Myr: {
            id: StringId.CurrencySymbol_Myr, translations: {
                en: 'RM',
            }
        },
        CurrencyCode_Gbp: {
            id: StringId.CurrencyCode_Gbp, translations: {
                en: 'GBP',
            }
        },
        CurrencySymbol_Gbp: {
            id: StringId.CurrencySymbol_Gbp, translations: {
                en: '£',
            }
        },
        BrokerageAccountFieldDisplay_IdDisplay: {
            id: StringId.BrokerageAccountFieldDisplay_IdDisplay, translations: {
                en: 'Id',
            }
        },
        BrokerageAccountFieldHeading_IdDisplay: {
            id: StringId.BrokerageAccountFieldHeading_IdDisplay, translations: {
                en: 'Id',
            }
        },
        BrokerageAccountFieldDisplay_EnvironmentZenithCode: {
            id: StringId.BrokerageAccountFieldDisplay_EnvironmentZenithCode, translations: {
                en: 'Environment',
            }
        },
        BrokerageAccountFieldHeading_EnvironmentZenithCode: {
            id: StringId.BrokerageAccountFieldHeading_EnvironmentZenithCode, translations: {
                en: 'Environment',
            }
        },
        BrokerageAccountFieldDisplay_Name: {
            id: StringId.BrokerageAccountFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        BrokerageAccountFieldHeading_Name: {
            id: StringId.BrokerageAccountFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        BrokerageAccountFieldDisplay_FeedStatusId: {
            id: StringId.BrokerageAccountFieldDisplay_FeedStatusId, translations: {
                en: 'Trading feed status',
            }
        },
        BrokerageAccountFieldHeading_FeedStatusId: {
            id: StringId.BrokerageAccountFieldHeading_FeedStatusId, translations: {
                en: 'Feed Status',
            }
        },
        BrokerageAccountFieldDisplay_TradingFeedName: {
            id: StringId.BrokerageAccountFieldDisplay_TradingFeedName, translations: {
                en: 'Trading Feed Name',
            }
        },
        BrokerageAccountFieldHeading_TradingFeedName: {
            id: StringId.BrokerageAccountFieldHeading_TradingFeedName, translations: {
                en: 'Feed Name',
            }
        },
        BrokerageAccountFieldDisplay_CurrencyId: {
            id: StringId.BrokerageAccountFieldDisplay_CurrencyId, translations: {
                en: 'Currency',
            }
        },
        BrokerageAccountFieldHeading_CurrencyId: {
            id: StringId.BrokerageAccountFieldHeading_CurrencyId, translations: {
                en: 'Currency',
            }
        },
        BrokerageAccountFieldDisplay_BrokerCode: {
            id: StringId.BrokerageAccountFieldDisplay_BrokerCode, translations: {
                en: 'Broker Code',
            }
        },
        BrokerageAccountFieldHeading_BrokerCode: {
            id: StringId.BrokerageAccountFieldHeading_BrokerCode, translations: {
                en: 'Broker',
            }
        },
        BrokerageAccountFieldDisplay_BranchCode: {
            id: StringId.BrokerageAccountFieldDisplay_BranchCode, translations: {
                en: 'Branch Code',
            }
        },
        BrokerageAccountFieldHeading_BranchCode: {
            id: StringId.BrokerageAccountFieldHeading_BranchCode, translations: {
                en: 'Branch',
            }
        },
        BrokerageAccountFieldDisplay_AdvisorCode: {
            id: StringId.BrokerageAccountFieldDisplay_AdvisorCode, translations: {
                en: 'Advisor Code',
            }
        },
        BrokerageAccountFieldHeading_AdvisorCode: {
            id: StringId.BrokerageAccountFieldHeading_AdvisorCode, translations: {
                en: 'Advisor',
            }
        },
        OrderFieldDisplay_Id: {
            id: StringId.OrderFieldDisplay_Id, translations: {
                en: 'Id',
            }
        },
        OrderFieldHeading_Id: {
            id: StringId.OrderFieldHeading_Id, translations: {
                en: 'Id',
            }
        },
        OrderFieldDisplay_AccountId: {
            id: StringId.OrderFieldDisplay_AccountId, translations: {
                en: 'Account ID',
            }
        },
        OrderFieldHeading_AccountId: {
            id: StringId.OrderFieldHeading_AccountId, translations: {
                en: 'Account ID',
            }
        },
        OrderFieldDisplay_ExternalID: {
            id: StringId.OrderFieldDisplay_ExternalID, translations: {
                en: 'External ID',
            }
        },
        OrderFieldHeading_ExternalID: {
            id: StringId.OrderFieldHeading_ExternalID, translations: {
                en: 'External ID',
            }
        },
        OrderFieldDisplay_DepthOrderID: {
            id: StringId.OrderFieldDisplay_DepthOrderID, translations: {
                en: 'Depth Order ID',
            }
        },
        OrderFieldHeading_DepthOrderID: {
            id: StringId.OrderFieldHeading_DepthOrderID, translations: {
                en: 'Depth Order ID',
            }
        },
        OrderFieldDisplay_Status: {
            id: StringId.OrderFieldDisplay_Status, translations: {
                en: 'Status',
            }
        },
        OrderFieldHeading_Status: {
            id: StringId.OrderFieldHeading_Status, translations: {
                en: 'Status',
            }
        },
        OrderFieldDisplay_StatusAllowIds: {
            id: StringId.OrderFieldDisplay_StatusAllowIds, translations: {
                en: 'Status Allows',
            }
        },
        OrderFieldHeading_StatusAllowIds: {
            id: StringId.OrderFieldHeading_StatusAllowIds, translations: {
                en: 'Allows',
            }
        },
        OrderFieldDisplay_StatusReasonIds: {
            id: StringId.OrderFieldDisplay_StatusReasonIds, translations: {
                en: 'Status Reasons',
            }
        },
        OrderFieldHeading_StatusReasonIds: {
            id: StringId.OrderFieldHeading_StatusReasonIds, translations: {
                en: 'Reasons',
            }
        },
        OrderFieldDisplay_MarketDisplay: {
            id: StringId.OrderFieldDisplay_MarketDisplay, translations: {
                en: 'Market',
            }
        },
        OrderFieldHeading_MarketDisplay: {
            id: StringId.OrderFieldHeading_MarketDisplay, translations: {
                en: 'Market',
            }
        },
        OrderFieldDisplay_TradingMarket: {
            id: StringId.OrderFieldDisplay_TradingMarket, translations: {
                en: 'Trading Market',
            }
        },
        OrderFieldHeading_TradingMarket: {
            id: StringId.OrderFieldHeading_TradingMarket, translations: {
                en: 'Trading Mkt',
            }
        },
        OrderFieldDisplay_Currency: {
            id: StringId.OrderFieldDisplay_Currency, translations: {
                en: 'Currency',
            }
        },
        OrderFieldHeading_Currency: {
            id: StringId.OrderFieldHeading_Currency, translations: {
                en: 'Currency',
            }
        },
        OrderFieldDisplay_EstimatedBrokerage: {
            id: StringId.OrderFieldDisplay_EstimatedBrokerage, translations: {
                en: 'Estimated Brokerage',
            }
        },
        OrderFieldHeading_EstimatedBrokerage: {
            id: StringId.OrderFieldHeading_EstimatedBrokerage, translations: {
                en: 'Est Brokerage',
            }
        },
        OrderFieldDisplay_CurrentBrokerage: {
            id: StringId.OrderFieldDisplay_CurrentBrokerage, translations: {
                en: 'Current Brokerage',
            }
        },
        OrderFieldHeading_CurrentBrokerage: {
            id: StringId.OrderFieldHeading_CurrentBrokerage, translations: {
                en: 'Cur Brokerage',
            }
        },
        OrderFieldDisplay_EstimatedTax: {
            id: StringId.OrderFieldDisplay_EstimatedTax, translations: {
                en: 'Estimated Tax',
            }
        },
        OrderFieldHeading_EstimatedTax: {
            id: StringId.OrderFieldHeading_EstimatedTax, translations: {
                en: 'Est Tax',
            }
        },
        OrderFieldDisplay_CurrentTax: {
            id: StringId.OrderFieldDisplay_CurrentTax, translations: {
                en: 'Current Tax',
            }
        },
        OrderFieldHeading_CurrentTax: {
            id: StringId.OrderFieldHeading_CurrentTax, translations: {
                en: 'Cur Tax',
            }
        },
        OrderFieldDisplay_CurrentValue: {
            id: StringId.OrderFieldDisplay_CurrentValue, translations: {
                en: 'Current Value',
            }
        },
        OrderFieldHeading_CurrentValue: {
            id: StringId.OrderFieldHeading_CurrentValue, translations: {
                en: 'Cur Value',
            }
        },
        OrderFieldDisplay_CreatedDate: {
            id: StringId.OrderFieldDisplay_CreatedDate, translations: {
                en: 'Created Date',
            }
        },
        OrderFieldHeading_CreatedDate: {
            id: StringId.OrderFieldHeading_CreatedDate, translations: {
                en: 'Created',
            }
        },
        OrderFieldDisplay_UpdatedDate: {
            id: StringId.OrderFieldDisplay_UpdatedDate, translations: {
                en: 'Updated Date',
            }
        },
        OrderFieldHeading_UpdatedDate: {
            id: StringId.OrderFieldHeading_UpdatedDate, translations: {
                en: 'Updated',
            }
        },
        OrderFieldDisplay_Style: {
            id: StringId.OrderFieldDisplay_Style, translations: {
                en: 'Style',
            }
        },
        OrderFieldHeading_Style: {
            id: StringId.OrderFieldHeading_Style, translations: {
                en: 'Style',
            }
        },
        OrderFieldDisplay_Children: {
            id: StringId.OrderFieldDisplay_Children, translations: {
                en: 'Children',
            }
        },
        OrderFieldHeading_Children: {
            id: StringId.OrderFieldHeading_Children, translations: {
                en: 'Children',
            }
        },
        OrderFieldDisplay_ExecutedQuantity: {
            id: StringId.OrderFieldDisplay_ExecutedQuantity, translations: {
                en: 'Executed Quantity',
            }
        },
        OrderFieldHeading_ExecutedQuantity: {
            id: StringId.OrderFieldHeading_ExecutedQuantity, translations: {
                en: 'Executed',
            }
        },
        OrderFieldDisplay_AveragePrice: {
            id: StringId.OrderFieldDisplay_AveragePrice, translations: {
                en: 'Average Price',
            }
        },
        OrderFieldHeading_AveragePrice: {
            id: StringId.OrderFieldHeading_AveragePrice, translations: {
                en: 'Avg Price',
            }
        },
        OrderFieldDisplay_TriggerType: {
            id: StringId.OrderFieldDisplay_TriggerType, translations: {
                en: 'Trigger Type',
            }
        },
        OrderFieldHeading_TriggerType: {
            id: StringId.OrderFieldHeading_TriggerType, translations: {
                en: 'Trigger',
            }
        },
        OrderFieldDisplay_TriggerValue: {
            id: StringId.OrderFieldDisplay_TriggerValue, translations: {
                en: 'Trigger Value',
            }
        },
        OrderFieldHeading_TriggerValue: {
            id: StringId.OrderFieldHeading_TriggerValue, translations: {
                en: 'Trig Val',
            }
        },
        OrderFieldDisplay_TriggerExtraParams: {
            id: StringId.OrderFieldDisplay_TriggerExtraParams, translations: {
                en: 'Trigger extra parameters',
            }
        },
        OrderFieldHeading_TriggerExtraParams: {
            id: StringId.OrderFieldHeading_TriggerExtraParams, translations: {
                en: 'Trig Prms',
            }
        },
        OrderFieldDisplay_TrailingStopLossConditionType: {
            id: StringId.OrderFieldDisplay_TrailingStopLossConditionType, translations: {
                en: 'Trailing Stop Loss Type',
            }
        },
        OrderFieldHeading_TrailingStopLossConditionType: {
            id: StringId.OrderFieldHeading_TrailingStopLossConditionType, translations: {
                en: 'Trailing Type',
            }
        },
        OrderFieldDisplay_Exchange: {
            id: StringId.OrderFieldDisplay_Exchange, translations: {
                en: 'Exchange',
            }
        },
        OrderFieldHeading_Exchange: {
            id: StringId.OrderFieldHeading_Exchange, translations: {
                en: 'Exchange',
            }
        },
        OrderFieldDisplay_Environment: {
            id: StringId.OrderFieldDisplay_Environment, translations: {
                en: 'Environment',
            }
        },
        OrderFieldHeading_Environment: {
            id: StringId.OrderFieldHeading_Environment, translations: {
                en: 'Environment',
            }
        },
        OrderFieldDisplay_Code: {
            id: StringId.OrderFieldDisplay_Code, translations: {
                en: 'Code',
            }
        },
        OrderFieldHeading_Code: {
            id: StringId.OrderFieldHeading_Code, translations: {
                en: 'Code',
            }
        },
        OrderFieldDisplay_Side: {
            id: StringId.OrderFieldDisplay_Side, translations: {
                en: 'Side',
            }
        },
        OrderFieldHeading_Side: {
            id: StringId.OrderFieldHeading_Side, translations: {
                en: 'Side',
            }
        },
        OrderFieldDisplay_ExtendedSide: {
            id: StringId.OrderFieldDisplay_ExtendedSide, translations: {
                en: 'Extended Side',
            }
        },
        OrderFieldHeading_ExtendedSide: {
            id: StringId.OrderFieldHeading_ExtendedSide, translations: {
                en: 'Xtd Side',
            }
        },
        OrderFieldDisplay_DetailsStyle: {
            id: StringId.OrderFieldDisplay_DetailsStyle, translations: {
                en: 'Style',
            }
        },
        OrderFieldHeading_DetailsStyle: {
            id: StringId.OrderFieldHeading_DetailsStyle, translations: {
                en: 'Style',
            }
        },
        OrderFieldDisplay_BrokerageSchedule: {
            id: StringId.OrderFieldDisplay_BrokerageSchedule, translations: {
                en: 'Brokerage Schedule',
            }
        },
        OrderFieldHeading_BrokerageSchedule: {
            id: StringId.OrderFieldHeading_BrokerageSchedule, translations: {
                en: 'Bkg Schedule',
            }
        },
        OrderFieldDisplay_DetailsType: {
            id: StringId.OrderFieldDisplay_DetailsType, translations: {
                en: 'Type',
            }
        },
        OrderFieldHeading_DetailsType: {
            id: StringId.OrderFieldHeading_DetailsType, translations: {
                en: 'Type',
            }
        },
        OrderFieldDisplay_LimitPrice: {
            id: StringId.OrderFieldDisplay_LimitPrice, translations: {
                en: 'Limit Price',
            }
        },
        OrderFieldHeading_LimitPrice: {
            id: StringId.OrderFieldHeading_LimitPrice, translations: {
                en: 'Limit',
            }
        },
        OrderFieldDisplay_Quantity: {
            id: StringId.OrderFieldDisplay_Quantity, translations: {
                en: 'Quantity',
            }
        },
        OrderFieldHeading_Quantity: {
            id: StringId.OrderFieldHeading_Quantity, translations: {
                en: 'Quantity',
            }
        },
        OrderFieldDisplay_HiddenQuantity: {
            id: StringId.OrderFieldDisplay_HiddenQuantity, translations: {
                en: 'Hidden Quantity',
            }
        },
        OrderFieldHeading_HiddenQuantity: {
            id: StringId.OrderFieldHeading_HiddenQuantity, translations: {
                en: 'Hidden',
            }
        },
        OrderFieldDisplay_MinimumQuantity: {
            id: StringId.OrderFieldDisplay_MinimumQuantity, translations: {
                en: 'Minimum Quantity',
            }
        },
        OrderFieldHeading_MinimumQuantity: {
            id: StringId.OrderFieldHeading_MinimumQuantity, translations: {
                en: 'Minimum',
            }
        },
        OrderFieldDisplay_DetailsTimeInForce: {
            id: StringId.OrderFieldDisplay_DetailsTimeInForce, translations: {
                en: 'Validity',
            }
        },
        OrderFieldHeading_DetailsTimeInForce: {
            id: StringId.OrderFieldHeading_DetailsTimeInForce, translations: {
                en: 'Validity',
            }
        },
        OrderFieldDisplay_DetailsExpiryDate: {
            id: StringId.OrderFieldDisplay_DetailsExpiryDate, translations: {
                en: 'Expiry Date',
            }
        },
        OrderFieldHeading_DetailsExpiryDate: {
            id: StringId.OrderFieldHeading_DetailsExpiryDate, translations: {
                en: 'Expiry',
            }
        },
        OrderFieldDisplay_DetailsShortSellType: {
            id: StringId.OrderFieldDisplay_DetailsShortSellType, translations: {
                en: 'Short Sell Type',
            }
        },
        OrderFieldHeading_DetailsShortSellType: {
            id: StringId.OrderFieldHeading_DetailsShortSellType, translations: {
                en: 'Short',
            }
        },
        OrderFieldDisplay_DetailsUnitType: {
            id: StringId.OrderFieldDisplay_DetailsUnitType, translations: {
                en: 'Unit Type',
            }
        },
        OrderFieldHeading_DetailsUnitType: {
            id: StringId.OrderFieldHeading_DetailsUnitType, translations: {
                en: 'Unit',
            }
        },
        OrderFieldDisplay_DetailsUnitAmount: {
            id: StringId.OrderFieldDisplay_DetailsUnitAmount, translations: {
                en: 'Unit Amount',
            }
        },
        OrderFieldHeading_DetailsUnitAmount: {
            id: StringId.OrderFieldHeading_DetailsUnitAmount, translations: {
                en: 'Unit Amt',
            }
        },
        OrderFieldDisplay_DetailsCurrency: {
            id: StringId.OrderFieldDisplay_DetailsCurrency, translations: {
                en: 'Currency',
            }
        },
        OrderFieldHeading_DetailsCurrency: {
            id: StringId.OrderFieldHeading_DetailsCurrency, translations: {
                en: 'Currency',
            }
        },
        OrderFieldDisplay_DetailsPhysicalDelivery: {
            id: StringId.OrderFieldDisplay_DetailsPhysicalDelivery, translations: {
                en: 'Physical Delivery',
            }
        },
        OrderFieldHeading_DetailsPhysicalDelivery: {
            id: StringId.OrderFieldHeading_DetailsPhysicalDelivery, translations: {
                en: 'Physical Delivery',
            }
        },
        OrderFieldDisplay_RouteAlgorithm: {
            id: StringId.OrderFieldDisplay_RouteAlgorithm, translations: {
                en: 'Route Algorithm',
            }
        },
        OrderFieldHeading_RouteAlgorithm: {
            id: StringId.OrderFieldHeading_RouteAlgorithm, translations: {
                en: 'Route',
            }
        },
        OrderFieldDisplay_RouteMarket: {
            id: StringId.OrderFieldDisplay_RouteMarket, translations: {
                en: 'Route Market',
            }
        },
        OrderFieldHeading_RouteMarket: {
            id: StringId.OrderFieldHeading_RouteMarket, translations: {
                en: 'Route Mkt',
            }
        },
        FeedStatusDisplay_Unknown: {
            id: StringId.FeedStatusDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        FeedStatusDisplay_Initialising: {
            id: StringId.FeedStatusDisplay_Initialising, translations: {
                en: 'Initialising',
            }
        },
        FeedStatusDisplay_Active: {
            id: StringId.FeedStatusDisplay_Active, translations: {
                en: 'Active',
            }
        },
        FeedStatusDisplay_Closed: {
            id: StringId.FeedStatusDisplay_Closed, translations: {
                en: 'Closed',
            }
        },
        FeedStatusDisplay_Inactive: {
            id: StringId.FeedStatusDisplay_Inactive, translations: {
                en: 'Inactive',
            }
        },
        FeedStatusDisplay_Impaired: {
            id: StringId.FeedStatusDisplay_Impaired, translations: {
                en: 'Impaired',
            }
        },
        FeedStatusDisplay_Expired: {
            id: StringId.FeedStatusDisplay_Expired, translations: {
                en: 'Expired',
            }
        },
        FeedClassDisplay_Authority: {
            id: StringId.FeedClassDisplay_Authority, translations: {
                en: 'Authority',
            }
        },
        FeedClassDisplay_Market: {
            id: StringId.FeedClassDisplay_Market, translations: {
                en: 'Market',
            }
        },
        FeedClassDisplay_News: {
            id: StringId.FeedClassDisplay_News, translations: {
                en: 'News',
            }
        },
        FeedClassDisplay_Trading: {
            id: StringId.FeedClassDisplay_Trading, translations: {
                en: 'Trading',
            }
        },
        FeedClassDisplay_Watchlist: {
            id: StringId.FeedClassDisplay_Watchlist, translations: {
                en: 'Watchlist',
            }
        },
        FeedClassDisplay_Scanner: {
            id: StringId.FeedClassDisplay_Scanner, translations: {
                en: 'Scanner',
            }
        },
        FeedClassDisplay_Channel: {
            id: StringId.FeedClassDisplay_Channel, translations: {
                en: 'Channel',
            }
        },
        SubscribabilityExtentDisplay_None: {
            id: StringId.SubscribabilityExtentDisplay_None, translations: {
                en: 'None',
            }
        },
        SubscribabilityExtentDisplay_Some: {
            id: StringId.SubscribabilityExtentDisplay_Some, translations: {
                en: 'Some',
            }
        },
        SubscribabilityExtentDisplay_All: {
            id: StringId.SubscribabilityExtentDisplay_All, translations: {
                en: 'All',
            }
        },
        CorrectnessDisplay_Good: {
            id: StringId.CorrectnessDisplay_Good, translations: {
                en: 'Good',
            }
        },
        CorrectnessDisplay_Usable: {
            id: StringId.CorrectnessDisplay_Usable, translations: {
                en: 'Usable',
            }
        },
        CorrectnessDisplay_Suspect: {
            id: StringId.CorrectnessDisplay_Suspect, translations: {
                en: 'Suspect',
            }
        },
        CorrectnessDisplay_Error: {
            id: StringId.CorrectnessDisplay_Error, translations: {
                en: 'Error',
            }
        },
        Trend_None: {
            id: StringId.Trend_None, translations: {
                en: 'None',
            }
        },
        Trend_Up: {
            id: StringId.Trend_Up, translations: {
                en: 'Up',
            }
        },
        Trend_Down: {
            id: StringId.Trend_Down, translations: {
                en: 'Down',
            }
        },
        OrderSideDisplay_Bid: {
            id: StringId.OrderSideDisplay_Bid, translations: {
                en: 'Bid',
            }
        },
        OrderSideDisplay_Ask: {
            id: StringId.OrderSideDisplay_Ask, translations: {
                en: 'Ask',
            }
        },
        SideDisplay_Buy: {
            id: StringId.SideDisplay_Buy, translations: {
                en: 'Buy',
            }
        },
        SideAbbreviation_Buy: {
            id: StringId.SideAbbreviation_Buy, translations: {
                en: 'Buy',
            }
        },
        SideDisplay_Sell: {
            id: StringId.SideDisplay_Sell, translations: {
                en: 'Sell',
            }
        },
        SideAbbreviation_Sell: {
            id: StringId.SideAbbreviation_Sell, translations: {
                en: 'Sell',
            }
        },
        SideDisplay_IntraDayShortSell: {
            id: StringId.SideDisplay_IntraDayShortSell, translations: {
                en: 'Intra-Day Short-Sell',
            }
        },
        SideAbbreviation_IntraDayShortSell: {
            id: StringId.SideAbbreviation_IntraDayShortSell, translations: {
                en: 'IDSS',
            }
        },
        SideDisplay_RegulatedShortSell: {
            id: StringId.SideDisplay_RegulatedShortSell, translations: {
                en: 'Regulated Short-Sell',
            }
        },
        SideAbbreviation_RegulatedShortSell: {
            id: StringId.SideAbbreviation_RegulatedShortSell, translations: {
                en: 'RSS',
            }
        },
        SideDisplay_ProprietaryShortSell: {
            id: StringId.SideDisplay_ProprietaryShortSell, translations: {
                en: 'Proprietary Short-Sell',
            }
        },
        SideAbbreviation_ProprietaryShortSell: {
            id: StringId.SideAbbreviation_ProprietaryShortSell, translations: {
                en: 'PSS',
            }
        },
        SideDisplay_ProprietaryDayTrade: {
            id: StringId.SideDisplay_ProprietaryDayTrade, translations: {
                en: 'Proprietary Day Trade',
            }
        },
        SideAbbreviation_ProprietaryDayTrade: {
            id: StringId.SideAbbreviation_ProprietaryDayTrade, translations: {
                en: 'PDT',
            }
        },
        EquityOrderTypeDisplay_Limit: {
            id: StringId.EquityOrderTypeDisplay_Limit, translations: {
                en: 'Limit',
            }
        },
        EquityOrderTypeDisplay_Best: {
            id: StringId.EquityOrderTypeDisplay_Best, translations: {
                en: 'Best',
            }
        },
        EquityOrderTypeDisplay_Market: {
            id: StringId.EquityOrderTypeDisplay_Market, translations: {
                en: 'Market',
            }
        },
        EquityOrderTypeDisplay_MarketToLimit: {
            id: StringId.EquityOrderTypeDisplay_MarketToLimit, translations: {
                en: 'MarketToLimit',
            }
        },
        EquityOrderTypeDisplay_Unknown: {
            id: StringId.EquityOrderTypeDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        TimeInForceDisplay_Day: {
            id: StringId.TimeInForceDisplay_Day, translations: {
                en: 'Day',
            }
        },
        TimeInForceDisplay_GoodTillCancel: {
            id: StringId.TimeInForceDisplay_GoodTillCancel, translations: {
                en: 'Good till Cancel',
            }
        },
        TimeInForceDisplay_AtTheOpening: {
            id: StringId.TimeInForceDisplay_AtTheOpening, translations: {
                en: 'At the Opening',
            }
        },
        TimeInForceDisplay_FillAndKill: {
            id: StringId.TimeInForceDisplay_FillAndKill, translations: {
                en: 'Fill and Kill',
            }
        },
        TimeInForceDisplay_FillOrKill: {
            id: StringId.TimeInForceDisplay_FillOrKill, translations: {
                en: 'Fill or Kill',
            }
        },
        TimeInForceDisplay_AllOrNone: {
            id: StringId.TimeInForceDisplay_AllOrNone, translations: {
                en: 'All or None',
            }
        },
        TimeInForceDisplay_GoodTillCrossing: {
            id: StringId.TimeInForceDisplay_GoodTillCrossing, translations: {
                en: 'Good till Crossing',
            }
        },
        TimeInForceDisplay_GoodTillDate: {
            id: StringId.TimeInForceDisplay_GoodTillDate, translations: {
                en: 'Good till Date',
            }
        },
        TimeInForceDisplay_AtTheClose: {
            id: StringId.TimeInForceDisplay_AtTheClose, translations: {
                en: 'At the Close',
            }
        },
        OrderShortSellTypeDisplay_ShortSell: {
            id: StringId.OrderShortSellTypeDisplay_ShortSell, translations: {
                en: 'Short',
            }
        },
        OrderShortSellTypeDisplay_ShortSellExempt: {
            id: StringId.OrderShortSellTypeDisplay_ShortSellExempt, translations: {
                en: 'Short Exempt',
            }
        },
        OrderPriceUnitTypeDisplay_Currency: {
            id: StringId.OrderPriceUnitTypeDisplay_Currency, translations: {
                en: 'Currency',
            }
        },
        OrderPriceUnitTypeDisplay_Units: {
            id: StringId.OrderPriceUnitTypeDisplay_Units, translations: {
                en: 'Units',
            }
        },
        OrderRouteAlgorithmDisplay_Market: {
            id: StringId.OrderRouteAlgorithmDisplay_Market, translations: {
                en: 'Market',
            }
        },
        OrderRouteAlgorithmDisplay_BestMarket: {
            id: StringId.OrderRouteAlgorithmDisplay_BestMarket, translations: {
                en: 'BestMarket',
            }
        },
        OrderRouteAlgorithmDisplay_Fix: {
            id: StringId.OrderRouteAlgorithmDisplay_Fix, translations: {
                en: 'Fix',
            }
        },
        OrderConditionTypeDisplay_Immediate: {
            id: StringId.OrderConditionTypeDisplay_Immediate, translations: {
                en: 'Immediate',
            }
        },
        OrderConditionTypeDisplay_StopLoss: {
            id: StringId.OrderConditionTypeDisplay_StopLoss, translations: {
                en: 'Stop',
            }
        },
        OrderConditionTypeDisplay_TrailingStopLoss: {
            id: StringId.OrderConditionTypeDisplay_TrailingStopLoss, translations: {
                en: 'Trailing',
            }
        },
        TrailingStopLossOrderConditionTypeDisplay_Price: {
            id: StringId.TrailingStopLossOrderConditionTypeDisplay_Price, translations: {
                en: 'Price',
            }
        },
        TrailingStopLossOrderConditionTypeDisplay_Percent: {
            id: StringId.TrailingStopLossOrderConditionTypeDisplay_Percent, translations: {
                en: 'Percent',
            }
        },
        HoldingFieldDisplay_Exchange: {
            id: StringId.HoldingFieldDisplay_Exchange, translations: {
                en: 'Exchange',
            }
        },
        HoldingFieldHeading_Exchange: {
            id: StringId.HoldingFieldHeading_Exchange, translations: {
                en: 'Exchange',
            }
        },
        HoldingFieldDisplay_Code: {
            id: StringId.HoldingFieldDisplay_Code, translations: {
                en: 'Code',
            }
        },
        HoldingFieldHeading_Code: {
            id: StringId.HoldingFieldHeading_Code, translations: {
                en: 'Code',
            }
        },
        HoldingFieldDisplay_AccountId: {
            id: StringId.HoldingFieldDisplay_AccountId, translations: {
                en: 'Account',
            }
        },
        HoldingFieldHeading_AccountId: {
            id: StringId.HoldingFieldHeading_AccountId, translations: {
                en: 'Account',
            }
        },
        HoldingFieldDisplay_Style: {
            id: StringId.HoldingFieldDisplay_Style, translations: {
                en: 'Style',
            }
        },
        HoldingFieldHeading_Style: {
            id: StringId.HoldingFieldHeading_Style, translations: {
                en: 'Style',
            }
        },
        HoldingFieldDisplay_Cost: {
            id: StringId.HoldingFieldDisplay_Cost, translations: {
                en: 'Cost',
            }
        },
        HoldingFieldHeading_Cost: {
            id: StringId.HoldingFieldHeading_Cost, translations: {
                en: 'Cost',
            }
        },
        HoldingFieldDisplay_Currency: {
            id: StringId.HoldingFieldDisplay_Currency, translations: {
                en: 'Currency',
            }
        },
        HoldingFieldHeading_Currency: {
            id: StringId.HoldingFieldHeading_Currency, translations: {
                en: 'Currency',
            }
        },
        HoldingFieldDisplay_TotalQuantity: {
            id: StringId.HoldingFieldDisplay_TotalQuantity, translations: {
                en: 'Total Quantity',
            }
        },
        HoldingFieldHeading_TotalQuantity: {
            id: StringId.HoldingFieldHeading_TotalQuantity, translations: {
                en: 'Total Quantity',
            }
        },
        HoldingFieldDisplay_TotalAvailableQuantity: {
            id: StringId.HoldingFieldDisplay_TotalAvailableQuantity, translations: {
                en: 'Available Quantity',
            }
        },
        HoldingFieldHeading_TotalAvailableQuantity: {
            id: StringId.HoldingFieldHeading_TotalAvailableQuantity, translations: {
                en: 'Available Quantity',
            }
        },
        HoldingFieldDisplay_AveragePrice: {
            id: StringId.HoldingFieldDisplay_AveragePrice, translations: {
                en: 'Average Price',
            }
        },
        HoldingFieldHeading_AveragePrice: {
            id: StringId.HoldingFieldHeading_AveragePrice, translations: {
                en: 'Average Price',
            }
        },
        TopShareholderFieldDisplay_Name: {
            id: StringId.TopShareholderFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        TopShareholderFieldHeading_Name: {
            id: StringId.TopShareholderFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        TopShareholderFieldDisplay_Designation: {
            id: StringId.TopShareholderFieldDisplay_Designation, translations: {
                en: 'Designation',
            }
        },
        TopShareholderFieldHeading_Designation: {
            id: StringId.TopShareholderFieldHeading_Designation, translations: {
                en: 'Designation',
            }
        },
        TopShareholderFieldDisplay_HolderKey: {
            id: StringId.TopShareholderFieldDisplay_HolderKey, translations: {
                en: 'HolderKey',
            }
        },
        TopShareholderFieldHeading_HolderKey: {
            id: StringId.TopShareholderFieldHeading_HolderKey, translations: {
                en: 'HolderKey',
            }
        },
        TopShareholderFieldDisplay_SharesHeld: {
            id: StringId.TopShareholderFieldDisplay_SharesHeld, translations: {
                en: 'SharesHeld',
            }
        },
        TopShareholderFieldHeading_SharesHeld: {
            id: StringId.TopShareholderFieldHeading_SharesHeld, translations: {
                en: 'SharesHeld',
            }
        },
        TopShareholderFieldDisplay_TotalShareIssue: {
            id: StringId.TopShareholderFieldDisplay_TotalShareIssue, translations: {
                en: 'TotalShareIssue',
            }
        },
        TopShareholderFieldHeading_TotalShareIssue: {
            id: StringId.TopShareholderFieldHeading_TotalShareIssue, translations: {
                en: 'TotalShareIssue',
            }
        },
        TopShareholderFieldDisplay_SharesChanged: {
            id: StringId.TopShareholderFieldDisplay_SharesChanged, translations: {
                en: 'SharesChanged',
            }
        },
        TopShareholderFieldHeading_SharesChanged: {
            id: StringId.TopShareholderFieldHeading_SharesChanged, translations: {
                en: 'SharesChanged',
            }
        },
        FeedFieldDisplay_InstanceId: {
            id: StringId.FeedFieldDisplay_InstanceId, translations: {
                en: 'Instance ID',
            }
        },
        FeedFieldHeading_InstanceId: {
            id: StringId.FeedFieldHeading_InstanceId, translations: {
                en: 'Id',
            }
        },
        FeedFieldDisplay_ClassId: {
            id: StringId.FeedFieldDisplay_ClassId, translations: {
                en: 'Class ID',
            }
        },
        FeedFieldHeading_ClassId: {
            id: StringId.FeedFieldHeading_ClassId, translations: {
                en: 'Class',
            }
        },
        FeedFieldDisplay_ZenithCode: {
            id: StringId.FeedFieldDisplay_ZenithCode, translations: {
                en: 'Zenith Code (within class)',
            }
        },
        FeedFieldHeading_ZenithCode: {
            id: StringId.FeedFieldHeading_ZenithCode, translations: {
                en: 'Code',
            }
        },
        FeedFieldDisplay_Environment: {
            id: StringId.FeedFieldDisplay_Environment, translations: {
                en: 'Environment',
            }
        },
        FeedFieldHeading_Environment: {
            id: StringId.FeedFieldHeading_Environment, translations: {
                en: 'Environment',
            }
        },
        FeedFieldDisplay_StatusId: {
            id: StringId.FeedFieldDisplay_StatusId, translations: {
                en: 'Status ID',
            }
        },
        FeedFieldHeading_StatusId: {
            id: StringId.FeedFieldHeading_StatusId, translations: {
                en: 'Status',
            }
        },
        FeedFieldDisplay_Name: {
            id: StringId.FeedFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        FeedFieldHeading_Name: {
            id: StringId.FeedFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        TradingFeedFieldDisplay_MarketCount: {
            id: StringId.TradingFeedFieldDisplay_MarketCount, translations: {
                en: 'Market count',
            }
        },
        TradingFeedFieldHeading_MarketCount: {
            id: StringId.TradingFeedFieldHeading_MarketCount, translations: {
                en: 'Market count',
            }
        },
        TradingFeedFieldDisplay_OrderStatusCount: {
            id: StringId.TradingFeedFieldDisplay_OrderStatusCount, translations: {
                en: 'Order status count',
            }
        },
        TradingFeedFieldHeading_OrderStatusCount: {
            id: StringId.TradingFeedFieldHeading_OrderStatusCount, translations: {
                en: 'Order status count',
            }
        },

        ExchangeEnvironmentFieldDisplay_ZenithCode: {
            id: StringId.ExchangeEnvironmentFieldDisplay_ZenithCode, translations: {
                en: 'ZenithCode',
            }
        },
        ExchangeEnvironmentFieldHeading_ZenithCode: {
            id: StringId.ExchangeEnvironmentFieldHeading_ZenithCode, translations: {
                en: 'ZenithCode',
            }
        },
        ExchangeEnvironmentFieldDisplay_Display: {
            id: StringId.ExchangeEnvironmentFieldDisplay_Display, translations: {
                en: 'Name',
            }
        },
        ExchangeEnvironmentFieldHeading_Display: {
            id: StringId.ExchangeEnvironmentFieldHeading_Display, translations: {
                en: 'Name',
            }
        },
        ExchangeEnvironmentFieldDisplay_Production: {
            id: StringId.ExchangeEnvironmentFieldDisplay_Production, translations: {
                en: 'Is Production',
            }
        },
        ExchangeEnvironmentFieldHeading_Production: {
            id: StringId.ExchangeEnvironmentFieldHeading_Production, translations: {
                en: 'Production',
            }
        },
        ExchangeEnvironmentFieldDisplay_Unknown: {
            id: StringId.ExchangeEnvironmentFieldDisplay_Unknown, translations: {
                en: 'Is Unknown',
            }
        },
        ExchangeEnvironmentFieldHeading_Unknown: {
            id: StringId.ExchangeEnvironmentFieldHeading_Unknown, translations: {
                en: 'Unknown',
            }
        },
        ExchangeEnvironmentFieldDisplay_Exchanges: {
            id: StringId.ExchangeEnvironmentFieldDisplay_Exchanges, translations: {
                en: 'Exchanges',
            }
        },
        ExchangeEnvironmentFieldHeading_Exchanges: {
            id: StringId.ExchangeEnvironmentFieldHeading_Exchanges, translations: {
                en: 'Exchanges',
            }
        },
        ExchangeEnvironmentFieldDisplay_DataMarkets: {
            id: StringId.ExchangeEnvironmentFieldDisplay_DataMarkets, translations: {
                en: 'Data markets',
            }
        },
        ExchangeEnvironmentFieldHeading_DataMarkets: {
            id: StringId.ExchangeEnvironmentFieldHeading_DataMarkets, translations: {
                en: 'Data markets',
            }
        },
        ExchangeEnvironmentFieldDisplay_TradingMarkets: {
            id: StringId.ExchangeEnvironmentFieldDisplay_TradingMarkets, translations: {
                en: 'Trading markets',
            }
        },
        ExchangeEnvironmentFieldHeading_TradingMarkets: {
            id: StringId.ExchangeEnvironmentFieldHeading_TradingMarkets, translations: {
                en: 'Trading markets',
            }
        },
        ExchangeFieldDisplay_ZenithCode: {
            id: StringId.ExchangeFieldDisplay_ZenithCode, translations: {
                en: 'Zenith code',
            }
        },
        ExchangeFieldHeading_ZenithCode: {
            id: StringId.ExchangeFieldHeading_ZenithCode, translations: {
                en: 'Zenith code',
            }
        },
        ExchangeFieldDisplay_UnenvironmentedZenithCode: {
            id: StringId.ExchangeFieldDisplay_UnenvironmentedZenithCode, translations: {
                en: 'Zenith exchange code',
            }
        },
        ExchangeFieldHeading_UnenvironmentedZenithCode: {
            id: StringId.ExchangeFieldHeading_UnenvironmentedZenithCode, translations: {
                en: 'Exchange code',
            }
        },
        ExchangeFieldDisplay_AbbreviatedDisplay: {
            id: StringId.ExchangeFieldDisplay_AbbreviatedDisplay, translations: {
                en: 'Abbreviated name',
            }
        },
        ExchangeFieldHeading_AbbreviatedDisplay: {
            id: StringId.ExchangeFieldHeading_AbbreviatedDisplay, translations: {
                en: 'Abbr name',
            }
        },
        ExchangeFieldDisplay_FullDisplay: {
            id: StringId.ExchangeFieldDisplay_FullDisplay, translations: {
                en: 'Name',
            }
        },
        ExchangeFieldHeading_FullDisplay: {
            id: StringId.ExchangeFieldHeading_FullDisplay, translations: {
                en: 'Name',
            }
        },
        ExchangeFieldDisplay_DisplayPriority: {
            id: StringId.ExchangeFieldDisplay_DisplayPriority, translations: {
                en: 'Display priority',
            }
        },
        ExchangeFieldHeading_DisplayPriority: {
            id: StringId.ExchangeFieldHeading_DisplayPriority, translations: {
                en: 'Display priority',
            }
        },
        ExchangeFieldDisplay_Unknown: {
            id: StringId.ExchangeFieldDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        ExchangeFieldHeading_Unknown: {
            id: StringId.ExchangeFieldHeading_Unknown, translations: {
                en: 'Unknown',
            }
        },
        ExchangeFieldDisplay_IsDefaultDefault: {
            id: StringId.ExchangeFieldDisplay_IsDefaultDefault, translations: {
                en: 'Is default default',
            }
        },
        ExchangeFieldHeading_IsDefaultDefault: {
            id: StringId.ExchangeFieldHeading_IsDefaultDefault, translations: {
                en: 'Default default',
            }
        },
        ExchangeFieldDisplay_ExchangeEnvironment: {
            id: StringId.ExchangeFieldDisplay_ExchangeEnvironment, translations: {
                en: 'Exchange environment',
            }
        },
        ExchangeFieldHeading_ExchangeEnvironment: {
            id: StringId.ExchangeFieldHeading_ExchangeEnvironment, translations: {
                en: 'Environment',
            }
        },
        ExchangeFieldDisplay_ExchangeEnvironmentIsDefault: {
            id: StringId.ExchangeFieldDisplay_ExchangeEnvironmentIsDefault, translations: {
                en: 'Exchange environment is default',
            }
        },
        ExchangeFieldDisplay_ExchHeadingironmentIsDefault: {
            id: StringId.ExchangeFieldDisplay_ExchHeadingironmentIsDefault, translations: {
                en: 'Environment is default',
            }
        },
        ExchangeFieldDisplay_SymbologyCode: {
            id: StringId.ExchangeFieldDisplay_SymbologyCode, translations: {
                en: 'Symbology code',
            }
        },
        ExchangeFiHeadinglay_SymbologyCode: {
            id: StringId.ExchangeFiHeadinglay_SymbologyCode, translations: {
                en: 'Symbology code',
            }
        },
        ExchangeFieldDisplay_DefaultLitMarket: {
            id: StringId.ExchangeFieldDisplay_DefaultLitMarket, translations: {
                en: 'Default lit market',
            }
        },
        ExchangeFieldHeading_DefaultLitMarket: {
            id: StringId.ExchangeFieldHeading_DefaultLitMarket, translations: {
                en: 'Default lit market',
            }
        },
        ExchangeFieldDisplay_DefaultTradingMarket: {
            id: StringId.ExchangeFieldDisplay_DefaultTradingMarket, translations: {
                en: 'Default trading market',
            }
        },
        ExchangeFieldHeading_DefaultTradingMarket: {
            id: StringId.ExchangeFieldHeading_DefaultTradingMarket, translations: {
                en: 'Default trading market',
            }
        },
        ExchangeFieldDisplay_AllowedSymbolNameFieldIds: {
            id: StringId.ExchangeFieldDisplay_AllowedSymbolNameFieldIds, translations: {
                en: 'Allowed symbol name fields',
            }
        },
        ExchangeFieldHeading_AllowedSymbolNameFieldIds: {
            id: StringId.ExchangeFieldHeading_AllowedSymbolNameFieldIds, translations: {
                en: 'Allowed symbol name fields',
            }
        },
        ExchangeFieldDisplay_DefaultSymbolNameFieldId: {
            id: StringId.ExchangeFieldDisplay_DefaultSymbolNameFieldId, translations: {
                en: 'Default symbol name field',
            }
        },
        ExchangeFieldDisplay_HeadingSymbolNameFieldId: {
            id: StringId.ExchangeFieldDisplay_HeadingSymbolNameFieldId, translations: {
                en: 'Default symbol name field',
            }
        },
        ExchangeFieldDisplay_AllowedSymbolSearchFieldIds: {
            id: StringId.ExchangeFieldDisplay_AllowedSymbolSearchFieldIds, translations: {
                en: 'Allowed symbol search fields',
            }
        },
        ExchangeFieldDisplay_AllHeadingbolSearchFieldIds: {
            id: StringId.ExchangeFieldDisplay_AllHeadingbolSearchFieldIds, translations: {
                en: 'Allowed symbol search fields',
            }
        },
        ExchangeFieldDisplay_DefaultSymbolSearchFieldIds: {
            id: StringId.ExchangeFieldDisplay_DefaultSymbolSearchFieldIds, translations: {
                en: 'Default symbol search field',
            }
        },
        ExchangeFieldDisplay_DefHeadingbolSearchFieldIds: {
            id: StringId.ExchangeFieldDisplay_DefHeadingbolSearchFieldIds, translations: {
                en: 'Default symbol search field',
            }
        },
        ExchangeFieldDisplay_DataMarkets: {
            id: StringId.ExchangeFieldDisplay_DataMarkets, translations: {
                en: 'Data markets',
            }
        },
        ExchangeFieldHeading_DataMarkets: {
            id: StringId.ExchangeFieldHeading_DataMarkets, translations: {
                en: 'Data markets',
            }
        },
        ExchangeFieldDisplay_TradingMarkets: {
            id: StringId.ExchangeFieldDisplay_TradingMarkets, translations: {
                en: 'Trading markets',
            }
        },
        ExchangeFieldHeading_TradingMarkets: {
            id: StringId.ExchangeFieldHeading_TradingMarkets, translations: {
                en: 'Trading markets',
            }
        },
        MarketFieldDisplay_ZenithCode: {
            id: StringId.MarketFieldDisplay_ZenithCode, translations: {
                en: 'Zenith code',
            }
        },
        MarketFieldHeading_ZenithCode: {
            id: StringId.MarketFieldHeading_ZenithCode, translations: {
                en: 'Zenith code',
            }
        },
        MarketFieldDisplay_Name: {
            id: StringId.MarketFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        MarketFieldHeading_Name: {
            id: StringId.MarketFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        MarketFieldDisplay_Display: {
            id: StringId.MarketFieldDisplay_Display, translations: {
                en: 'Full Name',
            }
        },
        MarketFieldHeading_Display: {
            id: StringId.MarketFieldHeading_Display, translations: {
                en: 'Full Name',
            }
        },
        MarketFieldDisplay_Lit: {
            id: StringId.MarketFieldDisplay_Lit, translations: {
                en: 'Lit',
            }
        },
        MarketFieldHeading_Lit: {
            id: StringId.MarketFieldHeading_Lit, translations: {
                en: 'Lit Market',
            }
        },
        MarketFieldDisplay_DisplayPriority: {
            id: StringId.MarketFieldDisplay_DisplayPriority, translations: {
                en: 'Display priority',
            }
        },
        MarketFieldHeading_DisplayPriority: {
            id: StringId.MarketFieldHeading_DisplayPriority, translations: {
                en: 'Display priority',
            }
        },
        MarketFieldDisplay_Unknown: {
            id: StringId.MarketFieldDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        MarketFieldHeading_Unknown: {
            id: StringId.MarketFieldHeading_Unknown, translations: {
                en: 'Unknown',
            }
        },
        MarketFieldDisplay_ExchangeEnvironment: {
            id: StringId.MarketFieldDisplay_ExchangeEnvironment, translations: {
                en: 'Exchange environment',
            }
        },
        MarketFieldHeading_ExchangeEnvironment: {
            id: StringId.MarketFieldHeading_ExchangeEnvironment, translations: {
                en: 'Environment',
            }
        },
        MarketFieldDisplay_ExchangeEnvironmentIsDefault: {
            id: StringId.MarketFieldDisplay_ExchangeEnvironmentIsDefault, translations: {
                en: 'Exchange environment default',
            }
        },
        MarketFieldHeading_ExchangeEnvironmentIsDefault: {
            id: StringId.MarketFieldHeading_ExchangeEnvironmentIsDefault, translations: {
                en: 'Environment default',
            }
        },
        MarketFieldDisplay_Exchange: {
            id: StringId.MarketFieldDisplay_Exchange, translations: {
                en: 'Exchange',
            }
        },
        MarketFieldHeading_Exchange: {
            id: StringId.MarketFieldHeading_Exchange, translations: {
                en: 'Exchange',
            }
        },
        MarketFieldDisplay_SymbologyCode: {
            id: StringId.MarketFieldDisplay_SymbologyCode, translations: {
                en: 'Symbology code',
            }
        },
        MarketFieldHeading_SymbologyCode: {
            id: StringId.MarketFieldHeading_SymbologyCode, translations: {
                en: 'Symbology code',
            }
        },
        MarketFieldDisplay_SymbologyExchangeSuffixCode: {
            id: StringId.MarketFieldDisplay_SymbologyExchangeSuffixCode, translations: {
                en: 'Symbology exchange suffix code',
            }
        },
        MarketFieldHeading_SymbologyExchangeSuffixCode: {
            id: StringId.MarketFieldHeading_SymbologyExchangeSuffixCode, translations: {
                en: 'Symbology suffix',
            }
        },
        DataMarketFieldDisplay_BestTradingMarket: {
            id: StringId.DataMarketFieldDisplay_BestTradingMarket, translations: {
                en: 'Best trading market',
            }
        },
        DataMarketFieldHeading_BestTradingMarket: {
            id: StringId.DataMarketFieldHeading_BestTradingMarket, translations: {
                en: 'Best trading',
            }
        },
        DataMarketFieldDisplay_BestLitForTradingMarkets: {
            id: StringId.DataMarketFieldDisplay_BestLitForTradingMarkets, translations: {
                en: 'Best lit for trading markets',
            }
        },
        DataMarketFieldHeading_BestLitForTradingMarkets: {
            id: StringId.DataMarketFieldHeading_BestLitForTradingMarkets, translations: {
                en: 'Best lit for',
            }
        },
        DataMarketFieldDisplay_MarketBoards: {
            id: StringId.DataMarketFieldDisplay_MarketBoards, translations: {
                en: 'Market boards',
            }
        },
        DataMarketFieldHeading_MarketBoards: {
            id: StringId.DataMarketFieldHeading_MarketBoards, translations: {
                en: 'Boards',
            }
        },
        DataMarketFieldDisplay_FeedStatusId: {
            id: StringId.DataMarketFieldDisplay_FeedStatusId, translations: {
                en: 'Feed status',
            }
        },
        DataMarketFieldHeading_FeedStatusId: {
            id: StringId.DataMarketFieldHeading_FeedStatusId, translations: {
                en: 'Feed status',
            }
        },
        DataMarketFieldDisplay_TradingDate: {
            id: StringId.DataMarketFieldDisplay_TradingDate, translations: {
                en: 'Trading date',
            }
        },
        DataMarketFieldHeading_TradingDate: {
            id: StringId.DataMarketFieldHeading_TradingDate, translations: {
                en: 'Trading date',
            }
        },
        DataMarketFieldDisplay_MarketTime: {
            id: StringId.DataMarketFieldDisplay_MarketTime, translations: {
                en: 'Market time',
            }
        },
        DataMarketFieldHeading_MarketTime: {
            id: StringId.DataMarketFieldHeading_MarketTime, translations: {
                en: 'Market time',
            }
        },
        DataMarketFieldDisplay_Status: {
            id: StringId.DataMarketFieldDisplay_Status, translations: {
                en: 'Status',
            }
        },
        DataMarketFieldHeading_Status: {
            id: StringId.DataMarketFieldHeading_Status, translations: {
                en: 'Status',
            }
        },
        DataMarketFieldDisplay_AllowIds: {
            id: StringId.DataMarketFieldDisplay_AllowIds, translations: {
                en: 'Allows',
            }
        },
        DataMarketFieldHeading_AllowIds: {
            id: StringId.DataMarketFieldHeading_AllowIds, translations: {
                en: 'Allows',
            }
        },
        DataMarketFieldDisplay_ReasonId: {
            id: StringId.DataMarketFieldDisplay_ReasonId, translations: {
                en: 'Reason',
            }
        },
        DataMarketFieldHeading_ReasonId: {
            id: StringId.DataMarketFieldHeading_ReasonId, translations: {
                en: 'Reason',
            }
        },
        TradingMarketFieldDisplay_HasSymbologicalCorrespondingDataMarket: {
            id: StringId.TradingMarketFieldDisplay_HasSymbologicalCorrespondingDataMarket, translations: {
                en: 'Has symbological corresponding Data Market',
            }
        },
        TradingMarketFieldHeading_HasSymbologicalCorrespondingDataMarket: {
            id: StringId.TradingMarketFieldHeading_HasSymbologicalCorrespondingDataMarket, translations: {
                en: 'Data Market',
            }
        },
        TradingMarketFieldDisplay_Feed: {
            id: StringId.TradingMarketFieldDisplay_Feed, translations: {
                en: 'Feed',
            }
        },
        TradingMarketFieldHeading_Feed: {
            id: StringId.TradingMarketFieldHeading_Feed, translations: {
                en: 'Feed',
            }
        },
        TradingMarketFieldDisplay_Attributes: {
            id: StringId.TradingMarketFieldDisplay_Attributes, translations: {
                en: 'Attributes',
            }
        },
        TradingMarketFieldHeading_Attributes: {
            id: StringId.TradingMarketFieldHeading_Attributes, translations: {
                en: 'Attributes',
            }
        },
        TradingMarketFieldDisplay_BestLitDataMarket: {
            id: StringId.TradingMarketFieldDisplay_BestLitDataMarket, translations: {
                en: 'Best lit data market',
            }
        },
        TradingMarketFieldHeading_BestLitDataMarket: {
            id: StringId.TradingMarketFieldHeading_BestLitDataMarket, translations: {
                en: 'Best lit',
            }
        },
        TradingMarketFieldDisplay_AllowedOrderTypeIds: {
            id: StringId.TradingMarketFieldDisplay_AllowedOrderTypeIds, translations: {
                en: 'Allowed order types',
            }
        },
        TradingMarketFieldHeading_AllowedOrderTypeIds: {
            id: StringId.TradingMarketFieldHeading_AllowedOrderTypeIds, translations: {
                en: 'Allowed order types',
            }
        },
        TradingMarketFieldDisplay_DefaultOrderTypeId: {
            id: StringId.TradingMarketFieldDisplay_DefaultOrderTypeId, translations: {
                en: 'Default order type',
            }
        },
        TradingMarketFieldHeading_DefaultOrderTypeId: {
            id: StringId.TradingMarketFieldHeading_DefaultOrderTypeId, translations: {
                en: 'Default order type',
            }
        },
        TradingMarketFieldDisplay_AllowedOrderTimeInForceIds: {
            id: StringId.TradingMarketFieldDisplay_AllowedOrderTimeInForceIds, translations: {
                en: 'Allowed order TimeInForces',
            }
        },
        TradingMarketFieldHeading_AllowedOrderTimeInForceIds: {
            id: StringId.TradingMarketFieldHeading_AllowedOrderTimeInForceIds, translations: {
                en: 'Allowed TimeInForces',
            }
        },
        TradingMarketFieldDisplay_DefaultOrderTimeInForceId: {
            id: StringId.TradingMarketFieldDisplay_DefaultOrderTimeInForceId, translations: {
                en: 'Default order TimeInForce',
            }
        },
        TradingMarketFieldHeading_DefaultOrderTimeInForceId: {
            id: StringId.TradingMarketFieldHeading_DefaultOrderTimeInForceId, translations: {
                en: 'Default TimeInForce',
            }
        },
        TradingMarketFieldDisplay_MarketOrderTypeAllowedTimeInForceIds: {
            id: StringId.TradingMarketFieldDisplay_MarketOrderTypeAllowedTimeInForceIds, translations: {
                en: 'Market order type allowed TimeInForces',
            }
        },
        TradingMarketFieldHeading_MarketOrderTypeAllowedTimeInForceIds: {
            id: StringId.TradingMarketFieldHeading_MarketOrderTypeAllowedTimeInForceIds, translations: {
                en: 'Market TimeInForces',
            }
        },
        TradingMarketFieldDisplay_AllowedOrderTriggerTypeIds: {
            id: StringId.TradingMarketFieldDisplay_AllowedOrderTriggerTypeIds, translations: {
                en: 'Allowed order trigger types',
            }
        },
        TradingMarketFieldHeading_AllowedOrderTriggerTypeIds: {
            id: StringId.TradingMarketFieldHeading_AllowedOrderTriggerTypeIds, translations: {
                en: 'Allowed trigger types',
            }
        },
        TradingMarketFieldDisplay_AllowedOrderTradeTypeIds: {
            id: StringId.TradingMarketFieldDisplay_AllowedOrderTradeTypeIds, translations: {
                en: 'Allowed order trade types',
            }
        },
        TradingMarketFieldHeading_AllowedOrderTradeTypeIds: {
            id: StringId.TradingMarketFieldHeading_AllowedOrderTradeTypeIds, translations: {
                en: 'Allowed trade types',
            }
        },
        MarketBoardFieldDisplay_ZenithCode: {
            id: StringId.MarketBoardFieldDisplay_ZenithCode, translations: {
                en: 'Zenith code',
            }
        },
        MarketBoardFieldHeading_ZenithCode: {
            id: StringId.MarketBoardFieldHeading_ZenithCode, translations: {
                en: 'Zenith code',
            }
        },
        MarketBoardFieldDisplay_Name: {
            id: StringId.MarketBoardFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        MarketBoardFieldHeading_Name: {
            id: StringId.MarketBoardFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        MarketBoardFieldDisplay_Display: {
            id: StringId.MarketBoardFieldDisplay_Display, translations: {
                en: 'Description',
            }
        },
        MarketBoardFieldHeading_Display: {
            id: StringId.MarketBoardFieldHeading_Display, translations: {
                en: 'Description',
            }
        },
        MarketBoardFieldDisplay_Unknown: {
            id: StringId.MarketBoardFieldDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        MarketBoardFieldHeading_Unknown: {
            id: StringId.MarketBoardFieldHeading_Unknown, translations: {
                en: 'Unknown',
            }
        },
        MarketBoardFieldDisplay_Market: {
            id: StringId.MarketBoardFieldDisplay_Market, translations: {
                en: 'Market',
            }
        },
        MarketBoardFieldHeading_Market: {
            id: StringId.MarketBoardFieldHeading_Market, translations: {
                en: 'Market',
            }
        },
        MarketBoardFieldDisplay_FeedInitialising: {
            id: StringId.MarketBoardFieldDisplay_FeedInitialising, translations: {
                en: 'Feed initialising',
            }
        },
        MarketBoardFieldHeading_FeedInitialising: {
            id: StringId.MarketBoardFieldHeading_FeedInitialising, translations: {
                en: 'Feed initialising',
            }
        },
        MarketBoardFieldDisplay_Status: {
            id: StringId.MarketBoardFieldDisplay_Status, translations: {
                en: 'Status',
            }
        },
        MarketBoardFieldHeading_Status: {
            id: StringId.MarketBoardFieldHeading_Status, translations: {
                en: 'Status',
            }
        },
        MarketBoardFieldDisplay_AllowIds: {
            id: StringId.MarketBoardFieldDisplay_AllowIds, translations: {
                en: 'Allows',
            }
        },
        MarketBoardFieldHeading_AllowIds: {
            id: StringId.MarketBoardFieldHeading_AllowIds, translations: {
                en: 'Allows',
            }
        },
        MarketBoardFieldDisplay_ReasonId: {
            id: StringId.MarketBoardFieldDisplay_ReasonId, translations: {
                en: 'Reason',
            }
        },
        MarketBoardFieldHeading_ReasonId: {
            id: StringId.MarketBoardFieldHeading_ReasonId, translations: {
                en: 'Reason',
            }
        },
        MarketsService_ListDisplay_Known: {
            id: StringId.MarketsService_ListDisplay_Known, translations: {
                en: 'Known'
            }
        },
        MarketsService_ListDescription_Known: {
            id: StringId.MarketsService_ListDescription_Known, translations: {
                en: 'List of known'
            }
        },
        MarketsService_ListDisplay_DefaultExchangeEnvironment: {
            id: StringId.MarketsService_ListDisplay_DefaultExchangeEnvironment, translations: {
                en: 'Default environment'
            }
        },
        MarketsService_ListDescription_DefaultExchangeEnvironmentSuffix: {
            id: StringId.MarketsService_ListDescription_DefaultExchangeEnvironmentSuffix, translations: {
                en: 'with default exchange environment'
            }
        },
        MarketsService_ListDisplay_Unknown: {
            id: StringId.MarketsService_ListDisplay_Unknown, translations: {
                en: 'Unknown'
            }
        },
        MarketsService_ListDescription_Unknown: {
            id: StringId.MarketsService_ListDescription_Unknown, translations: {
                en: 'List of unknown'
            }
        },
        DepthStyleDisplay_Full: {
            id: StringId.DepthStyleDisplay_Full, translations: {
                en: 'Full',
            }
        },
        DepthStyleDisplay_Short: {
            id: StringId.DepthStyleDisplay_Short, translations: {
                en: 'Short',
            }
        },
        TradingStateAllowDisplay_OrderPlace: {
            id: StringId.TradingStateAllowDisplay_OrderPlace, translations: {
                en: 'Place Order',
            }
        },
        TradingStateAllowDisplay_OrderAmend: {
            id: StringId.TradingStateAllowDisplay_OrderAmend, translations: {
                en: 'Amend Order',
            }
        },
        TradingStateAllowDisplay_OrderCancel: {
            id: StringId.TradingStateAllowDisplay_OrderCancel, translations: {
                en: 'Cancel Order',
            }
        },
        TradingStateAllowDisplay_OrderMove: {
            id: StringId.TradingStateAllowDisplay_OrderMove, translations: {
                en: 'Move Order',
            }
        },
        TradingStateAllowDisplay_Match: {
            id: StringId.TradingStateAllowDisplay_Match, translations: {
                en: 'Match',
            }
        },
        TradingStateAllowDisplay_ReportCancel: {
            id: StringId.TradingStateAllowDisplay_ReportCancel, translations: {
                en: 'Report Cancel',
            }
        },
        TradingStateReasonDisplay_Unknown: {
            id: StringId.TradingStateReasonDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        TradingStateReasonDisplay_Normal: {
            id: StringId.TradingStateReasonDisplay_Normal, translations: {
                en: 'Normal',
            }
        },
        TradingStateReasonDisplay_Suspend: {
            id: StringId.TradingStateReasonDisplay_Suspend, translations: {
                en: 'Suspend',
            }
        },
        TradingStateReasonDisplay_TradingHalt: {
            id: StringId.TradingStateReasonDisplay_TradingHalt, translations: {
                en: 'Trading Halt',
            }
        },
        TradingStateReasonDisplay_NewsRelease: {
            id: StringId.TradingStateReasonDisplay_NewsRelease, translations: {
                en: 'News Release',
            }
        },
        OrderStatusAllowDisplay_Trade: {
            id: StringId.OrderStatusAllowDisplay_Trade, translations: {
                en: 'Trade',
            }
        },
        OrderStatusAllowDisplay_Amend: {
            id: StringId.OrderStatusAllowDisplay_Amend, translations: {
                en: 'Amend',
            }
        },
        OrderStatusAllowDisplay_Cancel: {
            id: StringId.OrderStatusAllowDisplay_Cancel, translations: {
                en: 'Cancel',
            }
        },
        OrderStatusAllowDisplay_Move: {
            id: StringId.OrderStatusAllowDisplay_Move, translations: {
                en: 'Move',
            }
        },
        OrderStatusReasonDisplay_Unknown: {
            id: StringId.OrderStatusReasonDisplay_Unknown, translations: {
                en: 'Unknown',
            }
        },
        OrderStatusReasonDisplay_Normal: {
            id: StringId.OrderStatusReasonDisplay_Normal, translations: {
                en: 'Normal',
            }
        },
        OrderStatusReasonDisplay_Manual: {
            id: StringId.OrderStatusReasonDisplay_Manual, translations: {
                en: 'Manual',
            }
        },
        OrderStatusReasonDisplay_Abnormal: {
            id: StringId.OrderStatusReasonDisplay_Abnormal, translations: {
                en: 'Abnormal',
            }
        },
        OrderStatusReasonDisplay_Waiting: {
            id: StringId.OrderStatusReasonDisplay_Waiting, translations: {
                en: 'Waiting',
            }
        },
        OrderStatusReason_Completed: {
            id: StringId.OrderStatusReason_Completed, translations: {
                en: 'Completed',
            }
        },
        TopShareholdersInputModeDisplay_Today: {
            id: StringId.TopShareholdersInputModeDisplay_Today, translations: {
                en: 'Today',
            }
        },
        TopShareholdersInputModeDescription_Today: {
            id: StringId.TopShareholdersInputModeDescription_Today, translations: {
                en: 'View current top shareholders',
            }
        },
        TopShareholdersInputModeDisplay_Historical: {
            id: StringId.TopShareholdersInputModeDisplay_Historical, translations: {
                en: 'Historical',
            }
        },
        TopShareholdersInputModeDescription_Historical: {
            id: StringId.TopShareholdersInputModeDescription_Historical, translations: {
                en: 'View top shareholders at a past date',
            }
        },
        TopShareholdersInputModeDisplay_Compare: {
            id: StringId.TopShareholdersInputModeDisplay_Compare, translations: {
                en: 'Compare',
            }
        },
        TopShareholdersInputModeDescription_Compare: {
            id: StringId.TopShareholdersInputModeDescription_Compare, translations: {
                en: 'Compare top shareholders at different dates',
            }
        },
        TopShareholdersInputModeDisplay_Details: {
            id: StringId.TopShareholdersInputModeDisplay_Details, translations: {
                en: 'Details',
            }
        },
        TopShareholdersInputModeDescription_Details: {
            id: StringId.TopShareholdersInputModeDescription_Details, translations: {
                en: 'Details of security',
            }
        },
        TopShareholdersSymbolTitle: {
            id: StringId.TopShareholdersSymbolTitle, translations: {
                en: 'Symbol (only supports NZX)',
            }
        },
        TopShareholdersTodayModeCaption: {
            id: StringId.TopShareholdersTodayModeCaption, translations: {
                en: 'Current',
            }
        },
        TopShareholdersTodayModeTitle: {
            id: StringId.TopShareholdersTodayModeTitle, translations: {
                en: 'Current Top Shareholders',
            }
        },
        TopShareholdersHistoricalModeCaption: {
            id: StringId.TopShareholdersHistoricalModeCaption, translations: {
                en: 'Historical',
            }
        },
        TopShareholdersHistoricalModeTitle: {
            id: StringId.TopShareholdersHistoricalModeTitle, translations: {
                en: 'Historical Top Shareholders',
            }
        },
        TopShareholdersCompareModeCaption: {
            id: StringId.TopShareholdersCompareModeCaption, translations: {
                en: 'Compare',
            }
        },
        TopShareholdersCompareModeTitle: {
            id: StringId.TopShareholdersCompareModeTitle, translations: {
                en: 'Compare Top Shareholders on different dates',
            }
        },
        TopShareholdersDetailsModeCaption: {
            id: StringId.TopShareholdersDetailsModeCaption, translations: {
                en: 'Details',
            }
        },
        TopShareholdersDetailsModeTitle: {
            id: StringId.TopShareholdersDetailsModeTitle, translations: {
                en: 'Details of security',
            }
        },
        TopShareholdersHistoricalDate: {
            id: StringId.TopShareholdersHistoricalDate, translations: {
                en: 'Historical Top Shareholders date',
            }
        },
        TopShareholdersHistory: {
            id: StringId.TopShareholdersHistory, translations: {
                en: 'Get Top Shareholders at date',
            }
        },
        TopShareholdersInvalidHistory: {
            id: StringId.TopShareholdersInvalidHistory, translations: {
                en: 'Cannot get without symbol and historical date',
            }
        },
        TopShareholdersCompareFromDate: {
            id: StringId.TopShareholdersCompareFromDate, translations: {
                en: 'Compare from date',
            }
        },
        TopShareholdersCompareToDate: {
            id: StringId.TopShareholdersCompareToDate, translations: {
                en: 'Compare to date',
            }
        },
        TopShareholdersCompare: {
            id: StringId.TopShareholdersCompare, translations: {
                en: 'Compare Top Shareholders at dates',
            }
        },
        TopShareholdersInvalidCompare: {
            id: StringId.TopShareholdersInvalidCompare, translations: {
                en: 'Cannot compare without symbol, from date and to date',
            }
        },
        Top100Shareholders: {
            id: StringId.Top100Shareholders, translations: {
                en: 'Top 100 Shareholders',
            }
        },
        ShowSelectedAlertDetailsTitle: {
            id: StringId.ShowSelectedAlertDetailsTitle, translations: {
                en: 'Show selected alert details',
            }
        },
        AcknowledgeSelectedAlertTitle: {
            id: StringId.AcknowledgeSelectedAlertTitle, translations: {
                en: 'Acknowledge selected alert',
            }
        },
        DeleteSelectedAlertTitle: {
            id: StringId.DeleteSelectedAlertTitle, translations: {
                en: 'Delete selected alert',
            }
        },
        Watchlist_SymbolButtonTitle: {
            id: StringId.Watchlist_SymbolButtonTitle, translations: {
                en: 'Add (or select) symbol',
            }
        },
        Watchlist_DeleteSymbolCaption: {
            id: StringId.Watchlist_DeleteSymbolCaption, translations: {
                en: 'Delete symbol',
            }
        },
        Watchlist_DeleteSymbolTitle: {
            id: StringId.Watchlist_DeleteSymbolTitle, translations: {
                en: 'Delete symbol',
            }
        },
        Watchlist_NewCaption: {
            id: StringId.Watchlist_NewCaption, translations: {
                en: 'New watchlist',
            }
        },
        Watchlist_NewTitle: {
            id: StringId.Watchlist_NewTitle, translations: {
                en: 'New watchlist (hold shift key down to keep current layout)',
            }
        },
        Watchlist_OpenCaption: {
            id: StringId.Watchlist_OpenCaption, translations: {
                en: 'Open watchlist',
            }
        },
        Watchlist_OpenTitle: {
            id: StringId.Watchlist_OpenTitle, translations: {
                en: 'Open watchlist',
            }
        },
        Watchlist_SaveCaption: {
            id: StringId.Watchlist_SaveCaption, translations: {
                en: 'Save watchlist',
            }
        },
        Watchlist_SaveTitle: {
            id: StringId.Watchlist_SaveTitle, translations: {
                en: 'Save watchlist',
            }
        },
        Watchlist_OpenDialogCaption: {
            id: StringId.Watchlist_OpenDialogCaption, translations: {
                en: 'Watchlist open',
            }
        },
        Watchlist_SaveDialogCaption: {
            id: StringId.Watchlist_SaveDialogCaption, translations: {
                en: 'Watchlist save',
            }
        },
        Watchlist_ColumnsDialogCaption: {
            id: StringId.Watchlist_ColumnsDialogCaption, translations: {
                en: 'Watchlist grid columns',
            }
        },
        Depth_InvalidFilterXrefs: {
            id: StringId.Depth_InvalidFilterXrefs, translations: {
                en: 'Invalid filter cross references',
            }
        },
        Depth_RollUpCaption: {
            id: StringId.Depth_RollUpCaption, translations: {
                en: 'Roll up',
            }
        },
        Depth_RollUpToPriceLevelsTitle: {
            id: StringId.Depth_RollUpToPriceLevelsTitle, translations: {
                en: 'Roll up to price levels\nHold shift to only roll up new price levels',
            }
        },
        Depth_ExpandCaption: {
            id: StringId.Depth_ExpandCaption, translations: {
                en: 'Expand',
            }
        },
        Depth_ExpandToOrdersTitle: {
            id: StringId.Depth_ExpandToOrdersTitle, translations: {
                en: 'Expand to orders\nHold shift to only expand new price levels to orders',
            }
        },
        Depth_FilterCaption: {
            id: StringId.Depth_FilterCaption, translations: {
                en: 'Filter',
            }
        },
        Depth_FilterToXrefsTitle: {
            id: StringId.Depth_FilterToXrefsTitle, translations: {
                en: 'Only show price levels and orders with specified cross references',
            }
        },
        Depth_SpecifyFilterXrefsTitle: {
            id: StringId.Depth_SpecifyFilterXrefsTitle, translations: {
                en: 'Filtered in cross references (separate with commas)\nLeave empty to show all cross references',
            }
        },
        Depth_ColumnsDialogCaption: {
            id: StringId.Depth_ColumnsDialogCaption, translations: {
                en: 'Depth grid columns',
            }
        },
        Trades_ColumnsDialogCaption: {
            id: StringId.Trades_ColumnsDialogCaption, translations: {
                en: 'Trades grid columns',
            }
        },
        DepthAndSales_ColumnsDialogCaption: {
            id: StringId.DepthAndSales_ColumnsDialogCaption, translations: {
                en: 'Depth and sales grid columns',
            }
        },
        Orders_ColumnsDialogCaption: {
            id: StringId.Orders_ColumnsDialogCaption, translations: {
                en: 'Orders grid columns',
            }
        },
        Holdings_ColumnsDialogCaption: {
            id: StringId.Holdings_ColumnsDialogCaption, translations: {
                en: 'Holdings grid columns',
            }
        },
        Balances_ColumnsDialogCaption: {
            id: StringId.Balances_ColumnsDialogCaption, translations: {
                en: 'Balances grid columns',
            }
        },
        OrderAuthorise_ColumnsDialogCaption: {
            id: StringId.OrderAuthorise_ColumnsDialogCaption, translations: {
                en: 'Order authorise grid columns',
            }
        },
        Scans_ColumnsDialogCaption: {
            id: StringId.Scans_ColumnsDialogCaption, translations: {
                en: 'Scans grid columns',
            }
        },
        Grid_SelectAllCaption: {
            id: StringId.Grid_SelectAllCaption, translations: {
                en: 'Select All',
            }
        },
        Grid_SelectAllTitle: {
            id: StringId.Grid_SelectAllTitle, translations: {
                en: 'Select All',
            }
        },
        Grid_SearchInputTitle: {
            id: StringId.Grid_SearchInputTitle, translations: {
                en: 'Search for column',
            }
        },
        Grid_SearchNextCaption: {
            id: StringId.Grid_SearchNextCaption, translations: {
                en: 'Next match',
            }
        },
        Grid_SearchNextTitle: {
            id: StringId.Grid_SearchNextTitle, translations: {
                en: 'Next search match',
            }
        },
        ColumnLayoutDialog_EditGridColumns: {
            id: StringId.ColumnLayoutDialog_EditGridColumns, translations: {
                en: 'Edit Columns',
            }
        },
        ColumnLayoutEditor_MoveUpCaption: {
            id: StringId.ColumnLayoutEditor_MoveUpCaption, translations: {
                en: 'Up one',
            }
        },
        ColumnLayoutEditor_MoveUpTitle: {
            id: StringId.ColumnLayoutEditor_MoveUpTitle, translations: {
                en: 'Move column up one position',
            }
        },
        ColumnLayoutEditor_MoveTopCaption: {
            id: StringId.ColumnLayoutEditor_MoveTopCaption, translations: {
                en: 'To top',
            }
        },
        ColumnLayoutEditor_MoveTopTitle: {
            id: StringId.ColumnLayoutEditor_MoveTopTitle, translations: {
                en: 'Move column to top',
            }
        },
        ColumnLayoutEditor_MoveDownCaption: {
            id: StringId.ColumnLayoutEditor_MoveDownCaption, translations: {
                en: 'Down one',
            }
        },
        ColumnLayoutEditor_MoveDownTitle: {
            id: StringId.ColumnLayoutEditor_MoveDownTitle, translations: {
                en: 'Move column down one position',
            }
        },
        ColumnLayoutEditor_MoveBottomCaption: {
            id: StringId.ColumnLayoutEditor_MoveBottomCaption, translations: {
                en: 'To bottom',
            }
        },
        ColumnLayoutEditor_MoveBottomTitle: {
            id: StringId.ColumnLayoutEditor_MoveBottomTitle, translations: {
                en: 'Move column to bottom',
            }
        },
        ColumnLayoutEditor_InsertCaption: {
            id: StringId.ColumnLayoutEditor_InsertCaption, translations: {
                en: 'Insert',
            }
        },
        ColumnLayoutEditor_InsertTitle: {
            id: StringId.ColumnLayoutEditor_InsertTitle, translations: {
                en: 'Insert column into grid',
            }
        },
        ColumnLayoutEditor_RemoveCaption: {
            id: StringId.ColumnLayoutEditor_RemoveCaption, translations: {
                en: 'Remove',
            }
        },
        ColumnLayoutEditor_RemoveTitle: {
            id: StringId.ColumnLayoutEditor_RemoveTitle, translations: {
                en: 'Remove column from grid',
            }
        },
        ColumnLayoutEditor_ShowAllRadioCaption: {
            id: StringId.ColumnLayoutEditor_ShowAllRadioCaption, translations: {
                en: 'All',
            }
        },
        ColumnLayoutEditor_ShowAllRadioTitle: {
            id: StringId.ColumnLayoutEditor_ShowAllRadioTitle, translations: {
                en: 'Show all columns',
            }
        },
        ColumnLayoutEditor_ShowVisibleRadioCaption: {
            id: StringId.ColumnLayoutEditor_ShowVisibleRadioCaption, translations: {
                en: 'Visible',
            }
        },
        ColumnLayoutEditor_ShowVisibleRadioTitle: {
            id: StringId.ColumnLayoutEditor_ShowVisibleRadioTitle, translations: {
                en: 'Only show visible columns',
            }
        },
        ColumnLayoutEditor_ShowHiddenRadioCaption: {
            id: StringId.ColumnLayoutEditor_ShowHiddenRadioCaption, translations: {
                en: 'Hidden',
            }
        },
        ColumnLayoutEditor_ShowHiddenRadioTitle: {
            id: StringId.ColumnLayoutEditor_ShowHiddenRadioTitle, translations: {
                en: 'Only show hidden columns',
            }
        },
        ColumnLayoutEditorColumns_SetWidthCaption: {
            id: StringId.ColumnLayoutEditorColumns_SetWidthCaption, translations: {
                en: 'Set width',
            }
        },
        ColumnLayoutEditorColumns_SetWidthTitle: {
            id: StringId.ColumnLayoutEditorColumns_SetWidthTitle, translations: {
                en: 'Set column width or clear for width to be set automatically',
            }
        },
        DataIvemIdListEditor_RemoveSelectedCaption: {
            id: StringId.DataIvemIdListEditor_RemoveSelectedCaption, translations: {
                en: 'Remove'
            }
        },
        DataIvemIdListEditor_RemoveSelectedTitle: {
            id: StringId.DataIvemIdListEditor_RemoveSelectedTitle, translations: {
                en: 'Remove selected symbols'
            }
        },
        DataIvemIdListEditor_PopoutCaption: {
            id: StringId.DataIvemIdListEditor_PopoutCaption, translations: {
                en: 'Popout'
            }
        },
        DataIvemIdListEditor_PopoutTitle: {
            id: StringId.DataIvemIdListEditor_PopoutTitle, translations: {
                en: 'Popout symbol list editor'
            }
        },
        CallPutFieldDisplay_ExercisePrice: {
            id: StringId.CallPutFieldDisplay_ExercisePrice, translations: {
                en: 'Exercise Price',
            }
        },
        CallPutFieldHeading_ExercisePrice: {
            id: StringId.CallPutFieldHeading_ExercisePrice, translations: {
                en: 'Exercise',
            }
        },
        CallPutFieldDisplay_ExpiryDate: {
            id: StringId.CallPutFieldDisplay_ExpiryDate, translations: {
                en: 'Expiry Date',
            }
        },
        CallPutFieldHeading_ExpiryDate: {
            id: StringId.CallPutFieldHeading_ExpiryDate, translations: {
                en: 'Expiry',
            }
        },
        CallPutFieldDisplay_LitId: {
            id: StringId.CallPutFieldDisplay_LitId, translations: {
                en: 'Market',
            }
        },
        CallPutFieldHeading_LitId: {
            id: StringId.CallPutFieldHeading_LitId, translations: {
                en: 'Market',
            }
        },
        CallPutFieldDisplay_CallDataIvemId: {
            id: StringId.CallPutFieldDisplay_CallDataIvemId, translations: {
                en: 'Call Symbol',
            }
        },
        CallPutFieldHeading_CallDataIvemId: {
            id: StringId.CallPutFieldHeading_CallDataIvemId, translations: {
                en: 'C.Symbol',
            }
        },
        CallPutFieldDisplay_PutDataIvemId: {
            id: StringId.CallPutFieldDisplay_PutDataIvemId, translations: {
                en: 'Put Symbol',
            }
        },
        CallPutFieldHeading_PutDataIvemId: {
            id: StringId.CallPutFieldHeading_PutDataIvemId, translations: {
                en: 'P.Symbol',
            }
        },
        CallPutFieldDisplay_ContractMultiplier: {
            id: StringId.CallPutFieldDisplay_ContractMultiplier, translations: {
                en: 'Contract Multiplier',
            }
        },
        CallPutFieldHeading_ContractMultiplier: {
            id: StringId.CallPutFieldHeading_ContractMultiplier, translations: {
                en: 'Multiplier',
            }
        },
        CallPutFieldDisplay_ExerciseTypeId: {
            id: StringId.CallPutFieldDisplay_ExerciseTypeId, translations: {
                en: 'Exercise Type',
            }
        },
        CallPutFieldHeading_ExerciseTypeId: {
            id: StringId.CallPutFieldHeading_ExerciseTypeId, translations: {
                en: 'Type',
            }
        },
        CallPutFieldDisplay_UnderlyingIvemId: {
            id: StringId.CallPutFieldDisplay_UnderlyingIvemId, translations: {
                en: 'Underlying Symbol',
            }
        },
        CallPutFieldHeading_UnderlyingIvemId: {
            id: StringId.CallPutFieldHeading_UnderlyingIvemId, translations: {
                en: 'Underlying',
            }
        },
        CallPutFieldDisplay_UnderlyingIsIndex: {
            id: StringId.CallPutFieldDisplay_UnderlyingIsIndex, translations: {
                en: 'Underlying is Index',
            }
        },
        CallPutFieldHeading_UnderlyingIsIndex: {
            id: StringId.CallPutFieldHeading_UnderlyingIsIndex, translations: {
                en: 'Index?',
            }
        },
        ExerciseTypeDisplay_American: {
            id: StringId.ExerciseTypeDisplay_American, translations: {
                en: 'American',
            }
        },
        ExerciseTypeDisplay_Asian: {
            id: StringId.ExerciseTypeDisplay_Asian, translations: {
                en: 'Asian',
            }
        },
        ExerciseTypeDisplay_European: {
            id: StringId.ExerciseTypeDisplay_European, translations: {
                en: 'European',
            }
        },
        EtoPriceQuotationSymbolInputTitle: {
            id: StringId.EtoPriceQuotationSymbolInputTitle, translations: {
                en: 'Enter underlying symbol',
            }
        },
        EtoPriceQuotationApplySymbolCaption: {
            id: StringId.EtoPriceQuotationApplySymbolCaption, translations: {
                en: 'Get options',
            }
        },
        EtoPriceQuotationApplySymbolTitle: {
            id: StringId.EtoPriceQuotationApplySymbolTitle, translations: {
                en: 'Get options for symbol',
            }
        },
        TradeAffects_None: {
            id: StringId.TradeAffects_None, translations: {
                en: 'None',
            }
        },
        TradeAffects_Price: {
            id: StringId.TradeAffects_Price, translations: {
                en: 'Price',
            }
        },
        TradeAffects_Volume: {
            id: StringId.TradeAffects_Volume, translations: {
                en: 'Volume',
            }
        },
        TradeAffects_Vwap: {
            id: StringId.TradeAffects_Vwap, translations: {
                en: 'VWAP',
            }
        },
        TradeAttribute_OffMarketTrade: {
            id: StringId.TradeAttribute_OffMarketTrade, translations: {
                en: 'Off Market',
            }
        },
        TradeAttribute_PlaceholderTrade: {
            id: StringId.TradeAttribute_PlaceholderTrade, translations: {
                en: 'Placeholder',
            }
        },
        TradeAttribute_Cancel: {
            id: StringId.TradeAttribute_Cancel, translations: {
                en: 'Cancel',
            }
        },
        SettingsDitemGroup_GeneralCaption: {
            id: StringId.SettingsDitemGroup_GeneralCaption, translations: {
                en: 'General',
            }
        },
        SettingsDitemGroup_GeneralTitle: {
            id: StringId.SettingsDitemGroup_GeneralTitle, translations: {
                en: '',
            }
        },
        SettingsDitemGroup_GridCaption: {
            id: StringId.SettingsDitemGroup_GridCaption, translations: {
                en: 'Grid',
            }
        },
        SettingsDitemGroup_GridTitle: {
            id: StringId.SettingsDitemGroup_GridTitle, translations: {
                en: '',
            }
        },
        SettingsDitemGroup_OrderPadCaption: {
            id: StringId.SettingsDitemGroup_OrderPadCaption, translations: {
                en: 'Order pad',
            }
        },
        SettingsDitemGroup_OrderPadTitle: {
            id: StringId.SettingsDitemGroup_OrderPadTitle, translations: {
                en: '',
            }
        },
        SettingsDitemGroup_ExchangesCaption: {
            id: StringId.SettingsDitemGroup_ExchangesCaption, translations: {
                en: 'Exchanges',
            }
        },
        SettingsDitemGroup_ExchangesTitle: {
            id: StringId.SettingsDitemGroup_ExchangesTitle, translations: {
                en: '',
            }
        },
        SettingsDitemGroup_ColorsCaption: {
            id: StringId.SettingsDitemGroup_ColorsCaption, translations: {
                en: 'Colors',
            }
        },
        SettingsDitemGroup_ColorsTitle: {
            id: StringId.SettingsDitemGroup_ColorsTitle, translations: {
                en: '',
            }
        },
        SettingCaption_FontFamily: {
            id: StringId.SettingCaption_FontFamily, translations: {
                en: 'Font Family',
            }
        },
        SettingTitle_FontFamily: {
            id: StringId.SettingTitle_FontFamily, translations: {
                en: 'Font Family',
            }
        },
        SettingCaption_FontSize: {
            id: StringId.SettingCaption_FontSize, translations: {
                en: 'Font Size',
            }
        },
        SettingTitle_FontSize: {
            id: StringId.SettingTitle_FontSize, translations: {
                en: 'Font Size',
            }
        },
        SettingCaption_ColumnHeaderFontSize: {
            id: StringId.SettingCaption_ColumnHeaderFontSize, translations: {
                en: 'Column Header Font Size',
            }
        },
        SettingTitle_ColumnHeaderFontSize: {
            id: StringId.SettingTitle_ColumnHeaderFontSize, translations: {
                en: 'Column Header Font Size',
            }
        },
        SettingCaption_Symbol_DefaultExchange: {
            id: StringId.SettingCaption_Symbol_DefaultExchange, translations: {
                en: 'Default exchange',
            }
        },
        SettingTitle_Symbol_DefaultExchange: {
            id: StringId.SettingTitle_Symbol_DefaultExchange, translations: {
                en: 'Default exchange',
            }
        },
        SettingCaption_Symbol_ExchangeHideMode: {
            id: StringId.SettingCaption_Symbol_ExchangeHideMode, translations: {
                en: 'Exchange hide mode',
            }
        },
        SettingTitle_Symbol_ExchangeHideMode: {
            id: StringId.SettingTitle_Symbol_ExchangeHideMode, translations: {
                en: 'Specifies when the exchange part of a symbol should be hidden',
            }
        },
        SettingCaption_Symbol_DefaultMarketHidden: {
            id: StringId.SettingCaption_Symbol_DefaultMarketHidden, translations: {
                en: 'Hide default market',
            }
        },
        SettingTitle_Symbol_DefaultMarketHidden: {
            id: StringId.SettingTitle_Symbol_DefaultMarketHidden, translations: {
                en: 'Hide the default market in a symbol',
            }
        },
        SettingCaption_Symbol_MarketCodeAsLocalWheneverPossible: {
            id: StringId.SettingCaption_Symbol_MarketCodeAsLocalWheneverPossible, translations: {
                en: 'Abbreviate market code',
            }
        },
        SettingTitle_Symbol_MarketCodeAsLocalWheneverPossible: {
            id: StringId.SettingTitle_Symbol_MarketCodeAsLocalWheneverPossible, translations: {
                en: 'Use abbreviated market code in symbol when market belongs to symbol\'s exchange',
            }
        },
        SettingCaption_Symbol_ZenithSymbologySupportLevel: {
            id: StringId.SettingCaption_Symbol_ZenithSymbologySupportLevel, translations: {
                en: 'Zenith Symbology',
            }
        },
        SettingTitle_Symbol_ZenithSymbologySupportLevel: {
            id: StringId.SettingTitle_Symbol_ZenithSymbologySupportLevel, translations: {
                en: 'Level of support provided for Zenith Symbology',
            }
        },
        SettingCaption_Control_DropDownEditableSearchTerm: {
            id: StringId.SettingCaption_Control_DropDownEditableSearchTerm, translations: {
                en: 'Editable drop-down selects',
            }
        },
        SettingTitle_Control_DropDownEditableSearchTerm: {
            id: StringId.SettingTitle_Control_DropDownEditableSearchTerm, translations: {
                en: 'Edit previous search terms in drop-down combo box selects',
            }
        },
        SettingCaption_Format_NumberGroupingActive: {
            id: StringId.SettingCaption_Format_NumberGroupingActive, translations: {
                en: 'Number grouping',
            }
        },
        SettingTitle_Format_NumberGroupingActive: {
            id: StringId.SettingTitle_Format_NumberGroupingActive, translations: {
                en: 'Group large numbers as per regional settings (eg. use , to separate every 3 digits)',
            }
        },
        SettingCaption_Format_MinimumPriceFractionDigitsCount: {
            id: StringId.SettingCaption_Format_MinimumPriceFractionDigitsCount, translations: {
                en: 'Price min fractional digits',
            }
        },
        SettingTitle_Format_MinimumPriceFractionDigitsCount: {
            id: StringId.SettingTitle_Format_MinimumPriceFractionDigitsCount, translations: {
                en: 'Show at least this number of fractional digits in a price',
            }
        },
        SettingCaption_Format_24Hour: {
            id: StringId.SettingCaption_Format_24Hour, translations: {
                en: '24 Hour times',
            }
        },
        SettingTitle_Format_24Hour: {
            id: StringId.SettingTitle_Format_24Hour, translations: {
                en: 'Show times with a 24 hour clock instead of a 12 hour clock',
            }
        },
        SettingCaption_Format_DateTimeTimezoneModeId: {
            id: StringId.SettingCaption_Format_DateTimeTimezoneModeId, translations: {
                en: 'Times in timezone',
            }
        },
        SettingTitle_Format_DateTimeTimezoneModeId: {
            id: StringId.SettingTitle_Format_DateTimeTimezoneModeId, translations: {
                en: 'Specify which timezone times should be converted to',
            }
        },
        SettingCaption_Symbol_ExplicitSearchFieldsEnabled: {
            id: StringId.SettingCaption_Symbol_ExplicitSearchFieldsEnabled, translations: {
                en: 'Explicit (no exchange) search Fields Enabled',
            }
        },
        SettingTitle_Symbol_ExplicitSearchFieldsEnabled: {
            id: StringId.SettingTitle_Symbol_ExplicitSearchFieldsEnabled, translations: {
                en: 'Use explicit search fields when no exchange is specified (otherwise use default exchange\'s search fields)',
            }
        },
        SettingCaption_Symbol_ExplicitSearchFields: {
            id: StringId.SettingCaption_Symbol_ExplicitSearchFields, translations: {
                en: 'Explicit (no exchange) search fields',
            }
        },
        SettingTitle_Symbol_ExplicitSearchFields: {
            id: StringId.SettingTitle_Symbol_ExplicitSearchFields, translations: {
                en: 'Symbol fields searched when an exchange is not specified',
            }
        },
        SettingCaption_Master_Test: {
            id: StringId.SettingCaption_Master_Test, translations: {
                en: 'Test settings',
            }
        },
        SettingTitle_Master_Test: {
            id: StringId.SettingTitle_Master_Test, translations: {
                en: 'Use test settings',
            }
        },
        SettingCaption_Master_OperatorDefaultExchangeEnvironmentSpecific: {
            id: StringId.SettingCaption_Master_OperatorDefaultExchangeEnvironmentSpecific, translations: {
                en: 'Environment specific settings',
            }
        },
        SettingTitle_Master_OperatorDefaultExchangeEnvironmentSpecific: {
            id: StringId.SettingTitle_Master_OperatorDefaultExchangeEnvironmentSpecific, translations: {
                en: 'Each environment has its own indepenendent set of specific operator settings',
            }
        },
        SettingCaption_Grid_RowHeight: {
            id: StringId.SettingCaption_Grid_RowHeight, translations: {
                en: 'Row Height',
            }
        },
        SettingTitle_Grid_RowHeight: {
            id: StringId.SettingTitle_Grid_RowHeight, translations: {
                en: 'Row Height (in pixels)',
            }
        },
        SettingCaption_Grid_HorizontalLinesVisible: {
            id: StringId.SettingCaption_Grid_HorizontalLinesVisible, translations: {
                en: 'Show horizontal grid lines',
            }
        },
        SettingTitle_Grid_HorizontalLinesVisible: {
            id: StringId.SettingTitle_Grid_HorizontalLinesVisible, translations: {
                en: 'Show horizontal grid lines',
            }
        },
        SettingCaption_Grid_VerticalLinesVisible: {
            id: StringId.SettingCaption_Grid_VerticalLinesVisible, translations: {
                en: 'Show vertical grid lines',
            }
        },
        SettingTitle_Grid_VerticalLinesVisible: {
            id: StringId.SettingTitle_Grid_VerticalLinesVisible, translations: {
                en: 'Show vertical grid lines',
            }
        },
        SettingCaption_Grid_VerticalLinesVisibleInHeaderOnly: {
            id: StringId.SettingCaption_Grid_VerticalLinesVisibleInHeaderOnly, translations: {
                en: 'In header only',
            }
        },
        SettingTitle_Grid_VerticalLinesVisibleInHeaderOnly: {
            id: StringId.SettingTitle_Grid_VerticalLinesVisibleInHeaderOnly, translations: {
                en: 'When vertical gridlines are visible, only show in header',
            }
        },
        SettingCaption_Grid_HorizontalLineWidth: {
            id: StringId.SettingCaption_Grid_HorizontalLineWidth, translations: {
                en: 'Set width of horizontal grid lines',
            }
        },
        SettingTitle_Grid_HorizontalLineWidth: {
            id: StringId.SettingTitle_Grid_HorizontalLineWidth, translations: {
                en: 'Set width of horizontal grid lines',
            }
        },
        SettingCaption_Grid_VerticalLineWidth: {
            id: StringId.SettingCaption_Grid_VerticalLineWidth, translations: {
                en: 'Set width of vertical grid lines',
            }
        },
        SettingTitle_Grid_VerticalLineWidth: {
            id: StringId.SettingTitle_Grid_VerticalLineWidth, translations: {
                en: 'Set width of vertical grid lines',
            }
        },
        SettingCaption_Grid_CellPadding: {
            id: StringId.SettingCaption_Grid_CellPadding, translations: {
                en: 'Cell padding size (pixels)',
            }
        },
        SettingTitle_Grid_CellPadding: {
            id: StringId.SettingTitle_Grid_CellPadding, translations: {
                en: 'Cell padding size (pixels)',
            }
        },
        SettingCaption_Grid_ChangedAllHighlightDuration: {
            id: StringId.SettingCaption_Grid_ChangedAllHighlightDuration, translations: {
                en: 'Changed all highlight duration',
            }
        },
        SettingTitle_Grid_ChangedAllHighlightDuration: {
            id: StringId.SettingTitle_Grid_ChangedAllHighlightDuration, translations: {
                en: 'Duration of all changed highlight (milliseconds)',
            }
        },
        SettingCaption_Grid_AddedRowHighlightDuration: {
            id: StringId.SettingCaption_Grid_AddedRowHighlightDuration, translations: {
                en: 'Added row highlight duration',
            }
        },
        SettingTitle_Grid_AddedRowHighlightDuration: {
            id: StringId.SettingTitle_Grid_AddedRowHighlightDuration, translations: {
                en: 'Duration of added row highlights (milliseconds)',
            }
        },
        SettingCaption_Grid_ChangedRowRecordHighlightDuration: {
            id: StringId.SettingCaption_Grid_ChangedRowRecordHighlightDuration, translations: {
                en: 'Changed row highlight duration',
            }
        },
        SettingTitle_Grid_ChangedRowRecordHighlightDuration: {
            id: StringId.SettingTitle_Grid_ChangedRowRecordHighlightDuration, translations: {
                en: 'Duration of changed row highlights (milliseconds)',
            }
        },
        SettingCaption_Grid_ChangedValueHighlightDuration: {
            id: StringId.SettingCaption_Grid_ChangedValueHighlightDuration, translations: {
                en: 'Changed value highlight duration',
            }
        },
        SettingTitle_Grid_ChangedValueHighlightDuration: {
            id: StringId.SettingTitle_Grid_ChangedValueHighlightDuration, translations: {
                en: 'Duration of changed value/cell highlights (milliseconds)',
            }
        },
        SettingCaption_Grid_FocusedRowColored: {
            id: StringId.SettingCaption_Grid_FocusedRowColored, translations: {
                en: 'Color focused row',
            }
        },
        SettingTitle_Grid_FocusedRowColored: {
            id: StringId.SettingTitle_Grid_FocusedRowColored, translations: {
                en: 'Color focused row',
            }
        },
        SettingCaption_Grid_FocusedRowBordered: {
            id: StringId.SettingCaption_Grid_FocusedRowBordered, translations: {
                en: 'Border focused row',
            }
        },
        SettingTitle_Grid_FocusedRowBordered: {
            id: StringId.SettingTitle_Grid_FocusedRowBordered, translations: {
                en: 'Border focused row',
            }
        },
        SettingCaption_Grid_FocusedRowBorderWidth: {
            id: StringId.SettingCaption_Grid_FocusedRowBorderWidth, translations: {
                en: 'Focused row border width',
            }
        },
        SettingTitle_Grid_FocusedRowBorderWidth: {
            id: StringId.SettingTitle_Grid_FocusedRowBorderWidth, translations: {
                en: 'Focused row border width',
            }
        },

        SettingCaption_Grid_SmoothHorizontalScrolling: {
            id: StringId.SettingCaption_Grid_SmoothHorizontalScrolling, translations: {
                en: 'Smooth Horizontal Scrolling'
            }
        },
        SettingTitle_Grid_SmoothHorizontalScrolling: {
            id: StringId.SettingTitle_Grid_SmoothHorizontalScrolling, translations: {
                en: 'Smooth Horizontal Scrolling'
            }
        },
        SettingCaption_Grid_HorizontalScrollbarWidth: {
            id: StringId.SettingCaption_Grid_HorizontalScrollbarWidth, translations: {
                en: 'Horizontal scrollbar width',
            }
        },
        SettingTitle_Grid_HorizontalScrollbarWidth: {
            id: StringId.SettingTitle_Grid_HorizontalScrollbarWidth, translations: {
                en: 'Horizontal scrollbar width (pixels)',
            }
        },
        SettingCaption_Grid_VerticalScrollbarWidth: {
            id: StringId.SettingCaption_Grid_VerticalScrollbarWidth, translations: {
                en: 'Vertical scrollbar width',
            }
        },
        SettingTitle_Grid_VerticalScrollbarWidth: {
            id: StringId.SettingTitle_Grid_VerticalScrollbarWidth, translations: {
                en: 'Vertical scrollbar width (pixels)',
            }
        },
        SettingCaption_Grid_ScrollbarMargin: {
            id: StringId.SettingCaption_Grid_ScrollbarMargin, translations: {
                en: 'Scrollbar margin',
            }
        },
        SettingTitle_Grid_ScrollbarMargin: {
            id: StringId.SettingTitle_Grid_ScrollbarMargin, translations: {
                en: 'Scrollbar margin (pixels)',
            }
        },
        SettingCaption_Grid_ScrollbarThumbInactiveOpacity: {
            id: StringId.SettingCaption_Grid_ScrollbarThumbInactiveOpacity, translations: {
                en: 'Inactive scrollbar thumb opacity',
            }
        },
        SettingTitle_Grid_ScrollbarThumbInactiveOpacity: {
            id: StringId.SettingTitle_Grid_ScrollbarThumbInactiveOpacity, translations: {
                en: 'When a scrollbar is not in use, its thumb will fade to this opacity (transparency)',
            }
        },
        SettingCaption_OrderPad_ReviewEnabled: {
            id: StringId.SettingCaption_OrderPad_ReviewEnabled, translations: {
                en: 'Enable order review',
            }
        },
        SettingTitle_OrderPad_ReviewEnabled: {
            id: StringId.SettingTitle_OrderPad_ReviewEnabled, translations: {
                en: 'Order pad will include review step before sending',
            }
        },
        SettingCaption_OrderPad_DefaultOrderTypeId: {
            id: StringId.SettingCaption_OrderPad_DefaultOrderTypeId, translations: {
                en: 'Default Order Type',
            }
        },
        SettingTitle_OrderPad_DefaultOrderTypeId: {
            id: StringId.SettingTitle_OrderPad_DefaultOrderTypeId, translations: {
                en: 'Initialise order type for new orders',
            }
        },
        SettingCaption_Exchange_SymbolSearchFields: {
            id: StringId.SettingCaption_Exchange_SymbolSearchFields, translations: {
                en: 'Symbol search fields',
            }
        },
        SettingTitle_Exchange_SymbolSearchFields: {
            id: StringId.SettingTitle_Exchange_SymbolSearchFields, translations: {
                en: 'Fields to be searched in symbol select control when exchange is specified',
            }
        },
        SettingCaption_Exchange_SymbolNameField: {
            id: StringId.SettingCaption_Exchange_SymbolNameField, translations: {
                en: 'Symbol name field',
            }
        },
        SettingTitle_Exchange_SymbolNameField: {
            id: StringId.SettingTitle_Exchange_SymbolNameField, translations: {
                en: 'Field used to generate the name of a symbol',
            }
        },
        DefaultOrderTypeIdNotSpecified: {
            id: StringId.DefaultOrderTypeIdNotSpecified, translations: {
                en: 'Order type is not initialised',
            }
        },
        SettingCaption_OrderPad_DefaultTimeInForceId: {
            id: StringId.SettingCaption_OrderPad_DefaultTimeInForceId, translations: {
                en: 'Default Time in Force',
            }
        },
        SettingTitle_OrderPad_DefaultTimeInForceId: {
            id: StringId.SettingTitle_OrderPad_DefaultTimeInForceId, translations: {
                en: 'Initialise time in force for new orders',
            }
        },
        DefaultTimeInForceIdNotSpecified: {
            id: StringId.DefaultTimeInForceIdNotSpecified, translations: {
                en: 'Time in force is not initialised',
            }
        },
        ColorGridHeading_ItemId: {
            id: StringId.ColorGridHeading_ItemId, translations: {
                en: 'Id',
            }
        },
        ColorGridHeading_Name: {
            id: StringId.ColorGridHeading_Name, translations: {
                en: 'Name',
            }
        },
        ColorGridHeading_Display: {
            id: StringId.ColorGridHeading_Display, translations: {
                en: 'Display',
            }
        },
        ColorGridHeading_ItemBkgdColorText: {
            id: StringId.ColorGridHeading_ItemBkgdColorText, translations: {
                en: 'Bkgd',
            }
        },
        ColorGridHeading_ResolvedBkgdColorText: {
            id: StringId.ColorGridHeading_ResolvedBkgdColorText, translations: {
                en: 'Bkgd',
            }
        },
        ColorGridHeading_ItemForeColorText: {
            id: StringId.ColorGridHeading_ItemForeColorText, translations: {
                en: 'Fore',
            }
        },
        ColorGridHeading_ResolvedForeColorText: {
            id: StringId.ColorGridHeading_ResolvedForeColorText, translations: {
                en: 'Fore',
            }
        },
        ColorGridHeading_ItemBkgdColor: {
            id: StringId.ColorGridHeading_ItemBkgdColor, translations: {
                en: 'Bkgd',
            }
        },
        ColorGridHeading_ResolvedBkgdColor: {
            id: StringId.ColorGridHeading_ResolvedBkgdColor, translations: {
                en: 'Bkgd',
            }
        },
        ColorGridHeading_ItemForeColor: {
            id: StringId.ColorGridHeading_ItemForeColor, translations: {
                en: 'Fore',
            }
        },
        ColorGridHeading_ResolvedForeColor: {
            id: StringId.ColorGridHeading_ResolvedForeColor, translations: {
                en: 'Fore',
            }
        },
        ColorGridHeading_NotHasBkgd: {
            id: StringId.ColorGridHeading_NotHasBkgd, translations: {
                en: 'Bkgd',
            }
        },
        ColorGridHeading_NotHasFore: {
            id: StringId.ColorGridHeading_NotHasFore, translations: {
                en: 'Fore',
            }
        },
        ColorGridHeading_Readability: {
            id: StringId.ColorGridHeading_Readability, translations: {
                en: 'Readability',
            }
        },
        ColorGridHeading_IsReadable: {
            id: StringId.ColorGridHeading_IsReadable, translations: {
                en: 'Readable',
            }
        },
        LogLevel_Info: {
            id: StringId.LogLevel_Info, translations: {
                en: 'Info',
            }
        },
        LogLevel_Warning: {
            id: StringId.LogLevel_Warning, translations: {
                en: 'Warning',
            }
        },
        LogLevel_Error: {
            id: StringId.LogLevel_Error, translations: {
                en: 'Error',
            }
        },
        LogLevel_Severe: {
            id: StringId.LogLevel_Severe, translations: {
                en: 'Severe',
            }
        },
        LogLevel_Debug: {
            id: StringId.LogLevel_Debug, translations: {
                en: 'Debug',
            }
        },
        ZenithPublisherStateDisplay_Initialise: {
            id: StringId.ZenithPublisherStateDisplay_Initialise, translations: {
                en: 'Initialise',
            }
        },
        ZenithPublisherStateDisplay_ReconnectDelay: {
            id: StringId.ZenithPublisherStateDisplay_ReconnectDelay, translations: {
                en: 'Reconnect Delay',
            }
        },
        ZenithPublisherStateDisplay_AccessTokenWaiting: {
            id: StringId.ZenithPublisherStateDisplay_AccessTokenWaiting, translations: {
                en: 'Access Token Waiting',
            }
        },
        ZenithPublisherStateDisplay_SocketOpen: {
            id: StringId.ZenithPublisherStateDisplay_SocketOpen, translations: {
                en: 'Socket Open',
            }
        },
        ZenithPublisherStateDisplay_AuthFetch: {
            id: StringId.ZenithPublisherStateDisplay_AuthFetch, translations: {
                en: 'Authorisation Fetch',
            }
        },
        ZenithPublisherStateDisplay_AuthActive: {
            id: StringId.ZenithPublisherStateDisplay_AuthActive, translations: {
                en: 'Authorisation Active',
            }
        },
        ZenithPublisherStateDisplay_AuthUpdate: {
            id: StringId.ZenithPublisherStateDisplay_AuthUpdate, translations: {
                en: 'Authorisation Update',
            }
        },
        ZenithPublisherStateDisplay_SocketClose: {
            id: StringId.ZenithPublisherStateDisplay_SocketClose, translations: {
                en: 'Socket Close',
            }
        },
        ZenithPublisherStateDisplay_Finalised: {
            id: StringId.ZenithPublisherStateDisplay_Finalised, translations: {
                en: 'Finalised',
            }
        },
        ZenithPublisherReconnectReasonDisplay_NewEndpoints: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_NewEndpoints, translations: {
                en: 'New Endpoints',
            }
        },
        ZenithPublisherReconnectReasonDisplay_PassportTokenFailure: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_PassportTokenFailure, translations: {
                en: 'Passport Token Failure',
            }
        },
        ZenithPublisherReconnectReasonDisplay_SocketConnectingError: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_SocketConnectingError, translations: {
                en: 'Socket Connecting Error',
            }
        },
        ZenithPublisherReconnectReasonDisplay_AuthRejected: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_AuthRejected, translations: {
                en: 'Authorisation rejected',
            }
        },
        ZenithPublisherReconnectReasonDisplay_AuthExpired: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_AuthExpired, translations: {
                en: 'Authorisation expired',
            }
        },
        ZenithPublisherReconnectReasonDisplay_UnexpectedSocketClose: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_UnexpectedSocketClose, translations: {
                en: 'Unexpected Socket Close',
            }
        },
        ZenithPublisherReconnectReasonDisplay_SocketClose: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_SocketClose, translations: {
                en: 'Socket Close',
            }
        },
        ZenithPublisherReconnectReasonDisplay_Timeout: {
            id: StringId.ZenithPublisherReconnectReasonDisplay_Timeout, translations: {
                en: 'Timeout',
            }
        },
        SessionManagerStateDisplay_NotStarted: {
            id: StringId.SessionManagerStateDisplay_NotStarted, translations: {
                en: 'Not Started',
            }
        },
        SessionManagerStateDisplay_Starting: {
            id: StringId.SessionManagerStateDisplay_Starting, translations: {
                en: 'Starting',
            }
        },
        SessionManagerStateDisplay_Online: {
            id: StringId.SessionManagerStateDisplay_Online, translations: {
                en: 'Online',
            }
        },
        SessionManagerStateDisplay_Offline: {
            id: StringId.SessionManagerStateDisplay_Offline, translations: {
                en: 'Offline',
            }
        },
        SessionManagerStateDisplay_Finalising: {
            id: StringId.SessionManagerStateDisplay_Finalising, translations: {
                en: 'Finalising',
            }
        },
        SessionManagerStateDisplay_Finalised: {
            id: StringId.SessionManagerStateDisplay_Finalised, translations: {
                en: 'Finalised',
            }
        },
        ColorSettingsItemStateDisplay_Never: {
            id: StringId.ColorSettingsItemStateDisplay_Never, translations: {
                en: 'Never',
            }
        },
        ColorSettingsItemStateDisplay_Inherit: {
            id: StringId.ColorSettingsItemStateDisplay_Inherit, translations: {
                en: 'Inherit',
            }
        },
        ColorSettingsItemStateDisplay_Value: {
            id: StringId.ColorSettingsItemStateDisplay_Value, translations: {
                en: 'Value',
            }
        },
        OrderPadFieldDisplay_RequestType: {
            id: StringId.OrderPadFieldDisplay_RequestType, translations: {
                en: 'Request type',
            }
        },
        OrderPadFieldDisplay_ProductIdentificationType: {
            id: StringId.OrderPadFieldDisplay_ProductIdentificationType, translations: {
                en: 'ProductIdentificationType',
            }
        },
        OrderPadFieldDisplay_AccountId: {
            id: StringId.OrderPadFieldDisplay_AccountId, translations: {
                en: 'Account Id',
            }
        },
        OrderPadFieldDisplay_BrokerageAccountsDataItemReady: {
            id: StringId.OrderPadFieldDisplay_BrokerageAccountsDataItemReady, translations: {
                en: 'BrokerageAccountsDataItemReady',
            }
        },
        OrderPadFieldDisplay_BrokerageCode: {
            id: StringId.OrderPadFieldDisplay_BrokerageCode, translations: {
                en: 'Brokerage code',
            }
        },
        OrderPadFieldDisplay_BrokerageScheduleDataItemReady: {
            id: StringId.OrderPadFieldDisplay_BrokerageScheduleDataItemReady, translations: {
                en: 'BrokerageScheduleDataItemReady',
            }
        },
        OrderPadFieldDisplay_AccountDefaultBrokerageCode: {
            id: StringId.OrderPadFieldDisplay_AccountDefaultBrokerageCode, translations: {
                en: 'AccountDefaultBrokerageCode',
            }
        },
        OrderPadFieldDisplay_BrokerageCodeListReady: {
            id: StringId.OrderPadFieldDisplay_BrokerageCodeListReady, translations: {
                en: 'BrokerageCodeListReady',
            }
        },
        OrderPadFieldDisplay_LinkId: {
            id: StringId.OrderPadFieldDisplay_LinkId, translations: {
                en: 'LinkId',
            }
        },
        OrderPadFieldDisplay_Brokerage: {
            id: StringId.OrderPadFieldDisplay_Brokerage, translations: {
                en: 'Brokerage',
            }
        },
        OrderPadFieldDisplay_ExpiryDate: {
            id: StringId.OrderPadFieldDisplay_ExpiryDate, translations: {
                en: 'Expiry date',
            }
        },
        OrderPadFieldDisplay_InstructionTime: {
            id: StringId.OrderPadFieldDisplay_InstructionTime, translations: {
                en: 'Instruction time',
            }
        },
        OrderPadFieldDisplay_SymbolAndSource: {
            id: StringId.OrderPadFieldDisplay_SymbolAndSource, translations: {
                en: 'Symbol',
            }
        },
        OrderPadFieldDisplay_SymbolPriceStepSegmentsDataItemReady: {
            id: StringId.OrderPadFieldDisplay_SymbolPriceStepSegmentsDataItemReady, translations: {
                en: 'SymbolPriceStepSegmentsDataItemReady',
            }
        },
        OrderPadFieldDisplay_Srn: {
            id: StringId.OrderPadFieldDisplay_Srn, translations: {
                en: 'Srn',
            }
        },
        OrderPadFieldDisplay_LocateReqd: {
            id: StringId.OrderPadFieldDisplay_LocateReqd, translations: {
                en: 'LocateReqd',
            }
        },
        OrderPadFieldDisplay_Algo: {
            id: StringId.OrderPadFieldDisplay_Algo, translations: {
                en: 'Algo',
            }
        },
        OrderPadFieldDisplay_VisibleQuantity: {
            id: StringId.OrderPadFieldDisplay_VisibleQuantity, translations: {
                en: 'Visible quantity',
            }
        },
        OrderPadFieldDisplay_MinimumQuantity: {
            id: StringId.OrderPadFieldDisplay_MinimumQuantity, translations: {
                en: 'Minimum quantity',
            }
        },
        OrderPadFieldDisplay_ExecutionInstructions: {
            id: StringId.OrderPadFieldDisplay_ExecutionInstructions, translations: {
                en: 'Execution instructions',
            }
        },
        OrderPadFieldDisplay_OrderType: {
            id: StringId.OrderPadFieldDisplay_OrderType, translations: {
                en: 'Order type',
            }
        },
        OrderPadFieldDisplay_TriggerTypeId: {
            id: StringId.OrderPadFieldDisplay_TriggerTypeId, translations: {
                en: 'Trigger type',
            }
        },
        OrderPadFieldDisplay_Previewed: {
            id: StringId.OrderPadFieldDisplay_Previewed, translations: {
                en: 'Previewed',
            }
        },
        OrderPadFieldDisplay_TotalQuantity: {
            id: StringId.OrderPadFieldDisplay_TotalQuantity, translations: {
                en: 'Total quantity',
            }
        },
        OrderPadFieldDisplay_OrigRequestId: {
            id: StringId.OrderPadFieldDisplay_OrigRequestId, translations: {
                en: 'OrigRequestId',
            }
        },
        OrderPadFieldDisplay_OrderGivenBy: {
            id: StringId.OrderPadFieldDisplay_OrderGivenBy, translations: {
                en: 'OrderGivenBy',
            }
        },
        OrderPadFieldDisplay_OrderGiversDataItemReady: {
            id: StringId.OrderPadFieldDisplay_OrderGiversDataItemReady, translations: {
                en: 'OrderGiversDataItemReady',
            }
        },
        OrderPadFieldDisplay_OrderTakenBy: {
            id: StringId.OrderPadFieldDisplay_OrderTakenBy, translations: {
                en: 'OrderTakenBy',
            }
        },
        OrderPadFieldDisplay_LimitValue: {
            id: StringId.OrderPadFieldDisplay_LimitValue, translations: {
                en: 'Limit value',
            }
        },
        OrderPadFieldDisplay_LimitUnit: {
            id: StringId.OrderPadFieldDisplay_LimitUnit, translations: {
                en: 'Limit unit',
            }
        },
        OrderPadFieldDisplay_TriggerValue: {
            id: StringId.OrderPadFieldDisplay_TriggerValue, translations: {
                en: 'Trigger value',
            }
        },
        OrderPadFieldDisplay_TriggerUnit: {
            id: StringId.OrderPadFieldDisplay_TriggerUnit, translations: {
                en: 'Trigger unit',
            }
        },
        OrderPadFieldDisplay_TriggerField: {
            id: StringId.OrderPadFieldDisplay_TriggerField, translations: {
                en: 'Trigger field',
            }
        },
        OrderPadFieldDisplay_TriggerMovement: {
            id: StringId.OrderPadFieldDisplay_TriggerMovement, translations: {
                en: 'Trigger movement',
            }
        },
        OrderPadFieldDisplay_Side: {
            id: StringId.OrderPadFieldDisplay_Side, translations: {
                en: 'Side',
            }
        },
        OrderPadFieldDisplay_RoaNoAdvice: {
            id: StringId.OrderPadFieldDisplay_RoaNoAdvice, translations: {
                en: 'RoaNoAdvice',
            }
        },
        OrderPadFieldDisplay_RoaNotes: {
            id: StringId.OrderPadFieldDisplay_RoaNotes, translations: {
                en: 'RoaNotes',
            }
        },
        OrderPadFieldDisplay_SoaRequired: {
            id: StringId.OrderPadFieldDisplay_SoaRequired, translations: {
                en: 'SoaRequired',
            }
        },
        OrderPadFieldDisplay_RoaMethod: {
            id: StringId.OrderPadFieldDisplay_RoaMethod, translations: {
                en: 'RoaMethod',
            }
        },
        OrderPadFieldDisplay_RoaJustification: {
            id: StringId.OrderPadFieldDisplay_RoaJustification, translations: {
                en: 'RoaJustification',
            }
        },
        OrderPadFieldDisplay_RoaDeclarations: {
            id: StringId.OrderPadFieldDisplay_RoaDeclarations, translations: {
                en: 'RoaDeclarations',
            }
        },
        OrderPadFieldDisplay_RoaDeclarationDefinitionsDataItemReady: {
            id: StringId.OrderPadFieldDisplay_RoaDeclarationDefinitionsDataItemReady, translations: {
                en: 'RoaDeclarationDefinitionsDataItemReady',
            }
        },
        OrderPadFieldDisplay_Tax: {
            id: StringId.OrderPadFieldDisplay_Tax, translations: {
                en: 'Tax',
            }
        },
        OrderPadFieldDisplay_TimeInForce: {
            id: StringId.OrderPadFieldDisplay_TimeInForce, translations: {
                en: 'Time in force',
            }
        },
        OrderPadFieldDisplay_TmcLegCount: {
            id: StringId.OrderPadFieldDisplay_TmcLegCount, translations: {
                en: 'TmcLegCount',
            }
        },
        OrderPadFieldDisplay_TmcLeg0SymbolAndSource: {
            id: StringId.OrderPadFieldDisplay_TmcLeg0SymbolAndSource, translations: {
                en: 'TmcLeg0SymbolAndSource',
            }
        },
        OrderPadFieldDisplay_TmcLeg0Ratio: {
            id: StringId.OrderPadFieldDisplay_TmcLeg0Ratio, translations: {
                en: 'TmcLeg0Ratio',
            }
        },
        OrderPadFieldDisplay_TmcLeg0BuyOrSell: {
            id: StringId.OrderPadFieldDisplay_TmcLeg0BuyOrSell, translations: {
                en: 'TmcLeg0BuyOrSell',
            }
        },
        OrderPadFieldDisplay_TmcLeg1SymbolAndSource: {
            id: StringId.OrderPadFieldDisplay_TmcLeg1SymbolAndSource, translations: {
                en: 'TmcLeg1SymbolAndSource',
            }
        },
        OrderPadFieldDisplay_TmcLeg1Ratio: {
            id: StringId.OrderPadFieldDisplay_TmcLeg1Ratio, translations: {
                en: 'TmcLeg1Ratio',
            }
        },
        OrderPadFieldDisplay_TmcLeg1BuyOrSell: {
            id: StringId.OrderPadFieldDisplay_TmcLeg1BuyOrSell, translations: {
                en: 'TmcLeg1BuyOrSell',
            }
        },
        OrderPadFieldDisplay_TmcLeg2SymbolAndSource: {
            id: StringId.OrderPadFieldDisplay_TmcLeg2SymbolAndSource, translations: {
                en: 'TmcLeg2SymbolAndSource',
            }
        },
        OrderPadFieldDisplay_TmcLeg2Ratio: {
            id: StringId.OrderPadFieldDisplay_TmcLeg2Ratio, translations: {
                en: 'TmcLeg2Ratio',
            }
        },
        OrderPadFieldDisplay_TmcLeg2BuyOrSell: {
            id: StringId.OrderPadFieldDisplay_TmcLeg2BuyOrSell, translations: {
                en: 'TmcLeg2BuyOrSell',
            }
        },
        OrderPadFieldDisplay_TmcLeg3SymbolAndSource: {
            id: StringId.OrderPadFieldDisplay_TmcLeg3SymbolAndSource, translations: {
                en: 'TmcLeg3SymbolAndSource',
            }
        },
        OrderPadFieldDisplay_TmcLeg3Ratio: {
            id: StringId.OrderPadFieldDisplay_TmcLeg3Ratio, translations: {
                en: 'TmcLeg3Ratio',
            }
        },
        OrderPadFieldDisplay_TmcLeg3BuyOrSell: {
            id: StringId.OrderPadFieldDisplay_TmcLeg3BuyOrSell, translations: {
                en: 'TmcLeg3BuyOrSell',
            }
        },
        OrderPadFieldDisplay_TmcMaxLegRatioCommonFactor: {
            id: StringId.OrderPadFieldDisplay_TmcMaxLegRatioCommonFactor, translations: {
                en: 'TmcMaxLegRatioCommonFactor',
            }
        },
        OrderPadFieldDisplay_OmsServiceOnline: {
            id: StringId.OrderPadFieldDisplay_OmsServiceOnline, translations: {
                en: 'OmsServiceOnline',
            }
        },
        OrderPadFieldDisplay_Status: {
            id: StringId.OrderPadFieldDisplay_Status, translations: {
                en: 'Status',
            }
        },
        OrderPadFieldDisplay_CurrentOmsOrderId: {
            id: StringId.OrderPadFieldDisplay_CurrentOmsOrderId, translations: {
                en: 'CurrentOmsOrderId',
            }
        },
        OrderPadFieldDisplay_WorkOmsOrderId: {
            id: StringId.OrderPadFieldDisplay_WorkOmsOrderId, translations: {
                en: 'WorkOmsOrderId',
            }
        },
        OrderPadFieldDisplay_LoadedLeavesQuantity: {
            id: StringId.OrderPadFieldDisplay_LoadedLeavesQuantity, translations: {
                en: 'LoadedLeavesQuantity',
            }
        },
        OrderPadFieldDisplay_AccountTradePermissions: {
            id: StringId.OrderPadFieldDisplay_AccountTradePermissions, translations: {
                en: 'AccountTradePermissions',
            }
        },
        OrderPadFieldDisplay_ExistingOrderId: {
            id: StringId.OrderPadFieldDisplay_ExistingOrderId, translations: {
                en: 'Existing Order',
            }
        },
        OrderPadFieldDisplay_DestinationAccount: {
            id: StringId.OrderPadFieldDisplay_DestinationAccount, translations: {
                en: 'Destination Account',
            }
        },
        OrderPadFieldStatusReasonDescription_Unknown: {
            id: StringId.OrderPadFieldStatusReasonDescription_Unknown, translations: {
                en: 'Unknown',
            }
        },
        OrderPadFieldStatusReasonDescription_Initial: {
            id: StringId.OrderPadFieldStatusReasonDescription_Initial, translations: {
                en: 'Initial',
            }
        },
        OrderPadFieldStatusReasonDescription_ValueRequired: {
            id: StringId.OrderPadFieldStatusReasonDescription_ValueRequired, translations: {
                en: 'Value required',
            }
        },
        OrderPadFieldStatusReasonDescription_ValueNotRequired: {
            id: StringId.OrderPadFieldStatusReasonDescription_ValueNotRequired, translations: {
                en: 'Value not required',
            }
        },
        OrderPadFieldStatusReasonDescription_OmsServiceNotOnline: {
            id: StringId.OrderPadFieldStatusReasonDescription_OmsServiceNotOnline, translations: {
                en: 'OmsServiceNotOnline',
            }
        },
        OrderPadFieldStatusReasonDescription_NegativeValueNotAllowed: {
            id: StringId.OrderPadFieldStatusReasonDescription_NegativeValueNotAllowed, translations: {
                en: 'Negative value not allowed',
            }
        },
        OrderPadFieldStatusReasonDescription_ZeroOrNegativeValueNotAllowed: {
            id: StringId.OrderPadFieldStatusReasonDescription_ZeroOrNegativeValueNotAllowed, translations: {
                en: 'Zero or negative value not allowed',
            }
        },
        OrderPadFieldStatusReasonDescription_InvalidQuantityForDestination: {
            id: StringId.OrderPadFieldStatusReasonDescription_InvalidQuantityForDestination, translations: {
                en: 'Invalid quantity for route',
            }
        },
        OrderPadFieldStatusReasonDescription_InvalidAccountId: {
            id: StringId.OrderPadFieldStatusReasonDescription_InvalidAccountId, translations: {
                en: 'Invalid account Id',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountNoLongerAvailable: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountNoLongerAvailable, translations: {
                en: 'Account no longer available',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountFeedStatus_Initialising: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountFeedStatus_Initialising, translations: {
                en: 'Account Feed Status is Initialising',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountFeedStatus_Closed: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountFeedStatus_Closed, translations: {
                en: 'Account Feed Status is Closed',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountFeedStatus_Inactive: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountFeedStatus_Inactive, translations: {
                en: 'Account Feed Status is Inactive',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountFeedStatus_Impaired: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountFeedStatus_Impaired, translations: {
                en: 'Account Feed Status is Impaired',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountFeedStatus_Expired: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountFeedStatus_Expired, translations: {
                en: 'Account Feed Status is Expired',
            }
        },
        OrderPadFieldStatusReasonDescription_SymbolNotFound: {
            id: StringId.OrderPadFieldStatusReasonDescription_SymbolNotFound, translations: {
                en: 'Symbol not found',
            }
        },
        OrderPadFieldStatusReasonDescription_WorkOrdersNotAllowed: {
            id: StringId.OrderPadFieldStatusReasonDescription_WorkOrdersNotAllowed, translations: {
                en: 'WorkOrdersNotAllowed',
            }
        },
        OrderPadFieldStatusReasonDescription_ViewWorkOrdersNotAllowed: {
            id: StringId.OrderPadFieldStatusReasonDescription_ViewWorkOrdersNotAllowed, translations: {
                en: 'ViewWorkOrdersNotAllowed',
            }
        },
        OrderPadFieldStatusReasonDescription_NotBackOfficeScreens: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotBackOfficeScreens, translations: {
                en: 'NotBackOfficeScreens',
            }
        },
        OrderPadFieldStatusReasonDescription_NotCanSelectBrokerage: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotCanSelectBrokerage, translations: {
                en: 'NotCanSelectBrokerage',
            }
        },
        OrderPadFieldStatusReasonDescription_Place: {
            id: StringId.OrderPadFieldStatusReasonDescription_Place, translations: {
                en: 'Place',
            }
        },
        OrderPadFieldStatusReasonDescription_Amend: {
            id: StringId.OrderPadFieldStatusReasonDescription_Amend, translations: {
                en: 'Amend',
            }
        },
        OrderPadFieldStatusReasonDescription_Cancel: {
            id: StringId.OrderPadFieldStatusReasonDescription_Cancel, translations: {
                en: 'Cancel',
            }
        },
        OrderPadFieldStatusReasonDescription_Move: {
            id: StringId.OrderPadFieldStatusReasonDescription_Move, translations: {
                en: 'Move',
            }
        },
        OrderPadFieldStatusReasonDescription_NotMove: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotMove, translations: {
                en: 'Not move',
            }
        },
        OrderPadFieldStatusReasonDescription_Work: {
            id: StringId.OrderPadFieldStatusReasonDescription_Work, translations: {
                en: 'Work',
            }
        },
        OrderPadFieldStatusReasonDescription_NotWork: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotWork, translations: {
                en: 'NotWork',
            }
        },
        OrderPadFieldStatusReasonDescription_Linked: {
            id: StringId.OrderPadFieldStatusReasonDescription_Linked, translations: {
                en: 'Linked',
            }
        },
        OrderPadFieldStatusReasonDescription_NotIceberg: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotIceberg, translations: {
                en: 'NotIceberg',
            }
        },
        OrderPadFieldStatusReasonDescription_AmendLinked: {
            id: StringId.OrderPadFieldStatusReasonDescription_AmendLinked, translations: {
                en: 'AmendLinked',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountNotFound: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountNotFound, translations: {
                en: 'Account not found',
            }
        },
        OrderPadFieldStatusReasonDescription_AccountDoesNotHaveDefaultBrokerageCode: {
            id: StringId.OrderPadFieldStatusReasonDescription_AccountDoesNotHaveDefaultBrokerageCode, translations: {
                en: 'AccountDoesNotHaveDefaultBrokerageCode',
            }
        },
        OrderPadFieldStatusReasonDescription_NotManualBrokerageCode: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotManualBrokerageCode, translations: {
                en: 'NotManualBrokerageCode',
            }
        },
        OrderPadFieldStatusReasonDescription_RetrievingAccount: {
            id: StringId.OrderPadFieldStatusReasonDescription_RetrievingAccount, translations: {
                en: 'Retrieving Account',
            }
        },
        OrderPadFieldStatusReasonDescription_BrokerageScheduleDataItemNotReady: {
            id: StringId.OrderPadFieldStatusReasonDescription_BrokerageScheduleDataItemNotReady, translations: {
                en: 'BrokerageScheduleDataItemNotReady',
            }
        },
        OrderPadFieldStatusReasonDescription_BrokerageCodeListNotReady: {
            id: StringId.OrderPadFieldStatusReasonDescription_BrokerageCodeListNotReady, translations: {
                en: 'BrokerageCodeListNotReady',
            }
        },
        OrderPadFieldStatusReasonDescription_BrokerageCodeNotInSchedule: {
            id: StringId.OrderPadFieldStatusReasonDescription_BrokerageCodeNotInSchedule, translations: {
                en: 'BrokerageCodeNotInSchedule',
            }
        },
        OrderPadFieldStatusReasonDescription_ForceWorkOrder: {
            id: StringId.OrderPadFieldStatusReasonDescription_ForceWorkOrder, translations: {
                en: 'ForceWorkOrder',
            }
        },
        OrderPadFieldStatusReasonDescription_NotLimitOrderType: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotLimitOrderType, translations: {
                en: 'NotLimitOrderType',
            }
        },
        OrderPadFieldStatusReasonDescription_MarketAndStopOrderTypeAreAlwaysFillOrKill: {
            id: StringId.OrderPadFieldStatusReasonDescription_MarketAndStopOrderTypeAreAlwaysFillOrKill, translations: {
                en: 'MarketAndStopOrderTypeAreAlwaysFillOrKill',
            }
        },
        OrderPadFieldStatusReasonDescription_RoaDeclarationDefinitionsDataItemNotReady: {
            id: StringId.OrderPadFieldStatusReasonDescription_RoaDeclarationDefinitionsDataItemNotReady, translations: {
                en: 'RoaDeclarationDefinitionsDataItemNotReady',
            }
        },
        OrderPadFieldStatusReasonDescription_PriceNotOnStep: {
            id: StringId.OrderPadFieldStatusReasonDescription_PriceNotOnStep, translations: {
                en: 'PriceNotOnStep',
            }
        },
        OrderPadFieldStatusReasonDescription_NotRoaEnabled: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotRoaEnabled, translations: {
                en: 'NotRoaEnabled',
            }
        },
        OrderPadFieldStatusReasonDescription_RoaNoAdvice: {
            id: StringId.OrderPadFieldStatusReasonDescription_RoaNoAdvice, translations: {
                en: 'RoaNoAdvice',
            }
        },
        OrderPadFieldStatusReasonDescription_IvemId: {
            id: StringId.OrderPadFieldStatusReasonDescription_IvemId, translations: {
                en: 'IvemId',
            }
        },
        OrderPadFieldStatusReasonDescription_TriggerType: {
            id: StringId.OrderPadFieldStatusReasonDescription_TriggerType, translations: {
                en: 'TriggerType',
            }
        },
        OrderPadFieldStatusReasonDescription_TriggerTypeNotDefined: {
            id: StringId.OrderPadFieldStatusReasonDescription_TriggerTypeNotDefined, translations: {
                en: 'Trigger type not defined',
            }
        },
        OrderPadFieldStatusReasonDescription_ImmediateTriggerType: {
            id: StringId.OrderPadFieldStatusReasonDescription_ImmediateTriggerType, translations: {
                en: 'Immediate trigger type',
            }
        },
        OrderPadFieldStatusReasonDescription_SymbolPriceStepSegmentsDataItemNotReady: {
            id: StringId.OrderPadFieldStatusReasonDescription_SymbolPriceStepSegmentsDataItemNotReady, translations: {
                en: 'SymbolPriceStepSegmentsDataItemNotReady',
            }
        },
        OrderPadFieldStatusReasonDescription_LeafSymbolSourceNotSupported: {
            id: StringId.OrderPadFieldStatusReasonDescription_LeafSymbolSourceNotSupported, translations: {
                en: 'LeafSymbolSourceNotSupported',
            }
        },
        OrderPadFieldStatusReasonDescription_RootSymbolSourceNotSupported: {
            id: StringId.OrderPadFieldStatusReasonDescription_RootSymbolSourceNotSupported, translations: {
                en: 'RootSymbolSourceNotSupported',
            }
        },
        OrderPadFieldStatusReasonDescription_SymbolsNotAvailable: {
            id: StringId.OrderPadFieldStatusReasonDescription_SymbolsNotAvailable, translations: {
                en: 'SymbolsNotAvailable',
            }
        },
        OrderPadFieldStatusReasonDescription_RetrievingSymbolDetail: {
            id: StringId.OrderPadFieldStatusReasonDescription_RetrievingSymbolDetail, translations: {
                en: 'Retrieving Symbol Information',
            }
        },
        OrderPadFieldStatusReasonDescription_RetrieveSymbolDetailError: {
            id: StringId.OrderPadFieldStatusReasonDescription_RetrieveSymbolDetailError, translations: {
                en: 'Error Retrieving Symbol Information',
            }
        },
        OrderPadFieldStatusReasonDescription_SymbolNotOk: {
            id: StringId.OrderPadFieldStatusReasonDescription_SymbolNotOk, translations: {
                en: 'Symbol not Ok',
            }
        },
        OrderPadFieldStatusReasonDescription_RetrievePriceStepperError: {
            id: StringId.OrderPadFieldStatusReasonDescription_RetrievePriceStepperError, translations: {
                en: 'Error retrieving Price Stepper',
            }
        },
        OrderPadFieldStatusReasonDescription_RetrievingPriceStepper: {
            id: StringId.OrderPadFieldStatusReasonDescription_RetrievingPriceStepper, translations: {
                en: 'Retrieving Price Stepper',
            }
        },
        OrderPadFieldStatusReasonDescription_PriceOrSegmentsNotAvailable: {
            id: StringId.OrderPadFieldStatusReasonDescription_PriceOrSegmentsNotAvailable, translations: {
                en: 'PriceOrSegmentsNotAvailable',
            }
        },
        OrderPadFieldStatusReasonDescription_TradingNotPermissioned: {
            id: StringId.OrderPadFieldStatusReasonDescription_TradingNotPermissioned, translations: {
                en: 'Trading is not permissioned',
            }
        },
        OrderPadFieldStatusReasonDescription_AsxOrderAlgosNotPermissioned: {
            id: StringId.OrderPadFieldStatusReasonDescription_AsxOrderAlgosNotPermissioned, translations: {
                en: 'AsxOrderAlgosNotPermissioned',
            }
        },
        OrderPadFieldStatusReasonDescription_StopOrderRequestsNotPermissioned: {
            id: StringId.OrderPadFieldStatusReasonDescription_StopOrderRequestsNotPermissioned, translations: {
                en: 'Conditional order requests are not permissioned',
            }
        },
        OrderPadFieldStatusReasonDescription_ProductIdentificationType: {
            id: StringId.OrderPadFieldStatusReasonDescription_ProductIdentificationType, translations: {
                en: 'Product identification type',
            }
        },
        OrderPadFieldStatusReasonDescription_NotUsedInTmc: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotUsedInTmc, translations: {
                en: 'NotUsedInTmc',
            }
        },
        OrderPadFieldStatusReasonDescription_TmcOnlySupportNewRequestType: {
            id: StringId.OrderPadFieldStatusReasonDescription_TmcOnlySupportNewRequestType, translations: {
                en: 'TmcOnlySupportNewRequestType',
            }
        },
        OrderPadFieldStatusReasonDescription_OnlyUsedInTmc: {
            id: StringId.OrderPadFieldStatusReasonDescription_OnlyUsedInTmc, translations: {
                en: 'OnlyUsedInTmc',
            }
        },
        OrderPadFieldStatusReasonDescription_TmcLegCountNotSpecified: {
            id: StringId.OrderPadFieldStatusReasonDescription_TmcLegCountNotSpecified, translations: {
                en: 'TmcLegCountNotSpecified',
            }
        },
        OrderPadFieldStatusReasonDescription_BeyondTmcLegCount: {
            id: StringId.OrderPadFieldStatusReasonDescription_BeyondTmcLegCount, translations: {
                en: 'BeyondTmcLegCount',
            }
        },
        OrderPadFieldStatusReasonDescription_OrderTypeNotSpecified: {
            id: StringId.OrderPadFieldStatusReasonDescription_OrderTypeNotSpecified, translations: {
                en: 'OrderTypeNotSpecified',
            }
        },
        OrderPadFieldStatusReasonDescription_AlgoNotSpecified: {
            id: StringId.OrderPadFieldStatusReasonDescription_AlgoNotSpecified, translations: {
                en: 'AlgoNotSpecified',
            }
        },
        OrderPadFieldStatusReasonDescription_ValueMustNotExceedMaxTmcLegRatio: {
            id: StringId.OrderPadFieldStatusReasonDescription_ValueMustNotExceedMaxTmcLegRatio, translations: {
                en: 'ValueMustNotExceedMaxTmcLegRatio',
            }
        },
        OrderPadFieldStatusReasonDescription_NotAllTmcLegRatiosValid: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotAllTmcLegRatiosValid, translations: {
                en: 'NotAllTmcLegRatiosValid',
            }
        },
        OrderPadFieldStatusReasonDescription_TmcMaxLegRatioCommonFactorNotOne: {
            id: StringId.OrderPadFieldStatusReasonDescription_TmcMaxLegRatioCommonFactorNotOne, translations: {
                en: 'TmcMaxLegRatioCommonFactorNotOne',
            }
        },
        OrderPadFieldStatusReasonDescription_OnlySellStopAllowed: {
            id: StringId.OrderPadFieldStatusReasonDescription_OnlySellStopAllowed, translations: {
                en: 'OnlySellStopAllowed',
            }
        },
        OrderPadFieldStatusReasonDescription_NotSupportedByOrderType: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotSupportedByOrderType, translations: {
                en: 'Not supported by Order Type',
            }
        },
        OrderPadFieldStatusReasonDescription_NotSupportedBySymbol: {
            id: StringId.OrderPadFieldStatusReasonDescription_NotSupportedBySymbol, translations: {
                en: 'Not supported by Symbol',
            }
        },
        OrderPadFieldStatusReasonDescription_TimeInForceNotSpecified: {
            id: StringId.OrderPadFieldStatusReasonDescription_TimeInForceNotSpecified, translations: {
                en: 'TimeInForceNotSpecified',
            }
        },
        OrderPadFieldStatusReasonDescription_TodayOrFutureDateRequired: {
            id: StringId.OrderPadFieldStatusReasonDescription_TodayOrFutureDateRequired, translations: {
                en: 'Today or future date required',
            }
        },
        OrderPadFieldStatusReasonDescription_TimeInForceDoesNotRequireDate: {
            id: StringId.OrderPadFieldStatusReasonDescription_TimeInForceDoesNotRequireDate, translations: {
                en: 'Time in Force value does not require a Date',
            }
        },
        OrderPadFieldStatusReasonDescription_AsxEtoTmcSymbolMissingUnderlyingIsIndex: {
            id: StringId.OrderPadFieldStatusReasonDescription_AsxEtoTmcSymbolMissingUnderlyingIsIndex, translations: {
                en: 'AsxEtoTmcSymbolMissingUnderlyingIsIndex',
            }
        },
        OrderPadFieldStatusReasonDescription_SymbolHasNoTradingMarkets: {
            id: StringId.OrderPadFieldStatusReasonDescription_SymbolHasNoTradingMarkets, translations: {
                en: 'Symbol has no trading markets',
            }
        },
        OrderPadFieldStatusReasonDescription_SymbolDoesNotSupportTradingMarket: {
            id: StringId.OrderPadFieldStatusReasonDescription_SymbolDoesNotSupportTradingMarket, translations: {
                en: 'Symbol does not support trading market',
            }
        },
        OrderPadFieldStatusReasonDescription_TmcNotInAsxTmcMarket: {
            id: StringId.OrderPadFieldStatusReasonDescription_TmcNotInAsxTmcMarket, translations: {
                en: 'TmcNotInAsxTmcMarket',
            }
        },
        OrderPadFieldStatusReasonDescription_Snapshot: {
            id: StringId.OrderPadFieldStatusReasonDescription_Snapshot, translations: {
                en: 'Snapshot',
            }
        },
        OrderPadFieldStatusReasonDescription_ValueOutOfRange: {
            id: StringId.OrderPadFieldStatusReasonDescription_ValueOutOfRange, translations: {
                en: 'Value out of range',
            }
        },
        OrderPadFieldStatusReasonDescription_MyxSymbolIsMissingBoardLotSize: {
            id: StringId.OrderPadFieldStatusReasonDescription_MyxSymbolIsMissingBoardLotSize, translations: {
                en: 'MYX Symbol is missing board lot size',
            }
        },
        OrderPadFieldStatusReasonDescription_SideNotValid: {
            id: StringId.OrderPadFieldStatusReasonDescription_SideNotValid, translations: {
                en: 'Side is not valid',
            }
        },
        OrderPadFieldStatusReasonDescription_BuyNotPermissioned: {
            id: StringId.OrderPadFieldStatusReasonDescription_BuyNotPermissioned, translations: {
                en: 'Buy is not permissioned',
            }
        },
        OrderPadFieldStatusReasonDescription_SellNotPermissioned: {
            id: StringId.OrderPadFieldStatusReasonDescription_SellNotPermissioned, translations: {
                en: 'Sell is not permissioned',
            }
        },
        OrderPadFieldStatusReasonDescription_QuantityNotAMultiple: {
            id: StringId.OrderPadFieldStatusReasonDescription_QuantityNotAMultiple, translations: {
                en: 'Quantity is not a valid multiple',
            }
        },
        OrderPadFieldStatusReasonDescription_OrderNotFound: {
            id: StringId.OrderPadFieldStatusReasonDescription_OrderNotFound, translations: {
                en: 'Order not found',
            }
        },
        OrderPadFieldStatusReasonDescription_OrderCannotBeAmended: {
            id: StringId.OrderPadFieldStatusReasonDescription_OrderCannotBeAmended, translations: {
                en: 'Order cannot be amended',
            }
        },
        OrderPadFieldStatusReasonDescription_OrderCannotBeCancelled: {
            id: StringId.OrderPadFieldStatusReasonDescription_OrderCannotBeCancelled, translations: {
                en: 'Order cannot be cancelled',
            }
        },
        OrderPadFieldStatusReasonDescription_OrderCannotBeMoved: {
            id: StringId.OrderPadFieldStatusReasonDescription_OrderCannotBeMoved, translations: {
                en: 'Order cannot be moved',
            }
        },
        OrderTriggerTypeDisplay_Immediate: {
            id: StringId.OrderTriggerTypeDisplay_Immediate, translations: {
                en: 'Immediate',
            }
        },
        OrderTriggerTypeDisplay_Price: {
            id: StringId.OrderTriggerTypeDisplay_Price, translations: {
                en: 'Price',
            }
        },
        OrderTriggerTypeDisplay_TrailingPrice: {
            id: StringId.OrderTriggerTypeDisplay_TrailingPrice, translations: {
                en: 'Trailing Price',
            }
        },
        OrderTriggerTypeDisplay_PercentageTrailingPrice: {
            id: StringId.OrderTriggerTypeDisplay_PercentageTrailingPrice, translations: {
                en: '% Trailing Price',
            }
        },
        OrderTriggerTypeDisplay_Overnight: {
            id: StringId.OrderTriggerTypeDisplay_Overnight, translations: {
                en: 'Overnight',
            }
        },
        OrderTriggerTypeAbbreviation_Immediate: {
            id: StringId.OrderTriggerTypeAbbreviation_Immediate, translations: {
                en: 'Immediate',
            }
        },
        OrderTriggerTypeAbbreviation_Price: {
            id: StringId.OrderTriggerTypeAbbreviation_Price, translations: {
                en: 'Price',
            }
        },
        OrderTriggerTypeAbbreviation_TrailingPrice: {
            id: StringId.OrderTriggerTypeAbbreviation_TrailingPrice, translations: {
                en: 'Trailing',
            }
        },
        OrderTriggerTypeAbbreviation_PercentageTrailingPrice: {
            id: StringId.OrderTriggerTypeAbbreviation_PercentageTrailingPrice, translations: {
                en: '% Trailing',
            }
        },
        OrderTriggerTypeAbbreviation_Overnight: {
            id: StringId.OrderTriggerTypeAbbreviation_Overnight, translations: {
                en: 'Overnight',
            }
        },
        OrderRequestTypeDisplay_Place: {
            id: StringId.OrderRequestTypeDisplay_Place, translations: {
                en: 'Place',
            }
        },
        OrderRequestTypeDisplay_Amend: {
            id: StringId.OrderRequestTypeDisplay_Amend, translations: {
                en: 'Amend',
            }
        },
        OrderRequestTypeDisplay_Cancel: {
            id: StringId.OrderRequestTypeDisplay_Cancel, translations: {
                en: 'Cancel',
            }
        },
        OrderRequestTypeDisplay_Move: {
            id: StringId.OrderRequestTypeDisplay_Move, translations: {
                en: 'Move',
            }
        },
        OrderRequestResultDisplay_Success: {
            id: StringId.OrderRequestResultDisplay_Success, translations: {
                en: 'Success',
            }
        },
        OrderRequestResultDisplay_Error: {
            id: StringId.OrderRequestResultDisplay_Error, translations: {
                en: 'Error',
            }
        },
        OrderRequestResultDisplay_Incomplete: {
            id: StringId.OrderRequestResultDisplay_Incomplete, translations: {
                en: 'Incomplete',
            }
        },
        OrderRequestResultDisplay_Invalid: {
            id: StringId.OrderRequestResultDisplay_Invalid, translations: {
                en: 'Invalid',
            }
        },
        OrderRequestResultDisplay_Rejected: {
            id: StringId.OrderRequestResultDisplay_Rejected, translations: {
                en: 'Rejected',
            }
        },
        OrderRequestErrorCodeDisplay_Unknown: {
            id: StringId.OrderRequestErrorCodeDisplay_Unknown, translations: {
                en: '<Error Description not available>',
            }
        },
        OrderRequestErrorCodeDisplay_Account: {
            id: StringId.OrderRequestErrorCodeDisplay_Account, translations: {
                en: 'The Account supplied does not exist',
            }
        },
        OrderRequestErrorCodeDisplay_Account_DailyNet: {
            id: StringId.OrderRequestErrorCodeDisplay_Account_DailyNet, translations: {
                en: 'The Account daily net value would be exceeded',
            }
        },
        OrderRequestErrorCodeDisplay_Account_DailyGross: {
            id: StringId.OrderRequestErrorCodeDisplay_Account_DailyGross, translations: {
                en: 'The Account daily gross value would be exceeded',
            }
        },
        OrderRequestErrorCodeDisplay_Authority: {
            id: StringId.OrderRequestErrorCodeDisplay_Authority, translations: {
                en: 'The current user does not have permission to trade',
            }
        },
        OrderRequestErrorCodeDisplay_Connection: {
            id: StringId.OrderRequestErrorCodeDisplay_Connection, translations: {
                en: 'Trading requires a secure connection',
            }
        },
        OrderRequestErrorCodeDisplay_Details: {
            id: StringId.OrderRequestErrorCodeDisplay_Details, translations: {
                en: 'No order details were provided',
            }
        },
        OrderRequestErrorCodeDisplay_Error: {
            id: StringId.OrderRequestErrorCodeDisplay_Error, translations: {
                en: 'An undefined server error occurred',
            }
        },
        OrderRequestErrorCodeDisplay_Exchange: {
            id: StringId.OrderRequestErrorCodeDisplay_Exchange, translations: {
                en: 'The exchange supplied is invalid or does not exist',
            }
        },
        OrderRequestErrorCodeDisplay_Internal: {
            id: StringId.OrderRequestErrorCodeDisplay_Internal, translations: {
                en: 'A server internal error has occurred',
            }
        },
        OrderRequestErrorCodeDisplay_Internal_NotFound: {
            id: StringId.OrderRequestErrorCodeDisplay_Internal_NotFound, translations: {
                en: 'A server internal error has occurred',
            }
        },
        OrderRequestErrorCodeDisplay_Order: {
            id: StringId.OrderRequestErrorCodeDisplay_Order, translations: {
                en: 'The given Order ID for a cancel or amend is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_Operation: {
            id: StringId.OrderRequestErrorCodeDisplay_Operation, translations: {
                en: 'The operation is not supported for this Order',
            }
        },
        OrderRequestErrorCodeDisplay_Retry: {
            id: StringId.OrderRequestErrorCodeDisplay_Retry, translations: {
                en: 'A temporary error occurred, please retry the request',
            }
        },
        OrderRequestErrorCodeDisplay_Route: {
            id: StringId.OrderRequestErrorCodeDisplay_Route, translations: {
                en: 'A routing algorithm was not supplied',
            }
        },
        OrderRequestErrorCodeDisplay_Route_Algorithm: {
            id: StringId.OrderRequestErrorCodeDisplay_Route_Algorithm, translations: {
                en: 'The supplied routing algorithm does not exist',
            }
        },
        OrderRequestErrorCodeDisplay_Route_Market: {
            id: StringId.OrderRequestErrorCodeDisplay_Route_Market, translations: {
                en: 'The supplied Trading Market was invalid or does not exist',
            }
        },
        OrderRequestErrorCodeDisplay_Route_Symbol: {
            id: StringId.OrderRequestErrorCodeDisplay_Route_Symbol, translations: {
                en: 'The target Symbol cannot be routed to the target Trading Market',
            }
        },
        OrderRequestErrorCodeDisplay_Status: {
            id: StringId.OrderRequestErrorCodeDisplay_Status, translations: {
                en: 'The order is not in a state where it can be changed',
            }
        },
        OrderRequestErrorCodeDisplay_Style: {
            id: StringId.OrderRequestErrorCodeDisplay_Style, translations: {
                en: 'The style of Order must be provided.If amending, it must also match the Order being amended',
            }
        },
        OrderRequestErrorCodeDisplay_Submitted: {
            id: StringId.OrderRequestErrorCodeDisplay_Submitted, translations: {
                en: 'A fault occurred after the Order was submitted to the Exchange.The Order may have been successfully processed.Please check the Orders subscription',
            }
        },
        OrderRequestErrorCodeDisplay_Symbol: {
            id: StringId.OrderRequestErrorCodeDisplay_Symbol, translations: {
                en: 'The selected symbol is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_Symbol_Authority: {
            id: StringId.OrderRequestErrorCodeDisplay_Symbol_Authority, translations: {
                en: 'The current use does not have permission to trade the selected symbol',
            }
        },
        OrderRequestErrorCodeDisplay_Symbol_Status: {
            id: StringId.OrderRequestErrorCodeDisplay_Symbol_Status, translations: {
                en: 'The target symbol is not in a state where the Order operation is supported',
            }
        },
        OrderRequestErrorCodeDisplay_TotalValue_Balance: {
            id: StringId.OrderRequestErrorCodeDisplay_TotalValue_Balance, translations: {
                en: 'Not enough funds to cover this Order',
            }
        },
        OrderRequestErrorCodeDisplay_TotalValue_Maximum: {
            id: StringId.OrderRequestErrorCodeDisplay_TotalValue_Maximum, translations: {
                en: 'Greater than the maximum allowed value',
            }
        },
        OrderRequestErrorCodeDisplay_ExpiryDate: {
            id: StringId.OrderRequestErrorCodeDisplay_ExpiryDate, translations: {
                en: 'The expiry date is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_HiddenQuantity: {
            id: StringId.OrderRequestErrorCodeDisplay_HiddenQuantity, translations: {
                en: 'The hidden quantity is out of range or invalid',
            }
        },
        OrderRequestErrorCodeDisplay_HiddenQuantity_Symbol: {
            id: StringId.OrderRequestErrorCodeDisplay_HiddenQuantity_Symbol, translations: {
                en: 'A hidden quantity is not supported by this Symbol',
            }
        },
        OrderRequestErrorCodeDisplay_LimitPrice: {
            id: StringId.OrderRequestErrorCodeDisplay_LimitPrice, translations: {
                en: 'The limit price is out of range or invalid',
            }
        },
        OrderRequestErrorCodeDisplay_LimitPrice_Distance: {
            id: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Distance, translations: {
                en: 'The limit price is too far from the market',
            }
        },
        OrderRequestErrorCodeDisplay_LimitPrice_Given: {
            id: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Given, translations: {
                en: 'The limit price must be empty for this Order Type',
            }
        },
        OrderRequestErrorCodeDisplay_LimitPrice_Maximum: {
            id: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Maximum, translations: {
                en: 'The limit price is above the maximum for this Symbol',
            }
        },
        OrderRequestErrorCodeDisplay_LimitPrice_Missing: {
            id: StringId.OrderRequestErrorCodeDisplay_LimitPrice_Missing, translations: {
                en: 'The limit price is required for this Order Type',
            }
        },
        OrderRequestErrorCodeDisplay_MinimumQuantity: {
            id: StringId.OrderRequestErrorCodeDisplay_MinimumQuantity, translations: {
                en: 'The minimum quantity is out of range or invalid',
            }
        },
        OrderRequestErrorCodeDisplay_MinimumQuantity_Symbol: {
            id: StringId.OrderRequestErrorCodeDisplay_MinimumQuantity_Symbol, translations: {
                en: 'A minimum quantity is not supported by this Symbol',
            }
        },
        OrderRequestErrorCodeDisplay_OrderType: {
            id: StringId.OrderRequestErrorCodeDisplay_OrderType, translations: {
                en: 'The order type is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_OrderType_Market: {
            id: StringId.OrderRequestErrorCodeDisplay_OrderType_Market, translations: {
                en: 'The order type is not supported by the Trading Market',
            }
        },
        OrderRequestErrorCodeDisplay_OrderType_Status: {
            id: StringId.OrderRequestErrorCodeDisplay_OrderType_Status, translations: {
                en: 'The order type is not supported in this Trading State',
            }
        },
        OrderRequestErrorCodeDisplay_OrderType_Symbol: {
            id: StringId.OrderRequestErrorCodeDisplay_OrderType_Symbol, translations: {
                en: 'The order type is not supported by this Symbol',
            }
        },
        OrderRequestErrorCodeDisplay_Side: {
            id: StringId.OrderRequestErrorCodeDisplay_Side, translations: {
                en: 'The side of the Market is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_Side_Maximum: {
            id: StringId.OrderRequestErrorCodeDisplay_Side_Maximum, translations: {
                en: 'There are too many open orders on the market on this side',
            }
        },
        OrderRequestErrorCodeDisplay_TotalQuantity: {
            id: StringId.OrderRequestErrorCodeDisplay_TotalQuantity, translations: {
                en: 'The visible and hidden quantities are both zero',
            }
        },
        OrderRequestErrorCodeDisplay_TotalQuantity_Minimum: {
            id: StringId.OrderRequestErrorCodeDisplay_TotalQuantity_Minimum, translations: {
                en: 'The order is below the minimum value',
            }
        },
        OrderRequestErrorCodeDisplay_TotalQuantity_Holdings: {
            id: StringId.OrderRequestErrorCodeDisplay_TotalQuantity_Holdings, translations: {
                en: 'The sell order is greater than your available holdings',
            }
        },
        OrderRequestErrorCodeDisplay_Validity: {
            id: StringId.OrderRequestErrorCodeDisplay_Validity, translations: {
                en: 'The validity period is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_Validity_Symbol: {
            id: StringId.OrderRequestErrorCodeDisplay_Validity_Symbol, translations: {
                en: 'The validity period is not supported by this Symbol',
            }
        },
        OrderRequestErrorCodeDisplay_VisibleQuantity: {
            id: StringId.OrderRequestErrorCodeDisplay_VisibleQuantity, translations: {
                en: 'The visible quantity is out of range or invalid',
            }
        },
        OrderRequestErrorCodeDisplay_TotalQuantity_Maximum: {
            id: StringId.OrderRequestErrorCodeDisplay_TotalQuantity_Maximum, translations: {
                en: 'The total quantity is above the maximum allowed',
            }
        },
        OrderRequestErrorCodeDisplay_UnitType: {
            id: StringId.OrderRequestErrorCodeDisplay_UnitType, translations: {
                en: 'The unit type is invalid',
            }
        },
        OrderRequestErrorCodeDisplay_UnitAmount: {
            id: StringId.OrderRequestErrorCodeDisplay_UnitAmount, translations: {
                en: 'The unit amount is out of range',
            }
        },
        OrderRequestErrorCodeDisplay_Currency: {
            id: StringId.OrderRequestErrorCodeDisplay_Currency, translations: {
                en: 'A valid currency must be provided for this Unit Type',
            }
        },
        OrderRequestErrorCodeDisplay_Flags_PDS: {
            id: StringId.OrderRequestErrorCodeDisplay_Flags_PDS, translations: {
                en: 'The Flag "PDS" must be set',
            }
        },
        OrderPadAccountCaption: {
            id: StringId.OrderPadAccountCaption, translations: {
                en: 'Account',
            }
        },
        OrderPadSideTitle_Buy: {
            id: StringId.OrderPadSideTitle_Buy, translations: {
                en: 'Buy',
            }
        },
        OrderPadSideTitle_Sell: {
            id: StringId.OrderPadSideTitle_Sell, translations: {
                en: 'Sell',
            }
        },
        OrderPadSideTitle_IntraDayShortSell: {
            id: StringId.OrderPadSideTitle_IntraDayShortSell, translations: {
                en: 'Intra day short sell',
            }
        },
        OrderPadSideTitle_RegulatedShortSell: {
            id: StringId.OrderPadSideTitle_RegulatedShortSell, translations: {
                en: 'Regulated short sell',
            }
        },
        OrderPadSideTitle_ProprietaryShortSell: {
            id: StringId.OrderPadSideTitle_ProprietaryShortSell, translations: {
                en: 'Proprietary short sell',
            }
        },
        OrderPadSideTitle_ProprietaryDayTrade: {
            id: StringId.OrderPadSideTitle_ProprietaryDayTrade, translations: {
                en: 'Proprietary day trade',
            }
        },
        OrderPadSideTitle: {
            id: StringId.OrderPadSideTitle, translations: {
                en: 'Select (extended) side',
            }
        },
        OrderPadSideCaption: {
            id: StringId.OrderPadSideCaption, translations: {
                en: 'Xtd Side',
            }
        },
        OrderPadSymbolTitle: {
            id: StringId.OrderPadSymbolTitle, translations: {
                en: 'Select symbol',
            }
        },
        OrderPadSymbolCaption: {
            id: StringId.OrderPadSymbolCaption, translations: {
                en: 'Symbol',
            }
        },
        OrderPadRouteTitle: {
            id: StringId.OrderPadRouteTitle, translations: {
                en: 'OrderPadRouteTitle',
            }
        },
        OrderPadTotalQuantityTitle: {
            id: StringId.OrderPadTotalQuantityTitle, translations: {
                en: 'Total quantity',
            }
        },
        OrderPadTotalQuantityCaption: {
            id: StringId.OrderPadTotalQuantityCaption, translations: {
                en: 'Quantity',
            }
        },
        OrderPadOrderTypeTitle_Market: {
            id: StringId.OrderPadOrderTypeTitle_Market, translations: {
                en: 'Market',
            }
        },
        OrderPadOrderTypeTitle_MarketToLimit: {
            id: StringId.OrderPadOrderTypeTitle_MarketToLimit, translations: {
                en: 'Market to Limit',
            }
        },
        OrderPadOrderTypeTitle_Limit: {
            id: StringId.OrderPadOrderTypeTitle_Limit, translations: {
                en: 'Limit',
            }
        },
        OrderPadOrderTypeTitle_MarketAtBest: {
            id: StringId.OrderPadOrderTypeTitle_MarketAtBest, translations: {
                en: 'Market at Best',
            }
        },
        OrderPadOrderTypeTitle: {
            id: StringId.OrderPadOrderTypeTitle, translations: {
                en: 'Order type',
            }
        },
        OrderPadOrderTypeCaption: {
            id: StringId.OrderPadOrderTypeCaption, translations: {
                en: 'Type',
            }
        },
        OrderPadLimitValueTitle: {
            id: StringId.OrderPadLimitValueTitle, translations: {
                en: 'Order can only trade at specified price',
            }
        },
        OrderPadLimitValueCaption: {
            id: StringId.OrderPadLimitValueCaption, translations: {
                en: 'Price',
            }
        },
        OrderPadLimitUnitTitle: {
            id: StringId.OrderPadLimitUnitTitle, translations: {
                en: 'Price units',
            }
        },
        OrderPadTriggerTypeTitle_Immediate: {
            id: StringId.OrderPadTriggerTypeTitle_Immediate, translations: {
                en: 'Order is made active in the market immediately',
            }
        },
        OrderPadTriggerTypeTitle_Price: {
            id: StringId.OrderPadTriggerTypeTitle_Price, translations: {
                en: 'Order is made active in the market when the price of its symbol reaches a specified level',
            }
        },
        OrderPadTriggerTypeTitle_TrailingPrice: {
            id: StringId.OrderPadTriggerTypeTitle_TrailingPrice, translations: {
                en: 'Order is made active in the market when the price of its symbol recedes a specified amount',
            }
        },
        OrderPadTriggerTypeTitle_PercentageTrailingPrice: {
            id: StringId.OrderPadTriggerTypeTitle_PercentageTrailingPrice, translations: {
                en: 'Order is made active in the market when the price of its symbol recedes a specified percentage amount',
            }
        },
        OrderPadTriggerTypeTitle_Overnight: {
            id: StringId.OrderPadTriggerTypeTitle_Overnight, translations: {
                en: 'Order is made active in the market on the next trading day',
            }
        },
        OrderPadTriggerTitle: {
            id: StringId.OrderPadTriggerTitle, translations: {
                en: 'Condition for when order is made active in the market',
            }
        },
        OrderPadTriggerCaption: {
            id: StringId.OrderPadTriggerCaption, translations: {
                en: 'Trigger',
            }
        },

        OrderPadTriggerValueTitle: {
            id: StringId.OrderPadTriggerValueTitle, translations: {
                en: 'Value at which order should trigger',
            }
        },
        OrderPadTriggerValueCaption: {
            id: StringId.OrderPadTriggerValueCaption, translations: {
                en: 'Value',
            }
        },
        OrderPadTriggerFieldTitle_Last: {
            id: StringId.OrderPadTriggerFieldTitle_Last, translations: {
                en: 'Use last price to trigger order',
            }
        },
        OrderPadTriggerFieldTitle_BestBid: {
            id: StringId.OrderPadTriggerFieldTitle_BestBid, translations: {
                en: 'Use best bid price to trigger order',
            }
        },
        OrderPadTriggerFieldTitle_BestAsk: {
            id: StringId.OrderPadTriggerFieldTitle_BestAsk, translations: {
                en: 'Use best ask price to trigger order',
            }
        },
        OrderPadTriggerFieldTitle: {
            id: StringId.OrderPadTriggerFieldTitle, translations: {
                en: 'Security price field used to trigger order',
            }
        },
        OrderPadTriggerFieldCaption: {
            id: StringId.OrderPadTriggerFieldCaption, translations: {
                en: 'Price Field',
            }
        },
        OrderApiTriggerMovementTitle_None: {
            id: StringId.OrderApiTriggerMovementTitle_None, translations: {
                en: 'Trigger on any/none price movement',
            }
        },
        OrderApiTriggerMovementTitle_Up: {
            id: StringId.OrderApiTriggerMovementTitle_Up, translations: {
                en: 'Trigger on upwards price movement',
            }
        },
        OrderApiTriggerMovementTitle_Down: {
            id: StringId.OrderApiTriggerMovementTitle_Down, translations: {
                en: 'Trigger on downwards price movement',
            }
        },
        OrderPadTriggerMovementTitle: {
            id: StringId.OrderPadTriggerMovementTitle, translations: {
                en: 'Price movement direction to trigger an order',
            }
        },
        OrderPadTriggerMovementCaption: {
            id: StringId.OrderPadTriggerMovementCaption, translations: {
                en: 'Movement',
            }
        },
        OrderPadTimeInForceTitle_Day: {
            id: StringId.OrderPadTimeInForceTitle_Day, translations: {
                en: 'Order is valid for current trading day',
            }
        },
        OrderPadTimeInForceTitle_GoodTillCancel: {
            id: StringId.OrderPadTimeInForceTitle_GoodTillCancel, translations: {
                en: 'Order is valid until cancelled',
            }
        },
        OrderPadTimeInForceTitle_AtTheOpening: {
            id: StringId.OrderPadTimeInForceTitle_AtTheOpening, translations: {
                en: 'Order is only valid when the market opens',
            }
        },
        OrderPadTimeInForceTitle_FillAndKill: {
            id: StringId.OrderPadTimeInForceTitle_FillAndKill, translations: {
                en: 'Fill an order as much as possible immediately then cancel order',
            }
        },
        OrderPadTimeInForceTitle_FillOrKill: {
            id: StringId.OrderPadTimeInForceTitle_FillOrKill, translations: {
                en: 'Fully fill an order immediately or cancel it',
            }
        },
        OrderPadTimeInForceTitle_AllOrNone: {
            id: StringId.OrderPadTimeInForceTitle_AllOrNone, translations: {
                en: 'Order cannot be partially filled',
            }
        },
        OrderPadTimeInForceTitle_GoodTillCrossing: {
            id: StringId.OrderPadTimeInForceTitle_GoodTillCrossing, translations: {
                en: 'Order is valid until auction or crossing phase',
            }
        },
        OrderPadTimeInForceTitle_GoodTillDate: {
            id: StringId.OrderPadTimeInForceTitle_GoodTillDate, translations: {
                en: 'Order is valid until expiry date',
            }
        },
        OrderPadTimeInForceTitle_AtTheClose: {
            id: StringId.OrderPadTimeInForceTitle_AtTheClose, translations: {
                en: 'Order is only valid when the market closes',
            }
        },
        OrderPadTimeInForceTitle: {
            id: StringId.OrderPadTimeInForceTitle, translations: {
                en: 'When an order is valid',
            }
        },
        OrderPadTimeInForceCaption: {
            id: StringId.OrderPadTimeInForceCaption, translations: {
                en: 'In force',
            }
        },
        OrderPadExpiryDateTitle: {
            id: StringId.OrderPadExpiryDateTitle, translations: {
                en: 'Date until which an order is valid',
            }
        },
        OrderPadExpiryDateCaption: {
            id: StringId.OrderPadExpiryDateCaption, translations: {
                en: 'Expiry Date',
            }
        },
        OrderPadExistingOrderIdTitle: {
            id: StringId.OrderPadExistingOrderIdTitle, translations: {
                en: 'Id of order to be amended or cancelled',
            }
        },
        OrderPadExistingOrderIdCaption: {
            id: StringId.OrderPadExistingOrderIdCaption, translations: {
                en: 'Order Id',
            }
        },
        OrderPadDestinationAccountTitle: {
            id: StringId.OrderPadDestinationAccountTitle, translations: {
                en: 'Account to which an order is to be moved',
            }
        },
        OrderPadDestinationAccountCaption: {
            id: StringId.OrderPadDestinationAccountCaption, translations: {
                en: 'Destination',
            }
        },
        OrderPadErrorsCaption: {
            id: StringId.OrderPadErrorsCaption, translations: {
                en: 'Errors',
            }
        },
        OrderRequest_PrimaryCaption: {
            id: StringId.OrderRequest_PrimaryCaption, translations: {
                en: 'Default pad',
            }
        },
        OrderRequest_PrimaryTitle: {
            id: StringId.OrderRequest_PrimaryTitle, translations: {
                en: 'Default pad for order requests',
            }
        },
        OrderRequest_ReviewZenithMessageActiveCaption: {
            id: StringId.OrderRequest_ReviewZenithMessageActiveCaption, translations: {
                en: 'Zenith',
            }
        },
        OrderRequest_ReviewZenithMessageActiveTitle: {
            id: StringId.OrderRequest_ReviewZenithMessageActiveTitle, translations: {
                en: 'Review Zenith Message to be sent to server (only for diagnostic purposes)',
            }
        },
        OrderRequest_NewCaption: {
            id: StringId.OrderRequest_NewCaption, translations: {
                en: 'New',
            }
        },
        OrderRequest_NewTitle: {
            id: StringId.OrderRequest_NewTitle, translations: {
                en: 'New order request\nHold [Shift] to initialise to previous "Place"\nHold [Ctrl] to initialise as "Amend" for previous Order',
            }
        },
        OrderRequest_NewAmendPossibleFlagChar: {
            id: StringId.OrderRequest_NewAmendPossibleFlagChar, translations: {
                en: 'A',
            }
        },
        OrderRequest_BackCaption: {
            id: StringId.OrderRequest_BackCaption, translations: {
                en: 'Back',
            }
        },
        OrderRequest_BackTitle: {
            id: StringId.OrderRequest_BackTitle, translations: {
                en: 'Back to order pad',
            }
        },
        OrderRequest_ReviewCaption: {
            id: StringId.OrderRequest_ReviewCaption, translations: {
                en: 'Review',
            }
        },
        OrderRequest_ReviewTitle: {
            id: StringId.OrderRequest_ReviewTitle, translations: {
                en: 'Review order request before sending',
            }
        },
        OrderRequest_SendCaption: {
            id: StringId.OrderRequest_SendCaption, translations: {
                en: 'Send',
            }
        },
        OrderRequest_SendTitle: {
            id: StringId.OrderRequest_SendTitle, translations: {
                en: 'Send order request',
            }
        },
        SymbolCache_UnresolvedRequestTimedOut: {
            id: StringId.SymbolCache_UnresolvedRequestTimedOut, translations: {
                en: 'Symbol information server request timed out',
            }
        },
        OrderRequestResultStatusDisplay_Waiting: {
            id: StringId.OrderRequestResultStatusDisplay_Waiting, translations: {
                en: 'Waiting',
            }
        },
        OrderRequestResultStatusDisplay_CommunicateError: {
            id: StringId.OrderRequestResultStatusDisplay_CommunicateError, translations: {
                en: 'Communications Error',
            }
        },
        OrderRequestResultStatusDisplay_Success: {
            id: StringId.OrderRequestResultStatusDisplay_Success, translations: {
                en: 'Success',
            }
        },
        OrderRequestResultStatusDisplay_Error: {
            id: StringId.OrderRequestResultStatusDisplay_Error, translations: {
                en: 'Error',
            }
        },
        OrderRequestResultStatusDisplay_Incomplete: {
            id: StringId.OrderRequestResultStatusDisplay_Incomplete, translations: {
                en: 'Incomplete',
            }
        },
        OrderRequestResultStatusDisplay_Invalid: {
            id: StringId.OrderRequestResultStatusDisplay_Invalid, translations: {
                en: 'Invalid',
            }
        },
        OrderRequestResultStatusDisplay_Rejected: {
            id: StringId.OrderRequestResultStatusDisplay_Rejected, translations: {
                en: 'Rejected',
            }
        },
        OrderRequestResultTitle_Status: {
            id: StringId.OrderRequestResultTitle_Status, translations: {
                en: 'Order request result status',
            }
        },
        OrderRequestResultCaption_Status: {
            id: StringId.OrderRequestResultCaption_Status, translations: {
                en: 'Status',
            }
        },
        OrderRequestResultTitle_OrderId: {
            id: StringId.OrderRequestResultTitle_OrderId, translations: {
                en: 'Order Id',
            }
        },
        OrderRequestResultCaption_OrderId: {
            id: StringId.OrderRequestResultCaption_OrderId, translations: {
                en: 'Order Id',
            }
        },
        OrderRequestResultTitle_Errors: {
            id: StringId.OrderRequestResultTitle_Errors, translations: {
                en: 'Order request errors',
            }
        },
        OrderRequestResultCaption_Errors: {
            id: StringId.OrderRequestResultCaption_Errors, translations: {
                en: 'Errors',
            }
        },
        ColorSelector_HideInPickerCaption: {
            id: StringId.ColorSelector_HideInPickerCaption, translations: {
                en: 'Hide',
            }
        },
        ColorSelector_HideInPickerTitle: {
            id: StringId.ColorSelector_HideInPickerTitle, translations: {
                en: 'Hide in color picker',
            }
        },
        ColorSelector_ItemColorTypeCaption: {
            id: StringId.ColorSelector_ItemColorTypeCaption, translations: {
                en: 'Item color type',
            }
        },
        ColorSelector_ItemColorTypeTitle: {
            id: StringId.ColorSelector_ItemColorTypeTitle, translations: {
                en: 'Item color type',
            }
        },
        ColorSelector_OpaqueCaption: {
            id: StringId.ColorSelector_OpaqueCaption, translations: {
                en: 'Picker',
            }
        },
        ColorSelector_OpaqueTitle: {
            id: StringId.ColorSelector_OpaqueTitle, translations: {
                en: 'Color specified in picker',
            }
        },
        ColorSelector_TransparentCaption: {
            id: StringId.ColorSelector_TransparentCaption, translations: {
                en: 'Transparent',
            }
        },
        ColorSelector_TransparentTitle: {
            id: StringId.ColorSelector_TransparentTitle, translations: {
                en: 'Show underlying element color',
            }
        },
        ColorSelector_UseInheritedCaption: {
            id: StringId.ColorSelector_UseInheritedCaption, translations: {
                en: 'Inherited',
            }
        },
        ColorSelector_UseInheritedTitle: {
            id: StringId.ColorSelector_UseInheritedTitle, translations: {
                en: 'Base or ancestor color. Select this for groups of items to have the same color.',
            }
        },
        ColorSelector_LightenCaption: {
            id: StringId.ColorSelector_LightenCaption, translations: {
                en: 'Lighten',
            }
        },
        ColorSelector_LightenTitle: {
            id: StringId.ColorSelector_LightenTitle, translations: {
                en: 'Lighten',
            }
        },
        ColorSelector_DarkenCaption: {
            id: StringId.ColorSelector_DarkenCaption, translations: {
                en: 'Darken',
            }
        },
        ColorSelector_DarkenTitle: {
            id: StringId.ColorSelector_DarkenTitle, translations: {
                en: 'Darken',
            }
        },
        ColorSelector_BrightenCaption: {
            id: StringId.ColorSelector_BrightenCaption, translations: {
                en: 'Brighten',
            }
        },
        ColorSelector_BrightenTitle: {
            id: StringId.ColorSelector_BrightenTitle, translations: {
                en: 'Brighten',
            }
        },
        ColorSelector_ComplementCaption: {
            id: StringId.ColorSelector_ComplementCaption, translations: {
                en: 'Complement',
            }
        },
        ColorSelector_ComplementTitle: {
            id: StringId.ColorSelector_ComplementTitle, translations: {
                en: 'Complement',
            }
        },
        ColorSelector_SaturateCaption: {
            id: StringId.ColorSelector_SaturateCaption, translations: {
                en: 'Saturate',
            }
        },
        ColorSelector_SaturateTitle: {
            id: StringId.ColorSelector_SaturateTitle, translations: {
                en: 'Saturate',
            }
        },
        ColorSelector_DesaturateCaption: {
            id: StringId.ColorSelector_DesaturateCaption, translations: {
                en: 'Desaturate',
            }
        },
        ColorSelector_DesaturateTitle: {
            id: StringId.ColorSelector_DesaturateTitle, translations: {
                en: 'Desaturate',
            }
        },
        ColorSelector_SpinCaption: {
            id: StringId.ColorSelector_SpinCaption, translations: {
                en: 'Spin',
            }
        },
        ColorSelector_SpinTitle: {
            id: StringId.ColorSelector_SpinTitle, translations: {
                en: 'Spin',
            }
        },
        ColorSelector_CopyCaption: {
            id: StringId.ColorSelector_CopyCaption, translations: {
                en: 'Copy',
            }
        },
        ColorSelector_CopyTitle: {
            id: StringId.ColorSelector_CopyTitle, translations: {
                en: 'Copy',
            }
        },
        ColorSelector_HexCaption: {
            id: StringId.ColorSelector_HexCaption, translations: {
                en: '#',
            }
        },
        ColorSelector_HexTitle: {
            id: StringId.ColorSelector_HexTitle, translations: {
                en: 'Hex color (accepts entry in many color formats)',
            }
        },
        ColorSelector_HueCaption: {
            id: StringId.ColorSelector_HueCaption, translations: {
                en: 'H',
            }
        },
        ColorSelector_HueTitle: {
            id: StringId.ColorSelector_HueTitle, translations: {
                en: 'Hue color component',
            }
        },
        ColorSelector_SaturationCaption: {
            id: StringId.ColorSelector_SaturationCaption, translations: {
                en: 'S',
            }
        },
        ColorSelector_SaturationTitle: {
            id: StringId.ColorSelector_SaturationTitle, translations: {
                en: 'Saturation color component',
            }
        },
        ColorSelector_ValueCaption: {
            id: StringId.ColorSelector_ValueCaption, translations: {
                en: 'V',
            }
        },
        ColorSelector_ValueTitle: {
            id: StringId.ColorSelector_ValueTitle, translations: {
                en: 'Value color component',
            }
        },
        ColorSelector_RedCaption: {
            id: StringId.ColorSelector_RedCaption, translations: {
                en: 'R',
            }
        },
        ColorSelector_RedTitle: {
            id: StringId.ColorSelector_RedTitle, translations: {
                en: 'Red color component',
            }
        },
        ColorSelector_GreenCaption: {
            id: StringId.ColorSelector_GreenCaption, translations: {
                en: 'G',
            }
        },
        ColorSelector_GreenTitle: {
            id: StringId.ColorSelector_GreenTitle, translations: {
                en: 'Green color component',
            }
        },
        ColorSelector_BlueCaption: {
            id: StringId.ColorSelector_BlueCaption, translations: {
                en: 'B',
            }
        },
        ColorSelector_BlueTitle: {
            id: StringId.ColorSelector_BlueTitle, translations: {
                en: 'Blue color component',
            }
        },
        ColorSchemeItemProperties_ReadabilityTitle: {
            id: StringId.ColorSchemeItemProperties_ReadabilityTitle, translations: {
                en: 'Level of readability (0 = poor, 21 = excellent)',
            }
        },
        ColorSchemeItemProperties_ReadabilityCaption: {
            id: StringId.ColorSchemeItemProperties_ReadabilityCaption, translations: {
                en: 'Readability',
            }
        },
        ColorSchemeItemProperties_PickerTypeTitle: {
            id: StringId.ColorSchemeItemProperties_PickerTypeTitle, translations: {
                en: 'Select either Hue/Saturation (circle) or Value/Saturation (box) color picker',
            }
        },
        ColorSchemeItemProperties_PickerTypeCaption: {
            id: StringId.ColorSchemeItemProperties_PickerTypeCaption, translations: {
                en: 'Color Picker Type',
            }
        },
        ColorSchemeItemProperties_HueSaturationCaption: {
            id: StringId.ColorSchemeItemProperties_HueSaturationCaption, translations: {
                en: 'Hue/Sat',
            }
        },
        ColorSchemeItemProperties_HueSaturationTitle: {
            id: StringId.ColorSchemeItemProperties_HueSaturationTitle, translations: {
                en: 'Hue/Saturation (circle) color picker',
            }
        },
        ColorSchemeItemProperties_ValueSaturationCaption: {
            id: StringId.ColorSchemeItemProperties_ValueSaturationCaption, translations: {
                en: 'Val/Sat',
            }
        },
        ColorSchemeItemProperties_ValueSaturationTitle: {
            id: StringId.ColorSchemeItemProperties_ValueSaturationTitle, translations: {
                en: 'Value/Saturation (box) color picker',
            }
        },
        ApplicationEnvironmentSelectorDisplay_Default: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_Default, translations: {
                en: 'Default',
            }
        },
        ApplicationEnvironmentSelectorTitle_Default: {
            id: StringId.ApplicationEnvironmentSelectorTitle_Default, translations: {
                en: 'Default (used with all data environments)',
            }
        },
        ApplicationEnvironmentSelectorDisplay_DataEnvironment: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment, translations: {
                en: 'Data Environment',
            }
        },
        ApplicationEnvironmentSelectorTitle_DataEnvironment: {
            id: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment, translations: {
                en: 'Different settings for each data environment (Production, Delayed and Demo)',
            }
        },
        ApplicationEnvironmentSelectorDisplay_DataEnvironment_Sample: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Sample, translations: {
                en: 'Sample Data Environment',
            }
        },
        ApplicationEnvironmentSelectorTitle_DataEnvironment_Sample: {
            id: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Sample, translations: {
                en: 'Always use settings for Sample Data Environment',
            }
        },
        ApplicationEnvironmentSelectorDisplay_DataEnvironment_Demo: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Demo, translations: {
                en: 'Demo Data Environment',
            }
        },
        ApplicationEnvironmentSelectorTitle_DataEnvironment_Demo: {
            id: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Demo, translations: {
                en: 'Always use settings for Demo Data Environment',
            }
        },
        ApplicationEnvironmentSelectorDisplay_DataEnvironment_Delayed: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Delayed, translations: {
                en: 'Delayed Data Environment',
            }
        },
        ApplicationEnvironmentSelectorTitle_DataEnvironment_Delayed: {
            id: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Delayed, translations: {
                en: 'Always use settings for Delayed Production Data Environment',
            }
        },
        ApplicationEnvironmentSelectorDisplay_DataEnvironment_Production: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Production, translations: {
                en: 'Production Data Environment',
            }
        },
        ApplicationEnvironmentSelectorTitle_DataEnvironment_Production: {
            id: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Production, translations: {
                en: 'Always use settings for Production Data Environment',
            }
        },
        ApplicationEnvironmentSelectorDisplay_Test: {
            id: StringId.ApplicationEnvironmentSelectorDisplay_Test, translations: {
                en: 'Test Settings',
            }
        },
        ApplicationEnvironmentSelectorTitle_Test: {
            id: StringId.ApplicationEnvironmentSelectorTitle_Test, translations: {
                en: 'Settings environment for testing',
            }
        },
        SymbolExchangeHideModeDisplay_Never: {
            id: StringId.SymbolExchangeHideModeDisplay_Never, translations: {
                en: 'Never',
            }
        },
        SymbolExchangeHideModeDescription_Never: {
            id: StringId.SymbolExchangeHideModeDescription_Never, translations: {
                en: 'Never hide the Exchange part of symbol (ie. it is always visible)',
            }
        },
        SymbolExchangeHideModeDisplay_Default: {
            id: StringId.SymbolExchangeHideModeDisplay_Default, translations: {
                en: 'Default',
            }
        },
        SymbolExchangeHideModeDescription_Default: {
            id: StringId.SymbolExchangeHideModeDescription_Default, translations: {
                en: 'Hide the exchange part of symbol if it is the default exchange',
            }
        },
        SymbolExchangeHideModeDisplay_WheneverPossible: {
            id: StringId.SymbolExchangeHideModeDisplay_WheneverPossible, translations: {
                en: 'Whenever Possible',
            }
        },
        SymbolExchangeHideModeDescription_WheneverPossible: {
            id: StringId.SymbolExchangeHideModeDescription_WheneverPossible, translations: {
                en: 'Hide the exchange part whenever possible.  (It will be hidden if market is shown)',
            }
        },
        ZenithSymbologySupportLevelDisplay_None: {
            id: StringId.ZenithSymbologySupportLevelDisplay_None, translations: {
                en: 'None',
            }
        },
        ZenithSymbologySupportLevelDescription_None: {
            id: StringId.ZenithSymbologySupportLevelDescription_None, translations: {
                en: 'Zenith symbology cannot be used to enter or display symbols',
            }
        },
        ZenithSymbologySupportLevelDisplay_Parse: {
            id: StringId.ZenithSymbologySupportLevelDisplay_Parse, translations: {
                en: 'Parse',
            }
        },
        ZenithSymbologySupportLevelDescription_Parse: {
            id: StringId.ZenithSymbologySupportLevelDescription_Parse, translations: {
                en: 'Zenith symbology can be used to enter symbols but they are displayed with normal symbology',
            }
        },
        ZenithSymbologySupportLevelDisplay_ParseAndDisplay: {
            id: StringId.ZenithSymbologySupportLevelDisplay_ParseAndDisplay, translations: {
                en: 'ParseAndDisplay',
            }
        },
        ZenithSymbologySupportLevelDescription_ParseAndDisplay: {
            id: StringId.ZenithSymbologySupportLevelDescription_ParseAndDisplay, translations: {
                en: 'Zenith symbology can be used to enter symbols and symbols displayed with zenith symbology',
            }
        },
        BalancesFieldDisplay_AccountId: {
            id: StringId.BalancesFieldDisplay_AccountId, translations: {
                en: 'Account Id',
            }
        },
        BalancesFieldHeading_AccountId: {
            id: StringId.BalancesFieldHeading_AccountId, translations: {
                en: 'Account',
            }
        },
        BalancesFieldDisplay_CurrencyId: {
            id: StringId.BalancesFieldDisplay_CurrencyId, translations: {
                en: 'Currency Id',
            }
        },
        BalancesFieldHeading_CurrencyId: {
            id: StringId.BalancesFieldHeading_CurrencyId, translations: {
                en: 'Currency',
            }
        },
        BalancesFieldDisplay_NetBalance: {
            id: StringId.BalancesFieldDisplay_NetBalance, translations: {
                en: 'Net Balance',
            }
        },
        BalancesFieldHeading_NetBalance: {
            id: StringId.BalancesFieldHeading_NetBalance, translations: {
                en: 'Net Balance',
            }
        },
        BalancesFieldDisplay_Trading: {
            id: StringId.BalancesFieldDisplay_Trading, translations: {
                en: 'Trading',
            }
        },
        BalancesFieldHeading_Trading: {
            id: StringId.BalancesFieldHeading_Trading, translations: {
                en: 'Trading',
            }
        },
        BalancesFieldDisplay_NonTrading: {
            id: StringId.BalancesFieldDisplay_NonTrading, translations: {
                en: 'Non Trading',
            }
        },
        BalancesFieldHeading_NonTrading: {
            id: StringId.BalancesFieldHeading_NonTrading, translations: {
                en: 'Non Trading',
            }
        },
        BalancesFieldDisplay_UnfilledBuys: {
            id: StringId.BalancesFieldDisplay_UnfilledBuys, translations: {
                en: 'Unfilled Buys',
            }
        },
        BalancesFieldHeading_UnfilledBuys: {
            id: StringId.BalancesFieldHeading_UnfilledBuys, translations: {
                en: 'Unfilled Buys',
            }
        },
        BalancesFieldDisplay_Margin: {
            id: StringId.BalancesFieldDisplay_Margin, translations: {
                en: 'Margin',
            }
        },
        BalancesFieldHeading_Margin: {
            id: StringId.BalancesFieldHeading_Margin, translations: {
                en: 'Margin',
            }
        },
        BaseDataIvemDetailDisplay_Id: {
            id: StringId.BaseDataIvemDetailDisplay_Id, translations: {
                en: 'Symbol',
            }
        },
        BaseDataIvemDetailHeading_Id: {
            id: StringId.BaseDataIvemDetailHeading_Id, translations: {
                en: 'Symbol',
            }
        },
        BaseDataIvemDetailDisplay_Code: {
            id: StringId.BaseDataIvemDetailDisplay_Code, translations: {
                en: 'Code',
            }
        },
        BaseDataIvemDetailHeading_Code: {
            id: StringId.BaseDataIvemDetailHeading_Code, translations: {
                en: 'Code',
            }
        },
        BaseDataIvemDetailDisplay_Market: {
            id: StringId.BaseDataIvemDetailDisplay_Market, translations: {
                en: 'Market',
            }
        },
        BaseDataIvemDetailHeading_Market: {
            id: StringId.BaseDataIvemDetailHeading_Market, translations: {
                en: 'Market',
            }
        },
        BaseDataIvemDetailDisplay_IvemClassId: {
            id: StringId.BaseDataIvemDetailDisplay_IvemClassId, translations: {
                en: 'Class',
            }
        },
        BaseDataIvemDetailHeading_IvemClassId: {
            id: StringId.BaseDataIvemDetailHeading_IvemClassId, translations: {
                en: 'Class',
            }
        },
        BaseDataIvemDetailDisplay_SubscriptionDataTypeIds: {
            id: StringId.BaseDataIvemDetailDisplay_SubscriptionDataTypeIds, translations: {
                en: 'Subscription Data Types',
            }
        },
        BaseDataIvemDetailHeading_SubscriptionDataTypeIds: {
            id: StringId.BaseDataIvemDetailHeading_SubscriptionDataTypeIds, translations: {
                en: 'Data Types',
            }
        },
        BaseDataIvemDetailDisplay_TradingMarkets: {
            id: StringId.BaseDataIvemDetailDisplay_TradingMarkets, translations: {
                en: 'Trading Markets',
            }
        },
        BaseDataIvemDetailHeading_TradingMarkets: {
            id: StringId.BaseDataIvemDetailHeading_TradingMarkets, translations: {
                en: 'Trading Markets',
            }
        },
        BaseDataIvemDetailDisplay_Name: {
            id: StringId.BaseDataIvemDetailDisplay_Name, translations: {
                en: 'Name',
            }
        },
        BaseDataIvemDetailHeading_Name: {
            id: StringId.BaseDataIvemDetailHeading_Name, translations: {
                en: 'Name',
            }
        },
        BaseDataIvemDetailDisplay_Exchange: {
            id: StringId.BaseDataIvemDetailDisplay_Exchange, translations: {
                en: 'Exchange',
            }
        },
        BaseDataIvemDetailHeading_Exchange: {
            id: StringId.BaseDataIvemDetailHeading_Exchange, translations: {
                en: 'Exchange',
            }
        },
        ExtendedDataIvemDetailDisplay_Cfi: {
            id: StringId.ExtendedDataIvemDetailDisplay_Cfi, translations: {
                en: 'CFI',
            }
        },
        ExtendedDataIvemDetailHeading_Cfi: {
            id: StringId.ExtendedDataIvemDetailHeading_Cfi, translations: {
                en: 'CFI',
            }
        },
        ExtendedDataIvemDetailDisplay_DepthDirectionId: {
            id: StringId.ExtendedDataIvemDetailDisplay_DepthDirectionId, translations: {
                en: 'Depth Direction',
            }
        },
        ExtendedDataIvemDetailHeading_DepthDirectionId: {
            id: StringId.ExtendedDataIvemDetailHeading_DepthDirectionId, translations: {
                en: 'Depth Direction',
            }
        },
        ExtendedDataIvemDetailDisplay_IsIndex: {
            id: StringId.ExtendedDataIvemDetailDisplay_IsIndex, translations: {
                en: 'Is Index',
            }
        },
        ExtendedDataIvemDetailHeading_IsIndex: {
            id: StringId.ExtendedDataIvemDetailHeading_IsIndex, translations: {
                en: 'Index',
            }
        },
        ExtendedDataIvemDetailDisplay_ExpiryDate: {
            id: StringId.ExtendedDataIvemDetailDisplay_ExpiryDate, translations: {
                en: 'Expiry Date',
            }
        },
        ExtendedDataIvemDetailHeading_ExpiryDate: {
            id: StringId.ExtendedDataIvemDetailHeading_ExpiryDate, translations: {
                en: 'Expiry Date',
            }
        },
        ExtendedDataIvemDetailDisplay_StrikePrice: {
            id: StringId.ExtendedDataIvemDetailDisplay_StrikePrice, translations: {
                en: 'Strike Price',
            }
        },
        ExtendedDataIvemDetailHeading_StrikePrice: {
            id: StringId.ExtendedDataIvemDetailHeading_StrikePrice, translations: {
                en: 'Strike Price',
            }
        },
        ExtendedDataIvemDetailDisplay_ExerciseTypeId: {
            id: StringId.ExtendedDataIvemDetailDisplay_ExerciseTypeId, translations: {
                en: 'Exercise Type',
            }
        },
        ExtendedDataIvemDetailHeading_ExerciseTypeId: {
            id: StringId.ExtendedDataIvemDetailHeading_ExerciseTypeId, translations: {
                en: 'Exercise Type',
            }
        },
        ExtendedDataIvemDetailDisplay_CallOrPutId: {
            id: StringId.ExtendedDataIvemDetailDisplay_CallOrPutId, translations: {
                en: 'Call Or Put',
            }
        },
        ExtendedDataIvemDetailHeading_CallOrPutId: {
            id: StringId.ExtendedDataIvemDetailHeading_CallOrPutId, translations: {
                en: 'Call/Put',
            }
        },
        ExtendedDataIvemDetailDisplay_ContractSize: {
            id: StringId.ExtendedDataIvemDetailDisplay_ContractSize, translations: {
                en: 'Contract Size',
            }
        },
        ExtendedDataIvemDetailHeading_ContractSize: {
            id: StringId.ExtendedDataIvemDetailHeading_ContractSize, translations: {
                en: 'Contract Size',
            }
        },
        ExtendedDataIvemDetailDisplay_LotSize: {
            id: StringId.ExtendedDataIvemDetailDisplay_LotSize, translations: {
                en: 'Lot Size',
            }
        },
        ExtendedDataIvemDetailHeading_LotSize: {
            id: StringId.ExtendedDataIvemDetailHeading_LotSize, translations: {
                en: 'Lot Size',
            }
        },
        ExtendedDataIvemDetailDisplay_Attributes: {
            id: StringId.ExtendedDataIvemDetailDisplay_Attributes, translations: {
                en: 'Attributes',
            }
        },
        ExtendedDataIvemDetailHeading_Attributes: {
            id: StringId.ExtendedDataIvemDetailHeading_Attributes, translations: {
                en: 'Attributes',
            }
        },
        ExtendedDataIvemDetailDisplay_TmcLegs: {
            id: StringId.ExtendedDataIvemDetailDisplay_TmcLegs, translations: {
                en: 'Tmc Legs',
            }
        },
        ExtendedDataIvemDetailHeading_TmcLegs: {
            id: StringId.ExtendedDataIvemDetailHeading_TmcLegs, translations: {
                en: 'Tmc Legs',
            }
        },
        ExtendedDataIvemDetailDisplay_Categories: {
            id: StringId.ExtendedDataIvemDetailDisplay_Categories, translations: {
                en: 'Categories',
            }
        },
        ExtendedDataIvemDetailHeading_Categories: {
            id: StringId.ExtendedDataIvemDetailHeading_Categories, translations: {
                en: 'Categories',
            }
        },
        ExtendedDataIvemDetailDisplay_AlternateCodes: {
            id: StringId.ExtendedDataIvemDetailDisplay_AlternateCodes, translations: {
                en: 'Alternate Codes',
            }
        },
        ExtendedDataIvemDetailHeading_AlternateCodes: {
            id: StringId.ExtendedDataIvemDetailHeading_AlternateCodes, translations: {
                en: 'Alternate Codes',
            }
        },
        MyxDataIvemAttributesDisplay_Category: {
            id: StringId.MyxDataIvemAttributesDisplay_Category, translations: {
                en: 'Category',
            }
        },
        MyxDataIvemAttributesHeading_Category: {
            id: StringId.MyxDataIvemAttributesHeading_Category, translations: {
                en: 'Category',
            }
        },
        MyxDataIvemAttributesDisplay_MarketClassification: {
            id: StringId.MyxDataIvemAttributesDisplay_MarketClassification, translations: {
                en: 'Market Classification',
            }
        },
        MyxDataIvemAttributesHeading_MarketClassification: {
            id: StringId.MyxDataIvemAttributesHeading_MarketClassification, translations: {
                en: 'Classification',
            }
        },
        MyxDataIvemAttributesDisplay_DeliveryBasis: {
            id: StringId.MyxDataIvemAttributesDisplay_DeliveryBasis, translations: {
                en: 'Delivery Basis',
            }
        },
        MyxDataIvemAttributesHeading_DeliveryBasis: {
            id: StringId.MyxDataIvemAttributesHeading_DeliveryBasis, translations: {
                en: 'Delivery',
            }
        },
        MyxDataIvemAttributesDisplay_MaxRSS: {
            id: StringId.MyxDataIvemAttributesDisplay_MaxRSS, translations: {
                en: 'MaxRSS',
            }
        },
        MyxDataIvemAttributesHeading_MaxRSS: {
            id: StringId.MyxDataIvemAttributesHeading_MaxRSS, translations: {
                en: 'MaxRSS',
            }
        },
        MyxDataIvemAttributesDisplay_Sector: {
            id: StringId.MyxDataIvemAttributesDisplay_Sector, translations: {
                en: 'Sector',
            }
        },
        MyxDataIvemAttributesHeading_Sector: {
            id: StringId.MyxDataIvemAttributesHeading_Sector, translations: {
                en: 'Sector',
            }
        },
        MyxDataIvemAttributesDisplay_Short: {
            id: StringId.MyxDataIvemAttributesDisplay_Short, translations: {
                en: 'Short',
            }
        },
        MyxDataIvemAttributesHeading_Short: {
            id: StringId.MyxDataIvemAttributesHeading_Short, translations: {
                en: 'Short',
            }
        },
        MyxDataIvemAttributesDisplay_ShortSuspended: {
            id: StringId.MyxDataIvemAttributesDisplay_ShortSuspended, translations: {
                en: 'Short Suspended',
            }
        },
        MyxDataIvemAttributesHeading_ShortSuspended: {
            id: StringId.MyxDataIvemAttributesHeading_ShortSuspended, translations: {
                en: 'Short Suspended',
            }
        },
        MyxDataIvemAttributesDisplay_SubSector: {
            id: StringId.MyxDataIvemAttributesDisplay_SubSector, translations: {
                en: 'Sub Sector',
            }
        },
        MyxDataIvemAttributesHeading_SubSector: {
            id: StringId.MyxDataIvemAttributesHeading_SubSector, translations: {
                en: 'Sub Sector',
            }
        },
        DataIvemAlternateCodeDisplay_Ticker: {
            id: StringId.DataIvemAlternateCodeDisplay_Ticker, translations: {
                en: 'Ticker',
            }
        },
        DataIvemAlternateCodeHeading_Ticker: {
            id: StringId.DataIvemAlternateCodeHeading_Ticker, translations: {
                en: 'Ticker',
            }
        },
        DataIvemAlternateCodeDisplay_Gics: {
            id: StringId.DataIvemAlternateCodeDisplay_Gics, translations: {
                en: 'GICS',
            }
        },
        DataIvemAlternateCodeHeading_Gics: {
            id: StringId.DataIvemAlternateCodeHeading_Gics, translations: {
                en: 'GICS',
            }
        },
        DataIvemAlternateCodeDisplay_Isin: {
            id: StringId.DataIvemAlternateCodeDisplay_Isin, translations: {
                en: 'ISIN',
            }
        },
        DataIvemAlternateCodeHeading_Isin: {
            id: StringId.DataIvemAlternateCodeHeading_Isin, translations: {
                en: 'ISIN',
            }
        },
        DataIvemAlternateCodeDisplay_Ric: {
            id: StringId.DataIvemAlternateCodeDisplay_Ric, translations: {
                en: 'RIC',
            }
        },
        DataIvemAlternateCodeHeading_Ric: {
            id: StringId.DataIvemAlternateCodeHeading_Ric, translations: {
                en: 'RIC',
            }
        },
        DataIvemAlternateCodeDisplay_Base: {
            id: StringId.DataIvemAlternateCodeDisplay_Base, translations: {
                en: 'Base/Underlying',
            }
        },
        DataIvemAlternateCodeHeading_Base: {
            id: StringId.DataIvemAlternateCodeHeading_Base, translations: {
                en: 'Base',
            }
        },
        DataIvemAlternateCodeDisplay_Short: {
            id: StringId.DataIvemAlternateCodeDisplay_Short, translations: {
                en: 'Short',
            }
        },
        DataIvemAlternateCodeHeading_Short: {
            id: StringId.DataIvemAlternateCodeHeading_Short, translations: {
                en: 'Short',
            }
        },
        DataIvemAlternateCodeDisplay_Long: {
            id: StringId.DataIvemAlternateCodeDisplay_Long, translations: {
                en: 'Long',
            }
        },
        DataIvemAlternateCodeHeading_Long: {
            id: StringId.DataIvemAlternateCodeHeading_Long, translations: {
                en: 'Long',
            }
        },
        DataIvemAlternateCodeDisplay_Uid: {
            id: StringId.DataIvemAlternateCodeDisplay_Uid, translations: {
                en: 'Uid',
            }
        },
        DataIvemAlternateCodeHeading_Uid: {
            id: StringId.DataIvemAlternateCodeHeading_Uid, translations: {
                en: 'Uid',
            }
        },
        DepthDirectionDisplay_BidBelowAsk: {
            id: StringId.DepthDirectionDisplay_BidBelowAsk, translations: {
                en: 'Bid below Ask',
            }
        },
        DepthDirectionDisplay_AskBelowBid: {
            id: StringId.DepthDirectionDisplay_AskBelowBid, translations: {
                en: 'Ask below Bid',
            }
        },
        MyxMarketClassificationDisplay_Main: {
            id: StringId.MyxMarketClassificationDisplay_Main, translations: {
                en: 'MAIN',
            }
        },
        MyxMarketClassificationDisplay_Ace: {
            id: StringId.MyxMarketClassificationDisplay_Ace, translations: {
                en: 'ACE',
            }
        },
        MyxMarketClassificationDisplay_Etf: {
            id: StringId.MyxMarketClassificationDisplay_Etf, translations: {
                en: 'ETF',
            }
        },
        MyxMarketClassificationDisplay_Strw: {
            id: StringId.MyxMarketClassificationDisplay_Strw, translations: {
                en: 'STRW',
            }
        },
        MyxMarketClassificationDisplay_Bond: {
            id: StringId.MyxMarketClassificationDisplay_Bond, translations: {
                en: 'BOND',
            }
        },
        MyxMarketClassificationDisplay_Leap: {
            id: StringId.MyxMarketClassificationDisplay_Leap, translations: {
                en: 'LEAP',
            }
        },
        MyxShortSellTypeDisplay_RegulatedShortSelling: {
            id: StringId.MyxShortSellTypeDisplay_RegulatedShortSelling, translations: {
                en: 'Regulated short selling',
            }
        },
        MyxShortSellTypeDisplay_ProprietaryDayTrading: {
            id: StringId.MyxShortSellTypeDisplay_ProprietaryDayTrading, translations: {
                en: 'Proprietary day trading',
            }
        },
        MyxShortSellTypeDisplay_IntraDayShortSelling: {
            id: StringId.MyxShortSellTypeDisplay_IntraDayShortSelling, translations: {
                en: 'Intraday short selling',
            }
        },
        MyxShortSellTypeDisplay_ProprietaryShortSelling: {
            id: StringId.MyxShortSellTypeDisplay_ProprietaryShortSelling, translations: {
                en: 'Proprietary short selling',
            }
        },
        MyxCategoryDisplay_Foreign: {
            id: StringId.MyxCategoryDisplay_Foreign, translations: {
                en: 'Foreign',
            }
        },
        MyxCategoryDisplay_Sharia: {
            id: StringId.MyxCategoryDisplay_Sharia, translations: {
                en: 'Sharia',
            }
        },
        MyxDeliveryBasisDisplay_BuyingInT0: {
            id: StringId.MyxDeliveryBasisDisplay_BuyingInT0, translations: {
                en: 'Buying in T0',
            }
        },
        MyxDeliveryBasisDisplay_DesignatedBasisT1: {
            id: StringId.MyxDeliveryBasisDisplay_DesignatedBasisT1, translations: {
                en: 'Designated basis T1',
            }
        },
        MyxDeliveryBasisDisplay_ReadyBasisT2: {
            id: StringId.MyxDeliveryBasisDisplay_ReadyBasisT2, translations: {
                en: 'Ready basis T2',
            }
        },
        MyxDeliveryBasisDisplay_ImmediateBasisT1: {
            id: StringId.MyxDeliveryBasisDisplay_ImmediateBasisT1, translations: {
                en: 'Immediate basis T1',
            }
        },
        SearchSymbolsIndicesInclusion_ExcludeCaption: {
            id: StringId.SearchSymbolsIndicesInclusion_ExcludeCaption, translations: {
                en: 'Exclude',
            }
        },
        SearchSymbolsIndicesInclusion_ExcludeTitle: {
            id: StringId.SearchSymbolsIndicesInclusion_ExcludeTitle, translations: {
                en: 'Exclude indices from search',
            }
        },
        SearchSymbolsIndicesInclusion_IncludeCaption: {
            id: StringId.SearchSymbolsIndicesInclusion_IncludeCaption, translations: {
                en: 'Include',
            }
        },
        SearchSymbolsIndicesInclusion_IncludeTitle: {
            id: StringId.SearchSymbolsIndicesInclusion_IncludeTitle, translations: {
                en: 'Include indices in search',
            }
        },
        SearchSymbolsIndicesInclusion_OnlyCaption: {
            id: StringId.SearchSymbolsIndicesInclusion_OnlyCaption, translations: {
                en: 'Only',
            }
        },
        SearchSymbolsIndicesInclusion_OnlyTitle: {
            id: StringId.SearchSymbolsIndicesInclusion_OnlyTitle, translations: {
                en: 'Only include indices in search',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Code: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Code, translations: {
                en: 'Code',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Code: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Code, translations: {
                en: 'Match symbol Code',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Name: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Name, translations: {
                en: 'Name',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Name: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Name, translations: {
                en: 'Match symbol Name',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Short: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Short, translations: {
                en: 'Short'
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Short: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Short, translations: {
                en: 'Match short symbol name'
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Long: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Long, translations: {
                en: 'Long'
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Long: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Long, translations: {
                en: 'Match long symbol name'
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Ticker: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Ticker, translations: {
                en: 'Ticker',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Ticker: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Ticker, translations: {
                en: 'Match symbol Ticker',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Gics: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Gics, translations: {
                en: 'GICS',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Gics: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Gics, translations: {
                en: 'Match symbol GICS value',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Isin: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Isin, translations: {
                en: 'ISIN',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Isin: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Isin, translations: {
                en: 'Match symbol ISIN',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Base: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Base, translations: {
                en: 'Underlying',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Base: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Base, translations: {
                en: 'Match symbol Underlying security code',
            }
        },
        QuerySymbolsDataDefinitionFieldDisplay_Ric: {
            id: StringId.QuerySymbolsDataDefinitionFieldDisplay_Ric, translations: {
                en: 'RIC',
            }
        },
        QuerySymbolsDataDefinitionFieldDescription_Ric: {
            id: StringId.QuerySymbolsDataDefinitionFieldDescription_Ric, translations: {
                en: 'Match symbol RIC code',
            }
        },

        SymbolsDitemControlTitle_QueryOrSubscribe: {
            id: StringId.SymbolsDitemControlTitle_QueryOrSubscribe, translations: {
                en: 'Search Type',
            }
        },
        SymbolsDitemControlCaption_QueryOrSubscribe: {
            id: StringId.SymbolsDitemControlCaption_QueryOrSubscribe, translations: {
                en: 'Search Type',
            }
        },
        SymbolsDitemControlTitle_Exchange: {
            id: StringId.SymbolsDitemControlTitle_Exchange, translations: {
                en: 'Limit search to exchange',
            }
        },
        SymbolsDitemControlCaption_Exchange: {
            id: StringId.SymbolsDitemControlCaption_Exchange, translations: {
                en: 'Exchange',
            }
        },
        SymbolsDitemControlTitle_Markets: {
            id: StringId.SymbolsDitemControlTitle_Markets, translations: {
                en: 'Select markets for search',
            }
        },
        SymbolsDitemControlCaption_Markets: {
            id: StringId.SymbolsDitemControlCaption_Markets, translations: {
                en: 'Markets',
            }
        },
        SymbolsDitemControlTitle_Cfi: {
            id: StringId.SymbolsDitemControlTitle_Cfi, translations: {
                en: 'Classification of Financial Instruments'
            }
        },
        SymbolsDitemControlCaption_Cfi: {
            id: StringId.SymbolsDitemControlCaption_Cfi, translations: {
                en: 'CFI'
            }
        },
        SymbolsDitemControlTitle_Fields: {
            id: StringId.SymbolsDitemControlTitle_Fields, translations: {
                en: 'Select symbol fields to search',
            }
        },
        SymbolsDitemControlCaption_Fields: {
            id: StringId.SymbolsDitemControlCaption_Fields, translations: {
                en: 'Fields',
            }
        },
        SymbolsDitemControlTitle_Indices: {
            id: StringId.SymbolsDitemControlTitle_Indices, translations: {
                en: 'Search indices only',
            }
        },
        SymbolsDitemControlCaption_Indices: {
            id: StringId.SymbolsDitemControlCaption_Indices, translations: {
                en: 'Indices',
            }
        },
        SymbolsDitemControlTitle_Partial: {
            id: StringId.SymbolsDitemControlTitle_Partial, translations: {
                en: 'Allow search to partially match field',
            }
        },
        SymbolsDitemControlCaption_Partial: {
            id: StringId.SymbolsDitemControlCaption_Partial, translations: {
                en: 'Partial',
            }
        },
        SymbolsDitemControlTitle_PreferExact: {
            id: StringId.SymbolsDitemControlTitle_PreferExact, translations: {
                en: 'Only show exact match if an exact match is found',
            }
        },
        SymbolsDitemControlCaption_PreferExact: {
            id: StringId.SymbolsDitemControlCaption_PreferExact, translations: {
                en: 'Prefer exact',
            }
        },
        SymbolsDitemControlTitle_ShowFull: {
            id: StringId.SymbolsDitemControlTitle_ShowFull, translations: {
                en: 'Show all available data for symbols',
            }
        },
        SymbolsDitemControlCaption_ShowFull: {
            id: StringId.SymbolsDitemControlCaption_ShowFull, translations: {
                en: 'Show Full',
            }
        },
        SymbolsDitemControlTitle_PageSize: {
            id: StringId.SymbolsDitemControlTitle_PageSize, translations: {
                en: 'Number of symbols per page',
            }
        },
        SymbolsDitemControlCaption_PageSize: {
            id: StringId.SymbolsDitemControlCaption_PageSize, translations: {
                en: 'Page size',
            }
        },
        SymbolsDitemControlTitle_Search: {
            id: StringId.SymbolsDitemControlTitle_Search, translations: {
                en: 'Text which symbol fields (code, name etc) will be matched against',
            }
        },
        SymbolsDitemControlCaption_Search: {
            id: StringId.SymbolsDitemControlCaption_Search, translations: {
                en: 'Search',
            }
        },
        SymbolsDitemControlTitle_Query: {
            id: StringId.SymbolsDitemControlTitle_Query, translations: {
                en: 'Search for symbols',
            }
        },
        SymbolsDitemControlCaption_Query: {
            id: StringId.SymbolsDitemControlCaption_Query, translations: {
                en: 'Search',
            }
        },
        SymbolsDitemControlTitle_SubscribeMarket: {
            id: StringId.SymbolsDitemControlTitle_SubscribeMarket, translations: {
                en: 'Specify market for symbol subscription',
            }
        },
        SymbolsDitemControlCaption_SubscribeMarket: {
            id: StringId.SymbolsDitemControlCaption_SubscribeMarket, translations: {
                en: 'Market',
            }
        },
        SymbolsDitemControlTitle_Class: {
            id: StringId.SymbolsDitemControlTitle_Class, translations: {
                en: 'Specify class for symbol subscription',
            }
        },
        SymbolsDitemControlCaption_Class: {
            id: StringId.SymbolsDitemControlCaption_Class, translations: {
                en: 'Class',
            }
        },
        SymbolsDitemControlTitle_Subscribe: {
            id: StringId.SymbolsDitemControlTitle_Subscribe, translations: {
                en: 'Subscribe to symbols for Market/Class. List will be updated as symbols are added, removed or modified',
            }
        },
        SymbolsDitemControlCaption_Subscribe: {
            id: StringId.SymbolsDitemControlCaption_Subscribe, translations: {
                en: 'Subscribe',
            }
        },
        SymbolsDitemControlTitle_QuerySearchDescription: {
            id: StringId.SymbolsDitemControlTitle_QuerySearchDescription, translations: {
                en: 'Symbol search parameters for query list',
            }
        },
        SymbolsDitemControlCaption_QuerySearchDescription: {
            id: StringId.SymbolsDitemControlCaption_QuerySearchDescription, translations: {
                en: 'Symbol search parameters',
            }
        },
        SymbolsDitemControlTitle_SubscriptionSearchDescription: {
            id: StringId.SymbolsDitemControlTitle_SubscriptionSearchDescription, translations: {
                en: 'Symbol search parameters for subscribe list',
            }
        },
        SymbolsDitemControlCaption_SubscriptionSearchDescription: {
            id: StringId.SymbolsDitemControlCaption_SubscriptionSearchDescription, translations: {
                en: 'Symbol search parameters',
            }
        },
        SymbolsDitemControlTitle_NextPage: {
            id: StringId.SymbolsDitemControlTitle_NextPage, translations: {
                en: 'Get next page of symbols',
            }
        },
        SymbolsDitemControlCaption_NextPage: {
            id: StringId.SymbolsDitemControlCaption_NextPage, translations: {
                en: 'Next',
            }
        },
        SymbolsDitemQueryOrSubscribeDescription_Query: {
            id: StringId.SymbolsDitemQueryOrSubscribeDescription_Query, translations: {
                en: 'Execute a \'one of\' query for symbols',
            }
        },
        SymbolsDitemQueryOrSubscribeDescription_Subscription: {
            id: StringId.SymbolsDitemQueryOrSubscribeDescription_Subscription, translations: {
                en: 'Subscribe to symbols for Market/Class. List will be updated as symbols are added, removed or modified',
            }
        },
        SymbolsDitemControlCaption_ColumnsDialogCaption: {
            id: StringId.SymbolsDitemControlCaption_ColumnsDialogCaption, translations: {
                en: 'Symbols grid columns',
            }
        },
        DayTradesGridHeading_Id: {
            id: StringId.DayTradesGridHeading_Id, translations: {
                en: 'Id',
            }
        },
        DayTradesGridHeading_Price: {
            id: StringId.DayTradesGridHeading_Price, translations: {
                en: 'Price',
            }
        },
        DayTradesGridHeading_Quantity: {
            id: StringId.DayTradesGridHeading_Quantity, translations: {
                en: 'Quantity',
            }
        },
        DayTradesGridHeading_Time: {
            id: StringId.DayTradesGridHeading_Time, translations: {
                en: 'Time',
            }
        },
        DayTradesGridHeading_FlagIds: {
            id: StringId.DayTradesGridHeading_FlagIds, translations: {
                en: 'Flags',
            }
        },
        DayTradesGridHeading_TrendId: {
            id: StringId.DayTradesGridHeading_TrendId, translations: {
                en: 'Trend',
            }
        },
        DayTradesGridHeading_OrderSideId: {
            id: StringId.DayTradesGridHeading_OrderSideId, translations: {
                en: 'Side',
            }
        },
        DayTradesGridHeading_AffectsIds: {
            id: StringId.DayTradesGridHeading_AffectsIds, translations: {
                en: 'Affects',
            }
        },
        DayTradesGridHeading_ConditionCodes: {
            id: StringId.DayTradesGridHeading_ConditionCodes, translations: {
                en: 'Codes',
            }
        },
        DayTradesGridHeading_BuyDepthOrderId: {
            id: StringId.DayTradesGridHeading_BuyDepthOrderId, translations: {
                en: 'Buy Id',
            }
        },
        DayTradesGridHeading_BuyBroker: {
            id: StringId.DayTradesGridHeading_BuyBroker, translations: {
                en: 'Buy Broker',
            }
        },
        DayTradesGridHeading_BuyCrossRef: {
            id: StringId.DayTradesGridHeading_BuyCrossRef, translations: {
                en: 'Buy XRef',
            }
        },
        DayTradesGridHeading_SellDepthOrderId: {
            id: StringId.DayTradesGridHeading_SellDepthOrderId, translations: {
                en: 'Sell Id',
            }
        },
        DayTradesGridHeading_SellBroker: {
            id: StringId.DayTradesGridHeading_SellBroker, translations: {
                en: 'Sell Broker',
            }
        },
        DayTradesGridHeading_SellCrossRef: {
            id: StringId.DayTradesGridHeading_SellCrossRef, translations: {
                en: 'Sell XRef',
            }
        },
        DayTradesGridHeading_MarketId: {
            id: StringId.DayTradesGridHeading_MarketId, translations: {
                en: 'Market',
            }
        },
        DayTradesGridHeading_RelatedId: {
            id: StringId.DayTradesGridHeading_RelatedId, translations: {
                en: 'Related',
            }
        },
        DayTradesGridHeading_Attributes: {
            id: StringId.DayTradesGridHeading_Attributes, translations: {
                en: 'Attributes',
            }
        },
        DayTradesGridHeading_RecordType: {
            id: StringId.DayTradesGridHeading_RecordType, translations: {
                en: 'Record Type',
            }
        },
        SubscribabilityIncreaseRetry_FromExtentNone: {
            id: StringId.SubscribabilityIncreaseRetry_FromExtentNone, translations: {
                en: 'Retrying from no subscribability',
            }
        },
        SubscribabilityIncreaseRetry_FromExtentSome: {
            id: StringId.SubscribabilityIncreaseRetry_FromExtentSome, translations: {
                en: 'Retrying from partial subscribability',
            }
        },
        SubscribabilityIncreaseRetry_ReIncrease: {
            id: StringId.SubscribabilityIncreaseRetry_ReIncrease, translations: {
                en: 'Waiting for Feed to reconnect or come online again',
            }
        },
        BadnessReasonId_NotBad: {
            id: StringId.BadnessReasonId_NotBad, translations: {
                en: 'Not bad',
            }
        },
        BadnessReasonId_Inactive: {
            id: StringId.BadnessReasonId_Inactive, translations: {
                en: 'Inactive',
            }
        },
        BadnessReasonId_PublisherSubscriptionError_Internal_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_Internal_Error, translations: {
                en: 'Feed internal error',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_InvalidRequest_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_InvalidRequest_Error, translations: {
                en: 'Invalid subscription request',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_Offlined_Suspect: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_Offlined_Suspect, translations: {
                en: 'Feed offline (waiting)',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_Offlined_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_Offlined_Error, translations: {
                en: 'Feed offline error',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_Timeout_Suspect: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_Timeout_Suspect, translations: {
                en: 'Feed request timeout (retrying)',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_Timeout_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_Timeout_Error, translations: {
                en: 'Feed request timeout error',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_SubscriptionError_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_SubscriptionError_Error, translations: {
                en: 'Feed subscription error',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_PublishRequestError_Suspect: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_PublishRequestError_Suspect, translations: {
                en: 'Feed request error (retrying)',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_PublishRequestError_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_PublishRequestError_Error, translations: {
                en: 'Feed request error',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_SubscriptionWarning_Suspect: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_SubscriptionWarning_Suspect, translations: {
                en: 'Feed subscription warning',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_DataNotAvailable_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_DataNotAvailable_Error, translations: {
                en: 'Data not available',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_DataError_Suspect: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_DataError_Suspect, translations: {
                en: 'Data error',
            },
        },
        BadnessReasonId_PublisherSubscriptionError_DataError_Error: {
            id: StringId.BadnessReasonId_PublisherSubscriptionError_DataError_Error, translations: {
                en: 'Data error',
            },
        },
        BadnessReasonId_PublisherServerWarning: {
            id: StringId.BadnessReasonId_PublisherServerWarning, translations: {
                en: 'Feed server warning',
            }
        },
        BadnessReasonId_PublisherServerError: {
            id: StringId.BadnessReasonId_PublisherServerError, translations: {
                en: 'Feed server error',
            }
        },
        BadnessReasonId_PublisherSubscription_NeverSubscribed: {
            id: StringId.BadnessReasonId_PublisherSubscription_NeverSubscribed, translations: {
                en: 'Not yet subscribed to Feed data',
            }
        },
        BadnessReasonId_PublisherSubscription_PublisherOnlineWaiting: {
            id: StringId.BadnessReasonId_PublisherSubscription_PublisherOnlineWaiting, translations: {
                en: 'Waiting for feed connection to come online',
            }
        },
        BadnessReasonId_PublisherSubscription_PublisherOfflining: {
            id: StringId.BadnessReasonId_PublisherSubscription_PublisherOfflining, translations: {
                en: 'Feed going offline',
            }
        },
        BadnessReasonId_PublisherSubscription_ResponseWaiting: {
            id: StringId.BadnessReasonId_PublisherSubscription_ResponseWaiting, translations: {
                en: 'Waiting for server data',
            }
        },
        BadnessReasonId_PublisherSubscription_SynchronisationWaiting: {
            id: StringId.BadnessReasonId_PublisherSubscription_SynchronisationWaiting, translations: {
                en: 'Data synchronising',
            }
        },
        BadnessReasonId_PublisherSubscription_Synchronised: {
            id: StringId.BadnessReasonId_PublisherSubscription_Synchronised, translations: {
                en: 'Data synchronised',
            }
        },
        BadnessReasonId_PublisherSubscription_UnsubscribedSynchronised: {
            id: StringId.BadnessReasonId_PublisherSubscription_UnsubscribedSynchronised, translations: {
                en: 'Data snapshot synchronised',
            }
        },
        BadnessReasonId_PreGood_Clear: {
            id: StringId.BadnessReasonId_PreGood_Clear, translations: {
                en: 'Pre good clearing',
            }
        },
        BadnessReasonId_PreGood_Add: {
            id: StringId.BadnessReasonId_PreGood_Add, translations: {
                en: 'Pre good adding',
            }
        },
        BadnessReasonId_ConnectionOffline: {
            id: StringId.BadnessReasonId_ConnectionOffline, translations: {
                en: 'Connection offline',
            }
        },
        BadnessReasonId_FeedsWaiting: {
            id: StringId.BadnessReasonId_FeedsWaiting, translations: {
                en: 'Waiting for feeds',
            }
        },
        BadnessReasonId_FeedsError: {
            id: StringId.BadnessReasonId_FeedsError, translations: {
                en: 'Feeds error',
            }
        },
        BadnessReasonId_FeedWaiting: {
            id: StringId.BadnessReasonId_FeedWaiting, translations: {
                en: 'Waiting for feed',
            }
        },
        BadnessReasonId_FeedError: {
            id: StringId.BadnessReasonId_FeedError, translations: {
                en: 'Feed error',
            }
        },
        BadnessReasonId_FeedNotAvailable: {
            id: StringId.BadnessReasonId_FeedNotAvailable, translations: {
                en: 'Feed not available',
            }
        },
        BadnessReasonId_NoAuthorityFeed: {
            id: StringId.BadnessReasonId_NoAuthorityFeed, translations: {
                en: 'No Authority Feed',
            }
        },
        BadnessReasonId_MarketsWaiting: {
            id: StringId.BadnessReasonId_MarketsWaiting, translations: {
                en: 'Waiting for markets',
            }
        },
        BadnessReasonId_MarketsError: {
            id: StringId.BadnessReasonId_MarketsError, translations: {
                en: 'Markets Error',
            }
        },
        BadnessReasonId_MarketWaiting: {
            id: StringId.BadnessReasonId_MarketWaiting, translations: {
                en: 'Waiting for market',
            }
        },
        BadnessReasonId_MarketError: {
            id: StringId.BadnessReasonId_MarketError, translations: {
                en: 'Market error',
            }
        },
        BadnessReasonId_MarketNotAvailable: {
            id: StringId.BadnessReasonId_MarketNotAvailable, translations: {
                en: 'Market not available',
            }
        },
        BadnessReasonId_BrokerageAccountsWaiting: {
            id: StringId.BadnessReasonId_BrokerageAccountsWaiting, translations: {
                en: 'Waiting for accounts',
            }
        },
        BadnessReasonId_BrokerageAccountsError: {
            id: StringId.BadnessReasonId_BrokerageAccountsError, translations: {
                en: 'Accounts error',
            }
        },
        BadnessReasonId_BrokerageAccountWaiting: {
            id: StringId.BadnessReasonId_BrokerageAccountWaiting, translations: {
                en: 'Waiting for account',
            }
        },
        BadnessReasonId_BrokerageAccountError: {
            id: StringId.BadnessReasonId_BrokerageAccountError, translations: {
                en: 'Account error',
            }
        },
        BadnessReasonId_BrokerageAccountNotAvailable: {
            id: StringId.BadnessReasonId_BrokerageAccountNotAvailable, translations: {
                en: 'Brokerage account not available',
            }
        },
        BadnessReasonId_OrderStatusesError: {
            id: StringId.BadnessReasonId_OrderStatusesError, translations: {
                en: 'Order statuses error',
            }
        },
        BadnessReasonId_FeedStatus_Unknown: {
            id: StringId.BadnessReasonId_FeedStatus_Unknown, translations: {
                en: 'Feed state unknown',
            }
        },
        BadnessReasonId_FeedStatus_Initialising: {
            id: StringId.BadnessReasonId_FeedStatus_Initialising, translations: {
                en: 'Feed initialising',
            }
        },
        BadnessReasonId_FeedStatus_Impaired: {
            id: StringId.BadnessReasonId_FeedStatus_Impaired, translations: {
                en: 'Feed impaired',
            }
        },
        BadnessReasonId_FeedStatus_Expired: {
            id: StringId.BadnessReasonId_FeedStatus_Expired, translations: {
                en: 'Feed expired',
            }
        },
        BadnessReasonId_Opening: {
            id: StringId.BadnessReasonId_Opening, translations: {
                en: 'Opening',
            }
        },
        BadnessReasonId_Reading: {
            id: StringId.BadnessReasonId_Reading, translations: {
                en: 'Reading',
            }
        },
        BadnessReasonId_SymbolMatching_None: {
            id: StringId.BadnessReasonId_SymbolMatching_None, translations: {
                en: 'No Matching Symbol',
            }
        },
        BadnessReasonId_SymbolMatching_Ambiguous: {
            id: StringId.BadnessReasonId_SymbolMatching_Ambiguous, translations: {
                en: 'Ambiguous Symbol Match',
            }
        },
        BadnessReasonId_SymbolOkWaitingForData: {
            id: StringId.BadnessReasonId_SymbolOkWaitingForData, translations: {
                en: 'Symbol ok, waiting for data',
            }
        },
        BadnessReasonId_DataRetrieving: {
            id: StringId.BadnessReasonId_DataRetrieving, translations: {
                en: 'Retrieving data',
            }
        },
        BadnessReasonId_MarketTradingStatesRetrieving: {
            id: StringId.BadnessReasonId_MarketTradingStatesRetrieving, translations: {
                en: 'Retrieving market trading states',
            }
        },
        BadnessReasonId_OrderStatusesFetching: {
            id: StringId.BadnessReasonId_OrderStatusesFetching, translations: {
                en: 'Fetching order statuses',
            }
        },
        BadnessReasonId_BrokerageAccountDataListsIncubating: {
            id: StringId.BadnessReasonId_BrokerageAccountDataListsIncubating, translations: {
                en: 'Waiting on data from individual accounts',
            }
        },
        BadnessReasonId_OneOrMoreAccountsInError: {
            id: StringId.BadnessReasonId_OneOrMoreAccountsInError, translations: {
                en: 'One or more accounts in error',
            }
        },
        BadnessReasonId_MultipleUsable: {
            id: StringId.BadnessReasonId_MultipleUsable, translations: {
                en: 'Multiple warnings',
            }
        },
        BadnessReasonId_MultipleSuspect: {
            id: StringId.BadnessReasonId_MultipleSuspect, translations: {
                en: 'Multiple suspect',
            }
        },
        BadnessReasonId_MultipleError: {
            id: StringId.BadnessReasonId_MultipleError, translations: {
                en: 'Multiple errors',
            }
        },
        BadnessReasonId_StatusWarnings: {
            id: StringId.BadnessReasonId_StatusWarnings, translations: {
                en: 'Status warning(s)',
            }
        },
        BadnessReasonId_StatusRetrieving: {
            id: StringId.BadnessReasonId_StatusRetrieving, translations: {
                en: 'Retrieving status data',
            }
        },
        BadnessReasonId_StatusErrors: {
            id: StringId.BadnessReasonId_StatusErrors, translations: {
                en: 'Status error(s)',
            }
        },
        BadnessReasonId_LockError: {
            id: StringId.BadnessReasonId_LockError, translations: {
                en: 'Lock Error (probably not found)',
            }
        },
        SourceTzOffsetDateTimeTimezoneModeDisplay_Utc: {
            id: StringId.SourceTzOffsetDateTimeTimezoneModeDisplay_Utc, translations: {
                en: 'UTC',
            }
        },
        SourceTzOffsetDateTimeTimezoneModeDescription_Utc: {
            id: StringId.SourceTzOffsetDateTimeTimezoneModeDescription_Utc, translations: {
                en: 'Display times according to UTC timezone',
            }
        },
        SourceTzOffsetDateTimeTimezoneModeDisplay_Local: {
            id: StringId.SourceTzOffsetDateTimeTimezoneModeDisplay_Local, translations: {
                en: 'Local',
            }
        },
        SourceTzOffsetDateTimeTimezoneModeDescription_Local: {
            id: StringId.SourceTzOffsetDateTimeTimezoneModeDescription_Local, translations: {
                en: 'Display times according to your local timezone',
            }
        },
        SourceTzOffsetDateTimeTimezoneModeDisplay_Source: {
            id: StringId.SourceTzOffsetDateTimeTimezoneModeDisplay_Source, translations: {
                en: 'Source',
            }
        },
        SourceTzOffsetDateTimeTimezoneModeDescription_Source: {
            id: StringId.SourceTzOffsetDateTimeTimezoneModeDescription_Source, translations: {
                en: 'Display times according to the timezone of the source (normally the exchange\'s timezone)',
            }
        },
        ChartHistoryIntervalUnitDisplay_Trade: {
            id: StringId.ChartHistoryIntervalUnitDisplay_Trade, translations: {
                en: 'Trade',
            }
        },
        ChartHistoryIntervalUnitDisplay_Millisecond: {
            id: StringId.ChartHistoryIntervalUnitDisplay_Millisecond, translations: {
                en: 'Millisecond',
            }
        },
        ChartHistoryIntervalUnitDisplay_Day: {
            id: StringId.ChartHistoryIntervalUnitDisplay_Day, translations: {
                en: 'Day',
            }
        },
        ChartHistoryIntervalUnitDisplay_Week: {
            id: StringId.ChartHistoryIntervalUnitDisplay_Week, translations: {
                en: 'Week',
            }
        },
        ChartHistoryIntervalUnitDisplay_Month: {
            id: StringId.ChartHistoryIntervalUnitDisplay_Month, translations: {
                en: 'Month',
            }
        },
        ChartHistoryIntervalUnitDisplay_Year: {
            id: StringId.ChartHistoryIntervalUnitDisplay_Year, translations: {
                en: 'Year',
            }
        },
        ChartHistoryIntervalPresetDisplay_Trade: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Trade, translations: {
                en: 'Trade',
            }
        },
        ChartHistoryIntervalPresetDisplay_OneSecond: {
            id: StringId.ChartHistoryIntervalPresetDisplay_OneSecond, translations: {
                en: 'OneSecond',
            }
        },
        ChartHistoryIntervalPresetDisplay_OneMinute: {
            id: StringId.ChartHistoryIntervalPresetDisplay_OneMinute, translations: {
                en: 'OneMinute',
            }
        },
        ChartHistoryIntervalPresetDisplay_FiveMinutes: {
            id: StringId.ChartHistoryIntervalPresetDisplay_FiveMinutes, translations: {
                en: 'FiveMinutes',
            }
        },
        ChartHistoryIntervalPresetDisplay_FifteenMinutes: {
            id: StringId.ChartHistoryIntervalPresetDisplay_FifteenMinutes, translations: {
                en: 'FifteenMinutes',
            }
        },
        ChartHistoryIntervalPresetDisplay_ThirtyMinutes: {
            id: StringId.ChartHistoryIntervalPresetDisplay_ThirtyMinutes, translations: {
                en: 'ThirtyMinutes',
            }
        },
        ChartHistoryIntervalPresetDisplay_Hourly: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Hourly, translations: {
                en: 'Hourly',
            }
        },
        ChartHistoryIntervalPresetDisplay_Daily: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Daily, translations: {
                en: 'Daily',
            }
        },
        ChartHistoryIntervalPresetDisplay_Weekly: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Weekly, translations: {
                en: 'Weekly',
            }
        },
        ChartHistoryIntervalPresetDisplay_Monthly: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Monthly, translations: {
                en: 'Monthly',
            }
        },
        ChartHistoryIntervalPresetDisplay_Quarterly: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Quarterly, translations: {
                en: 'Quarterly',
            }
        },
        ChartHistoryIntervalPresetDisplay_Yearly: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Yearly, translations: {
                en: 'Yearly',
            }
        },
        ChartHistoryIntervalPresetDisplay_Custom: {
            id: StringId.ChartHistoryIntervalPresetDisplay_Custom, translations: {
                en: 'Custom',
            }
        },
        ChartIntervalDisplay_OneMinute: {
            id: StringId.ChartIntervalDisplay_OneMinute, translations: {
                en: '1 Minute',
            }
        },
        ChartIntervalDisplay_FiveMinutes: {
            id: StringId.ChartIntervalDisplay_FiveMinutes, translations: {
                en: '5 Minutes',
            }
        },
        ChartIntervalDisplay_FifteenMinutes: {
            id: StringId.ChartIntervalDisplay_FifteenMinutes, translations: {
                en: '15 Minutes',
            }
        },
        ChartIntervalDisplay_ThirtyMinutes: {
            id: StringId.ChartIntervalDisplay_ThirtyMinutes, translations: {
                en: '30 Minutes',
            }
        },
        ChartIntervalDisplay_OneDay: {
            id: StringId.ChartIntervalDisplay_OneDay, translations: {
                en: '1 Day',
            }
        },
        DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_ChartHistory: {
            id: StringId.DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_ChartHistory, translations: {
                en: 'Chart history',
            }
        },
        DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_Trades: {
            id: StringId.DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_Trades, translations: {
                en: 'Trades',
            }
        },
        DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_Security: {
            id: StringId.DataIvemIdPriceVolumeSequenceHistoryResourceDisplay_Security, translations: {
                en: 'Security',
            }
        },
        DayTradesDataItemRecordTypeIdDisplay_Trade: {
            id: StringId.DayTradesDataItemRecordTypeIdDisplay_Trade, translations: {
                en: 'Trade',
            }
        },
        DayTradesDataItemRecordTypeIdDisplay_Canceller: {
            id: StringId.DayTradesDataItemRecordTypeIdDisplay_Canceller, translations: {
                en: 'Canceller',
            }
        },
        DayTradesDataItemRecordTypeIdDisplay_Cancelled: {
            id: StringId.DayTradesDataItemRecordTypeIdDisplay_Cancelled, translations: {
                en: 'Cancelled',
            }
        },
        // InternalCommandDisplay_Null: {
        //     id: StringId.InternalCommandDisplay_Null, translations: {
        //         en: '',
        //     }
        // },
        InternalCommandDisplay_ChildMenu: {
            id: StringId.InternalCommandDisplay_ChildMenu, translations: {
                en: 'Child Menu',
            }
        },
        InternalCommandDisplay_MenuDivider: {
            id: StringId.InternalCommandDisplay_MenuDivider, translations: {
                en: 'Divider',
            }
        },
        DitemCommandDisplay_ToggleSecurityLinking: {
            id: StringId.DitemCommandDisplay_ToggleSecurityLinking, translations: {
                en: 'Toggle security linking',
            }
        },
        DitemCommandDisplay_SetSecurityLinking: {
            id: StringId.DitemCommandDisplay_SetSecurityLinking, translations: {
                en: 'Set security linking',
            }
        },
        DitemCommandDisplay_ToggleAccountLinking: {
            id: StringId.DitemCommandDisplay_ToggleAccountLinking, translations: {
                en: 'Toggle account linking',
            }
        },
        DitemCommandDisplay_SetAccountLinking: {
            id: StringId.DitemCommandDisplay_SetAccountLinking, translations: {
                en: 'Set account linking',
            }
        },
        MenuDisplay_Price: {
            id: StringId.MenuDisplay_Price, translations: {
                en: 'Price',
            }
        },
        MenuAccessKey_Price: {
            id: StringId.MenuAccessKey_Price, translations: {
                en: 'P',
            }
        },
        MenuDisplay_Trading: {
            id: StringId.MenuDisplay_Trading, translations: {
                en: 'Trading',
            }
        },
        MenuAccessKey_Trading: {
            id: StringId.MenuAccessKey_Trading, translations: {
                en: 'T',
            }
        },
        MenuDisplay_Commands: {
            id: StringId.MenuDisplay_Commands, translations: {
                en: 'Commands',
            }
        },
        MenuAccessKey_Commands: {
            id: StringId.MenuAccessKey_Commands, translations: {
                en: 'C',
            }
        },
        MenuDisplay_Tools: {
            id: StringId.MenuDisplay_Tools, translations: {
                en: 'Tools',
            }
        },
        MenuAccessKey_Tools: {
            id: StringId.MenuAccessKey_Tools, translations: {
                en: 'T',
            }
        },
        MenuDisplay_Help: {
            id: StringId.MenuDisplay_Help, translations: {
                en: 'Help',
            }
        },
        MenuAccessKey_Help: {
            id: StringId.MenuAccessKey_Help, translations: {
                en: 'H',
            }
        },
        DitemMenuDisplay_Placeholder: {
            id: StringId.DitemMenuDisplay_Placeholder, translations: {
                en: 'Placeholder',
            }
        },
        DitemMenuDisplay_Extensions: {
            id: StringId.DitemMenuDisplay_Extensions, translations: {
                en: 'Extensions',
            }
        },
        DitemMenuDisplay_Symbols: {
            id: StringId.DitemMenuDisplay_Symbols, translations: {
                en: 'Symbols',
            }
        },
        DitemMenuDisplay_DepthAndTrades: {
            id: StringId.DitemMenuDisplay_DepthAndTrades, translations: {
                en: 'Depth & Trades',
            }
        },
        DitemMenuDisplay_Watchlist: {
            id: StringId.DitemMenuDisplay_Watchlist, translations: {
                en: 'Watchlist',
            }
        },
        DitemMenuDisplay_Depth: {
            id: StringId.DitemMenuDisplay_Depth, translations: {
                en: 'Depth',
            }
        },
        DitemMenuDisplay_NewsHeadlines: {
            id: StringId.DitemMenuDisplay_NewsHeadlines, translations: {
                en: 'News Headlines (demo)',
            }
        },
        DitemMenuDisplay_NewsBody: {
            id: StringId.DitemMenuDisplay_NewsBody, translations: {
                en: 'News Body',
            }
        },
        DitemMenuDisplay_NotificationChannels: {
            id: StringId.DitemMenuDisplay_NotificationChannels, translations: {
                en: 'Notifications',
            }
        },
        DitemMenuDisplay_Scans: {
            id: StringId.DitemMenuDisplay_Scans, translations: {
                en: 'Scans',
            }
        },
        DitemMenuDisplay_Alerts: {
            id: StringId.DitemMenuDisplay_Alerts, translations: {
                en: 'Alerts (demo)',
            }
        },
        DitemMenuDisplay_Search: {
            id: StringId.DitemMenuDisplay_Search, translations: {
                en: 'Search (demo)',
            }
        },
        DitemMenuDisplay_AdvertWebPage: {
            id: StringId.DitemMenuDisplay_AdvertWebPage, translations: {
                en: 'Advertisement Web Page',
            }
        },
        DitemMenuDisplay_TopShareholders: {
            id: StringId.DitemMenuDisplay_TopShareholders, translations: {
                en: 'Top Shareholders',
            }
        },
        DitemMenuDisplay_Status: {
            id: StringId.DitemMenuDisplay_Status, translations: {
                en: 'Status',
            }
        },
        DitemMenuDisplay_Trades: {
            id: StringId.DitemMenuDisplay_Trades, translations: {
                en: 'Trades',
            }
        },
        DitemMenuDisplay_OrderRequest: {
            id: StringId.DitemMenuDisplay_OrderRequest, translations: {
                en: 'Order Request',
            }
        },
        DitemMenuDisplay_BrokerageAccounts: {
            id: StringId.DitemMenuDisplay_BrokerageAccounts, translations: {
                en: 'Brokerage Accounts',
            }
        },
        DitemMenuDisplay_Orders: {
            id: StringId.DitemMenuDisplay_Orders, translations: {
                en: 'Orders',
            }
        },
        DitemMenuDisplay_OrderAuthorise: {
            id: StringId.DitemMenuDisplay_OrderAuthorise, translations: {
                en: 'Authorise',
            }
        },
        DitemMenuDisplay_Holdings: {
            id: StringId.DitemMenuDisplay_Holdings, translations: {
                en: 'Holdings',
            }
        },
        DitemMenuDisplay_Balances: {
            id: StringId.DitemMenuDisplay_Balances, translations: {
                en: 'Balances',
            }
        },
        DitemMenuDisplay_Settings: {
            id: StringId.DitemMenuDisplay_Settings, translations: {
                en: 'Settings',
            }
        },
        DitemMenuDisplay_Diagnostics: {
            id: StringId.DitemMenuDisplay_Diagnostics, translations: {
                en: 'Diagnostics',
            }
        },
        DitemMenuDisplay_EtoPriceQuotation: {
            id: StringId.DitemMenuDisplay_EtoPriceQuotation, translations: {
                en: 'ETO Price',
            }
        },
        DitemMenuDisplay_GeneralWebPage: {
            id: StringId.DitemMenuDisplay_GeneralWebPage, translations: {
                en: 'Web Page',
            }
        },
        DitemMenuDisplay_BrandingSplashWebPage: {
            id: StringId.DitemMenuDisplay_BrandingSplashWebPage, translations: {
                en: 'Splash',
            }
        },
        DitemMenuDisplay_OrderRequest_Buy: {
            id: StringId.DitemMenuDisplay_OrderRequest_Buy, translations: {
                en: 'New Buy Order',
            }
        },
        DitemMenuDisplay_OrderRequest_Sell: {
            id: StringId.DitemMenuDisplay_OrderRequest_Sell, translations: {
                en: 'New Sell Order',
            }
        },
        Desktop_AboutAdvertisingCaption: {
            id: StringId.Desktop_AboutAdvertisingCaption, translations: {
                en: 'About Advertising',
            }
        },
        Desktop_SaveLayoutCaption: {
            id: StringId.Desktop_SaveLayoutCaption, translations: {
                en: 'Save Layout',
            }
        },
        Desktop_ResetLayoutCaption: {
            id: StringId.Desktop_ResetLayoutCaption, translations: {
                en: 'Reset Layout',
            }
        },
        Desktop_SignOutCaption: {
            id: StringId.Desktop_SignOutCaption, translations: {
                en: 'Sign Out',
            }
        },
        ZenithWebsocketCloseCodeId_NormalClosure: {
            id: StringId.ZenithWebsocketCloseCodeId_NormalClosure, translations: {
                en: 'Normal closure',
            }
        },
        ZenithWebsocketCloseCodeId_GoingAway: {
            id: StringId.ZenithWebsocketCloseCodeId_GoingAway, translations: {
                en: 'Going away',
            }
        },
        ZenithWebsocketCloseCodeId_ProtocolError: {
            id: StringId.ZenithWebsocketCloseCodeId_ProtocolError, translations: {
                en: 'Protocol error',
            }
        },
        ZenithWebsocketCloseCodeId_UnsupportedData: {
            id: StringId.ZenithWebsocketCloseCodeId_UnsupportedData, translations: {
                en: 'Unsupported data',
            }
        },
        ZenithWebsocketCloseCodeId_NoStatusReceived: {
            id: StringId.ZenithWebsocketCloseCodeId_NoStatusReceived, translations: {
                en: 'No status received',
            }
        },
        ZenithWebsocketCloseCodeId_AbnormalClosure: {
            id: StringId.ZenithWebsocketCloseCodeId_AbnormalClosure, translations: {
                en: 'Abnormal closure',
            }
        },
        ZenithWebsocketCloseCodeId_InvalidFramePayloadData: {
            id: StringId.ZenithWebsocketCloseCodeId_InvalidFramePayloadData, translations: {
                en: 'Invalid frame payload data',
            }
        },
        ZenithWebsocketCloseCodeId_PolicyViolation: {
            id: StringId.ZenithWebsocketCloseCodeId_PolicyViolation, translations: {
                en: 'Policy violation (ping failure)',
            }
        },
        ZenithWebsocketCloseCodeId_MessageTooBig: {
            id: StringId.ZenithWebsocketCloseCodeId_MessageTooBig, translations: {
                en: 'Message too big',
            }
        },
        ZenithWebsocketCloseCodeId_MissingExtension: {
            id: StringId.ZenithWebsocketCloseCodeId_MissingExtension, translations: {
                en: 'Missing extension',
            }
        },
        ZenithWebsocketCloseCodeId_ServerError: {
            id: StringId.ZenithWebsocketCloseCodeId_ServerError, translations: {
                en: 'Server error',
            }
        },
        ZenithWebsocketCloseCodeId_ServerRestart: {
            id: StringId.ZenithWebsocketCloseCodeId_ServerRestart, translations: {
                en: 'Server restart',
            }
        },
        ZenithWebsocketCloseCodeId_TryAgainLater: {
            id: StringId.ZenithWebsocketCloseCodeId_TryAgainLater, translations: {
                en: 'Try again later',
            }
        },
        ZenithWebsocketCloseCodeId_BadGateway: {
            id: StringId.ZenithWebsocketCloseCodeId_BadGateway, translations: {
                en: 'Bad gateway',
            }
        },
        ZenithWebsocketCloseCodeId_TlsHandshake: {
            id: StringId.ZenithWebsocketCloseCodeId_TlsHandshake, translations: {
                en: 'TLS Handshake',
            }
        },
        ZenithWebsocketCloseCodeId_Session: {
            id: StringId.ZenithWebsocketCloseCodeId_Session, translations: {
                en: 'Session (Logged in elsewhere)',
            }
        },
        NotCurrentVersion_NotRunningCurrentVersion: {
            id: StringId.NotCurrentVersion_NotRunningCurrentVersion, translations: {
                en: 'You are not running the current version of Motif',
            }
        },
        NotCurrentVersion_CurrentCaption: {
            id: StringId.NotCurrentVersion_CurrentCaption, translations: {
                en: 'Current',
            }
        },
        NotCurrentVersion_RunningCaption: {
            id: StringId.NotCurrentVersion_RunningCaption, translations: {
                en: 'Running',
            }
        },
        NotCurrentVersion_ClickButtonToAttemptLoadCurrentText: {
            id: StringId.NotCurrentVersion_ClickButtonToAttemptLoadCurrentText, translations: {
                en: 'Click this button to try to load the latest version',
            }
        },
        NotCurrentVersion_ReloadAppCaption: {
            id: StringId.NotCurrentVersion_ReloadAppCaption, translations: {
                en: 'Reload App',
            }
        },
        NotCurrentVersion_MoreInfo: {
            id: StringId.NotCurrentVersion_MoreInfo, translations: {
                en: 'For more information see ???',
            }
        },
        Extensions_ExtensionNotInstalledOrEnabled: {
            id: StringId.Extensions_ExtensionNotInstalledOrEnabled, translations: {
                en: 'Extension not installed or enabled',
            }
        },
        Extensions_LocalDesktopNotLoaded: {
            id: StringId.Extensions_LocalDesktopNotLoaded, translations: {
                en: 'Extension local desktop not loaded',
            }
        },
        Extensions_ExtensionDidNotCreateComponent: {
            id: StringId.Extensions_ExtensionDidNotCreateComponent, translations: {
                en: 'Extension did not create component',
            }
        },
        Extensions_DownloadTimeout: {
            id: StringId.Extensions_DownloadTimeout, translations: {
                en: 'Download timeout',
            }
        },
        Extensions_ExtensionInstallCaption: {
            id: StringId.Extensions_ExtensionInstallCaption, translations: {
                en: 'Install',
            }
        },
        Extensions_ExtensionUninstallCaption: {
            id: StringId.Extensions_ExtensionUninstallCaption, translations: {
                en: 'Uninstall',
            }
        },
        Extensions_ExtensionEnableCaption: {
            id: StringId.Extensions_ExtensionEnableCaption, translations: {
                en: 'Enable',
            }
        },
        Extensions_ExtensionDisableCaption: {
            id: StringId.Extensions_ExtensionDisableCaption, translations: {
                en: 'Disable',
            }
        },
        Extensions_AvailableExtensionsHeadingCaption: {
            id: StringId.Extensions_AvailableExtensionsHeadingCaption, translations: {
                en: 'AVAILABLE'
            }
        },
        Extensions_InstalledExtensionsHeadingCaption: {
            id: StringId.Extensions_InstalledExtensionsHeadingCaption, translations: {
                en: 'INSTALLED'
            }
        },
        PlaceholderDitem_ComponentStateNotSpecified: {
            id: StringId.PlaceholderDitem_ComponentStateNotSpecified, translations: {
                en: 'Component state not specified',
            }
        },
        PlaceholderDitem_ComponentStateIsInvalid: {
            id: StringId.PlaceholderDitem_ComponentStateIsInvalid, translations: {
                en: 'Component state is invalid',
            }
        },
        PlaceholderDitem_ComponentIsNotAvailable: {
            id: StringId.PlaceholderDitem_ComponentIsNotAvailable, translations: {
                en: 'Component is not available',
            }
        },
        PlaceholderDitem_PlaceheldExtensionPublisherCaption: {
            id: StringId.PlaceholderDitem_PlaceheldExtensionPublisherCaption, translations: {
                en: 'Publisher',
            }
        },
        PlaceholderDitem_PlaceheldExtensionNameCaption: {
            id: StringId.PlaceholderDitem_PlaceheldExtensionNameCaption, translations: {
                en: 'Extension',
            }
        },
        PlaceholderDitem_PlaceheldConstructionMethodCaption: {
            id: StringId.PlaceholderDitem_PlaceheldConstructionMethodCaption, translations: {
                en: 'Construction',
            }
        },
        PlaceholderDitem_PlaceheldComponentTypeNameCaption: {
            id: StringId.PlaceholderDitem_PlaceheldComponentTypeNameCaption, translations: {
                en: 'Component Type',
            }
        },
        PlaceholderDitem_PlaceheldComponentStateCaption: {
            id: StringId.PlaceholderDitem_PlaceheldComponentStateCaption, translations: {
                en: 'Component State',
            }
        },
        PlaceholderDitem_PlaceheldReasonCaption: {
            id: StringId.PlaceholderDitem_PlaceheldReasonCaption, translations: {
                en: 'Reason',
            }
        },
        PlaceholderDitem_InvalidCaption: {
            id: StringId.PlaceholderDitem_InvalidCaption, translations: {
                en: 'Invalid',
            }
        },
        PublisherTypeId_Display_Invalid: {
            id: StringId.PublisherTypeId_Display_Invalid, translations: {
                en: 'Invalid',
            }
        },
        PublisherTypeId_Abbreviation_Invalid: {
            id: StringId.PublisherTypeId_Abbreviation_Invalid, translations: {
                en: 'I',
            }
        },
        PublisherTypeId_Display_Builtin: {
            id: StringId.PublisherTypeId_Display_Builtin, translations: {
                en: 'Builtin',
            }
        },
        PublisherTypeId_Abbreviation_Builtin: {
            id: StringId.PublisherTypeId_Abbreviation_Builtin, translations: {
                en: 'B',
            }
        },
        PublisherTypeId_Display_User: {
            id: StringId.PublisherTypeId_Display_User, translations: {
                en: 'User',
            }
        },
        PublisherTypeId_Abbreviation_User: {
            id: StringId.PublisherTypeId_Abbreviation_User, translations: {
                en: 'U',
            }
        },
        PublisherTypeId_Display_Organisation: {
            id: StringId.PublisherTypeId_Display_Organisation, translations: {
                en: 'Organisation',
            }
        },
        PublisherTypeId_Abbreviation_Organisation: {
            id: StringId.PublisherTypeId_Abbreviation_Organisation, translations: {
                en: 'O',
            }
        },
        CommandContextDisplay_Root: {
            id: StringId.CommandContextDisplay_Root, translations: {
                en: 'Root',
            }
        },
        DataMarketsNgComponent_withBoardsListCaption: {
            id: StringId.DataMarketsNgComponent_withBoardsListCaption, translations: {
                en: 'With boards',
            }
        },
        DataMarketsNgComponent_withBoardsListTitle: {
            id: StringId.DataMarketsNgComponent_withBoardsListTitle, translations: {
                en: 'Display data markets with associated market boards',
            }
        },
        StatusDitem_Summary: {
            id: StringId.StatusDitem_Summary, translations: {
                en: 'Summary',
            }
        },
        StatusDitem_Feeds: {
            id: StringId.StatusDitem_Feeds, translations: {
                en: 'Feeds',
            }
        },
        StatusDitem_ExchangeEnvironments: {
            id: StringId.StatusDitem_ExchangeEnvironments, translations: {
                en: 'Exchange environments',
            }
        },
        StatusDitem_Exchanges: {
            id: StringId.StatusDitem_Exchanges, translations: {
                en: 'Exchanges',
            }
        },
        StatusDitem_DataMarkets: {
            id: StringId.StatusDitem_DataMarkets, translations: {
                en: 'Data markets',
            }
        },
        StatusDitem_TradingMarkets: {
            id: StringId.StatusDitem_TradingMarkets, translations: {
                en: 'Trading markets',
            }
        },
        StatusDitem_MarketBoards: {
            id: StringId.StatusDitem_MarketBoards, translations: {
                en: 'Market boards',
            }
        },
        StatusDitem_Zenith: {
            id: StringId.StatusDitem_Zenith, translations: {
                en: 'Zenith',
            }
        },
        SearchDitem_CategoryCaption: {
            id: StringId.SearchDitem_CategoryCaption, translations: {
                en: 'Category',
            }
        },
        SearchDitem_CategoryTitle: {
            id: StringId.SearchDitem_CategoryTitle, translations: {
                en: 'Select category to search',
            }
        },
        SearchDitem_LocationCaption: {
            id: StringId.SearchDitem_LocationCaption, translations: {
                en: 'Location',
            }
        },
        SearchDitem_LocationTitle: {
            id: StringId.SearchDitem_LocationTitle, translations: {
                en: 'Select holiday location',
            }
        },
        SearchDitem_PriceRangeCaption: {
            id: StringId.SearchDitem_PriceRangeCaption, translations: {
                en: 'Price Range',
            }
        },
        SearchDitem_PriceRangeTitle: {
            id: StringId.SearchDitem_PriceRangeTitle, translations: {
                en: 'Select your price range',
            }
        },
        SearchDitem_KeywordsCaption: {
            id: StringId.SearchDitem_KeywordsCaption, translations: {
                en: 'Keywords',
            }
        },
        SearchDitem_KeywordsTitle: {
            id: StringId.SearchDitem_KeywordsTitle, translations: {
                en: 'Specify some keywords to better target your search',
            }
        },
        SearchDitem_SearchCaption: {
            id: StringId.SearchDitem_SearchCaption, translations: {
                en: 'Search',
            }
        },
        SearchDitem_SearchTitle: {
            id: StringId.SearchDitem_SearchTitle, translations: {
                en: 'Run search',
            }
        },
        SearchDitem_AlertCaption: {
            id: StringId.SearchDitem_AlertCaption, translations: {
                en: 'Alert',
            }
        },
        SearchDitem_AlertTitle: {
            id: StringId.SearchDitem_AlertTitle, translations: {
                en: 'Create alerts for this search',
            }
        },
        SearchDitem_SearchDescriptionTitle: {
            id: StringId.SearchDitem_SearchDescriptionTitle, translations: {
                en: 'Search description',
            }
        },
        SearchDitem_Category_HolidayCaption: {
            id: StringId.SearchDitem_Category_HolidayCaption, translations: {
                en: 'Holiday',
            }
        },
        SearchDitem_Category_HolidayTitle: {
            id: StringId.SearchDitem_Category_HolidayTitle, translations: {
                en: 'Holiday',
            }
        },
        SearchDitem_Location_UsArizonaCaption: {
            id: StringId.SearchDitem_Location_UsArizonaCaption, translations: {
                en: 'USA - Arizona',
            }
        },
        SearchDitem_Location_UsArizonaTitle: {
            id: StringId.SearchDitem_Location_UsArizonaTitle, translations: {
                en: 'Holidays in Arizona, USA',
            }
        },
        SearchDitem_PriceRange_10000To20000Caption: {
            id: StringId.SearchDitem_PriceRange_10000To20000Caption, translations: {
                en: '10000 - 20000',
            }
        },
        SearchDitem_PriceRange_10000To20000Title: {
            id: StringId.SearchDitem_PriceRange_10000To20000Title, translations: {
                en: '10000 - 20000',
            }
        },
        AdvertTicker_InterestedTitle: {
            id: StringId.AdvertTicker_InterestedTitle, translations: {
                en: 'Register interest in current advertisement',
            }
        },
        BannerAdvert_ContactMeTitle: {
            id: StringId.BannerAdvert_ContactMeTitle, translations: {
                en: 'Request to be contacted regarding the current advertisement',
            }
        },
        BannerAdvert_InterestedTitle: {
            id: StringId.BannerAdvert_InterestedTitle, translations: {
                en: 'I am interested in the product/service currently being advertised',
            }
        },
        BannerAdvert_SimilarTitle: {
            id: StringId.BannerAdvert_SimilarTitle, translations: {
                en: 'I am interested in products/services similar to that currently being advertised',
            }
        },
        BannerAdvert_NotInterestedTitle: {
            id: StringId.BannerAdvert_NotInterestedTitle, translations: {
                en: 'I am NOT interested in the product/service currently being advertised',
            }
        },
        ScanFormulaZenithEncodingError_InvalidJson: {
            id: StringId.ScanFormulaZenithEncodingError_InvalidJson, translations: {
                en: 'Invalid JSON',
            }
        },
        ScanFormulaZenithEncodingError_BooleanTupleNodeIsNotAnArray: {
            id: StringId.ScanFormulaZenithEncodingError_BooleanTupleNodeIsNotAnArray, translations: {
                en: 'Boolean tuple node is not an array',
            }
        },
        ScanFormulaZenithEncodingError_BooleanTupleNodeArrayIsZeroLength: {
            id: StringId.ScanFormulaZenithEncodingError_BooleanTupleNodeArrayIsZeroLength, translations: {
                en: 'Boolean tuple node array is zero length',
            }
        },
        ScanFormulaZenithEncodingError_BooleanTupleNodeTypeIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_BooleanTupleNodeTypeIsNotString, translations: {
                en: 'Boolean tuple node type is not string',
            }
        },
        ScanFormulaZenithEncodingError_UnknownField: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownField, translations: {
                en: 'Unknown field',
            }
        },
        ScanFormulaZenithEncodingError_SingleOperandLogicalBooleanDoesNotHaveOneOperand: {
            id: StringId.ScanFormulaZenithEncodingError_SingleOperandLogicalBooleanDoesNotHaveOneOperand, translations: {
                en: 'Logical boolean does not have one operand'
            }
        },
        ScanFormulaZenithEncodingError_LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands: {
            id: StringId.ScanFormulaZenithEncodingError_LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands, translations: {
                en: 'Logical boolean does not have two operands'
            }
        },
        ScanFormulaZenithEncodingError_MultiOperandLogicalBooleanMissingOperands: {
            id: StringId.ScanFormulaZenithEncodingError_MultiOperandLogicalBooleanMissingOperands, translations: {
                en: 'Logical boolean missing operands',
            }
        },
        ScanFormulaZenithEncodingError_MultipleMatchingTupleNodeMissingParameters: {
            id: StringId.ScanFormulaZenithEncodingError_MultipleMatchingTupleNodeMissingParameters, translations: {
                en: 'Multiple matching tuple node missing parameters',
            }
        },
        ScanFormulaZenithEncodingError_TextMultipleMatchingTupleNodeParameterIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_TextMultipleMatchingTupleNodeParameterIsNotString, translations: {
                en: 'Text multiple matching tuple node parameter is not a string',
            }
        },
        ScanFormulaZenithEncodingError_LogicalBooleanMissingOperand: {
            id: StringId.ScanFormulaZenithEncodingError_LogicalBooleanMissingOperand, translations: {
                en: 'Logical boolean missing operand',
            }
        },
        ScanFormulaZenithEncodingError_NumericComparisonDoesNotHave2Operands: {
            id: StringId.ScanFormulaZenithEncodingError_NumericComparisonDoesNotHave2Operands, translations: {
                en: 'Numeric comparison does not have 2 operands',
            }
        },
        ScanFormulaZenithEncodingError_NumericParameterIsNotNumberOrComparableFieldOrArray: {
            id: StringId.ScanFormulaZenithEncodingError_NumericParameterIsNotNumberOrComparableFieldOrArray, translations: {
                en: 'Numeric parameter is not number or comparable field or array',
            }
        },
        ScanFormulaZenithEncodingError_UnexpectedBooleanParamType: {
            id: StringId.ScanFormulaZenithEncodingError_UnexpectedBooleanParamType, translations: {
                en: 'Unexpected boolean parameter type',
            }
        },
        ScanFormulaZenithEncodingError_UnknownFieldBooleanParam: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownFieldBooleanParam, translations: {
                en: 'Unknown field boolean parameter',
            }
        },
        ScanFormulaZenithEncodingError_FieldBooleanParamCannotBeSubbedField: {
            id: StringId.ScanFormulaZenithEncodingError_FieldBooleanParamCannotBeSubbedField, translations: {
                en: 'Field boolean parameter cannot be subbed field',
            }
        },
        ScanFormulaZenithEncodingError_SubFieldIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_SubFieldIsNotString, translations: {
                en: 'Sub-field is not string',
            }
        },
        ScanFormulaZenithEncodingError_PriceSubFieldHasValueSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_PriceSubFieldHasValueSubFieldIsUnknown, translations: {
                en: 'Price sub-field has value sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_DateSubFieldHasValueSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_DateSubFieldHasValueSubFieldIsUnknown, translations: {
                en: 'Date sub-field has value sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_AltCodeSubFieldHasValueSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_AltCodeSubFieldHasValueSubFieldIsUnknown, translations: {
                en: 'AltCode sub-field has value sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_AttributeSubFieldHasValueSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_AttributeSubFieldHasValueSubFieldIsUnknown, translations: {
                en: 'Attribute sub-field has value sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_TargetIsNotNumber: {
            id: StringId.ScanFormulaZenithEncodingError_TargetIsNotNumber, translations: {
                en: 'Target is not a number',
            }
        },
        ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotNumber: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotNumber, translations: {
                en: 'Range minimum is defined but not a number',
            }
        },
        ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotNumber: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotNumber, translations: {
                en: 'Range maximum is defined but not a number',
            }
        },
        ScanFormulaZenithEncodingError_RangeMinAndMaxAreBothUndefined: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMinAndMaxAreBothUndefined, translations: {
                en: 'Range minimum and maximum are both undefined',
            }
        },
        ScanFormulaZenithEncodingError_DateFieldEqualsTargetIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_DateFieldEqualsTargetIsNotString, translations: {
                en: 'Date field equals target is not a string',
            }
        },
        ScanFormulaZenithEncodingError_TextSubFieldIsMissing: {
            id: StringId.ScanFormulaZenithEncodingError_TextSubFieldIsMissing, translations: {
                en: 'Text sub field is missing',
            }
        },
        ScanFormulaZenithEncodingError_TextFieldContainsValueIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_TextFieldContainsValueIsNotString, translations: {
                en: 'Text field contains value is not a string',
            }
        },
        ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotString, translations: {
                en: 'Text field contains as is not a string',
            }
        },
        ScanFormulaZenithEncodingError_TextFieldContainsAsHasInvalidFormat: {
            id: StringId.ScanFormulaZenithEncodingError_TextFieldContainsAsHasInvalidFormat, translations: {
                en: 'Text field contains as has invalid format',
            }
        },
        ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotBoolean: {
            id: StringId.ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotBoolean, translations: {
                en: 'Text field contains as is not a boolean',
            }
        },
        ScanFormulaZenithEncodingError_SingleFieldMustHaveOneParameter: {
            id: StringId.ScanFormulaZenithEncodingError_SingleFieldMustHaveOneParameter, translations: {
                en: 'Single field must have one parameter',
            }
        },
        ScanFormulaZenithEncodingError_PriceSubFieldEqualsSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_PriceSubFieldEqualsSubFieldIsUnknown, translations: {
                en: 'Price sub-field equals sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_DateSubFieldEqualsSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_DateSubFieldEqualsSubFieldIsUnknown, translations: {
                en: 'Date sub-field equals sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_DateSubFieldEqualsTargetIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_DateSubFieldEqualsTargetIsNotString, translations: {
                en: 'Date sub-field equals target is not a string',
            }
        },
        ScanFormulaZenithEncodingError_AltCodeSubFieldContainsSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_AltCodeSubFieldContainsSubFieldIsUnknown, translations: {
                en: 'AltCode sub-field contains sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_AttributeSubFieldContainsSubFieldIsUnknown: {
            id: StringId.ScanFormulaZenithEncodingError_AttributeSubFieldContainsSubFieldIsUnknown, translations: {
                en: 'Attribute sub-field contains sub-field is unknown',
            }
        },
        ScanFormulaZenithEncodingError_TargetHasInvalidDateFormat: {
            id: StringId.ScanFormulaZenithEncodingError_TargetHasInvalidDateFormat, translations: {
                en: 'Target has invalid date format',
            }
        },
        ScanFormulaZenithEncodingError_RangeSubFieldIsMissing: {
            id: StringId.ScanFormulaZenithEncodingError_RangeSubFieldIsMissing, translations: {
                en: 'Range sub field is missing',
            }
        },
        ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotString: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotString, translations: {
                en: 'Range minimum is defined but not a string',
            }
        },
        ScanFormulaZenithEncodingError_RangeMinHasInvalidDateFormat: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMinHasInvalidDateFormat, translations: {
                en: 'Range minimum has invalid date format',
            }
        },
        ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotString: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotString, translations: {
                en: 'Range maximum is defined but not a string',
            }
        },
        ScanFormulaZenithEncodingError_RangeMaxHasInvalidDateFormat: {
            id: StringId.ScanFormulaZenithEncodingError_RangeMaxHasInvalidDateFormat, translations: {
                en: 'Range maximum has invalid date format',
            }
        },
        ScanFormulaZenithEncodingError_NamedParametersCannotBeNull: {
            id: StringId.ScanFormulaZenithEncodingError_NamedParametersCannotBeNull, translations: {
                en: 'Named parameters cannot be null',
            }
        },
        ScanFormulaZenithEncodingError_RangeFieldBooleanTupleNodeHasTooManyParameters: {
            id: StringId.ScanFormulaZenithEncodingError_RangeFieldBooleanTupleNodeHasTooManyParameters, translations: {
                en: 'Range field boolean tuple node has too many parameters',
            }
        },
        ScanFormulaZenithEncodingError_IsBooleanTupleNodeParameterIsNotBoolean: {
            id: StringId.ScanFormulaZenithEncodingError_IsBooleanTupleNodeParameterIsNotBoolean, translations: {
                en: '"Is" tuple node parameter is not boolean',
            }
        },
        ScanFormulaZenithEncodingError_IsBooleanTupleNodeHasTooManyParameters: {
            id: StringId.ScanFormulaZenithEncodingError_IsBooleanTupleNodeHasTooManyParameters, translations: {
                en: '"Is" tuple node has too many parameters',
            }
        },
        ScanFormulaZenithEncodingError_NumericTupleNodeIsZeroLength: {
            id: StringId.ScanFormulaZenithEncodingError_NumericTupleNodeIsZeroLength, translations: {
                en: 'Numeric tuple node is zero length',
            }
        },
        ScanFormulaZenithEncodingError_NumericTupleNodeTypeIsNotString: {
            id: StringId.ScanFormulaZenithEncodingError_NumericTupleNodeTypeIsNotString, translations: {
                en: 'Numeric tuple node type is not a string',
            }
        },
        ScanFormulaZenithEncodingError_NumericTupleNodeRequires2Or3Parameters: {
            id: StringId.ScanFormulaZenithEncodingError_NumericTupleNodeRequires2Or3Parameters, translations: {
                en: 'Numeric tuple node requires 2 or 3 parameters',
            }
        },
        ScanFormulaZenithEncodingError_UnaryArithmeticNumericTupleNodeRequires2Parameters: {
            id: StringId.ScanFormulaZenithEncodingError_UnaryArithmeticNumericTupleNodeRequires2Parameters, translations: {
                en: 'Unary arithmetic numeric tuple node requires 2 parameters',
            }
        },
        ScanFormulaZenithEncodingError_LeftRightArithmeticNumericTupleNodeRequires3Parameters: {
            id: StringId.ScanFormulaZenithEncodingError_LeftRightArithmeticNumericTupleNodeRequires3Parameters, translations: {
                en: 'Left right arithmetic numeric tuple node requires 3 parameters',
            }
        },
        ScanFormulaZenithEncodingError_UnknownBooleanTupleNodeType: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownBooleanTupleNodeType, translations: {
                en: 'Unknown boolean tuple node type',
            }
        },
        ScanFormulaZenithEncodingError_UnknownNumericTupleNodeType: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownNumericTupleNodeType, translations: {
                en: 'Unknown numeric tuple node type',
            }
        },
        ScanFormulaZenithEncodingError_UnknownNumericField: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownNumericField, translations: {
                en: 'Unknown numeric field',
            }
        },
        ScanFormulaZenithEncodingError_FieldBooleanParamMustBeRangeOrExistsSingle:{
            id: StringId.ScanFormulaZenithEncodingError_FieldBooleanParamMustBeRangeOrExistsSingle, translations: {
                en: 'Field boolean parameter must be range or \'exists single\'',
            }
        },
        ScanFormulaZenithEncodingError_NumericRangeFirstParameterMustBeNumberOrNamed:{
            id: StringId.ScanFormulaZenithEncodingError_NumericRangeFirstParameterMustBeNumberOrNamed, translations: {
                en: 'Numeric range first parameter must be number or named',
            }
        },
        ScanFormulaZenithEncodingError_DateRangeFirstParameterMustBeStringOrNamed:{
            id: StringId.ScanFormulaZenithEncodingError_DateRangeFirstParameterMustBeStringOrNamed, translations: {
                en: 'Date range first parameter must be string or named',
            }
        },
        ScanFormulaZenithEncodingError_TextFieldMustHaveAtLeastOneParameter:{
            id: StringId.ScanFormulaZenithEncodingError_TextFieldMustHaveAtLeastOneParameter, translations: {
                en: 'Text field must have at least one parameter',
            }
        },
        ScanFormulaZenithEncodingError_TextRangeSecondParameterMustBeStringOrNamed:{
            id: StringId.ScanFormulaZenithEncodingError_TextRangeSecondParameterMustBeStringOrNamed, translations: {
                en: 'Text range second parameter must be string or named',
            }
        },
        ScanFormulaZenithEncodingError_ExistsSingleFieldMustNotHaveMoreThan1Parameter:{
            id: StringId.ScanFormulaZenithEncodingError_ExistsSingleFieldMustNotHaveMoreThan1Parameter, translations: {
                en: '\'Exists single\' field must not have more than 1 parameter',
            }
        },
        ScanFormulaZenithEncodingError_SingleFieldParameterIsNotString:{
            id: StringId.ScanFormulaZenithEncodingError_SingleFieldParameterIsNotString, translations: {
                en: 'Single field parameter is not string',
            }
        },
        ScanFormulaZenithEncodingError_TextFieldBooleanTupleNodeHasTooManyParameters:{
            id: StringId.ScanFormulaZenithEncodingError_TextFieldBooleanTupleNodeHasTooManyParameters, translations: {
                en: 'Text field boolean tuple node has too many parameters',
            }
        },
        ScanFormulaZenithEncodingError_UnknownCurrency:{
            id: StringId.ScanFormulaZenithEncodingError_UnknownCurrency, translations: {
                en: 'Unknown currency',
            }
        },

        ScanFormulaZenithEncodingError_IfTupleNodeRequiresAtLeast4Parameters: {
            id: StringId.ScanFormulaZenithEncodingError_IfTupleNodeRequiresAtLeast4Parameters, translations: {
                en: 'If tuple node requires at least 4 parameters',
            }
        },
        ScanFormulaZenithEncodingError_IfTupleNodeRequiresAnEvenNumberOfParameters: {
            id: StringId.ScanFormulaZenithEncodingError_IfTupleNodeRequiresAnEvenNumberOfParameters, translations: {
                en: 'If tuple node requires an even number of parameters',
            }
        },
        ScanFormulaZenithEncodingError_UnknownExchange: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownExchange, translations: {
                en: 'Unknown exchange'
            }
        },
        ScanFormulaZenithEncodingError_UnknownMarket: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownMarket, translations: {
                en: 'Unknown market'
            }
        },
        ScanFormulaZenithEncodingError_UnknownMarketBoard: {
            id: StringId.ScanFormulaZenithEncodingError_UnknownMarketBoard, translations: {
                en: 'Unknown trading market board'
            }
        },
        ScanSyncStatusDisplay_Saving: {
            id: StringId.ScanSyncStatusDisplay_Saving, translations: {
                en: 'Saving',
            }
        },
        ScanSyncStatusDisplay_Behind: {
            id: StringId.ScanSyncStatusDisplay_Behind, translations: {
                en: 'Behind',
            }
        },
        ScanSyncStatusDisplay_Conflict: {
            id: StringId.ScanSyncStatusDisplay_Conflict, translations: {
                en: 'Conflict',
            }
        },
        ScanSyncStatusDisplay_InSync: {
            id: StringId.ScanSyncStatusDisplay_InSync, translations: {
                en: 'InSync',
            }
        },
        ScanStatusDisplay_Inactive: {
            id: StringId.ScanStatusDisplay_Inactive, translations: {
                en: 'Inactive',
            }
        },
        ScanStatusDisplay_Active: {
            id: StringId.ScanStatusDisplay_Active, translations: {
                en: 'Active',
            }
        },
        ScanStatusDisplay_Faulted: {
            id: StringId.ScanStatusDisplay_Faulted, translations: {
                en: 'Faulted',
            }
        },
        ScanTargetTypeDisplay_Markets: {
            id: StringId.ScanTargetTypeDisplay_Markets, translations: {
                en: 'Markets',
            }
        },
        ScanTargetTypeDisplay_Symbols: {
            id: StringId.ScanTargetTypeDisplay_Symbols, translations: {
                en: 'Symbols',
            }
        },
        ScanCriteriaTypeDisplay_Custom: {
            id: StringId.ScanCriteriaTypeDisplay_Custom, translations: {
                en: 'Custom',
            }
        },
        ScanCriteriaTypeDisplay_PriceGreaterThanValue: {
            id: StringId.ScanCriteriaTypeDisplay_PriceGreaterThanValue, translations: {
                en: 'Price > value',
            }
        },
        ScanCriteriaTypeDisplay_PriceLessThanValue: {
            id: StringId.ScanCriteriaTypeDisplay_PriceLessThanValue, translations: {
                en: 'Price < value',
            }
        },
        ScanCriteriaTypeDisplay_TodayPriceIncreaseGreaterThanPercentage: {
            id: StringId.ScanCriteriaTypeDisplay_TodayPriceIncreaseGreaterThanPercentage, translations: {
                en: 'Today price increase > percentage',
            }
        },
        ScanCriteriaTypeDisplay_TodayPriceDecreaseGreaterThanPercentage: {
            id: StringId.ScanCriteriaTypeDisplay_TodayPriceDecreaseGreaterThanPercentage, translations: {
                en: 'Today price decrease > percentage',
            }
        },
        ScanCriteriaViewDisplay_FieldSet: {
            id: StringId.ScanCriteriaViewDisplay_FieldSet, translations: {
                en: 'Fields',
            }
        },
        ScanCriteriaViewDescription_FieldSet: {
            id: StringId.ScanCriteriaViewDescription_FieldSet, translations: {
                en: 'View/edit scan criteria fields',
            }
        },
        ScanCriteriaViewDisplay_ConditionSet: {
            id: StringId.ScanCriteriaViewDisplay_ConditionSet, translations: {
                en: 'Conditions',
            }
        },
        ScanCriteriaViewDescription_ConditionSet: {
            id: StringId.ScanCriteriaViewDescription_ConditionSet, translations: {
                en: 'View/edit scan criteria conditions',
            }
        },
        ScanCriteriaViewDisplay_Zenith: {
            id: StringId.ScanCriteriaViewDisplay_Zenith, translations: {
                en: 'Zenith',
            }
        },
        ScanCriteriaViewDescription_Zenith: {
            id: StringId.ScanCriteriaViewDescription_Zenith, translations: {
                en: 'View/edit scan criteria as Zenith JSON (for API developers)',
            }
        },
        ScansGridHeading_Id: {
            id: StringId.ScansGridHeading_Id, translations: {
                en: 'Id',
            }
        },
        ScansGridHeading_Index: {
            id: StringId.ScansGridHeading_Index, translations: {
                en: 'Index',
            }
        },
        ScansGridHeading_Readonly: {
            id: StringId.ScansGridHeading_Readonly, translations: {
                en: 'Readonly',
            }
        },
        ScansGridHeading_Name: {
            id: StringId.ScansGridHeading_Name, translations: {
                en: 'Name',
            }
        },
        ScansGridHeading_Description: {
            id: StringId.ScansGridHeading_Description, translations: {
                en: 'Description',
            }
        },
        ScansGridHeading_StatusId: {
            id: StringId.ScansGridHeading_StatusId, translations: {
                en: 'Status',
            }
        },
        ScansGridHeading_Version: {
            id: StringId.ScansGridHeading_Version, translations: {
                en: 'Version',
            }
        },
        ScansGridHeading_LastSavedTime: {
            id: StringId.ScansGridHeading_LastSavedTime, translations: {
                en: 'Saved Time',
            }
        },
        ScanPropertiesCaption_Enabled: {
            id: StringId.ScanPropertiesCaption_Enabled, translations: {
                en: 'Enabled',
            }
        },
        ScanPropertiesTitle_Enabled: {
            id: StringId.ScanPropertiesTitle_Enabled, translations: {
                en: 'Scans will only look for matches when enabled',
            }
        },
        ScanPropertiesCaption_Name: {
            id: StringId.ScanPropertiesCaption_Name, translations: {
                en: 'Name',
            }
        },
        ScanPropertiesTitle_Name: {
            id: StringId.ScanPropertiesTitle_Name, translations: {
                en: 'A short name easily identifying the scan',
            }
        },
        ScanPropertiesCaption_Description: {
            id: StringId.ScanPropertiesCaption_Description, translations: {
                en: 'Description',
            }
        },
        ScanPropertiesTitle_Description: {
            id: StringId.ScanPropertiesTitle_Description, translations: {
                en: 'An (optional) longer description of the scan',
            }
        },
        ScanPropertiesCaption_Type: {
            id: StringId.ScanPropertiesCaption_Type, translations: {
                en: 'Type',
            }
        },
        ScanPropertiesTitle_Type: {
            id: StringId.ScanPropertiesTitle_Type, translations: {
                en: 'Specifies the type of criteria used by the scan.  Can either be \'custom\' or one of the basic types.',
            }
        },
        ScanPropertiesCaption_SymbolList: {
            id: StringId.ScanPropertiesCaption_SymbolList, translations: {
                en: 'Symbol list',
            }
        },
        ScanPropertiesTitle_SymbolList: {
            id: StringId.ScanPropertiesTitle_SymbolList, translations: {
                en: 'Scan matches generate a symbol list which can be viewed in a watchlist',
            }
        },
        ScanPropertiesCaption_ShowRank: {
            id: StringId.ScanPropertiesCaption_ShowRank, translations: {
                en: 'Show rank',
            }
        },
        ScanPropertiesTitle_ShowRank: {
            id: StringId.ScanPropertiesTitle_ShowRank, translations: {
                en: 'Show rank formula editor',
            }
        },
        ScanPropertiesCaption_SymbolListMaxCount: {
            id: StringId.ScanPropertiesCaption_SymbolListMaxCount, translations: {
                en: 'Max count',
            }
        },
        ScanPropertiesTitle_SymbolListMaxCount: {
            id: StringId.ScanPropertiesTitle_SymbolListMaxCount, translations: {
                en: 'Maximum number of matched symbols to be included in symbol list',
            }
        },
        ScanPropertiesCaption_View: {
            id: StringId.ScanPropertiesCaption_View, translations: {
                en: 'View',
            }
        },
        ScanPropertiesTitle_View: {
            id: StringId.ScanPropertiesTitle_View, translations: {
                en: 'Specifies how the criteria should be viewed/edited',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesCaption_MinimumStable: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesCaption_MinimumStable, translations: {
                en: 'Minimum stable time',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesDescription_MinimumStable: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesDescription_MinimumStable, translations: {
                en: 'The minimum amount of time (in seconds) a scan must match before a notification can be sent',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesCaption_MinimumElapsed: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesCaption_MinimumElapsed, translations: {
                en: 'Minimum elapsed time',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesDescription_MinimumElapsed: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesDescription_MinimumElapsed, translations: {
                en: 'The minimum amount of time since the last notification before a new one can be sent',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesCaption_Ttl: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesCaption_Ttl, translations: {
                en: 'TTL',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesDescription_Ttl: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesDescription_Ttl, translations: {
                en: 'The time (in seconds) after which a notification will be cancelled if it cannot be sent',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesCaption_Urgency: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesCaption_Urgency, translations: {
                en: 'Urgency',
            }
        },
        ScanEditorAttachedNotificationChannelPropertiesDescription_Urgency: {
            id: StringId.ScanEditorAttachedNotificationChannelPropertiesDescription_Urgency, translations: {
                en: 'Specifies the priority of notifications if multiple notifications are dispatched at once',
            }
        },
        ScanTargetsCaption_TargetType: {
            id: StringId.ScanTargetsCaption_TargetType, translations: {
                en: 'Target type',
            }
        },
        ScanTargetsDescription_TargetType: {
            id: StringId.ScanTargetsDescription_TargetType, translations: {
                en: 'Specify whether a scan should target symbols or entire markets',
            }
        },
        ScanTargetsCaption_SingleSymbol: {
            id: StringId.ScanTargetsCaption_SingleSymbol, translations: {
                en: 'Symbol',
            }
        },
        ScanTargetsDescription_SingleSymbol: {
            id: StringId.ScanTargetsDescription_SingleSymbol, translations: {
                en: 'Specify the symbol a scan will target',
            }
        },
        ScanTargetsCaption_SingleMarket: {
            id: StringId.ScanTargetsCaption_SingleMarket, translations: {
                en: 'Market',
            }
        },
        ScanTargetsDescription_SingleMarket: {
            id: StringId.ScanTargetsDescription_SingleMarket, translations: {
                en: 'Specify the market in which the scan will target all symbols',
            }
        },
        ScanTargetsCaption_MultiMarket: {
            id: StringId.ScanTargetsCaption_MultiMarket, translations: {
                en: 'Markets',
            }
        },
        ScanTargetsDescription_MultiMarket: {
            id: StringId.ScanTargetsDescription_MultiMarket, translations: {
                en: 'Specify multiple markets in all of which, the scan will target all symbols',
            }
        },
        ScanTargetsCaption_MaxMatchCount: {
            id: StringId.ScanTargetsCaption_MaxMatchCount, translations: {
                en: 'Max match count',
            }
        },
        ScanTargetsDescription_MaxMatchCount: {
            id: StringId.ScanTargetsDescription_MaxMatchCount, translations: {
                en: 'The maximum number of matches which are reported at any time',
            }
        },
        ScanTargetsTargetSubTypeIdDisplay_SingleSymbol: {
            id: StringId.ScanTargetsTargetSubTypeIdDisplay_SingleSymbol, translations: {
                en: 'Single symbol',
            }
        },
        ScanTargetsTargetSubTypeIdDescription_SingleSymbol: {
            id: StringId.ScanTargetsTargetSubTypeIdDescription_SingleSymbol, translations: {
                en: 'Target a single symbol only',
            }
        },
        ScanTargetsTargetSubTypeIdDisplay_MultiSymbol: {
            id: StringId.ScanTargetsTargetSubTypeIdDisplay_MultiSymbol, translations: {
                en: 'Multiple Symbols',
            }
        },
        ScanTargetsTargetSubTypeIdDescription_MultiSymbol: {
            id: StringId.ScanTargetsTargetSubTypeIdDescription_MultiSymbol, translations: {
                en: 'Target multiple symbol',
            }
        },
        ScanTargetsTargetSubTypeIdDisplay_SingleMarket: {
            id: StringId.ScanTargetsTargetSubTypeIdDisplay_SingleMarket, translations: {
                en: 'Single market',
            }
        },
        ScanTargetsTargetSubTypeIdDescription_SingleMarket: {
            id: StringId.ScanTargetsTargetSubTypeIdDescription_SingleMarket, translations: {
                en: 'Target all symbols in a single market',
            }
        },
        ScanTargetsTargetSubTypeIdDisplay_MultiMarket: {
            id: StringId.ScanTargetsTargetSubTypeIdDisplay_MultiMarket, translations: {
                en: 'Multi market',
            }
        },
        ScanTargetsTargetSubTypeIdDescription_MultiMarket: {
            id: StringId.ScanTargetsTargetSubTypeIdDescription_MultiMarket, translations: {
                en: 'Target all symbols in multiple markets',
            }
        },
        ScanCriteriaCaption_DefaultView: {
            id: StringId.ScanCriteriaCaption_DefaultView, translations: {
                en: 'Default view',
            }
        },
        ScanCriteriaDescription_DefaultView: {
            id: StringId.ScanCriteriaDescription_DefaultView, translations: {
                en: 'Use the default view for the scan\'s criteria',
            }
        },
        ScanCriteriaCaption_View: {
            id: StringId.ScanCriteriaCaption_View, translations: {
                en: 'View',
            }
        },
        ScanCriteriaDescription_View: {
            id: StringId.ScanCriteriaDescription_View, translations: {
                en: 'Select how the criteria should be viewed',
            }
        },

        ScanEditorComponent_ApplyTitle: {
            id: StringId.ScanEditorComponent_ApplyTitle, translations: {
                en: 'Apply (create or save) changes to scan',
            }
        },
        ScanEditorComponent_RevertTitle: {
            id: StringId.ScanEditorComponent_RevertTitle, translations: {
                en: 'Revert all changes',
            }
        },
        ScanEditorComponent_DeleteTitle: {
            id: StringId.ScanEditorComponent_DeleteTitle, translations: {
                en: 'Delete Scan',
            }
        },
        ScanEditorComponent_TestTitle: {
            id: StringId.ScanEditorComponent_TestTitle, translations: {
                en: 'Execute scan immediately and see results',
            }
        },
        ScanEditorTargetsComponent_EditMultiSymbolList: {
            id: StringId.ScanEditorTargetsComponent_EditMultiSymbolList, translations: {
                en: 'Edit scan target symbol list'
            }
        },
        ScanEditorTargetsComponent_EditMultiSymbolGridColumns: {
            id: StringId.ScanEditorTargetsComponent_EditMultiSymbolGridColumns, translations: {
                en: 'Edit scan target symbol grid columns'
            }
        },
        ColumnLayoutDefinitionColumnHeading_FieldName: {
            id: StringId.ColumnLayoutDefinitionColumnHeading_FieldName, translations: {
                en: 'Name',
            }
        },
        ColumnLayoutDefinitionColumnDescription_FieldName: {
            id: StringId.ColumnLayoutDefinitionColumnDescription_FieldName, translations: {
                en: 'Field Name',
            }
        },
        ColumnLayoutDefinitionColumnHeading_FieldHeading: {
            id: StringId.ColumnLayoutDefinitionColumnHeading_FieldHeading, translations: {
                en: 'Heading',
            }
        },
        ColumnLayoutDefinitionColumnDescription_FieldHeading: {
            id: StringId.ColumnLayoutDefinitionColumnDescription_FieldHeading, translations: {
                en: 'Field Heading',
            }
        },
        ColumnLayoutDefinitionColumnHeading_FieldSourceName: {
            id: StringId.ColumnLayoutDefinitionColumnHeading_FieldSourceName, translations: {
                en: 'Source',
            }
        },
        ColumnLayoutDefinitionColumnDescription_FieldSourceName: {
            id: StringId.ColumnLayoutDefinitionColumnDescription_FieldSourceName, translations: {
                en: 'Field Source Name',
            }
        },
        ColumnLayoutDefinitionColumnHeading_Width: {
            id: StringId.ColumnLayoutDefinitionColumnHeading_Width, translations: {
                en: 'Width',
            }
        },
        ColumnLayoutDefinitionColumnDescription_Width: {
            id: StringId.ColumnLayoutDefinitionColumnDescription_Width, translations: {
                en: 'Width',
            }
        },
        ColumnLayoutDefinitionColumnHeading_Visible: {
            id: StringId.ColumnLayoutDefinitionColumnHeading_Visible, translations: {
                en: 'Visible',
            }
        },
        ColumnLayoutDefinitionColumnDescription_Visible: {
            id: StringId.ColumnLayoutDefinitionColumnDescription_Visible, translations: {
                en: 'Visible',
            }
        },

        ScanFieldHeading_Id: {
            id: StringId.ScanFieldHeading_Id, translations: {
                en: 'Id',
            }
        },
        ScanFieldHeading_Readonly: {
            id: StringId.ScanFieldHeading_Readonly, translations: {
                en: 'Readonly',
            }
        },
        ScanFieldHeading_Index: {
            id: StringId.ScanFieldHeading_Index, translations: {
                en: 'Index',
            }
        },
        ScanFieldHeading_StatusId: {
            id: StringId.ScanFieldHeading_StatusId, translations: {
                en: 'Status',
            }
        },
        ScanFieldHeading_Enabled: {
            id: StringId.ScanFieldHeading_Enabled, translations: {
                en: 'Enabled',
            }
        },
        ScanFieldHeading_Name: {
            id: StringId.ScanFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        ScanFieldHeading_Description: {
            id: StringId.ScanFieldHeading_Description, translations: {
                en: 'Description',
            }
        },
        ScanFieldHeading_TargetTypeId: {
            id: StringId.ScanFieldHeading_TargetTypeId, translations: {
                en: 'Target type',
            }
        },
        ScanFieldHeading_TargetMarkets: {
            id: StringId.ScanFieldHeading_TargetMarkets, translations: {
                en: 'Markets',
            }
        },
        ScanFieldHeading_TargetDataIvemIds: {
            id: StringId.ScanFieldHeading_TargetDataIvemIds, translations: {
                en: 'Symbols',
            }
        },
        ScanFieldHeading_MaxMatchCount: {
            id: StringId.ScanFieldHeading_MaxMatchCount, translations: {
                en: 'Match Count',
            }
        },
        ScanFieldHeading_ZenithCriteria: {
            id: StringId.ScanFieldHeading_ZenithCriteria, translations: {
                en: 'Z.Criteria',
            }
        },
        ScanFieldHeading_ZenithRank: {
            id: StringId.ScanFieldHeading_ZenithRank, translations: {
                en: 'Z.Rank',
            }
        },
        ScanFieldHeading_AttachedNotificationChannels: {
            id: StringId.ScanFieldHeading_AttachedNotificationChannels, translations: {
                en: 'Notifications',
            }
        },
        ScanFieldHeading_SymbolListEnabled: {
            id: StringId.ScanFieldHeading_SymbolListEnabled, translations: {
                en: 'Symbol List Enabled',
            }
        },
        ScanFieldHeading_Version: {
            id: StringId.ScanFieldHeading_Version, translations: {
                en: 'Version',
            }
        },
        ScanFieldHeading_LastSavedTime: {
            id: StringId.ScanFieldHeading_LastSavedTime, translations: {
                en: 'Last saved time',
            }
        },
        ScanFieldHeading_LastEditSessionId: {
            id: StringId.ScanFieldHeading_LastEditSessionId, translations: {
                en: 'Last edit session',
            }
        },
        ScanFieldHeading_ZenithCriteriaSource: {
            id: StringId.ScanFieldHeading_ZenithCriteriaSource, translations: {
                en: 'Z.Criteria source',
            }
        },
        ScanFieldHeading_ZenithRankSource: {
            id: StringId.ScanFieldHeading_ZenithRankSource, translations: {
                en: 'Z.Rank source',
            }
        },
        ZenithScanFormulaView_ErrorCaption: {
            id: StringId.ZenithScanFormulaView_ErrorCaption, translations: {
                en: 'Error',
            }
        },
        ZenithScanFormulaView_ErrorTitle: {
            id: StringId.ZenithScanFormulaView_ErrorTitle, translations: {
                en: 'Zenith formula parse error',
            }
        },
        ZenithScanFormulaViewDecodeProgress_Title: {
            id: StringId.ZenithScanFormulaViewDecodeProgress_Title, translations: {
                en: 'Parsed Nodes',
            }
        },
        ZenithScanFormulaViewDecodeProgress_CountCaption: {
            id: StringId.ZenithScanFormulaViewDecodeProgress_CountCaption, translations: {
                en: 'Count',
            }
        },
        ZenithScanFormulaViewDecodeProgress_CountTitle: {
            id: StringId.ZenithScanFormulaViewDecodeProgress_CountTitle, translations: {
                en: 'The number of nodes parsed',
            }
        },
        ZenithScanFormulaViewDecodeProgress_DepthCaption: {
            id: StringId.ZenithScanFormulaViewDecodeProgress_DepthCaption, translations: {
                en: 'Depth',
            }
        },
        ZenithScanFormulaViewDecodeProgress_DepthTitle: {
            id: StringId.ZenithScanFormulaViewDecodeProgress_DepthTitle, translations: {
                en: 'The depth of the last node in the node hierarchy',
            }
        },
        WatchmakerListHeading_Id: {
            id: StringId.WatchmakerListHeading_Id, translations: {
                en: 'Id',
            }
        },
        WatchmakerListHeading_Readonly: {
            id: StringId.WatchmakerListHeading_Readonly, translations: {
                en: 'Readonly',
            }
        },
        WatchmakerListHeading_Index: {
            id: StringId.WatchmakerListHeading_Index, translations: {
                en: 'Index',
            }
        },
        WatchmakerListHeading_Name: {
            id: StringId.WatchmakerListHeading_Name, translations: {
                en: 'Name',
            }
        },
        WatchmakerListHeading_Description: {
            id: StringId.WatchmakerListHeading_Description, translations: {
                en: 'Description',
            }
        },
        WatchmakerListHeading_Category: {
            id: StringId.WatchmakerListHeading_Category, translations: {
                en: 'Category',
            }
        },
        WatchmakerListHeading_SyncStatusId: {
            id: StringId.WatchmakerListHeading_SyncStatusId, translations: {
                en: 'Sync Status',
            }
        },
        WatchmakerListHeading_ConfigModified: {
            id: StringId.WatchmakerListHeading_ConfigModified, translations: {
                en: 'Modified',
            }
        },
        WatchmakerListHeading_LastSavedTime: {
            id: StringId.WatchmakerListHeading_LastSavedTime, translations: {
                en: 'Last saved time',
            }
        },
        GridFieldFieldHeading_Name: {
            id: StringId.GridFieldFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        GridFieldFieldHeading_Heading: {
            id: StringId.GridFieldFieldHeading_Heading, translations: {
                en: 'Heading',
            }
        },
        GridFieldFieldHeading_SourceName: {
            id: StringId.GridFieldFieldHeading_SourceName, translations: {
                en: 'Source',
            }
        },
        GridFieldFieldHeading_DefaultHeading: {
            id: StringId.GridFieldFieldHeading_DefaultHeading, translations: {
                en: 'Default heading',
            }
        },
        GridFieldFieldHeading_DefaultTextAlign: {
            id: StringId.GridFieldFieldHeading_DefaultTextAlign, translations: {
                en: 'Default align',
            }
        },
        GridFieldFieldHeading_DefaultWidth: {
            id: StringId.GridFieldFieldHeading_DefaultWidth, translations: {
                en: 'Default width',
            }
        },
        RankedDataIvemIdListDirectoryItemFieldHeading_TypeId: {
            id: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_TypeId, translations: {
                en: 'Type',
            }
        },
        RankedDataIvemIdListDirectoryItemFieldHeading_Id: {
            id: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Id, translations: {
                en: 'Id',
            }
        },
        RankedDataIvemIdListDirectoryItemFieldHeading_Readonly: {
            id: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Readonly, translations: {
                en: 'Readonly',
            }
        },
        RankedDataIvemIdListDirectoryItemFieldHeading_Name: {
            id: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        RankedDataIvemIdListDirectoryItemFieldHeading_Description: {
            id: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Description, translations: {
                en: 'Description',
            }
        },
        RankedDataIvemIdListDirectoryItem_TypeId_WatchmakerList: {
            id: StringId.RankedDataIvemIdListDirectoryItem_TypeId_WatchmakerList, translations: {
                en: 'Watchmaker list',
            }
        },
        RankedDataIvemIdListDirectoryItem_TypeId_Scan: {
            id: StringId.RankedDataIvemIdListDirectoryItem_TypeId_Scan, translations: {
                en: 'Scan',
            }
        },
        DiagnosticsDitemGroup_DebugCaption: {
            id: StringId.DiagnosticsDitemGroup_DebugCaption, translations: {
                en: 'Debug'
            }
        },
        DiagnosticsDitemGroup_DebugTitle: {
            id: StringId.DiagnosticsDitemGroup_DebugTitle, translations: {
                en: 'Debug Actions'
            }
        },
        Diagnostics_CloseSocketConnection: {
            id: StringId.Diagnostics_CloseSocketConnection, translations: {
                en: 'Close Socket Connection'
            }
        },
        UserAlert_RestartReason_Unstable: {
            id: StringId.UserAlert_RestartReason_Unstable, translations: {
                en: 'Motif may be unstable! Click "Restart" to begin new session',
            }
        },
        UserAlert_RestartReason_SigninCouldNotBeProcessed: {
            id: StringId.UserAlert_RestartReason_SigninCouldNotBeProcessed, translations: {
                en: 'Signin could not be processed! Check identity provider then click "Restart" to try again',
            }
        },
        UserAlert_RestartReason_NewSessionRequired: {
            id: StringId.UserAlert_RestartReason_NewSessionRequired, translations: {
                en: 'New Motif session required! Click "Restart" to begin new session',
            }
        },
        UserAlert_RestartReason_AttemptingSessionRenewal: {
            id: StringId.UserAlert_RestartReason_AttemptingSessionRenewal, translations: {
                en: 'Attempting to renew Motif session! Click "Restart" to begin new session',
            }
        },
        UserAlert_RestartReason_UserAction: {
            id: StringId.UserAlert_RestartReason_UserAction, translations: {
                en: 'Restart required due to user action',
            }
        },
        UserAlert_SavingChanges: {
            id: StringId.UserAlert_SavingChanges, translations: {
                en: 'Saving changes',
            }
        },
        UserAlert_PleaseWaitSavingChanges: {
            id: StringId.UserAlert_PleaseWaitSavingChanges, translations: {
                en: 'Please wait - saving changes.',
            }
        },
        UserAlert_ChangesSaved: {
            id: StringId.UserAlert_ChangesSaved, translations: {
                en: 'Changes saved',
            }
        },
        UserAlert_ChangesSavedOkToLeaveOrRestorePage: {
            id: StringId.UserAlert_ChangesSavedOkToLeaveOrRestorePage, translations: {
                en: 'Changes saved! Ok to leave or restore page',
            }
        },
        ScanFormulaIsNodeCategoryCaption_Index: {
            id: StringId.ScanFormulaIsNodeCategoryCaption_Index, translations: {
                en: 'Index',
            }
        },
        ScanFormulaIsNodeCategoryTitle_Index: {
            id: StringId.ScanFormulaIsNodeCategoryTitle_Index, translations: {
                en: 'Symbol is an Index',
            }
        },
        ScanField_BooleanOperationDisplay_All: {
            id: StringId.ScanField_BooleanOperationDisplay_All, translations: {
                en: 'All',
            }
        },
        ScanField_BooleanOperationDescription_All: {
            id: StringId.ScanField_BooleanOperationDescription_All, translations: {
                en: 'All conditions must be met',
            }
        },
        ScanField_BooleanOperationDisplay_Any: {
            id: StringId.ScanField_BooleanOperationDisplay_Any, translations: {
                en: 'Any',
            }
        },
        ScanField_BooleanOperationDescription_Any: {
            id: StringId.ScanField_BooleanOperationDescription_Any, translations: {
                en: 'One or more conditions must be met',
            }
        },
        ScanField_BooleanOperationDisplay_Xor: {
            id: StringId.ScanField_BooleanOperationDisplay_Xor, translations: {
                en: 'Only 1 of 2',
            }
        },
        ScanField_BooleanOperationDescription_Xor: {
            id: StringId.ScanField_BooleanOperationDescription_Xor, translations: {
                en: 'One of two conditions must be met',
            }
        },
        ScanFieldEditor_FieldName: {
            id: StringId.ScanFieldEditor_FieldName, translations: {
                en: 'Field name',
            }
        },
        ScanFieldEditor_RequiresDisplay: {
            id: StringId.ScanFieldEditor_RequiresDisplay, translations: {
                en: 'Requires',
            }
        },
        ScanFieldEditor_RequiresDescription: {
            id: StringId.ScanFieldEditor_RequiresDescription, translations: {
                en: 'The number of conditions which must be met',
            }
        },
        ScanFieldEditor_DeleteMeDisplay: {
            id: StringId.ScanFieldEditor_DeleteMeDisplay, translations: {
                en: 'Delete',
            }
        },
        ScanFieldEditor_DeleteMeDescription: {
            id: StringId.ScanFieldEditor_DeleteMeDescription, translations: {
                en: 'Delete this field',
            }
        },
        ScanFieldEditor_Conditions: {
            id: StringId.ScanFieldEditor_Conditions, translations: {
                en: 'Conditions',
            }
        },
        ScanFieldEditor_AddConditionDisplay: {
            id: StringId.ScanFieldEditor_AddConditionDisplay, translations: {
                en: 'Add Condition',
            }
        },
        ScanFieldEditor_AddConditionDescription: {
            id: StringId.ScanFieldEditor_AddConditionDescription, translations: {
                en: 'Select a condition to be added',
            }
        },
        ScanFieldEditor_OneOrMoreConditionsInvalid: {
            id: StringId.ScanFieldEditor_OneOrMoreConditionsInvalid, translations: {
                en: 'One or more conditions are invalid',
            }
        },
        ScanFieldEditor_XorRequiresExactly2Conditions: {
            id: StringId.ScanFieldEditor_XorRequiresExactly2Conditions, translations: {
                en: 'Exactly 2 conditions are required',
            }
        },
        ScanFieldSetEditor_AddAField: {
            id: StringId.ScanFieldSetEditor_AddAField, translations: {
                en: 'Add a field to scan',
            }
        },
        ScanFieldSetEditor_AddAnAttributeBasedField: {
            id: StringId.ScanFieldSetEditor_AddAnAttributeBasedField, translations: {
                en: 'Add an attribute based field to scan',
            }
        },
        ScanFieldSetEditor_AddAnAltCodeBasedField: {
            id: StringId.ScanFieldSetEditor_AddAnAltCodeBasedField, translations: {
                en: 'Add an \'AltCode\' based field to scan',
            }
        },
        ScanFieldEditorFrameFieldHeading_Name: {
            id: StringId.ScanFieldEditorFrameFieldHeading_Name, translations: {
                en: 'Name',
            }
        },
        ScanFieldEditorFrameFieldHeading_Valid: {
            id: StringId.ScanFieldEditorFrameFieldHeading_Valid, translations: {
                en: 'Valid',
            }
        },
        ScanFieldEditorFrameFieldHeading_ErrorText: {
            id: StringId.ScanFieldEditorFrameFieldHeading_ErrorText, translations: {
                en: 'ErrorText',
            }
        },
        ScanFieldEditorFrameFieldHeading_ConditionsOperationId: {
            id: StringId.ScanFieldEditorFrameFieldHeading_ConditionsOperationId, translations: {
                en: 'Requires condition',
            }
        },
        ScanFieldEditorFrameFieldHeading_ConditionCount: {
            id: StringId.ScanFieldEditorFrameFieldHeading_ConditionCount, translations: {
                en: 'Condition count',
            }
        },
        ScanFieldConditionOperatorDisplay_HasValue: {
            id: StringId.ScanFieldConditionOperatorDisplay_HasValue, translations: {
                en: 'Has value',
            }
        },
        ScanFieldConditionOperatorDescription_HasValue: {
            id: StringId.ScanFieldConditionOperatorDescription_HasValue, translations: {
                en: 'Is the field\'s value set',
            }
        },
        ScanFieldConditionOperatorDisplay_NotHasValue: {
            id: StringId.ScanFieldConditionOperatorDisplay_NotHasValue, translations: {
                en: 'Not has value',
            }
        },
        ScanFieldConditionOperatorDescription_NotHasValue: {
            id: StringId.ScanFieldConditionOperatorDescription_NotHasValue, translations: {
                en: 'Is the field\'s value not set',
            }
        },
        ScanFieldConditionOperatorDisplay_Equals: {
            id: StringId.ScanFieldConditionOperatorDisplay_Equals, translations: {
                en: 'Equals',
            }
        },
        ScanFieldConditionOperatorDescription_Equals: {
            id: StringId.ScanFieldConditionOperatorDescription_Equals, translations: {
                en: 'Is the field\'s value equal',
            }
        },
        ScanFieldConditionOperatorDisplay_NotEquals: {
            id: StringId.ScanFieldConditionOperatorDisplay_NotEquals, translations: {
                en: 'Not equals',
            }
        },
        ScanFieldConditionOperatorDescription_NotEquals: {
            id: StringId.ScanFieldConditionOperatorDescription_NotEquals, translations: {
                en: 'Is the field\'s value not equal',
            }
        },
        ScanFieldConditionOperatorDisplay_GreaterThan: {
            id: StringId.ScanFieldConditionOperatorDisplay_GreaterThan, translations: {
                en: 'Greater than',
            }
        },
        ScanFieldConditionOperatorDescription_GreaterThan: {
            id: StringId.ScanFieldConditionOperatorDescription_GreaterThan, translations: {
                en: 'Is the field\'s value greater than',
            }
        },
        ScanFieldConditionOperatorDisplay_GreaterThanOrEqual: {
            id: StringId.ScanFieldConditionOperatorDisplay_GreaterThanOrEqual, translations: {
                en: 'Greater than or equal',
            }
        },
        ScanFieldConditionOperatorDescription_GreaterThanOrEqual: {
            id: StringId.ScanFieldConditionOperatorDescription_GreaterThanOrEqual, translations: {
                en: 'Is the field\'s value greater than or equal',
            }
        },
        ScanFieldConditionOperatorDisplay_LessThan: {
            id: StringId.ScanFieldConditionOperatorDisplay_LessThan, translations: {
                en: 'Less than',
            }
        },
        ScanFieldConditionOperatorDescription_LessThan: {
            id: StringId.ScanFieldConditionOperatorDescription_LessThan, translations: {
                en: 'Is the field\'s value less than',
            }
        },
        ScanFieldConditionOperatorDisplay_LessThanOrEqual: {
            id: StringId.ScanFieldConditionOperatorDisplay_LessThanOrEqual, translations: {
                en: 'Less than or equal',
            }
        },
        ScanFieldConditionOperatorDescription_LessThanOrEqual: {
            id: StringId.ScanFieldConditionOperatorDescription_LessThanOrEqual, translations: {
                en: 'Is the field\'s value less than or equal',
            }
        },
        ScanFieldConditionOperatorDisplay_InRange: {
            id: StringId.ScanFieldConditionOperatorDisplay_InRange, translations: {
                en: 'In range',
            }
        },
        ScanFieldConditionOperatorDescription_InRange: {
            id: StringId.ScanFieldConditionOperatorDescription_InRange, translations: {
                en: 'Is the field\'s value in the range',
            }
        },
        ScanFieldConditionOperatorDisplay_NotInRange: {
            id: StringId.ScanFieldConditionOperatorDisplay_NotInRange, translations: {
                en: 'Not in range',
            }
        },
        ScanFieldConditionOperatorDescription_NotInRange: {
            id: StringId.ScanFieldConditionOperatorDescription_NotInRange, translations: {
                en: 'Is the field\'s value outside the range',
            }
        },
        ScanFieldConditionOperatorDisplay_Contains: {
            id: StringId.ScanFieldConditionOperatorDisplay_Contains, translations: {
                en: 'Contains',
            }
        },
        ScanFieldConditionOperatorDescription_Contains: {
            id: StringId.ScanFieldConditionOperatorDescription_Contains, translations: {
                en: 'Does the field\'s value contain',
            }
        },
        ScanFieldConditionOperatorDisplay_NotContains: {
            id: StringId.ScanFieldConditionOperatorDisplay_NotContains, translations: {
                en: 'Not contains',
            }
        },
        ScanFieldConditionOperatorDescription_NotContains: {
            id: StringId.ScanFieldConditionOperatorDescription_NotContains, translations: {
                en: 'Does the field\'s value not contain',
            }
        },
        ScanFieldConditionOperatorDisplay_Overlaps: {
            id: StringId.ScanFieldConditionOperatorDisplay_Overlaps, translations: {
                en: 'Overlaps',
            }
        },
        ScanFieldConditionOperatorDescription_Overlaps: {
            id: StringId.ScanFieldConditionOperatorDescription_Overlaps, translations: {
                en: 'Are any of the field\'s value included in the specified set of values',
            }
        },
        ScanFieldConditionOperatorDisplay_NotOverlaps: {
            id: StringId.ScanFieldConditionOperatorDisplay_NotOverlaps, translations: {
                en: 'Not overlaps',
            }
        },
        ScanFieldConditionOperatorDescription_NotOverlaps: {
            id: StringId.ScanFieldConditionOperatorDescription_NotOverlaps, translations: {
                en: 'Are none of the field\'s value included in the specified set of values',
            }
        },
        ScanFieldConditionOperatorDisplay_Is: {
            id: StringId.ScanFieldConditionOperatorDisplay_Is, translations: {
                en: 'Is',
            }
        },
        ScanFieldConditionOperatorDescription_Is: {
            id: StringId.ScanFieldConditionOperatorDescription_Is, translations: {
                en: 'Is the symbol included in the specified category',
            }
        },
        ScanFieldConditionOperatorDisplay_NotIs: {
            id: StringId.ScanFieldConditionOperatorDisplay_NotIs, translations: {
                en: 'Not is',
            }
        },
        ScanFieldConditionOperatorDescription_NotIs: {
            id: StringId.ScanFieldConditionOperatorDescription_NotIs, translations: {
                en: 'Is the symbol not included in the specified category',
            }
        },
        ScanFieldConditionOperatorDisplay_OrEqual: {
            id: StringId.ScanFieldConditionOperatorDisplay_OrEqual, translations: {
                en: 'or equal',
            }
        },
        ScanFieldConditionOperandsEditorCaption_DeleteMe: {
            id: StringId.ScanFieldConditionOperandsEditorCaption_DeleteMe, translations: {
                en: 'Delete',
            }
        },
        ScanFieldConditionOperandsEditorTitle_DeleteMe: {
            id: StringId.ScanFieldConditionOperandsEditorTitle_DeleteMe, translations: {
                en: 'Delete this condition from field',
            }
        },
        ScanFieldConditionOperandsEditor_NotIsCategory: {
            id: StringId.ScanFieldConditionOperandsEditor_NotIsCategory, translations: {
                en: 'Not is category',
            }
        },
        ScanFieldConditionOperandsEditor_NotEqualsValue: {
            id: StringId.ScanFieldConditionOperandsEditor_NotEqualsValue, translations: {
                en: 'Not equals value',
            }
        },
        ScanFieldConditionOperandsEditor_NotInRange: {
            id: StringId.ScanFieldConditionOperandsEditor_NotInRange, translations: {
                en: 'Not in range',
            }
        },
        ScanFieldConditionOperandsEditor_NotOverlaps: {
            id: StringId.ScanFieldConditionOperandsEditor_NotOverlaps, translations: {
                en: 'Not overlaps',
            }
        },
        ScanFieldConditionOperandsEditor_NotHasValue: {
            id: StringId.ScanFieldConditionOperandsEditor_NotHasValue, translations: {
                en: 'Not has value',
            }
        },
        ScanFieldConditionOperandsEditor_NotContainsValue: {
            id: StringId.ScanFieldConditionOperandsEditor_NotContainsValue, translations: {
                en: 'Not contains value',
            }
        },
        ConditionSetScanFormulaViewNgComponentCaption_SetOperation: {
            id: StringId.ConditionSetScanFormulaViewNgComponentCaption_SetOperation, translations: {
                en: 'Set operation',
            }
        },
        ConditionSetScanFormulaViewNgComponentTitle_SetOperation: {
            id: StringId.ConditionSetScanFormulaViewNgComponentTitle_SetOperation, translations: {
                en: 'Specifies whether all or only at least one condition must be met',
            }
        },
        ConditionSetScanFormulaViewNgComponentTitle_Exclude: {
            id: StringId.ConditionSetScanFormulaViewNgComponentTitle_Exclude, translations: {
                en: 'Match securites not matched by condition set',
            }
        },
        ConditionSetScanFormulaViewNgComponentCaption_NewCondition: {
            id: StringId.ConditionSetScanFormulaViewNgComponentCaption_NewCondition, translations: {
                en: 'New condition',
            }
        },
        ConditionSetScanFormulaViewNgComponentTitle_NewCondition: {
            id: StringId.ConditionSetScanFormulaViewNgComponentTitle_NewCondition, translations: {
                en: 'Add a new condition to the set',
            }
        },
        ConditionSetScanFormulaViewNgComponent_SetOperationCaption_Any: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_SetOperationCaption_Any, translations: {
                en: 'Any',
            }
        },
        ConditionSetScanFormulaViewNgComponent_SetOperationTitle_Any: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_SetOperationTitle_Any, translations: {
                en: 'Just one condition needs to be met for a security to be matched',
            }
        },
        ConditionSetScanFormulaViewNgComponent_SetOperationCaption_All: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_SetOperationCaption_All, translations: {
                en: 'All',
            }
        },
        ConditionSetScanFormulaViewNgComponent_SetOperationTitle_All: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_SetOperationTitle_All, translations: {
                en: 'All conditions must be met for a security to be matched',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Compare: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Compare, translations: {
                en: 'Compare',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Compare: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Compare, translations: {
                en: 'Compare a numerical field value with a constant or the value from another numerical field',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_InRange: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_InRange, translations: {
                en: 'In Range',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_InRange: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_InRange, translations: {
                en: 'Check if the value from a numerical field is within a range',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Equals: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Equals, translations: {
                en: 'Equals',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Equals: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Equals, translations: {
                en: 'Check if the value from a numerical field equals a constant',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Includes: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Includes, translations: {
                en: 'Includes',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Includes: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Includes, translations: {
                en: 'Check if a text field value or one its values equals any of the constants specified',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Contains: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Contains, translations: {
                en: 'Contains',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Contains: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Contains, translations: {
                en: 'Check if the value of a text field contains the specified sub string',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Has: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Has, translations: {
                en: 'Has',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Has: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Has, translations: {
                en: 'Check if a field\'s value is defined',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Is: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_Is, translations: {
                en: 'Is',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Is: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_Is, translations: {
                en: 'Check if the security is in the specified category',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_All: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_All, translations: {
                en: 'All',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_All: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_All, translations: {
                en: 'All securities',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_None: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindCaption_None, translations: {
                en: 'None',
            }
        },
        ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_None: {
            id: StringId.ConditionSetScanFormulaViewNgComponent_ConditionKindTitle_None, translations: {
                en: 'No securities',
            }
        },
        CategoryValueScanFieldConditionOperandsCaption_Category: {
            id: StringId.CategoryValueScanFieldConditionOperandsCaption_Category, translations: {
                en: 'Category',
            }
        },
        CategoryValueScanFieldConditionOperandsTitle_Category: {
            id: StringId.CategoryValueScanFieldConditionOperandsTitle_Category, translations: {
                en: 'Specify a category in which security is included',
            }
        },
        CurrencyOverlapsScanFieldConditionOperandsCaption_Values: {
            id: StringId.CurrencyOverlapsScanFieldConditionOperandsCaption_Values, translations: {
                en: 'Currencies',
            }
        },
        CurrencyOverlapsScanFieldConditionOperandsTitle_Values: {
            id: StringId.CurrencyOverlapsScanFieldConditionOperandsTitle_Values, translations: {
                en: 'Specify one or more currencies',
            }
        },
        ExchangeOverlapsScanFieldConditionOperandsCaption_Values: {
            id: StringId.ExchangeOverlapsScanFieldConditionOperandsCaption_Values, translations: {
                en: 'Exchanges',
            }
        },
        ExchangeOverlapsScanFieldConditionOperandsTitle_Values: {
            id: StringId.ExchangeOverlapsScanFieldConditionOperandsTitle_Values, translations: {
                en: 'Specify one or more exchanges',
            }
        },
        MarketOverlapsScanFieldConditionOperandsCaption_Values: {
            id: StringId.MarketOverlapsScanFieldConditionOperandsCaption_Values, translations: {
                en: 'Markets',
            }
        },
        MarketOverlapsScanFieldConditionOperandsTitle_Values: {
            id: StringId.MarketOverlapsScanFieldConditionOperandsTitle_Values, translations: {
                en: 'Specify one or more markets',
            }
        },
        MarketBoardOverlapsScanFieldConditionOperandsCaption_Values: {
            id: StringId.MarketBoardOverlapsScanFieldConditionOperandsCaption_Values, translations: {
                en: 'Market boards',
            }
        },
        MarketBoardOverlapsScanFieldConditionOperandsTitle_Values: {
            id: StringId.MarketBoardOverlapsScanFieldConditionOperandsTitle_Values, translations: {
                en: 'Specify one or more market boards',
            }
        },
        StringOverlapsScanFieldConditionOperandsCaption_Values: {
            id: StringId.StringOverlapsScanFieldConditionOperandsCaption_Values, translations: {
                en: 'Values',
            }
        },
        StringOverlapsScanFieldConditionOperandsTitle_Values: {
            id: StringId.StringOverlapsScanFieldConditionOperandsTitle_Values, translations: {
                en: 'Specify one or more values',
            }
        },
        ValueScanFieldConditionOperandsCaption_Value: {
            id: StringId.ValueScanFieldConditionOperandsCaption_Value, translations: {
                en: 'Value',
            }
        },
        NumericValueScanFieldConditionOperandsTitle_Value: {
            id: StringId.NumericValueScanFieldConditionOperandsTitle_Value, translations: {
                en: 'Specify a numeric value',
            }
        },
        DateValueScanFieldConditionOperandsTitle_Value: {
            id: StringId.DateValueScanFieldConditionOperandsTitle_Value, translations: {
                en: 'Specify a date value',
            }
        },
        TextValueScanFieldConditionOperandsTitle_Value: {
            id: StringId.TextValueScanFieldConditionOperandsTitle_Value, translations: {
                en: 'Specify a text value',
            }
        },
        RangeScanFieldConditionOperandsCaption_Min: {
            id: StringId.RangeScanFieldConditionOperandsCaption_Min, translations: {
                en: 'Min',
            }
        },
        RangeScanFieldConditionOperandsCaption_Max: {
            id: StringId.RangeScanFieldConditionOperandsCaption_Max, translations: {
                en: 'Max',
            }
        },
        NumericRangeValueScanFieldConditionOperandsTitle_Min: {
            id: StringId.NumericRangeValueScanFieldConditionOperandsTitle_Min, translations: {
                en: 'Specify a numeric minimum or clear to specify no minimum',
            }
        },
        NumericRangeValueScanFieldConditionOperandsTitle_Max: {
            id: StringId.NumericRangeValueScanFieldConditionOperandsTitle_Max, translations: {
                en: 'Specify a numeric maximum or clear to specify no maximum',
            }
        },
        DateRangeValueScanFieldConditionOperandsTitle_Min: {
            id: StringId.DateRangeValueScanFieldConditionOperandsTitle_Min, translations: {
                en: 'Specify a date minimum or clear to specify no minimum',
            }
        },
        DateRangeValueScanFieldConditionOperandsTitle_Max: {
            id: StringId.DateRangeValueScanFieldConditionOperandsTitle_Max, translations: {
                en: 'Specify a date maximum or clear to specify no maximum',
            }
        },
        NumericComparisonValueScanFieldConditionOperandsCaption_Operator: {
            id: StringId.NumericComparisonValueScanFieldConditionOperandsCaption_Operator, translations: {
                en: 'Operator',
            }
        },
        NumericComparisonValueScanFieldConditionOperandsTitle_Operator: {
            id: StringId.NumericComparisonValueScanFieldConditionOperandsTitle_Operator, translations: {
                en: 'Specify the operator to use to compare the field value with the specified value',
            }
        },
        TextContainsScanFieldConditionOperandsTitle_Value: {
            id: StringId.TextContainsScanFieldConditionOperandsTitle_Value, translations: {
                en: 'Text which field value has to contain',
            }
        },
        TextContainsScanFieldConditionOperandsTitle_FromStart: {
            id: StringId.TextContainsScanFieldConditionOperandsTitle_FromStart, translations: {
                en: 'Field value has to start with specified text',
            }
        },
        TextContainsScanFieldConditionOperandsTitle_FromEnd: {
            id: StringId.TextContainsScanFieldConditionOperandsTitle_FromEnd, translations: {
                en: 'Field value has to end with specified text',
            }
        },
        TextContainsScanFieldConditionOperandsTitle_Exact: {
            id: StringId.TextContainsScanFieldConditionOperandsTitle_Exact, translations: {
                en: 'Field value must fully match specified text',
            }
        },
        TextContainsScanFieldConditionOperandsTitle_IgnoreCase: {
            id: StringId.TextContainsScanFieldConditionOperandsTitle_IgnoreCase, translations: {
                en: 'Specify whether case of characters in text should be ignored',
            }
        },
        LockerScanAttachedNotificationChannelHeader_ChannelId: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_ChannelId, translations: {
                en: 'Channel ID',
            }
        },
        LockerScanAttachedNotificationChannelHeader_Name: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_Name, translations: {
                en: 'Name',
            }
        },
        LockerScanAttachedNotificationChannelHeader_CultureCode: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_CultureCode, translations: {
                en: 'Culture',
            }
        },
        LockerScanAttachedNotificationChannelHeader_MinimumStable: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_MinimumStable, translations: {
                en: 'Min stable',
            }
        },
        LockerScanAttachedNotificationChannelHeader_MinimumElapsed: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_MinimumElapsed, translations: {
                en: 'Min elapsed',
            }
        },
        LockerScanAttachedNotificationChannelHeader_Ttl: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_Ttl, translations: {
                en: 'TTL',
            }
        },
        LockerScanAttachedNotificationChannelHeader_Urgency: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_Urgency, translations: {
                en: 'Urgency',
            }
        },
        LockerScanAttachedNotificationChannelHeader_Topic: {
            id: StringId.LockerScanAttachedNotificationChannelHeader_Topic, translations: {
                en: 'Topic',
            }
        },
        NotificationChannel_SourceSettings_Urgency_VeryLow: {
            id: StringId.NotificationChannel_SourceSettings_Urgency_VeryLow, translations: {
                en: 'VeryLow',
            }
        },
        NotificationChannel_SourceSettings_Urgency_Low: {
            id: StringId.NotificationChannel_SourceSettings_Urgency_Low, translations: {
                en: 'Low',
            }
        },
        NotificationChannel_SourceSettings_Urgency_Normal: {
            id: StringId.NotificationChannel_SourceSettings_Urgency_Normal, translations: {
                en: 'Normal',
            }
        },
        NotificationChannel_SourceSettings_Urgency_High: {
            id: StringId.NotificationChannel_SourceSettings_Urgency_High, translations: {
                en: 'High',
            }
        },
        ScanEditorAttachNotificationChannels_AttachDescription: {
            id: StringId.ScanEditorAttachNotificationChannels_AttachDescription, translations: {
                en: 'Attach an existing notification channel to this scan',
            }
        },
        ScanEditorAttachNotificationChannels_EditGridColumns: {
            id: StringId.ScanEditorAttachNotificationChannels_EditGridColumns, translations: {
                en: 'Edit scan attached notifications grid columns',
            }
        },
        ScanEditorAttachNotificationChannels_DetachSelectedChannelsCaption: {
            id: StringId.ScanEditorAttachNotificationChannels_DetachSelectedChannelsCaption, translations: {
                en: 'Detach selected channels',
            }
        },
        ScanEditorAttachNotificationChannels_DetachSelectedChannelsTitle: {
            id: StringId.ScanEditorAttachNotificationChannels_DetachSelectedChannelsTitle, translations: {
                en: 'Detach selected channels from this scan',
            }
        },
        LockOpenNotificationChannelHeader_Id: {
            id: StringId.LockOpenNotificationChannelHeader_Id, translations: {
                en: 'Id',
            }
        },
        LockOpenNotificationChannelHeader_Valid: {
            id: StringId.LockOpenNotificationChannelHeader_Valid, translations: {
                en: 'Valid',
            }
        },
        LockOpenNotificationChannelHeader_Enabled: {
            id: StringId.LockOpenNotificationChannelHeader_Enabled, translations: {
                en: 'Enabled',
            }
        },
        LockOpenNotificationChannelDescription_Enabled: {
            id: StringId.LockOpenNotificationChannelDescription_Enabled, translations: {
                en: 'Enable notifications through this channel',
            }
        },
        LockOpenNotificationChannelHeader_Name: {
            id: StringId.LockOpenNotificationChannelHeader_Name, translations: {
                en: 'Name',
            }
        },
        LockOpenNotificationChannelDescription_Name: {
            id: StringId.LockOpenNotificationChannelDescription_Name, translations: {
                en: 'Specify name of this notification channel',
            }
        },
        LockOpenNotificationChannelHeader_Description: {
            id: StringId.LockOpenNotificationChannelHeader_Description, translations: {
                en: 'Description',
            }
        },
        LockOpenNotificationChannelDescription_Description: {
            id: StringId.LockOpenNotificationChannelDescription_Description, translations: {
                en: 'Specify a description of this notification channel',
            }
        },
        LockOpenNotificationChannelHeader_Favourite: {
            id: StringId.LockOpenNotificationChannelHeader_Favourite, translations: {
                en: 'Favourite',
            }
        },
        LockOpenNotificationChannelHeader_StatusId: {
            id: StringId.LockOpenNotificationChannelHeader_StatusId, translations: {
                en: 'Status',
            }
        },
        LockOpenNotificationChannelHeader_DistributionMethodId: {
            id: StringId.LockOpenNotificationChannelHeader_DistributionMethodId, translations: {
                en: 'Type',
            }
        },
        LockOpenNotificationChannelHeader_Settings: {
            id: StringId.LockOpenNotificationChannelHeader_Settings, translations: {
                en: 'Settings',
            }
        },
        LockOpenNotificationChannelHeader_Faulted: {
            id: StringId.LockOpenNotificationChannelHeader_Faulted, translations: {
                en: 'Faulted',
            }
        },
        NotificationDistributionMethodDisplay_Debug: {
            id: StringId.NotificationDistributionMethodDisplay_Debug, translations: {
                en: 'Debug',
            }
        },
        NotificationDistributionMethodDisplay_Email: {
            id: StringId.NotificationDistributionMethodDisplay_Email, translations: {
                en: 'Email',
            }
        },
        NotificationDistributionMethodDisplay_Sms: {
            id: StringId.NotificationDistributionMethodDisplay_Sms, translations: {
                en: 'SMS',
            }
        },
        NotificationDistributionMethodDisplay_WebPush: {
            id: StringId.NotificationDistributionMethodDisplay_WebPush, translations: {
                en: 'Web push',
            }
        },
        NotificationDistributionMethodDisplay_ApplePush: {
            id: StringId.NotificationDistributionMethodDisplay_ApplePush, translations: {
                en: 'Apple push',
            }
        },
        NotificationDistributionMethodDisplay_GooglePush: {
            id: StringId.NotificationDistributionMethodDisplay_GooglePush, translations: {
                en: 'Google push',
            }
        },
        NotificationChannels_RefreshAllCaption: {
            id: StringId.NotificationChannels_RefreshAllCaption, translations: {
                en: 'Refresh',
            }
        },
        NotificationChannels_RefreshAllDescription: {
            id: StringId.NotificationChannels_RefreshAllDescription, translations: {
                en: 'Refresh list of channels',
            }
        },
        NotificationChannels_AddCaption: {
            id: StringId.NotificationChannels_AddCaption, translations: {
                en: 'Add',
            }
        },
        NotificationChannels_AddDescription: {
            id: StringId.NotificationChannels_AddDescription, translations: {
                en: 'Add a new channel of the selected type',
            }
        },
        NotificationChannels_RemoveSelectedCaption: {
            id: StringId.NotificationChannels_RemoveSelectedCaption, translations: {
                en: 'Delete selected',
            }
        },
        NotificationChannels_RemoveSelectedDescription: {
            id: StringId.NotificationChannels_RemoveSelectedDescription, translations: {
                en: 'Delete channels selected in grid',
            }
        },
        NotificationChannels_SelectAllCaption: {
            id: StringId.NotificationChannels_SelectAllCaption, translations: {
                en: 'Select all',
            }
        },
        NotificationChannels_SelectAllDescription: {
            id: StringId.NotificationChannels_SelectAllDescription, translations: {
                en: 'Select all channels',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_AndFieldHasOrChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_AndFieldHasOrChild, translations: {
                en: '"And" field has "Or" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_AndFieldHasXorChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_AndFieldHasXorChild, translations: {
                en: '"And" field has "Xor" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_OrFieldHasAndChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_OrFieldHasAndChild, translations: {
                en: '"Or" field has "And" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_OrFieldHasXorChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_OrFieldHasXorChild, translations: {
                en: '"Or" field has "Xor" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_XorFieldDoesNotHave2Children: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_XorFieldDoesNotHave2Children, translations: {
                en: '"Xor" field does not have 2 children',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_XorFieldHasAndChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_XorFieldHasAndChild, translations: {
                en: '"Xor" field has "And" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_XorFieldHasOrChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_XorFieldHasOrChild, translations: {
                en: '"Xor" field has "Or" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_XorFieldHasXorChild: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_XorFieldHasXorChild, translations: {
                en: '"Xor" field has "Xor" child',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_AndFieldOperatorCannotBeNegated: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_AndFieldOperatorCannotBeNegated, translations: {
                en: '"And" field operator cannot be negated',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_OrFieldOperatorCannotBeNegated: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_OrFieldOperatorCannotBeNegated, translations: {
                en: '"Or" field operator cannot be negated',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_XorFieldOperatorCannotBeNegated: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_XorFieldOperatorCannotBeNegated, translations: {
                en: '"Xor" field operator cannot be negated',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_AllConditionNotSupported: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_AllConditionNotSupported, translations: {
                en: '"All" condition not supported',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_NoneConditionNotSupported: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_NoneConditionNotSupported, translations: {
                en: '"None" condition not supported',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_FieldConditionsOperationIdMismatch: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_FieldConditionsOperationIdMismatch, translations: {
                en: 'Field conditions operation Id mismatch',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_NumericComparisonBooleanNodeDoesNotHaveANumericFieldValueGetOperand: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_NumericComparisonBooleanNodeDoesNotHaveANumericFieldValueGetOperand, translations: {
                en: 'Numeric comparison does not have a field operand',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_NumericComparisonBooleanNodeDoesNotHaveANumberOperand: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_NumericComparisonBooleanNodeDoesNotHaveANumberOperand, translations: {
                en: 'Numeric comparison does not have a number operand',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_FactoryCreateFieldError: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_FactoryCreateFieldError, translations: {
                en: 'Factory create field error',
            }
        },
        ScanFieldSetLoadErrorTypeDisplay_FactoryCreateFieldConditionError: {
            id: StringId.ScanFieldSetLoadErrorTypeDisplay_FactoryCreateFieldConditionError, translations: {
                en: 'Factory create field condition error',
            }
        },
        OpenWatchlistDialog_ListName_Caption: {
            id: StringId.OpenWatchlistDialog_ListName_Caption, translations: {
                en: 'List name',
            }
        },
        OpenWatchlistDialog_ListName_Description: {
            id: StringId.OpenWatchlistDialog_ListName_Description, translations: {
                en: 'Selected list name',
            }
        },
        ReviewOrderRequest_InvalidPlaceOrderZenithMessage: {
            id: StringId.ReviewOrderRequest_InvalidPlaceOrderZenithMessage, translations: {
                en: 'Invalid place order zenith message',
            }
        },
        ReviewOrderRequest_InvalidAmendOrderZenithMessage: {
            id: StringId.ReviewOrderRequest_InvalidAmendOrderZenithMessage, translations: {
                en: 'Invalid amend order zenith message',
            }
        },
        ReviewOrderRequest_InvalidMoveOrderZenithMessage: {
            id: StringId.ReviewOrderRequest_InvalidMoveOrderZenithMessage, translations: {
                en: 'Invalid move order zenith message',
            }
        },
        ReviewOrderRequest_InvalidCancelOrderZenithMessage: {
            id: StringId.ReviewOrderRequest_InvalidCancelOrderZenithMessage, translations: {
                en: 'Invalid cancel order zenith message',
            }
        },
    } as const;

    const recs: readonly Rec[] = Object.values(recsObject);
    export const recCount = recs.length;

    const isCookieAvailable = (typeof document) !== 'undefined';
    const cookieName = 'i18n-language';
    let currentlanguageId: LanguageId;
    let currentLanguageCode: string;

    export function initialiseStatic(preferredLanguage?: string) {
        const outOfOrderIdx = recs.findIndex((rec: Rec, index: number) => rec.id !== index as StringId);
        if (outOfOrderIdx >= 0) {
            // do not use EnumInfoOutOfOrderError as causes circular error
            const errorName = recs[StringId.EnumInfoOutOfOrderInternalError].translations.en;
            throw new Error(`${errorName}: StringId: ${outOfOrderIdx}, ${recs[outOfOrderIdx].translations.en}`);
        }
        // get the current language from cookie, browser locale
        const langCode = preferredLanguage ?? getCookie(cookieName) ?? getBrowserLanguage();
        const langId = findBestLanguageId(langCode);
        setLanguage(langId);
    }

    export function getlanguageCode() {
        return currentLanguageCode;
    }

    function setLanguage(langId: LanguageId) {
        currentlanguageId = langId;
        currentLanguageCode = Languages[langId].code;
        setCookie(cookieName, currentLanguageCode);
        prepareStrings(langId);
    }

    function setCookie(name: string, value: string, expires?: Date, path?: string) {
        if (!isCookieAvailable) {
            return;
        }
        const expiration = expires ? '; expires=' + expires.toUTCString() : '';
        let cookieStr = `${name}=${value}${expiration}`;
        if (path) {
            cookieStr += ';path=' + path;
        }
        document.cookie = cookieStr;
    }

    function getCookie(name: string): string | null {
        if (!isCookieAvailable) {
            return null;
        }
        const cookie = document.cookie
            .split(';')
            .map(cookieStr => cookieStr.trim())
            .find(cookieStr => cookieStr.startsWith(name + '='));

        return cookie ? cookie.replace(name + '=', '') : null;
    }

    function getBrowserLanguage(): string {
        return navigator.language; // || (navigator as any).userLanguage; // fallback for IE
    }

    function findBestLanguageId(language: string): LanguageId {
        let idx = Languages.findIndex((lang: Language) => lang.code === language);
        if (idx >= 0) {
            return Languages[idx].id;
        } else {
            const langPrefix = language.split('-')[0];
            idx = Languages.findIndex((lang: Language) => lang.code === langPrefix);
            if (idx >= 0) {
                return Languages[idx].id;
            } else {
                return DefaultLanguageId;
            }
        }
    }

    function prepareStrings(langId: LanguageId) {
        for (let i = 0; i < recs.length; i++) {
            Strings[i] = calculateString(i, langId);
        }
    }

    function calculateString(idx: number, langId: LanguageId): string {
        switch (langId) {
            case LanguageId.English: return recs[idx].translations.en;
            default: return '?';
        }
    }

    export function getStringPlusEnglish(id: StringId) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (currentlanguageId === LanguageId.English) {
            return Strings[id];
        } else {
            return Strings[id] + '[ ' + calculateString(id, LanguageId.English) + ']';
        }
    }
}

/** @public */
export const Strings: string[] = new Array<string>(I18nStrings.recCount);
