import { createAction, createStore } from "../";
// import { Imdux } from "../types";

describe("change action name", () => {
    type State = typeof initialState;
    type Reducers = typeof reducers;

    const initialState = {
        bracket: false,
    };

    const reducers = {
        ["bracket/set"](draft: State) {
            draft.bracket = true;
        },
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
    });
});
