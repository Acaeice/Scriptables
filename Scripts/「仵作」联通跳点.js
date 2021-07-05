// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: battery-half;
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
    this.desc = '查看免流跳点'
    this.logo = 'https://rootwang.oss-cn-chengdu.aliyuncs.com/imges/liuliang.png?OSSAccessKeyId=LTAI5tFGDfkLhGjULuvqVp3P&Expires=1625480993&Signature=u5JbmzLuohVPxx9o9YQVOLioz2w%3D'

    this.registerAction("设置信息", this.actionSettings)
    this.registerAction("透明背景", this.actionSettings3)
    this.BG_FILE = this.getBackgroundImage()
    if (this.BG_FILE) this.registerAction("移除背景", this.actionSettings4)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    if (!this.settings || !this.settings['name'] || !this.settings['date'] || !this.settings['gender']) {
      return await this.renderConfigure()
    }
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge()
      case 'medium':
        return await this.renderMedium()
      default:
        return await this.renderSmall()
    }
  }

  // 提示配置
  async renderConfigure () {
    const w = new ListWidget()
    w.addText("请点击组件进行设置信息")
    w.url = this.actionUrl("settings")
    return w
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall () {
    let w = new ListWidget()
    // 名称
    await this.renderHeader(w, this.logo, this.name, this.BG_FILE ? Color.white() : null)

    w.addSpacer()   
    const date = w.addText(this.settings['name'])
    date.font = Font.lightSystemFont(10)
    date.textOpacity = 0.8
    date.centerAlignText()
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
    return false
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
    a.title = "设置Cookie"
    a.message = "配置Cookie"
    
    const menus = ['输入Cookie'];
    ;[{
      name:'name',
      text: '输入Cookie'
    }].map(item => {
      a.addAction((this.settings[item.name] ? '✅ ' : '❌ ') + item.text)
    })

    a.addCancelAction('取消设置')
    const id = await a.presentSheet()
    if (id === -1) return
    await this['actionSettings' + id]()
  }

  // 设置名称
  async actionSettings0 () {
    const a = new Alert()
    a.title = "输入Cookie"
    a.message = "请输Cookie"
    a.addTextField("Cookie", this.settings['name'])
    a.addAction("确定")
    a.addCancelAction("取消")

    const id = await a.presentAlert()
    if (id === -1) return await this.actionSettings()
    const n = a.textFieldValue(0)
    if (!n) return await this.actionSettings0()

    this.settings['name'] = n
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