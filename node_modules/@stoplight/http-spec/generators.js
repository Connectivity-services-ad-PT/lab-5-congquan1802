"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idGenerators = void 0;
const guards_1 = require("./guards");
function join(dependencies) {
    return dependencies.join('-');
}
function sortAlphabetically(input) {
    return input.slice().sort((a, b) => a.localeCompare(b));
}
function sanitizePath(path) {
    return path.replace(/({)[^}]+(?=})/g, '$1');
}
exports.idGenerators = {
    tag: (props) => {
        return join(['tag', props.name]);
    },
    schema: (props) => {
        return join(['schema', props.parentId, props.key]);
    },
    schemaProperty: (props) => {
        return join(['schema_property', props.parentId, String(props.key)]);
    },
    example: (props) => {
        return join(['example', props.parentId, props.keyOrName]);
    },
    httpPath: (props) => {
        return join(['http_path', props.parentId, sanitizePath(props.path)]);
    },
    httpWebhookName: (props) => {
        return join(['http_webhook_name', props.parentId, sanitizePath(props.name)]);
    },
    httpOperation: (props) => {
        return join(['http_operation', props.parentId, props.method, sanitizePath(props.path)]);
    },
    httpWebhookOperation: (props) => {
        return join(['http_webhook_operation', props.parentId, props.method, sanitizePath(props.name)]);
    },
    httpCallbackOperation: (props) => {
        return join(['http_callback', props.parentId, props.key, props.method, props.path]);
    },
    httpPathParam: (props) => {
        return join(['http_path_param', props.parentId, props.keyOrName]);
    },
    httpQuery: (props) => {
        return join(['http_query', props.parentId, props.keyOrName]);
    },
    httpCookie: (props) => {
        return join(['http_cookie', props.parentId, props.keyOrName]);
    },
    httpHeader: (props) => {
        return join(['http_header', props.parentId, props.componentType, props.keyOrName]);
    },
    httpRequestBody: (props) => {
        const deps = [
            'http_request_body',
            props.parentId,
            ...(Array.isArray(props.consumes) ? sortAlphabetically(props.consumes) : []),
        ];
        if ((0, guards_1.isNonNullable)(props.key)) {
            deps.push(props.key);
        }
        return join(deps);
    },
    httpMedia: (props) => {
        return join(['http_media', props.parentId, props.mediaType]);
    },
    httpSecurity: (props) => {
        var _a, _b, _c;
        return join([
            'http_security',
            props.parentId,
            props.kind,
            props.keyOrName,
            ...(props.kind === 'requirement' ? [String((_a = props.index) !== null && _a !== void 0 ? _a : ''), (_c = (_b = props.scopeKeys) === null || _b === void 0 ? void 0 : _b.join('|')) !== null && _c !== void 0 ? _c : ''] : []),
        ]);
    },
    httpServer: (props) => {
        return join(['http_server', props.parentId, props.url]);
    },
    httpResponse: (props) => {
        return join([
            'http_response',
            props.parentId,
            props.codeOrKey,
            ...(Array.isArray(props.produces) ? sortAlphabetically(props.produces) : []),
        ]);
    },
};
//# sourceMappingURL=generators.js.map