import { createModule, createStore } from '../';
// import { Imdux } from "../types";

describe('imdux object state', () => {
    type State = typeof initialState;
    type Reducers = typeof reducers;

    const initialState = {
        name: '',
        count: 1,
        show: false,
        array: [1],
    };

    const reducers = {
        increase(draft: State, payload: { inc: number }) {
            draft.count += payload.inc;
        },
        decrease(draft: State, payload: number) {
            draft.count -= payload;
        },
        replace(draft: State, payload: State): State {
            return payload;
        },
        show(draft: State) {
            draft.show = true;
        },
        hide(draft: State, payload: '1' | '2' | '3' | null | undefined) {
            draft.show = false;
        },
        array(draft: State, payload: Array<number>) {
            draft.array = payload;
        },
        optional(draft: State, payload?: number) {
            draft.count -= 1;
        },
    };

    const reducers2 = {
        increase(draft: State, payload: { inc: number }) {
            draft.count += payload.inc;
        },
    };

    it('createStore', () => {
        const home = createModule<State, Reducers>({ initialState, reducers });
        const modules = { home };
        const { Dispatch, Query, redux } = createStore(modules);
        expect(Query.home.name).toBe('');
        expect(Query.home.count).toBe(1);

        let flag = 0;
        redux.subscribe(() => (flag = 1));
        Dispatch.home.increase({ inc: 1 });
        expect(Query.home.count).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => (flag = 2));
        Dispatch.home.decrease(2);
        expect(Query.home.count).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => (flag = 3));
        Dispatch.home.replace({ count: 3, name: 't', show: false, array: [1] });
        expect(Query.home.name).toBe('t');
        expect(Query.home.count).toBe(3);
        expect(flag).toBe(3);

        redux.subscribe(() => (flag = 4));
        Dispatch.home.array([]);
        expect(Query.home.array).toEqual([]);
        expect(flag).toBe(4);

        expect(() => {
            Query.home = { count: 0, name: '', show: false, array: [1] };
        }).toThrowError('modify');
        expect(() => {
            Query.home.count = 0;
        }).toThrowError('Cannot assign');
        expect(() => {
            Query.home.name = '';
        }).toThrowError('Cannot assign');

        const home2 = createModule<State, Reducers>({ initialState, reducers: reducers2 });
        const modules2 = { home, home2 };
        const { Dispatch: Dispatch2, Query: Query2 } = createStore(modules2);

        Dispatch2.home.increase({ inc: 1 });
        expect(Query2.home.count).toBe(2);
        expect(Query2.home2.count).toBe(1);
    });

    it('createAction', () => {
        const home = createModule<State, Reducers>({ initialState, reducers });
        const modules = { home };

        expect(() => {
            home.dispatch.show();
        }).toThrowError('call');
        expect(() => home.query.name).toThrowError('call');
        expect(() => home.query.count).toThrowError('call');

        const { redux } = createStore(modules);
        expect(home.query.name).toBe('');
        expect(home.query.count).toBe(1);

        let flag = 0;
        redux.subscribe(() => (flag = 1));
        home.dispatch.increase({ inc: 1 });
        expect(home.query.count).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => (flag = 2));
        home.dispatch.decrease(2);
        expect(home.query.count).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => (flag = 3));
        home.dispatch.replace({ count: 3, name: 't', show: false, array: [1] });
        expect(home.query.name).toBe('t');
        expect(home.query.count).toBe(3);
        expect(flag).toBe(3);

        redux.subscribe(() => (flag = 4));
        home.dispatch.array([]);
        expect(home.query.array).toEqual([]);
        expect(flag).toBe(4);

        redux.subscribe(() => (flag = 4));

        home.dispatch.show();
        expect(home.query.show).toBe(true);
        expect(flag).toBe(4);

        expect(() => {
            home.query = { count: 0, name: '', show: false, array: [1] };
        }).toThrowError('modify');
        expect(() => {
            home.query.count = 0;
        }).toThrowError('Cannot assign');
        expect(() => {
            home.query.name = '';
        }).toThrowError('Cannot assign');

        const home2 = createModule<State, Reducers>({ initialState, reducers: reducers2 });
        const modules2 = { home, home2 };
        createStore(modules2);

        home.dispatch.increase({ inc: 1 });
        expect(home.query.count).toBe(2);
        expect(home2.query.count).toBe(1);
    });

    it('types', () => {
        const home = createModule<State, Reducers>({ initialState, reducers });
        const modules = { home };
        const { Dispatch } = createStore(modules);
        Dispatch.home.hide('1');
        Dispatch.home.hide('2');
        Dispatch.home.hide('3');
        Dispatch.home.hide(null);
        (a: '1' | '2' | null) => Dispatch.home.hide(a);
        Dispatch.home.optional(1);
        Dispatch.home.optional(undefined);
    });
});

describe('imdux value state', () => {
    type State = typeof initialState;
    type Reducers = typeof reducers;

    const initialState = 1 as number;

    const reducers = {
        increase(draft: State, payload: { inc: number }): State {
            return draft + payload.inc;
        },
        decrease(draft: State, payload: number): State {
            return draft - payload;
        },
        replace(draft: State, payload: { count: number }): State {
            return payload.count;
        },
        show(draft: State): State {
            return 10;
        },
    };

    it('createStore', () => {
        const home = createModule<State, Reducers>({ initialState, reducers });
        const modules = { home };
        const { Dispatch, Query, redux } = createStore(modules);
        expect(Query.home).toBe(1);

        let flag = 0;
        redux.subscribe(() => (flag = 1));
        Dispatch.home.increase({ inc: 1 });
        expect(Query.home).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => (flag = 2));
        Dispatch.home.decrease(2);
        expect(Query.home).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => (flag = 3));
        Dispatch.home.replace({ count: 3 });
        expect(Query.home).toBe(3);
        expect(flag).toBe(3);

        expect(() => {
            Query.home = 0;
        }).toThrowError('modify');
    });

    it('createAction', () => {
        const home = createModule<State, Reducers>({ initialState, reducers });
        const modules = { home };

        expect(() => {
            home.dispatch.show();
        }).toThrowError('call');
        expect(() => home.query).toThrowError('call');

        const { redux } = createStore(modules);
        expect(home.query).toBe(1);

        let flag = 0;
        redux.subscribe(() => (flag = 1));
        home.dispatch.increase({ inc: 1 });
        expect(home.query).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => (flag = 2));
        home.dispatch.decrease(2);
        expect(home.query).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => (flag = 3));
        home.dispatch.replace({ count: 3 });
        expect(home.query).toBe(3);
        expect(flag).toBe(3);

        redux.subscribe(() => (flag = 4));
        home.dispatch.show();
        expect(home.query).toBe(10);
        expect(flag).toBe(4);

        expect(() => {
            home.query = 0;
        }).toThrowError('modify');
    });
});
