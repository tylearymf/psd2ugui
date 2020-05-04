ActionDescriptorExtensions = function () {
}

// msg为自定义消息，必须设置，否则不显示
ActionDescriptorExtensions.ShowAllKeysByDescriptor = function (msg, descriptor) {
    if (!showDialog || !descriptor || msg == undefined) {
        return
    }

    var str = ""
    str += String.format("count:{0}\n", descriptor.count.toString())
    var typeName = descriptor.typename
    for (var i = 0; i < descriptor.count; i++) {
        if (typeName == "ActionDescriptor") {
            var id = descriptor.getKey(i)
            str += String.format("{0}. ActionDescriptor ID:{1}, charID:{2}, stringID:{3}, type:{4}", i, id, typeIDToCharID(id), typeIDToStringID(id), descriptor.getType(id))
        }
        else if (typeName == "ActionReference") {
            var id = descriptor.getReference(i).getIndex()
            str += String.format("{0}. ActionReference ID:{1}", i, id)
        }
        else if (typeName == "ActionList") {
            var id = descriptor.getType(i)
            str += String.format("{0}. ActionList ID:{0}", i, id)
        }

        str += "\n"
    }

    if (str != "") {
        msg = String.format("customMsg:{0} descriptorMsg:{1}", msg, str)
        $.writeln(msg)
        ShowMsg(msg)
    }
}

//获取选中的图层的Descriptor
ActionDescriptorExtensions.GetLayerDescriptor = function (msg) {
    var reference = new ActionReference()
    reference.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"))
    var layerDescriptor = executeActionGet(reference)
    ActionDescriptorExtensions.ShowAllKeysByDescriptor(msg, layerDescriptor)
    return layerDescriptor
}

//获取选中的图层的所有附加效果
ActionDescriptorExtensions.GetEffectsByActiveLayer = function (msg) {
    var layerDescriptor = ActionDescriptorExtensions.GetLayerDescriptor()
    var effectDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(layerDescriptor, "Lefx")
    ActionDescriptorExtensions.ShowAllKeysByDescriptor(msg, effectDescriptor)
    return effectDescriptor
}

//获取选中的Layer的描边效果对象
ActionDescriptorExtensions.GetOutlineDescriptor = function (msg) {
    var layerEffects = ActionDescriptorExtensions.GetEffectsByActiveLayer()
    var outlineDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(layerEffects, "FrFX")
    ActionDescriptorExtensions.ShowAllKeysByDescriptor(msg, outlineDescriptor)
    return outlineDescriptor
}

//获取选中的文本的size（textItem.size返回的值不准确）
ActionDescriptorExtensions.GetTextItemSize = function (msg) {
    var layerDescriptor = ActionDescriptorExtensions.GetLayerDescriptor()
    var txtDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(layerDescriptor, "Txt ")
    var txttDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(txtDescriptor, "Txtt")
    var element = txttDescriptor.getObjectValue(0)
    var txtsDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(element, "TxtS")
    ActionDescriptorExtensions.ShowAllKeysByDescriptor(msg, txtsDescriptor)
    var size = ActionDescriptorExtensions.GetValueByDescriptor(txtsDescriptor, "impliedFontSize")
    size = Math.round(size + 0.5)

    return size
}

//根据Descriptor的Key获取Value
ActionDescriptorExtensions.GetValueByDescriptor = function (descriptor, key) {
    if (descriptor == null || descriptor.typename != "ActionDescriptor") return null

    var id = 0
    if (key.length == 4) {
        id = charIDToTypeID(key)
    }
    else {
        id = stringIDToTypeID(key)
    }

    if (!descriptor.hasKey(id)) {
        return null
    }

    var typeName = descriptor.getType(id).toString()
    switch (typeName) {
        case "DescValueType.BOOLEANTYPE":
            return descriptor.getBoolean(id)
        case "DescValueType.CLASSTYPE":
            return descriptor.getClass(id)
        case "DescValueType.DOUBLETYPE":
            return descriptor.getDouble(id)
        case "DescValueType.ENUMERATEDTYPE":
            return typeIDToCharID(descriptor.getEnumerationValue(id))
        case "DescValueType.INTEGERTYPE":
            return descriptor.getInteger(id)
        case "DescValueType.LISTTYPE":
            return descriptor.getList(id)
        case "DescValueType.OBJECTTYPE":
            return descriptor.getObjectValue(id)
        case "DescValueType.REFERENCETYPE":
            return descriptor.getReference(id)
        case "DescValueType.STRINGTYPE":
            return descriptor.getString(id)
        case "DescValueType.UNITDOUBLE":
            return descriptor.getUnitDoubleValue(id)
        case "DescValueType.ALIASTYPE":
            return descriptor.getPath(id)
        case "DescValueType.RAWTYPE":
            return descriptor.getData(id)
        default:
            return null
    }
}

//获取16进制RGB值
ActionDescriptorExtensions.GetHexColorByDescriptor = function (descriptor) {
    var colorDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(descriptor, "Clr ")
    var redValue = ActionDescriptorExtensions.GetValueByDescriptor(colorDescriptor, "Rd  ")
    var greenValue = ActionDescriptorExtensions.GetValueByDescriptor(colorDescriptor, "Grn ")
    var blueValue = ActionDescriptorExtensions.GetValueByDescriptor(colorDescriptor, "Bl  ")
    var opacityValue = ActionDescriptorExtensions.GetValueByDescriptor(descriptor, "Opct") * 2.55
    var hexColor = RGBToHex(redValue, greenValue, blueValue, opacityValue)

    return hexColor
}