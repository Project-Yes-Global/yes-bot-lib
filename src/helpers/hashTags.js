"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractHashtags = exports.removeHashtags = void 0;
var removeHashtags = function (msg) {
    var hashtagRegex = /#\w+/g;
    return msg.replace(hashtagRegex, "");
};
exports.removeHashtags = removeHashtags;
var extractHashtags = function (msg) {
    var hashtagRegex = /#\w+/g;
    var hashMatches = msg.match(hashtagRegex);
    var hashTags = {};
    if (hashMatches) {
        hashMatches.forEach(function (hashtag) {
            hashTags[hashtag.replace('#', '')] = true;
        });
    }
    return hashTags;
};
exports.extractHashtags = extractHashtags;
