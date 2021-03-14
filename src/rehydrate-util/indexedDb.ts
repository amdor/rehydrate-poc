import { Action, ActionReducer, createReducer, On } from "@ngrx/store";

let created = 0;

async function getInitialStateFromDb(db: any, key: string) {
    return new Promise((resolutionFunc, rejectionFunc) => {
        const stateObjectStore = db.transaction(key, "readonly").objectStore(key);
        const request = stateObjectStore.get("1");
        request.onerror = rejectionFunc;
        request.onsuccess = function () {
            resolutionFunc(request.result);
        };
    });
};


async function createDB(request: any, key: string) {
    return new Promise((resolutionFunc, rejectionFunc) => {
        request.onupgradeneeded = function (event) {
            const db = (event.target as any).result as IDBDatabase;
            const objectStore = db.createObjectStore(key);

            objectStore.transaction.oncomplete = function () {
                getInitialStateFromDb(db, key).then(resolutionFunc);
            };
        };
    })
}

async function getInitialState(request: any, key: string) {
    return new Promise((resolutionFunc) => {
        request.onsuccess = function (event) {
            const db = (event.target as any).result as IDBDatabase;
            getInitialStateFromDb(db, key).then(resolutionFunc);
        };
    });
}

async function saveState(request: any, newState: any, key: string) {
    return new Promise((resolutionFunc, rejectionFunc) => {
        request.onsuccess = function (event) {
            const db = (event.target as any).result as IDBDatabase;
            const stateObjectStore = db.transaction(key, "readonly").objectStore(key);
            const request = stateObjectStore.put(newState, "1");
            request.onerror = rejectionFunc;
            request.onsuccess = resolutionFunc;
        };
    });
}

export async function createIndexedDBRehydrateReducer<S, A extends Action = Action>(
    key: string,
    initialState: S,
    ...ons: On<S>[]
): Promise<ActionReducer<S, A>> {
    const t0 = performance.now();

    const request = window.indexedDB.open("MyTestDatabase");
    const newInitialState = created ? await getInitialState(request, key) as S : await createDB(request, key) as S ?? initialState;

    const newOns: On<S>[] = [];
    ons.forEach((oldOn: On<S>) => {
        const newReducer: ActionReducer<S, A> = (
            state: S | undefined,
            action: A
        ) => {
            const runT0 = performance.now();

            const reducerRequest = window.indexedDB.open("MyTestDatabase");
            const newState = oldOn.reducer(state, action);
            saveState(reducerRequest, newState, key);

            const runT1 = performance.now();
            console.log(`Reducer run took ${runT1 - runT0} milliseconds.`);

            return newState;
        };
        newOns.push({ ...oldOn, reducer: newReducer });
    });

    const t1 = performance.now();
    console.log(`Reducer creation took ${t1 - t0} milliseconds.`);

    return new Promise((resolve) => resolve(createReducer(newInitialState, ...newOns)));
}