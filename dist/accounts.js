import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const DEFAULT_BASE_URL = "https://ilinkai.weixin.qq.com";
function extractBotId(token) {
    const colonIdx = token.indexOf(":");
    return colonIdx > 0 ? token.substring(0, colonIdx) : "";
}
function stateDir() {
    return (process.env.OPENCLAW_STATE_DIR?.trim() ||
        process.env.CLAWDBOT_STATE_DIR?.trim() ||
        path.join(os.homedir(), ".openclaw"));
}
function weixinStateDir() {
    return path.join(stateDir(), "openclaw-weixin");
}
function accountsDir() {
    return path.join(weixinStateDir(), "accounts");
}
function indexPath() {
    return path.join(weixinStateDir(), "accounts.json");
}
export function listAccountIds() {
    try {
        const raw = fs.readFileSync(indexPath(), "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            const ids = parsed.filter((id) => typeof id === "string" && id !== "");
            if (ids.length > 0)
                return ids;
        }
    }
    catch {
        // fall through to directory scan
    }
    return scanAccountsDir();
}
function scanAccountsDir() {
    try {
        const dir = accountsDir();
        return fs
            .readdirSync(dir)
            .filter((f) => f.endsWith(".json") && !f.endsWith(".sync.json"))
            .map((f) => f.replace(/\.json$/, ""));
    }
    catch {
        return [];
    }
}
export function loadAccountData(accountId) {
    if (accountId.includes("/") ||
        accountId.includes("\\") ||
        accountId.includes("..")) {
        return null;
    }
    const filePath = path.join(accountsDir(), `${accountId}.json`);
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
function resolveBotId(data) {
    return data.userId?.trim() || extractBotId(data.token ?? "");
}
export function resolveAccount(accountId) {
    const envToken = process.env.WXCLAW_TOKEN?.trim();
    const envBaseUrl = process.env.WXCLAW_BASE_URL?.trim();
    if (envToken && !accountId) {
        return {
            id: "env",
            token: envToken,
            baseUrl: envBaseUrl || DEFAULT_BASE_URL,
            botId: extractBotId(envToken),
        };
    }
    const ids = listAccountIds();
    const targetId = accountId || ids[0];
    if (!targetId)
        return null;
    const data = loadAccountData(targetId);
    if (!data?.token)
        return null;
    return {
        id: targetId,
        token: data.token,
        baseUrl: data.baseUrl?.trim() || DEFAULT_BASE_URL,
        botId: resolveBotId(data),
        defaultTo: data.userId?.trim() || undefined,
    };
}
export function listAccounts() {
    const ids = listAccountIds();
    return ids.map((id) => {
        const data = loadAccountData(id);
        return {
            id,
            configured: Boolean(data?.token),
            baseUrl: data?.baseUrl?.trim() || DEFAULT_BASE_URL,
        };
    });
}
//# sourceMappingURL=accounts.js.map