"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpDigest = void 0;
const Either_1 = require("fp-ts/Either");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const digestWWWAuthenticate = 'Digest realm="*", nonce="abc123"';
function checkDigestHeader(authorizationHeader) {
    const [authScheme, ...info] = authorizationHeader.split(' ');
    const isDigestInfoGiven = info && isDigestInfo(info);
    const isDigestScheme = (0, utils_1.isScheme)('digest', authScheme);
    return (0, utils_1.genRespForScheme)(isDigestScheme, isDigestInfoGiven, digestWWWAuthenticate);
}
function isDigestInfo(info) {
    const infoAsString = info.join('');
    return (infoAsString.includes('username=') &&
        infoAsString.includes('realm=') &&
        infoAsString.includes('nonce=') &&
        infoAsString.includes('uri=') &&
        infoAsString.includes('response=') &&
        info.every(schemeParam => new RegExp(/(?:'|")([a-z0-9]*)(?:'|")/).test(schemeParam)));
}
const httpDigest = (input) => {
    const authorizationHeader = (0, lodash_1.get)(input, ['headers', 'authorization'], '');
    return authorizationHeader ? checkDigestHeader(authorizationHeader) : (0, Either_1.left)((0, utils_1.genUnauthorisedErr)(digestWWWAuthenticate));
};
exports.httpDigest = httpDigest;
