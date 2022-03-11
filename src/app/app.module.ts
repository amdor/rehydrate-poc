import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ReducerManager, StoreModule } from "@ngrx/store";
import {
  addIndexedDBRehydratedReducer,
  localStorageRehydrated,
} from "./app.reducer";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ localStorageRehydrated: localStorageRehydrated }),
    StoreModule.forRoot({}, {}),
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: addIndexedDBRehydratedReducer,
    //   deps: [ReducerManager],
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
