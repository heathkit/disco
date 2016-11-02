import {Component, ViewChild} from '@angular/core';
import {ColorPickerComponent} from "./color-picker/color-picker.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ColorPickerComponent) picker;
  title = 'app works!';
}
