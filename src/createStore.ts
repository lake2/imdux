import * as Redux from 'redux';

import { Imdux } from './types';
import { wrongModify } from './error';

export function createStore<T extends Imdux.Modules>(modules: T, opt?: Partial<Imdux.createStoreOptions>): Imdux.Store<T> {
    return new (class Store<T> implements Imdux.Store<T> {
        Dispatch: any;
        Query: any;
        redux: Redux.Store<any, Redux.AnyAction>;

        constructor() {
            this.Dispatch = {};
            this.Query = {};
            const options: Imdux.createStoreOptions = { devtool: false, payloadNotValidWarn: true, ...(opt || {}) };

            const reducers: any = {};
            Object.keys(modules).forEach(name => {
                const action = modules[name] as any;
                reducers[name] = action.reducer;
            });
            const rootReducer = Redux.combineReducers(reducers);
            const middleware = (store: any) => (next: any) => (action: any) => {
                next({ ...action, rootState: store.getState() });
            };
            this.redux = Redux.createStore(
                rootReducer,
                Redux.compose(
                    Redux.applyMiddleware(middleware),
                    options?.devtool ? (window as any).__REDUX_DEVTOOLS_EXTENSION__?.({ trace: true, name: options.name }) : (x: any) => x,
                ),
            );

            Object.keys(modules).forEach(name => {
                const action = modules[name] as any;
                action.options = options;
                action.redux = this.redux;
                action.namespace = name;
                this.Dispatch[name] = modules[name].dispatch;
                Object.defineProperty(this.Query, name, {
                    get() {
                        return modules[name].query;
                    },
                    set() {
                        throw new Error(wrongModify);
                    },
                });
            });
        }
    })();
}
