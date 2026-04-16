import type { AccountData, ResolvedAccount } from "./types.js";
export declare function listAccountIds(): string[];
export declare function loadAccountData(accountId: string): AccountData | null;
export declare function resolveAccount(accountId?: string): ResolvedAccount | null;
export declare function listAccounts(): Array<{
    id: string;
    configured: boolean;
    baseUrl: string;
}>;
