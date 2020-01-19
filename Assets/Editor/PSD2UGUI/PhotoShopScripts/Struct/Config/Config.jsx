//配置结构
Config = function (doc, info, layers, exportPath, pivotType, enableFit) {
    this.doc = doc
    this.psdPath = info.path
    //remove .psd
    this.psdName = info.name.substring(0, info.name.length - 4)
    this.psdSize = new Vector2(info.width.value, info.height.value)
    this.layers = layers
    //导出路径
    this.exportPath = exportPath
    //锚点类型
    this.pivotType = pivotType
    //是否开启适配
    this.enableFit = enableFit
    //一个递增值，用于设置导出图片的后缀，以防止图片重名
    this.imageSuffixIndex = 1

    switch (pivotType) {
        case PivotType.TopLeft:
            this.pivot = new Vector2(0, 1)
            break;
        case PivotType.Top:
            this.pivot = new Vector2(0.5, 1)
            break;
        case PivotType.TopRight:
            this.pivot = new Vector2(1, 1)
            break;
        case PivotType.Left:
            this.pivot = new Vector2(0, 0.5)
            break;
        case PivotType.Center:
            this.pivot = new Vector2(0.5, 0.5)
            break;
        case PivotType.Right:
            this.pivot = new Vector2(1, 0.5)
            break;
        case PivotType.BottomLeft:
            this.pivot = new Vector2(0, 0)
            break;
        case PivotType.Bottom:
            this.pivot = new Vector2(0.5, 0)
            break;
        case PivotType.BottomRight:
            this.pivot = new Vector2(1, 0)
            break;
        default:
            this.pivot = new Vector2()
            break;
    }
}
Config.prototype.getPivotValue = function () {
    return this.pivot
}
Config.prototype.getImageSuffixIndex = function () {
    this.imageSuffixIndex += 1
    return this.imageSuffixIndex
}
Config.prototype.toJson = function () {
    return {
        name: this.psdName,
        size: this.psdSize,
        pivot: this.pivot,
        layers: this.layers
    }
}