//software: https://helpx.adobe.com/download-install/kb/creative-cloud-apps-download.html
//json: https://github.com/tylearymf/Json-js/blob/master/json2.js
//api1: https://www.adobe.com/devnet/photoshop/scripting.html ☆☆☆☆☆
//api2: https://www.indesignjs.de/extendscriptAPI/indesign10/ ☆☆☆☆☆
//api3: http://nullice.com/archives/1790 ☆☆☆☆
//api4: http://jongware.mit.edu/Js/index_1.html ☆☆☆

//0 (no debugging), 1 (break on runtime errors), or 2 (full debug mode).
//如果要调试就设置为2，然后出现异常的时候，ps会自动打开Adobe ExtendScript Toolkit CC并挂起ps
$.level = 2
//是否打开所有提示
var showDialog = false

//游戏分辨率设置
var gameScreenWidth = 1920
var gameScreenHeight = 1080

//导出图片方案
var exportImagePlan = 1
var config
var gameScreenSize

//ui界面上用到的字段
//是否开启适配
var enableFit = false
//导出路径
var exportPath
//锚点类型
var pivotType
//导出类型
var layerExportType
//进度条相关
var progressBar
var progressIndex
var progressTotalCount

//弹普通提示
function ShowMsg(msg) {
    if (showDialog)
        alert(msg)
}

//弹错误提示
function ShowError(msg) {
    alert(msg)
    throw new Error(msg, "customException", 0)
}

//key:节点类型,value:简短类型标记
ComponentType = {
    //文本
    Label: "lab",
    //精灵、小图
    Sprite: "img",
    //大图
    Texture: "rimg",
    //按钮
    Button: "btn",
    //面板
    Panel: "pnl",
    //窗口
    Window: "wnd",
    //九宫格
    Slice: "9s",
}

//入口
function Main() {
    InitJson()
    InitMyWindow()
    InitBuiltInStuct()
    InitNodeStruct()
    InitCustomStruct()

    if (app.documents.length <= 0) {
        ShowError("document is null!")
    }

    if (activeDocument.saved) {
        ShowMsg("文档路径：" + activeDocument.path)
    }
    else {
        ShowError("psd尚未保存，请保存后再操作")
    }

    //锚点模式默认为居中
    pivotType = PivotType.Center
    //导出类型默认是只导出标记并显示的图层
    layerExportType = LayerExportType.EnableAndTag
    var psdSize = new Vector2(activeDocument.width.value, activeDocument.height.value)
    gameScreenSize = new Vector2(gameScreenWidth, gameScreenHeight)

    var resolutionStr = String.format("     当前PSD分辨率：{0}，当前配置的游戏分辨率: {1}", psdSize, gameScreenSize)
    new MyWindow("提示", "PSD导出UGUI配置" + resolutionStr, function (win) {
        //开始导出时，禁用掉界面点击
        //这里如果在导出中Ps出现异常情况，则关闭不了这个窗口了，直到杀进程再开，所以这个先保留默认
        // win.enabled = false

        try {
            StartExport(activeDocument, win)
        } catch (error) {
            if (error.fileName == "customException") {
                return false;
            }

            var str = error.toString()
            str += "\nfileName:" + error.fileName
            str += "\nline:" + error.line
            // str += "\nstack:" + $.stack
            ShowError(str)
        }
        return win.close()
    }, function (win) {

        return win.close()
    }, function (win) {

        //导出进度
        AddGroup(win, "导出进度", function (group) {
            progressBar = group.add("progressbar")
            progressBar.value = 0
        })

        //导出路径
        AddGroup(win, "导出路径", function (group) {
            var etext = group.add("editText")
            exportPath = String.format("{0}/../PsdConfig/PSDConfig_{1}", activeDocument.path, activeDocument.name.substring(0, activeDocument.name.length - 4))
            etext.text = exportPath
            etext.onChange = function () {
                exportPath = etext.text
            }
        })

        //导出类型
        AddGroup(win, "导出类型", function (group) {
            AddDropDownList(group, LayerExportType, LayerExportType.EnableAndTag, function (drop) {
                layerExportType = drop.selection.text
                ShowMsg("layerExportType:" + layerExportType)
            })
        })

        //锚点类型
        AddGroup(win, "锚点类型", function (group) {
            AddDropDownList(group, PivotType, PivotType.Center, function (drop) {
                pivotType = drop.selection.text
                ShowMsg("pivotType:" + pivotType)
            })
        })

        //是否开启适配选项
        AddGroup(win, "是否开启适配", function (group) {
            var checkbox = group.add("checkbox")
            checkbox.value = enableFit
            checkbox.onClick = function () {
                enableFit = checkbox.value
                ShowMsg("enableFit:" + enableFit)
            }
            group.enabled = psdSize.toString() != gameScreenSize.toString()
        })
    })
}

