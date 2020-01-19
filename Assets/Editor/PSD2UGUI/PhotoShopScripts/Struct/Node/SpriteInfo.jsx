//精灵信息
SpriteInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.hasImage = true
    this.imageName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
}
SpriteInfo.prototype.toJson = function () {
    return {
        typeName: ComponentType.Sprite,
        imageName: this.imageName
    }
}