
//大图信息
TextureInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.hasImage = true
    this.imageName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
}
TextureInfo.prototype.toJson = function () {
    return {
        typeName: ComponentType.Texture,
        imageName: this.imageName
    }
}