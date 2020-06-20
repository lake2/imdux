import { createAction, createStore } from "../";
// import { Imdux } from "../types";

describe("change action name", () => {
    type State = typeof initialState;
    type Reducers = typeof reducers;

    const initialState = {
        bracket: false,
        bar: false,
        jerry: false,
        bar2: false,
        jerry2: false,
        count: 0
    };

    const reducers = {
        ["bracket/set"](draft: State) {
            draft.bracket = true;
        },
        foo: {
            bar(draft: State) {
                draft.bar = true;
            },
            tom: {
                jerry(draft: State) {
                    draft.jerry = true
                }
            }
        },
        foo2: {
            bar(draft: State) {
                draft.bar2 = true;
            },
            jerry(draft: State) {
                draft.jerry2 = true;
            }
        },
        add1(draft: State) {
            draft.count++;
        },
        add2(draft: State) {
            draft.count++;
        }
    };

    it("createStore", () => {
        let flag: number;

        const home = createAction<State, Reducers>({ initialState, reducers });
        const actions = { home };
        const { Dispatch, Query, redux } = createStore(actions);

        flag = 0;
        redux.subscribe(() => flag = 1);
        Dispatch.home["bracket/set"]();
        expect(Query.home.bracket).toBe(true);
        expect(flag).toBe(1);

        redux.subscribe(() => flag = 2);
        Dispatch.home.foo.bar();
        expect(Query.home.bar).toBe(true);
        expect(flag).toBe(2);

        redux.subscribe(() => flag = 3);
        Dispatch.home.foo.tom.jerry();
        expect(Query.home.jerry).toBe(true);

        redux.subscribe(() => flag = 4);
        Dispatch.home.foo2.bar();
        expect(Query.home.bar2).toBe(true);

        redux.subscribe(() => flag = 5);
        Dispatch.home.foo2.jerry();
        expect(Query.home.jerry2).toBe(true);

        redux.subscribe(() => flag = 6);
        Dispatch.home.add1();
        expect(Query.home.count).toBe(1);

        redux.subscribe(() => flag = 7);
        Dispatch.home.add2();
        expect(Query.home.count).toBe(2);
    });
});
