import { IHttpOperation } from '@stoplight/types';
import type { OperationObject } from 'openapi3-ts/src/model/OpenApi';
import type { Operation } from 'swagger-schema-official';
export declare function translateToSecurityDeclarationType({ security, }: Partial<Operation | OperationObject>): IHttpOperation['securityDeclarationType'];
