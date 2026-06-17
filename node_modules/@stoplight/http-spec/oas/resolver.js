"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncReferenceObject = exports.bundleResolveRef = exports.resolveRef = exports.getComponentName = exports.setSharedKey = exports.getSharedKey = exports.inferContext = void 0;
const json_1 = require("@stoplight/json");
function inferContext(path) {
    if (path.length < 2 || path[0] !== 'paths')
        return 'service';
    if (path.length === 2 || path[3] === 'parameters' || path[3] === 'servers')
        return 'path';
    return 'operation';
}
exports.inferContext = inferContext;
const SHARED_COMPONENTS_KEYS = new WeakMap();
function getSharedKey(value, currentKey) {
    var _a;
    return (_a = SHARED_COMPONENTS_KEYS.get(value)) !== null && _a !== void 0 ? _a : currentKey;
}
exports.getSharedKey = getSharedKey;
function setSharedKey(value, key) {
    if (typeof value === 'object' && value !== null) {
        return SHARED_COMPONENTS_KEYS.set(value, key);
    }
    return false;
}
exports.setSharedKey = setSharedKey;
const COMPONENTS_FRAGMENT_PATTERN = /#\/components\/(?<section>[A-Za-z0-9_-]+)\//;
function getComponentName(references, $ref) {
    var _a;
    const uri = getResolved(references, $ref);
    const match = uri.match(COMPONENTS_FRAGMENT_PATTERN);
    return (_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a['section'];
}
exports.getComponentName = getComponentName;
const resolveRef = function (target) {
    const { value: resolved, location } = (0, json_1.resolveInlineRefWithLocation)(this.document, target.$ref);
    const context = inferContext(location);
    if (context !== null && this.context !== context) {
        this.context = context;
    }
    if (typeof resolved === 'object' && resolved !== null && context === 'service') {
        SHARED_COMPONENTS_KEYS.set(resolved, location[0] === 'components' ? location[2] : location[1]);
    }
    return resolved;
};
exports.resolveRef = resolveRef;
const bundleResolveRef = function (target) {
    exports.resolveRef.call(this, target);
    return syncReferenceObject(target, this.references);
};
exports.bundleResolveRef = bundleResolveRef;
function getResolved(references, startingRefUri) {
    const seen = new Set();
    let refUri = startingRefUri;
    while (refUri in references) {
        if (seen.has(refUri)) {
            return refUri;
        }
        seen.add(refUri);
        const referenced = references[refUri];
        refUri = referenced.value;
        if (referenced.resolved) {
            return refUri;
        }
    }
    return refUri;
}
function syncReferenceObject(reference, references) {
    const { $ref } = reference;
    return Object.defineProperty({ ...reference }, '$ref', {
        enumerable: true,
        get() {
            return getResolved(references, $ref);
        },
        set(value) {
            references[$ref] = { value, resolved: true };
        },
    });
}
exports.syncReferenceObject = syncReferenceObject;
//# sourceMappingURL=resolver.js.map