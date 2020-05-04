//窗口信息
WindowInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.WINDOW

    if (firstWindowName == "") {
        firstWindowName = baseLayer.nodeName
    }
}

WindowInfo.prototype.toJSON = function () {
    return {
        typeName: this.typeName,
        anchorType: this.anchorType
    }
}

WindowInfo.isValid = function (layer) {
    return true
}