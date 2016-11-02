import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Color} from "../shared/util";
import {Observable} from "rxjs";

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements AfterViewInit {
  context: CanvasRenderingContext2D;
  color: Color;
  luminance: number;

  @ViewChild("colorCanvas") colorCanvas;
  canvas: HTMLCanvasElement;

  constructor() { }

  ngAfterViewInit() {
    this.canvas = this.colorCanvas.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.drawColors();

    let mouseDowns = Observable.fromEvent(this.canvas, 'mousedown');
    let mouseMoves = Observable.fromEvent(this.canvas, 'mousemove');
    let mouseUps = Observable.fromEvent(this.canvas, 'mouseup');

    mouseDowns.map(() =>mouseMoves.takeUntil(mouseUps))
        .concatAll().subscribe(this.getColor.bind(this));
  }

  clearCanvas() {
    this.context.save();

    // Use the identity matrix while clearing the canvas
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Restore the transform when done
    this.context.restore();
  }

  drawColors() {
    var scale = 5;
    var y = 200
    for (var u = 0; u < 255; u += scale) {
      for (var v = 0; v < 255; v += scale) {
        var color = yuv2rgb(y, u, v)
        this.context.fillStyle = 'rgb(' +
            color.r + ',' +
            color.g + ',' +
            color.b + ')';
        this.context.fillRect(u, v, scale, scale);
      }
    }
  }

  getColor(e) {
    console.log(e);
    var data = this.context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    this.color = {red: data[0], green: data[1], blue: data[2]};
  }
}

function yuv2rgb(y, u, v) {
  let r = clamp(Math.floor(y + 1.4075 * (v - 128)), 0, 255);
  let g = clamp(Math.floor(y - 0.3455 * (u - 128) - (0.7169 * (v - 128))), 0, 255);
  let b = clamp(Math.floor(y + 1.7790 * (u - 128)), 0, 255);
  return ({ r, g, b });
}

function clamp(n, low, high) {
  if (n < low) {
    return (low);
  }
  if (n > high) {
    return (high);
  }
  return n;
}



