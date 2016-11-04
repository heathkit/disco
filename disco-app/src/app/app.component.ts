import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {ColorPickerComponent} from "./color-picker/color-picker.component";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Color} from "./shared/util";
import {StatusService, Status, Alert} from "./status.service";
import {MdSlideToggleChange} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  statuses: Array<Status>;
  alerts: Array<Alert>;

  constructor(private statusService: StatusService) { }

  ngOnInit() {
    this.statuses = this.statusService.getStatuses();
    this.alerts = this.statusService.getAlerts();
    console.log(this.statuses);
  }

  setStatus(status: Status, event: MdSlideToggleChange) {
    this.statusService.setStatus(status.id, event.checked);
    console.log(status, event);
  }

  setAlert(alert: Alert) {
    this.statusService.setAlert(alert.id);
  }
}
