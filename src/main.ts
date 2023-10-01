class App {
  tab: ext.tabs.Tab;
  window: ext.windows.Window;
  webview: ext.webviews.Webview;
  websession: ext.websessions.Websession;
  isClosed: boolean = true;

  constructor(
    tab: ext.tabs.Tab,
    window: ext.windows.Window,
    webview: ext.webviews.Webview,
    websession: ext.websessions.Websession
  ) {
    this.tab = tab;
    this.window = window;
    this.webview = webview;
    this.websession = websession;
  }
}

const appList: App[] = [];

ext.runtime.onExtensionClick.addListener(async () => {
  try {
    const index = appList.length;

    const extTab = await ext.tabs.create({
      text: `TLDraw #${index + 1}`
    });
  
    const extWebsession = await ext.websessions.create({ 
      partition: `session_${index}`,
      persistent: true,
      global: false,
      cache: true,
    });
  
    const  extWindow = await ext.windows.create({
      title: `TLDraw #${index + 1}`
    });
  
    const windowSize: ext.windows.Size = await ext.windows.getContentSize(extWindow.id);
  
    const extWebview = await ext.webviews.create({
      window: extWindow,
      websession: extWebsession,
      bounds: {
        x: 0,
        y: 0,
        width: windowSize.width,
        height: windowSize.height
      },
      autoResize: {
        width: true,
        height: true
      }
    });

    const app = new App(extTab, extWindow, extWebview, extWebsession);

    appList.push(app);
  
    await ext.webviews.loadURL(app.webview.id, 'https://www.tldraw.com/');
  } catch(err) {
    console.log(err);
  }
});

ext.tabs.onClickedClose.addListener(async (event: ext.tabs.TabEvent) => {
  try {
    const {id: windowId} = event;

    const app = appList.find(app => app.window.id === windowId);
    const appIndex = appList.findIndex(app => app.window.id === windowId);

    if (app) {
      await ext.windows.remove(app.window.id);
      appList.splice(appIndex, 1);
    }
  } catch (err) {
    console.log(err);
  }
});

ext.windows.onClosed.addListener(async (event: ext.windows.WindowEvent) => {
  try {
    const {id: windowId} = event;

    const app = appList.find(app => app.window.id === windowId);
    const appIndex = appList.findIndex(app => app.window.id === windowId);

    if (app) {
      await ext.tabs.remove(app.tab.id);
      appList.splice(appIndex, 1);
    }
  } catch (err) {
    console.log(err);
  }
});