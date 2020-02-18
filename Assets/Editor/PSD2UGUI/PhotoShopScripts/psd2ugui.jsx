//software: https://helpx.adobe.com/download-install/kb/creative-cloud-apps-download.html
//json: https://github.com/tylearymf/Json-js/blob/master/json2.js
//api1: https://www.adobe.com/devnet/photoshop/scripting.html ☆☆☆☆☆☆
//api2: https://www.indesignjs.de/extendscriptAPI/indesign10/ ☆☆☆☆☆
//api3: http://nullice.com/archives/1790 ☆☆☆☆
//api4: http://jongware.mit.edu/Js/index_1.html ☆☆☆
//api5: Adobe ExtendScript Toolkit CC --> Help --> Object Model Viewer ☆☆☆☆☆
//api6: Photoshop_charID_stringID_List(https://gist.github.com/tylearymf/546e7f46069f2858fda7da148d9afc33) ☆☆☆☆☆
//      ActionDescriptor(http://objjob.phrogz.net/pshop/object/323)
//      ActionDescriptor(http://jongware.mit.edu/pscs5js_html/psjscs5/pc_ActionDescriptor.html)


//#region 引用其他js文件

//@include "3rd/JSON.jsx"
//@include "Tools/MyWindow.jsx"
//@include "Factories/NodeFactory.jsx"
//@include "Struct/ComponentType.jsx"

//@include "Extensions/ActionDescriptorExtensions.jsx"
//@include "Extensions/Extensions.jsx"
//@include "Extensions/ImageExtensions.jsx"
//@include "Extensions/LayerExtensions.jsx"
//@include "Extensions/UIExtensions.jsx"

//@include "Struct/Config/Config.jsx"
//@include "Struct/Config/FileConfig.jsx"

//@include "Struct/Custom/LayerExportType.jsx"
//@include "Struct/Custom/NameConst.jsx"

//@include "Struct/Layer/BaseLayer.jsx"
//@include "Struct/Layer/Layer.jsx"
//@include "Struct/Layer/LayerSet.jsx"

//@include "Struct/Node/BaseInfo.jsx"
//@include "Struct/Node/LabelInfo.jsx"
//@include "Struct/Node/SpriteInfo.jsx"
//@include "Struct/Node/SliceInfo.jsx"
//@include "Struct/Node/TextureInfo.jsx"
//@include "Struct/Node/ButtonInfo.jsx"
//@include "Struct/Node/PanelInfo.jsx"
//@include "Struct/Node/WindowInfo.jsx"

//@include "Struct/Unity/PivotType.jsx"
//@include "Struct/Unity/AnchorType.jsx"
//@include "Struct/Unity/Vector2.jsx"
//@include "Struct/Unity/Vector3.jsx"
//@include "Struct/Unity/Vector4.jsx"

//#endregion 引用其他js文件

//#region 调试参数
//0 (no debugging), 1 (break on runtime errors), or 2 (full debug mode).
//如果要调试就设置为2，然后出现异常的时候，ps会自动打开Adobe ExtendScript Toolkit CC并挂起ps
$.level = 2
//是否打开所有提示
var showDialog = false
//是否捕获异常
var istrycatch = $.level != 2
//#endregion 调试参数

//#region 可修改的字段
//游戏分辨率设置
var gameScreenWidth = 1920
var gameScreenHeight = 1080
//导出图片方案
var exportImagePlan = 1
//#endregion 可修改的字段

//#region 公开可访问的字段
//配置信息
var config
//主文档
var mainDoc
//#endregion 公开可访问的字段

//#region 私有字段
//进度条相关
var progressBar
var progressIndex
var progressTotalCount
//#endregion 私有字段

//执行转换
Main()

