
//大图信息
TextureInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.TEXTURE
    this.hasImage = true
    this.isCommon = baseLayer.isCommon
}

//在构造方法后会被调用
TextureInfo.prototype.UpdateMembers = function () {
    this.imageName = this.baseLayer.getExportName()
}

TextureInfo.prototype.toJSON = function () {
    return {
        typeName: this.typeName,
        imageName: this.imageName,
        anchorType: this.anchorType,
        symbolType: this.symbolType,
        isCommon: this.isCommon,
    }
}

TextureInfo.isValid = function (layer) {
    return true
}