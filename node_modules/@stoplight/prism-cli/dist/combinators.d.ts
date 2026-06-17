import * as E from 'fp-ts/Either';
export declare const sequenceSEither: <E, NER extends Record<string, E.Either<E, any>>>(r: (keyof NER extends never ? never : NER) & Record<string, E.Either<E, any>>) => E.Either<E, { [K in keyof NER]: [NER[K]] extends [E.Either<any, infer A>] ? A : never; }>;