//ui 扩展
function AddGroup(win, text, callback) {
    var group = win.add("group")
    var stext = group.add("staticText")
    stext.alignment = ["fill", "center"]
    stext.text = text
    callback(group)
}

//ui 扩展
function AddDropDownList(group, type, defaultValue, callback) {
    var drop = group.add("dropDownList")
    for (var key in type) {
        drop.add("item", type[key])
    }
    var item = drop.find(defaultValue)
    if (item) item.selected = true
    drop.onChange = function () {
        callback(drop)
    }
}

//开始导出
function StartExport(doc) {
    //检查残留文件夹
    config = new Config(doc, null, exportPath, pivotType, enableFit)
    var fileConfig = new FileConfig(config)
    var path = fileConfig.getFolderPath()
    var folder = new Folder(path)
    var files = folder.getFiles()
    if (files && files.length > 0) {
        new MyWindow("警告", String.format("该文件夹“{0}”不为空，是否清空再生成？", path), function (win) {
            for (var i = 0; i < files.length; i++) {
                var item = files[i]
                item.remove()
            }
            return win.close()
        }, function (win) {
            return win.close()
        }, function (win) {
            //ongui
        }, "清空文件夹再生成", "直接覆盖")
    }

    activeDocument = doc
    //在你打开psd后，如果没选中任意一个Layer时，有时候导出会报错，所以就有了下面这块奇葩的代码
    //开始的时候需要选中一个Layer，而且还不能是当前选中的Layer，还有个当activeLayer设置后，会自动把该Layer的visible设置为true
    if (doc.layers.length > 0) {
        var tempActiveLayer = activeDocument.activeLayer
        for (var i = 0; i < doc.layers.length; i++) {
            var tempLayer = doc.layers[i]
            if (tempLayer != tempActiveLayer) {
                var visible = tempLayer.visible
                doc.activeLayer = tempLayer
                tempLayer.visible = visible
                break
            }
        }
    }

    //图层集合(只包含根节点的)
    var infos = ConvertLayers(doc, doc.layers)
    config.layers = infos

    if (infos.length <= 0) {
        ShowError("无可导出信息")
        return
    }

    //保存配置
    var startRulerUnits = app.preferences.rulerUnits
    var startTypeUnits = app.preferences.typeUnits
    var startDisplayDialogs = app.displayDialogs
    //修改配置
    app.displayDialogs = DialogModes.NO
    app.preferences.rulerUnits = Units.PIXELS
    app.preferences.typeUnits = TypeUnits.PIXELS

    //设置进度
    progressIndex = 1
    progressTotalCount = 0
    function getTotalCount(list) {
        for (var i = 0; i < list.length; i++) {
            var info = list[i]
            if (info instanceof Layer) {
                progressTotalCount = progressTotalCount + 1
            }
            else if (info instanceof LayerSet) {
                getTotalCount(info.layers)
            }
        }
    }
    getTotalCount(infos)

    //导出
    for (var i = 0, totalCount = infos.length; i < totalCount; i++) {
        infos[i].export(path)
    }

    fileConfig.save()

    //还原配置
    app.preferences.rulerUnits = startRulerUnits
    app.preferences.typeUnits = startTypeUnits
    app.displayDialogs = startDisplayDialogs

    //导出成功后打开文件夹
    fileConfig.showInExplorer()
}

//ps原生Layer类型转换成自定义Layer类型
function ConvertLayers(doc, layers) {
    var infos = new Array()
    for (var i = layers.length - 1; i >= 0; i--) {
        var item = layers[i]
        switch (item.typename) {
            case NameConst.LayerSet:
                {
                    var layerSet = new LayerSet(doc, item)
                    if (!layerSet.isValid()) continue;

                    infos.push(layerSet)
                }
                break;
            case NameConst.ArtLayer:
                {
                    var layer = new Layer(doc, item)
                    if (!layer.isValid()) continue;
                    infos.push(layer)
                }
                break;
        }
    }

    return infos
}

//更新导出进度
function updateProgressBar() {
    progressBar.value = (progressIndex / progressTotalCount) * 100.0
    progressIndex = progressIndex + 1
}

