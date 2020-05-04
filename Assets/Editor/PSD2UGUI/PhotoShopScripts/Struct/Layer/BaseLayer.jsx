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
    var nameSplits = this.fullName.split(/@|#/)
    //如果是图片的，则firstName为图片导出名
    this.firstName = nameSplits.length == 2 ? nameSplits[0] : ""
    this.secondName = nameSplits.length == 2 ? nameSplits[1] : ""
    //是否为公共图片
    this.isCommon = this.firstName.indexOf("common_") == 0
    this.firstName = RemoveUnityNotSupportSymbol(this.firstName)

    if (config.layerExportType == LayerExportType.EnableAndTag) {
        if (this.firstName == "" || this.secondName == "") {
            doc.activeLayer = layer
            ShowError(String.format("该图层 \"{0}\" 命名有问题.\n图层已被选中，请修正.", layer.name))
        }
    }

    if (this.fullName.indexOf("@") != -1) {
        this.symbolType = "@"
    }
    else if (this.fullName.indexOf("#") != -1) {
        this.symbolType = "#"
    }

    if (this.secondName != "") {
        var nodeArguments = this.secondName.split("_")
        this.nodeName = nodeArguments[0]
        if (nodeArguments.length > 1) {
            this.nodeTypeName = nodeArguments[1]
        }
        var spliceCount = 2

        this.anchorType = ""
        if (nodeArguments.length > 2) {
            var tempAnchorType = nodeArguments[2]
            for (var key in AnchorType) {
                if (AnchorType[key] == tempAnchorType) {
                    this.anchorType = key.toString()
                    break;
                }
            }

            if (this.anchorType != "") {
                spliceCount = 3
            }
        }

        //去除前x个数据
        nodeArguments.splice(0, spliceCount)
        this.nodeArgs = nodeArguments
    }

    switch (config.layerExportType) {
        case LayerExportType.EnableLayer:
        case LayerExportType.AllLayer:
            if (this.nodeName == "") {
                this.nodeName = this.source.name
            }

            if (this.nodeTypeName == "") {
                var sizex = this.bounds.z
                var sizey = this.bounds.w
                if (this.layerTypeName == NameConst.ArtLayer) {
                    if (this.source.kind == LayerKind.TEXT) {
                        this.nodeTypeName = ComponentType.LABEL
                    }
                    else if (sizex < 512 && sizey < 512) {
                        this.nodeTypeName = ComponentType.SPRITE
                    }
                    else {
                        this.nodeTypeName = ComponentType.TEXTURE
                    }
                }
                else {
                    this.nodeTypeName = ComponentType.PANEL
                }
            }
            break;
    }

    this.nodeName = RemoveUnityNotSupportSymbol(this.nodeName)

    this.scale_x = gameScreenWidth / this.doc.width.value
    this.scale_y = gameScreenHeight / this.doc.height.value

    this.isValid = function () {
        var result = false

        switch (config.layerExportType) {
            case LayerExportType.EnableAndTag:
                result |= this.nodeName != "" && this.visible
                break;
            case LayerExportType.EnableLayer:
                result |= this.visible
                break;
            case LayerExportType.AllLayer:
                result |= true
                break;
            default:
                ShowError("导出类型 未实现：" + config.layerExportType)
                break;
        }

        if (result) {
            switch (this.nodeTypeName) {
                case ComponentType.BUTTON:
                    result &= ButtonInfo.isValid(this.source)
                    break;
                case ComponentType.LABEL:
                    result &= LabelInfo.isValid(this.source)
                    break;
                case ComponentType.PANEL:
                    result &= PanelInfo.isValid(this.source)
                    break;
                case ComponentType.SLICE:
                    result &= SliceInfo.isValid(this.source)
                    break;
                case ComponentType.SPRITE:
                    result &= SpriteInfo.isValid(this.source)
                    break;
                case ComponentType.TEXTURE:
                    result &= TextureInfo.isValid(this.source)
                    break;
                case ComponentType.WINDOW:
                    result &= WindowInfo.isValid(this.source)
                    break;
                default:
                    doc.activeLayer = layer
                    ShowError(String.format("节点类型 未实现：'{0}'.\n图层已被选中，请修正.", this.nodeTypeName))
                    break;
            }
        }

        return result
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

        var pivotType = config.pivotType
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
                ShowError(String.format("锚点类型 未实现:{0}", pivotType))
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

    //获取图片导出名
    this.getExportName = function () {
        if (this.info.hasImage) {
            //这里的firstName为“标识符中的第一个字符串”
            if (this.firstName != "") {
                if (this.isCommon) {
                    return this.firstName
                }
                else {
                    return String.format("{0}_{1}", config.moduleName, this.firstName)
                }
            }

            return this.imageName
        }

        //这里的nodeName为“图层名”
        return this.nodeName
    }

    if (this.isValid()) {
        this.info = NodeFactory.GetInfoByTypeName(this)
        if (this.info.hasImage) {
            this.imageName = String.format("{0}_{1}_{2}", this.nodeName, this.nodeTypeName, config.getImageSuffixIndex())
        }

        if (this.info["UpdateMembers"] != null) {
            this.info.UpdateMembers()
        }
    }
}