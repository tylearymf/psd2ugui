//配置结构
Config = function (doc, info, layers) {
    this.doc = doc
    this.layers = layers

    //一个递增值，用于设置导出图片的后缀，以防止图片重名
    this.imageSuffixIndex = 1

    //是否开启适配
    this.enableFit = info.enableFit
    //相同图片是否只导出一张
    this.onlyOneImage = info.onlyOneImage
    //PSD路径
    this.psdPath = info.psdPath
    //中心枢轴类型
    this.pivotType = info.pivotType
    //导出类型
    this.layerExportType = info.layerExportType
    //PSD尺寸大小
    this.psdSize = info.psdSize
    //游戏画面大小
    this.gameScreenSize = info.gameScreenSize
    //模块名
    this.moduleName = info.moduleName

    switch (this.pivotType) {
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

Config.prototype.toJSON = function () {
    return {
        name: this.moduleName,
        size: this.psdSize,
        pivot: this.pivot,
        layers: this.layers
    }
}