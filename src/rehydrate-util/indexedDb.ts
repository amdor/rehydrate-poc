import { Action, ActionReducer, createReducer, On } from "@ngrx/store";

async function getInitialStateFromDb(db: IDBDatabase, reducerKey: string) {
  return new Promise((resolutionFunc, rejectionFunc) => {
    const stateObjectStore = db
      .transaction(reducerKey, "readonly")
      .objectStore(reducerKey);
    const request = stateObjectStore.get("1");
    request.onerror = rejectionFunc;
    request.onsuccess = function () {
      resolutionFunc(request.result);
    };
  });
}

async function tryCreateStore(request: IDBOpenDBRequest, reducerKey: string) {
  return new Promise((resolutionFunc, rejectionFunc) => {
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(reducerKey)) {
        db.createObjectStore(reducerKey);
      }
    };
    request.onsuccess = () => {
      resolutionFunc(request.result);
    };
    request.onerror = rejectionFunc;
  });
}

async function saveState(db: IDBDatabase, newState: any, reducerKey: string) {
  return new Promise((resolutionFunc, rejectionFunc) => {
    const stateObjectStore = db
      .transaction(reducerKey, "readwrite")
      .objectStore(reducerKey);
    const request = stateObjectStore.put(newState, "1");
    request.onerror = rejectionFunc;
    request.onsuccess = resolutionFunc;
  });
}

export async function createIndexedDBRehydrateReducer<
  S,
  A extends Action = Action
>(
  reducerKey: string,
  initialState: S,
  ...ons: On<S>[]
): Promise<ActionReducer<S, A>> {
  const t0 = performance.now();

  const request = window.indexedDB.open("MyTestDatabase");
  let db = undefined;

  let newInitialState;

  try {
    db = await tryCreateStore(request, reducerKey);
  } catch (err) {
    console.error(err);
  }
  newInitialState =
    ((await getInitialStateFromDb(db, reducerKey)) as S) ?? initialState;

  const newOns: On<S>[] = [];
  ons.forEach((oldOn: On<S>) => {
    const newReducer: ActionReducer<S, A> = (
      state: S | undefined,
      action: A
    ) => {
      const runT0 = performance.now();

      const newState = oldOn.reducer(state, action);
      try {
        saveState(db, newState, reducerKey);
      } catch (e) {
        console.error("save failed " + e);
      }

      const runT1 = performance.now();
      console.log(`indexdb reducer run took ${runT1 - runT0} milliseconds.`);

      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });

  const t1 = performance.now();
  console.log(`indexdb reducer creation took ${t1 - t0} milliseconds.`);

  return new Promise((resolve) =>
    resolve(createReducer(newInitialState, ...newOns))
  );
}
