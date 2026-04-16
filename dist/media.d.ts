import { type MessageItem } from "./types.js";
export declare function aesEcbPaddedSize(plaintextSize: number): number;
export declare function encryptAesEcb(plaintext: Buffer, key: Buffer): Buffer;
export declare function classifyMedia(filePath: string): {
    cdnType: number;
    itemType: number;
};
export declare function uploadFile(opts: {
    data: Buffer;
    filePath: string;
    toUserId: string;
    baseUrl: string;
    token: string;
    cdnBaseUrl?: string;
}): Promise<{
    item: MessageItem;
}>;
export declare function readFileOrUrl(filePath: string): Promise<{
    data: Buffer;
    name: string;
}>;
