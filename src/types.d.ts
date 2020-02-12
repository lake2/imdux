import * as Redux from "redux";

export namespace Imdux {

    export interface Action<S, R> {
        dispatch: InferActionDispath<R>,
        query: S
    }

    export interface Actions {
        [key: string]: Imdux.Action<any, any>;
    }

    export interface Store<T> {
        Dispatch: InferDispatch<T>,
        Query: InferState<T>,
        redux: Redux.Store<any, Redux.AnyAction>;
    }

    export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

    type DispatherIntersection<T> = {
        [K in keyof T]: UnionToIntersection<T[K]>
    }

    export type InferActionDispath<T> = {
        [K in keyof T]: T[K] extends (draft: any, payload: infer R) => any ? R extends (Object | null) ? (payload: R) => void : () => void : unknown
    }

    export type InferDispatch<T> = {
        [K in keyof T]: T[K] extends Action<any, infer R> ? DispatherIntersection<InferActionDispath<R>> : unknown
    }

    export type InferState<T> = {
        [K in keyof T]: T[K] extends Action<infer S, any> ? S : unknown
    }

    export interface CreateActionParams<T> {
        initialState: T,
        reducers: {
            [key: string]: (draft: T, payload: any) => T | void,
        }
    }

    export interface createStoreOptions {
        devtool: boolean                  // false
        payloadNotValidWarn: boolean      // true
    }
}

export declare function createStore<T extends Imdux.Actions>(actions: T, options?: Partial<Imdux.createStoreOptions>): Imdux.Store<T>;

export declare function createAction<S, R>(params: Imdux.CreateActionParams<S>): Imdux.Action<S, R>;
