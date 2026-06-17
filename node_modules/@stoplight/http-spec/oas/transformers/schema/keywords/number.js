"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRangeConverter(keyword, valueKeyword) {
    return schema => {
        if (!(keyword in schema))
            return;
        const { [keyword]: value } = schema;
        if (typeof value === 'number') {
            return;
        }
        else if (value !== true || typeof schema[valueKeyword] !== 'number') {
            delete schema[keyword];
        }
        else {
            schema[keyword] = schema[valueKeyword];
            delete schema[valueKeyword];
        }
    };
}
exports.default = {
    exclusiveMinimum: createRangeConverter('exclusiveMinimum', 'minimum'),
    exclusiveMaximum: createRangeConverter('exclusiveMaximum', 'maximum'),
};
//# sourceMappingURL=number.js.map