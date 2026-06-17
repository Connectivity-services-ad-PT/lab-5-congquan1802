import type { DeepPartial } from '@stoplight/types';
import type { Operation, Security, Spec } from 'swagger-schema-official';
export declare type SecurityWithKey = Security & {
    key: string;
};
export declare function getSecurities(spec: DeepPartial<Spec>, operationSecurity: unknown): SecurityWithKey[][];
export declare function getProduces(spec: DeepPartial<Spec>, operation: DeepPartial<Operation>): string[];
export declare function getConsumes(spec: DeepPartial<Spec>, operation: DeepPartial<Operation>): string[];
export declare function normalizeProducesOrConsumes(input: unknown): string[];
export declare function getExamplesFromSchema(data: unknown): Record<string, unknown>;
