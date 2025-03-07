import { EnumInfoOutOfOrderError, Integer } from '@pbkware/js-utils';
import { RevTableFieldSourceDefinition } from 'revgrid';
import { TextFormattableValue } from '../../../../services/internal-api';
// import { GridRecordFieldState } from '../../../record/grid-record-internal-api';
import { CorrectnessTableField, TableField } from '../../field/internal-api';
import { CorrectnessTableValue, TableValue } from '../../value/internal-api';

export abstract class TableFieldSourceDefinition extends RevTableFieldSourceDefinition<TableFieldSourceDefinition.TypeId, TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {
    constructor(typeId: TableFieldSourceDefinition.TypeId) {
        super(typeId, TableFieldSourceDefinition.Type.idToName(typeId));
    }
}

export namespace TableFieldSourceDefinition {
    export const enum TypeId {
        Feed,
        DataIvemId,
        RankedDataIvemId,
        DataIvemBaseDetail,
        DataIvemExtendedDetail,
        DataIvemAlternateCodes,
        MyxDataIvemAttributes,
        EditableColumnLayoutDefinitionColumn,
        SecurityDataItem,
        BrokerageAccount,
        Order,
        Holding,
        Balances,
        CallPut,
        CallSecurityDataItem,
        PutSecurityDataItem,
        TopShareholder,
        Scan,
        RankedDataIvemIdListDirectoryItem,
        GridField,
        ScanFieldEditorFrame, // outside
        LockerScanAttachedNotificationChannel,
        LockOpenNotificationChannel,
        ExchangeEnvironment,
        Exchange,
        TradingMarket,
        DataMarket,
        MarketBoard
        /*DataIvemId_News,
        IvemId_Holding,
        CashItem_Holding,
        DataIvemId_IntradayProfitLossSymbolRec,
        DataIvemId_Alerts,
        DataIvemId_TmcDefinitionLegs,
        CallPut_SecurityDataItem,
        IvemId_CustomHolding,*/
    }

    export namespace Type {
        export type Id = TypeId;

        export const feedName = 'Feed';
        export const DataIvemIdName = 'Dii';
        export const rankedDataIvemIdName = 'Rdi';
        export const dataIvemBaseDetailName = 'Dib';
        export const dataIvemExtendedDetailName = 'Die';
        export const dataIvemAlternateCodesName = 'Diac';
        export const myxDataIvemAttributesName = 'MyxDA';
        export const editableColumnLayoutDefinitionColumnName = 'Gldc';
        export const securityDataItemName = 'SecDI';
        export const brokerageAccountsName = 'Ba';
        export const ordersDataItemName = 'Odi';
        export const holdingsDataItemName = 'Hdi';
        export const balancesDataItemName = 'Bdi';
        export const callPutName = 'Cp';
        export const callPutSecurityDataItemName = 'CSecDI';
        export const putSecurityDataItemName = 'PSecDI';
        export const topShareholdersDataItemName = 'Tsh';
        export const scanName = 'Scn';
        export const rankedDataIvemIdListDirectoryItemName = 'RllDI';
        export const gridFieldName = 'Gf';
        export const ScanFieldEditorFrameName = 'Sfef';
        export const LockerScanAttachedNotificationChannelName = 'LSAnc';
        export const LockOpenNotificationChannelName = 'LONC'
        export const ExchangeEnvironmentName = 'EE';
        export const ExchangeName = 'E';
        export const TradingMarketName = 'TM';
        export const DataMarketName = 'DM';
        export const MarketBoardName = 'MB';

        interface Info {
            readonly id: Id;
            readonly name: string;
        }

