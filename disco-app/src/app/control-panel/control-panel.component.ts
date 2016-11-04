import { Component, OnInit } from '@angular/core';
import {Color} from "../shared/util";
import {FirebaseObjectObservable, AngularFire} from "angularfire2";

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent {
  lastColor = ""
  item: FirebaseObjectObservable<any>;

  constructor(private af: AngularFire) {
    this.item = this.af.database.object('/disco/manual');
  }

  updateColor(c: Color) {
    this.lastColor = JSON.stringify(c);
    this.item.update(c);
  }
}