//初始化节点结构
function InitNodeStruct() {
    //根据节点类型名获取类型
    GetInfoByTypeName = function (baseLayer) {
        var nodeTypeName = baseLayer.nodeTypeName
        if (nodeTypeName == ComponentType.Label) {
            return new LabelInfo(baseLayer)
        }
        else if (nodeTypeName == ComponentType.Sprite) {
            return new SpriteInfo(baseLayer)
        }
        else if (nodeTypeName == ComponentType.Slice) {
            return new SliceInfo(baseLayer)
        }
        else if (nodeTypeName == ComponentType.Texture) {
            return new TextureInfo(baseLayer)
        }
        else if (nodeTypeName == ComponentType.Button) {
            return new ButtonInfo(baseLayer)
        }
        else if (nodeTypeName == ComponentType.Panel) {
            return new PanelInfo(baseLayer)
        }
        else if (nodeTypeName == ComponentType.Window) {
            return new WindowInfo(baseLayer)
        }

        ShowError("没有实现该节点类型：" + nodeTypeName)
    }

    BaseInfo = function (baseLayer) {
        this.baseLayer = baseLayer
        this.hasImage = false
        this.is9Slice = false
    }

    //精灵信息
    SpriteInfo = function (baseLayer) {
        BaseInfo.call(this, baseLayer)
        this.hasImage = true
        this.imageName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
    }
    SpriteInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Sprite,
            imageName: this.imageName
        }
    }

    //九宫格切割信息
    SliceInfo = function (baseLayer) {
        SpriteInfo.call(this, baseLayer)
        this.is9Slice = true

        var nodeArgs = this.baseLayer.nodeArgs
        var left = 0
        var top = 0
        var right = 0
        var bottom = 0

        if (nodeArgs.length == 1) {
            left = parseInt(nodeArgs[0])
            top = left
            right = left
            bottom = left
        }
        else if (nodeArgs.length == 4) {
            left = parseInt(nodeArgs[0])
            top = parseInt(nodeArgs[1])
            right = parseInt(nodeArgs[2])
            bottom = parseInt(nodeArgs[3])
        }

        this.border = new Vector4(left, top, right, bottom)
    }
    //切割九宫格图片
    SliceInfo.prototype.sliceSprite = function (tempDoc, tempLayer) {
        //获取裁剪信息
        var size = this.baseLayer.getSize()
        var left = this.border.x
        var top = this.border.y
        var right = this.border.z
        var bottom = this.border.w

        if (right <= 0 && left <= 0 && bottom && top <= 0) {
            ShowError("九宫格信息错误！有效裁剪区域小于0")
        }

        try {
            //复制两份图层
            var leftPartDoc = tempDoc.duplicate("leftpart", true)
            var rightPartDoc = tempDoc.duplicate("rightpart", true)

            //移除原图层
            activeDocument = tempDoc
            tempLayer.remove()

            //裁剪左半部分
            activeDocument = leftPartDoc
            //crop方法的bounds:left top right bottom，其中四个点都是以左上角为基准点计算的
            leftPartDoc.crop([0, top, left, size.y - bottom])
            var layer = leftPartDoc.layers[0]
            var leftPartLayer = layer.duplicate(tempDoc, ElementPlacement.INSIDE)
            leftPartDoc.close(SaveOptions.DONOTSAVECHANGES)

            //裁剪右半部分
            activeDocument = rightPartDoc
            rightPartDoc.crop([size.x - right, top, size.x, size.y - bottom])
            var layer = rightPartDoc.layers[0]
            var rightPartLayer = layer.duplicate(tempDoc, ElementPlacement.INSIDE)
            rightPartDoc.close(SaveOptions.DONOTSAVECHANGES)

            //调整左半部分和右半部分的位置
            activeDocument = tempDoc
            var leftPartBounds = leftPartLayer.bounds
            leftPartLayer.translate(-leftPartBounds[0], -leftPartBounds[1])
            var rightPartBounds = rightPartLayer.bounds
            rightPartLayer.translate(-rightPartBounds[0] + leftPartBounds[2] - 1, -rightPartBounds[1])
            //合并左半部分和右半部分为一个图层
            tempDoc.mergeVisibleLayers()
            tempDoc.trim(TrimType.TRANSPARENT)
        } catch (error) {
            ShowError("九宫格信息错误！" + error.toString())
        }
    }
    SliceInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Sprite,
            imageName: this.imageName,
            border: this.border
        }
    }

    //大图信息
    TextureInfo = function (baseLayer) {
        BaseInfo.call(this, baseLayer)
        this.hasImage = true
        this.imageName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
    }
    TextureInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Texture,
            imageName: this.imageName
        }
    }

    //文本信息
    LabelInfo = function (baseLayer) {
        BaseInfo.call(this, baseLayer)
        this.textItem = this.baseLayer.source.textItem
        this.content = this.textItem.contents
        this.font = this.textItem.font
        this.color = this.textItem.color.rgb.hexValue
        this.fontSize = this.textItem.size.value
        this.labelName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())

        this.alignment = "CENTER"
        this.direction = "HORIZONTAL"

        try {
            //这里挺奇怪的，就调一下这个属性justification，他妹的就报错了。。。用hasOwnProperty()又说有这个属性，又不能调用。。所以只能trycatch了。
            var justification = this.textItem.justification
            if (justification != null && justification != "") {
                this.alignment = justification.toString().replace("Justification.", "")
            }
        } catch (error) {
            // ShowError(error.toString())
        }

        try {
            var direction = this.textItem.direction
            if (direction != null && direction != "") {
                this.direction = direction.toString().replace("Direction.", "")
            }
        } catch (error) {
            // ShowError(error.toString())
        }
    }
    LabelInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Label,
            content: this.content,
            font: this.font,
            fontSize: this.fontSize,
            color: this.color,
            alignment: this.alignment,
            direction: this.direction
        }
    }

    //按钮信息
    ButtonInfo = function (baseLayer) {
        BaseInfo.call(this, baseLayer)

        //两种模式，
        //·按钮只是容器，图片或者文本在该Layer的子Layer中
        //·按钮自身是图片的，
        if (baseLayer.layerTypeName == NameConst.LayerSet) {
            this.hasImage = false
            this.btnType = "Container"
        }
        else {
            this.hasImage = true
            this.btnType = "Self"
            this.imageName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
        }
    }
    ButtonInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Button,
            imageName: this.imageName,
            btnType: this.btnType
        }
    }

    //面板信息
    PanelInfo = function (baseLayer) {
        BaseInfo.call(this, baseLayer)
    }
    PanelInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Panel,
        }
    }

    //窗口信息
    WindowInfo = function (baseLayer) {
        BaseInfo.call(this, baseLayer)
    }
    WindowInfo.prototype.toJson = function () {
        return {
            typeName: ComponentType.Window,
        }
    }
}

