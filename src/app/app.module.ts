import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from "@ngrx/store";
import { indexedDBRehydrateReducer, localStorageRehydrated, simple } from "./app.reducer";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ indexedDBRehydrateReducer: indexedDBRehydrateReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
