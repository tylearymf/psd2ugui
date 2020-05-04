//精灵信息
SpriteInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.SPRITE
    this.hasImage = true
    this.isCommon = baseLayer.isCommon
}

//在构造方法后会被调用
SpriteInfo.prototype.UpdateMembers = function () {
    this.imageName = this.baseLayer.getExportName()
}

SpriteInfo.prototype.toJSON = function () {
    return {
        typeName: this.typeName,
        imageName: this.imageName,
        anchorType: this.anchorType,
        symbolType: this.symbolType,
        isCommon: this.isCommon,
    }
}

SpriteInfo.isValid = function (layer) {
    return true
}