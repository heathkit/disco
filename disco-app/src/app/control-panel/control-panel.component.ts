import {Component, OnInit, ViewChild} from '@angular/core';
import {Color} from "../shared/util";
import {FirebaseObjectObservable, AngularFire} from "angularfire2";
import {DiscoBallComponent} from "../disco-ball/disco-ball.component";

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent {
  @ViewChild(DiscoBallComponent) discoBall;

  lastColor: Color = null;
  item: FirebaseObjectObservable<any>;

  constructor(private af: AngularFire) {
    this.item = this.af.database.object('/disco/manual');
  }

  updateColor(c: Color) {
    this.discoBall.setColor(c);
    console.log("updateColor", c);
    this.item.update(c);
  }
}
