//面板信息
PanelInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
}

PanelInfo.prototype.toJson = function () {
    return {
        typeName: ComponentType.Panel,
    }
}