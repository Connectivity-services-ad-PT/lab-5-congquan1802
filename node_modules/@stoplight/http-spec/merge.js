"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOperations = exports.mergeResponses = void 0;
const utils_1 = require("./utils");
function isExclusivelyAnyOfSchema(schema) {
    return !!(schema.anyOf && Object.keys(schema).length === 1);
}
function mergeTwo(mergeFunc, first, second) {
    return first && second ? mergeFunc(first, second) : first ? first : second;
}
function mergeSchemas(schema1, schema2) {
    const schemas = (isExclusivelyAnyOfSchema(schema2) ? schema2.anyOf : [schema2]).reduce((schemas, schema) => {
        if (!schemas.find(s => (0, utils_1.isEqual)(s, schema))) {
            return schemas.concat(schema);
        }
        return schemas;
    }, isExclusivelyAnyOfSchema(schema1) ? schema1.anyOf : [schema1]);
    return schemas.length === 1 ? schemas[0] : { anyOf: schemas };
}
function mergeParams(params1, params2) {
    const params1OnlyAndCommon = params1.map(p1 => {
        const p2 = params2.find(p2 => p2.name.toLowerCase() === p1.name.toLowerCase());
        if (p2) {
            return {
                ...p2,
                ...p1,
                required: p1.required && p2.required,
                schema: mergeTwo(mergeSchemas, p1.schema, p2.schema),
            };
        }
        else {
            return {
                ...p1,
                required: false,
            };
        }
    });
    const params2Only = params2
        .filter(p2 => !params1.find(p1 => p1.name.toLowerCase() === p2.name.toLowerCase()))
        .map(h2 => ({ ...h2, required: false }));
    return [...params1OnlyAndCommon, ...params2Only];
}
const mergeContents = mergeLists((c1, c2) => c1.mediaType.toLowerCase() === c2.mediaType.toLowerCase(), (c1, c2) => {
    return {
        id: c1.id,
        mediaType: c1.mediaType,
        schema: mergeTwo(mergeSchemas, c1.schema, c2.schema),
        examples: mergeContentExamples([c1.examples, c2.examples]),
        encodings: mergeContentEncodings([c1.encodings, c2.encodings]),
    };
});
function mergeContentExamples(exampleLists) {
    return exampleLists.reduce((merged, examples) => {
        if (!examples)
            return merged;
        const arr = (Array.isArray(examples) ? examples : [examples]).filter(ex => !(merged || []).find(me => (0, utils_1.isEqual)(me, ex)));
        return merged ? merged.concat(arr) : arr;
    }, undefined);
}
function mergeContentEncodings(encodingLists) {
    return encodingLists.reduce((merged, encodings) => {
        if (!encodings)
            return merged;
        const arr = encodings.filter(enc => !(merged || []).find(me => (0, utils_1.isEqual)(me, enc)));
        return merged ? merged.concat(arr) : arr;
    }, undefined);
}
exports.mergeResponses = mergeLists((r1, r2) => r1.code === r2.code, (r1, r2) => ({
    ...r1,
    headers: mergeParams(r1.headers || [], r2.headers || []),
    contents: mergeContents(r1.contents || [], r2.contents || []),
}));
function mergeRequestBodies(b1, b2) {
    return {
        id: b1.id,
        description: [b1.description, b2.description].filter(Boolean).join('; ') || undefined,
        required: b1.required && b2.required,
        contents: mergeContents(b1.contents || [], b2.contents || []),
    };
}
const mergeServers = mergeLists((s1, s2) => s1.url === s2.url, s1 => s1);
exports.mergeOperations = mergeLists((o1, o2) => o1.path === o2.path && o1.method.toLowerCase() === o2.method.toLowerCase(), (o1, o2) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ({
        ...o1,
        request: {
            ...o1.request,
            path: mergeTwo(mergeParams, (_a = o1.request) === null || _a === void 0 ? void 0 : _a.path, (_b = o2.request) === null || _b === void 0 ? void 0 : _b.path),
            query: mergeTwo(mergeParams, (_c = o1.request) === null || _c === void 0 ? void 0 : _c.query, (_d = o2.request) === null || _d === void 0 ? void 0 : _d.query),
            body: mergeTwo(mergeRequestBodies, (_e = o1.request) === null || _e === void 0 ? void 0 : _e.body, (_f = o2.request) === null || _f === void 0 ? void 0 : _f.body),
            headers: mergeTwo(mergeParams, (_g = o1.request) === null || _g === void 0 ? void 0 : _g.headers, (_h = o2.request) === null || _h === void 0 ? void 0 : _h.headers),
        },
        responses: (0, exports.mergeResponses)(o1.responses, o2.responses),
        servers: mergeServers(o1.servers || [], o2.servers || []),
    });
});
function mergeLists(compare, merge) {
    return (items1, items2) => {
        return items2.reduce((items, item2) => {
            const mergeTargetIdx = items.findIndex((item) => compare(item, item2));
            if (mergeTargetIdx > -1) {
                items[mergeTargetIdx] = merge(items[mergeTargetIdx], item2);
            }
            else {
                items.push(item2);
            }
            return items;
        }, items1.slice());
    };
}
//# sourceMappingURL=merge.js.map