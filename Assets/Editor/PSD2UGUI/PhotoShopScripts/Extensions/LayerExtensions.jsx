LayerExtensions = function () {
}

//ps原生Layer类型转换成自定义Layer类型
LayerExtensions.GetLayerInfos = function (doc, layers) {
    var infos = new Array()
    for (var i = layers.length - 1; i >= 0; i--) {
        var item = layers[i]
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
                    infos.push(layer)
                }
                break;
        }
    }

    return infos
}