let extTab: ext.tabs.Tab | null = null;
let extWindow: ext.windows.Window | null = null;
let extWebview: ext.webviews.Webview | null = null;
let extWebsession: ext.websessions.Websession | null = null;

ext.runtime.onExtensionClick.addListener(async () => {
  try {
    if (extTab) return;

    extTab = await ext.tabs.create({
      text: 'TLDraw'
    });
  
    extWebsession = await ext.websessions.create({ 
      partition: 'Test',
      persistent: true,
      global: false,
      cache: true,
    });
  
    extWindow = await ext.windows.create();
  
    const windowSize: ext.windows.Size = await ext.windows.getContentSize(extWindow.id);
  
    extWebview = await ext.webviews.create({
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
  
    await ext.webviews.loadURL(extWebview.id, 'https://www.tldraw.com/');
  } catch(err) {
    console.log(err);
  }
});

ext.tabs.onClickedClose.addListener(async () => {
  if (extTab && extTab.id) {
    await ext.tabs.remove(extTab.id);
    extTab = null;
  }

  if (extWindow && extWindow.id) {
    await ext.windows.remove(extWindow.id);
    extWindow = null;
  }
});

ext.windows.onClosed.addListener(async () => {
  if (extTab && extTab.id) {
    await ext.tabs.remove(extTab.id);
    extTab = null;
  }
});