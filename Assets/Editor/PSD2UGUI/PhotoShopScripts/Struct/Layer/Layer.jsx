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

    var exportObj = ImageExtensions.GetSameImageExportName(activeDocument, this.info)
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