import { createStore, createAction } from "../";
// import { Imdux } from "../types";

describe("imdux object state", () => {
    type State = typeof initialState;
    type Reducers = typeof reducers;

    const initialState = {
        name: "",
        count: 1,
        show: false
    }

    const reducers = {
        increase(draft: State, payload: { inc: number }) {
            draft.count += payload.inc;
        },
        decrease(draft: State, payload: number) {
            draft.count -= payload;
        },
        replace(draft: State, payload: { name: string, count: number, show: boolean }): State {
            return payload;
        },
        show(draft: State) {
            draft.show = true;
        },
        hide(draft: State, payload: "1" | "2" | "3" | null) {
            draft.show = false;
        }
    }

    const reducers2 = {
        increase(draft: State, payload: { inc: number }) {
            draft.count += payload.inc;
        },
    }

    it("createStore", () => {
        const home = createAction<State, Reducers>({ initialState, reducers });
        const actions = { home };
        const { Dispatch, Query, redux } = createStore(actions);
        expect(Query.home.name).toBe("");
        expect(Query.home.count).toBe(1);

        let flag = 0;
        redux.subscribe(() => flag = 1)
        Dispatch.home.increase({ inc: 1 });
        expect(Query.home.count).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => flag = 2)
        Dispatch.home.decrease(2);
        expect(Query.home.count).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => flag = 3);
        Dispatch.home.replace({ count: 3, name: "t", show: false });
        expect(Query.home.name).toBe("t");
        expect(Query.home.count).toBe(3);
        expect(flag).toBe(3);

        expect(() => { Query.home = { count: 0, name: "", show: false }; }).toThrowError("modify");
        expect(() => { Query.home.count = 0; }).toThrowError("Cannot assign");
        expect(() => { Query.home.name = ""; }).toThrowError("Cannot assign");

        const home2 = createAction<State, Reducers>({ initialState, reducers: reducers2 });
        const actions2 = { home, home2 };
        const { Dispatch: Dispatch2, Query: Query2 } = createStore(actions2);

        Dispatch2.home.increase({ inc: 1 });
        expect(Query2.home.count).toBe(2);
        expect(Query2.home2.count).toBe(1);

    })

    it("createAction", () => {
        const home = createAction<State, Reducers>({ initialState, reducers });
        const actions = { home };

        expect(() => { home.dispatch.show() }).toThrowError("call");
        expect(() => home.query.name).toThrowError("call");
        expect(() => home.query.count).toThrowError("call");

        const { redux } = createStore(actions);
        expect(home.query.name).toBe("");
        expect(home.query.count).toBe(1);

        let flag = 0;
        redux.subscribe(() => flag = 1)
        home.dispatch.increase({ inc: 1 });
        expect(home.query.count).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => flag = 2)
        home.dispatch.decrease(2);
        expect(home.query.count).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => flag = 3);
        home.dispatch.replace({ count: 3, name: "t", show: false });
        expect(home.query.name).toBe("t");
        expect(home.query.count).toBe(3);
        expect(flag).toBe(3);

        redux.subscribe(() => flag = 4);

        home.dispatch.show()
        expect(home.query.show).toBe(true);
        expect(flag).toBe(4);


        expect(() => { home.query = { count: 0, name: "", show: false }; }).toThrowError("modify");
        expect(() => { home.query.count = 0; }).toThrowError("Cannot assign");
        expect(() => { home.query.name = ""; }).toThrowError("Cannot assign");

        const home2 = createAction<State, Reducers>({ initialState, reducers: reducers2 });
        const actions2 = { home, home2 };
        createStore(actions2);

        home.dispatch.increase({ inc: 1 });
        expect(home.query.count).toBe(2);
        expect(home2.query.count).toBe(1);
    })

    it("types", () => {
        const home = createAction<State, Reducers>({ initialState, reducers });
        const actions = { home };
        const { Dispatch } = createStore(actions);

        Dispatch.home.hide("1");
        Dispatch.home.hide("2");
        Dispatch.home.hide("3");
        Dispatch.home.hide(null);
    })
});

describe("imdux value state", () => {
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
    }

    it("createStore", () => {
        const home = createAction<State, Reducers>({ initialState, reducers });
        const actions = { home };
        const { Dispatch, Query, redux } = createStore(actions);
        expect(Query.home).toBe(1);

        let flag = 0;
        redux.subscribe(() => flag = 1)
        Dispatch.home.increase({ inc: 1 });
        expect(Query.home).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => flag = 2)
        Dispatch.home.decrease(2);
        expect(Query.home).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => flag = 3);
        Dispatch.home.replace({ count: 3 });
        expect(Query.home).toBe(3);
        expect(flag).toBe(3);

        expect(() => { Query.home = 0; }).toThrowError("modify");
    })

    it("createAction", () => {
        const home = createAction<State, Reducers>({ initialState, reducers });
        const actions = { home };

        expect(() => { home.dispatch.show() }).toThrowError("call");
        expect(() => home.query).toThrowError("call");

        const { redux } = createStore(actions);
        expect(home.query).toBe(1);

        let flag = 0;
        redux.subscribe(() => flag = 1)
        home.dispatch.increase({ inc: 1 });
        expect(home.query).toBe(2);
        expect(flag).toBe(1);

        redux.subscribe(() => flag = 2)
        home.dispatch.decrease(2);
        expect(home.query).toBe(0);
        expect(flag).toBe(2);

        redux.subscribe(() => flag = 3);
        home.dispatch.replace({ count: 3 });
        expect(home.query).toBe(3);
        expect(flag).toBe(3);

        redux.subscribe(() => flag = 4);
        home.dispatch.show()
        expect(home.query).toBe(10);
        expect(flag).toBe(4);

        expect(() => { home.query = 0; }).toThrowError("modify");
    })
});
