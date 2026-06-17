"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateLogo = void 0;
const lodash_1 = require("lodash");
function translateLogo({ 'x-logo': logo, contact, }) {
    return {
        altText: 'logo',
        href: contact === null || contact === void 0 ? void 0 : contact.url,
        ...(0, lodash_1.pickBy)(logo, (val, key) => typeof val === 'string' && ['altText', 'href', 'backgroundColor', 'url'].includes(key)),
    };
}
exports.translateLogo = translateLogo;
//# sourceMappingURL=translateLogo.js.map