//初始化自定义结构
function InitCustomStruct() {
    //常量值
    NameConst = {
        ArtLayer: "ArtLayer",
        LayerSet: "LayerSet",
    }

    //锚点类型
    PivotType = {
        TopLeft: "TopLeft",
        Left: "Left",
        BottomLeft: "BottomLeft",
        Top: "Top",
        Center: "Center",
        Bottom: "Bottom",
        TopRight: "TopRight",
        Right: "Right",
        BottomRight: "BottomRight",
    }

    //导出类型
    LayerExportType = {
        EnableAndTag: "已正确命名的并且显示的图层",
        EnableLayer: "所有显示的图层（不用命名节点）",
        AllLayer: "所有图层(包含隐藏图层且不用命名节点)",
    }

    //配置操作对象
    FileConfig = function (config) {
        this.name = "Config.json"
        this.config = config
        this.path = config.psdPath
        this.folder = config.psdName
    }
    FileConfig.prototype.getFolderPath = function () {
        var path = null
        if (this.config.exportPath == null) {
            path = String.format("{0}/PSDConfig_{1}", this.path, this.folder)
        }
        else {
            path = this.config.exportPath
        }
        var folder = new Folder(path)
        if (!folder.exists) folder.create()
        return path
    }
    FileConfig.prototype.getFullName = function () {
        return String.format("{0}/{1}", this.getFolderPath(), this.name)
    }
    FileConfig.prototype.save = function () {
        if (this.path == "" || !this.config) {
            ShowError("配置出错，不能保存")
        }

        var file = new File(this.getFullName())
        file.encoding = "UTF8"
        file.lineFeed = "Windows"
        file.readonly = true
        file.open("w")
        var str = Json.stringify(this.config)
        ShowMsg(str)
        file.writeln(str)
        file.close()
    }
    FileConfig.prototype.showInExplorer = function () {
        var folder = new Folder(this.getFolderPath())
        folder.execute()
    }

    //配置结构
    Config = function (doc, layers, exportPath, pivotType, enableFit) {
        this.doc = doc
        this.psdPath = doc.path
        //remove .psd
        this.psdName = doc.name.substring(0, doc.name.length - 4)
        this.psdSize = new Vector2(doc.width.value, doc.height.value)
        this.layers = layers
        //导出路径
        this.exportPath = exportPath
        //锚点类型
        this.pivotType = pivotType
        //是否开启适配
        this.enableFit = enableFit
        //一个递增值，用于设置导出图片的后缀，以防止图片重名
        this.imageSuffixIndex = 1

        switch (pivotType) {
            case PivotType.TopLeft:
                this.pivot = new Vector2(0, 1)
                break;
            case PivotType.Top:
                this.pivot = new Vector2(0.5, 1)
                break;
            case PivotType.TopRight:
                this.pivot = new Vector2(1, 1)
                break;
            case PivotType.Left:
                this.pivot = new Vector2(0, 0.5)
                break;
            case PivotType.Center:
                this.pivot = new Vector2(0.5, 0.5)
                break;
            case PivotType.Right:
                this.pivot = new Vector2(1, 0.5)
                break;
            case PivotType.BottomLeft:
                this.pivot = new Vector2(0, 0)
                break;
            case PivotType.Bottom:
                this.pivot = new Vector2(0.5, 0)
                break;
            case PivotType.BottomRight:
                this.pivot = new Vector2(1, 0)
                break;
            default:
                this.pivot = Vector2.zero()
                break;
        }
    }
    Config.prototype.getPivotValue = function () {
        return this.pivot
    }
    Config.prototype.getImageSuffixIndex = function () {
        this.imageSuffixIndex += 1
        return this.imageSuffixIndex
    }
    Config.prototype.toJson = function () {
        return {
            name: this.psdName,
            size: this.psdSize,
            pivot: this.pivot,
            layers: this.layers
        }
    }

    //图层抽象结构
    BaseLayer = function (doc, layer) {
        this.doc = doc
        this.source = layer
        this.fullName = layer.name
        this.bounds = Vector4.parse(layer.bounds)
        this.layerTypeName = !layer.typename ? "" : layer.typename.toString()
        this.visible = layer.visible
        //保留2位小数
        this.opacity = Math.round(layer.opacity) / 100
        this.nodeName = ""
        this.nodeTypeName = ""
        this.nodeArgs = null

        //已正确命名的图层
        var nameSplits = this.fullName.split("@")
        if (nameSplits.length == 2) {
            var nameSplit = nameSplits[1]
            var nameSplits2 = nameSplit.split("_")
            this.nodeName = nameSplits2[0]
            this.nodeTypeName = nameSplits2[1].toLowerCase()
            //去除前两个数据
            nameSplits2.splice(0, 2)
            this.nodeArgs = nameSplits2
        }

        switch (layerExportType) {
            case LayerExportType.EnableLayer:
            case LayerExportType.AllLayer:
                if (this.nodeName == "") {
                    this.nodeName = this.source.name
                }

                if (this.nodeTypeName == "") {
                    var sizex = this.bounds.z
                    var sizey = this.bounds.w
                    if (this.layerTypeName == "ArtLayer") {
                        if (this.source.kind == LayerKind.TEXT) {
                            this.nodeTypeName = ComponentType.Label
                        }
                        else if (sizex < 512 && sizey < 512) {
                            this.nodeTypeName = ComponentType.Sprite
                        }
                        else {
                            this.nodeTypeName = ComponentType.Texture
                        }
                    }
                    else {
                        this.nodeTypeName = ComponentType.Panel
                    }
                }
                break;
        }

        //去除Unity里面的一些不支持的特殊符号
        this.nodeName = this.nodeName.replace(/[\/\?\<\>\\\:\*\|\s]/g, "_")

        this.scale_x = gameScreenWidth / this.doc.width.value
        this.scale_y = gameScreenHeight / this.doc.height.value

        this.isValid = function () {
            switch (layerExportType) {
                case LayerExportType.EnableAndTag:
                    return this.nodeName != "" && this.visible
                case LayerExportType.EnableLayer:
                    return this.visible
                case LayerExportType.AllLayer:
                    return true
                default:
                    return false
            }
        }
        this.getPos = function () {
            return new Vector2(this.bounds.x, this.bounds.y)
        }
        this.getUnityPos = function () {
            var pos = this.getPos()
            var size = this.getSize()
            var psdSize = new Vector2(this.doc.width.value, this.doc.height.value)

            //先把轴调转，让其跟unity坐标轴方向一致
            pos.y = pos.y * -1

            switch (pivotType) {
                case PivotType.TopLeft:
                    pos.x = pos.x - psdSize.x / 2
                    pos.y = psdSize.y / 2 + pos.y
                    break;
                case PivotType.Top:
                    pos.x = pos.x - psdSize.x / 2 + size.x / 2
                    pos.y = psdSize.y / 2 + pos.y
                    break;
                case PivotType.TopRight:
                    pos.x = pos.x - psdSize.x / 2 + size.x
                    pos.y = psdSize.y / 2 + pos.y
                    break;
                case PivotType.Left:
                    pos.x = pos.x - psdSize.x / 2
                    pos.y = psdSize.y / 2 + pos.y - size.y / 2
                    break;
                case PivotType.Center:
                    pos.x = pos.x - psdSize.x / 2 + size.x / 2
                    pos.y = psdSize.y / 2 + pos.y - size.y / 2
                    break;
                case PivotType.Right:
                    pos.x = pos.x - psdSize.x / 2 + size.x
                    pos.y = psdSize.y / 2 + pos.y - size.y / 2
                    break;
                case PivotType.BottomLeft:
                    pos.x = pos.x - psdSize.x / 2
                    pos.y = psdSize.y / 2 + pos.y - size.y
                    break;
                case PivotType.Bottom:
                    pos.x = pos.x - psdSize.x / 2 + size.x / 2
                    pos.y = psdSize.y / 2 + pos.y - size.y
                    break;
                case PivotType.BottomRight:
                    pos.x = pos.x - psdSize.x / 2 + size.x
                    pos.y = psdSize.y / 2 + pos.y - size.y
                    break;
                default:
                    throw new Error("未实现该锚点:" + pivotType)
            }

            if (config.enableFit) {
                pos.x = pos.x * this.scale_x
                pos.y = pos.y * this.scale_y
            }

            return pos
        }
        this.getUnitySize = function () {
            var size = this.getSize()

            if (config.enableFit) {
                size.x = size.x * this.scale_x
                size.y = size.y * this.scale_y
            }

            return size
        }
        this.getSize = function () {
            return new Vector2(this.bounds.z, this.bounds.w)
        }
        this.getExportName = function () {
            if (this.info.hasImage) {
                return this.info.imageName
            }

            return this.nodeName
        }

        if (this.isValid()) {
            this.info = GetInfoByTypeName(this)
        }
    }

    //组
    LayerSet = function (doc, layer) {
        BaseLayer.call(this, doc, layer)

        this.sourceLayers = layer.layers
        this.layers = ConvertLayers(doc, this.sourceLayers)
    }
    LayerSet.prototype.toString = function () {
        return Json.stringify(this)
    }
    LayerSet.prototype.toJson = function () {
        return {
            name: this.nodeName,
            layerTypeName: this.layerTypeName,
            nodeTypeName: this.nodeTypeName,
            nodeArgs: this.nodeArgs,
            pos: this.getUnityPos(),
            size: this.getUnitySize(),
            opacity: this.opacity,
            info: this.info,
            layers: this.layers,
        }
    }
    LayerSet.prototype.export = function (folderFullName) {
        for (var i = this.layers.length - 1; i >= 0; i--) {
            var layer = this.layers[i]
            layer.export(folderFullName)
        }
    }

    //图层
    Layer = function (doc, layer) {
        BaseLayer.call(this, doc, layer)

        this.sourceBounds = layer.bounds
        this.kind = !layer.kind ? "" : layer.kind.toString()
    }
    Layer.prototype.toString = function () {
        return Json.stringify(this)
    }
    Layer.prototype.toJson = function () {
        return {
            name: this.nodeName,
            layerTypeName: this.layerTypeName,
            nodeTypeName: this.nodeTypeName,
            nodeArgs: this.nodeArgs,
            pos: this.getUnityPos(),
            size: this.getUnitySize(),
            opacity: this.opacity,
            info: this.info,
        }
    }
    Layer.prototype.export = function (folderFullName) {
        ShowMsg("export:" + folderFullName + "\n" + this.toString())

        //更新进度条
        updateProgressBar()

        var size = this.getSize()
        //不是图片的或者是空图层的不导出
        if (!this.info.hasImage || size.x == 0 || size.y == 0) return

        //这里name如果是包含:的话，会导致ps报错，所以直接给定个字符串
        var tempDoc = app.documents.add(size.x, size.y, this.doc.resolution, "temp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
        activeDocument = this.doc
        var tempLayer = this.source.duplicate(tempDoc, ElementPlacement.INSIDE)
        var pos = this.getPos()
        activeDocument = tempDoc

        var isLock = tempLayer.allLocked
        tempLayer.allLocked = false
        tempLayer.translate(-pos.x, -pos.y)
        tempLayer.allLocked = isLock

        if (this.info.is9Slice) {
            this.info.sliceSprite(tempDoc, tempLayer)
        }

        var exportObj = GetSameImageExportName(activeDocument, this.info)
        var canExport = exportObj.canExport
        var exportName = exportObj.exportName
        if (!canExport) {
            ShowMsg("之前已经导出过相同图片了，不需要再导出了")
            this.info.imageName = exportName
            tempDoc.close(SaveOptions.DONOTSAVECHANGES)
            return;
        }

        var file = new File(String.format("{0}/{1}.png", folderFullName, exportName))
        if (exportImagePlan == 1) {
            var option = new ExportOptionsSaveForWeb()
            option.format = SaveDocumentType.PNG
            option.PNG8 = false
            tempDoc.exportDocument(file, ExportType.SAVEFORWEB, option)
            tempDoc.close(SaveOptions.DONOTSAVECHANGES)
        }
        else if (exportImagePlan == 2) {
            var option = new PNGSaveOptions()
            option.compression = 9
            option.interlaced = false
            tempDoc.saveAs(file, option, true, Extension.UPPERCASE)
            tempDoc.close(SaveOptions.DONOTSAVECHANGES)
        }
        else {
            ShowError("导出方案错误！")
        }
    }
}

//#region 初始化内置结构
function InitBuiltInStuct() {
    Vector2 = function (x, y) {
        this.x = x || 0
        this.y = y || 0
    }
    Vector2.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")"
    }
    Vector3 = function (x, y, z) {
        Vector2.call(this, x, y)
        this.z = z || 0
    }
    Vector3.prototype.toString = function () {
        return "(" + this.x + "," + this.y + "," + this.z + ")"
    }
    Vector4 = function (x, y, z, w) {
        Vector3.call(this, x, y, z)
        this.w = w || 0
    }
    Vector4.prototype.toString = function () {
        return "(" + this.x + "," + this.y + "," + this.z + "," + this.w + ")"
    }
    Vector4.parse = function (array) {
        var val = new Vector4()
        if (array != null) {
            var temp = new Array()
            for (var i = 0; i < array.length; i++) {
                var v = array[i];
                temp[i] = parseFloat(v);
            }
            val.x = temp[0]
            val.y = temp[1]
            val.z = temp[2] - temp[0]
            val.w = temp[3] - temp[1]
        }
        return val
    }

    if (!String.format) {
        String.format = function (format) {
            var str = format
            var args = Array.prototype.slice.call(arguments, 1);
            for (var index = 0; index < args.length; index++) {
                var element = args[index]
                str = str.replace("{" + index + "}", element)
            }
            return str
        }
    }
}
//#endregion

