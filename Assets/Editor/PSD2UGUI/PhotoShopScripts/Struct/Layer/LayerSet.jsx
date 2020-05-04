//组
LayerSet = function (doc, layer) {
    BaseLayer.call(this, doc, layer)

    this.sourceLayers = layer.layers

    if(this.isValid()){
        this.layers = LayerExtensions.GetLayerInfos(doc, this.sourceLayers)
    }
}

LayerSet.prototype.toString = function () {
    return JSON.stringify(this)
}

LayerSet.prototype.toJSON = function () {
    return {
        name: this.nodeName,
        layerTypeName: this.layerTypeName,
        nodeTypeName: this.nodeTypeName,
        nodeArgs: this.nodeArgs,
        pos: this.getUnityPos(),
        size: this.getUnitySize(),
        opacity: this.opacity,
        info: this.info,
        layers: this.layers,
    }
}

LayerSet.prototype.export = function (folderFullName) {
    for (var i = this.layers.length - 1; i >= 0; i--) {
        var layer = this.layers[i]
        layer.export(folderFullName)
    }
}