"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../../utils");
const jsonSchema7TypeNames = [
    'string',
    'number',
    'integer',
    'boolean',
    'object',
    'array',
    'null',
];
function isJsonSchema6TypeName(maybeJsonSchema7TypeName) {
    return jsonSchema7TypeNames.includes(maybeJsonSchema7TypeName);
}
const createNullableConverter = (keyword) => {
    return schema => {
        if (typeof schema.type !== 'string' || !isJsonSchema6TypeName(schema.type) || !(keyword in schema)) {
            return;
        }
        if (schema[keyword] === true) {
            schema.type = [schema.type, 'null'];
            if (Array.isArray(schema.enum)) {
                schema.enum = [...schema.enum, null];
            }
        }
        else {
            if (keyword === 'nullable') {
                const explicitProperties = (0, utils_1.collectExplicitProperties)(schema);
                schema['x-stoplight'] = { ...schema['x-stoplight'], explicitProperties };
            }
        }
        delete schema[keyword];
    };
};
exports.default = {
    'x-nullable': createNullableConverter('x-nullable'),
    nullable: createNullableConverter('nullable'),
};
//# sourceMappingURL=nullable.js.map