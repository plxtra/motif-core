import { AssertInternalError, Guid, parseIntStrict, UnreachableCaseError } from '../../../../sys/internal-api';
import { ScanAttachedNotificationChannel, ScanDataDefinition, ScanTargetTypeId, unknownZenithCode, ZenithSymbol } from '../../../common/internal-api';
import { ZenithProtocolCommon } from '../../../common/zenith-protocol/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithDistributionChannelsConvert } from './zenith-distribution-channels-convert';

export namespace ZenithNotifyConvert {
    export namespace ScanType {
        export function toId(value: ZenithProtocol.NotifyController.ScanType) {
            switch (value) {
                case ZenithProtocol.NotifyController.ScanType.MarketSearch: return ScanTargetTypeId.Markets;
                case ZenithProtocol.NotifyController.ScanType.MarketMonitor: return ScanTargetTypeId.Symbols;
                default:
                    throw new UnreachableCaseError('ZNCSTTI20008', value);
            }
        }

        export function fromId(value: ScanTargetTypeId) {
            switch (value) {
                case ScanTargetTypeId.Markets: return ZenithProtocol.NotifyController.ScanType.MarketSearch;
                case ScanTargetTypeId.Symbols: return ZenithProtocol.NotifyController.ScanType.MarketMonitor;
                default:
                    throw new UnreachableCaseError('ZNCSTFI20008', value);
            }
        }
    }

    export namespace Target {
        export function toZenithSymbols(symbols: readonly ZenithProtocol.NotifyController.TargetSymbol[]): ZenithSymbol[] {
            return ZenithConvert.Symbol.toZenithSymbolArray(symbols);
        }

        export function toMarketZenithCodes(markets: readonly ZenithProtocol.NotifyController.TargetMarket[]): readonly string[] {
            return markets.slice();
        }

        export function fromTargets(
            typeId: ScanTargetTypeId,
            targets: ScanDataDefinition.Targets,
        ): string[] {
            switch (typeId) {
                case ScanTargetTypeId.Symbols: {
                    const targetDataIvemIds = targets as readonly ZenithSymbol[];
                    if (targetDataIvemIds.length === 0) {
                        return [];
                    } else {
                        if (typeof targetDataIvemIds[0] !== 'object') {
                            throw new AssertInternalError('ZNCTFISO44711');
                        } else {
                            return ZenithConvert.Symbol.fromZenithSymbolArray(targetDataIvemIds);
                        }
                    }
                }
                case ScanTargetTypeId.Markets: {
                    const zenithCodes = targets as readonly string[];
                    const zenithCodeCount = zenithCodes.length;
                    if (zenithCodeCount === 0) {
                        return [];
                    } else {
                        if (typeof zenithCodes[0] !== 'number') {
                            throw new AssertInternalError('ZNCTFIMN44711');
                        } else {
                            const targetMarkets = new Array<string>(zenithCodeCount);
                            let targetMarketCount = 0;
                            for (let i = 0; i < zenithCodeCount; i++) {
                                const zenithCode = zenithCodes[i];
                                if (zenithCode !== unknownZenithCode) {
                                    targetMarkets[targetMarketCount++] = zenithCode;
                                }
                            }
                            targetMarkets.length = targetMarketCount;
                            return targetMarkets.slice();
                        }
                    }
                }
                default:
                    throw new UnreachableCaseError('ZNCTFITU53339', typeId);
            }
        }
    }

    export namespace NotificationParameters {
        export function from(value: readonly ScanAttachedNotificationChannel[]): ZenithProtocol.NotifyController.ScanParameters.Notification[] {
            const count = value.length;
            const result = new Array<ZenithProtocol.NotifyController.ScanParameters.Notification>(count);
            for (let i = 0; i < count; i++) {
                const valueElement = value[i];
                const valueElementMinimumElapsed = valueElement.minimumElapsed;
                const minimumElapsed = valueElementMinimumElapsed === undefined ? undefined : ZenithConvert.Time.fromTimeSpan(valueElementMinimumElapsed);
                const valueElementMinimumStable = valueElement.minimumStable;
                const minimumStable = valueElementMinimumStable === undefined ? undefined : ZenithConvert.Time.fromTimeSpan(valueElementMinimumStable);
                const valueElementChannelSourceSettings = valueElement.channelSourceSettings;
                const settings = valueElementChannelSourceSettings === undefined ?
                    undefined :
                    ZenithDistributionChannelsConvert.NotificationSourceSettings.from(valueElementChannelSourceSettings);
                const resultElement: ZenithProtocol.NotifyController.ScanParameters.Notification = {
                    ChannelID: valueElement.channelId,
                    CultureCode: valueElement.cultureCode,
                    MinimumElapsed: minimumElapsed,
                    MinimumStable: minimumStable,
                    Settings: settings,
                };
                result[i] = resultElement;
            }
            return result;
        }

