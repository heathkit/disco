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
let ready = true;
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

            process.on('cleanup', () => {
              console.log('disconnecting from bulb')
              peripheral.disconnect();
            });

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
    if (!ready) {
      return;
    }
    ready = false;
    colorCharacteristic.write(new Buffer(getColorValue(color)), false, (error) => {
      ready = true;
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
  pulse(color: Color) {
    let duration = 2000;
    let period = 20;

    console.log('Starting pulse');
    let timer = Observable.timer(duration);

    Observable.interval(period).timeInterval().takeUntil(timer).subscribe(
        new PulseAnimation(this, color, duration));
  }

  // Flicker the given color on briefly, then return to default.
  blip(color: Color) {
    let duration = 3000
    let timer = Observable.timer(duration);

    Observable.interval(1500).takeUntil(timer).subscribe(() => {
      Observable.interval(100).take(6)
          .subscribe((i) => {
            if(i % 3 == 0) {
              console.log(i, color);
              this.controlLight(color);
            } else if(i % 3 == 1) {
              console.log(this.defaultColor);
              this.controlLight(this.defaultColor);
            }
          });
    }, (err) => {console.error(err)},
        () => {
          setTimeout(() => {
            this.controlLight(this.defaultColor);
          },100);
        });
  }

  police() {
    Observable.interval(250).take(12)
        .subscribe(new PoliceAnimation(this));
  }
}

class PoliceAnimation implements Observer<number> {
  elapsed = 0;

  constructor(private bulb: Bulb) {}

  next(frame: number) {
    let newColor = { red: 0, green: 0, blue: 0 };
    if (frame % 2 == 0) {
      newColor.red = 0xff;
    } else {
      newColor.blue = 0xff;
    }

    this.bulb.controlLight(newColor);
  }

  error(err: any) {
    console.error(err);
  }

  complete() {
    console.log('Done!');
    // Hack because colors will get dropped if we spam them too quickly.
    setTimeout(() => {
      this.bulb.controlLight(this.bulb.defaultColor);
    },100);
  }
}

class PulseAnimation implements Observer<TimeInterval<number>> {
  elapsed = 0;

  constructor(private bulb: Bulb, private color: Color, private duration: number) {}

  next(frame: TimeInterval<number>) {
    let scale = pulseFrame(this.elapsed, this.duration);
    let newColor = {
      green: this.color.green * scale,
      red: this.color.red * scale,
      blue: this.color.blue * scale
    };
    this.bulb.controlLight(newColor);
    this.elapsed += frame.interval;
  }

  error(err: any) {
    console.error(err);
  }

  complete() {
    console.log('Done!');
    // Hack because colors will get dropped if we spam them too quickly.
    setTimeout(() => {
      this.bulb.controlLight(this.bulb.defaultColor);
    },100);
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
