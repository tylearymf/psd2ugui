NodeFactory = function () {
}

//根据节点类型名获取类型
NodeFactory.GetInfoByTypeName = function (baseLayer) {
    var nodeTypeName = baseLayer.nodeTypeName
    mainDoc.activeLayer = baseLayer.source
    if (nodeTypeName == ComponentType.LABEL) {
        return new LabelInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.SPRITE) {
        return new SpriteInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.SLICE) {
        return new SliceInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.TEXTURE) {
        return new TextureInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.BUTTON) {
        return new ButtonInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.PANEL) {
        return new PanelInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.WINDOW) {
        return new WindowInfo(baseLayer)
    }

    ShowError("没有实现该节点类型：" + nodeTypeName)
}