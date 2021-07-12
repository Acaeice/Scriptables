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
    let w = new ListWidget()
    let fm = FileManager.iCloud()

    w.backgroundImage = fm.readImage(await this.writeUnicomImage("/10010/10010_backgroundImage.png"))
    let date = new Date();
    let newdate = date.toLocaleString('chinese', { hour12: false });
    let timenow = newdate.replace(/\//g, '-')

    const maxbox = w.addStack()
    maxbox.layoutVertically()


    const gettimenow = maxbox.addStack()
    gettimenow.addSpacer(65)
    gettimenow.setPadding(0, 0, 8, 0)
    let timeText = gettimenow.addText("查询时间：" + timenow)
    timeText.font = Font.lightSystemFont(12)
    timeText.textColor = new Color("959595", 1)

    const box = maxbox.addStack()
    box.layoutHorizontally()
    const flowpngbox = box.addStack()

    let flowPNG = flowpngbox.addImage(fm.readImage(await this.writeUnicomImage("/10010/10010_img.png")))
    flowPNG.imageSize = new Size(100, 100)
    flowpngbox.addSpacer(14)

    const totalbox = box.addStack()
    totalbox.size = new Size(180, 100)
    let arr = new Array("当前套餐：", data.type == 2 ? "当前跳点：" : "累计跳点：", "本月以免：", "本月合计：")
    let arr2 = new Array(data.packageName, data.hops + "  ", data.monthFree, data.monthTotal)
    let isExceed = (Number(String(data.hops).match(/(\S*)(MB|GB)/)[1]))
    const text = totalbox.addStack()
    text.layoutVertically()
    text.setPadding(6, 0, 0, 0)
    arr.map(async (d, i) => {
      const cell = text.addStack()
      let _title = d
      const cell_text = cell.addText(_title)
      cell_text.font = Font.thinMonospacedSystemFont(13)
      cell_text.lineLimit = 1
      const idx = cell.addText(arr2[i])
      idx.font = Font.systemFont(12)
      if (i === 0) {
        idx.textColor = new Color('#fe2d46', 1)
      } else {
        if (i == 1 && isExceed >= 10) {
          let wei = cell.addImage(await fm.readImage(await this.writeUnicomImage("/10010/10010_wei.png")))
          wei.imageSize = new Size(16, 15)
        }
        idx.textColor = new Color('#ff6600', 1)
      }
      cell.addSpacer()
      text.addSpacer(8)
    })
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
    let cookie = this.settings['cookie']
    let monthFree, hops, monthTotal, type = 1, livecache, totalhops, currenthops, unicom
    if (this.settings['cookie']) {
      const res = await this.getUnicomDetails(cookie)
      //跳点
      if (Keychain.contains("live") && Keychain.get("live") != "") {
        livecache = Keychain.get("live")
        type = 2
        totalhops = Number(res.resources[0].userResource) - Number(livecache)
        hops = totalhops >= 1000 ? (totalhops / 1024).toFixed(2) + "GB" : totalhops.toFixed(2) + "MB"
      } else {
        currenthops = Number(res.summary.sum) - Number(res.MlResources[0].userResource)
        hops = currenthops >= 1000 ? (currenthops / 1024).toFixed(2) + "GB" : currenthops.toFixed(2) + "MB"
      }
      //本月以免
      Number(res.MlResources[0].userResource) >= 1000 ? monthFree = (Number(res.MlResources[0].userResource) / 1024).toFixed(2) + "GB" :
        monthFree = Number(res.MlResources[0].userResource).toFixed(2) + "MB"
      //本月合计
      Number(res.summary.sum) >= 1000 ? monthTotal = (Number(res.summary.sum) / 1024).toFixed(2) + "GB" :
        Number(res.summary.sum).toFixed(2) + "MB"
      unicom = {
        "packageName": res.packageName,
        "monthFree": monthFree,
        "hops": hops,
        "monthTotal": monthTotal,
        "type": type
      }
      console.log(unicom);
    }

    return unicom
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

    const menus = ['Cookie', '更新缓存', '清除配置'];;
    [{
      name: 'cookie',
      text: '配置饼干'
    }, {
      name: 'cache',
      text: "更新缓存"
    }, {
      name: 'removestting',
      text: '清除配置'
    }].map(item => {
      if (item.name = "removestting") {
        a.addAction('🔧' + item.text)
      }
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
    let cookie = this.settings['cookie']
    const res = await this.getUnicomDetails(cookie)
    Keychain.set(cacheKey, res.resources[0].userResource)
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
const newFont = new Font("Courier", 12)
const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)