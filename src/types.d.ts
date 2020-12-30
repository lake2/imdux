import * as Redux from 'redux';

export namespace Imdux {
    export interface Module<S, R> {
        dispatch: InferModuleDispath<R>;
        query: S;
    }

    export interface Modules {
        [key: string]: Imdux.Module<any, any>;
    }

    export interface Store<T> {
        Dispatch: InferDispatch<T>;
        Query: InferState<T>;
        redux: Redux.Store<any, Redux.AnyAction>;
    }

    type IsAny<T> = 0 extends 1 & T ? true : false;
    type IsUnknown<T> = IsAny<T> extends true ? false : T extends number ? false : T | 0 extends T ? true : false;

    // prettier-ignore
    type InferModuleDispathFunction<T> = T extends (...arg: infer A) => any ?
        (A["length"] extends 1 ?
            () => void
            :
            (A["length"] extends 1 | 2 ?
                (T extends (draft: any, payload: infer R) => any ?
                    (payload: R) => void
                    :
                    never
                )
                :
                never
            )
        )
        :
        never;

    export type InferModuleDispath<T> = {
        [K in keyof T]: T[K] extends (...arg: any) => any ? InferModuleDispathFunction<T[K]> : InferModuleDispath<T[K]>;
    };

    export type InferDispatch<T> = {
        [K in keyof T]: T[K] extends Module<any, infer R> ? InferModuleDispath<R> : unknown;
    };

    export type InferState<T> = {
        [K in keyof T]: T[K] extends Module<infer S, any> ? S : unknown;
    };

    export type Draft<T = any> = (draft: T, store: any, payload: any) => T | void;

    export interface Reducers {
        [key: string]: Draft | Reducers;
    }

    export interface CreateModuleParams<T> {
        initialState: T;
        reducers: Reducers;
    }

    export interface createStoreOptions {
        devtool: boolean; // false
        payloadNotValidWarn: boolean; // true
        name?: string;
    }
}

export declare function createStore<T extends Imdux.Modules>(modules: T, options?: Partial<Imdux.createStoreOptions>): Imdux.Store<T>;

export declare function createModule<S, R>(params: Imdux.CreateModuleParams<S>): Imdux.Module<S, R>;
