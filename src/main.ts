import App from './app/app';

const appList: App[] = [];

ext.runtime.onExtensionClick.addListener(async () => {
  try {
    await reinitializeClosedAppOrCreateNew();
  } catch(err) {
    console.log(err);
  }
});

const reinitializeClosedAppOrCreateNew = async () => {
  const closedApp = appList.find(app => app.isClose);
    
  if (closedApp) {
    await closedApp.initialize();
  } else {
    const appId = (appList.length + 1).toString();

    const app = new App(appId);
    await app.initialize();

    appList.push(app);
  }
};

ext.tabs.onClickedClose.addListener(async (event: ext.tabs.TabEvent) => {
  try {
    const {id: tabId} = event;
    const app = appList.find(app => app.getTabId() === tabId);

    if (app) {
      app.close();
    }
  } catch (err) {
    console.log(err);
  }
});

ext.windows.onClosed.addListener(async (event: ext.windows.WindowEvent) => {
  try {
    const {id: windowId} = event;
    const app = appList.find(app => app.getWindowId() === windowId);

    if (app) {
      app.close();
    }
  } catch (err) {
    console.log(err);
  }
});