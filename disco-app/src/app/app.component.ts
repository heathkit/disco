import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {ColorPickerComponent} from "./color-picker/color-picker.component";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Color} from "./shared/util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public af: AngularFire) {
  }

  login() {
    this.af.auth.login();
  }

  logout() {
    this.af.auth.logout();
  }
}
