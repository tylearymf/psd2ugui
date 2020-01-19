ActionDescriptorExtensions = function () {
}

ActionDescriptorExtensions.ShowAllKeysByDescriptor = function (msg, descriptor) {
    if (!descriptor) {
        descriptor = msg
        msg = ""
    }

    var str = ""
    if (descriptor) {
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

            str += "\n\n"
        }
    }

    if (str != "") {
        ShowMsg(msg + str)
    }
}

//获取选中的图层的所有附加效果
ActionDescriptorExtensions.GetEffectsByActiveLayer = function () {
    var reference = new ActionReference()
    reference.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"))
    var layerDescriptor = executeActionGet(reference)
    var layerEffects = ActionDescriptorExtensions.GetValueByDescriptor(layerDescriptor, "Lefx")
    ActionDescriptorExtensions.ShowAllKeysByDescriptor(layerEffects)
    return layerEffects
}

//获取选中的Layer的描边效果对象
ActionDescriptorExtensions.GetOutlineDescriptor = function () {
    var layerEffects = ActionDescriptorExtensions.GetEffectsByActiveLayer()
    var outlineDescriptor = ActionDescriptorExtensions.GetValueByDescriptor(layerEffects, "FrFX")
    return outlineDescriptor
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

    var typeName = ""
    try {
        typeName = descriptor.getType(id).toString()
    } catch (error) {
        ShowMsg(String.format("key:{0},error:{1}", key, error.toString()))
    }

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