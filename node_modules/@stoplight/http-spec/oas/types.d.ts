import { DeepPartial, IHttpEndpointOperation, IHttpOperation } from '@stoplight/types';
import type * as OAS3 from 'openapi3-ts';
import type * as OAS2 from 'swagger-schema-official';
import type { HttpEndpointOperationTransformer, HttpServiceBundle, HttpServiceTransformer, ITransformEndpointOperationOpts, ITransformServiceOpts } from '../types';
export declare enum OasVersion {
    OAS2 = 2,
    OAS3 = 3
}
export declare type Oas2TransformServiceOpts = ITransformServiceOpts<DeepPartial<OAS2.Spec & {
    'x-stoplight': {
        id: string;
        slug: string;
    };
}>>;
export declare type Oas3TransformServiceOpts = ITransformServiceOpts<DeepPartial<OAS3.OpenAPIObject>>;
export declare type Oas2HttpServiceTransformer = HttpServiceTransformer<Oas2TransformServiceOpts>;
export declare type Oas3HttpServiceTransformer = HttpServiceTransformer<Oas3TransformServiceOpts>;
export declare type Oas2HttpServiceBundle = HttpServiceBundle<Oas3TransformServiceOpts>;
export declare type Oas3HttpServiceBundle = HttpServiceBundle<Oas3TransformServiceOpts>;
export declare type Oas2TransformOperationOpts = ITransformEndpointOperationOpts<DeepPartial<OAS2.Spec>>;
export declare type Oas3TransformOperationOpts = ITransformEndpointOperationOpts<DeepPartial<OAS3.OpenAPIObject>>;
export declare type Oas2HttpOperationTransformer = HttpEndpointOperationTransformer<Oas2TransformOperationOpts, IHttpOperation>;
export declare type Oas3HttpEndpointOperationTransformer<T extends IHttpEndpointOperation = IHttpEndpointOperation> = HttpEndpointOperationTransformer<Oas3TransformOperationOpts, T>;
export declare type Oas3ParamBase = ParamBase & {
    in: OAS3.ParameterLocation;
};
export declare type Oas2ParamBase = ParamBase & {
    in: OAS2.BaseParameter['in'];
};
export declare type ParamBase = {
    name: string;
    in: string;
} & Record<string, unknown>;
export declare type PathItemObject = Omit<OAS2.Path, '$ref'> | Omit<OAS3.PathItemObject, '$ref'>;
export declare type OperationObject = OAS2.Operation | OAS3.OperationObject;
