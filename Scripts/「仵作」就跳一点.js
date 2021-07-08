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
  constructor(arg) {
    super(arg)
    this.name = '联通'
    this.desc = '联通流量监控'
    this.logo = 'https://rootwang.oss-cn-chengdu.aliyuncs.com/imges/liuliang.png?OSSAccessKeyId=LTAI5tFGDfkLhGjULuvqVp3P&Expires=1625792960&Signature=Tp%2BVjUXwGSZZ7Wo4yVRedH48djM%3D'
    this.registerAction("监控配置", this.actionSettings)
    this.registerAction("透明背景", this.actionSettings3)
    this.BG_FILE = this.getBackgroundImage()
    if (this.BG_FILE) this.registerAction("移除背景", this.actionSettings4)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render() {
    const data = await this.getData()
    if (!this.settings || !this.settings['cookie']) {
      return await this.renderConfigure()
    }
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge()
      case 'medium':
        return await this.renderMedium(data)
      default:
        return await this.renderSmall(data)
    }
  }

  // 提示配置
  async renderConfigure() {
    const w = new ListWidget()
    w.addText("请点击组件设置Cookie")
    w.url = this.actionUrl("settings")
    return w
  }


  /**
   * 渲染小尺寸组件
   */
  async renderSmall(data) {
    return false
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium(data) {
    // const img = await this.getImageByUrl("https://rootwang.oss-cn-chengdu.aliyuncs.com/imges/xiu.png?OSSAccessKeyId=LTAI5tFGDfkLhGjULuvqVp3P&Expires=1625687916&Signature=PkQfoj%2BEMGLpp%2BxEbxXD8FDn0sU%3D")
    // if (!img) return
    // console.log(img);
    let w = new ListWidget()
    let fm = FileManager.iCloud()
    let path = fm.documentsDirectory() + "/IMG_2280.JPG"
    w.backgroundImage = fm.readImage(path)
    let date = new Date();
    let newdate = date.toLocaleString('chinese', { hour12: false });
    let timenow = newdate.replace(/\//g, '-')
    
    const maxbox = w.addStack()
    maxbox.layoutVertically()
    maxbox.addSpacer()
    
    const box = maxbox.addStack()
    box.layoutHorizontally()

    const flowpngbox = box.addStack()
    let flowPNG = flowpngbox.addImage(await this.getImageByUrl(this.logo))
    flowPNG.imageSize = new Size(100, 100)
    flowpngbox.addSpacer(14)
    // flowpngbox.borderWidth = 1
    // flowpngbox.borderColor = new Color("6dce3c", 1)

    const totalbox = box.addStack()
    // totalbox.borderWidth = 1
    // totalbox.borderColor = new Color("6dce3c", 1)
    totalbox.size = new Size(180, 100)
    totalbox.layoutVertically()
    // let total = totalbox.addText("本月合计：")
    // let free = totalbox.addText("本月以免：")
    // let jump = totalbox.addText("只跳一点：")
    let arr = new Array("本月合计：", "本月以免：", "只跳一点：")
    let arr2 = new Array("201MB", "200MB", "1MB")
    arr.map((d, i) => {
      // if(i==0){
      //   totalbox.addText("1")
      // }

      let _title = d
      const cell_text = totalbox.addText(_title)
      cell_text.font = Font.lightSystemFont(13)
      cell_text.textColor = new Color("000000", 1)
      cell_text.lineLimit = 1
      if (i == 0 || i == 1) {
        totalbox.addSpacer(8)
      }
    })
    const gettimenow = maxbox.addStack()
    let timeText = gettimenow.addText("查询时间："+timenow)
    timeText.font = Font.lightSystemFont(12)
    timeText.textColor = new Color("959595", 1)
    
    // gettimenow.borderWidth = 1
    // gettimenow.borderColor = new Color("6dce3c", 1)
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge() {
    return await this.renderMedium()
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData() {
    // const req = new Request("https://m.client.10010.com/servicequerybusiness/operationservice/queryOcsPackageFlowLeftContent")
    // req.method = "POST"
    // req.headers = {
    //   "Cookie": this.settings['cookie']
    // }
    // const res = await req.loadJSON()
    // const current = res.resources[0].details[1].use * 1024
    // console.log(current);
    // const liveuse = Keychain.get("live") * 1024
    // const resdata = current - 5401743.26
    // console.log(resdata / 1024);
    // return current
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl(url) {
    Safari.openInApp(url, false)
  }

  async actionSettings() {
    const a = new Alert()
    a.title = "配置流量监控"
    a.message = "请先配置饼干后再更新缓存"

    const menus = ['Cookie', '更新缓存'];
    ;[{
      name: 'cookie',
      text: '配置饼干'
    }, {
      name: 'cache',
      text: "更新缓存"
    }].map(item => {
      a.addAction((this.settings[item.name] ? ' ✅ ' : '❎ ') + item.text)
    })

    a.addCancelAction('取消设置')
    const id = await a.presentSheet()
    if (id === -1) return
    await this['actionSettings' + id]()
  }

  // 配置Cookie
  async actionSettings0() {
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
  async actionSettings1() {
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
    Keychain.set(cacheKey, res.resources[0].details[1].use + "MB")
    this.settings['cache'] = 1
    this.saveSettings()
    return await this.actionSettings()
  }


  // 透明背景
  async actionSettings3() {
    const img = await this.getWidgetScreenShot()
    if (!img) return
    this.setBackgroundImage(img)
  }

  // 移除背景
  async actionSettings4() {
    this.setBackgroundImage(null)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)