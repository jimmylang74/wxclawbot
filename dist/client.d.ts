export interface SendResult {
    ok: boolean;
    to: string;
    clientId: string;
    error?: string;
}
export declare class WxClawClient {
    private baseUrl;
    private token;
    private botId;
    constructor(opts: {
        baseUrl: string;
        token: string;
        botId?: string;
    });
    sendText(to: string, text: string, opts?: {
        dryRun?: boolean;
    }): Promise<SendResult>;
    sendFile(to: string, filePath: string, opts?: {
        text?: string;
        dryRun?: boolean;
    }): Promise<SendResult>;
    private sendItems;
    private post;
}
