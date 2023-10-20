"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptManager = exports.MessageStorageManager = void 0;
var openai_1 = require("openai");
var helpers_1 = require("../helpers");
var LIMIT = 20;
var Messages = /** @class */ (function () {
    function Messages() {
        this.queue = [];
    }
    Messages.prototype.add = function (content, role) {
        this.queue.push({ content: content, role: role });
        if (this.queue.length > LIMIT) {
            this.queue.shift();
        }
    };
    Messages.prototype.slice = function (n) {
        if (n === void 0) { n = 1; }
        this.queue = this.queue.slice(n);
    };
    Messages.prototype.getMessages = function () {
        return this.queue;
    };
    return Messages;
}());
var MessageStorageManager = /** @class */ (function () {
    function MessageStorageManager() {
        this.storage = new Map();
    }
    MessageStorageManager.prototype.key = function (_a) {
        var fromId = _a.fromId, chatId = _a.chatId;
        return fromId ? "".concat(chatId, "_").concat(fromId) : chatId.toString();
    };
    MessageStorageManager.prototype.add = function (data, content, role) {
        var key = this.key(data);
        var messages = this.storage.get(key) || new Messages();
        messages.add(content, role);
        this.storage.set(key, messages);
    };
    MessageStorageManager.prototype.get = function (data) {
        var key = this.key(data);
        var storage = this.storage.get(key) || new Messages();
        return storage.getMessages();
    };
    MessageStorageManager.prototype.reset = function (data) {
        var key = this.key(data);
        this.storage.delete(key);
    };
    MessageStorageManager.prototype.slice = function (data) {
        var key = this.key(data);
        var storage = this.storage.get(key) || new Messages();
        storage.slice(4);
        this.storage.set(key, storage);
    };
    return MessageStorageManager;
}());
exports.MessageStorageManager = MessageStorageManager;
var configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
var openai = new openai_1.OpenAIApi(configuration);
var storage = new MessageStorageManager();
var PromptManager = /** @class */ (function () {
    function PromptManager() {
        var _this = this;
        this.storage = storage;
        this.generate = function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            var completion, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, openai.createChatCompletion({
                                model: "gpt-4",
                                messages: ctx.prompts,
                                temperature: 0.4,
                            })];
                    case 1:
                        completion = _b.sent();
                        response = (_a = completion.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
                        if (!response)
                            return [2 /*return*/];
                        console.log('response: ', response);
                        this.saveMessage(ctx, 'assistant', response);
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _b.sent();
                        if (error_1.response) {
                            console.error(error_1.response.status, error_1.response.data);
                        }
                        else {
                            console.error("Error with OpenAI API request: ".concat(error_1.message));
                        }
                        if (error_1.code === 'context_length_exceeded') {
                            this.storage.slice(ctx.data);
                            console.log('slicing....');
                            console.log(this.storage);
                            this.generate(ctx.prompt.createPrompts(ctx));
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    PromptManager.prototype.saveMessage = function (ctx, role, text) {
        if (role === void 0) { role = 'user'; }
        this.storage.add(ctx.data, (0, helpers_1.removeHashtags)(text), role);
    };
    PromptManager.prototype.getMessages = function (ctx) {
        return this.storage.get(ctx.data);
    };
    PromptManager.prototype.resetMessags = function (ctx) {
        this.storage.reset(ctx.data);
    };
    PromptManager.prototype.createPrompts = function (ctx, text) {
        text && this.saveMessage(ctx, 'user', text);
        return Object.assign(ctx, {
            prompts: __spreadArray([
                { role: 'system', content: ctx.systemPrompt.generate(ctx) }
            ], this.getMessages(ctx), true)
        });
    };
    return PromptManager;
}());
exports.PromptManager = PromptManager;