//#region 初始化窗口
function InitMyWindow() {
    MyWindow = function (title, content, okCallBack, cancelCallBack, onGuiCallBack, okContent, cancelContent) {
        var win = new Window("dialog")
        win.orientation = "column"
        win.alignChildren = ["fill", "bottom"]
        win.preferredSize = [300, 130]
        win.text = !title ? "提示" : title

        var st = win.add("staticText")
        st.alignment = ["fill", "center"]
        st.text = content

        if (onGuiCallBack) onGuiCallBack(win)

        var group = win.add("group")
        var applyBtn = group.add("button")
        applyBtn.text = okContent || "确认"
        applyBtn.size = [120, 24]
        applyBtn.alignment = ["right", "center"]
        applyBtn.onClick = function () {
            if (okCallBack) {
                var val = okCallBack(win)
                if (val != undefined) {
                    return val
                }
            }
            return win.close()
        }
        var cancelBtn = group.add("button")
        cancelBtn.text = cancelContent || "取消"
        cancelBtn.size = [120, 24]
        cancelBtn.alignment = ["right", "center"]
        cancelBtn.onClick = function () {
            if (cancelCallBack) {
                var val = cancelCallBack(win)
                if (val != undefined) {
                    return val
                }
            }
            return win.close()
        }

        win.show()
    }
}

