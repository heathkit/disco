import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Color} from "../shared/util";

@Component({
  selector: 'disco-ball',
  templateUrl: './disco-ball.component.html',
  styleUrls: ['disco-ball.component.scss']
})
export class DiscoBallComponent implements OnInit {

  @ViewChild("discoBall") discoBall;
  discoGlowElement: HTMLElement;

  private _color: Color;

  constructor() {
  }

  ngOnInit() {
    this.discoGlowElement = this.discoBall.nativeElement.querySelector(".disco-ball-glow");
  }

  setColor(rgb: Color) {
    let color = rgb.blue;
    color += rgb.green << 8;
    color += rgb.red << 16;
    this.discoGlowElement.style.background = `#${color.toString(16)}`;
    this.discoGlowElement.style.boxShadow = `0px 0px 50px 20px #${color.toString(16)}`;
    this._color = rgb;
  }

}
