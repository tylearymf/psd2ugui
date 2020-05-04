LayerExtensions = function () {
}

//ps原生Layer类型转换成自定义Layer类型
LayerExtensions.GetLayerInfos = function (doc, layers) {
    var infos = new Array()
    for (var i = layers.length - 1; i >= 0; i--) {
        var item = layers[i]

        var isContinue = false
        switch (config.layerExportType) {
            case LayerExportType.EnableAndTag:
                isContinue = !item.visible
                break;
            case LayerExportType.EnableLayer:
                isContinue = !item.visible
                break;
            default:
                isContinue = false
                break;
        }
        if (isContinue) continue;

        switch (item.typename) {
            case NameConst.LayerSet:
                {
                    var layerSet = new LayerSet(doc, item)
                    if (!layerSet.isValid()) continue;

                    infos.push(layerSet)
                }
                break;
            case NameConst.ArtLayer:
                {
                    var layer = new Layer(doc, item)
                    if (!layer.isValid()) continue;

                    //栅格化图层
                    if (item.kind != LayerKind.TEXT) {
                        try {
                            item.rasterize(RasterizeType.ENTIRELAYER)
                        } catch (error) {
                        }
                    }

                    infos.push(layer)
                }
                break;
        }
    }

    return infos
}