//#endregion

//#region 初始化Json
function InitJson() {
    if (typeof Json != "undefined")
        return;

    Json = {}

    var rx_one = /^[\],:{}\s]*$/
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10)
            ? "0" + n
            : n
    }

    function this_value() {
        return this.valueOf()
    }

    if (typeof Date.prototype.toJson !== "function") {

        Date.prototype.toJson = function () {

            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null
        }

        Boolean.prototype.toJson = this_value
        Number.prototype.toJson = this_value
        String.prototype.toJson = this_value
    }

    var gap
    var indent
    var meta
    var rep

    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a]
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + "\""
            : "\"" + string + "\""
    }

    function str(key, holder) {

        // Produce a string from holder[key].

        var i          // The loop counter.
        var k          // The member key.
        var v          // The member value.
        var length
        var mind = gap
        var partial
        var value = holder[key]

        // If the value has a toJson method, call it to obtain a replacement value.

        if (
            value
            && typeof value === "object"
            && typeof value.toJson === "function"
        ) {
            value = value.toJson(key)
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case "string":
                return quote(value)

            case "number":

                // Json numbers must be finite. Encode non-finite numbers as null.

                return (isFinite(value))
                    ? String(value)
                    : "null"

            case "boolean":
            case "null":

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value)

            // If the type is "object", we might be dealing with an object or an array or
            // null.

            case "object":

                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.

                if (!value) {
                    return "null"
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent
                partial = []

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-Json values.

                    length = value.length
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0
                        ? "[]"
                        : gap
                            ? (
                                "[\n"
                                + gap
                                + partial.join(",\n" + gap)
                                + "\n"
                                + mind
                                + "]"
                            )
                            : "[" + partial.join(",") + "]"
                    gap = mind
                    return v
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i]
                            v = str(k, value)
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap)
                                        ? ": "
                                        : ":"
                                ) + v)
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value)
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap)
                                        ? ": "
                                        : ":"
                                ) + v)
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                    ? "{}"
                    : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                        : "{" + partial.join(",") + "}"
                gap = mind
                return v
        }
    }

    // If the Json object does not yet have a stringify method, give it one.
    if (typeof Json.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        }
        Json.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a Json text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i
            gap = ""
            indent = ""

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer
            if (replacer && typeof replacer !== "function" && (
                typeof replacer !== "object"
                || typeof replacer.length !== "number"
            )) {
                throw new Error("Json.stringify")
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", { "": value })
        }
    }

    // If the Json object does not yet have a parse method, give it one.
    if (typeof Json.parse !== "function") {
        Json.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid Json text.

            var j

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k
                var v
                var value = holder[key]
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k)
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text)
            rx_dangerous.lastIndex = 0
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return (
                        "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    )
                })
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-Json patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the Json backslash pairs with "@" (a non-Json character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")")

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({ "": j }, "")
                    : j
            }

            // If the text is not Json parseable, then a SyntaxError is thrown.

            throw new SyntaxError("Json.parse")
        }
    }
}
//#endregion

