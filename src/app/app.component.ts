import { AfterViewInit, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { simpleAction } from "./app.reducer";

@Component({
  selector: "app-root",
  template: ` <button (click)="onClick()">Dispatch</button> `,
  styles: [],
})
export class AppComponent implements AfterViewInit {
  constructor(private store: Store) {
    console.log("AppComponent ctr");
  }

  ngAfterViewInit() {
    console.log("AppComponent afterviewinit");
  }

  onClick() {
    this.store.dispatch(simpleAction());
  }
}
