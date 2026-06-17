import type { IBundledHttpService, Optional } from '@stoplight/types';
import type { ArrayCallbackParameters, Fragment, TransformerContext } from '../../types';
import { OasVersion } from '../types';
interface Components {
    responses: IBundledHttpService['components']['responses'];
    definitions: IBundledHttpService['components']['schemas'];
    schemas: IBundledHttpService['components']['schemas'];
    requestBodies: IBundledHttpService['components']['requestBodies'];
    examples: IBundledHttpService['components']['examples'];
    securitySchemes: IBundledHttpService['components']['securitySchemes'];
    securityDefinitions: IBundledHttpService['components']['securitySchemes'];
}
declare type Translator<K extends keyof Components> = (...params: ArrayCallbackParameters<[key: string, response: unknown]>) => Optional<Omit<Components[K][number], 'key'>>;
declare type Translators = {
    responses?: Translator<'responses'>;
    definitions?: Translator<'schemas'>;
    schemas?: Translator<'schemas'>;
    requestBodies?: Translator<'requestBodies'>;
    examples?: Translator<'examples'>;
    securitySchemes?: Translator<'securitySchemes'>;
    securityDefinitions?: Translator<'securitySchemes'>;
};
export declare const translateToComponents: (this: TransformerContext<Fragment>, spec: OasVersion, translators: Translators) => Pick<IBundledHttpService['components'], 'responses' | 'schemas' | 'requestBodies' | 'examples' | 'securitySchemes'>;
export {};
