//图层
Layer = function (doc, layer) {
    BaseLayer.call(this, doc, layer)

    this.sourceBounds = layer.bounds
    this.kind = !layer.kind ? "" : layer.kind.toString()
}

Layer.prototype.toString = function () {
    return JSON.stringify(this)
}

Layer.prototype.toJSON = function () {
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

Layer.prototype.export = function () {
    var folderFullName = fileConfig.getWindowPath()
    //如果是公共图片，则修改导出路径
    if (this.isCommon) {
        folderFullName = fileConfig.getCommonPath()
    }

    ShowMsg("export:" + folderFullName + "\n" + this.toString())

    //更新进度条
    updateProgressBar()

    //获取图片大小
    var size = this.getSize()
    //获取图片导出名
    var exportName = this.getExportName()

    //重复图片名不导出
    if (exportNameDic[exportName] == true) return

    //不是图片的或者是空图层的不导出
    if (!this.info.hasImage || size.x == 0 || size.y == 0) return

    //这里name如果是包含:的话，会导致ps报错，所以直接给定个字符串
    var tempDoc = app.documents.add(Math.max(size.x, 2), Math.max(size.y, 2), this.doc.resolution, "temp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
    activeDocument = this.doc
    var tempLayer = this.source.duplicate(tempDoc, ElementPlacement.INSIDE)
    var pos = this.getPos()
    activeDocument = tempDoc

    var isLock = tempLayer.allLocked
    tempLayer.allLocked = false
    tempLayer.translate(-pos.x, -pos.y)
    tempLayer.allLocked = isLock

    //是否为九宫格切图
    if (this.info.is9Slice) {
        this.info.sliceSprite(tempDoc, tempLayer)
    }

    //如果开启了相同图片检测
    if (config.onlyOneImage) {
        var exportObj = ImageExtensions.GetSameImageExportName(activeDocument, this.info)
        var canExport = exportObj.canExport
        exportName = exportObj.exportName
        if (!canExport) {
            ShowMsg("之前已经导出过相同图片了，不需要再导出了")
            this.info.imageName = exportName
            tempDoc.close(SaveOptions.DONOTSAVECHANGES)
            return;
        }
    }

    //记录导出图片名
    exportNameDic[exportName] = true

    //建立子文件夹
    var subFolderName = this.info.typeName == ComponentType.TEXTURE ? "Textures" : "Sprites"
    var subFolder = new Folder(String.format("{0}/{1}", folderFullName, subFolderName))
    if (!subFolder.exists) subFolder.create()

    //导出图片并关闭文档
    var file = new File(String.format("{0}/{1}/{2}.png", folderFullName, subFolderName, exportName))
    if (this.kind == LayerKind.SMARTOBJECT) {
        var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer")
        executeAction(idnewPlacedLayer, undefined, DialogModes.NO)
        var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
        var desc200 = new ActionDescriptor();
        executeAction(idplacedLayerEditContents, desc200, DialogModes.NO);

        var option = new PNGSaveOptions()
        option.compression = 9
        option.interlaced = false
        activeDocument.saveAs(file, option, true, Extension.UPPERCASE)
        activeDocument.close(SaveOptions.DONOTSAVECHANGES)
        tempDoc.close(SaveOptions.DONOTSAVECHANGES)
    }
    else if (exportImagePlan == 1) {
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