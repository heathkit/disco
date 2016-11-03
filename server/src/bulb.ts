import {Observable, Observer, TimeInterval} from '@reactivex/rxjs';
import * as noble from 'noble';

const NAME = 'LEDBLE-010108CC';
const ADDR = '20:16:01:01:08:cc';
const SERVICE_ID = 'ffe5';

function getColorValue(color: Color) {
  let red = color.red || 0x0;
  let green = color.green || 0x0;
  let blue = color.blue || 0x0;
  let white = color.white || 0x0;
  if (white) {
    return new Uint8Array([0x56, 0x00, 0x00, 0x00, white, 0x0f, 0xaa]);
  } else {
    return new Uint8Array([0x56, red, green, blue, 0x00, 0xf0, 0xaa]);
  }
}

let connected = false;
let ready = false;
let colorCharacteristic: noble.Characteristic;

export interface Color { red?: number, green?: number, blue?: number, white?: number, }

// TODO: Factor animations away from Bulb control.
export class Bulb {
  defaultColor: Color = {white: 0xfe};

  // Scan for the bulb and connect to it.
  init(): Promise<noble.Characteristic> {
    noble.on('stateChange', function(state) {
      console.log('New state', state);
      if (state === 'poweredOn') {
        noble.startScanning([SERVICE_ID], true);
      } else {
        noble.stopScanning();
      }
    });

    return new Promise((resolve, reject) => {
      noble.on('discover', (peripheral) => {
        if ((peripheral as any).address === ADDR && !connected) {
          connected = true;
          console.log('Found device with local name: ' + peripheral.advertisement.localName);
          console.log(
              'advertising the following service uuid\'s: ' +
              peripheral.advertisement.serviceUuids);

          peripheral.connect((error) => {
            if (error) {
              reject(error);
            }
            console.log('connected to peripheral: ' + peripheral.uuid);
            peripheral.discoverServices([SERVICE_ID], (error, services) => {
              let lightService = services[0];
              if (error) {
                reject(error);
              }
              console.log('Discovered light service');

              lightService.discoverCharacteristics(['ffe9'], (error, characteristics) => {
                colorCharacteristic = characteristics[0];
                resolve();
                console.log('Discovered color characteristic');
              });
            });
          });
        } else {
          console.log('ignoring peripheral: ', peripheral);
        }
      });
    });
  }

  controlLight(color: Color) {
    if (!colorCharacteristic) {
      throw new Error('Not connected to bulb!');
    }
    colorCharacteristic.write(new Buffer(getColorValue(color)), true, (error) => {
      if (error) {
        console.error(error);
        throw new Error(error);
      }
    });
  }

  setDefaultColor(color: Color) {
    this.defaultColor = color;
    this.controlLight(color);
  }

  // Softly pulse the light with the given color.
  pulse() {
    let duration = 2000;
    let period = 15;

    console.log('Starting pulse');
    let timer = Observable.timer(duration);

    Observable.interval(period).timeInterval().takeUntil(timer).subscribe(
        new PulseAnimation(this, duration));
  }

  // Flicker the given color on briefly, then return to default.
  blip() {}
}

class PulseAnimation implements Observer<TimeInterval<number>> {
  elapsed = 0;

  constructor(private bulb: Bulb, private duration: number) {}

  next(frame: TimeInterval<number>) {
    this.elapsed += frame.interval;
    let color = {green: 0xff * pulseFrame(this.elapsed, this.duration)};
    this.bulb.controlLight(color);
  }

  error(err: any) {
    console.error(err);
  }

  complete() {
    console.log('Done!');
    this.bulb.controlLight(this.bulb.defaultColor);
  }
}


function pulseFrame(elapsed: number, duration: number) {
  let easeIn = require('eases/quint-in');
  let easeOut = require('eases/quint-out');

  let halfTime = duration / 2;
  if (elapsed <= duration / 2) {
    return (easeIn(elapsed / halfTime));
  } else {
    return (1 - easeOut((elapsed - halfTime) / halfTime));
  }
}
