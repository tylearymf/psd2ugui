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