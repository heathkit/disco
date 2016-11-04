import {Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {applyCssTransform} from '@angular/material';
import {Input as HammerInput} from 'hammerjs';
import {Color} from '../shared/util';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {
  context: CanvasRenderingContext2D;
  @Output() colorUpdated = new EventEmitter<Color>();

  // Hue scaled from 0 to 1.
  private normalizedHue: number = 0;

  @ViewChild("colorCanvas") colorCanvas;
  canvas: HTMLCanvasElement;

  @ViewChild("colorSlider") colorSlider;
  private sliderDimensions: ClientRect = null;

  constructor() { }

  ngAfterViewInit() {
    this.canvas = this.colorCanvas.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.drawCanvas();

    this.sliderDimensions = this.colorSlider.nativeElement.getBoundingClientRect();

    let mouseDowns = Observable.fromEvent(this.canvas, 'mousedown');
    let mouseMoves = Observable.fromEvent(this.canvas, 'mousemove');
    let mouseUps = Observable.fromEvent(this.canvas, 'mouseup');

    mouseDowns.map(() => mouseMoves.takeUntil(mouseUps))
        .concatAll().map(this.getColor.bind(this)).subscribe();
  }

  getColor(e) {
    let data = this.context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    let newColor = {r: data[0], g: data[1], b: data[2]};
    this.colorUpdated.emit(newColor);
  }

  clearCanvas() {
    this.context.save();

    // Use the identity matrix while clearing the canvas
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Restore the transform when done
    this.context.restore();
  }

  drawCanvas() {
    let step = 2;
    for (let x = 0; x <= this.canvas.width; x += step) {
      for (let y = 0; y <= this.canvas.height; y += step) {
        let s = x/this.canvas.width;
        let v = y/this.canvas.height;

        let rgb = hsvToRgb(this.normalizedHue, s, v);
        this.context.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        this.context.fillRect(x, this.canvas.height-y, step, step);
      }
    }
  }

  private onHueClick(event: MouseEvent) {
    this.updateHueFromPosition(event.clientX);
  }

  private onHueSlide(event: HammerInput) {
    // Prevent the slide from selecting anything else.
    event.preventDefault();
    this.updateHueFromPosition(event.center.x);
  }

  private onHueSlideStart(event: HammerInput) {
    console.log(event);
    event.preventDefault();
    this.updateHueFromPosition(event.center.x);
  }

  private onHueSlideEnd() {
    /*
    this.isSliding = false;
    this.snapThumbToValue();
    this._emitValueIfChanged();
    */
  }



  updateHueFromPosition(pos: number) {
    let offset = this.sliderDimensions.left;
    let size = this.sliderDimensions.width;

    // The exact value is calculated from the event and used to find the closest snap value.
    this.normalizedHue = clamp((pos - offset) / size);

    this.drawCanvas();
    this.updateThumbAndFillPosition(this.normalizedHue, this.sliderDimensions.width);
  }

  updateThumbAndFillPosition(percent: number, width: number) {
    // A container element that is used to avoid overwriting the transform on the thumb itself.
    let thumbPositionElement =
        this.colorSlider.nativeElement.querySelector('.color-slider-thumb');

    let position = Math.round(percent * width);

    applyCssTransform(thumbPositionElement, `translateX(${position}px)`);
  }
}

// Converts hsv to rgb. h, s, and v are all normalized.
function hsvToRgb(h, s, v) {
  h = h * 6;

  var i = Math.floor(h),
      f = h - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      mod = i % 6,
      r = [v, q, p, p, t, v][mod],
      g = [t, v, v, q, p, p][mod],
      b = [p, p, t, v, v, q][mod];

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function clamp(n, low = 0, high = 1) {
  if (n < low) {
    return (low);
  }
  if (n > high) {
    return (high);
  }
  return n;
}



