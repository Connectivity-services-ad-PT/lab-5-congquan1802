"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createExampleConverter = (keyword) => {
    return schema => {
        if (!(keyword in schema))
            return;
        schema.examples = [schema[keyword]];
        delete schema[keyword];
    };
};
exports.default = {
    'x-example': createExampleConverter('x-example'),
    example: createExampleConverter('example'),
};
//# sourceMappingURL=example.js.map