import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { DynamicReducerProvider, simpleAction } from "./app.reducer";

@Component({
  selector: "app-root",
  template: ` <button (click)="onClick()">Dispatch</button> `,
  styles: [],
})
export class AppComponent {
  constructor(
    private store: Store,
    private dynamicProvider: DynamicReducerProvider
  ) {
    console.log("ctr");
  }

  onClick() {
    this.store.dispatch(simpleAction());
  }
}
