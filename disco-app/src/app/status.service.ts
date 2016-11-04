import { Injectable } from '@angular/core';

interface Check {
  id: string,
  description: string,
  color?: number,
  silenceUntil?: Date,
}

interface Status extends Check {
  ok: boolean
}

interface Alert extends Check {
  lastFired?: Date
}

// Status are ongoing conditions.
const statuses: Array<Status> = [
  { id: 'github-issues',
    description: 'All GitHub issues are labeled.',
    ok: true },

  { id: 'outdated-dependencies',
    description: 'Protractor npm dependencies are up to date.',
    ok: true },

  { id: 'ci-status',
    description: 'Protractor CI is green.',
    ok: true },
];

// Alerts are events that have happened within the past 5 minutes.
const alerts: Array<Alert> = [
  { id: 'twitter',
    description: '@Protractor was mentioned on Twitter.' },

  { id: 'github-new-commit',
    description: 'A new commit was merged into Protractor.' },

  { id: 'ci-build',
    description: 'The CI just finished a green build.' },
];

@Injectable()
export class StatusService {

  constructor() { }

  getAlerts() {
    return alerts;
  }

  getStatuses() {
    return statuses;
  }
}