//入口
function Main() {
    if (app.documents.length <= 0) {
        ShowError("document is null!")
    }

    if (activeDocument.saved) {
        ShowMsg("文档路径：" + activeDocument.path)
    }
    else {
        ShowError("psd尚未保存，请保存后再操作")
    }

    //私有成员
    var privateVariables = {
        //是否开启适配
        enableFit: false,
        //相同图片是否只导出一张
        onlyOneImage: false,
        //PSD名字
        psdName: activeDocument.name,
        //PSD路径
        psdPath: activeDocument.path,
        //导出路径
        exportPath: null,
        //中心枢轴类型 默认为居中
        pivotType: PivotType.Center,
        //导出类型 默认是只导出标记并显示的图层
        layerExportType: LayerExportType.EnableAndTag,
        //PSD尺寸大小
        psdSize: new Vector2(activeDocument.width.value, activeDocument.height.value),
        //游戏画面大小
        gameScreenSize: new Vector2(gameScreenWidth, gameScreenHeight),
    }

    var resolutionStr = String.format("     当前PSD分辨率：{0}，当前配置的游戏分辨率: {1}", privateVariables.psdSize, privateVariables.gameScreenSize)
    new MyWindow("提示", "PSD导出UGUI配置" + resolutionStr, function (win) {
        //开始导出时，禁用掉界面点击
        //这里如果在导出中Ps出现异常情况，则关闭不了这个窗口了，直到杀进程再开，所以这个先保留默认
        // win.enabled = false

        if (istrycatch) {
            try {
                StartExport(activeDocument, privateVariables)
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
            finally {
                if (mainDoc) {
                    mainDoc.close(SaveOptions.DONOTSAVECHANGES)
                }
            }
        }
        else {
            StartExport(activeDocument, privateVariables)

            if (mainDoc) {
                mainDoc.close(SaveOptions.DONOTSAVECHANGES)
            }
        }

        return win.close()
    }, function (win) {

        return win.close()
    }, function (win) {

        //导出进度
        UIExtensions.AddGroup(win, "导出进度", function (group) {
            progressBar = group.add("progressbar")
            progressBar.value = 0
        })

        //导出路径
        UIExtensions.AddGroup(win, "导出路径", function (group) {
            var etext = group.add("editText")
            var docName = RemoveUnityNotSupportSymbol(privateVariables.psdName)
            var docPath = privateVariables.psdPath
            privateVariables.exportPath = String.format("{0}/../PsdConfig/PSDConfig_{1}", docPath, docName.substring(0, docName.length - 4))
            etext.text = privateVariables.exportPath
            etext.onChange = function () {
                privateVariables.exportPath = etext.text
            }
        })

        //导出类型
        UIExtensions.AddGroup(win, "导出类型", function (group) {
            UIExtensions.AddDropDownList(group, LayerExportType, LayerExportType.EnableAndTag, function (drop) {
                privateVariables.layerExportType = drop.selection.text
                ShowMsg("layerExportType:" + privateVariables.layerExportType)
            })
        })

        //中心枢轴类型
        UIExtensions.AddGroup(win, "Pivot类型", function (group) {
            UIExtensions.AddDropDownList(group, PivotType, PivotType.Center, function (drop) {
                privateVariables.pivotType = drop.selection.text
                ShowMsg("pivotType:" + privateVariables.pivotType)
            })
        })

        //是否开启适配选项
        UIExtensions.AddGroup(win, "是否开启适配", function (group) {
            var checkbox = group.add("checkbox")
            checkbox.value = privateVariables.enableFit
            checkbox.onClick = function () {
                privateVariables.enableFit = checkbox.value
                ShowMsg("enableFit:" + privateVariables.enableFit)
            }
            group.enabled = privateVariables.psdSize.toString() != privateVariables.gameScreenSize.toString()
        })

        //相同图片是否只导出一张
        UIExtensions.AddGroup(win, "相同图片是否只导出一张(如果图片过多，此过程会很慢)", function (group) {
            var checkbox = group.add("checkbox")
            checkbox.value = privateVariables.onlyOneImage
            checkbox.onClick = function () {
                privateVariables.onlyOneImage = checkbox.value
                ShowMsg("onlyOneImage:" + privateVariables.onlyOneImage)
            }
        })
    })
}

//开始导出
function StartExport(doc, info) {
    //复制一份psd文档
    var sourceDoc = doc
    mainDoc = doc.duplicate("temp", false)
    doc = mainDoc
    activeDocument = mainDoc

    //检查残留文件夹
    config = new Config(doc, info, null)
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

    //在你打开psd后，如果没选中任意一个Layer时，有时候导出会报错，所以就有了下面这块奇葩的代码
    //开始的时候需要选中一个Layer，而且还不能是当前选中的Layer，还有个当activeLayer设置后，会自动把该Layer的visible设置为true
    if (doc.layers.length > 0) {
        var tempActiveLayer = doc.activeLayer
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
    var infos = LayerExtensions.GetLayerInfos(doc, doc.layers)
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

//更新导出进度
function updateProgressBar() {
    progressBar.value = (progressIndex / progressTotalCount) * 100.0
    progressIndex = progressIndex + 1
}