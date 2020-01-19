ImageExtensions = function () {
}

var imageHashArray = new Array()

//别图片是否一致性（从每张图片中取8*8个像素点，然后根据这些像素点判断rgb是否一致）
ImageExtensions.GetSameImageExportName = function (doc, baseInfo) {
    if (config.onlyOneImage) {
        var size = baseInfo.baseLayer.getSize()
        var w = size.x
        var h = size.y
        if (doc == null) ShowError("doc is null")
        if (w < 8 || h < 8) ShowError("Image width < 8 || height < 8")

        var w_array = new Array(8)
        var h_array = new Array(8)
        for (var i = 0; i < 8; i++) {
            var tempw = parseInt(w * i / 8.0)
            var temph = parseInt(h * i / 8.0)

            w_array[i] = tempw
            h_array[i] = temph
        }

        var hexColors = new Array(8 * 8)
        for (var i = 0; i < 8; i++) {
            var x = w_array[i]
            for (var j = 0; j < 8; j++) {
                var y = h_array[j]
                var point = [x, y]
                var pointSample = doc.colorSamplers.add(point)
                var str = "none"
                try {
                    str = pointSample.color.rgb.hexValue
                } catch (error) {
                }

                hexColors[i * 8 + j] = str
                pointSample.remove()
            }
        }

        for (var i = 0; i < imageHashArray.length; i++) {
            var colors = imageHashArray[i].colors
            var info = imageHashArray[i].info

            if (ImageExtensions.CheckColorsIsSame(hexColors, colors)) {
                return { canExport: false, exportName: info.baseLayer.getExportName() }
            }
        }

        imageHashArray.push({ colors: hexColors, info: baseInfo })
    }

    return { canExport: true, exportName: baseInfo.baseLayer.getExportName() }
}

ImageExtensions.CheckColorsIsSame = function (colors1, colors2) {
    if (colors1.length != colors2.length) {
        return false
    }

    for (var i = 0; i < colors1.length; i++) {
        if (colors1[i] != colors2[i]) {
            return false
        }
    }

    return true
}