import { AngularFireModule } from 'angularfire2';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { StatusService } from './status.service';
import { ControlPanelComponent } from './control-panel/control-panel.component';

export const firebaseConfig = {
  apiKey: "AIzaSyAL1hlM7XMnDbWd6gXhWQ3I75XeaL1KT3o",
  authDomain: "protractor-status-light.firebaseapp.com",
  databaseURL: "https://protractor-status-light.firebaseio.com",
  storageBucket: "protractor-status-light.appspot.com",
  messagingSenderId: "946616647283"
};

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot()
  ],
  providers: [
    StatusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
