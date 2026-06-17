"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withContext = exports.createContext = void 0;
const json_1 = require("@stoplight/json");
const generators_1 = require("./generators");
function wrapGenerateId(generateId) {
    const gn = (value) => {
        this.parentId = generateId(value);
        return this.parentId;
    };
    for (const [name, fn] of Object.entries(generators_1.idGenerators)) {
        gn[name] = (props) => {
            return gn(fn(Object.assign({ parentId: this.parentId }, props)));
        };
    }
    return gn;
}
function createContext(document, resolveRef, generateId) {
    let context = 'service';
    let wrappedGenerateId;
    return {
        document,
        get context() {
            return context;
        },
        set context(value) {
            context = value;
            if (value !== 'operation') {
                this.parentId = this.ids[value];
            }
        },
        maybeResolveLocalRef(target) {
            if ((0, json_1.hasRef)(target) && (0, json_1.isLocalRef)(target.$ref)) {
                try {
                    return resolveRef.call(this, target);
                }
                catch {
                    return;
                }
                finally {
                    this.parentId = this.ids[context];
                }
            }
            return target;
        },
        get generateId() {
            return (wrappedGenerateId !== null && wrappedGenerateId !== void 0 ? wrappedGenerateId : (wrappedGenerateId = wrapGenerateId.call(this, generateId)));
        },
        ids: {
            service: '',
            path: '',
            operation: '',
            webhookName: '',
            webhook: '',
        },
        references: {},
        parentId: '',
    };
}
exports.createContext = createContext;
function withContext(fn) {
    return function (...args) {
        const { context, parentId } = this;
        const result = fn.apply(this, args);
        this.context = context;
        this.parentId = parentId;
        return result;
    };
}
exports.withContext = withContext;
//# sourceMappingURL=context.js.map