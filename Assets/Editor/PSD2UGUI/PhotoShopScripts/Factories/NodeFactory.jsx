NodeFactory = function () {
}

//根据节点类型名获取类型
NodeFactory.GetInfoByTypeName = function (baseLayer) {
    var nodeTypeName = baseLayer.nodeTypeName
    mainDoc.activeLayer = baseLayer.source
    if (nodeTypeName == ComponentType.Label) {
        return new LabelInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.Sprite) {
        return new SpriteInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.Slice) {
        return new SliceInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.Texture) {
        return new TextureInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.Button) {
        return new ButtonInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.Panel) {
        return new PanelInfo(baseLayer)
    }
    else if (nodeTypeName == ComponentType.Window) {
        return new WindowInfo(baseLayer)
    }

    ShowError("没有实现该节点类型：" + nodeTypeName)
}