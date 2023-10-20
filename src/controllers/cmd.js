"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsManager = void 0;
var CommandStorageManager = /** @class */ (function () {
    function CommandStorageManager() {
        this.storage = new Map();
    }
    CommandStorageManager.prototype.key = function (_a) {
        var chatId = _a.chatId;
        return chatId.toString();
    };
    CommandStorageManager.prototype.add = function (data, cmd) {
        var key = this.key(data);
        this.storage.set(key, cmd);
    };
    CommandStorageManager.prototype.get = function (data) {
        var key = this.key(data);
        return this.storage.get(key);
        ;
    };
    CommandStorageManager.prototype.reset = function (data) {
        var key = this.key(data);
        this.storage.delete(key);
    };
    return CommandStorageManager;
}());
var COMMANDS = ['/start'];
var storage = new CommandStorageManager();
var CommandsManager = /** @class */ (function () {
    function CommandsManager() {
        this.storage = storage;
    }
    CommandsManager.prototype.command = function (_, cmd) {
        throw new Error("Method not implemented. Command: ".concat(cmd));
    };
    CommandsManager.prototype.isCommand = function (cmd) {
        return COMMANDS.includes(cmd);
    };
    CommandsManager.prototype.canCommand = function (ctx) {
        console.log(this.storage);
        return !!this.storage.get(ctx.data);
    };
    CommandsManager.prototype.getCommand = function (ctx) {
        return this.storage.get(ctx.data);
    };
    CommandsManager.prototype.saveCommand = function (ctx, cmd) {
        this.storage.add(ctx.data, cmd);
    };
    CommandsManager.prototype.hasCommand = function (ctx, cmd) {
        return this.storage.get(ctx.data) === cmd;
    };
    CommandsManager.prototype.resetCommand = function (ctx) {
        this.storage.reset(ctx.data);
    };
    return CommandsManager;
}());
exports.CommandsManager = CommandsManager;
