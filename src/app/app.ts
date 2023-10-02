class App {
  id: string;
  tab: ext.tabs.Tab | null = null;
  window: ext.windows.Window | null = null;
  webview: ext.webviews.Webview | null = null;
  websession: ext.websessions.Websession | null = null;
  isClose: boolean = false;
  
  constructor(id: string) {
    this.id = id;
  }

  public async initialize() {
    this.tab = await this.createTab();
    this.websession = await this.createWebsession();
    this.window = await this.createWindow();
    this.webview = await this.createWebview();
    this.isClose = false;

    await ext.webviews.loadURL(this.webview.id, 'https://www.tldraw.com/');
  }

  private async createTab() {
    return await ext.tabs.create({
      text: `TLDraw #${this.id}`
    });
  }

  private async createWebsession() {
    return await ext.websessions.create({ 
      partition: `session_${this.id}`,
      persistent: true,
      global: false,
      cache: true,
    });
  }

  private async createWindow() {
    return await ext.windows.create({
      title: `TLDraw #${this.id}`
    });
  }
  
  private async createWebview() {
    const windowSize: ext.windows.Size = await ext.windows.getContentSize(this.window!.id);
  
    return await ext.webviews.create({
      window: this.window!,
      websession: this.websession!,
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
  }

  public getWindowId() {
    return this.window?.id;
  }

  public getTabId() {
    return this.tab?.id;
  }

  public async close() {
    await ext.tabs.remove(this.tab!.id);
    await ext.websessions.remove(this.websession!.id);
    await ext.windows.remove(this.window!.id);
    await ext.webviews.remove(this.webview!.id);
    this.isClose = true;
  }
}

export default App;