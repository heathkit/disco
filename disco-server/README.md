# TODO

- firebase control app
- server connects to firebase
- manually control light

- server polls travis.io and circleci?

- set up go/protractor-status-lamp

# Display
every 5 minutes, heartbeat to indicate health

## Status Checks
Lamp defaults to user set color. 

If any of the error conditions are present, lamp becomes
yellow and flashes:
- no github issues without labels: purple
- 'npm depend' < 3 out of date packages: blue
- build status: red

## Alerts (past 5 minutes)
- mentioned on twitter: yellow pulse
- new commit merged: blue pulse
- successful build: green pulse



# Getting build status
## Travis
https://docs.travis-ci.com/api#overview
API: https://api.travis-ci.org/repos/angular/protractor/builds

## Circle
https://circleci.com/docs/api/

https://circleci.com/api/v1.1/project/github/angular/protractor

## GitHub 
https://developer.github.com/v3/issues/#list-issues-for-a-repository

https://api.github.com/repos/angular/protractor/issues
new issue flash

## NPM
https://github.com/npm/npm-registry-client

## Twitter mentions?
http://blog.joeandrieu.com/2012/01/30/the-worlds-simplest-autotweeter-in-node-js/
https://www.npmjs.com/package/twitter

# RxJs
https://www.learnrxjs.io/operators/filtering/takeuntil.html
https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/creating_and_subscribing_to_simple_observable_sequences.html
