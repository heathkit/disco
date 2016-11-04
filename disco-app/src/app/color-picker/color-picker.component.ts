import {Component, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
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
  private s: number = 0.5;
  private v: number = 0.5;

  @ViewChild("colorCanvas") colorCanvas;
  canvas: HTMLCanvasElement;
  private canvasDimensions: ClientRect = null;

  @ViewChild("colorSlider") colorSlider;
  private sliderDimensions: ClientRect = null;

  constructor() { }

  ngAfterViewInit() {
    this.canvas = this.colorCanvas.nativeElement.querySelector('.color-canvas');
    this.context = this.canvas.getContext("2d");
    this.drawCanvas();

    this.sliderDimensions = this.colorSlider.nativeElement.getBoundingClientRect();
    this.canvasDimensions = this.canvas.getBoundingClientRect();
    this.updateDetailThumb();
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
        this.context.fillStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
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
    //this._emitValueIfChanged();
  }

  updateHueFromPosition(pos: number) {
    let offset = this.sliderDimensions.left;
    let size = this.sliderDimensions.width;

    // The exact value is calculated from the event and used to find the closest snap value.
    this.normalizedHue = clamp((pos - offset) / size);

    this.drawCanvas();
    this.updateHueThumbAndFillPosition(this.normalizedHue, this.sliderDimensions.width);
  }

  updateHueThumbAndFillPosition(percent: number, width: number) {
    // A container element that is used to avoid overwriting the transform on the thumb itself.
    let thumbElement =
        this.colorSlider.nativeElement.querySelector('.color-slider-thumb');

    let position = Math.round(percent * width);

    let rgb = hsvToRgb(percent,1,1);
    thumbElement.style.background = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    applyCssTransform(thumbElement, `translateX(${position}px)`);
    this.updateDetailThumb();
  }

  private onDetailClick(event: MouseEvent) {
    this.updateDetailFromPosition(event.clientX, event.clientY);
  }

  private onDetailSlide(event: HammerInput) {
    // Prevent the slide from selecting anything else.
    event.preventDefault();
    console.log(event.center);
    this.updateDetailFromPosition(event.center.x, event.center.y);
  }

  private onDetailSlideStart(event: HammerInput) {
    console.log(event);
    event.preventDefault();
    this.updateDetailFromPosition(event.center.x, event.center.y);
  }

  private onDetailSlideEnd() {
    //this._emitValueIfChanged();
  }

  updateDetailFromPosition(x: number, y: number) {
    let offsetX = x - this.canvasDimensions.left;
    let offsetY = y - this.canvasDimensions.top;

    this.s = clamp(offsetX / this.canvasDimensions.width);
    this.v = clamp(offsetY / this.canvasDimensions.height);

    this.updateDetailThumb();
  }

  updateDetailThumb() {
    let thumbElement =
        this.colorCanvas.nativeElement.querySelector('.color-canvas-thumb');

    let xPos = this.s * this.canvasDimensions.width;
    let yPos = this.v * this.canvasDimensions.height;
    let rgb = hsvToRgb(this.normalizedHue,this.s,(1-this.v));
    thumbElement.style.background = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
    applyCssTransform(thumbElement, `translateX(${xPos}px) translateY(${yPos}px)`);
    this.colorUpdated.emit(rgb);
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

  return { red: Math.round(r * 255), green: Math.round(g * 255), blue: Math.round(b * 255) };
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



