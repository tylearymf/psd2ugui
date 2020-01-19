//图层抽象结构
BaseLayer = function (doc, layer) {
    this.doc = doc
    this.source = layer
    this.fullName = layer.name
    this.bounds = Vector4.parse(layer.bounds)
    this.layerTypeName = !layer.typename ? "" : layer.typename.toString()
    this.visible = layer.visible
    //保留2位小数
    this.opacity = Math.round(layer.opacity) / 100
    this.nodeName = ""
    this.nodeTypeName = ""
    this.nodeArgs = null

    //已正确命名的图层
    var nameSplits = this.fullName.split("@")
    if (nameSplits.length == 2) {
        var nameSplit = nameSplits[1]
        var nameSplits2 = nameSplit.split("_")
        this.nodeName = nameSplits2[0]
        this.nodeTypeName = nameSplits2[1].toLowerCase()
        //去除前两个数据
        nameSplits2.splice(0, 2)
        this.nodeArgs = nameSplits2
    }

    switch (layerExportType) {
        case LayerExportType.EnableLayer:
        case LayerExportType.AllLayer:
            if (this.nodeName == "") {
                this.nodeName = this.source.name
            }

            if (this.nodeTypeName == "") {
                var sizex = this.bounds.z
                var sizey = this.bounds.w
                if (this.layerTypeName == "ArtLayer") {
                    if (this.source.kind == LayerKind.TEXT) {
                        this.nodeTypeName = ComponentType.Label
                    }
                    else if (sizex < 512 && sizey < 512) {
                        this.nodeTypeName = ComponentType.Sprite
                    }
                    else {
                        this.nodeTypeName = ComponentType.Texture
                    }
                }
                else {
                    this.nodeTypeName = ComponentType.Panel
                }
            }
            break;
    }

    //去除Unity里面的一些不支持的特殊符号
    this.nodeName = this.nodeName.replace(/[\/\?\<\>\\\:\*\|\s]/g, "_")

    this.scale_x = gameScreenWidth / this.doc.width.value
    this.scale_y = gameScreenHeight / this.doc.height.value

    this.isValid = function () {
        switch (layerExportType) {
            case LayerExportType.EnableAndTag:
                return this.nodeName != "" && this.visible
            case LayerExportType.EnableLayer:
                return this.visible
            case LayerExportType.AllLayer:
                return true
            default:
                return false
        }
    }

    this.getPos = function () {
        return new Vector2(this.bounds.x, this.bounds.y)
    }

    this.getUnityPos = function () {
        var pos = this.getPos()
        var size = this.getSize()
        var psdSize = new Vector2(this.doc.width.value, this.doc.height.value)

        //先把轴调转，让其跟unity坐标轴方向一致
        pos.y = pos.y * -1

        switch (pivotType) {
            case PivotType.TopLeft:
                pos.x = pos.x - psdSize.x / 2
                pos.y = psdSize.y / 2 + pos.y
                break;
            case PivotType.Top:
                pos.x = pos.x - psdSize.x / 2 + size.x / 2
                pos.y = psdSize.y / 2 + pos.y
                break;
            case PivotType.TopRight:
                pos.x = pos.x - psdSize.x / 2 + size.x
                pos.y = psdSize.y / 2 + pos.y
                break;
            case PivotType.Left:
                pos.x = pos.x - psdSize.x / 2
                pos.y = psdSize.y / 2 + pos.y - size.y / 2
                break;
            case PivotType.Center:
                pos.x = pos.x - psdSize.x / 2 + size.x / 2
                pos.y = psdSize.y / 2 + pos.y - size.y / 2
                break;
            case PivotType.Right:
                pos.x = pos.x - psdSize.x / 2 + size.x
                pos.y = psdSize.y / 2 + pos.y - size.y / 2
                break;
            case PivotType.BottomLeft:
                pos.x = pos.x - psdSize.x / 2
                pos.y = psdSize.y / 2 + pos.y - size.y
                break;
            case PivotType.Bottom:
                pos.x = pos.x - psdSize.x / 2 + size.x / 2
                pos.y = psdSize.y / 2 + pos.y - size.y
                break;
            case PivotType.BottomRight:
                pos.x = pos.x - psdSize.x / 2 + size.x
                pos.y = psdSize.y / 2 + pos.y - size.y
                break;
            default:
                throw new Error("未实现该锚点:" + pivotType)
        }

        if (config.enableFit) {
            pos.x = pos.x * this.scale_x
            pos.y = pos.y * this.scale_y
        }

        return pos
    }

    this.getUnitySize = function () {
        var size = this.getSize()

        if (config.enableFit) {
            size.x = size.x * this.scale_x
            size.y = size.y * this.scale_y
        }

        return size
    }

    this.getSize = function () {
        return new Vector2(this.bounds.z, this.bounds.w)
    }

    this.getExportName = function () {
        if (this.info.hasImage) {
            return this.info.imageName
        }

        return this.nodeName
    }

    if (this.isValid()) {
        this.info = NodeFactory.GetInfoByTypeName(this)
    }
}