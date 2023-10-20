"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prompt_1 = require("../prompt");
describe('StorageManager', function () {
    var storage;
    var data;
    beforeEach(function () {
        storage = new prompt_1.MessageStorageManager();
        data = {
            chatId: 123,
            fromId: 456
        };
    });
    test('add and get messages', function () {
        var message1 = { content: 'Hello, world!', role: 'assistant' };
        var message2 = { content: 'How are you?', role: 'user' };
        storage.add(data, message1.content, message1.role);
        storage.add(data, message2.content, message2.role);
        var messages = storage.get(data);
        expect(messages).toEqual([message1, message2]);
    });
    test('get messages for non-existent chat/user', function () {
        var messages = storage.get(data);
        expect(messages).toEqual([]);
    });
});
