let extTab: ext.tabs.Tab | null = null;
let extWindow: ext.windows.Window | null = null;
let extWebview: ext.webviews.Webview | null = null;

ext.runtime.onExtensionClick.addListener(async () => {

  if (extTab) return;

  extTab = await ext.tabs.create({
    text: 'TLDraw'
  });

  extWindow = await ext.windows.create();

  const windowSize: ext.windows.Size = await ext.windows.getContentSize(extWindow.id);

  extWebview = await ext.webviews.create({
    window: extWindow,
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
});