//面板信息
PanelInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.Panel
}

PanelInfo.prototype.toJson = function () {
    return {
        typeName: this.typeName,
        anchorType: this.anchorType
    }
}

PanelInfo.isValid = function (layer) {
    return true
}