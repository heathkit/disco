import { BleLightAppPage } from './app.po';

describe('ble-light-app App', function() {
  let page: BleLightAppPage;

  beforeEach(() => {
    page = new BleLightAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
