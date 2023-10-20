"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatSettings = void 0;
var createChatSettings = function (msg) {
    var _a;
    return ({
        chatId: msg.chat.id,
        fromId: (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id
    });
};
exports.createChatSettings = createChatSettings;
