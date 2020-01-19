//按钮信息
ButtonInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)

    //两种模式，
    //·按钮只是容器，图片或者文本在该Layer的子Layer中
    //·按钮自身是图片的，
    if (baseLayer.layerTypeName == NameConst.LayerSet) {
        this.hasImage = false
        this.btnType = "Container"
    }
    else {
        this.hasImage = true
        this.btnType = "Self"
        this.imageName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
    }
}

ButtonInfo.prototype.toJson = function () {
    return {
        typeName: ComponentType.Button,
        imageName: this.imageName,
        btnType: this.btnType
    }
}