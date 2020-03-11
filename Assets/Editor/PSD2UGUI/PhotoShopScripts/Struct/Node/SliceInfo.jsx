//九宫格切割信息
SliceInfo = function (baseLayer) {
    SpriteInfo.call(this, baseLayer)
    this.typeName = ComponentType.Sprite
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

    if (left < 0 || right < 0 || bottom < 0 || top < 0) {
        ShowError("九宫格信息错误！有效裁剪区域小于0")
    }

    if ((left + right) > size.x || (top + bottom) > size.y) {
        ShowError("九宫格信息错误！裁剪区域大于图片尺寸")
    }

    try {
        //复制四份图层
        var leftTopPartDoc = tempDoc.duplicate("leftTopPart", true)
        var leftTopLayer = null

        var rightTopPartDoc = tempDoc.duplicate("rightTopPart", true)
        var rightTopLayer = null

        var leftBottomPartDoc = tempDoc.duplicate("leftBottomPart", true)
        var leftBottomLayer = null

        var rightBottomPartDoc = tempDoc.duplicate("rightBottomPart", true)
        var rightBottomLayer = null

        //移除原图层
        activeDocument = tempDoc
        tempLayer.remove()

        //开始裁剪
        //crop方法的bounds:left top right bottom，其中四个点都是以左上角为基准点计算的

        //裁剪左上部分
        activeDocument = leftTopPartDoc
        leftTopPartDoc.crop([0, 0, left, top])
        leftTopLayer = leftTopPartDoc.layers[0].duplicate(tempDoc, ElementPlacement.INSIDE)
        leftTopPartDoc.close(SaveOptions.DONOTSAVECHANGES)

        //裁剪右上部分
        activeDocument = rightTopPartDoc
        rightTopPartDoc.crop([size.x - right, 0, size.x, top])
        rightTopLayer = rightTopPartDoc.layers[0].duplicate(tempDoc, ElementPlacement.INSIDE)
        rightTopPartDoc.close(SaveOptions.DONOTSAVECHANGES)

        //裁剪左下部分
        activeDocument = leftBottomPartDoc
        leftBottomPartDoc.crop([0, size.y - bottom, left, size.y])
        leftBottomLayer = leftBottomPartDoc.layers[0].duplicate(tempDoc, ElementPlacement.INSIDE)
        leftBottomPartDoc.close(SaveOptions.DONOTSAVECHANGES)

        //裁剪右下部分
        activeDocument = rightBottomPartDoc
        rightBottomPartDoc.crop([size.x - right, size.y - bottom, size.x, size.y])
        rightBottomLayer = rightBottomPartDoc.layers[0].duplicate(tempDoc, ElementPlacement.INSIDE)
        rightBottomPartDoc.close(SaveOptions.DONOTSAVECHANGES)

        //调整位置
        activeDocument = tempDoc
        var leftTopBounds = leftTopLayer.bounds
        leftTopLayer.translate(-leftTopBounds[0], -leftTopBounds[1])
        var rightTopBounds = rightTopLayer.bounds
        rightTopLayer.translate(-rightTopBounds[0] + left, -rightTopBounds[1])
        var leftBottomBounds = leftBottomLayer.bounds
        leftBottomLayer.translate(-leftBottomBounds[0], -leftBottomBounds[1] + top)
        var rightBottomBounds = rightBottomLayer.bounds
        rightBottomLayer.translate(-rightBottomBounds[0] + left, -rightBottomBounds[1] + top)

        //合并为一个图层
        tempDoc.mergeVisibleLayers()
        tempDoc.trim(TrimType.TRANSPARENT)
    } catch (error) {
        ShowError("导出九宫格图片错误！" + error.toString())
    }
}

SliceInfo.prototype.toJson = function () {
    return {
        typeName: this.typeName,
        imageName: this.imageName,
        border: this.border,
        anchorType: this.anchorType
    }
}

SliceInfo.isValid = function (layer) {
    return true
}