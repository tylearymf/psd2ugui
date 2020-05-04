//面板信息
PanelInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.PANEL

    if(firstPanelName == ""){
        firstPanelName = baseLayer.nodeName
    }
}

PanelInfo.prototype.toJSON = function () {
    return {
        typeName: this.typeName,
        anchorType: this.anchorType,
        symbolType: this.symbolType,
    }
}

PanelInfo.isValid = function (layer) {
    return true
}