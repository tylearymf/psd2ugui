//按钮信息
ButtonInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.BUTTON
    this.isCommon = baseLayer.isCommon

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
    }
}

//在构造方法后会被调用
ButtonInfo.prototype.UpdateMembers = function () {
    this.imageName = this.baseLayer.getExportName()
}

ButtonInfo.prototype.toJSON = function () {
    return {
        typeName: this.typeName,
        imageName: this.imageName,
        btnType: this.btnType,
        anchorType: this.anchorType,
        symbolType: this.symbolType,
        isCommon: this.isCommon,
    }
}

ButtonInfo.isValid = function (layer) {
    return true
}