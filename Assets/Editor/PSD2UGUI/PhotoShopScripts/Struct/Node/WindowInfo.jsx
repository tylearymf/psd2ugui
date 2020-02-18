//窗口信息
WindowInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.Window
}

WindowInfo.prototype.toJson = function () {
    return {
        typeName: this.typeName,
        anchorType: this.anchorType
    }
}

WindowInfo.isValid = function (layer) {
    return true
}