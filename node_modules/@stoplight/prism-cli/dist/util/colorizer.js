"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachTagsToParamsValues = exports.transformPathParamsValues = exports.POST_PARAM_VALUE_TAG = exports.PRE_PARAM_VALUE_TAG = void 0;
const lodash_1 = require("lodash");
exports.PRE_PARAM_VALUE_TAG = '~pre~';
exports.POST_PARAM_VALUE_TAG = '~post~';
const taggedParamsValues = new RegExp(`${exports.PRE_PARAM_VALUE_TAG}(.*?)${exports.POST_PARAM_VALUE_TAG}`, 'gm');
const transformPathParamsValues = (path, transform) => {
    return path.replace(taggedParamsValues, transform('$1'));
};
exports.transformPathParamsValues = transformPathParamsValues;
const attachTagsToParamsValues = values => {
    return (0, lodash_1.mapValues)(values, attachPrePostTags);
};
exports.attachTagsToParamsValues = attachTagsToParamsValues;
const attachPrePostTags = (paramValue) => {
    if ((0, lodash_1.isArray)(paramValue)) {
        return paramValue.map(v => `${exports.PRE_PARAM_VALUE_TAG}${v}${exports.POST_PARAM_VALUE_TAG}`);
    }
    else if (paramValue && typeof paramValue === 'object') {
        for (const key of Object.keys(paramValue)) {
            paramValue[key] = `${exports.PRE_PARAM_VALUE_TAG}${paramValue[key]}${exports.POST_PARAM_VALUE_TAG}`;
        }
        return paramValue;
    }
    else {
        return `${exports.PRE_PARAM_VALUE_TAG}${paramValue}${exports.POST_PARAM_VALUE_TAG}`;
    }
};
