
export interface CheckDescription {
  id: string,
  description: string,
  check: Function
}

export interface CheckMap {
  [id: string]: CheckDescription
}

export class StatusChecks {
  static checks: CheckMap = {};

  static registerCheck(check: CheckDescription) {
    StatusChecks.checks[check.id] = check;
  }

  runCheck(id: string) {
    return StatusChecks.checks[id].check()
  }
}
/*
- no github issues without labels: purple/red flash
- 'npm depend' < 3 out of date packages: blue/red flash
- build status: red flash

## Alerts (past 5 minutes)
- mentioned on twitter: yellow flash
- new commit merged: blue flash
- successful build: green flash
*/

function githubUnhandledIssues() {
  console.log('Running issue check');
  return true;
}

StatusChecks.registerCheck({
  id: "github-unhandled-issues",
  description: "Fires when there are unlabeled issues in Protractor's issue queue.",
  check: githubUnhandledIssues
});
