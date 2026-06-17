"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const type_is_1 = require("type-is");
const xmlSerializer = new fast_xml_parser_1.XMLBuilder({});
const serializers = [
    {
        test: (value) => !!(0, type_is_1.is)(value, ['application/json', 'application/*+json']),
        serializer: JSON.stringify,
    },
    {
        test: (value) => !!(0, type_is_1.is)(value, ['application/xml', 'application/*+xml']),
        serializer: (data) => (typeof data === 'string' ? data : xmlSerializer.build({ xml: data })),
    },
    {
        test: (value) => !!(0, type_is_1.is)(value, ['text/*']),
        serializer: (data) => {
            if (['string', 'undefined'].includes(typeof data)) {
                return data;
            }
            throw Object.assign(new Error('Cannot serialise complex objects as text'), {
                detail: 'Cannot serialise complex objects as text',
                status: 500,
                name: 'https://stoplight.io/prism/errors#NO_COMPLEX_OBJECT_TEXT',
            });
        },
    },
];
const serialize = (payload, contentType) => {
    if (!contentType && !payload) {
        return;
    }
    const serializer = contentType ? serializers.find(s => s.test(contentType)) : undefined;
    if (!serializer) {
        if (typeof payload === 'string')
            return payload;
        throw new Error(`Cannot find serializer for ${contentType}`);
    }
    return serializer.serializer(payload);
};
exports.serialize = serialize;
