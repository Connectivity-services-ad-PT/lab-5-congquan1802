import { DeepPartial, IHttpService } from '@stoplight/types';
import { Spec } from 'swagger-schema-official';
import { OpenAPIObject } from '../oas3/types';
import { TranslateFunction } from '../types';
export declare const transformOasService: TranslateFunction<DeepPartial<OpenAPIObject> | DeepPartial<Spec>, [], IHttpService>;
