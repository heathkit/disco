import {Observable, Subject, Observer} from '@reactivex/rxjs';
import {database, initializeApp} from 'firebase';
import * as path from 'path';

import {Bulb, Color} from './bulb';
import {printHelp, processArgs} from './config';
import {StatusChecks} from './status-checks';

const argv = processArgs(process.argv.slice(2));

if (argv.help) {
  printHelp();
  process.exit(0);
}

let status = new StatusChecks();
if (argv.statusCheck) {
  status.runCheck(argv.statusCheck);
  let timer = Observable.interval(100);
  timer.timestamp().subscribe((e) => {
    console.log(e);
  });
  // process.exit(1);
}

const FIREBASE_AUTH_PATH = '../protractor-status-light-00feae863d91.json';
initializeApp({
  databaseURL: 'https://protractor-status-light.firebaseio.com',
  serviceAccount: path.resolve(process.cwd(), FIREBASE_AUTH_PATH)
});

let db = database();
let ref = db.ref('disco');

let bulb = new Bulb();

let manualColor = new Subject<Color>();
ref.child('manual').on('value', (snapshot) => {
  manualColor.next(snapshot.val());
});

let mostRecentCommand = Date.now();
let commandStream = new Subject<string>();
ref.child('command').on('value', (snapshot) => {
  let val = snapshot.val() as any;
  if (val.timestamp > mostRecentCommand) {
    mostRecentCommand = val.timestamp;
    commandStream.next(val.cmd);
  }
});

bulb.init().then(() => {
  bulb.setDefaultColor({white: 0xaf});
  manualColor.throttleTime(20)
      .subscribe((color) => {
        console.log('New value:', color);
        bulb.setDefaultColor(color);
      });

  commandStream.throttleTime(20)
      .subscribe((cmd) => {
        console.log('Got command ', cmd);
        if(cmd === 'pulse') {
          bulb.pulse({red: 0, green: 0xff, blue: 0});
        } else if(cmd === 'blip') {
            bulb.blip({red: 0xfa, green: 0x00, blue: 0xff});
        } else {
          bulb.police();
        }
      });

  if (argv.run) {
    let animations = Observable.interval(5000).take(3);

    animations.subscribe({
        next: () => {
          if (argv.run === 'pulse') {
            bulb.pulse({green: 0xff});
          } else if (argv.run === 'police') {
            bulb.police();
          }
        },
        complete: () => {
          process.exit();
        }
    });
  }
});
