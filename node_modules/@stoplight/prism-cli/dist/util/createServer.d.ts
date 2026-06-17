import { CreatePrism } from './runner';
declare const createMultiProcessPrism: CreatePrism;
declare const createSingleProcessPrism: CreatePrism;
type CreateBaseServerOptions = {
    dynamic: boolean;
    cors: boolean;
    host: string;
    port: number;
    document: string;
    multiprocess: boolean;
    errors: boolean;
    verboseLevel: string;
    ignoreExamples: boolean;
    seed: string;
    jsonSchemaFakerFillProperties: boolean;
};
export interface CreateProxyServerOptions extends CreateBaseServerOptions {
    upstream: URL;
    validateRequest: boolean;
    upstreamProxy: string | undefined;
}
export type CreateMockServerOptions = CreateBaseServerOptions;
export { createMultiProcessPrism, createSingleProcessPrism };
