export declare function isNonNullable<T>(value: T): value is NonNullable<T>;
export declare function isBoolean(input: unknown): input is boolean;
export declare function isString(value: unknown): value is string;
export declare function isSerializablePrimitive(value: unknown): value is string | number | boolean | null;
