import { HttpSecurityKind } from './types';
declare type Context = {
    parentId: string;
};
export declare const idGenerators: {
    tag: (props: {
        name: string;
    }) => string;
    schema: (props: Context & {
        key: string;
    }) => string;
    schemaProperty: (props: Context & {
        key: string | number;
    }) => string;
    example: (props: Context & {
        keyOrName: string;
    }) => string;
    httpPath: (props: Context & {
        path: string;
    }) => string;
    httpWebhookName: (props: Context & {
        name: string;
    }) => string;
    httpOperation: (props: Context & {
        method: string;
        path: string;
    }) => string;
    httpWebhookOperation: (props: Context & {
        method: string;
        name: string;
    }) => string;
    httpCallbackOperation: (props: Context & {
        method: string;
        path: string;
        key: string;
    }) => string;
    httpPathParam: (props: Context & {
        keyOrName: string;
    }) => string;
    httpQuery: (props: Context & {
        keyOrName: string;
    }) => string;
    httpCookie: (props: Context & {
        keyOrName: string;
    }) => string;
    httpHeader: (props: Context & {
        keyOrName: string;
        componentType: 'parameter' | 'header' | 'unknown';
    }) => string;
    httpRequestBody: (props: Context & {
        key?: string;
        consumes?: string[];
    }) => string;
    httpMedia: (props: {
        parentId: string;
        mediaType?: string;
    }) => string;
    httpSecurity: (props: {
        parentId: string;
        keyOrName?: string;
        kind: HttpSecurityKind;
        index?: number;
        scopeKeys?: string[];
    }) => string;
    httpServer: (props: {
        parentId: string;
        url: string;
    }) => string;
    httpResponse: (props: {
        parentId: string;
        codeOrKey: string;
        produces?: string[];
    }) => string;
};
export {};
