import * as Redux from "redux";

import { Imdux } from "./types";
import { wrongModify } from "./error";

export function createStore<T extends Imdux.Actions>(actions: T, opt?: Partial<Imdux.createStoreOptions>): Imdux.Store<T> {
    return new class Store<T> implements Imdux.Store<T> {
        Dispatch: any;
        Query: any;
        redux: Redux.Store<any, Redux.AnyAction>;

        constructor() {
            this.Dispatch = {};
            this.Query = {};
            const options: Imdux.createStoreOptions = { devtool: false, payloadNotValidWarn: true, ...(opt || {}) };

            const reducers: any = {};
            Object.keys(actions).forEach(name => {
                const action = actions[name] as any;
                reducers[name] = action.reducer;
            });
            const rootReducer = Redux.combineReducers(reducers);
            this.redux = Redux.createStore(
                rootReducer,
                options?.devtool ? (window as any).__REDUX_DEVTOOLS_EXTENSION__?.({ trace: true, name: options.name }) : undefined
            );

            Object.keys(actions).forEach(name => {
                const action = actions[name] as any;
                action.options = options;
                action.redux = this.redux;
                action.namespace = name;
                this.Dispatch[name] = actions[name].dispatch;
                Object.defineProperty(this.Query, name, {
                    get() {
                        return actions[name].query;
                    },
                    set() {
                        throw new Error(wrongModify);
                    },
                });
            });
        }
    }();
}
