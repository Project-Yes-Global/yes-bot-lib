"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemPromptManager = void 0;
var SystemPromptStorage = /** @class */ (function () {
    function SystemPromptStorage() {
        this.storage = new Map();
    }
    SystemPromptStorage.prototype.key = function (_a) {
        var fromId = _a.fromId, chatId = _a.chatId;
        return fromId ? "".concat(chatId, "_").concat(fromId) : chatId.toString();
    };
    SystemPromptStorage.prototype.add = function (data, prompt) {
        var key = this.key(data);
        this.storage.set(key, prompt);
    };
    SystemPromptStorage.prototype.get = function (data) {
        var key = this.key(data);
        return this.storage.get(key);
        ;
    };
    SystemPromptStorage.prototype.reset = function (data) {
        var key = this.key(data);
        this.storage.delete(key);
    };
    return SystemPromptStorage;
}());
var storage = new SystemPromptStorage();
var SystemPromptManager = /** @class */ (function () {
    function SystemPromptManager(defaultPrompt) {
        this.storage = storage;
        this.default = defaultPrompt;
    }
    SystemPromptManager.prototype.generate = function (ctx) {
        return this.getPrompt(ctx);
    };
    SystemPromptManager.prototype.getPrompt = function (ctx) {
        return this.storage.get(ctx.data) || this.default;
    };
    SystemPromptManager.prototype.savePrompt = function (ctx, prompt) {
        this.storage.add(ctx.data, prompt);
    };
    SystemPromptManager.prototype.resetPrompt = function (ctx) {
        this.storage.reset(ctx.data);
    };
    return SystemPromptManager;
}());
exports.SystemPromptManager = SystemPromptManager;
