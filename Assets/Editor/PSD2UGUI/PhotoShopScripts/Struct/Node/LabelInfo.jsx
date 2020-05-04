//文本信息
LabelInfo = function (baseLayer) {
    BaseInfo.call(this, baseLayer)
    this.typeName = ComponentType.LABEL
    this.textItem = this.baseLayer.source.textItem
    this.content = this.textItem.contents
    this.font = this.textItem.font
    this.color = this.textItem.color.rgb.hexValue
    this.labelName = String.format("{0}_{1}_{2}", this.baseLayer.nodeName, this.baseLayer.nodeTypeName, config.getImageSuffixIndex())
    // this.fontSize = this.textItem.size.value
    this.fontSize = ActionDescriptorExtensions.GetTextItemSize()
    this.outlineColor = ""
    this.outlineSize = new Vector2()

    //获取描边效果
    var outlineDescriptor = ActionDescriptorExtensions.GetOutlineDescriptor()
    if (outlineDescriptor) {
        // ActionDescriptorExtensions.ShowAllKeysByDescriptor("label.outline", outlineDescriptor)
        var outLineEnableState = ActionDescriptorExtensions.GetValueByDescriptor(outlineDescriptor, "enab")
        if (outLineEnableState) {
            this.outlineColor = ActionDescriptorExtensions.GetHexColorByDescriptor(outlineDescriptor)
            //在PS里面描边的Size只有一个值，所以导出到Unity后，x、y都是一样的
            var size = ActionDescriptorExtensions.GetValueByDescriptor(outlineDescriptor, "Sz  ")
            this.outlineSize.x = size
            this.outlineSize.y = size
        }
    }

    this.alignment = "CENTER"
    this.direction = "HORIZONTAL"

    try {
        //这里挺奇怪的，就调一下这个属性justification，他妹的就报错了。。。用hasOwnProperty()又说有这个属性，又不能调用。。所以只能trycatch了。
        var justification = this.textItem.justification
        if (justification && justification != "") {
            this.alignment = justification.toString().replace("Justification.", "")
        }
    } catch (error) {
        // ShowError(error.toString())
    }

    try {
        var direction = this.textItem.direction
        if (direction && direction != "") {
            this.direction = direction.toString().replace("Direction.", "")
        }
    } catch (error) {
        // ShowError(error.toString())
    }
}

LabelInfo.prototype.toJSON = function () {
    return {
        typeName: this.typeName,
        content: this.content,
        font: this.font,
        fontSize: this.fontSize,
        color: this.color,
        outlineColor: this.outlineColor,
        outlineSize: this.outlineSize,
        alignment: this.alignment,
        direction: this.direction,
        anchorType: this.anchorType,
        symbolType: this.symbolType,
    }
}

LabelInfo.isValid = function (layer) {
    //文本为空的时候，不支持导出（font属性会报错）
    var content = layer.textItem.contents
    return content != ""
}