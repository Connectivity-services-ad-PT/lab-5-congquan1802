export declare function entries<T = Record<string, unknown>>(o: {
    [s: string]: T;
} | ArrayLike<T>): [string, T][];
export declare function entries<T = unknown>(o: T): [string, T][];
export declare function isEqual(left: unknown, right: unknown): boolean;
export declare function collectExplicitProperties(o: unknown): string[];
export declare function extractId(schema: unknown): string | undefined;