        export function to(value: ZenithProtocol.NotifyController.ScanParameters.Notification[]): ScanAttachedNotificationChannel[] {
            const count = value.length;
            const result = new Array<ScanAttachedNotificationChannel>(count);
            for (let i = 0; i < count; i++) {
                const valueElement = value[i];
                const valueElementMinimumElapsed = valueElement.MinimumElapsed;
                const minimumElapsed = valueElementMinimumElapsed === undefined ? undefined : ZenithConvert.Time.toTimeSpan(valueElementMinimumElapsed);
                const valueElementMinimumStable = valueElement.MinimumStable;
                const minimumStable = valueElementMinimumStable === undefined ? undefined : ZenithConvert.Time.toTimeSpan(valueElementMinimumStable);
                const valueElementsettings = valueElement.Settings;
                const channelSourceSettings = valueElementsettings === undefined ?
                    undefined :
                    ZenithDistributionChannelsConvert.NotificationSourceSettings.to(valueElementsettings);
                const resultElement: ScanAttachedNotificationChannel = {
                    channelId: valueElement.ChannelID,
                    cultureCode: valueElement.CultureCode,
                    minimumElapsed: minimumElapsed,
                    minimumStable: minimumStable,
                    channelSourceSettings,
                };
                result[i] = resultElement;
            }
            return result;
        }
    }

    export interface ScanMetadata {
        readonly versionNumber: number | undefined;
        readonly versionId: string | undefined;
        readonly versioningInterrupted: boolean;
        readonly lastSavedTime: Date | undefined;
        readonly lastEditSessionId: Guid | undefined;
        readonly symbolListEnabled: boolean | undefined;
        readonly zenithCriteriaSource: string | undefined;
        readonly zenithRankSource: string | undefined;
    }

    export namespace ScanMetaType {
        export function from(value: ScanMetadata): ZenithProtocolCommon.UserMetadata {
            const versionNumber = value.versionNumber;
            if (versionNumber === undefined) {
                throw new AssertInternalError('ZNCSMTFVN44498');
            } else {
                const versionId = value.versionId;
                if (versionId === undefined) {
                    throw new AssertInternalError('ZNCSMTFVI44498');
                } else {
                    const lastSavedTime = value.lastSavedTime;
                    if (lastSavedTime === undefined) {
                        throw new AssertInternalError('ZNCSMTFLST44498');
                    } else {
                        const lastEditSessionId = value.lastEditSessionId;
                        if (lastEditSessionId === undefined) {
                            throw new AssertInternalError('ZNCSMTFLESI44498');
                        } else {
                            const symbolListEnabled = value.symbolListEnabled;
                            if (symbolListEnabled === undefined) {
                                throw new AssertInternalError('ZNCSMTFSLE44498');
                            } else {
                                return {
                                    versionId,
                                    versioningInterrupted: value.versioningInterrupted ? 'true' : 'false',
                                    lastSavedTime: ZenithConvert.Date.DateTimeIso8601.fromDate(lastSavedTime),
                                    lastEditSessionId: lastEditSessionId,
                                    symbolListEnabled: symbolListEnabled ? 'true' : 'false',
                                    zenithCriteriaSource: value.zenithCriteriaSource,
                                    zenithRankSource: value.zenithRankSource,
                                }
                            }
                        }
                    }
                }
            }
        }

        export function to(value: ZenithProtocolCommon.UserMetadata): ScanMetadata {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const versionNumberAsString = value['versionNumber'];
            const versionNumber = versionNumberAsString === undefined ? undefined : parseIntStrict(versionNumberAsString);
            const versionId = value['versionId'];
            const versioningInterruptedAsString: string | undefined  = value['versioningInterrupted'];
            const versioningInterrupted = versioningInterruptedAsString === undefined || versioningInterruptedAsString.toUpperCase() !== 'FALSE';
            const lastSavedTimeAsString = value['lastSavedTime'];
            const lastEditSessionId = value['lastEditSessionId'];
            const symbolListEnabledAsString = value['symbolListEnabled'];
            const symbolListEnabled = symbolListEnabledAsString === undefined ? undefined : symbolListEnabledAsString.toUpperCase() === 'TRUE';
            const zenithCriteriaSource = value['zenithCriteriaSource'];
            const zenithRankSource = value['zenithRankSource'];
            let lastSavedTime: Date | undefined;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (lastSavedTimeAsString === undefined) {
                lastSavedTime = undefined;
            } else {
                const lastSavedTimeAsSourceTzOffsetDateTime = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(lastSavedTimeAsString);
                if (lastSavedTimeAsSourceTzOffsetDateTime === undefined) {
                    lastSavedTime = undefined;
                } else {
                    lastSavedTime = lastSavedTimeAsSourceTzOffsetDateTime.utcDate;
                }
            }
            return {
                versionNumber,
                versionId,
                versioningInterrupted,
                lastSavedTime,
                lastEditSessionId,
                symbolListEnabled,
                zenithCriteriaSource,
                zenithRankSource,
            }
        }
    }
}
