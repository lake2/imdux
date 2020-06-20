import * as Redux from "redux";
import produce from "immer";
import isPrimitiveType from "is-primitive";
import isPlainObject from "is-plain-object";

import { Imdux } from "./types";
import { notInitialized, payloadNotValid, wrongModify } from "./error";

export function createAction<S, R>(params: Imdux.CreateActionParams<S>): Imdux.Action<S, R> {
    return new class Action<S, R> implements Imdux.Action<S, R>{
        name: string;
        redux: Redux.Store<any, Redux.AnyAction>;
        dispatch: any;
        reducers: any;
        reducer: any;
        options: Imdux.createStoreOptions;

        constructor() {
            this.dispatch = {};
            this.reducers = {};
            this.reducer = (state: any, action: any) => {
                const split: Array<string> = action.type.split("/");
                const name = split[0];
                const type = split.slice(1).join("/");
                if (state === undefined) {
                    return params.initialState;
                } else if (name !== this.name) {
                    return state;
                } else if (split.length >= 2 && this.reducers[type]) {
                    return this.reducers[type](state, action.payload);
                } else {
                    return state;
                }
            };
            Object.keys(params.reducers).forEach(name => {
                const reducer = params.reducers[name];
                this.reducers[name] = (state: any, payload: any) => produce(state, (draft: any) => reducer(draft, payload));
                this.dispatch[name] = (payload: any) => {
                    if (!this.redux) {
                        throw new Error(notInitialized);
                    } else {
                        if (!isPlainObject(payload) && !isPrimitiveType(payload) && !Array.isArray(payload)) {
                            this.options.payloadNotValidWarn && console.warn(payloadNotValid);
                        }
                        this.redux.dispatch({ type: `${this.name}/${name}`, payload });
                    }
                };
            });
        }

        get query() {
            if (!this.redux) {
                throw new Error(notInitialized);
            } else {
                return Object.freeze(this.redux.getState()[this.name]);
            }
        }

        set query(value: any) {
            throw new Error(wrongModify);
        }
    }();
}
