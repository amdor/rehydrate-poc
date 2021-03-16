import { Action, ActionReducer, createReducer, On } from "@ngrx/store";

export function createLsRehydrateReducer<S, A extends Action = Action>(
  key: string,
  initialState: S,
  ...ons: On<S>[]
): ActionReducer<S, A> {
  const t0 = performance.now();

  const item = localStorage.getItem(key);
  const newInitialState = (item && JSON.parse(item)) ?? initialState;

  const newOns: On<S>[] = [];
  ons.forEach((oldOn: On<S>) => {
    const newReducer: ActionReducer<S, A> = (
      state: S | undefined,
      action: A
    ) => {
      const runT0 = performance.now();

      const newState = oldOn.reducer(state, action);
      localStorage.setItem(key, JSON.stringify(newState));

      const runT1 = performance.now();
      console.log(`ls reducer run took ${runT1 - runT0} milliseconds.`);

      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });

  const t1 = performance.now();
  console.log(`ls reducer creation took ${t1 - t0} milliseconds.`);

  return createReducer(newInitialState, ...newOns);
}
