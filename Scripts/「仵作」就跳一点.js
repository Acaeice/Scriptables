// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: hand-lizard;
// 
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
// 

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const { Base } = require("./「小件件」开发环境")

// @组件代码开始
class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor (arg) {
    super(arg)
    this.name = '联通'
    this.desc = '联通流量监控'
    this.logo = 'https://rootwang.oss-cn-chengdu.aliyuncs.com/imges/liuliang.png?OSSAccessKeyId=LTAI5tBcn1GoDktEP1VYrdbt&Expires=1625592727&Signature=Nb5hhd0C5emJp7iPwFQKouiJvE0%3D'
    this.logo
    this.registerAction("监控配置", this.actionSettings)
    this.registerAction("透明背景", this.actionSettings3)
    this.BG_FILE = this.getBackgroundImage()
    if (this.BG_FILE) this.registerAction("移除背景", this.actionSettings4)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
   async render () {
    const data = await this.getData()
    if (!this.settings || !this.settings['cookie']) {
      return await this.renderConfigure()
    }
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge()
      case 'medium':
        return await this.renderMedium()
      default:
        return await this.renderSmall(data)
    }
  }

  // 提示配置
  async renderConfigure () {
    const w = new ListWidget()
    w.addText("请点击组件设置Cookie")
    w.url = this.actionUrl("settings")
    return w
  }


  /**
   * 渲染小尺寸组件
   */
  async renderSmall (data) {
    let w = new ListWidget()
    // 名称
    // await this.renderHeader(w, this.logo, this.name, this.BG_FILE ? Color.white() : null)
    w.addSpacer(10)
    let header = w.addStack()
    header.centerAlignContent()
    let _icon = header.addImage(await this.getImageByUrl(this.logo))
    _icon.imageSize = new Size(24, 24)
    _icon.cornerRadius = 4
    header.addSpacer(10)
    let _title = header.addText(this.name)
    _title.textColor = Color.white()
    _title.textOpacity = 0.6
    _title.font = Font.boldSystemFont(12)
    w.addSpacer(10)
    const liveUse = Keychain.get("live")
    const t = w.addText(liveUse)
    t.font = Font.lightSystemFont(16)
    
    if (this.BG_FILE) {
      w.backgroundImage = this.BG_FILE
    }

    w.url = this.actionUrl("settings")

    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium () {
    return false
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    return await this.renderMedium()
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData () {
    const req = new Request("https://m.client.10010.com/servicequerybusiness/operationservice/queryOcsPackageFlowLeftContent")
    req.method = "POST"
    req.headers = {
      "Cookie": this.settings['cookie']
    }
    const res = await req.loadJSON()
    const current = res.resources[0].details[1].use*1024
    console.log(current);
    const liveuse = Keychain.get("live")*1024
    const resdata = current - 5401743.26
    console.log(resdata/1024);
    return current
}

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }

  async actionSettings () {
    const a = new Alert()
    a.title = "配置流量监控"
    a.message = "请先配置饼干后再更新缓存"
    
    const menus = ['Cookie','更新缓存'];
    ;[{
      name:'cookie',
      text:'配置饼干'
    },{
      name:'cache',
      text:"更新缓存"
    }].map(item => {
      a.addAction((this.settings[item.name] ? ' ✅ ' : '❎ ') + item.text)
    })

    a.addCancelAction('取消设置')
    const id = await a.presentSheet()
    if (id === -1) return
    await this['actionSettings' + id]()
  }

  // 配置Cookie
  async actionSettings0 () {
    const a = new Alert()
    a.title = "Cookie"
    a.message = "请填写Cookie获取流量使用详情"
    a.addTextField("联通Cookie", this.settings['cookie'])
    a.addAction("确定")
    a.addCancelAction("取消")

    const id = await a.presentAlert()
    if (id === -1) return await this.actionSettings()
    const n = a.textFieldValue(0)
    if (!n) return await this.actionSettings0()

    this.settings['cookie'] = n
    this.saveSettings()

    return await this.actionSettings()
  }

  
  // 更新缓存
  async actionSettings1 () {
    const cacheKey = "live"
    const a = new Alert()
    a.title = "更新缓存将重新计算跳点"
    a.addAction("更新")
    const use = Keychain.get(cacheKey)
    a.addCancelAction("取消")
      
    const id = await a.presentSheet()
    if (id === -1) return await this.actionSettings()
    const req = new Request("https://m.client.10010.com/servicequerybusiness/operationservice/queryOcsPackageFlowLeftContent")
    req.method = "POST"
    req.headers = {
      "Cookie": this.settings['cookie']
    }
    const res = await req.loadJSON()
    Keychain.set(cacheKey,res.resources[0].details[1].use+"MB")
    this.settings['cache'] = 1
    this.saveSettings()
    return await this.actionSettings()
  }


  // 透明背景
  async actionSettings3 () {
    const img = await this.getWidgetScreenShot()
    if (!img) return
    this.setBackgroundImage(img)
  }

  // 移除背景
  async actionSettings4 () {
    this.setBackgroundImage(null)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)