import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Color} from "../shared/util";

@Component({
  selector: 'disco-ball',
  templateUrl: './disco-ball.component.html',
  styleUrls: ['disco-ball.component.scss']
})
export class DiscoBallComponent {

  @ViewChild("discoBall") discoBall;

  private _color: Color;

  constructor() { }

  setColor(rgb: Color) {
    let color = rgb.blue;
    console.log(rgb);
    color += rgb.green << 8;
    color += rgb.red << 16;
    let glow = this.discoBall.nativeElement.querySelector(".disco-ball-glow");
    glow.style.background = `#${color.toString(16)}`;
    glow.style.boxShadow = `0px 0px 50px 20px #${color.toString(16)}`;
    this._color = rgb;
  }

}
