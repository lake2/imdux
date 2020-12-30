import { createModule, createStore } from '../';
import { getRootState } from '../getRootState';
// import { Imdux } from "../types";

describe('imdux object state', () => {
    type State = typeof initialState;
    type Reducers = typeof reducers;
    type Store = {
        home: {
            count: number;
            last: number;
        };
    };

    const initialState = {
        count: 1,
        last: 0,
    };

    const reducers = {
        increase(draft: State, payload: { inc: number }) {
            const root = getRootState<Store>(payload);
            console.log(payload);
            draft.count += payload.inc;
            draft.last = root.home.count;
        },
    };

    it('createStore', () => {
        const home = createModule<State, Reducers>({ initialState, reducers });
        const modules = { home };
        const { Dispatch, Query, redux } = createStore(modules);

        let flag = 0;
        redux.subscribe(() => (flag = 1));
        Dispatch.home.increase({ inc: 1 });
        expect(Query.home.count).toBe(2);
        expect(Query.home.last).toBe(1);
        expect(flag).toBe(1);

        redux.subscribe(() => (flag = 2));
        Dispatch.home.increase({ inc: 1 });
        expect(Query.home.count).toBe(3);
        expect(Query.home.last).toBe(2);
        expect(flag).toBe(2);
    });
});