        type InfoObjects = { [id in keyof typeof TypeId]: Info };
        const infoObject: InfoObjects = {
            Feed: { id: TypeId.Feed, name: feedName },
            DataIvemId: { id: TypeId.DataIvemId, name: DataIvemIdName },
            RankedDataIvemId: { id: TypeId.RankedDataIvemId, name: rankedDataIvemIdName },
            DataIvemBaseDetail: { id: TypeId.DataIvemBaseDetail, name: dataIvemBaseDetailName },
            DataIvemExtendedDetail: { id: TypeId.DataIvemExtendedDetail, name: dataIvemExtendedDetailName },
            DataIvemAlternateCodes: { id: TypeId.DataIvemAlternateCodes, name: dataIvemAlternateCodesName },
            MyxDataIvemAttributes: { id: TypeId.MyxDataIvemAttributes, name: myxDataIvemAttributesName },
            EditableColumnLayoutDefinitionColumn: { id: TypeId.EditableColumnLayoutDefinitionColumn, name: editableColumnLayoutDefinitionColumnName },
            SecurityDataItem: { id: TypeId.SecurityDataItem, name: securityDataItemName },
            BrokerageAccount: { id: TypeId.BrokerageAccount, name: brokerageAccountsName },
            Order: { id: TypeId.Order, name: ordersDataItemName },
            Holding: { id: TypeId.Holding, name: holdingsDataItemName },
            Balances: { id: TypeId.Balances, name: balancesDataItemName },
            CallPut: { id: TypeId.CallPut, name: callPutName },
            CallSecurityDataItem: { id: TypeId.CallSecurityDataItem, name: callPutSecurityDataItemName },
            PutSecurityDataItem: { id: TypeId.PutSecurityDataItem, name: putSecurityDataItemName },
            TopShareholder: { id: TypeId.TopShareholder, name: topShareholdersDataItemName },
            Scan: { id: TypeId.Scan, name: scanName },
            RankedDataIvemIdListDirectoryItem: { id: TypeId.RankedDataIvemIdListDirectoryItem, name: rankedDataIvemIdListDirectoryItemName },
            GridField: { id: TypeId.GridField, name: gridFieldName },
            ScanFieldEditorFrame: { id: TypeId.ScanFieldEditorFrame, name: ScanFieldEditorFrameName },
            LockerScanAttachedNotificationChannel: { id: TypeId.LockerScanAttachedNotificationChannel, name: LockerScanAttachedNotificationChannelName },
            LockOpenNotificationChannel: { id: TypeId.LockOpenNotificationChannel, name: LockOpenNotificationChannelName },
            ExchangeEnvironment: { id: TypeId.ExchangeEnvironment, name: ExchangeEnvironmentName},
            Exchange: { id: TypeId.Exchange, name: ExchangeName},
            TradingMarket: { id: TypeId.TradingMarket, name: TradingMarketName},
            DataMarket: { id: TypeId.DataMarket, name: DataMarketName},
            MarketBoard: { id: TypeId.MarketBoard, name: MarketBoardName},
        };

        const infos: Info[] = Object.values(infoObject);
        export const idCount = infos.length;

        export function idToName(id: TypeId): string {
            return infos[id].name;
        }

        export function tryNameToId(name: string) {
            for (const info of infos) {
                if (info.name === name) {
                    return info.id;
                }
            }
            return undefined;
        }

        export function initialiseSource() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as TypeId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('TableField.DefinitionSource.SourceId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }
    }

    export type TableFieldValueConstructors = [
        field: TableField.Constructor,
        value: TableValue.Constructor
    ];

    // used by descendants
    export type TableGridConstructors = [
        TableField.Constructor,
        TableValue.Constructor
    ];

    // used by descendants
    export type CorrectnessTableGridConstructors = [
        CorrectnessTableField.Constructor,
        CorrectnessTableValue.Constructor
    ];

    export function initialise() {
        Type.initialiseSource();
    }

    export type FieldName = RevTableFieldSourceDefinition.FieldName<TypeId>;
    export type FieldId = RevTableFieldSourceDefinition.FieldId<TypeId>;

    // export function decodeCommaTextFieldName(value: string): Result<FieldName> {
    //     const commaTextResult = CommaText.tryToStringArray(value, true);
    //     if (commaTextResult.isErr()) {
    //         return CommaTextErr.createOuter(commaTextResult.error, ErrorCode.TableFieldSourceDefinition_InvalidCommaText);
    //     } else {
    //         const strArray = commaTextResult.value;
    //         if (strArray.length !== 2) {
    //             return new Err(ErrorCode.TableFieldSourceDefinition_DecodeCommaTextFieldNameNot2Elements);
    //         } else {
    //             const sourceName = strArray[0];
    //             const sourceId = Type.tryNameToId(sourceName);
    //             if (sourceId === undefined) {
    //                 return new Err(ErrorCode.TableFieldSourceDefinition_DecodeCommaTextFieldNameUnknownSourceId);
    //             } else {
    //                 const decodedFieldName: FieldName = {
    //                     sourceTypeId: sourceId,
    //                     sourcelessName: strArray[1],
    //                 }

    //                 return new Ok(decodedFieldName);
    //             }
    //         }
    //     }
    // }

}
