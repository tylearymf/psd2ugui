//窗口信息
WindowInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
}
WindowInfo.prototype.toJson = function () {
    return {
        typeName: ComponentType.Window,
    }
}