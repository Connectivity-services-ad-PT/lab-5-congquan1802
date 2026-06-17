"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripWriteOnlyProperties = exports.stripReadOnlyProperties = void 0;
const function_1 = require("fp-ts/function");
const O = require("fp-ts/Option");
const A = require("fp-ts/Array");
const buildSchemaFilter = (keepPropertyPredicate) => {
    function filterPropertiesFromObjectSingle(schema) {
        return (0, function_1.pipe)(O.fromNullable(schema.items), O.chain(items => O.fromNullable(items.properties)), O.alt(() => O.fromNullable(schema.properties)), O.alt(() => (0, function_1.pipe)(O.fromNullable(schema.additionalItems), O.map(additionalItems => additionalItems.properties))), O.chain((unfilteredProps) => filterPropertiesHelper(O.fromNullable(unfilteredProps))), O.map(filteredProperties => {
            if (schema.items) {
                if (Array.isArray(schema.items) && typeof schema.additionalItems === 'object') {
                    return {
                        ...schema,
                        additionalItems: {
                            ...schema.additionalItems,
                            properties: filteredProperties
                        }
                    };
                }
                else if (typeof schema.items === 'object') {
                    return {
                        ...schema,
                        items: {
                            ...schema.items,
                            properties: filteredProperties,
                        },
                    };
                }
            }
            return {
                ...schema,
                properties: filteredProperties,
            };
        }), O.alt(() => O.some(schema)));
    }
    function filterPropertiesFromObjectsList(schema) {
        return (0, function_1.pipe)(O.fromNullable(schema.items), O.chain(items => (0, function_1.pipe)(items, A.map(item => item.properties), propertiesArray => O.fromNullable(propertiesArray))), O.map(unfilteredProps => (0, function_1.pipe)(unfilteredProps, A.map(unfilteredProp => filterPropertiesHelper(O.fromNullable(unfilteredProp))))), O.map(filteredProperties => {
            const items = (0, function_1.pipe)(A.zip(schema.items, filteredProperties), A.map(([item, properties]) => ({
                ...item,
                properties: (0, function_1.pipe)(properties, O.getOrElse(() => ({})))
            })));
            return {
                ...schema,
                items: [
                    ...items
                ]
            };
        }), O.alt(() => O.some(schema)));
    }
    function filterPropertiesHelper(properties) {
        return (0, function_1.pipe)(properties, O.map(properties => (0, function_1.pipe)(Object.keys(properties), A.reduce({}, (filteredProperties, propertyName) => (0, function_1.pipe)(properties[propertyName], O.fromPredicate(p => {
            if (typeof p === 'boolean') {
                filteredProperties[propertyName] = properties[propertyName];
                return false;
            }
            return true;
        }), O.chain(p => filter(p)), O.map(v => ({ ...filteredProperties, [propertyName]: v })), O.fold(() => filteredProperties, v => v))))));
    }
    function filterRequiredFromObjectSingle(updatedSchema, originalSchema) {
        function getCorrectSchema(schema) {
            if (Array.isArray(schema.items) && typeof schema.additionalItems === 'object') {
                return schema.additionalItems;
            }
            else if (typeof schema.items === 'object') {
                return schema.items;
            }
            return schema;
        }
        return (0, function_1.pipe)(updatedSchema, schema => filterRequiredHelper(getCorrectSchema(schema), getCorrectSchema(originalSchema)), O.map(required => {
            if (Array.isArray(updatedSchema.items) && typeof updatedSchema.additionalItems === 'object') {
                return {
                    ...updatedSchema,
                    additionalItems: {
                        ...updatedSchema.additionalItems,
                        required: required
                    }
                };
            }
            else if (updatedSchema.items && typeof updatedSchema.items === 'object') {
                return {
                    ...updatedSchema,
                    items: {
                        ...updatedSchema.items,
                        required: required,
                    },
                };
            }
            return {
                ...updatedSchema,
                required: required,
            };
        }), O.alt(() => O.some(updatedSchema)));
    }
    function filterRequiredFromObjectsList(updatedSchema, originalSchema) {
        return (0, function_1.pipe)(O.fromNullable(updatedSchema.items), O.chain(itemSchemas => (0, function_1.pipe)(O.fromNullable(originalSchema.items), O.map(originalItemSchemas => A.zip(itemSchemas, originalItemSchemas)), O.map(zippedSchemas => zippedSchemas.map(([itemSchema, originalItemSchema]) => filterRequiredHelper(itemSchema, originalItemSchema))))), O.map(requiredList => {
            const items = (0, function_1.pipe)(A.zip(updatedSchema.items, requiredList), A.map(([item, required]) => {
                return {
                    ...item,
                    required: (0, function_1.pipe)(required, O.getOrElse(() => []))
                };
            }));
            return {
                ...updatedSchema,
                items: [
                    ...items
                ]
            };
        }), O.alt(() => O.some(updatedSchema)));
    }
    function filterRequiredHelper(updatedSchema, originalSchema) {
        return (0, function_1.pipe)(updatedSchema, O.fromPredicate(schema => Array.isArray(schema.required)), O.map(schema => Object.keys(schema.properties || {})), O.map(updatedProperties => {
            const originalPropertyNames = Object.keys(originalSchema.properties || {});
            return originalPropertyNames.filter(name => !updatedProperties.includes(name));
        }), O.map(removedProperties => {
            const required = originalSchema.required;
            return required.filter(name => !removedProperties.includes(name));
        }));
    }
    function filter(inputSchema) {
        return (0, function_1.pipe)(inputSchema, keepPropertyPredicate, O.chain(inputSchema => (0, function_1.pipe)(O.fromNullable(inputSchema), O.chain(schema => Array.isArray(schema.items) ?
            (0, function_1.pipe)(filterPropertiesFromObjectsList(schema), O.chain(filteredSchema => filterPropertiesFromObjectSingle(filteredSchema)))
            : filterPropertiesFromObjectSingle(schema)))), O.chain(schema => (0, function_1.pipe)(O.fromNullable(schema), O.chain(schema => Array.isArray(schema.items) ?
            (0, function_1.pipe)(filterRequiredFromObjectsList(schema, inputSchema), O.chain(filteredSchema => filterRequiredFromObjectSingle(filteredSchema, inputSchema)))
            : filterRequiredFromObjectSingle(schema, inputSchema)))));
    }
    return filter;
};
exports.stripReadOnlyProperties = buildSchemaFilter(O.fromPredicate((schema) => schema.readOnly !== true));
exports.stripWriteOnlyProperties = buildSchemaFilter(O.fromPredicate((schema) => schema.writeOnly !== true));
