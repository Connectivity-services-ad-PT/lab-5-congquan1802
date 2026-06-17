"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROXY_UNSUPPORTED_REQUEST_BODY = exports.UPSTREAM_NOT_IMPLEMENTED = void 0;
exports.UPSTREAM_NOT_IMPLEMENTED = {
    type: 'UPSTREAM_NOT_IMPLEMENTED',
    title: 'The server does not support the functionality required to fulfill the request',
    status: 501,
};
exports.PROXY_UNSUPPORTED_REQUEST_BODY = {
    type: 'PROXY_UNSUPPORTED_REQUEST_BODY',
    title: 'The Prism proxy does not support sending a GET/HEAD request with a message body to an upstream server. See: https://github.com/stoplightio/prism/issues/2259',
    status: 501,
};