//#region 识别图片是否一致性（从每张图片中取8*8个像素点，然后根据这些像素点判断rgb是否一致）
var imageHashArray = new Array()
function GetSameImageExportName(doc, baseInfo) {
    var size = baseInfo.baseLayer.getSize()
    var w = size.x
    var h = size.y
    if (doc == null) ShowError("doc is null")
    if (w < 8 || h < 8) ShowError("Image width < 8 || height < 8")

    var w_array = new Array(8)
    var h_array = new Array(8)
    for (var i = 0; i < 8; i++) {
        var tempw = parseInt(w * i / 8.0)
        var temph = parseInt(h * i / 8.0)

        w_array[i] = tempw
        h_array[i] = temph
    }

    var hexColors = new Array(8 * 8)
    for (var i = 0; i < 8; i++) {
        var x = w_array[i]
        for (var j = 0; j < 8; j++) {
            var y = h_array[j]
            var point = [x, y]
            var pointSample = doc.colorSamplers.add(point)
            var str = "none"
            try {
                str = pointSample.color.rgb.hexValue
            } catch (error) {
            }

            hexColors[i * 8 + j] = str
            pointSample.remove()
        }
    }

    for (var i = 0; i < imageHashArray.length; i++) {
        var colors = imageHashArray[i].colors
        var info = imageHashArray[i].info

        if (CheckColorsIsSame(hexColors, colors)) {
            return { canExport: false, exportName: info.baseLayer.getExportName() }
        }
    }

    imageHashArray.push({ colors: hexColors, info: baseInfo })
    return { canExport: true, exportName: baseInfo.baseLayer.getExportName() }
}

function CheckColorsIsSame(colors1, colors2) {
    if (colors1.length != colors2.length) {
        return false
    }

    for (var i = 0; i < colors1.length; i++) {
        if (colors1[i] != colors2[i]) {
            return false
        }
    }

    return true
}

//#endregion

//执行转换
Main()