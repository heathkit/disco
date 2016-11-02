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
  lastColor = 'none';
  item: FirebaseObjectObservable<any>;

  constructor(private af: AngularFire) {
    this.item = this.af.database.object('/disco/manual');
  }

  updateColor(c: Color) {
    this.lastColor = JSON.stringify(c);
    this.item.update(c);
  }

}
