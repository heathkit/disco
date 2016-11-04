# Disco

Disco turns any lamp into a project status indicator.

- disco-app: An Angular2 app deployable on Firebase. It shows the latest status of the checks and allows manual control of your lamp from anywhere in the world!
- disco-server: Runs status checks and controls the lamp over BLE.

This uses the [Magic Blue](https://medium.com/@urish/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546#.95j6tpapi) bluetooth-enabled LED light bulb that was given as a gift at AngularConnect 2016.

The server component can run on a laptop, or on any small computer with wifi and BLE, such as the $9 [C.H.I.P.](https://getchip.com/).

## TODO 

- Break animations out into seperate package.
- pull animations into webapp
- systemd startup for server
- more robust BLE startup in server
- FireBase authentiaction
- Status Checks

