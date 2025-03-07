import { Integer, UsableListChangeTypeId, } from '@pbkware/js-utils';
import { assert, ErrorCode, ZenithDataError } from '../sys/internal-api';
import { BrokerageAccount } from './brokerage-account';
import { BrokerageAccountEnvironmentedId } from './brokerage-account-environmented-id';
import {
    BrokerageAccountsDataMessage,
    DataDefinition,
    DataMessage,
    DataMessageTypeId,
    FeedClassId
} from './common/internal-api';
import { KeyedCorrectnessSettableListFeedSubscriptionDataItem, TradingFeed } from './feed/internal-api';
import { MarketsService } from './markets/internal-api';

export class BrokerageAccountsDataItem extends KeyedCorrectnessSettableListFeedSubscriptionDataItem<BrokerageAccount> {

    constructor(private readonly _marketsService: MarketsService, definition: DataDefinition) {
        super(definition, FeedClassId.Authority, undefined); // do not need zenithFeedName as (for now) there is only one in this class;
    }

    getAccount(accountZenithCode: string) {
        return this.getRecordByMapKey(accountZenithCode);
    }
    // getAccountById(accountId: BrokerageAccountId) {
    //     const mapKey = Account.Key.generateMapKey(accountId, TradingEnvironment.getDefaultId());
    //     return this.getRecordByMapKey(mapKey);
    // }
    // getAccountByKey(accountKey: Account.Key) {
    //     return this.getRecordByMapKey(accountKey.mapKey);
    // }

    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.BrokerageAccounts) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
                const accountsMsg = msg as BrokerageAccountsDataMessage;
                this.processMessage_Accounts(accountsMsg);
            } finally {
                this.endUpdate();
            }
        }
    }

    // protected override processFeedsBecameUsable() {
    //     let feedName: string | undefined;
    //     for (const feed of this.feeds) {
    //         if (feed.classId === FeedClassId.Authority) {
    //             // For now, there should only be one Authority feed so use the first one found!
    //             feedName = feed.zenithName;
    //             break;
    //         }
    //     }
    //     if (feedName === undefined) {
    //         const badness: Badness = {
    //             reasonId: Badness.ReasonId.NoAuthorityFeed,
    //             reasonExtra: '',
    //         };
    //         this.setUnusable(badness);
    //     } else {
    //         this.setFeed(FeedClassId.Authority, );
    //     }

    //     super.processFeedsBecameUsable();
    // }

    private createAccount(msgAccount: BrokerageAccountsDataMessage.Account) {
        // const accountId = msgAccount.id;
        const zenithCode = msgAccount.zenithCode;
        const name = msgAccount.name;
        if (name === undefined) {
            throw new ZenithDataError(ErrorCode.BADICAN402991273, zenithCode);
        } else {
            // const tradingFeedId = msgAccount.tradingFeed;
            // if (tradingFeedId === undefined) {
            //     throw new ZenithDataError(ErrorCode.BADICAFI009922349, accountId);
            // } else {
                const tradingFeed = this.getFeed(FeedClassId.Trading, msgAccount.zenithTradingFeedCode);
                if (!(tradingFeed instanceof TradingFeed)) {
                    throw new ZenithDataError(ErrorCode.BADICAFTF0109922349, `${zenithCode}: ${name}`);
                } else {
                    const id = BrokerageAccountEnvironmentedId.createFromZenithCode(this._marketsService, zenithCode)
                    const currencyId = msgAccount.currencyId;

                    const result = new BrokerageAccount(
                        zenithCode,
                        id,
                        tradingFeed,
                        name,
                        currencyId,
                        msgAccount.brokerCode ?? undefined,
                        msgAccount.branchCode ?? undefined,
                        msgAccount.advisorCode ?? undefined,
                        this.correctnessId,
                    );

                    return result;
                }
            // }
        }
    }

    private addRange(msgAccounts: BrokerageAccountsDataMessage.Accounts, rangeStartIdx: Integer, count: Integer) {
        const addStartIdx = this.extendRecordCount(count);
        let addIdx = addStartIdx;
        for (let i = rangeStartIdx; i < rangeStartIdx + count; i++) {
            const msgAccount = msgAccounts[i];
            const account = this.createAccount(msgAccount);
            this.setRecord(addIdx++, account);
        }
        this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, addStartIdx, count);
    }

    private checkAddRange(msgAccounts: BrokerageAccountsDataMessage.Accounts, rangeStartIdx: Integer, rangeEndPlusOneIdx: Integer) {
        if (rangeStartIdx >= 0) {
            const count = rangeEndPlusOneIdx - rangeStartIdx;
            this.addRange(msgAccounts, rangeStartIdx, count);
        }
        return -1;
    }

    private processMessage_Accounts(msg: BrokerageAccountsDataMessage): void {
        assert(msg instanceof BrokerageAccountsDataMessage, 'ID:43212081047');

        const msgAccounts = msg.accounts;
        const msgAccountCount = msgAccounts.length;

        let addStartMsgIdx = -1;

        for (let i = 0; i < msgAccountCount; i++) {
            const msgAccount = msg.accounts[i];
            // const key = new Account.Key(msgAccount.id, msgAccount.environmentId);
            // const mapKey = key.mapKey;

            const account = this.getRecordByMapKey(msgAccount.zenithCode);
            if (account !== undefined) {
                addStartMsgIdx = this.checkAddRange(msgAccounts, addStartMsgIdx, i);
                account.change(msgAccount);
            } else {
                if (addStartMsgIdx < 0) {
                    addStartMsgIdx = i;
                }
            }
        }

        this.checkAddRange(msgAccounts, addStartMsgIdx, msg.accounts.length);
    }
}

export namespace BrokerageAccountsDataItem {
    export type ListChangeEventHandler = (this: void, listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) => void;
}
