import * as Redux from 'redux';
import produce from 'immer';
import { isPrimitive } from './isPrimitive';
import isPlainObject from 'is-plain-object';

import { notInitialized, payloadNotValid, wrongModify } from './error';
import { Imdux } from './types';

export function createModule<S, R>(params: Imdux.CreateModuleParams<S>): Imdux.Module<S, R> {
    return new (class Module<S, R> implements Imdux.Module<S, R> {
        namespace: string;
        redux: Redux.Store<any, Redux.AnyAction>;
        dispatch: any;
        reducers: any;
        reducer: any;
        options: Imdux.createStoreOptions;

        constructor() {
            this.dispatch = {};
            this.reducers = {};
            this.reducer = (state: any, action: any) => {
                const split: Array<string> = action.type.split('/');
                const namespace = split[0];
                const type = '/' + split.slice(1).join('/');
                if (state === undefined) {
                    return params.initialState;
                } else if (namespace !== this.namespace) {
                    return state;
                } else if (split.length >= 2 && this.reducers[type]) {
                    return this.reducers[type](state, action);
                } else {
                    return state;
                }
            };

            const init = (map: Imdux.Reducers, namespace: string, dispatch: any) => {
                Object.keys(map).forEach(name => {
                    let reducer: any;
                    let path = namespace + '/' + name;
                    if (typeof map[name] === 'function') {
                        reducer = map[name];
                        this.reducers[path] = (state: any, action: any) => produce(state, (draft: any) => reducer(draft, action.payload));
                        dispatch[name] = (payload: any) => {
                            if (!this.redux) {
                                throw new Error(notInitialized);
                            } else {
                                if (!isPlainObject(payload) && !isPrimitive(payload) && !Array.isArray(payload)) {
                                    this.options.payloadNotValidWarn && console.warn(payloadNotValid);
                                }
                                this.redux.dispatch({ type: this.namespace + path, payload });
                            }
                        };
                    } else {
                        if (!dispatch[name]) {
                            dispatch[name] = {};
                        }
                        init(map[name] as any, path, dispatch[name]);
                    }
                });
            };

            init(params.reducers, '', this.dispatch);
        }

        get query() {
            if (!this.redux) {
                throw new Error(notInitialized);
            } else {
                return Object.freeze(this.redux.getState()[this.namespace]);
            }
        }

        set query(value: any) {
            throw new Error(wrongModify);
        }
    })();
}
