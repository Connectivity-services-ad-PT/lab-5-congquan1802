"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertId = schema => {
    if (!('id' in schema))
        return;
    const { id } = schema;
    delete schema.id;
    if (typeof id === 'string') {
        schema.$id = id;
    }
};
exports.default = { id: convertId };
//# sourceMappingURL=id.js.map