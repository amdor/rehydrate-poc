import { createAction, createReducer, on } from "@ngrx/store";
import { createIndexedDBRehydrateReducer } from "src/rehydrate-util/indexedDb";
import { createLsRehydrateReducer } from "src/rehydrate-util/localstorage";
import { initialState } from "./big-state";

export const simpleAction = createAction("SimpleAction")

export const simple = createReducer(
    initialState,
    on(
        simpleAction,
        (state: any) => {
            return {
                ...state,
                modifiableField: state.modifiableField + 1
            };
        }
    )
);
export const localStorageRehydrated = createLsRehydrateReducer(
    "bigState",
    initialState,
    on(
        simpleAction,
        (state: any) => {
            return {
                ...state,
                modifiableField: state.modifiableField + 1
            };
        }
    )
);

export const indexedDBRehydrateReducer = await createIndexedDBRehydrateReducer(
    "bigState",
    initialState,
    on(
        simpleAction,
        (state: any) => {
            return {
                ...state,
                modifiableField: state.modifiableField + 1
            };
        }
    )
);