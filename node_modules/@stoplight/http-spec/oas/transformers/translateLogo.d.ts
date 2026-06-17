import type { DeepPartial, Dictionary, IHttpService } from '@stoplight/types';
import type { InfoObject } from 'openapi3-ts/src/model/OpenApi';
import type { Info } from 'swagger-schema-official';
export declare function translateLogo({ 'x-logo': logo, contact, }: DeepPartial<Info | InfoObject> & {
    'x-logo': Dictionary<unknown>;
}): IHttpService['logo'];
