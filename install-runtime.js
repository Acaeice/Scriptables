const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
await Promise.all(['「小件件」开发环境.js', '「源码」小组件示例.js','「仵作」联通跳点'].map(async js => {
  const REQ = new Request(`https://gitee.com/nodewuozuo/Scriptables/raw/main/Scripts/${encodeURIComponent(js)}`);
  const RES = await REQ.load();
  FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), js), RES);
}));
FILE_MGR.remove(module.filename);
Safari.open("scriptable:///open?scriptName="+encodeURIComponent('「源码」小组件示例'));