export interface Session {
    userId?: string;
    username?: string;
    avatar?: string;
    addressLegacy?: string;
    addressCash?: string;
    following?: any;
    badgeCount?: number;
    balances: {
        confirmedBalance: number;
        unconfirmedBalance: number;
        insufficientFunds: boolean;
    };
}
