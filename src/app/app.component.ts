import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { simpleAction } from "./app.reducer";

@Component({
  selector: 'app-root',
  template: `
    <button (click)="onClick()"> Dispatch </button>    
  `,
  styles: []
})
export class AppComponent {

  constructor(private store: Store){}

  onClick() {
    this.store.dispatch(simpleAction());
  }
}
