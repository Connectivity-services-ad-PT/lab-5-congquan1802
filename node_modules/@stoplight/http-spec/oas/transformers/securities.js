"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSecurityDeclarationType = void 0;
const types_1 = require("@stoplight/types");
function translateToSecurityDeclarationType({ security, }) {
    let securityDeclarationType = types_1.HttpOperationSecurityDeclarationTypes.InheritedFromService;
    if (Array.isArray(security)) {
        securityDeclarationType =
            security.length === 0
                ? types_1.HttpOperationSecurityDeclarationTypes.None
                : types_1.HttpOperationSecurityDeclarationTypes.Declared;
    }
    return securityDeclarationType;
}
exports.translateToSecurityDeclarationType = translateToSecurityDeclarationType;
//# sourceMappingURL=securities.js.map